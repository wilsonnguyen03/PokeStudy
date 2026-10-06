import PartyGrid from './components/partygrid'
import Trainer from './components/trainer'
import BadgeDrawer from './components/badgedrawer'
import MeadowScene from './components/meadowscene'
import SessionControls from './components/sessioncontrols'
import { StudyInfo, StudyOptions } from './components/studydialogs'
import { useStudySession, type SessionResult } from './hooks/usestudysession'
import PcScreen from './components/pcscreen'
import type { MenuId } from './components/homemenu'
import { PARTY_KEY, PC_KEY, useParty, usePc } from './hooks/usesave'
import EvolutionScreen from './components/evolutionscreen'
import { evolutionOptions, hasEvolutionAt, pickEvolution } from './game/evolution'
import { maxHpFor } from './game/battle'
import SettingsScreen from './components/settingsscreen'
import SetupScreen from './components/setupscreen'
import { StarterScreen } from './components/starterchoice'
import CatchReveal, { type CaughtEntry } from './components/catchreveal'
import { useSettings } from './hooks/usesettings'
import { useFavourites } from './hooks/usefavourites'
import { useHistory } from './hooks/usehistory'
import StatsScreen from './components/statsscreen'
import GymScreen from './components/gymscreen'
import { PARTY_SIZE } from './game/boxes'
import { catchCount, rollCatches, speciesName, starterMember } from './game/catching'
import { levelCap } from './game/levelcaps'
import { getLevel } from './game/leveling'
import { regionUnlocked } from './game/progress'
import { buildPlan } from './game/stamina'
import { REGIONS } from './game/regions'
import type { PartyMember } from './mock'
import { useState } from 'react'

const STORAGE_KEYS = [
  'pokestudy.settings',
  'pokestudy.favourites',
  'pokestudy.history',
  PARTY_KEY,
  PC_KEY
]
const MIN_REVEAL_SEC = 60 // shorter sessions skip the results screen

// One evolution waiting to be shown: the Pokémon as it was, and what it becomes
interface EvoJob {
  dexId: number
  from: 'party' | 'pc'
  to: number
  member: PartyMember
}

interface Reveal {
  studiedSec: number
  earnedSec: number
  caught: CaughtEntry[]
}

