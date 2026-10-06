import { useEffect, useRef, useState, type Dispatch, type SetStateAction } from 'react'
import type { PartyMember } from '../mock'

import { hasEvolutionAt } from '../game/evolution'
import { getLevel, xpForLevel } from '../game/leveling'
import { healSeconds, staminaSeconds, type StudyPlan } from '../game/stamina'

export interface SessionResult {
  studiedSec: number
  earnedSec: number // studied while at least one Pokémon was still standing
}

export type SessionStatus = 'idle' | 'running' | 'paused' | 'exhausted' | 'break'

// Per-Pokémon settings, rerolled every session so a different Pokémon tires first each time
interface Drain {
  bias: number // baseline speed: how much faster than the slowest this Pokémon tires
  mult: number // current burst/lull multiplier
  changeAt: number // studied seconds at which mult is rerolled
  xpMult: number // current XP burst multiplier (a lull is close to zero)
  xpChangeAt: number
  startXp: number // XP when the session began, to cap the levels gained
}

interface Sim {
  status: SessionStatus
  last: number // timestamp of the previous tick
  studied: number // seconds studied this session
  earned: number // of those, seconds with a Pokémon still standing
  fatigue: number // seconds of studying since the party was last fully healed
  stamina: number // fatigue seconds that fully drain the party
  limit: number | null // studied seconds at which a timer session ends by itself
  segLen: number // studied seconds per block on a custom plan (0 = no scheduled breaks)
  nextBreakAt: number
  breaksLeft: number
  breakSec: number // length of each scheduled break
  breakLeft: number // seconds left in the break in progress
  block: number // current study block, from 1
  blocks: number
  healRate: number // fraction of full fatigue recovered per second while resting
  drains: Map<number, Drain>
}

export interface StudySession {
  status: SessionStatus
  studiedSec: number
  fatigue: number // 0 (fresh) to 1 (fully drained)
  restSec: number // rest left until the party is fully healed
  staminaSec: number
  canStart: boolean
  limitSec: number | null
  breakLeftSec: number
  block: number
  blocks: number
  start: (plan: StudyPlan) => void
  pause: () => void
  resume: () => void
  skipBreak: () => void
  end: () => SessionResult
}

const TICK_MS = 1000
// Pace is capped at 3 levels per hour of studying, delivered in random bursts and lulls per Pokémon
const MAX_LEVELS_PER_HOUR = 3
const BASE_LEVELS_PER_HOUR = 3.4

