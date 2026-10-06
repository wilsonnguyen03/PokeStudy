import { REGIONS } from './regions'

export const BADGES_TO_FINISH = 8

export interface RegionProgress {
  startRegion: string | null // null until the player picks one on first launch
  badges: Record<string, number> // badges earned per region
}

function regionFinished(progress: RegionProgress, id: string): boolean {
  return (progress.badges[id] ?? 0) >= BADGES_TO_FINISH
}

// Only the starting region is open until it is finished; then every region opens
export function regionUnlocked(progress: RegionProgress, id: string): boolean {
  if (!progress.startRegion || !(id in REGIONS)) return false
  return id === progress.startRegion || regionFinished(progress, progress.startRegion)
}

export const STARTERS: Record<string, number[]> = {
  kanto: [1, 4, 7],
  johto: [152, 155, 158],
  hoenn: [252, 255, 258],
  sinnoh: [387, 390, 393],
  unova: [495, 498, 501]
}
