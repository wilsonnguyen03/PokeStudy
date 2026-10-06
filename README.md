# PokéStudy

A desktop study timer where your Pokémon study with you. Focus sessions earn them XP and bring wild Pokémon to catch, and breaks heal them. Take on gym leaders across five regions as you go.

Built with Electron, React and TypeScript.

## Run it

```bash
npm install
npm run dev
```

`npm run dev:mock` starts with a throwaway save that has a Pokémon ready to evolve, for trying the evolution scene.

## Build the desktop app

```bash
npm run build:win
```

The installer ends up in `dist/`. On Windows you may need Developer Mode turned on (or an admin terminal) the first time.

## Web demo

The app also builds for the browser (`npm run build:web`, output in `dist-web/`), which is how the Vercel demo is made. First-time visitors start with a filled-in save: a trainer with a party, a stocked PC, some badges and study history. Settings > Reset everything brings it back.

## Notes

- Progress is saved on your computer. Settings > Reset everything wipes it.
- Pokémon art and Pokédex entries load from the internet, so they won't show offline.
- Sprites come from [PokéAPI](https://pokeapi.co) and [Pokémon Showdown](https://play.pokemonshowdown.com). Pokémon is a trademark of Nintendo, Game Freak and The Pokémon Company; this is an unofficial fan project.
