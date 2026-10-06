export interface TrainerOption {
  id: string // the sprite's file name on Showdown
  name: string
  game: string
}

export const TRAINERS: TrainerOption[] = [
  { id: 'red', name: 'Red', game: 'FireRed' },
  { id: 'kris', name: 'Kris', game: 'Crystal' },
  { id: 'ethan', name: 'Ethan', game: 'HeartGold' },
  { id: 'lyra', name: 'Lyra', game: 'SoulSilver' },
  { id: 'brendan', name: 'Brendan', game: 'Emerald' },
  { id: 'may', name: 'May', game: 'Emerald' },
  { id: 'lucas', name: 'Lucas', game: 'Platinum' },
  { id: 'dawn', name: 'Dawn', game: 'Platinum' },
  { id: 'hilbert', name: 'Hilbert', game: 'Black & White' },
  { id: 'hilda', name: 'Hilda', game: 'Black & White' },
  { id: 'nate', name: 'Nate', game: 'Black 2 & White 2' },
  { id: 'rosa', name: 'Rosa', game: 'Black 2 & White 2' },
  { id: 'calem', name: 'Calem', game: 'X & Y' },
  { id: 'serena', name: 'Serena', game: 'X & Y' },
  { id: 'elio', name: 'Elio', game: 'Sun & Moon' },
  { id: 'selene', name: 'Selene', game: 'Sun & Moon' },
  { id: 'victor', name: 'Victor', game: 'Sword & Shield' },
  { id: 'gloria', name: 'Gloria', game: 'Sword & Shield' }
]
