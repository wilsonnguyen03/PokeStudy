import { useState } from 'react'

const KEY = 'pokestudy.favourites'

function load(): number[] {
  try {
    const raw = localStorage.getItem(KEY)
    if (raw) return JSON.parse(raw)
  } catch {
    // Unreadable or missing: start with none
  }
  return []
}

// Favourite species by dex number, saved on this computer
export function useFavourites(): [
  Set<number>,
  (dexId: number) => void,
  (from: number, to: number) => void
] {
  const [list, setList] = useState<number[]>(load)

  function save(next: number[]): void {
    setList(next)
    try {
      localStorage.setItem(KEY, JSON.stringify(next))
    } catch {
      // Storage unavailable: favourites last for this session only
    }
  }

  function toggle(dexId: number): void {
    save(list.includes(dexId) ? list.filter((id) => id !== dexId) : [...list, dexId])
  }

  // A favourite stays a favourite after it evolves
  function move(from: number, to: number): void {
    if (list.includes(from)) save([...list.filter((id) => id !== from), to])
  }

  return [new Set(list), toggle, move]
}
