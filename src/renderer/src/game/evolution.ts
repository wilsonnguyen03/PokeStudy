import { EVOLUTIONS } from './evolutions'

// Whether a species can evolve at (or below) this level, ignoring who already owns the result
export function hasEvolutionAt(dexId: number, level: number): boolean {
  return (EVOLUTIONS[dexId] ?? []).some(([, at]) => level >= at)
}

// Species this Pokemon could turn into right now. A species you already own is left out,
// because each species is stored once.
export function evolutionOptions(dexId: number, level: number, owned: Set<number>): number[] {
  return (EVOLUTIONS[dexId] ?? [])
    .filter(([to, at]) => level >= at && !owned.has(to))
    .map(([to]) => to)
}

// Branching families (Eevee) pick one of their options at random
export function pickEvolution(options: number[]): number {
  return options[Math.floor(Math.random() * options.length)]
}
