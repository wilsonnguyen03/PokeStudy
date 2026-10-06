import brock from '../assets/leaders/brock.png'
import misty from '../assets/leaders/misty.png'
import ltsurge from '../assets/leaders/ltsurge.png'
import erika from '../assets/leaders/erika.png'
import koga from '../assets/leaders/koga.png'
import sabrina from '../assets/leaders/sabrina.png'
import blaine from '../assets/leaders/blaine.png'
import giovanni from '../assets/leaders/giovanni.png'
import roxanne from '../assets/leaders/roxanne.png'
import brawly from '../assets/leaders/brawly.png'
import wattson from '../assets/leaders/wattson.png'
import flannery from '../assets/leaders/flannery.png'
import norman from '../assets/leaders/norman.png'
import winona from '../assets/leaders/winona.png'
import tateandliza from '../assets/leaders/tateandliza.png'
import juan from '../assets/leaders/juan.png'
import falkner from '../assets/leaders/falkner.png'
import bugsy from '../assets/leaders/bugsy.png'
import whitney from '../assets/leaders/whitney.png'
import morty from '../assets/leaders/morty.png'
import chuck from '../assets/leaders/chuck.png'
import jasmine from '../assets/leaders/jasmine.png'
import pryce from '../assets/leaders/pryce.png'
import clair from '../assets/leaders/clair.png'
import roark from '../assets/leaders/roark.png'
import gardenia from '../assets/leaders/gardenia.png'
import maylene from '../assets/leaders/maylene.png'
import crasherwake from '../assets/leaders/crasherwake.png'
import fantina from '../assets/leaders/fantina.png'
import byron from '../assets/leaders/byron.png'
import candice from '../assets/leaders/candice.png'
import volkner from '../assets/leaders/volkner.png'
import cilan from '../assets/leaders/cilan.png'
import lenora from '../assets/leaders/lenora.png'
import burgh from '../assets/leaders/burgh.png'
import elesa from '../assets/leaders/elesa.png'
import clay from '../assets/leaders/clay.png'
import skyla from '../assets/leaders/skyla.png'
import brycen from '../assets/leaders/brycen.png'
import drayden from '../assets/leaders/drayden.png'

export type GymType =
  | 'rock'
  | 'water'
  | 'electric'
  | 'grass'
  | 'poison'
  | 'psychic'
  | 'fire'
  | 'ground'
  | 'fighting'
  | 'normal'
  | 'flying'
  | 'bug'
  | 'ghost'
  | 'steel'
  | 'ice'
  | 'dragon'

export interface GymMon {
  dexId: number
  name: string
  level: number
}

export interface GymLeader {
  name: string
  city: string
  type: GymType
  sprite: string
  team: GymMon[]
}

export const TYPE_COLOURS: Record<GymType, { main: string; dark: string; light: string }> = {
  rock: { main: '#b6a136', dark: '#6e5f1f', light: '#e8d98a' },
  water: { main: '#2f8de0', dark: '#134f94', light: '#8fd0ff' },
  electric: { main: '#f5c518', dark: '#8a6a00', light: '#fff29a' },
  grass: { main: '#4cc050', dark: '#1f6e2a', light: '#b8f0a0' },
  poison: { main: '#a33ea1', dark: '#4a1a56', light: '#e0a0e8' },
  psychic: { main: '#f95587', dark: '#7a1d52', light: '#ffb0d0' },
  fire: { main: '#f2681a', dark: '#8a2208', light: '#ffc070' },
  ground: { main: '#d9a441', dark: '#6e4a14', light: '#f5d58a' },
  fighting: { main: '#d6382e', dark: '#7a120e', light: '#ff9a8a' },
  normal: { main: '#a8a878', dark: '#55553a', light: '#e8e8c0' },
  flying: { main: '#6aa0f5', dark: '#244a9a', light: '#c0dcff' },
  bug: { main: '#8ab51a', dark: '#3f5a08', light: '#d8f080' },
  ghost: { main: '#8a68b8', dark: '#2c1e44', light: '#d0b8f5' },
  steel: { main: '#8f9ab8', dark: '#3a4058', light: '#dce2f2' },
  ice: { main: '#5ad0e8', dark: '#176580', light: '#c8f6ff' },
  dragon: { main: '#6f45fc', dark: '#2a0c8a', light: '#c0a8ff' }
}

