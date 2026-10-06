import { POKE_RAW } from './pokedata'
import { getLevel } from './leveling'
import type { GymLeader } from './gyms'
import type { PartyMember } from '../mock'

const TYPE_NAMES = [
  'normal',
  'fire',
  'water',
  'electric',
  'grass',
  'ice',
  'fighting',
  'poison',
  'ground',
  'flying',
  'psychic',
  'bug',
  'rock',
  'ghost',
  'dragon',
  'dark',
  'steel',
  'fairy'
] as const

export type TypeName = (typeof TYPE_NAMES)[number]

// Attacking type -> [super effective, not very effective, no effect] defenders
const CHART: Record<TypeName, [TypeName[], TypeName[], TypeName[]]> = {
  normal: [[], ['rock', 'steel'], ['ghost']],
  fire: [['grass', 'ice', 'bug', 'steel'], ['fire', 'water', 'rock', 'dragon'], []],
  water: [['fire', 'ground', 'rock'], ['water', 'grass', 'dragon'], []],
  electric: [['water', 'flying'], ['electric', 'grass', 'dragon'], ['ground']],
  grass: [
    ['water', 'ground', 'rock'],
    ['fire', 'grass', 'poison', 'flying', 'bug', 'dragon', 'steel'],
    []
  ],
  ice: [['grass', 'ground', 'flying', 'dragon'], ['fire', 'water', 'ice', 'steel'], []],
  fighting: [
    ['normal', 'ice', 'rock', 'dark', 'steel'],
    ['poison', 'flying', 'psychic', 'bug', 'fairy'],
    ['ghost']
  ],
  poison: [['grass', 'fairy'], ['poison', 'ground', 'rock', 'ghost'], ['steel']],
  ground: [['fire', 'electric', 'poison', 'rock', 'steel'], ['grass', 'bug'], ['flying']],
  flying: [['grass', 'fighting', 'bug'], ['electric', 'rock', 'steel'], []],
  psychic: [['fighting', 'poison'], ['psychic', 'steel'], ['dark']],
  bug: [
    ['grass', 'psychic', 'dark'],
    ['fire', 'fighting', 'poison', 'flying', 'ghost', 'steel', 'fairy'],
    []
  ],
  rock: [['fire', 'ice', 'flying', 'bug'], ['fighting', 'ground', 'steel'], []],
  ghost: [['psychic', 'ghost'], ['dark'], ['normal']],
  dragon: [['dragon'], ['steel'], ['fairy']],
  dark: [['psychic', 'ghost'], ['fighting', 'dark', 'fairy'], []],
  steel: [['ice', 'rock', 'fairy'], ['fire', 'water', 'electric', 'steel'], []],
  fairy: [['fighting', 'dragon', 'dark'], ['fire', 'poison', 'steel'], []]
}

function typeMultiplier(attack: TypeName, defend: TypeName): number {
  const [sup, nve, none] = CHART[attack]
  if (none.includes(defend)) return 0
  if (sup.includes(defend)) return 2
  if (nve.includes(defend)) return 0.5
  return 1
}

export function against(attack: TypeName, defenders: TypeName[]): number {
  return defenders.reduce((m, d) => m * typeMultiplier(attack, d), 1)
}

// Types that hit the given type(s) for more than normal damage
export function weaknessesOf(defenders: TypeName[]): TypeName[] {
  return TYPE_NAMES.filter((t) => against(t, defenders) > 1)
}

interface Species {
  types: TypeName[]
  hp: number
  atk: number
  def: number
  spa: number
  spd: number
  spe: number
}

const cache = new Map<number, Species>()

export function speciesOf(dexId: number): Species {
  let s = cache.get(dexId)
  if (!s) {
    const raw = POKE_RAW[dexId - 1] ?? '0,-1,60,60,60,60,60,60'
    const [t1, t2, hp, atk, def, spa, spd, spe] = raw.split(',').map(Number)
    s = {
      types: [TYPE_NAMES[t1], ...(t2 >= 0 ? [TYPE_NAMES[t2]] : [])],
      hp,
      atk,
      def,
      spa,
      spd,
      spe
    }
    cache.set(dexId, s)
  }
  return s
}

// ------------------------------------------------------------------ simulation

// The gym leader's Pokémon get a stat edge, since they run full movesets and held items
const LEADER_BOOST = 1.75
const MOVE_POWER = 80
const STAB = 1.5

export interface Fighter {
  dexId: number
  name: string
  level: number
}

interface Combatant extends Fighter {
  types: TypeName[]
  maxHp: number
  hp: number
  offence: number
  physical: boolean
  spe: number
  atk: number
  spa: number
  def: number
  spd: number
}

// Full HP of a species at a level (used for new catches and evolutions)
export function maxHpFor(dexId: number, level: number): number {
  return Math.floor(((2 * speciesOf(dexId).hp + 31) * level) / 100) + level + 10
}

const stat = (base: number, level: number): number =>
  Math.floor(((2 * base + 31) * level) / 100) + 5

