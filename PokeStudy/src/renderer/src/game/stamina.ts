// Tuning for the study/rest loop. All times are in minutes unless the name says otherwise.

export type StudyMode = 'stopwatch' | 'timer'

export const PLAN_OPTIONS = [30, 60, 90, 120, 180, 240]

const STAMINA_MIN = 60 // the whole party is worn out after this much studying
const LONG_STAMINA_MIN = 120 // custom plans of 4 hours or more
const LONG_PLAN_MIN = 240
const MIN_HEAL_SEC = 120 // even a very short session needs a short rest

export type StudyPlan =
  | { kind: 'stopwatch' }
  | { kind: 'timer'; totalMin: number }
  | { kind: 'custom'; totalMin: number; breakMin: number; breaks: number }

export const CUSTOM_LIMITS = { study: [15, 600], breakLen: [1, 60], breaks: [0, 10] } as const
const MIN_BLOCK_MIN = 10 // shortest study block between breaks

interface PlanSettings {
  studyMode: StudyMode
  planMin: number
  customTimer: boolean
  customStudyMin: number
  customBreakMin: number
  customBreaks: number
}

export function buildPlan(s: PlanSettings): StudyPlan {
  if (s.studyMode === 'stopwatch') return { kind: 'stopwatch' }
  if (!s.customTimer) return { kind: 'timer', totalMin: s.planMin }
  const maxBreaks = Math.max(0, Math.floor(s.customStudyMin / MIN_BLOCK_MIN) - 1)
  return {
    kind: 'custom',
    totalMin: s.customStudyMin,
    breakMin: s.customBreakMin,
    breaks: Math.min(s.customBreaks, maxBreaks)
  }
}

// How long the party lasts: an hour of studying, or two hours on a custom plan of 4+ hours
export function staminaSeconds(plan: StudyPlan): number {
  const long = plan.kind === 'custom' && plan.totalMin >= LONG_PLAN_MIN
  return (long ? LONG_STAMINA_MIN : STAMINA_MIN) * 60
}

export function planSummary(plan: StudyPlan): string {
  if (plan.kind === 'stopwatch') return 'Stopwatch'
  if (plan.kind === 'timer') return `Timer ${formatPlan(plan.totalMin)}`
  const blocks = plan.breaks + 1
  return `Custom: ${blocks} block${blocks === 1 ? '' : 's'} of ${Math.round(plan.totalMin / blocks)} min, ${plan.breaks} break${plan.breaks === 1 ? '' : 's'} of ${plan.breakMin} min`
}
// Rest needed to fully heal a party drained by studying this long: 1h -> 5m, 2h -> 10m, 3h+ -> 30m.
export function healSeconds(studiedSec: number): number {
  const m = studiedSec / 60
  let rest: number
  if (m <= 60) rest = (m / 60) * 5
  else if (m <= 120) rest = 5 + ((m - 60) / 60) * 5
  else if (m <= 180) rest = 10 + ((m - 120) / 60) * 20
  else rest = 30
  return Math.max(MIN_HEAL_SEC, rest * 60)
}

export const HEAL_TABLE: { study: string; rest: string }[] = [
  { study: '1 hour', rest: '5 min' },
  { study: '2 hours', rest: '10 min' },
  { study: '3+ hours', rest: '30 min' }
]

export function formatPlan(min: number): string {
  if (min < 60) return `${min} min`
  const h = min / 60
  return `${h} hr${h === 1 ? '' : 's'}`
}

export function formatClock(sec: number): string {
  const total = Math.max(0, Math.ceil(sec))
  const h = Math.floor(total / 3600)
  const m = Math.floor((total % 3600) / 60)
  const s = total % 60
  const pad = (n: number): string => String(n).padStart(2, '0')
  return `${pad(h)}:${pad(m)}:${pad(s)}`
}
