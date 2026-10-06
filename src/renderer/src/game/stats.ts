export interface Session {
  end: number // timestamp when the session finished
  seconds: number // time studied
}

export interface DayTotal {
  key: string
  date: Date
  sec: number
}

const DAY_MS = 86_400_000

function dayKey(d: Date): string {
  const pad = (n: number): string => String(n).padStart(2, '0')
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`
}

function startOfDay(d: Date): Date {
  return new Date(d.getFullYear(), d.getMonth(), d.getDate())
}

// Seconds studied per local calendar day
export function dailyTotals(sessions: Session[]): Map<string, number> {
  const totals = new Map<string, number>()
  for (const s of sessions) {
    const key = dayKey(new Date(s.end))
    totals.set(key, (totals.get(key) ?? 0) + s.seconds)
  }
  return totals
}

// The last `n` days ending today, oldest first
export function lastDays(totals: Map<string, number>, n: number, today = new Date()): DayTotal[] {
  const base = startOfDay(today)
  return Array.from({ length: n }, (_, i) => {
    const date = new Date(base.getFullYear(), base.getMonth(), base.getDate() - (n - 1 - i))
    const key = dayKey(date)
    return { key, date, sec: totals.get(key) ?? 0 }
  })
}

export interface Summary {
  totalSec: number
  todaySec: number
  weekSec: number
  sessions: number
  longestSessionSec: number
  activeDays: number
  avgPerActiveDaySec: number
  bestDay: DayTotal | null
  streak: number
  bestStreak: number
}

export function summarise(sessions: Session[], today = new Date()): Summary {
  const totals = dailyTotals(sessions)
  const totalSec = sessions.reduce((sum, s) => sum + s.seconds, 0)
  const days = lastDays(totals, 7, today)

  let bestDay: DayTotal | null = null
  for (const [key, sec] of totals) {
    if (!bestDay || sec > bestDay.sec) bestDay = { key, sec, date: new Date(`${key}T00:00:00`) }
  }

  // Current streak counts back from today, or from yesterday if nothing is logged yet today
  let streak = 0
  const base = startOfDay(today)
  for (let i = 0; i < 4000; i++) {
    const d = new Date(base.getFullYear(), base.getMonth(), base.getDate() - i)
    if ((totals.get(dayKey(d)) ?? 0) > 0) streak++
    else if (i > 0) break
  }

  let bestStreak = 0
  let run = 0
  const keys = [...totals.keys()].sort()
  let prev: number | null = null
  for (const key of keys) {
    const t = new Date(`${key}T00:00:00`).getTime()
    run = prev !== null && Math.round((t - prev) / DAY_MS) === 1 ? run + 1 : 1
    bestStreak = Math.max(bestStreak, run)
    prev = t
  }

  return {
    totalSec,
    todaySec: totals.get(dayKey(today)) ?? 0,
    weekSec: days.reduce((sum, d) => sum + d.sec, 0),
    sessions: sessions.length,
    longestSessionSec: sessions.reduce((max, s) => Math.max(max, s.seconds), 0),
    activeDays: totals.size,
    avgPerActiveDaySec: totals.size ? totalSec / totals.size : 0,
    bestDay,
    streak,
    bestStreak
  }
}

export function formatDuration(sec: number): string {
  const m = Math.round(sec / 60)
  if (m < 60) return `${m}m`
  const h = Math.floor(m / 60)
  const rest = m % 60
  return rest ? `${h}h ${rest}m` : `${h}h`
}

// Made-up history for previewing the page; never saved
export function sampleSessions(today = new Date()): Session[] {
  const base = startOfDay(today)
  const out: Session[] = []
  for (let i = 0; i < 100; i++) {
    const roll = (i * 37 + 11) % 10
    if (roll < 3) continue // days off
    const date = new Date(base.getFullYear(), base.getMonth(), base.getDate() - i, 19)
    const blocks = 1 + (i % 3)
    for (let b = 0; b < blocks; b++) {
      const minutes = 25 + ((i * 13 + b * 29) % 60)
      out.push({ end: date.getTime() + b * 3_600_000, seconds: minutes * 60 })
    }
  }
  return out
}
