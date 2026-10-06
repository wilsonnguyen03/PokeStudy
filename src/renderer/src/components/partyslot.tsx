import { displayName, type PartyMember } from '../mock'
import { getLevel, levelProgress } from '../game/leveling'
import { artwork, ballSprite } from '../sprites'

function hpColour(ratio: number): string {
  if (ratio > 0.5) return 'hp-high'
  if (ratio > 0.2) return 'hp-mid'
  return 'hp-low'
}

interface Props {
  member: PartyMember
  levelCap?: number
  onEvolve?: () => void // shown only when the Pokémon can evolve right now
}

export default function PartySlot({ member, levelCap, onEvolve }: Props): React.JSX.Element {
  const level = getLevel(member.xp)
  const hpRatio = member.hp / member.maxHp
  const atCap = levelCap !== undefined && level >= levelCap

  return (
    <div className={hpRatio <= 0 ? 'slot fainted' : 'slot'}>
      {onEvolve && (
        <button className="slot-evolve" onClick={onEvolve} title="This Pokémon is ready to evolve">
          Evolve!
        </button>
      )}
      <div className="slot-avatar">
        <img className="slot-pokemon" src={artwork(member.dexId)} alt={displayName(member)} />
      </div>

      <div className="slot-info">
        <div className="slot-name-row">
          <img className="name-ball" src={ballSprite(member.ball)} alt="" />
          <span className="slot-name">{displayName(member)}</span>
        </div>
        <span className="slot-lv">Lv {level}</span>

        <div className="bar-row">
          <span className="bar-label">HP</span>
          <div className="bar-track">
            <div
              className={`bar-fill ${hpColour(hpRatio)}`}
              style={{ width: `${hpRatio * 100}%` }}
            />
          </div>
        </div>

        <div className="bar-row">
          <span className="bar-label">EXP</span>
          <div className="bar-track">
            <div
              className={atCap ? 'bar-fill exp capped' : 'bar-fill exp'}
              style={{ width: `${atCap ? 100 : levelProgress(member.xp) * 100}%` }}
            />
          </div>
        </div>
      </div>
    </div>
  )
}