export function useStudySession(
  party: PartyMember[],
  setParty: Dispatch<SetStateAction<PartyMember[]>>,
  levelCap: number,
  onTimerDone: (result: SessionResult) => void
): StudySession {
  const sim = useRef<Sim>({
    status: 'idle',
    last: 0,
    studied: 0,
    earned: 0,
    fatigue: 0,
    stamina: staminaSeconds({ kind: 'stopwatch' }),
    limit: null,
    segLen: 0,
    nextBreakAt: 0,
    breaksLeft: 0,
    breakSec: 0,
    breakLeft: 0,
    block: 1,
    blocks: 1,
    healRate: 0,
    drains: new Map()
  })
  const partyRef = useRef(party)
  const doneRef = useRef(onTimerDone)
  const capRef = useRef(levelCap)
  const [snap, setSnap] = useState({
    status: 'idle' as SessionStatus,
    studied: 0,
    fatigue: 0,
    stamina: staminaSeconds({ kind: 'stopwatch' }),
    limit: null as number | null,
    healRate: 0,
    breakLeft: 0,
    block: 1,
    blocks: 1
  })

  useEffect(() => {
    partyRef.current = party
    doneRef.current = onTimerDone
    capRef.current = levelCap
  })

  function publish(): void {
    const s = sim.current
    setSnap({
      status: s.status,
      studied: s.studied,
      fatigue: s.fatigue,
      stamina: s.stamina,
      limit: s.limit,
      healRate: s.healRate,
      breakLeft: s.breakLeft,
      block: s.block,
      blocks: s.blocks
    })
  }

  function tick(): void {
    const s = sim.current
    const now = Date.now()
    const dt = Math.min((now - s.last) / 1000, 60)
    s.last = now

    if (s.status === 'running') {
      s.studied += dt
      if (partyRef.current.some((m) => m.hp > 0.5)) s.earned += dt
      s.fatigue = Math.min(s.stamina, s.fatigue + dt)
      const level = s.fatigue / s.stamina
      const dLevel = dt / s.stamina

      const rates = new Map<number, { drain: number; xp: number; startXp: number }>()
      for (const m of partyRef.current) {
        let d = s.drains.get(m.dexId)
        if (!d) {
          d = {
            bias: 1 + Math.random() * 0.7,
            mult: 0.5 + Math.random(),
            changeAt: 0,
            xpMult: 1,
            xpChangeAt: 0,
            startXp: m.xp
          }
          s.drains.set(m.dexId, d)
        }
        if (s.studied >= d.changeAt) {
          d.mult = 0.2 + Math.random() * 1.6
          d.changeAt = s.studied + 15 + Math.random() * 30
        }
        if (s.studied >= d.xpChangeAt) {
          const roll = Math.random()
          d.xpMult = roll < 0.3 ? 0.05 : roll < 0.8 ? 1 : 3
          d.xpChangeAt = s.studied + 8 + Math.random() * 22
        }
        rates.set(m.dexId, { drain: d.bias * d.mult, xp: d.xpMult, startXp: d.startXp })
      }

      const cap = capRef.current
      const capXp = xpForLevel(cap)
      const allowance = (MAX_LEVELS_PER_HOUR * s.studied) / 3600 // levels each Pokémon may have gained so far

      setParty((prev) =>
        prev.map((m) => {
          const rate = rates.get(m.dexId) ?? { drain: 1, xp: 1, startXp: m.xp }
          // The slowest Pokémon can't stay above what's left of the party's stamina
          const ratio = Math.max(0, Math.min(m.hp / m.maxHp - dLevel * rate.drain, 1 - level))

          // Only Pokémon still standing earn XP, never past the level cap or the hourly limit
          let xp = m.xp
          const gained = Math.cbrt(xp) - Math.cbrt(rate.startXp)
          if (ratio > 0 && getLevel(xp) < cap && gained < allowance) {
            const levelNow = Math.cbrt(xp) + (BASE_LEVELS_PER_HOUR / 3600) * dt * rate.xp
            xp = Math.min(levelNow ** 3, capXp, (Math.cbrt(rate.startXp) + allowance) ** 3)
          }

          // Levelling up into an evolution level makes it evolvable. It is offered when the session ends,
          // and stays available from the party and PC if the player declines.
          const levelAfter = getLevel(xp)
          const ready =
            !m.canEvolve && levelAfter > getLevel(m.xp) && hasEvolutionAt(m.dexId, levelAfter)
          return {
            ...m,
            hp: ratio * m.maxHp,
            xp,
            ...(ready ? { canEvolve: true, evoNew: true } : {})
          }
        })
      )

      if (s.limit !== null && s.studied >= s.limit) {
        // Timer ran out: close the session and start resting
        const total = s.limit
        s.healRate = 1 / healSeconds(total)
        const result = { studiedSec: total, earnedSec: Math.min(s.earned, total) }
        s.studied = 0
        s.earned = 0
        s.status = 'idle'
        doneRef.current(result)
      } else if (level >= 1) {
        s.status = 'exhausted'
        s.healRate = 1 / healSeconds(s.studied)
      } else if (s.segLen > 0 && s.breaksLeft > 0 && s.studied >= s.nextBreakAt) {
        // End of a study block on a custom plan: start the scheduled break
        s.status = 'break'
        s.breakLeft = s.breakSec
        s.healRate = 1 / healSeconds(s.studied)
        s.nextBreakAt += s.segLen
        s.breaksLeft--
        s.block++
      }
    } else {
      if (s.status === 'break') {
        s.breakLeft -= dt
        if (s.breakLeft <= 0) {
          s.breakLeft = 0
          s.status = 'running'
        }
      }
      if (s.fatigue > 0) {
        const before = s.fatigue / s.stamina
        const after = Math.max(0, before - s.healRate * dt)
        const share = (before - after) / before // portion of the remaining missing HP to restore
        s.fatigue = after * s.stamina
        setParty((prev) =>
          prev.map((m) => {
            const ratio = m.hp / m.maxHp
            return { ...m, hp: (after === 0 ? 1 : ratio + (1 - ratio) * share) * m.maxHp }
          })
        )
        if (after === 0 && s.status === 'exhausted') s.status = 'paused'
      }
    }

    publish()
  }

  const tickRef = useRef(tick)
  useEffect(() => {
    tickRef.current = tick
  })

  useEffect(() => {
    sim.current.last = Date.now()
    const id = setInterval(() => tickRef.current(), TICK_MS)
    return () => clearInterval(id)
  }, [])

  function start(plan: StudyPlan): void {
    const s = sim.current
    if (s.fatigue >= s.stamina) return
    const stamina = staminaSeconds(plan)
    s.fatigue = (s.fatigue / s.stamina) * stamina // keep the same fraction under the new plan
    s.stamina = stamina
    s.limit = plan.kind === 'stopwatch' ? null : plan.totalMin * 60
    const breaks = plan.kind === 'custom' ? plan.breaks : 0
    s.blocks = breaks + 1
    s.block = 1
    s.breaksLeft = breaks
    s.breakSec = plan.kind === 'custom' ? plan.breakMin * 60 : 0
    s.segLen = breaks > 0 && s.limit !== null ? s.limit / (breaks + 1) : 0
    s.nextBreakAt = s.segLen
    s.breakLeft = 0
    s.studied = 0
    s.earned = 0
    s.drains.clear()
    s.last = Date.now()
    s.status = 'running'
    publish()
  }

  function pause(): void {
    const s = sim.current
    if (s.status !== 'running') return
    s.healRate = 1 / healSeconds(s.studied)
    s.status = 'paused'
    publish()
  }

  function resume(): void {
    const s = sim.current
    if (s.status !== 'paused') return
    s.last = Date.now()
    s.status = 'running'
    publish()
  }

  function skipBreak(): void {
    const s = sim.current
    if (s.status !== 'break') return
    s.breakLeft = 0
    s.last = Date.now()
    s.status = 'running'
    publish()
  }

  function end(): SessionResult {
    const s = sim.current
    if (s.status === 'idle') return { studiedSec: 0, earnedSec: 0 }
    if (s.status !== 'exhausted') s.healRate = 1 / healSeconds(s.studied)
    const result = { studiedSec: s.studied, earnedSec: s.earned }
    s.studied = 0
    s.earned = 0
    s.breakLeft = 0
    s.status = 'idle'
    publish()
    return result
  }

  const level = snap.fatigue / snap.stamina
  return {
    status: snap.status,
    studiedSec: snap.studied,
    fatigue: level,
    restSec: snap.healRate > 0 ? level / snap.healRate : 0,
    staminaSec: snap.stamina,
    limitSec: snap.limit,
    breakLeftSec: snap.breakLeft,
    block: snap.block,
    blocks: snap.blocks,
    canStart: level < 1,
    start,
    pause,
    resume,
    skipBreak,
    end
  }
}