const mon = (dexId: number, name: string, level: number): GymMon => ({ dexId, name, level })

// Gym teams: Kanto from FireRed / LeafGreen, Johto from HeartGold / SoulSilver, Hoenn from Emerald, Sinnoh from Platinum, Unova from Black / White.
export const GYMS: Record<string, GymLeader[]> = {
  kanto: [
    {
      name: 'Brock',
      city: 'Pewter City',
      type: 'rock',
      sprite: brock,
      team: [mon(74, 'Geodude', 12), mon(95, 'Onix', 14)]
    },
    {
      name: 'Misty',
      city: 'Cerulean City',
      type: 'water',
      sprite: misty,
      team: [mon(120, 'Staryu', 18), mon(121, 'Starmie', 21)]
    },
    {
      name: 'Lt. Surge',
      city: 'Vermilion City',
      type: 'electric',
      sprite: ltsurge,
      team: [mon(100, 'Voltorb', 21), mon(25, 'Pikachu', 18), mon(26, 'Raichu', 24)]
    },
    {
      name: 'Erika',
      city: 'Celadon City',
      type: 'grass',
      sprite: erika,
      team: [mon(71, 'Victreebel', 29), mon(114, 'Tangela', 24), mon(45, 'Vileplume', 29)]
    },
    {
      name: 'Koga',
      city: 'Fuchsia City',
      type: 'poison',
      sprite: koga,
      team: [
        mon(109, 'Koffing', 37),
        mon(89, 'Muk', 39),
        mon(109, 'Koffing', 37),
        mon(110, 'Weezing', 43)
      ]
    },
    {
      name: 'Sabrina',
      city: 'Saffron City',
      type: 'psychic',
      sprite: sabrina,
      team: [
        mon(64, 'Kadabra', 38),
        mon(122, 'Mr. Mime', 37),
        mon(49, 'Venomoth', 38),
        mon(65, 'Alakazam', 43)
      ]
    },
    {
      name: 'Blaine',
      city: 'Cinnabar Island',
      type: 'fire',
      sprite: blaine,
      team: [
        mon(58, 'Growlithe', 42),
        mon(77, 'Ponyta', 40),
        mon(78, 'Rapidash', 42),
        mon(59, 'Arcanine', 47)
      ]
    },
    {
      name: 'Giovanni',
      city: 'Viridian City',
      type: 'ground',
      sprite: giovanni,
      team: [
        mon(111, 'Rhyhorn', 45),
        mon(51, 'Dugtrio', 42),
        mon(31, 'Nidoqueen', 44),
        mon(34, 'Nidoking', 45),
        mon(112, 'Rhydon', 50)
      ]
    }
  ],
  hoenn: [
    {
      name: 'Roxanne',
      city: 'Rustboro City',
      type: 'rock',
      sprite: roxanne,
      team: [mon(74, 'Geodude', 14), mon(74, 'Geodude', 14), mon(299, 'Nosepass', 15)]
    },
    {
      name: 'Brawly',
      city: 'Dewford Town',
      type: 'fighting',
      sprite: brawly,
      team: [mon(66, 'Machop', 16), mon(296, 'Makuhita', 16), mon(307, 'Meditite', 19)]
    },
    {
      name: 'Wattson',
      city: 'Mauville City',
      type: 'electric',
      sprite: wattson,
      team: [
        mon(100, 'Voltorb', 20),
        mon(309, 'Electrike', 20),
        mon(82, 'Magneton', 22),
        mon(310, 'Manectric', 24)
      ]
    },
    {
      name: 'Flannery',
      city: 'Lavaridge Town',
      type: 'fire',
      sprite: flannery,
      team: [
        mon(322, 'Numel', 24),
        mon(218, 'Slugma', 24),
        mon(323, 'Camerupt', 26),
        mon(324, 'Torkoal', 29)
      ]
    },
    {
      name: 'Norman',
      city: 'Petalburg City',
      type: 'normal',
      sprite: norman,
      team: [
        mon(327, 'Spinda', 27),
        mon(288, 'Vigoroth', 27),
        mon(264, 'Linoone', 29),
        mon(289, 'Slaking', 31)
      ]
    },
    {
      name: 'Winona',
      city: 'Fortree City',
      type: 'flying',
      sprite: winona,
      team: [
        mon(277, 'Swellow', 31),
        mon(279, 'Pelipper', 30),
        mon(227, 'Skarmory', 32),
        mon(334, 'Altaria', 33)
      ]
    },
    {
      name: 'Tate & Liza',
      city: 'Mossdeep City',
      type: 'psychic',
      sprite: tateandliza,
      team: [mon(344, 'Claydol', 41), mon(178, 'Xatu', 41)]
    },
    {
      name: 'Juan',
      city: 'Sootopolis City',
      type: 'water',
      sprite: juan,
      team: [
        mon(370, 'Luvdisc', 41),
        mon(340, 'Whiscash', 41),
        mon(364, 'Sealeo', 43),
        mon(342, 'Crawdaunt', 43),
        mon(230, 'Kingdra', 46)
      ]
    }
  ],
  johto: [
    {
      name: 'Falkner',
      city: 'Violet City',
      type: 'flying',
      sprite: falkner,
      team: [mon(16, 'Pidgey', 9), mon(17, 'Pidgeotto', 13)]
    },
    {
      name: 'Bugsy',
      city: 'Azalea Town',
      type: 'bug',
      sprite: bugsy,
      team: [mon(11, 'Metapod', 15), mon(14, 'Kakuna', 15), mon(123, 'Scyther', 17)]
    },
    {
      name: 'Whitney',
      city: 'Goldenrod City',
      type: 'normal',
      sprite: whitney,
      team: [mon(35, 'Clefairy', 17), mon(241, 'Miltank', 19)]
    },
    {
      name: 'Morty',
      city: 'Ecruteak City',
      type: 'ghost',
      sprite: morty,
      team: [
        mon(92, 'Gastly', 21),
        mon(93, 'Haunter', 21),
        mon(93, 'Haunter', 23),
        mon(94, 'Gengar', 25)
      ]
    },
    {
      name: 'Chuck',
      city: 'Cianwood City',
      type: 'fighting',
      sprite: chuck,
      team: [mon(57, 'Primeape', 27), mon(62, 'Poliwrath', 30)]
    },
    {
      name: 'Jasmine',
      city: 'Olivine City',
      type: 'steel',
      sprite: jasmine,
      team: [mon(82, 'Magneton', 30), mon(82, 'Magneton', 30), mon(208, 'Steelix', 35)]
    },
    {
      name: 'Pryce',
      city: 'Mahogany Town',
      type: 'ice',
      sprite: pryce,
      team: [mon(86, 'Seel', 30), mon(87, 'Dewgong', 32), mon(221, 'Piloswine', 34)]
    },
    {
      name: 'Clair',
      city: 'Blackthorn City',
      type: 'dragon',
      sprite: clair,
      team: [
        mon(148, 'Dragonair', 37),
        mon(148, 'Dragonair', 37),
        mon(148, 'Dragonair', 37),
        mon(230, 'Kingdra', 40)
      ]
    }
  ],
  sinnoh: [
    {
      name: 'Roark',
      city: 'Oreburgh City',
      type: 'rock',
      sprite: roark,
      team: [mon(74, 'Geodude', 12), mon(95, 'Onix', 12), mon(408, 'Cranidos', 14)]
    },
    {
      name: 'Gardenia',
      city: 'Eterna City',
      type: 'grass',
      sprite: gardenia,
      team: [mon(420, 'Cherubi', 20), mon(387, 'Turtwig', 22), mon(407, 'Roserade', 22)]
    },
    {
      name: 'Maylene',
      city: 'Veilstone City',
      type: 'fighting',
      sprite: maylene,
      team: [mon(307, 'Meditite', 28), mon(67, 'Machoke', 29), mon(448, 'Lucario', 32)]
    },
    {
      name: 'Crasher Wake',
      city: 'Pastoria City',
      type: 'water',
      sprite: crasherwake,
      team: [mon(130, 'Gyarados', 33), mon(195, 'Quagsire', 34), mon(419, 'Floatzel', 37)]
    },
    {
      name: 'Fantina',
      city: 'Hearthome City',
      type: 'ghost',
      sprite: fantina,
      team: [mon(426, 'Drifblim', 32), mon(94, 'Gengar', 34), mon(429, 'Mismagius', 36)]
    },
    {
      name: 'Byron',
      city: 'Canalave City',
      type: 'steel',
      sprite: byron,
      team: [mon(436, 'Bronzor', 36), mon(208, 'Steelix', 36), mon(411, 'Bastiodon', 39)]
    },
    {
      name: 'Candice',
      city: 'Snowpoint City',
      type: 'ice',
      sprite: candice,
      team: [
        mon(459, 'Snover', 35),
        mon(215, 'Sneasel', 35),
        mon(308, 'Medicham', 37),
        mon(460, 'Abomasnow', 40)
      ]
    },
    {
      name: 'Volkner',
      city: 'Sunyshore City',
      type: 'electric',
      sprite: volkner,
      team: [
        mon(135, 'Jolteon', 46),
        mon(26, 'Raichu', 46),
        mon(405, 'Luxray', 48),
        mon(466, 'Electivire', 50)
      ]
    }
  ],
  unova: [
    {
      name: 'Cilan',
      city: 'Striaton City',
      type: 'grass',
      sprite: cilan,
      team: [mon(506, 'Lillipup', 12), mon(511, 'Pansage', 14)]
    },
    {
      name: 'Lenora',
      city: 'Nacrene City',
      type: 'normal',
      sprite: lenora,
      team: [mon(507, 'Herdier', 18), mon(505, 'Watchog', 20)]
    },
    {
      name: 'Burgh',
      city: 'Castelia City',
      type: 'bug',
      sprite: burgh,
      team: [mon(544, 'Whirlipede', 21), mon(557, 'Dwebble', 21), mon(542, 'Leavanny', 23)]
    },
    {
      name: 'Elesa',
      city: 'Nimbasa City',
      type: 'electric',
      sprite: elesa,
      team: [mon(587, 'Emolga', 27), mon(587, 'Emolga', 27), mon(523, 'Zebstrika', 29)]
    },
    {
      name: 'Clay',
      city: 'Driftveil City',
      type: 'ground',
      sprite: clay,
      team: [mon(552, 'Krokorok', 29), mon(535, 'Palpitoad', 29), mon(530, 'Excadrill', 31)]
    },
    {
      name: 'Skyla',
      city: 'Mistralton City',
      type: 'flying',
      sprite: skyla,
      team: [mon(528, 'Swoobat', 33), mon(561, 'Sigilyph', 33), mon(581, 'Swanna', 35)]
    },
    {
      name: 'Brycen',
      city: 'Icirrus City',
      type: 'ice',
      sprite: brycen,
      team: [mon(583, 'Vanillish', 37), mon(615, 'Cryogonal', 37), mon(614, 'Beartic', 39)]
    },
    {
      name: 'Drayden',
      city: 'Opelucid City',
      type: 'dragon',
      sprite: drayden,
      team: [mon(620, 'Druddigon', 41), mon(330, 'Flygon', 41), mon(612, 'Haxorus', 43)]
    }
  ]
}

