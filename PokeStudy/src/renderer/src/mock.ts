export interface PartyMember {
  dexId: number
  name: string
  nickname?: string
  canEvolve?: boolean // reached its evolution level by levelling up in the party
  evoNew?: boolean // gained that level this session, so offer the evolution when it ends
  xp: number
  hp: number
  maxHp: number
  ball: string
}

export function displayName(m: PartyMember): string {
  return m.nickname || m.name
}
