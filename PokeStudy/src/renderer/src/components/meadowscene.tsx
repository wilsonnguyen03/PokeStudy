import {
  SCENE_THEMES,
  type BackgroundId,
  type FarShape,
  type SceneTheme
} from '../game/backgrounds'

interface CloudProps {
  theme: SceneTheme
  y: number
  size: number
  duration: number
  delay: number
}

function Cloud({ theme, y, size, duration, delay }: CloudProps): React.JSX.Element {
  const puffs = [
    { cx: 30, cy: 40, r: 22 },
    { cx: 60, cy: 26, r: 28 },
    { cx: 92, cy: 38, r: 22 },
    { cx: 62, cy: 46, r: 22 }
  ]

  return (
    <g
      className="cloud"
      style={{ animationDuration: `${duration}s`, animationDelay: `-${delay}s` }}
    >
      <g transform={`translate(-180 ${y}) scale(${size})`}>
        {/* Outline layer: thick strokes, mostly hidden by the fill layer */}
        {puffs.map((p, i) => (
          <circle
            key={`o${i}`}
            {...p}
            fill={theme.cloud}
            stroke={theme.cloudEdge}
            strokeWidth="6"
          />
        ))}
        {/* Fill layer covers the inner strokes, leaving only the outer edge */}
        {puffs.map((p, i) => (
          <circle key={`f${i}`} {...p} fill={theme.cloud} />
        ))}
        <ellipse cx="62" cy="54" rx="36" ry="8" fill={theme.cloudShade} />
      </g>
    </g>
  )
}

// Silhouettes for the far layer, and the matching foreground layer
const FAR_PATHS: Record<FarShape, string> = {
  hills: 'M0 250 Q 120 195 240 240 T 480 232 T 720 228 T 960 240 V 440 H 0 Z',
  peaks:
    'M0 262 L70 192 L120 236 L200 150 L270 240 L340 204 L420 252 L500 170 L580 246 L660 196 L740 250 L800 208 L860 250 V 440 H 0 Z',
  dunes: 'M0 272 Q 120 218 260 262 T 520 250 T 860 258 V 440 H 0 Z',
  sea: 'M0 255 H 860 V 440 H 0 Z',
  volcano:
    'M0 270 L110 244 L190 166 L250 166 L330 246 L430 266 L560 232 L630 176 L690 176 L760 236 L860 256 V 440 H 0 Z',
  flat: 'M0 262 H 860 V 440 H 0 Z',
  cave: 'M0 282 L40 250 L80 286 L140 240 L190 282 L260 245 L330 290 L400 248 L470 284 L540 244 L610 288 L690 246 L760 284 L820 250 L860 272 V 440 H 0 Z'
}

const NEAR_HILLS = 'M0 292 Q 160 245 320 286 T 640 282 T 960 292 V 440 H 0 Z'
const NEAR_PATHS: Record<FarShape, string> = {
  hills: NEAR_HILLS,
  peaks: NEAR_HILLS,
  volcano: NEAR_HILLS,
  cave: NEAR_HILLS,
  flat: 'M0 300 H 860 V 440 H 0 Z',
  dunes: 'M0 302 Q 200 268 420 302 T 860 296 V 440 H 0 Z',
  sea: 'M0 290 Q 50 280 100 290 T 200 290 T 300 290 T 400 290 T 500 290 T 600 290 T 700 290 T 800 290 T 900 290 V 440 H 0 Z'
}

const GROUND = 'M0 332 Q 215 314 430 330 T 860 328 V 440 H 0 Z'

const TREES = [
  [70, 238],
  [104, 232],
  [540, 230],
  [574, 236],
  [800, 240]
]

const TUFTS = [
  [30, 360],
  [120, 400],
  [210, 352],
  [300, 418],
  [380, 366],
  [455, 405],
  [520, 350],
  [600, 392],
  [690, 362],
  [760, 412],
  [830, 372],
  [160, 430]
]

const FLOWER_SPOTS: [number, number][] = [
  [60, 380],
  [95, 352],
  [180, 372],
  [250, 410],
  [330, 358],
  [410, 390],
  [470, 360],
  [560, 415],
  [640, 370],
  [720, 392],
  [790, 355],
  [845, 400]
]
const FLOWER_COLOURS = ['#ff8fb1', '#ffd84d', '#ffffff', '#c8a2ff']