export const COOLDOWN_MS = 5 * 60 * 60 * 1000 // wait after a defeat before challenging again

export const SPEECH: Record<string, { win: string; lose: string }> = {
  Brock: {
    win: 'Your Pokémon are as steady as stone! Every hour you put in adds another layer of strength. Keep going!',
    lose: 'Even the hardest rock is shaped a little at a time. Study, rest, and come back stronger.'
  },
  Misty: {
    win: 'Wow, you really made a splash! Steady effort carries you farther than any wave. Keep it up!',
    lose: "Don't let one wave knock you down. Take a breather, keep studying, and the tide will turn."
  },
  'Lt. Surge': {
    win: "Hah! You've got real voltage, kid! Keep charging up with hard work and nothing will stop you.",
    lose: "You ran out of juice, soldier! Recharge, hit the books, and report back when you're ready."
  },
  Erika: {
    win: "Oh my, you've bloomed beautifully! Patience and daily effort make the finest gardens. Keep growing.",
    lose: 'Even the strongest flowers need time and care. Rest, study, and you will bloom.'
  },
  Koga: {
    win: 'Hmph... your discipline impressed me. Mastery comes from quiet, daily practice. Do not stop.',
    lose: 'A true ninja trains with patience. Sharpen your mind, rest, and return when you are ready.'
  },
  Sabrina: {
    win: 'I foresaw your focus. Your mind is sharper than before. Keep nurturing it and nothing will be hidden from you.',
    lose: 'I saw this outcome. Clear your mind, study with purpose, and I will see you in the future.'
  },
  Blaine: {
    win: "Hot, hot, HOT! You've got a fire in your belly! Keep that blaze burning and study on!",
    lose: 'You got burned, kid! But fire only gets hotter with fuel. Study hard, rest up, and come back blazing!'
  },
  Giovanni: {
    win: 'Impressive... I underestimated your resolve. Persistence is the strongest foundation. Keep building yours.',
    lose: 'You are not ready. Strength is built through relentless effort. Study. Rest. Return stronger.'
  },
  Roxanne: {
    win: 'That was wonderful! Your hard work really shows. Remember, learning is won one page at a time.',
    lose: "I'm afraid you need more study first. Review what you've learned, rest well, and try again!"
  },
  Brawly: {
    win: "Awesome! You rode that wave like a pro! Keep up the training and you'll be unstoppable!",
    lose: 'Wiped out! No worries, even the best surfers fall. Rest up, train hard, and paddle back out.'
  },
  Wattson: {
    win: 'Wahahaha! What a shocking performance! Keep studying and your power will keep growing!',
    lose: 'Wahaha! Your batteries are drained! Recharge, study some more, then try again!'
  },
  Flannery: {
    win: 'You beat me! Your passion is on fire! Keep working hard and keep that flame alive!',
    lose: 'Oh no, you fizzled out! But every flame can grow. Study hard, rest, and come back hotter!'
  },
  Norman: {
    win: "You've shown real growth. Consistent effort, day after day, is what makes champions. Don't stop now.",
    lose: "Not yet. A strong foundation takes steady training. Study, rest, and show me how far you've come."
  },
  Winona: {
    win: "Magnificent flying! Your focus soared high. Keep working hard and you'll reach new heights.",
    lose: "Don't lose heart. Even birds rest between flights. Study up, and take to the skies again."
  },
  'Tate & Liza': {
    win: 'We lost! Your bond with your Pokémon is strong. Keep studying and keep believing!',
    lose: 'Our minds are as one, and yours needs more focus. Study, rest, and try again!'
  },
  Juan: {
    win: 'Marvelous! Like water wearing down stone, your steady effort overcame me. Keep flowing forward.',
    lose: 'A fine attempt, but the tide is not yet with you. Study, rest, and return with greater resolve.'
  },
  Falkner: {
    win: "Your Pokémon soared past mine! Steady practice is what gives you wings. Keep studying and you'll go far.",
    lose: "A bird can't fly on the first try. Rest, study, and come back and take to the skies."
  },
  Bugsy: {
    win: "Fascinating! You've earned this. Small efforts add up to something big, so keep chipping away.",
    lose: 'Even a cocoon takes time before it becomes something strong. Study, rest, and come back transformed.'
  },
  Whitney: {
    win: "Waaah... you actually beat me! Okay, fine, you're good! Keep working hard and don't give up.",
    lose: "Hehe, I won! Don't cry, just study more and rest up. You'll get me next time!"
  },
  Morty: {
    win: "Your focus cut right through the fog. That's what steady study does for the mind. Keep it up.",
    lose: 'A scattered mind sees only shadows. Clear your head, study with focus, and return.'
  },
  Chuck: {
    win: "Wahahah! You've got guts! Training every day is how champions are made. Keep at it!",
    lose: 'Not strong enough yet! Hit the books like I hit the waterfall, rest, and come back!'
  },
  Jasmine: {
    win: '...You were stronger than me. Steel is forged slowly, and so is knowledge. Please keep going.',
    lose: "...I'm sorry. You're not ready yet. Study a little each day, rest well, and try again."
  },
  Pryce: {
    win: "Well done, young one. I've weathered many winters, and effort over time always wins in the end.",
    lose: 'Patience, young one. Even a glacier moves a bit each day. Study, rest, and return.'
  },
  Clair: {
    win: "I can't believe I lost... but I respect your effort. Dedication is the mark of a true dragon master.",
    lose: "You're not worthy of the Rising Badge yet! Study harder, rest well, and come back stronger."
  },
  Roark: {
    win: 'You smashed through my defences! Digging a little each day is how you strike gold. Keep going!',
    lose: 'Not yet! Even a mine takes patient digging. Study hard, take breaks, and try again.'
  },
  Gardenia: {
    win: 'Oh, you grew so much! Care and patience make everything bloom. Keep tending to your goals.',
    lose: 'Every seed needs time and rest before it grows. Keep studying, and you will blossom.'
  },
  Maylene: {
    win: 'Wow, I lost! Your training really shows. Showing up every day is the toughest move, so keep it up!',
    lose: "I'm not done yet and neither should you be! Study, rest, and come back ready."
  },
  'Crasher Wake': {
    win: "Waaah! Now THAT'S a wave! Keep paddling through your studies and no storm can stop you!",
    lose: 'You got washed out, little buddy! Rest on the shore, study up, and charge back in!'
  },
  Fantina: {
    win: 'Ah, I lost! How wonderful. Your effort is graceful. Keep studying, and let your hard work shine.',
    lose: 'Ah, not yet! A performance takes practice. Rest, rehearse your studies, and return.'
  },
  Byron: {
    win: 'Gwahahaha! Good grit! Solid steel is built layer by layer, and so is your future. Keep going.',
    lose: 'Not tough enough yet! Strength takes time. Study, rest, and return harder than before.'
  },
  Candice: {
    win: 'Wow, you melted my defences! Keep up that hard work. Being focused is totally cool!',
    lose: "Brr, it wasn't enough! Cool down, rest, study up, and come back with a better plan!"
  },
  Volkner: {
    win: "...That was the first time I felt a spark in a long while. Don't lose that drive. Study on.",
    lose: '...Is that all? Recharge, study with real focus, and then challenge me again.'
  },
  Cilan: {
    win: 'Superb! Like a perfect recipe, your preparation paid off. Keep adding the right effort every day!',
    lose: 'Too many ingredients missing! Study a bit more, rest well, and bring a better blend next time.'
  },
  Lenora: {
    win: 'Marvellous! You studied well. Knowledge is a treasure, so keep digging into it!',
    lose: 'Not yet! Think of this as research. Study, learn from it, rest, and return.'
  },
  Burgh: {
    win: 'Inspiring! Your effort was a work of art. Keep creating, keep studying, and keep growing.',
    lose: 'Oh, my masterpiece wins this time! Rest, study, and let your inspiration build.'
  },
  Elesa: {
    win: 'Wow, you lit up the stage! Hard work shines brighter than any spotlight. Keep going!',
    lose: 'Not quite a star yet! Rehearse, study, rest well, and come back for the encore.'
  },
  Clay: {
    win: 'Dagnabbit! You got me! Hard work pays off. Keep digging into those books, kid.',
    lose: "Ha! You're not ready yet! Study some more, rest your bones, and come back stronger."
  },
  Skyla: {
    win: 'Soaring! You flew straight through! Keep working hard, because the sky is the limit!',
    lose: "You didn't get off the ground this time. Rest, study, and let's try another flight."
  },
  Brycen: {
    win: 'Your discipline is as firm as ice. Persistent effort is how any mountain is climbed. Well done.',
    lose: 'Focus and control, not rush! Quiet your mind, study well, rest, and return.'
  },
  Drayden: {
    win: "Excellent! Your effort burns like a dragon's fire. Keep working hard, and your future will be great.",
    lose: 'A dragon rises through long, hard training. Study, rest, and come back stronger.'
  }
}
