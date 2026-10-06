const BASE = 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon'

export const sprite = (id: number): string => `${BASE}/${id}.png`
export const artwork = (id: number): string => `${BASE}/other/official-artwork/${id}.png`

const TRAINER_BASE = 'https://play.pokemonshowdown.com/sprites/trainers'

export const trainerSprite = (id: string): string => `${TRAINER_BASE}/${id}.png`

const ITEM_BASE = 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items'

export const ballSprite = (ball: string): string => `${ITEM_BASE}/${ball}.png`
