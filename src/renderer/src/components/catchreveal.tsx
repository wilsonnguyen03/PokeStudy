import { useState } from 'react'
import { speciesOf } from '../game/battle'
import { getLevel } from '../game/leveling'
import { rarity } from '../game/catching'
import { usePokemonInfo } from '../hooks/usepokemoninfo'
import { formatDuration } from '../game/stats'
import { displayName, type PartyMember } from '../mock'
import { artwork, ballSprite } from '../sprites'

export interface CaughtEntry {
  member: PartyMember
  to: 'party' | 'pc'
}

interface Props {
  studiedSec: number
  earnedSec: number
  caught: CaughtEntry[]
  onRename: (dexId: number, nickname: string | undefined) => void
  onDone: () => void
}

const RARITY_LABEL = ['Common', 'Uncommon', 'Rare', 'Very rare']
const BURST = Array.from({ length: 18 }, (_, i) => i * 20)
const MAX_NICKNAME = 12

function Reveal({
  entry,
  nickname,
  onRename
}: {
  entry: CaughtEntry
  nickname: string | undefined
  onRename: (n: string | undefined) => void
}): React.JSX.Element {
  const m = entry.member
  const { info } = usePokemonInfo(m.dexId)
  const types = speciesOf(m.dexId).types
  const rare = rarity(m.dexId)
  const [draft, setDraft] = useState<string | null>(null)

  return (
    <div className={`reveal-card rare-${rare}`}>
      <div className="reveal-stage">
        <div className="burst" aria-hidden="true">
          {BURST.map((a) => (
            <span key={a} style={{ '--a': `${a}deg` } as React.CSSProperties} />
          ))}
        </div>
        <div className="reveal-glow" />
        <img className="reveal-art" src={artwork(m.dexId)} alt={m.name} />
        <span className="reveal-new">NEW!</span>
      </div>

      <h2 className="reveal-name">{nickname || m.name}</h2>
      {nickname && <p className="reveal-species">{m.name}</p>}

      <div className="reveal-tags">
        {types.map((t) => (
          <span key={t} className={`type type-${t}`}>
            {t}
          </span>
        ))}
        <span className="reveal-pill">Lv {getLevel(m.xp)}</span>
        <span className="reveal-pill rarity">
          {'★'.repeat(rare + 1)} {RARITY_LABEL[rare]}
        </span>
      </div>

      <p className="reveal-info">
        {info ? (
          <>
            <strong>{info.genus}</strong> &middot; {info.heightM} m &middot; {info.weightKg} kg
          </>
        ) : (
          `No. ${String(m.dexId).padStart(3, '0')}`
        )}
      </p>
      {info?.entry && <p className="reveal-entry">{info.entry}</p>}
      <p className="reveal-where">Sent to your {entry.to === 'party' ? 'party' : 'PC'}.</p>

      {draft === null ? (
        <button className="btn btn-secondary pc-small" onClick={() => setDraft(nickname || m.name)}>
          Rename
        </button>
      ) : (
        <form
          className="pc-rename reveal-rename"
          onSubmit={(e) => {
            e.preventDefault()
            onRename(draft.trim().slice(0, MAX_NICKNAME) || undefined)
            setDraft(null)
          }}
        >
          <input
            autoFocus
            value={draft}
            maxLength={MAX_NICKNAME}
            onChange={(e) => setDraft(e.target.value)}
            onKeyDown={(e) => e.key === 'Escape' && setDraft(null)}
          />
          <button className="btn btn-primary pc-small" type="submit">
            Save
          </button>
        </form>
      )}
    </div>
  )
}

export default function CatchReveal({
  studiedSec,
  earnedSec,
  caught,
  onRename,
  onDone
}: Props): React.JSX.Element {
  const [index, setIndex] = useState(0)
  const [opened, setOpened] = useState(false)
  const [summary, setSummary] = useState(caught.length === 0)
  const [names, setNames] = useState<Record<number, string | undefined>>({})

  const entry = caught[index]
  const last = index === caught.length - 1
  const rest = studiedSec - earnedSec

  function next(): void {
    if (last) setSummary(true)
    else {
      setIndex(index + 1)
      setOpened(false)
    }
  }

  return (
    <div className="catch">
      {!summary && (
        <button className="battle-skip" onClick={() => setSummary(true)}>
          Skip
        </button>
      )}

      {!summary && entry && (
        <>
          <p className="catch-count">
            Pokémon {index + 1} of {caught.length}
          </p>

          {!opened ? (
            <button
              className="catch-ball-wrap"
              onClick={() => setOpened(true)}
              aria-label="Open the ball"
            >
              <span className="catch-rays" />
              <img className="catch-ball" src={ballSprite(entry.member.ball)} alt="" />
              <span className="catch-hint">Tap the ball!</span>
            </button>
          ) : (
            <>
              <div className="catch-flash" />
              <Reveal
                key={entry.member.dexId}
                entry={entry}
                nickname={names[entry.member.dexId]}
                onRename={(n) => {
                  setNames({ ...names, [entry.member.dexId]: n })
                  onRename(entry.member.dexId, n)
                }}
              />
              <button className="btn btn-primary btn-big catch-next" onClick={next}>
                {last ? 'Finish' : 'Next'}
              </button>
            </>
          )}
        </>
      )}

      {summary && (
        <div className="catch-summary">
          <h1 className="catch-title">Session complete!</h1>
          <div className="catch-stats">
            <div>
              <strong>{formatDuration(studiedSec)}</strong>
              <span>studied</span>
            </div>
            <div>
              <strong>{caught.length}</strong>
              <span>new Pokémon</span>
            </div>
          </div>

          {caught.length > 0 ? (
            <div className="catch-grid">
              {caught.map((c) => (
                <div key={c.member.dexId} className="catch-mini">
                  <img src={artwork(c.member.dexId)} alt="" />
                  <span>{names[c.member.dexId] || displayName(c.member)}</span>
                  <em>{c.to === 'party' ? 'Party' : 'PC'}</em>
                </div>
              ))}
            </div>
          ) : (
            <p className="catch-empty">
              {earnedSec < 20 * 60
                ? 'No wild Pokémon showed up this time. Study for 20 minutes or more with healthy Pokémon to find some.'
                : 'No new Pokémon were found. Every species in your open regions is already yours!'}
            </p>
          )}
          {rest > 120 && (
            <p className="catch-empty">
              Your party was worn out for part of this session, so that time didn&apos;t count
              toward finding Pokémon.
            </p>
          )}

          <button className="btn btn-primary btn-big" onClick={onDone}>
            Done
          </button>
        </div>
      )}
    </div>
  )
}
