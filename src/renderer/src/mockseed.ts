import { maxHpFor } from './game/battle'
import { speciesName } from './game/catching'
import { DEFAULT_SETTINGS } from './hooks/usesettings'
import { PARTY_KEY, PC_KEY } from './hooks/usesave'
import { sampleSessions } from './game/stats'
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

// Web demo: a lived-in save so every screen has something to show. Only written on a visitor's
// first load, so whatever they do afterwards is kept like a normal save.
const xpAt = (level: number, progress = 0): number =>
  level ** 3 + progress * ((level + 1) ** 3 - level ** 3)

function demoMember(
  dexId: number,
  level: number,
  extra: Partial<PartyMember> & { hpRatio?: number; progress?: number } = {}
): PartyMember {
  const { hpRatio = 1, progress = 0, ...rest } = extra
  const maxHp = maxHpFor(dexId, level)
  return {
    dexId,
    name: speciesName(dexId),
    xp: xpAt(level, progress),
    hp: maxHp * hpRatio,
    maxHp,
    ball: 'poke-ball',
    ...rest
  }
}

const DEMO_BALLS = ['poke-ball', 'great-ball', 'ultra-ball', 'premier-ball', 'luxury-ball']

// Kanto species stored in the PC (none of them overlap the party)
const DEMO_PC = [
  1, 4, 7, 10, 13, 16, 19, 21, 27, 29, 32, 35, 37, 39, 41, 43, 46, 48, 50, 52, 54, 56, 58, 63, 66,
  69, 72, 77, 79, 81, 84, 86, 88, 90, 92, 95, 98, 100, 102, 104, 109, 111, 113, 115, 118, 120, 123,
  125, 127, 131, 137, 138, 140, 142, 143, 147
]

export function seedDemo(): void {
  if (localStorage.getItem('pokestudy.settings')) return

  const settings = {
    ...DEFAULT_SETTINGS,
    name: 'Ash',
    trainerId: 'red',
    startRegion: 'kanto',
    regionId: 'kanto',
    badges: { kanto: 3 }
  }

  // Five Pokémon, so the sixth slot still shows the + button. Ivysaur and Magikarp are ready to evolve.
  const party = [
    demoMember(2, 32, { canEvolve: true, progress: 0.2, ball: 'ultra-ball' }),
    demoMember(25, 27, { hpRatio: 0.6, progress: 0.55, ball: 'great-ball', nickname: 'Sparky' }),
    demoMember(17, 31, { hpRatio: 0.85, progress: 0.7 }),
    demoMember(129, 24, { canEvolve: true, progress: 0.4 }),
    demoMember(74, 22, { progress: 0.3, ball: 'premier-ball' })
  ]

  // Eevee is in the PC and ready to evolve, to try the Evolve button there
  const pc: Record<number, PartyMember> = {
    133: demoMember(133, 30, { canEvolve: true, ball: 'luxury-ball', nickname: 'Eevee' })
  }
  DEMO_PC.forEach((dexId, i) => {
    pc[dexId] = demoMember(dexId, 8 + ((i * 7) % 22), { ball: DEMO_BALLS[i % DEMO_BALLS.length] })
  })

  localStorage.setItem('pokestudy.settings', JSON.stringify(settings))
  localStorage.setItem(PARTY_KEY, JSON.stringify(party))
  localStorage.setItem(PC_KEY, JSON.stringify(pc))
  localStorage.setItem('pokestudy.favourites', JSON.stringify([25, 133, 129, 143, 4, 131]))
  localStorage.setItem('pokestudy.history', JSON.stringify(sampleSessions()))
}
