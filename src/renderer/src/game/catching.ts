import { maxHpFor, speciesOf } from './battle'
import { REGION_DEX } from './boxes'
import { POKE_NAMES } from './pokenames'
import type { PartyMember } from '../mock'

const CATCH_EVERY_MIN = 20 // minutes of healthy studying per wild Pokemon, on average
const MAX_CATCHES = 8

// Legendary and mythical species are saved for later rewards, never found while studying
const LEGENDARY = new Set([
  144,
  145,
  146,
  150,
  151,
  243,
  244,
  245,
  249,
  250,
  251,
  ...Array.from({ length: 10 }, (_, i) => 377 + i), // Regirock .. Deoxys block
  ...Array.from({ length: 14 }, (_, i) => 480 + i),
  494,
  638,
  639,
  640,
  641,
  642,
  643,
  644,
  645,
  646,
  647,
  648,
  649
])

const BALLS = [
  'poke-ball',
  'poke-ball',
  'poke-ball',
  'poke-ball',
  'great-ball',
  'great-ball',
  'ultra-ball',
  'premier-ball',
  'luxury-ball'
]

export function speciesName(dexId: number): string {
  return POKE_NAMES[dexId - 1] ?? `#${dexId}`
}

// How many wild Pokemon turn up: a whole one per block of studying, plus a chance for the leftover part
export function catchCount(earnedSec: number): number {
  const blocks = earnedSec / 60 / CATCH_EVERY_MIN
  const whole = Math.floor(blocks)
  const extra = Math.random() < blocks - whole ? 1 : 0
  return Math.min(MAX_CATCHES, whole + extra)
}

// Lower-powered species turn up far more often than strong ones
function weight(dexId: number): number {
  const s = speciesOf(dexId)
  const bst = s.hp + s.atk + s.def + s.spa + s.spd + s.spe
  return 1 / (1 + Math.max(0, bst - 300) / 100) ** 2
}

function pick(pool: number[]): number {
  const weights = pool.map(weight)
  let roll = Math.random() * weights.reduce((a, b) => a + b, 0)
  for (let i = 0; i < pool.length; i++) {
    roll -= weights[i]
    if (roll <= 0) return pool[i]
  }
  return pool[pool.length - 1]
}

// Where every trainer starts: one level 1 starter in the party
export function starterMember(dexId: number): PartyMember {
  const hp = maxHpFor(dexId, 1)
  return { dexId, name: speciesName(dexId), xp: 1, hp, maxHp: hp, ball: 'poke-ball' }
}

// New species to catch, around the level of your party and never above the level cap.
// The current region comes first, then any other open region once it runs dry.
export function rollCatches(
  count: number,
  owned: Set<number>,
  regionIds: string[],
  cap: number,
  baseLevel: number
): PartyMember[] {
  const taken = new Set(owned)
  const out: PartyMember[] = []

  for (let n = 0; n < count; n++) {
    let pool: number[] = []
    for (const id of regionIds) {
      const [a, b] = REGION_DEX[id]
      pool = Array.from({ length: b - a + 1 }, (_, i) => a + i).filter(
        (d) => !taken.has(d) && !LEGENDARY.has(d)
      )
      if (pool.length) break
    }
    if (!pool.length) break

    const dexId = pick(pool)
    taken.add(dexId)
    const level = Math.max(2, Math.min(cap - 1, Math.round(baseLevel + Math.random() * 3 - 1.5)))
    const hp = maxHpFor(dexId, level)
    out.push({
      dexId,
      name: speciesName(dexId),
      xp: level ** 3,
      hp,
      maxHp: hp,
      ball: BALLS[Math.floor(Math.random() * BALLS.length)]
    })
  }
  return out
}

// 0 = common ... 3 = rare, for the reveal's sparkle level
export function rarity(dexId: number): number {
  const w = weight(dexId)
  return w > 0.4 ? 0 : w > 0.15 ? 1 : w > 0.07 ? 2 : 3
}
