import { useEffect, useState } from 'react'

export interface PokemonInfo {
  genus: string
  types: string[]
  heightM: number
  weightKg: number
  entry: string
}

const API = 'https://pokeapi.co/api/v2'
const cache = new Map<number, PokemonInfo>()

async function fetchInfo(id: number): Promise<PokemonInfo> {
  const [pokemon, species] = await Promise.all([
    fetch(`${API}/pokemon/${id}`).then((r) => r.json()),
    fetch(`${API}/pokemon-species/${id}`).then((r) => r.json())
  ])
  const genus = species.genera.find((g: { language: { name: string } }) => g.language.name === 'en')
  const entry = species.flavor_text_entries.find(
    (e: { language: { name: string } }) => e.language.name === 'en'
  )
  return {
    genus: genus?.genus ?? '',
    types: pokemon.types.map((t: { type: { name: string } }) => t.type.name),
    heightM: pokemon.height / 10,
    weightKg: pokemon.weight / 10,
    // Flavor text contains form feeds and soft line breaks
    entry: (entry?.flavor_text ?? '').replace(/[\n\f]/g, ' ')
  }
}

// Looks up Pokedex info from PokeAPI; pass null to skip (e.g. species not caught yet)
export function usePokemonInfo(id: number | null): {
  info: PokemonInfo | null
  failed: boolean
} {
  const [fetched, setFetched] = useState<{ id: number; info: PokemonInfo | null }>()

  useEffect(() => {
    if (id === null || cache.has(id)) return
    let live = true
    fetchInfo(id)
      .then((info) => {
        cache.set(id, info)
        if (live) setFetched({ id, info })
      })
      .catch(() => live && setFetched({ id, info: null }))
    return () => {
      live = false
    }
  }, [id])

  if (id === null) return { info: null, failed: false }
  const cached = cache.get(id)
  if (cached) return { info: cached, failed: false }
  return { info: null, failed: fetched?.id === id && fetched.info === null }
}
