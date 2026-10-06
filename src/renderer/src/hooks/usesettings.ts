import { useState } from 'react'
import { SCENE_THEMES, type BackgroundId } from '../game/backgrounds'
import { REGIONS } from '../game/regions'
import { TRAINERS } from '../game/trainers'
import { CUSTOM_LIMITS, PLAN_OPTIONS, type StudyMode } from '../game/stamina'

export interface Settings {
  name: string
  trainerId: string
  background: BackgroundId
  regionId: string // region shown on the home screen
  startRegion: string | null // chosen once on first launch; null means not chosen yet
  badges: Record<string, number>
  dailyGoalMin: number
  studyMode: StudyMode
  planMin: number // timer length, or the planned block in stopwatch mode
  gymCooldownUntil: number // timestamp; no gym challenges until then (set after a defeat)
  customTimer: boolean // timer mode uses the custom study/break schedule
  customStudyMin: number
  customBreakMin: number
  customBreaks: number
}

export const DEFAULT_SETTINGS: Settings = {
  name: '', // chosen on the setup screen
  trainerId: 'red',
  background: 'meadow',
  regionId: 'kanto',
  startRegion: null,
  badges: {},
  dailyGoalMin: 120,
  studyMode: 'stopwatch',
  planMin: 60,
  gymCooldownUntil: 0,
  customTimer: false,
  customStudyMin: 120,
  customBreakMin: 10,
  customBreaks: 1
}

const KEY = 'pokestudy.settings'

// Drops values that no longer exist (e.g. a removed character) so old saves can't break the app
function sanitise(saved: Partial<Settings>): Settings {
  const merged = { ...DEFAULT_SETTINGS, ...saved }
  if (!TRAINERS.some((t) => t.id === merged.trainerId))
    merged.trainerId = DEFAULT_SETTINGS.trainerId
  if (!(merged.background in SCENE_THEMES)) merged.background = DEFAULT_SETTINGS.background
  if (!(merged.regionId in REGIONS)) merged.regionId = DEFAULT_SETTINGS.regionId
  if (merged.startRegion !== null && !(merged.startRegion in REGIONS)) merged.startRegion = null
  if (merged.studyMode !== 'stopwatch' && merged.studyMode !== 'timer')
    merged.studyMode = DEFAULT_SETTINGS.studyMode
  if (!PLAN_OPTIONS.includes(merged.planMin)) merged.planMin = DEFAULT_SETTINGS.planMin
  if (typeof merged.gymCooldownUntil !== 'number') merged.gymCooldownUntil = 0
  merged.customTimer = merged.customTimer === true
  const clamp = (n: unknown, [lo, hi]: readonly [number, number], fallback: number): number =>
    typeof n === 'number' && Number.isFinite(n)
      ? Math.min(hi, Math.max(lo, Math.round(n)))
      : fallback
  merged.customStudyMin = clamp(
    merged.customStudyMin,
    CUSTOM_LIMITS.study,
    DEFAULT_SETTINGS.customStudyMin
  )
  merged.customBreakMin = clamp(
    merged.customBreakMin,
    CUSTOM_LIMITS.breakLen,
    DEFAULT_SETTINGS.customBreakMin
  )
  merged.customBreaks = clamp(
    merged.customBreaks,
    CUSTOM_LIMITS.breaks,
    DEFAULT_SETTINGS.customBreaks
  )
  return merged
}

function load(): Settings {
  try {
    const raw = localStorage.getItem(KEY)
    if (raw) return sanitise(JSON.parse(raw))
  } catch {
    // Unreadable or missing: fall back to defaults
  }
  return DEFAULT_SETTINGS
}

export function useSettings(): [Settings, (patch: Partial<Settings>) => void, () => void] {
  const [settings, setSettings] = useState<Settings>(load)

  function persist(next: Settings): void {
    setSettings(next)
    try {
      localStorage.setItem(KEY, JSON.stringify(next))
    } catch {
      // Storage unavailable: settings last for this session only
    }
  }

  // Restores the background and daily goal; the trainer, region and badge progress are kept
  function reset(): void {
    const { background, dailyGoalMin } = DEFAULT_SETTINGS
    persist({ ...settings, background, dailyGoalMin })
  }

  return [settings, (patch) => persist({ ...settings, ...patch }), reset]
}