const STARS = [
  [60, 40],
  [150, 90],
  [240, 30],
  [330, 110],
  [420, 50],
  [660, 30],
  [720, 100],
  [800, 60],
  [840, 20],
  [500, 130],
  [90, 140],
  [610, 120],
  [770, 140],
  [380, 22],
  [200, 150]
]

const FALLERS = Array.from({ length: 24 }, (_, i) => ({
  x: (i * 79) % 860,
  y: -((i * 37) % 260),
  dur: 7 + ((i * 13) % 8),
  delay: -((i * 29) % 14)
}))
const WISPS: [number, number][] = [
  [120, 330],
  [300, 300],
  [460, 340],
  [620, 310],
  [760, 350],
  [220, 385],
  [540, 392]
]
const TOMBS: [number, number, number][] = [
  [80, 372, 1],
  [170, 345, 0.8],
  [300, 395, 1.2],
  [560, 362, 1],
  [690, 340, 0.8],
  [780, 392, 1.2]
]
const REEDS = [60, 130, 210, 330, 470, 560, 650, 740, 810]
const RAINBOW = ['#ff5a5a', '#ff9a3c', '#ffe03a', '#5ad86a', '#4aa8ff', '#6a5aff', '#b05aff']
const SKYLINE = Array.from({ length: 15 }, (_, i) => ({
  x: i * 58 - 10,
  w: 40 + ((i * 17) % 22),
  h: 70 + ((i * 53) % 110)
}))

const PINE_SPOTS: [number, number, number][] = [
  [30, 246, 0.8],
  [90, 240, 1],
  [150, 248, 0.7],
  [250, 244, 0.9],
  [350, 252, 0.7],
  [470, 240, 1],
  [560, 246, 0.8],
  [650, 238, 1],
  [740, 246, 0.8],
  [820, 240, 0.9],
  [40, 292, 1.3],
  [200, 296, 1.1],
  [330, 300, 1.4],
  [520, 296, 1.2],
  [700, 298, 1.4],
  [820, 294, 1.1]
]

const CACTI: [number, number, number][] = [
  [90, 330, 1],
  [240, 352, 0.7],
  [470, 336, 0.9],
  [640, 350, 1.2],
  [790, 332, 0.8]
]

const PALMS: [number, number, number][] = [
  [110, 300, 1],
  [720, 296, 1.1],
  [800, 312, 0.8]
]

const CRYSTAL_SPOTS: [number, number, number][] = [
  [80, 330, 1],
  [180, 360, 0.7],
  [330, 340, 0.9],
  [520, 350, 1.1],
  [660, 336, 0.8],
  [780, 356, 1],
  [430, 380, 0.6]
]

const RAIN = Array.from({ length: 40 }, (_, i) => [(i * 71) % 880, (i * 53) % 330] as const)
const EMBERS = Array.from(
  { length: 24 },
  (_, i) => [(i * 97) % 860, 120 + ((i * 61) % 300), 1 + (i % 3)] as const
)
const SNOW = Array.from(
  { length: 36 },
  (_, i) => [(i * 83) % 860, (i * 47) % 400, 1.4 + (i % 3) * 0.6] as const
)
const FIREFLIES = Array.from(
  { length: 14 },
  (_, i) => [(i * 131) % 860, 250 + ((i * 59) % 150)] as const
)

function Pine({
  x,
  y,
  s,
  theme
}: {
  x: number
  y: number
  s: number
  theme: SceneTheme
}): React.JSX.Element {
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      <rect x="-2" y="-2" width="4" height="12" fill="#6b4d32" />
      {[0, -14, -28].map((dy, i) => (
        <polygon
          key={i}
          points={`0,${dy - 22} ${16 - i * 3},${dy} ${-16 + i * 3},${dy}`}
          fill={theme.leaf}
          stroke={theme.leafEdge}
          strokeWidth="2"
        />
      ))}
    </g>
  )
}

