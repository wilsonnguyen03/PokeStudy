export const BOX_SIZE = 30 // 6 columns x 5 rows, as in the games
export const BOX_COLUMNS = 6
export const PARTY_SIZE = 6

// National dex range each region's boxes cover, starting from its first starter.
export const REGION_DEX: Record<string, [number, number]> = {
  kanto: [1, 151],
  johto: [152, 251],
  hoenn: [252, 386],
  sinnoh: [387, 493],
  unova: [495, 649] // skips Victini (494), who comes before the starters
}

export function boxCount(region: string): number {
  const [start, end] = REGION_DEX[region]
  return Math.ceil((end - start + 1) / BOX_SIZE)
}

// Dex number in a box slot, or null past the end of the region's dex
export function dexAt(region: string, box: number, slot: number): number | null {
  const [start, end] = REGION_DEX[region]
  const id = start + box * BOX_SIZE + slot
  return id <= end ? id : null
}

// Box wallpapers are drawn in CSS (pattern + palette) rather than loaded as images.
const BOX_WALLPAPERS: Record<string, { base: string; pattern: string; tint: string }> = {
  forest: {
    base: '#7fc67a',
    tint: '#6bb468',
    pattern: 'repeating-linear-gradient(45deg, transparent 0 14px, var(--tint) 14px 28px)'
  },
  city: {
    base: '#9db4d8',
    tint: '#8aa3cb',
    pattern: 'repeating-linear-gradient(90deg, transparent 0 18px, var(--tint) 18px 36px)'
  },
  savanna: {
    base: '#f0d48a',
    tint: '#e6c673',
    pattern:
      'radial-gradient(circle at 50% 50%, var(--tint) 0 6px, transparent 7px) 0 0 / 28px 28px'
  },
  volcano: {
    base: '#e8957a',
    tint: '#da7f62',
    pattern: 'repeating-linear-gradient(-45deg, transparent 0 12px, var(--tint) 12px 24px)'
  },
  ocean: {
    base: '#7cc4e8',
    tint: '#66b3dc',
    pattern:
      'radial-gradient(circle at 0 100%, transparent 0 10px, var(--tint) 10px 14px, transparent 14px) 0 0 / 28px 28px'
  },
  space: {
    base: '#4a4a7c',
    tint: '#5e5e96',
    pattern: 'radial-gradient(circle, var(--tint) 0 2px, transparent 3px) 0 0 / 24px 24px'
  }
}

const WALLPAPER_ORDER = Object.keys(BOX_WALLPAPERS)

export function wallpaperFor(box: number): (typeof BOX_WALLPAPERS)[string] {
  return BOX_WALLPAPERS[WALLPAPER_ORDER[box % WALLPAPER_ORDER.length]]
}
