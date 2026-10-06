import kantoSheet from '../assets/badges/Kanto.svg'
import johtoSheet from '../assets/badges/Johto.svg'
import hoennSheet from '../assets/badges/Hoenn.svg'
import sinnohSheet from '../assets/badges/Sinnoh.svg'
import unovaSheet from '../assets/badges/Unova.svg'

// Size of every badge sheet
export const SHEET_WIDTH = 744.09
export const SHEET_HEIGHT = 1052.36

export interface Badge {
  name: string
  leader: string
  box: [number, number, number, number] // x, y, width, height on the sheet
}

export interface Region {
  name: string
  colour: string
  sheet: string
  badges: Badge[]
}

export const REGIONS: Record<string, Region> = {
  kanto: {
    name: 'Kanto',
    colour: '#ef6461',
    sheet: kantoSheet,
    badges: [
      { name: 'Boulder Badge', leader: 'Brock', box: [66, 97, 60, 59] },
      { name: 'Cascade Badge', leader: 'Misty', box: [144, 93, 42, 63] },
      { name: 'Thunder Badge', leader: 'Lt. Surge', box: [201, 95, 64, 67] },
      { name: 'Rainbow Badge', leader: 'Erika', box: [285, 99, 61, 61] },
      { name: 'Soul Badge', leader: 'Koga', box: [367, 97, 53, 64] },
      { name: 'Marsh Badge', leader: 'Sabrina', box: [440, 101, 61, 61] },
      { name: 'Volcano Badge', leader: 'Blaine', box: [525, 102, 60, 66] },
      { name: 'Earth Badge', leader: 'Giovanni', box: [618, 100, 66, 66] }
    ]
  },
  johto: {
    name: 'Johto',
    colour: '#e9a23b',
    sheet: johtoSheet,
    badges: [
      { name: 'Zephyr Badge', leader: 'Falkner', box: [71, 237, 63, 57] },
      { name: 'Hive Badge', leader: 'Bugsy', box: [143, 228, 63, 63] },
      { name: 'Plain Badge', leader: 'Whitney', box: [214, 230, 63, 59] },
      { name: 'Fog Badge', leader: 'Morty', box: [279, 235, 62, 55] },
      { name: 'Storm Badge', leader: 'Chuck', box: [366, 239, 59, 53] },
      { name: 'Mineral Badge', leader: 'Jasmine', box: [442, 232, 61, 61] },
      { name: 'Glacier Badge', leader: 'Pryce', box: [528, 233, 54, 62] },
      { name: 'Rising Badge', leader: 'Clair', box: [612, 233, 62, 68] }
    ]
  },
  hoenn: {
    name: 'Hoenn',
    colour: '#4caf7d',
    sheet: hoennSheet,
    badges: [
      { name: 'Stone Badge', leader: 'Roxanne', box: [62, 348, 63, 58] },
      { name: 'Knuckle Badge', leader: 'Brawly', box: [147, 348, 59, 52] },
      { name: 'Dynamo Badge', leader: 'Wattson', box: [225, 336, 51, 64] },
      { name: 'Heat Badge', leader: 'Flannery', box: [292, 339, 62, 62] },
      { name: 'Balance Badge', leader: 'Norman', box: [368, 349, 60, 56] },
      { name: 'Feather Badge', leader: 'Winona', box: [459, 350, 52, 55] },
      { name: 'Mind Badge', leader: 'Tate & Liza', box: [534, 342, 59, 60] },
      { name: 'Rain Badge', leader: 'Juan', box: [617, 338, 44, 59] }
    ]
  },
  sinnoh: {
    name: 'Sinnoh',
    colour: '#5a8fd8',
    sheet: sinnohSheet,
    badges: [
      { name: 'Coal Badge', leader: 'Roark', box: [57, 453, 62, 58] },
      { name: 'Forest Badge', leader: 'Gardenia', box: [146, 458, 65, 61] },
      { name: 'Cobble Badge', leader: 'Maylene', box: [228, 453, 64, 66] },
      { name: 'Fen Badge', leader: 'Crasher Wake', box: [296, 453, 63, 64] },
      { name: 'Relic Badge', leader: 'Fantina', box: [372, 465, 64, 57] },
      { name: 'Mine Badge', leader: 'Byron', box: [455, 451, 64, 59] },
      { name: 'Icicle Badge', leader: 'Candice', box: [532, 456, 64, 59] },
      { name: 'Beacon Badge', leader: 'Volkner', box: [609, 453, 67, 61] }
    ]
  },
  unova: {
    name: 'Unova',
    colour: '#6b6f80',
    sheet: unovaSheet,
    badges: [
      { name: 'Trio Badge', leader: 'Cilan, Chili & Cress', box: [73, 570, 22, 64] },
      { name: 'Basic Badge', leader: 'Lenora', box: [166, 567, 17, 64] },
      { name: 'Insect Badge', leader: 'Burgh', box: [239, 565, 31, 64] },
      { name: 'Bolt Badge', leader: 'Elesa', box: [304, 560, 33, 68] },
      { name: 'Quake Badge', leader: 'Clay', box: [388, 561, 24, 65] },
      { name: 'Jet Badge', leader: 'Skyla', box: [459, 558, 26, 66] },
      { name: 'Freeze Badge', leader: 'Brycen', box: [550, 557, 30, 64] },
      { name: 'Legend Badge', leader: 'Drayden', box: [625, 549, 40, 68] }
    ]
  }
}
