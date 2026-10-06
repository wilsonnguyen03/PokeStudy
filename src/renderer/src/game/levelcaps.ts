// Highest level a Pokémon can reach while working toward each badge, per region.
// Index 0 applies before the first badge; with all 8 earned the last value stays in effect.
// Each cap sits just above the strongest Pokémon of the leader it leads up to.
const LEVEL_CAPS: Record<string, number[]> = {
  kanto: [16, 22, 26, 32, 44, 44, 48, 52],
  johto: [14, 18, 20, 26, 31, 36, 36, 42],
  hoenn: [16, 21, 26, 31, 33, 35, 43, 48],
  sinnoh: [15, 23, 33, 38, 38, 40, 41, 52],
  unova: [15, 21, 24, 30, 32, 36, 40, 44]
}

export function levelCap(regionId: string, badgesEarned: number): number {
  const caps = LEVEL_CAPS[regionId] ?? LEVEL_CAPS.kanto
  return caps[Math.min(Math.max(badgesEarned, 0), caps.length - 1)]
}
