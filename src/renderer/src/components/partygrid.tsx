import type { PartyMember } from '../mock'
import PartySlot from './partyslot'

interface Props {
  party: PartyMember[]
  onAddPokemon?: () => void
  levelCap?: number
  showAdd?: boolean // the + in empty slots; hidden while studying
  evolvable?: Set<number> // species in the party that can evolve right now
  onEvolve?: (dexId: number) => void // offered on those Pokémon, only while idle
}

export default function PartyGrid({
  party,
  onAddPokemon,
  levelCap,
  showAdd = true,
  evolvable,
  onEvolve
}: Props): React.JSX.Element {
  const slots = Array.from({ length: 6 }, (_, i) => party[i] ?? null)

  return (
    <div className="party-grid">
      {slots.map((member, i) =>
        member ? (
          <PartySlot
            key={i}
            member={member}
            levelCap={levelCap}
            onEvolve={
              showAdd && evolvable?.has(member.dexId) && onEvolve
                ? () => onEvolve(member.dexId)
                : undefined
            }
          />
        ) : (
          <div key={i} className="slot empty">
            {showAdd && (
              <button className="slot-add" onClick={onAddPokemon} title="Add a Pokémon">
                +
              </button>
            )}
          </div>
        )
      )}
    </div>
  )
}
