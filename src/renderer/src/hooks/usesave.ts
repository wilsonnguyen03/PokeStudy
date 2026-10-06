import { useEffect, useState, type Dispatch, type SetStateAction } from 'react'
import type { PartyMember } from '../mock'

export const PARTY_KEY = 'pokestudy.party'
export const PC_KEY = 'pokestudy.pc'

function read<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key)
    if (raw) return JSON.parse(raw) as T
  } catch {
    // Unreadable or missing: start empty
  }
  return fallback
}

function usePersisted<T>(key: string, initial: () => T): [T, Dispatch<SetStateAction<T>>] {
  const [value, setValue] = useState<T>(initial)

  useEffect(() => {
    try {
      localStorage.setItem(key, JSON.stringify(value))
    } catch {
      // Storage unavailable: progress lasts for this session only
    }
  }, [key, value])

  return [value, setValue]
}

// Your party and PC boxes, saved on this computer. Empty until the setup screen creates a starter.
export function useParty(): [PartyMember[], Dispatch<SetStateAction<PartyMember[]>>] {
  return usePersisted<PartyMember[]>(PARTY_KEY, () => read<PartyMember[]>(PARTY_KEY, []))
}

export function usePc(): [
  Record<number, PartyMember>,
  Dispatch<SetStateAction<Record<number, PartyMember>>>
] {
  return usePersisted<Record<number, PartyMember>>(PC_KEY, () =>
    read<Record<number, PartyMember>>(PC_KEY, {})
  )
}
