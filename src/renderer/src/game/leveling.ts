export function xpForLevel(level: number): number {
  return level ** 3
}

export function getLevel(xp: number): number {
  let level = 1
  while (level < 100 && xpForLevel(level + 1) <= xp) level++
  return level
}

// How far through the current level, from 0 to 1. Drives the EXP bar.
export function levelProgress(xp: number): number {
  const level = getLevel(xp)
  if (level >= 100) return 1
  const start = xpForLevel(level)
  const end = xpForLevel(level + 1)
  return Math.max(0, (xp - start) / (end - start))
}
