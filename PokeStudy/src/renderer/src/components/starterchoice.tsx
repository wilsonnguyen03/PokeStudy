import { speciesOf } from '../game/battle'
import { speciesName } from '../game/catching'
import { STARTERS } from '../game/progress'
import { REGIONS } from '../game/regions'
import { artwork } from '../sprites'
import { useState } from 'react'

interface ChoiceProps {
  regionId: string
  value: number | null
  onChange: (dexId: number) => void
}

// Pick one of the region's three starters; it joins your party at level 1
export function StarterChoice({ regionId, value, onChange }: ChoiceProps): React.JSX.Element {
  return (
    <div className="starter-grid">
      {STARTERS[regionId].map((dex) => (
        <button
          key={dex}
          className={`starter-card${value === dex ? ' selected' : ''}`}
          style={{ '--region': REGIONS[regionId].colour } as React.CSSProperties}
          onClick={() => onChange(dex)}
        >
          <img src={artwork(dex)} alt="" />
          <span className="starter-name">{speciesName(dex)}</span>
          <span className="starter-types">
            {speciesOf(dex).types.map((t) => (
              <span key={t} className={`type type-${t}`}>
                {t}
              </span>
            ))}
          </span>
          <span className="starter-lv">Level 1</span>
        </button>
      ))}
    </div>
  )
}

// Shown when a save has no Pokémon at all (for example one made before starters existed)
export function StarterScreen({
  regionId,
  onPick
}: {
  regionId: string
  onPick: (dexId: number) => void
}): React.JSX.Element {
  const [value, setValue] = useState<number | null>(null)

  return (
    <div className="setup">
      <div className="setup-body starter-solo">
        <h1 className="setup-title">Choose your starter</h1>
        <p className="setup-sub">
          You don&apos;t have any Pokémon yet. Pick a partner to begin; it joins your party at level
          1.
        </p>
        <StarterChoice regionId={regionId} value={value} onChange={setValue} />
      </div>
      <div className="setup-nav">
        <span />
        <button
          className="btn btn-primary"
          disabled={value === null}
          onClick={() => value !== null && onPick(value)}
        >
          {value === null ? 'Pick a starter' : 'Begin!'}
        </button>
      </div>
    </div>
  )
}
