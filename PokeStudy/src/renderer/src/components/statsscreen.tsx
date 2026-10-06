import { useState } from 'react'
import { REGION_DEX } from '../game/boxes'
import { BADGES_TO_FINISH } from '../game/progress'
import { REGIONS } from '../game/regions'
import { getLevel } from '../game/leveling'
import {
  dailyTotals,
  formatDuration,
  lastDays,
  sampleSessions,
  summarise,
  type Session
} from '../game/stats'
import type { Settings } from '../hooks/usesettings'
import { displayName, type PartyMember } from '../mock'
import { sprite } from '../sprites'
import BadgeIcon from './badgeicon'

interface Props {
  sessions: Session[]
  party: PartyMember[]
  pc: Record<number, PartyMember>
  favourites: Set<number>
  settings: Settings
  onClose: () => void
}

const RANGES = [7, 14, 30]
const WEEKS = 15

function Tile({
  label,
  value,
  sub,
  colour
}: {
  label: string
  value: string
  sub?: string
  colour: string
}): React.JSX.Element {
  return (
    <div className="stat-tile" style={{ '--tile': colour } as React.CSSProperties}>
      <span className="stat-value">{value}</span>
      <span className="stat-label">{label}</span>
      {sub && <span className="stat-sub">{sub}</span>}
    </div>
  )
}

function BarChart({
  days
}: {
  days: { key: string; date: Date; sec: number }[]
}): React.JSX.Element {
  const W = 620
  const H = 190
  const left = 36
  const bottom = 24
  const top = 10
  const plotW = W - left - 6
  const plotH = H - bottom - top

  const maxHours = Math.max(1, Math.ceil(Math.max(...days.map((d) => d.sec)) / 3600))
  const step = maxHours <= 4 ? 1 : Math.ceil(maxHours / 4)
  const ticks: number[] = []
  for (let h = 0; h <= maxHours; h += step) ticks.push(h)
  const top_h = ticks[ticks.length - 1] || 1

  const slot = plotW / days.length
  const barW = Math.min(34, slot * 0.66)
  const labelEvery = days.length > 16 ? 5 : 1

  return (
    <svg className="chart" viewBox={`0 0 ${W} ${H}`} role="img" aria-label="Study time per day">
      {ticks.map((h) => {
        const y = top + plotH - (h / top_h) * plotH
        return (
          <g key={h}>
            <line x1={left} x2={W - 6} y1={y} y2={y} className="chart-grid" />
            <text x={left - 6} y={y + 4} textAnchor="end" className="chart-axis">
              {h}h
            </text>
          </g>
        )
      })}
      {days.map((d, i) => {
        const h = (d.sec / 3600 / top_h) * plotH
        const x = left + i * slot + (slot - barW) / 2
        const isToday = i === days.length - 1
        const label = d.date.toLocaleDateString(
          undefined,
          days.length <= 7 ? { weekday: 'short' } : { month: 'numeric', day: 'numeric' }
        )
        return (
          <g key={d.key}>
            <title>{`${d.date.toLocaleDateString()}: ${d.sec ? formatDuration(d.sec) : 'no study'}`}</title>
            <rect x={x} y={top} width={barW} height={plotH} className="chart-track" rx="6" />
            {d.sec > 0 && (
              <rect
                x={x}
                y={top + plotH - Math.max(h, 4)}
                width={barW}
                height={Math.max(h, 4)}
                rx="6"
                className={isToday ? 'chart-bar today' : 'chart-bar'}
              />
            )}
            {i % labelEvery === 0 && (
              <text
                x={x + barW / 2}
                y={H - 6}
                textAnchor="middle"
                className={isToday ? 'chart-axis today' : 'chart-axis'}
              >
                {isToday ? 'Today' : label}
              </text>
            )}
          </g>
        )
      })}
    </svg>
  )
}