function App(): React.JSX.Element {
  const [screen, setScreen] = useState<'home' | 'pc' | 'settings' | 'stats' | 'gym'>('home')
  const [dialog, setDialog] = useState<'options' | 'info' | null>(null)
  const [reveal, setReveal] = useState<Reveal | null>(null)
  const [evoQueue, setEvoQueue] = useState<EvoJob[]>([])
  const [settings, updateSettings, resetSettings] = useSettings()
  const [favourites, toggleFavourite, moveFavourite] = useFavourites()
  const [party, setParty] = useParty()
  const [pc, setPc] = usePc()
  const [sessions, recordSession] = useHistory()
  const cap = levelCap(settings.regionId, settings.badges[settings.regionId] ?? 0)

  // Log the session, roll for wild Pokemon, and open the results screen
  function finishSession(result: SessionResult): void {
    recordSession(result.studiedSec)

    const owned = new Set([...party.map((m) => m.dexId), ...Object.keys(pc).map(Number)])

    // Pokémon that reached an evolution level this session get their evolution scene first
    const jobs: EvoJob[] = []
    for (const member of party) {
      if (!member.evoNew) continue
      const options = evolutionOptions(
        member.dexId,
        getLevel(member.xp),
        new Set([...owned, ...jobs.map((j) => j.to)])
      )
      if (options.length)
        jobs.push({ dexId: member.dexId, from: 'party', to: pickEvolution(options), member })
    }
    if (party.some((m) => m.evoNew))
      setParty((prev) => prev.map((m) => (m.evoNew ? { ...m, evoNew: false } : m)))
    if (jobs.length) setEvoQueue((q) => [...q, ...jobs])

    if (result.studiedSec < MIN_REVEAL_SEC) return
    jobs.forEach((j) => owned.add(j.to))
    const open = [
      settings.regionId,
      ...Object.keys(REGIONS).filter(
        (id) => id !== settings.regionId && regionUnlocked(settings, id)
      )
    ]
    const avgLevel = party.length ? party.reduce((n, m) => n + getLevel(m.xp), 0) / party.length : 1
    const found = rollCatches(catchCount(result.earnedSec), owned, open, cap, avgLevel)

    // New Pokemon join the party while there's room, then go to the PC
    let room = PARTY_SIZE - party.length
    const caught: CaughtEntry[] = found.map((member) => ({
      member,
      to: room-- > 0 ? 'party' : 'pc'
    }))
    const toParty = caught.filter((c) => c.to === 'party').map((c) => c.member)
    const toPc = caught.filter((c) => c.to === 'pc').map((c) => c.member)
    if (toParty.length) setParty((prev) => [...prev, ...toParty])
    if (toPc.length)
      setPc((prev) => ({ ...prev, ...Object.fromEntries(toPc.map((m) => [m.dexId, m])) }))

    setReveal({ studiedSec: result.studiedSec, earnedSec: result.earnedSec, caught })
  }

  const timer = useStudySession(party, setParty, cap, finishSession)
  const plan = buildPlan(settings)

  // Party Pokémon that can evolve right now (flagged by levelling up, and the result isn't already owned)
  const ownedDex = new Set([...party.map((m) => m.dexId), ...Object.keys(pc).map(Number)])
  const evolvable = new Set(
    party
      .filter((m) => m.canEvolve && evolutionOptions(m.dexId, getLevel(m.xp), ownedDex).length > 0)
      .map((m) => m.dexId)
  )

  function startEvolution(dexId: number, from: 'party' | 'pc'): void {
    const member = from === 'party' ? party.find((m) => m.dexId === dexId) : pc[dexId]
    if (!member) return
    const owned = new Set([...party.map((m) => m.dexId), ...Object.keys(pc).map(Number)])
    const options = evolutionOptions(dexId, getLevel(member.xp), owned)
    if (options.length)
      setEvoQueue((q) => [...q, { dexId, from, to: pickEvolution(options), member }])
  }

  // Applies the evolution the player just watched (nothing changes if they stopped it)
  function finishEvolution(evolved: boolean): void {
    const job = evoQueue[0]
    setEvoQueue((q) => q.slice(1))
    if (!evolved || !job) return

    const evolve = (m: PartyMember): PartyMember => {
      const level = getLevel(m.xp)
      const maxHp = maxHpFor(job.to, level)
      return {
        ...m,
        dexId: job.to,
        name: speciesName(job.to),
        maxHp,
        hp: (m.hp / m.maxHp) * maxHp,
        canEvolve: hasEvolutionAt(job.to, level) || undefined,
        evoNew: undefined
      }
    }
    if (job.from === 'party') {
      setParty((prev) => prev.map((m) => (m.dexId === job.dexId ? evolve(m) : m)))
    } else {
      setPc((prev) => {
        const m = prev[job.dexId]
        if (!m) return prev
        const next = { ...prev }
        delete next[job.dexId]
        next[job.to] = evolve(m)
        return next
      })
    }
    moveFavourite(job.dexId, job.to)
  }

  function renameCaught(dexId: number, nickname: string | undefined): void {
    setParty((prev) => prev.map((m) => (m.dexId === dexId ? { ...m, nickname } : m)))
    setPc((prev) => (prev[dexId] ? { ...prev, [dexId]: { ...prev[dexId], nickname } } : prev))
  }

  // Wipes saved data and restarts the app, which lands on the setup screen
  function resetAll(): void {
    try {
      STORAGE_KEYS.forEach((key) => localStorage.removeItem(key))
    } catch {
      // Storage unavailable: the reload still resets everything held in memory
    }
    window.location.reload()
  }

  function openMenu(id: MenuId): void {
    if (id === 'pc' || id === 'settings' || id === 'stats' || id === 'gym') setScreen(id)
  }

  if (settings.startRegion === null) {
    return (
      <SetupScreen
        onFinish={(patch, starter) => {
          // A new game: wipe any old Pokémon and start with a single level 1 starter
          setParty([starterMember(starter)])
          setPc({})
          updateSettings(patch)
        }}
      />
    )
  }

  if (party.length === 0 && Object.keys(pc).length === 0) {
    return (
      <StarterScreen
        regionId={settings.startRegion}
        onPick={(dex) => setParty([starterMember(dex)])}
      />
    )
  }

  if (evoQueue.length > 0) {
    const job = evoQueue[0]
    return (
      <EvolutionScreen
        key={`${job.dexId}-${job.to}`}
        member={job.member}
        toDex={job.to}
        onFinish={finishEvolution}
      />
    )
  }

  if (reveal) {
    return (
      <CatchReveal
        studiedSec={reveal.studiedSec}
        earnedSec={reveal.earnedSec}
        caught={reveal.caught}
        onRename={renameCaught}
        onDone={() => setReveal(null)}
      />
    )
  }

  if (screen === 'pc') {
    return (
      <PcScreen
        party={party}
        pc={pc}
        favourites={favourites}
        onToggleFavourite={toggleFavourite}
        onEvolve={startEvolution}
        onChange={(p, b) => {
          setParty(p)
          setPc(b)
        }}
        onClose={() => setScreen('home')}
      />
    )
  }

  if (screen === 'gym') {
    return (
      <GymScreen
        settings={settings}
        party={party}
        onEarnBadge={(id, count) => updateSettings({ badges: { ...settings.badges, [id]: count } })}
        onDefeat={(until) => updateSettings({ gymCooldownUntil: until })}
        onClose={() => setScreen('home')}
      />
    )
  }

  if (screen === 'stats') {
    return (
      <StatsScreen
        sessions={sessions}
        party={party}
        pc={pc}
        favourites={favourites}
        settings={settings}
        onClose={() => setScreen('home')}
      />
    )
  }

  if (screen === 'settings') {
    return (
      <SettingsScreen
        settings={settings}
        onChange={updateSettings}
        onReset={resetSettings}
        onResetAll={resetAll}
        onClose={() => setScreen('home')}
      />
    )
  }

  return (
    <div className="home">
      <section className="top">
        <MeadowScene background={settings.background} />
        <PartyGrid
          party={party}
          levelCap={cap}
          showAdd={timer.status === 'idle'}
          evolvable={evolvable}
          onEvolve={(dex) => startEvolution(dex, 'party')}
          onAddPokemon={() => setScreen('pc')}
        />
        <Trainer playerName={settings.name.trim() || 'Trainer'} trainerId={settings.trainerId} />
        <BadgeDrawer
          regionId={settings.regionId}
          earned={settings.badges[settings.regionId] ?? 0}
        />
      </section>

      <section className="bottom">
        <SessionControls
          session={timer}
          plan={plan}
          onStart={() => timer.start(plan)}
          onPause={timer.pause}
          onResume={timer.resume}
          onSkipBreak={timer.skipBreak}
          onEnd={() => finishSession(timer.end())}
          onOpenMenu={openMenu}
          onOpenOptions={() => setDialog('options')}
          onOpenInfo={() => setDialog('info')}
        />
      </section>

      {dialog === 'options' && (
        <StudyOptions
          settings={settings}
          onChange={updateSettings}
          onClose={() => setDialog(null)}
        />
      )}
      {dialog === 'info' && <StudyInfo onClose={() => setDialog(null)} />}
    </div>
  )
}

export default App