function build(f: Fighter, hpRatio: number, boost: number): Combatant {
  const s = speciesOf(f.dexId)
  const maxHp = Math.floor(((2 * s.hp + 31) * f.level) / 100) + f.level + 10
  const scaled = (n: number): number => stat(n, f.level) * boost
  const atk = scaled(s.atk)
  const spa = scaled(s.spa)
  return {
    ...f,
    types: s.types,
    maxHp: Math.round(maxHp * boost),
    hp: Math.round(maxHp * boost * hpRatio),
    atk,
    spa,
    def: scaled(s.def),
    spd: scaled(s.spd),
    offence: Math.max(atk, spa),
    physical: atk >= spa,
    spe: stat(s.spe, f.level)
  }
}

// Damage of one attack: the attacker uses whichever of its own types hits hardest (same-type attack bonus)
function damage(a: Combatant, d: Combatant): number {
  const mult = Math.max(...a.types.map((t) => against(t, d.types)))
  if (mult === 0) return 1
  const defStat = a.physical ? d.def : d.spd
  const base =
    Math.floor(Math.floor(((2 * a.level) / 5 + 2) * MOVE_POWER * (a.offence / defStat)) / 50) + 2
  return Math.max(1, Math.floor(base * STAB * mult))
}

export interface Segment {
  me: Fighter
  foe: Fighter
  loser: 'me' | 'foe'
  meStart: number
  meEnd: number
  foeStart: number
  foeEnd: number
}

export interface BattleResult {
  won: boolean
  segments: Segment[]
}

// Pick whichever standing Pokémon fares best against the foe: lasts longest relative to how fast it KOs
function bestAgainst(team: Combatant[], foe: Combatant): Combatant {
  const score = (m: Combatant): number => {
    const turnsToKo = foe.hp / damage(m, foe)
    const turnsToSurvive = m.hp / damage(foe, m)
    const speedEdge = m.spe > foe.spe ? 0.5 : 0
    return turnsToSurvive - turnsToKo + speedEdge
  }
  return team.reduce((best, m) => (score(m) > score(best) ? m : best))
}

export function simulate(party: PartyMember[], leader: GymLeader, cap: number): BattleResult {
  const mine = party
    .filter((m) => m.hp > 0.5)
    .map((m) =>
      build(
        { dexId: m.dexId, name: m.nickname || m.name, level: Math.min(getLevel(m.xp), cap) },
        m.hp / m.maxHp,
        1
      )
    )
  const foes = leader.team.map((t) =>
    build({ dexId: t.dexId, name: t.name, level: t.level }, 1, LEADER_BOOST)
  )

  const segments: Segment[] = []
  let foeIndex = 0

  while (mine.some((m) => m.hp > 0) && foeIndex < foes.length) {
    const foe = foes[foeIndex]
    const me = bestAgainst(
      mine.filter((m) => m.hp > 0),
      foe
    )
    const meStart = me.hp / me.maxHp
    const foeStart = foe.hp / foe.maxHp

    while (me.hp > 0 && foe.hp > 0) {
      const iGoFirst = me.spe > foe.spe
      const order: [Combatant, Combatant][] = iGoFirst
        ? [
            [me, foe],
            [foe, me]
          ]
        : [
            [foe, me],
            [me, foe]
          ]
      for (const [att, def] of order) {
        if (att.hp <= 0 || def.hp <= 0) continue
        def.hp = Math.max(0, def.hp - damage(att, def))
      }
    }

    segments.push({
      me: { dexId: me.dexId, name: me.name, level: me.level },
      foe: { dexId: foe.dexId, name: foe.name, level: foe.level },
      loser: me.hp <= 0 ? 'me' : 'foe',
      meStart,
      meEnd: me.hp / me.maxHp,
      foeStart,
      foeEnd: foe.hp / foe.maxHp
    })
    if (foe.hp <= 0) foeIndex++
  }

  return { won: foeIndex >= foes.length, segments }
}

// ------------------------------------------------------------------ matchup preview

export type MatchupRating = 'Great' | 'Good' | 'Even' | 'Poor' | 'Terrible'

// How the types line up (not the outcome): your best attacks against the leader's team versus theirs against yours
export function matchupRating(party: PartyMember[], leader: GymLeader): MatchupRating {
  const mine = party.filter((m) => m.hp > 0.5).map((m) => speciesOf(m.dexId).types)
  const theirs = leader.team.map((t) => speciesOf(t.dexId).types)
  if (mine.length === 0) return 'Terrible'

  let offence = 0
  let defence = 0
  let pairs = 0
  for (const a of mine) {
    for (const b of theirs) {
      offence += Math.max(...a.map((t) => against(t, b)))
      defence += Math.max(...b.map((t) => against(t, a)))
      pairs++
    }
  }
  const score = Math.log2((offence / pairs + 0.1) / (defence / pairs + 0.1))
  if (score >= 0.6) return 'Great'
  if (score >= 0.2) return 'Good'
  if (score > -0.2) return 'Even'
  if (score > -0.6) return 'Poor'
  return 'Terrible'
}