function Cactus({ x, y, s }: { x: number; y: number; s: number }): React.JSX.Element {
  const fill = '#5aa65a'
  const edge = '#3f8040'
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`} fill={fill} stroke={edge} strokeWidth="2.5">
      <rect x="-7" y="-50" width="14" height="50" rx="7" />
      <path d="M-7 -28 h-10 a5 5 0 0 1 -5 -5 v-14 a5 5 0 0 1 10 0 v10 h5 z" />
      <path d="M7 -22 h10 a5 5 0 0 0 5 -5 v-12 a5 5 0 0 0 -10 0 v8 h-5 z" />
    </g>
  )
}

function Palm({
  x,
  y,
  s,
  theme
}: {
  x: number
  y: number
  s: number
  theme: SceneTheme
}): React.JSX.Element {
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      <path
        d="M0 0 Q 14 -40 6 -78"
        stroke="#a9794a"
        strokeWidth="8"
        fill="none"
        strokeLinecap="round"
      />
      <g fill={theme.leaf} stroke={theme.leafEdge} strokeWidth="2.5">
        <path d="M6 -78 Q -22 -96 -44 -72 Q -20 -80 6 -78 Z" />
        <path d="M6 -78 Q 34 -100 58 -74 Q 30 -82 6 -78 Z" />
        <path d="M6 -78 Q -8 -108 -30 -112 Q -6 -98 6 -78 Z" />
        <path d="M6 -78 Q 20 -108 44 -108 Q 22 -96 6 -78 Z" />
      </g>
    </g>
  )
}

function Crystal({
  x,
  y,
  s,
  theme,
  alt
}: {
  x: number
  y: number
  s: number
  theme: SceneTheme
  alt: boolean
}): React.JSX.Element {
  const colour = alt ? theme.accent2 : theme.accent
  return (
    <g
      transform={`translate(${x} ${y}) scale(${s})`}
      fill={colour}
      stroke="#ffffff"
      strokeWidth="1.5"
      strokeOpacity="0.7"
    >
      <polygon points="0,-34 8,-8 0,0 -8,-8" opacity="0.95" />
      <polygon points="12,-20 18,-4 12,0 6,-4" opacity="0.75" />
      <polygon points="-12,-14 -6,-2 -12,0 -18,-4" opacity="0.65" />
    </g>
  )
}

interface Props {
  background?: BackgroundId
}

export default function MeadowScene({ background = 'meadow' }: Props): React.JSX.Element {
  const t: SceneTheme = SCENE_THEMES[background]
  const has = (d: SceneTheme['decor'][number]): boolean => t.decor.includes(d)

  return (
    <svg
      className="scene"
      viewBox="0 0 860 440"
      preserveAspectRatio="xMidYMax slice"
      aria-hidden="true"
    >
      <defs>
        <linearGradient id="sky" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={t.skyTop} />
          <stop offset="55%" stopColor={t.skyMid} />
          <stop offset="100%" stopColor={t.skyBottom} />
        </linearGradient>
        <radialGradient id="sunGlow">
          <stop offset="0%" stopColor={t.glow} stopOpacity="0.9" />
          <stop offset="100%" stopColor={t.glow} stopOpacity="0" />
        </radialGradient>
        <radialGradient id="nebulaA">
          <stop offset="0%" stopColor={t.accent} stopOpacity="0.55" />
          <stop offset="100%" stopColor={t.accent} stopOpacity="0" />
        </radialGradient>
        <radialGradient id="nebulaB">
          <stop offset="0%" stopColor={t.accent2} stopOpacity="0.45" />
          <stop offset="100%" stopColor={t.accent2} stopOpacity="0" />
        </radialGradient>
      </defs>

      {/* Sky */}
      <rect width="860" height="440" fill="url(#sky)" />

      {has('nebula') && (
        <g>
          <ellipse cx="220" cy="110" rx="260" ry="110" fill="url(#nebulaA)" />
          <ellipse cx="640" cy="150" rx="280" ry="120" fill="url(#nebulaB)" />
        </g>
      )}

      {has('aurora') && (
        <g>
          <path
            d="M0 90 Q 200 20 420 92 T 860 60 V 140 Q 640 170 420 138 T 0 150 Z"
            fill={t.accent}
            opacity="0.32"
          />
          <path
            d="M0 130 Q 240 70 480 130 T 860 110 V 170 Q 620 200 400 170 T 0 190 Z"
            fill={t.accent2}
            opacity="0.25"
          />
        </g>
      )}

      {has('stars') &&
        STARS.map(([x, y], i) => (
          <circle key={i} cx={x} cy={y} r={i % 3 === 0 ? 2 : 1.4} fill="#ffffff" opacity="0.85" />
        ))}

      {t.celestial !== 'none' && (
        <g>
          <circle cx="560" cy="64" r="100" fill="url(#sunGlow)" />
          <circle cx="560" cy="64" r="32" fill={t.sun} stroke={t.sunEdge} strokeWidth="3" />
          {background === 'cosmic' && (
            <ellipse
              cx="560"
              cy="64"
              rx="58"
              ry="10"
              fill="none"
              stroke={t.sunEdge}
              strokeWidth="3"
              transform="rotate(-18 560 64)"
            />
          )}
        </g>
      )}

      {/* Drifting clouds */}
      {t.clouds && (
        <g>
          <Cloud theme={t} y={30} size={1} duration={140} delay={20} />
          <Cloud theme={t} y={90} size={0.7} duration={110} delay={70} />
          <Cloud theme={t} y={50} size={1.2} duration={170} delay={120} />
          <Cloud theme={t} y={120} size={0.8} duration={125} delay={10} />
        </g>
      )}

      {has('rainbow') && (
        <g fill="none" strokeWidth="14" opacity="0.85">
          {RAINBOW.map((c, i) => {
            const r = 330 - i * 14
            return (
              <path key={c} d={`M${430 - r} 300 A ${r} ${r} 0 0 1 ${430 + r} 300`} stroke={c} />
            )
          })}
        </g>
      )}

      {/* Far layer */}
      <path d={FAR_PATHS[t.far]} fill={t.farHill} stroke={t.farHillEdge} strokeWidth="3" />

      {has('caps') && (
        <g fill="#ffffff" stroke="#dbe9f3" strokeWidth="2" strokeLinejoin="round">
          <polygon points="200,150 178,186 192,178 202,190 214,176 226,184" />
          <polygon points="500,170 480,200 494,194 503,204 514,192 524,198" />
          <polygon points="70,192 54,214 66,210 74,218 84,208" />
          <polygon points="660,196 644,216 656,212 664,220 674,210" />
        </g>
      )}

      {has('skyline') && (
        <g>
          <ellipse cx="430" cy="262" rx="520" ry="70" fill={t.glow} opacity="0.28" />
          {SKYLINE.map((b, i) => (
            <g key={i}>
              <rect
                x={b.x}
                y={262 - b.h}
                width={b.w}
                height={b.h}
                fill="#21104a"
                stroke="#34206a"
                strokeWidth="2"
              />
              <line
                x1={b.x}
                x2={b.x + b.w}
                y1={262 - b.h}
                y2={262 - b.h}
                stroke={i % 2 ? t.accent : t.accent2}
                strokeWidth="3"
              />
              {Array.from({ length: 6 }, (_, k) => (
                <rect
                  key={k}
                  x={b.x + 6 + (k % 2) * 16}
                  y={262 - b.h + 14 + Math.floor(k / 2) * 22}
                  width="8"
                  height="10"
                  fill={(i + k) % 3 === 0 ? t.accent : (i + k) % 3 === 1 ? t.accent2 : '#ffe9a0'}
                  opacity={(i * 3 + k) % 4 === 0 ? 0.25 : 0.9}
                />
              ))}
            </g>
          ))}
        </g>
      )}

      {has('lava') && (
        <g>
          {[
            [220, 166],
            [660, 176]
          ].map(([x, y], i) => (
            <g key={i}>
              <ellipse cx={x} cy={y} rx="34" ry="8" fill={t.accent} />
              <ellipse cx={x} cy={y - 2} rx="20" ry="4" fill={t.accent2} />
              <path
                d={`M${x - 8} ${y + 4} Q ${x - 16} ${y + 40} ${x - 36} ${y + 76}`}
                stroke={t.accent}
                strokeWidth="5"
                fill="none"
                strokeLinecap="round"
              />
              <path
                d={`M${x + 8} ${y + 4} Q ${x + 12} ${y + 34} ${x + 28} ${y + 66}`}
                stroke={t.accent}
                strokeWidth="4"
                fill="none"
                strokeLinecap="round"
              />
            </g>
          ))}
        </g>
      )}

      {has('trees') &&
        TREES.map(([x, y], i) => (
          <g key={i}>
            <rect x={x - 2} y={y} width="4" height="10" fill="#8a6a45" />
            <circle cx={x} cy={y - 4} r="11" fill={t.leaf} stroke={t.leafEdge} strokeWidth="2.5" />
          </g>
        ))}

      {has('pines') &&
        PINE_SPOTS.filter(([, y]) => y < 270).map(([x, y, s], i) => (
          <Pine key={i} x={x} y={y} s={s} theme={t} />
        ))}

      {has('stalactites') && (
        <path
          d={`M0 0 H860 V30 ${Array.from({ length: 16 }, (_, i) => {
            const x = 860 - i * 54
            return `L${x - 27} ${46 + ((i * 37) % 60)} L${x - 54} 30`
          }).join(' ')} Z`}
          fill={t.farHill}
          stroke={t.farHillEdge}
          strokeWidth="3"
        />
      )}

      {/* Near layer */}
      <path d={NEAR_PATHS[t.far]} fill={t.nearHill} stroke={t.nearHillEdge} strokeWidth="3" />

      {has('pines') &&
        PINE_SPOTS.filter(([, y]) => y >= 270).map(([x, y, s], i) => (
          <Pine key={i} x={x} y={y} s={s} theme={t} />
        ))}
      {has('palms') && PALMS.map(([x, y, s], i) => <Palm key={i} x={x} y={y} s={s} theme={t} />)}

      {has('waves') && (
        <g fill="none" stroke={t.accent} strokeWidth="3" strokeLinecap="round" opacity="0.7">
          {[
            [40, 272],
            [210, 266],
            [380, 276],
            [560, 268],
            [730, 274],
            [120, 304],
            [300, 300],
            [480, 306],
            [660, 302],
            [800, 310]
          ].map(([x, y], i) => (
            <path key={i} d={`M${x} ${y} q 12 -9 24 0 t 24 0`} />
          ))}
        </g>
      )}

      {/* Ground */}
      <path d={GROUND} fill={t.meadow} stroke={t.meadowEdge} strokeWidth="3" />

      {has('skyline') && (
        <g>
          <ellipse cx="430" cy="262" rx="520" ry="70" fill={t.glow} opacity="0.28" />
          {SKYLINE.map((b, i) => (
            <g key={i}>
              <rect
                x={b.x}
                y={262 - b.h}
                width={b.w}
                height={b.h}
                fill="#21104a"
                stroke="#34206a"
                strokeWidth="2"
              />
              <line
                x1={b.x}
                x2={b.x + b.w}
                y1={262 - b.h}
                y2={262 - b.h}
                stroke={i % 2 ? t.accent : t.accent2}
                strokeWidth="3"
              />
              {Array.from({ length: 6 }, (_, k) => (
                <rect
                  key={k}
                  x={b.x + 6 + (k % 2) * 16}
                  y={262 - b.h + 14 + Math.floor(k / 2) * 22}
                  width="8"
                  height="10"
                  fill={(i + k) % 3 === 0 ? t.accent : (i + k) % 3 === 1 ? t.accent2 : '#ffe9a0'}
                  opacity={(i * 3 + k) % 4 === 0 ? 0.25 : 0.9}
                />
              ))}
            </g>
          ))}
        </g>
      )}

      {has('lava') && (
        <path
          d="M0 372 Q 120 356 260 372 T 540 370 T 860 366 V 380 Q 700 392 540 384 T 260 386 T 0 384 Z"
          fill={t.accent}
          opacity="0.75"
        />
      )}

      {has('waves') && (
        <g fill="none" stroke={t.accent2} strokeWidth="3" strokeLinecap="round" opacity="0.8">
          {[
            [30, 360],
            [190, 392],
            [350, 366],
            [520, 398],
            [690, 370],
            [810, 402],
            [100, 420],
            [440, 424]
          ].map(([x, y], i) => (
            <path key={i} d={`M${x} ${y} q 14 -10 28 0 t 28 0`} />
          ))}
        </g>
      )}

      {has('cacti') && CACTI.map(([x, y, s], i) => <Cactus key={i} x={x} y={y} s={s} />)}

      {has('grass') &&
        TUFTS.map(([x, y], i) => (
          <path key={i} d={`M${x} ${y} l4 -12 l3 10 l4 -15 l3 13 l4 -10 l3 14 Z`} fill={t.tuft} />
        ))}

      {has('flowers') &&
        FLOWER_SPOTS.map(([x, y], i) => (
          <g key={i}>
            <circle
              cx={x}
              cy={y}
              r="4.5"
              fill={FLOWER_COLOURS[i % FLOWER_COLOURS.length]}
              stroke="#ffffff"
              strokeWidth="1"
            />
            <circle cx={x} cy={y} r="1.8" fill="#ffe680" />
          </g>
        ))}

      {has('crystals') &&
        CRYSTAL_SPOTS.map(([x, y, s], i) => (
          <Crystal key={i} x={x} y={y} s={s} theme={t} alt={i % 2 === 1} />
        ))}

      {has('lightning') && (
        <g fill={t.accent} stroke="#ffffff" strokeWidth="1.5" strokeLinejoin="round">
          <polygon points="620,60 588,150 612,150 576,250 654,128 628,128 656,60" />
          <polygon points="250,70 232,126 246,126 226,190 274,112 258,112 276,70" opacity="0.8" />
        </g>
      )}

      {has('rain') && (
        <g stroke={t.accent2} strokeWidth="1.5" opacity="0.5" strokeLinecap="round">
          {RAIN.map(([x, y], i) => (
            <line key={i} x1={x} y1={y} x2={x - 10} y2={y + 26} />
          ))}
        </g>
      )}

      {has('embers') &&
        EMBERS.map(([x, y, r], i) => (
          <circle key={i} cx={x} cy={y} r={r} fill={i % 2 ? t.accent2 : t.accent} opacity="0.85" />
        ))}

      {has('snow') &&
        SNOW.map(([x, y, r], i) => (
          <circle key={i} cx={x} cy={y} r={r} fill="#ffffff" opacity="0.9" />
        ))}

      {has('fireflies') &&
        FIREFLIES.map(([x, y], i) => (
          <g key={i}>
            <circle cx={x} cy={y} r="6" fill={t.accent} opacity="0.25" />
            <circle cx={x} cy={y} r="2" fill={t.accent} />
          </g>
        ))}
      {has('reeds') &&
        REEDS.map((x, i) => (
          <g key={x} className="gx-sway" style={{ animationDelay: `${-i * 0.7}s` }}>
            <line x1={x} y1="430" x2={x} y2={346 + (i % 3) * 10} stroke="#4a6a30" strokeWidth="3" />
            <ellipse
              cx={x}
              cy={344 + (i % 3) * 10}
              rx="4"
              ry="11"
              fill="#6a4a2a"
              stroke="#4a3018"
              strokeWidth="1.5"
            />
          </g>
        ))}

      {has('tombstones') &&
        TOMBS.map(([x, y, s], i) => (
          <g key={i} transform={`translate(${x} ${y}) scale(${s})`}>
            <path
              d="M-14 0 V-30 a14 14 0 0 1 28 0 V0 Z"
              fill="#3a2c52"
              stroke="#140c22"
              strokeWidth="3"
            />
            {i % 2 === 0 ? (
              <path d="M0 -34 V-14 M-7 -26 H7" stroke="#6a5a8a" strokeWidth="3" />
            ) : (
              <rect x="-7" y="-26" width="14" height="4" fill="#6a5a8a" />
            )}
          </g>
        ))}

      {has('mist') && (
        <g fill="#ffffff">
          <ellipse cx="220" cy="335" rx="340" ry="34" opacity="0.16" className="gx-drift" />
          <ellipse
            cx="660"
            cy="372"
            rx="360"
            ry="40"
            opacity="0.14"
            className="gx-drift"
            style={{ animationDelay: '-4s' }}
          />
        </g>
      )}

      {has('wisps') &&
        WISPS.map(([x, y], i) => (
          <g key={i} className="gx-bob" style={{ animationDelay: `${-i * 0.9}s` }}>
            <circle cx={x} cy={y} r="14" fill={t.accent} opacity="0.22" />
            <circle cx={x} cy={y} r="4.5" fill={t.accent} />
          </g>
        ))}

      {has('skyline') && (
        <g fill="none" stroke={t.accent} strokeWidth="2" opacity="0.55">
          <line x1="0" y1="330" x2="860" y2="330" />
          <line x1="0" y1="372" x2="860" y2="372" stroke={t.accent2} />
          <line x1="0" y1="420" x2="860" y2="420" />
        </g>
      )}

      {(has('leaves') || has('petals')) &&
        FALLERS.map((f, i) => (
          <ellipse
            key={i}
            className="gx-fall"
            cx={f.x}
            cy={f.y}
            rx={has('leaves') ? 7 : 5}
            ry={has('leaves') ? 3.5 : 3}
            fill={
              has('leaves') ? (i % 2 ? t.accent : t.accent2) : i % 3 === 0 ? t.accent2 : t.accent
            }
            style={{ animationDuration: `${f.dur}s`, animationDelay: `${f.delay}s` }}
          />
        ))}
    </svg>
  )
}