function Heatmap({ totals }: { totals: Map<string, number> }): React.JSX.Element {
  const today = new Date()
  const todayStart = new Date(today.getFullYear(), today.getMonth(), today.getDate())
  const dow = (todayStart.getDay() + 6) % 7 // Monday = 0
  const first = new Date(
    todayStart.getFullYear(),
    todayStart.getMonth(),
    todayStart.getDate() - dow - (WEEKS - 1) * 7
  )

  const weeks = Array.from({ length: WEEKS }, (_, w) =>
    Array.from({ length: 7 }, (_, d) => {
      const date = new Date(first.getFullYear(), first.getMonth(), first.getDate() + w * 7 + d)
      if (date > todayStart) return null
      const key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`
      return { date, sec: totals.get(key) ?? 0 }
    })
  )

  const level = (sec: number): number =>
    sec === 0 ? 0 : sec < 1800 ? 1 : sec < 3600 ? 2 : sec < 7200 ? 3 : 4

  return (
    <div className="heatmap">
      {weeks.map((week, w) => (
        <div key={w} className="heat-col">
          {week.map((cell, d) =>
            cell ? (
              <span
                key={d}
                className={`heat heat-${level(cell.sec)}`}
                title={`${cell.date.toLocaleDateString()}: ${cell.sec ? formatDuration(cell.sec) : 'no study'}`}
              />
            ) : (
              <span key={d} className="heat blank" />
            )
          )}
        </div>
      ))}
    </div>
  )
}

export default function StatsScreen({
  sessions,
  party,
  pc,
  favourites,
  settings,
  onClose
}: Props): React.JSX.Element {
  const [range, setRange] = useState(14)
  const [sample, setSample] = useState(false)

  const data = sample ? sampleSessions() : sessions
  const totals = dailyTotals(data)
  const sum = summarise(data)
  const days = lastDays(totals, range)

  const owned = [...party, ...Object.values(pc)]
  const caught = new Set(owned.map((m) => m.dexId))
  const totalSpecies = Object.values(REGION_DEX).reduce((n, [a, b]) => n + (b - a + 1), 0)
  const totalBadges = Object.keys(REGIONS).reduce((n, id) => n + (settings.badges[id] ?? 0), 0)
  const avgLevel = party.length
    ? Math.round(party.reduce((n, m) => n + getLevel(m.xp), 0) / party.length)
    : 0
  const top = owned.reduce<PartyMember | null>(
    (best, m) => (!best || m.xp > best.xp ? m : best),
    null
  )

  return (
    <div className="stats">
      <header className="pc-header">
        <button className="btn btn-secondary" onClick={onClose}>
          Back
        </button>
        <h1 className="pc-title">Trainer Stats</h1>
        {sessions.length === 0 && (
          <button
            className="btn btn-secondary pc-small stats-sample"
            onClick={() => setSample(!sample)}
          >
            {sample ? 'Hide sample data' : 'Preview with sample data'}
          </button>
        )}
      </header>

      <div className="stats-body">
        {sample && (
          <p className="stats-banner">
            Showing made-up sample data. Your real sessions will appear here as you study.
          </p>
        )}

        <div className="stat-tiles">
          <Tile
            label="Total studied"
            value={formatDuration(sum.totalSec)}
            sub={`${sum.sessions} sessions`}
            colour="#ef6461"
          />
          <Tile
            label="Today"
            value={formatDuration(sum.todaySec)}
            sub={`${formatDuration(sum.weekSec)} this week`}
            colour="#6ec6ff"
          />
          <Tile
            label="Day streak"
            value={`${sum.streak}`}
            sub={`best ${sum.bestStreak}`}
            colour="#e9a23b"
          />
          <Tile
            label="Best day"
            value={sum.bestDay ? formatDuration(sum.bestDay.sec) : '-'}
            sub={sum.bestDay ? sum.bestDay.date.toLocaleDateString() : 'no data yet'}
            colour="#4caf7d"
          />
          <Tile
            label="Longest session"
            value={formatDuration(sum.longestSessionSec)}
            sub={`avg ${formatDuration(sum.avgPerActiveDaySec)} / day`}
            colour="#a07aff"
          />
          <Tile
            label="Pokémon caught"
            value={`${caught.size}`}
            sub={`of ${totalSpecies}`}
            colour="#5a8fd8"
          />
          <Tile
            label="Badges"
            value={`${totalBadges}`}
            sub={`of ${Object.keys(REGIONS).length * BADGES_TO_FINISH}`}
            colour="#d685ad"
          />
        </div>

        <section className="card">
          <div className="card-head">
            <h2>Study timeline</h2>
            <div className="seg seg-small">
              {RANGES.map((r) => (
                <button
                  key={r}
                  className={`seg-btn${range === r ? ' active' : ''}`}
                  onClick={() => setRange(r)}
                >
                  {r} days
                </button>
              ))}
            </div>
          </div>
          <BarChart days={days} />
        </section>

        <div className="stats-cols">
          <section className="card">
            <h2>Daily activity</h2>
            <Heatmap totals={totals} />
            <div className="heat-legend">
              Less
              {[0, 1, 2, 3, 4].map((l) => (
                <span key={l} className={`heat heat-${l}`} />
              ))}
              More
            </div>
          </section>

          <section className="card">
            <h2>Pokedex progress</h2>
            {Object.entries(REGIONS).map(([id, r]) => {
              const [a, b] = REGION_DEX[id]
              const count = [...caught].filter((d) => d >= a && d <= b).length
              const total = b - a + 1
              return (
                <div key={id} className="prog-row">
                  <span className="prog-name">{r.name}</span>
                  <div className="prog-track">
                    <div
                      className="prog-fill"
                      style={{ width: `${(count / total) * 100}%`, background: r.colour }}
                    />
                  </div>
                  <span className="prog-num">
                    {count}/{total}
                  </span>
                </div>
              )
            })}
          </section>
        </div>

        <div className="stats-cols">
          <section className="card">
            <h2>Badges</h2>
            {Object.entries(REGIONS).map(([id, r]) => {
              const earned = settings.badges[id] ?? 0
              return (
                <div key={id} className="prog-row">
                  <span className="prog-name">{r.name}</span>
                  <div className="stats-badges">
                    {r.badges.map((badge, i) => (
                      <div
                        key={badge.name}
                        className={i < earned ? 'badge-slot earned' : 'badge-slot'}
                        title={i < earned ? `${badge.name} (${badge.leader})` : '???'}
                      >
                        <BadgeIcon sheet={r.sheet} badge={badge} />
                      </div>
                    ))}
                  </div>
                  <span className="prog-num">
                    {earned}/{BADGES_TO_FINISH}
                  </span>
                </div>
              )
            })}
          </section>

          <section className="card">
            <h2>Your team</h2>
            <div className="team-facts">
              <div>
                <strong>{avgLevel}</strong>
                <span>average party level</span>
              </div>
              <div>
                <strong>{favourites.size}</strong>
                <span>favourites</span>
              </div>
              <div>
                <strong>{Object.keys(pc).length}</strong>
                <span>stored in PC</span>
              </div>
            </div>
            {top && (
              <div className="team-top">
                <img src={sprite(top.dexId)} alt="" />
                <span>
                  Strongest: <strong>{displayName(top)}</strong> (Lv {getLevel(top.xp)})
                </span>
              </div>
            )}
          </section>
        </div>
      </div>
    </div>
  )
}
