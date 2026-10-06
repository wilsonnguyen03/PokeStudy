import { useState } from 'react'
import type { Session } from '../game/stats'

const KEY = 'pokestudy.history'
const MIN_SECONDS = 30 // ignore accidental starts

function load(): Session[] {
  try {
    const raw = localStorage.getItem(KEY)
    if (raw) return JSON.parse(raw)
  } catch {
    // Unreadable or missing: start fresh
  }
  return []
}

// Every finished study session, saved on this computer
export function useHistory(): [Session[], (seconds: number) => void] {
  const [sessions, setSessions] = useState<Session[]>(load)

  function record(seconds: number): void {
    if (seconds < MIN_SECONDS) return
    const next = [...sessions, { end: Date.now(), seconds: Math.round(seconds) }]
    setSessions(next)
    try {
      localStorage.setItem(KEY, JSON.stringify(next))
    } catch {
      // Storage unavailable: history lasts for this session only
    }
  }

  return [sessions, record]
}
