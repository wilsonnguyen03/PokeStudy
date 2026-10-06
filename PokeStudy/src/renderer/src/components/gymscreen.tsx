import { useEffect, useState } from 'react'
import { matchupRating, simulate, weaknessesOf, type BattleResult } from '../game/battle'
import { COOLDOWN_MS, GYMS, TYPE_COLOURS } from '../game/gyms'
import { levelCap } from '../game/levelcaps'
import { REGIONS } from '../game/regions'
import type { Settings } from '../hooks/usesettings'
import type { PartyMember } from '../mock'
import { artwork } from '../sprites'
import BadgeIcon from './badgeicon'
import GymBackdrop from './gymbackdrop'
import GymBattle from './gymbattle'

interface Props {
  settings: Settings
  party: PartyMember[]
  onEarnBadge: (regionId: string, count: number) => void
  onDefeat: (cooldownUntil: number) => void
  onClose: () => void
}

const CARD_W = 200

function formatWait(ms: number): string {
  const total = Math.ceil(ms / 1000)
  const pad = (n: number): string => String(n).padStart(2, '0')
  return `${Math.floor(total / 3600)}:${pad(Math.floor((total % 3600) / 60))}:${pad(total % 60)}`
}
const TEAM_SLOTS = 6

export default function GymScreen({
  settings,
  party,
  onEarnBadge,
  onDefeat,
  onClose
}: Props): React.JSX.Element {
  const regionId = settings.regionId
  const region = REGIONS[regionId]
  const leaders = GYMS[regionId]
  const [viewed, setViewed] = useState<number | null>(null)
  const [battle, setBattle] = useState<BattleResult | null>(null) // result of the fight in progress
  const [now, setNow] = useState(() => Date.now())

  const waitMs = Math.max(0, settings.gymCooldownUntil - now)
  useEffect(() => {
    if (settings.gymCooldownUntil <= Date.now()) return
    const id = setInterval(() => setNow(Date.now()), 1000)
    return () => clearInterval(id)
  }, [settings.gymCooldownUntil])

  if (!leaders) {
    return (
      <div className="gym" style={{ '--gx-main': region.colour } as React.CSSProperties}>
        <GymBackdrop type={null} />
        <header className="gym-header">
          <button className="btn btn-secondary" onClick={onClose}>
            Back
          </button>
          <h1 className="gym-title">{region.name} Gyms</h1>
        </header>
        <div className="gym-soon">
          <h2>Coming soon</h2>
          <p>The {region.name} gym leaders haven&apos;t arrived yet.</p>
        </div>
      </div>
    )
  }

  const earned = settings.badges[regionId] ?? 0
  const current = Math.min(earned, leaders.length) // index of the next leader; equals length once cleared
  const view = viewed ?? Math.min(current, leaders.length - 1)
  const leader = leaders[view]
  const colours = TYPE_COLOURS[leader.type]
  const cap = levelCap(regionId, earned)

  const isCurrent = view === current
  const defeated = view < current
  const rating = matchupRating(party, leader)
  const weak = weaknessesOf([leader.type])

  return (
    <div
      className="gym"
      style={
        {
          '--gx-main': colours.main,
          '--gx-dark': colours.dark,
          '--gx-light': colours.light
        } as React.CSSProperties
      }
    >
      <GymBackdrop type={leader.type} />

      <header className="gym-header">
        <button className="btn btn-secondary" onClick={onClose}>
          Back
        </button>
        <h1 className="gym-title">{region.name} Gym Challenge</h1>
        <div className="gym-pills">
          <span className="gym-pill">
            Badges {earned}/{leaders.length}
          </span>
          <span className="gym-pill hot">Level cap Lv {cap}</span>
        </div>
      </header>

      <div className="gym-stage">
        <button
          className="gym-arrow left"
          disabled={view === 0}
          onClick={() => setViewed(view - 1)}
          aria-label="Previous leader"
        >
          &#9664;
        </button>
        <button
          className="gym-arrow right"
          disabled={view >= Math.min(current, leaders.length - 1)}
          onClick={() => setViewed(view + 1)}
          aria-label="Next leader"
        >
          &#9654;
        </button>

        <div
          className="gym-track"
          style={{ transform: `translateX(${-(view * CARD_W + CARD_W / 2)}px)` }}
        >
          {leaders.map((l, i) => {
            const state = i < current ? 'defeated' : i === current ? 'current' : 'locked'
            const centre = i === view
            const caps = levelCap(regionId, i)
            return (
              <button
                key={l.name}
                className={`gym-card ${state}${centre ? ' centre' : ''}`}
                style={{ width: CARD_W }}
                disabled={state === 'locked'}
                onClick={() => setViewed(i)}
              >
                <img
                  className="gym-sprite"
                  src={l.sprite}
                  alt={state === 'locked' ? 'Locked leader' : l.name}
                />
                <span className="gym-plate">
                  <span className="gym-plate-name">{state === 'locked' ? '???' : l.name}</span>
                  {centre && <span className="gym-plate-city">{l.city}</span>}
                  <span className="gym-plate-cap">Cap Lv {caps}</span>
                </span>
                {state === 'defeated' && (
                  <span className="gym-won">
                    <BadgeIcon sheet={region.sheet} badge={region.badges[i]} />
                  </span>
                )}
              </button>
            )
          })}
        </div>
      </div>

      <div className="gym-info">
        <span className="gym-type" style={{ background: colours.main }}>
          {leader.type} type
        </span>
        <span className="gym-badge-name">{region.badges[view].name}</span>
      </div>

      <div className="gym-team">
        {Array.from({ length: TEAM_SLOTS }, (_, i) => {
          const m = leader.team[i]
          return m ? (
            <div key={i} className="gym-mon">
              <img src={artwork(m.dexId)} alt={m.name} />
              <span className="gym-mon-name">{m.name}</span>
              <span className="gym-mon-lv">Lv {m.level}</span>
            </div>
          ) : (
            <div key={i} className="gym-mon empty" />
          )
        })}
      </div>

      <div className="gym-action">
        <div
          className="gym-matchup"
          title="How your party's types line up against this leader's team. It doesn't guarantee a result."
        >
          <span>Type matchup</span>
          <strong className={`rating rating-${rating.toLowerCase()}`}>{rating}</strong>
          <span className="gym-weak">
            Weak to{' '}
            {weak.map((t) => (
              <em key={t} className="weak-chip">
                {t}
              </em>
            ))}
          </span>
        </div>

        <button
          className="gym-battle-btn"
          disabled={!isCurrent || current >= leaders.length || waitMs > 0}
          onClick={() => setBattle(simulate(party, leader, cap))}
        >
          {current >= leaders.length
            ? 'Region cleared!'
            : defeated
              ? 'Defeated'
              : waitMs > 0 && isCurrent
                ? `Rest ${formatWait(waitMs)}`
                : 'BATTLE!'}
        </button>
      </div>

      {battle && (
        <GymBattle
          leader={leader}
          regionId={regionId}
          badgeIndex={view}
          trainerId={settings.trainerId}
          playerName={settings.name.trim() || 'Trainer'}
          result={battle}
          onWin={() => onEarnBadge(regionId, view + 1)}
          onLose={() => onDefeat(Date.now() + COOLDOWN_MS)}
          onClose={() => {
            setBattle(null)
            setViewed(null)
          }}
        />
      )}
    </div>
  )
}
