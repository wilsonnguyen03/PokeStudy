import { useState } from 'react'
import { displayName, type PartyMember } from '../mock'
import { BOX_COLUMNS, BOX_SIZE, PARTY_SIZE, boxCount, dexAt, wallpaperFor } from '../game/boxes'
import { getLevel } from '../game/leveling'
import { evolutionOptions } from '../game/evolution'
import { REGIONS } from '../game/regions'
import { usePokemonInfo } from '../hooks/usepokemoninfo'
import { artwork, ballSprite, sprite } from '../sprites'

interface Props {
  party: PartyMember[]
  pc: Record<number, PartyMember>
  favourites: Set<number>
  onToggleFavourite: (dexId: number) => void
  onEvolve: (dexId: number, from: 'party' | 'pc') => void
  onChange: (party: PartyMember[], pc: Record<number, PartyMember>) => void
  onClose: () => void
}

type Selection = { from: 'party'; index: number } | { from: 'box'; dexId: number } | null

const MAX_NICKNAME = 12
const FAVOURITES = 'favourites'
const FAVOURITE_COLOUR = '#e0a526'

export default function PcScreen({
  party,
  pc,
  favourites,
  onToggleFavourite,
  onEvolve,
  onChange,
  onClose
}: Props): React.JSX.Element {
  const [regionId, setRegionId] = useState(Object.keys(REGIONS)[0])
  const [rawBox, setRawBox] = useState(0) // box position within the open view
  const [selection, setSelection] = useState<Selection>(null)
  const [draft, setDraft] = useState<string | null>(null) // rename text while editing

  const showingFavourites = regionId === FAVOURITES
  // Favourites are listed in dex order across every region, 30 to a box
  const favouriteIds = [...favourites].sort((a, b) => a - b)
  const boxes = showingFavourites
    ? Math.max(1, Math.ceil(favouriteIds.length / BOX_SIZE))
    : boxCount(regionId)
  const boxNo = Math.min(rawBox, boxes - 1) // un-favouriting can shrink the list
  const wallpaper = wallpaperFor(boxNo)

  function slotDex(i: number): number | null {
    return showingFavourites
      ? (favouriteIds[boxNo * BOX_SIZE + i] ?? null)
      : dexAt(regionId, boxNo, i)
  }

  const inParty = (dexId: number): boolean => party.some((m) => m.dexId === dexId)

  const selected: PartyMember | null =
    selection === null
      ? null
      : selection.from === 'party'
        ? (party[selection.index] ?? null)
        : (pc[selection.dexId] ?? null)

  // A selected box slot whose species hasn't been caught yet
  const lockedId = selection?.from === 'box' && !selected ? selection.dexId : null
  const { info, failed } = usePokemonInfo(selected ? selected.dexId : null)

  function select(next: Selection): void {
    setSelection(next)
    setDraft(null)
  }

  function changeBox(delta: number): void {
    setRawBox((boxNo + delta + boxes) % boxes)
    select(null)
  }

  function changeRegion(id: string): void {
    setRegionId(id)
    setRawBox(0)
    select(null)
  }

  function withdraw(): void {
    if (selection?.from !== 'box' || !selected || party.length >= PARTY_SIZE) return
    const rest = { ...pc }
    delete rest[selection.dexId]
    onChange([...party, selected], rest)
    select(null)
  }

  function deposit(): void {
    if (selection?.from !== 'party' || !selected || party.length <= 1) return
    onChange(
      party.filter((_, i) => i !== selection.index),
      { ...pc, [selected.dexId]: selected }
    )
    select(null)
  }

  function saveNickname(): void {
    if (!selected || draft === null) return
    const nickname = draft.trim().slice(0, MAX_NICKNAME) || undefined
    const renamed = { ...selected, nickname }
    if (selection?.from === 'party') {
      onChange(
        party.map((m, i) => (i === selection.index ? renamed : m)),
        pc
      )
    } else if (selection?.from === 'box') {
      onChange(party, { ...pc, [selection.dexId]: renamed })
    }
    setDraft(null)
  }

  // Evolution is offered once a Pokémon has levelled up into its evolution level, unless you already own the result
  const ownedDex = new Set([...party.map((m) => m.dexId), ...Object.keys(pc).map(Number)])
  const evolveOptions = selected?.canEvolve
    ? evolutionOptions(selected.dexId, getLevel(selected.xp), ownedDex)
    : []

  const canWithdraw = selection?.from === 'box' && party.length < PARTY_SIZE
  const canDeposit = selection?.from === 'party' && party.length > 1
  const summaryDex = selected?.dexId ?? lockedId

  return (
    <div className="pc">
      <header className="pc-header">
        <button className="btn btn-secondary" onClick={onClose}>
          Back
        </button>
        <h1 className="pc-title">Pokémon Storage System</h1>
        <label className="pc-region-select">
          Region
          <select
            value={regionId}
            style={
              {
                '--region': showingFavourites ? FAVOURITE_COLOUR : REGIONS[regionId].colour
              } as React.CSSProperties
            }
            onChange={(e) => changeRegion(e.target.value)}
          >
            <option value={FAVOURITES}>&#9733; Favourites</option>
            {Object.entries(REGIONS).map(([id, r]) => (
              <option key={id} value={id}>
                {r.name}
              </option>
            ))}
          </select>
        </label>
      </header>

      <div className="pc-body">
        <aside className="pc-party">
          <h2 className="pc-heading">Party</h2>
          {Array.from({ length: PARTY_SIZE }, (_, i) => {
            const m = party[i]
            const active = selection?.from === 'party' && selection.index === i
            return m ? (
              <button
                key={i}
                className={`pc-party-slot${active ? ' selected' : ''}`}
                onClick={() => select(active ? null : { from: 'party', index: i })}
              >
                <img src={sprite(m.dexId)} alt={displayName(m)} />
                <span className="pc-party-text">
                  <span>{displayName(m)}</span>
                  <span className="pc-lv">Lv {getLevel(m.xp)}</span>
                </span>
              </button>
            ) : (
              <div key={i} className="pc-party-slot empty" />
            )
          })}
        </aside>

        <div className="pc-center">
          <section className="pc-box" style={{ background: wallpaper.base }}>
            <div className="pc-box-nav">
              <button className="pc-arrow" onClick={() => changeBox(-1)} aria-label="Previous box">
                &#9664;
              </button>
              <div className="pc-box-name">BOX {boxNo + 1}</div>
              <button className="pc-arrow" onClick={() => changeBox(1)} aria-label="Next box">
                &#9654;
              </button>
            </div>

            <div
              className="pc-grid"
              style={
                {
                  gridTemplateColumns: `repeat(${BOX_COLUMNS}, 1fr)`,
                  background: wallpaper.pattern,
                  '--tint': wallpaper.tint
                } as React.CSSProperties
              }
            >
              {Array.from({ length: BOX_SIZE }, (_, i) => {
                const dexId = slotDex(i)
                if (dexId === null) return <div key={i} className="pc-cell blank" />

                const stored = pc[dexId]
                const away = !stored && inParty(dexId)
                const active = selection?.from === 'box' && selection.dexId === dexId
                const cls = [
                  'pc-cell',
                  active && 'selected',
                  !stored && !away && 'locked',
                  away && 'away'
                ]
                  .filter(Boolean)
                  .join(' ')
                return (
                  <button
                    key={i}
                    className={cls}
                    disabled={away}
                    title={away ? 'In your party' : stored ? displayName(stored) : '???'}
                    onClick={() => select(active ? null : { from: 'box', dexId })}
                  >
                    <img src={sprite(dexId)} alt={stored ? displayName(stored) : 'Unknown'} />
                    {favourites.has(dexId) && <span className="pc-star">&#9733;</span>}
                  </button>
                )
              })}
            </div>

            <div className="pc-box-dots">
              {Array.from({ length: boxes }, (_, i) => (
                <span key={i} className={i === boxNo ? 'dot on' : 'dot'} />
              ))}
            </div>
          </section>
        </div>

        <aside className="pc-summary">
          {summaryDex === null ? (
            <p className="pc-hint">Select a Pokémon.</p>
          ) : (
            <>
              <img
                className={`pc-art${selected ? '' : ' locked'}`}
                src={artwork(summaryDex)}
                alt=""
              />

              {selected ? (
                <>
                  <div className="pc-summary-name">
                    <img src={ballSprite(selected.ball)} alt="" />
                    <span>{displayName(selected)}</span>
                  </div>
                  {selected.nickname && <p className="pc-species">{selected.name}</p>}
                  <p className="pc-summary-lv">
                    Lv {getLevel(selected.xp)} &middot; No.{' '}
                    {String(selected.dexId).padStart(3, '0')}
                  </p>

                  <div className="pc-actions">
                    {draft === null ? (
                      <button
                        className="btn btn-secondary pc-small"
                        onClick={() => setDraft(displayName(selected))}
                      >
                        Rename
                      </button>
                    ) : (
                      <form
                        className="pc-rename"
                        onSubmit={(e) => {
                          e.preventDefault()
                          saveNickname()
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

                    <button
                      className={`btn btn-secondary pc-small pc-fav${favourites.has(selected.dexId) ? ' on' : ''}`}
                      onClick={() => onToggleFavourite(selected.dexId)}
                    >
                      {favourites.has(selected.dexId) ? '★ Favourited' : '☆ Favourite'}
                    </button>
                  </div>

                  {selected.canEvolve && evolveOptions.length > 0 && (
                    <button
                      className="btn btn-primary pc-evolve"
                      onClick={() =>
                        onEvolve(selected.dexId, selection?.from === 'party' ? 'party' : 'pc')
                      }
                    >
                      Evolve!
                    </button>
                  )}
                  {selected.canEvolve && evolveOptions.length === 0 && (
                    <p className="pc-hint">Its evolved form is already in your collection.</p>
                  )}
                  {info && (
                    <div className="pc-info">
                      <div className="pc-types">
                        {info.types.map((t) => (
                          <span key={t} className={`type type-${t}`}>
                            {t}
                          </span>
                        ))}
                      </div>
                      <p className="pc-genus">{info.genus}</p>
                      <p className="pc-measure">
                        {info.heightM} m &middot; {info.weightKg} kg
                      </p>
                      <p className="pc-entry">{info.entry}</p>
                    </div>
                  )}
                  {!info && failed && <p className="pc-hint">Pokedex entry unavailable offline.</p>}
                </>
              ) : (
                <>
                  <div className="pc-summary-name">???</div>
                  <p className="pc-summary-lv">No. {String(summaryDex).padStart(3, '0')}</p>
                  <p className="pc-hint">Catch this Pokémon to unlock its entry.</p>
                </>
              )}

              {selection?.from === 'box' && selected && (
                <button
                  className="btn btn-primary pc-action"
                  disabled={!canWithdraw}
                  onClick={withdraw}
                >
                  {canWithdraw ? 'Withdraw' : 'Party full'}
                </button>
              )}
              {selection?.from === 'party' && (
                <button
                  className="btn btn-primary pc-action"
                  disabled={!canDeposit}
                  onClick={deposit}
                >
                  {canDeposit ? 'Deposit' : 'Last Pokémon'}
                </button>
              )}
            </>
          )}
        </aside>
      </div>
    </div>
  )
}
