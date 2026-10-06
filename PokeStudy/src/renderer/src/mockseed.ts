import { maxHpFor } from './game/battle'
import { speciesName } from './game/catching'
import { DEFAULT_SETTINGS } from './hooks/usesettings'
import { PARTY_KEY, PC_KEY } from './hooks/usesave'
import type { PartyMember } from './mock'

// Dev-only (npm run dev:mock): replaces the save with a small one for trying out evolutions.
const level15 = (dexId: number, extra: Partial<PartyMember> = {}): PartyMember => {
  const maxHp = maxHpFor(dexId, 15)
  return {
    dexId,
    name: speciesName(dexId),
    xp: 15 ** 3,
    hp: maxHp,
    maxHp,
    ball: 'poke-ball',
    ...extra
  }
}

export function seedMock(): void {
  const settings = {
    ...DEFAULT_SETTINGS,
    name: 'Mock',
    startRegion: 'kanto',
    regionId: 'kanto',
    badges: {}
  }
  // Caterpie is ready now (press Start then End, or tap its Evolve! tag); Charmander is one level short.
  const party = [level15(10, { canEvolve: true, evoNew: true }), level15(4)]
  const pc = { 13: level15(13, { canEvolve: true }) } // Weedle in the PC, to try the PC's Evolve button

  localStorage.setItem('pokestudy.settings', JSON.stringify(settings))
  localStorage.setItem(PARTY_KEY, JSON.stringify(party))
  localStorage.setItem(PC_KEY, JSON.stringify(pc))
}
