import type { GymType } from '../game/gyms'

// Seeded so every scene looks the same each time it opens
function rng(seed: number): () => number {
  let a = seed
  return () => {
    a |= 0
    a = (a + 0x6d2b79f5) | 0
    let t = Math.imul(a ^ (a >>> 15), 1 | a)
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

interface Dot {
  x: number
  y: number
  r: number
  dur: number
  delay: number
}

function dots(seed: number, n: number, rMin: number, rMax: number, yMin = 0, yMax = 600): Dot[] {
  const r = rng(seed)
  return Array.from({ length: n }, () => ({
    x: r() * 1000,
    y: yMin + r() * (yMax - yMin),
    r: rMin + r() * (rMax - rMin),
    dur: 5 + r() * 9,
    delay: -r() * 14
  }))
}

function Particles({
  list,
  cls,
  fill,
  opacity = 0.8
}: {
  list: Dot[]
  cls: string
  fill: string
  opacity?: number
}): React.JSX.Element {
  return (
    <g>
      {list.map((d, i) => (
        <circle
          key={i}
          className={cls}
          cx={d.x}
          cy={d.y}
          r={d.r}
          fill={fill}
          opacity={opacity}
          style={{ animationDuration: `${d.dur}s`, animationDelay: `${d.delay}s` }}
        />
      ))}
    </g>
  )
}

const FLAME = 'M0 0 C -16 -22 -8 -38 0 -70 C 8 -38 16 -22 0 0 Z'

function Flame({
  x,
  y,
  s,
  colour,
  inner,
  delay
}: {
  x: number
  y: number
  s: number
  colour: string
  inner: string
  delay: number
}): React.JSX.Element {
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      <g className="gx-flicker" style={{ animationDelay: `${delay}s` }}>
        <path d={FLAME} fill={colour} />
        <path d={FLAME} fill={inner} transform="scale(0.55)" />
      </g>
    </g>
  )
}

// ---------------------------------------------------------------- Rock (Brock)
function RockScene(): React.JSX.Element {
  const r = rng(11)
  const stalactites = Array.from({ length: 14 }, (_, i) => ({
    x: i * 80 + r() * 30,
    w: 50 + r() * 50,
    h: 60 + r() * 130
  }))
  const boulders = [
    [60, 540, 90],
    [190, 570, 60],
    [830, 545, 95],
    [940, 575, 55],
    [720, 590, 40],
    [300, 595, 38]
  ]
  return (
    <g>
      <defs>
        <linearGradient id="rk-bg" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#140a05" />
          <stop offset="0.55" stopColor="#4a2a14" />
          <stop offset="1" stopColor="#8a5428" />
        </linearGradient>
        <radialGradient id="rk-torch">
          <stop offset="0" stopColor="#ffb347" stopOpacity="0.75" />
          <stop offset="1" stopColor="#ffb347" stopOpacity="0" />
        </radialGradient>
        <linearGradient id="rk-beam" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#ffe9b0" stopOpacity="0.5" />
          <stop offset="1" stopColor="#ffe9b0" stopOpacity="0" />
        </linearGradient>
        <linearGradient id="rk-floor" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#6a4220" />
          <stop offset="1" stopColor="#261409" />
        </linearGradient>
      </defs>
      <rect width="1000" height="600" fill="url(#rk-bg)" />
      <polygon
        points="0,420 90,260 170,350 260,200 360,330 470,170 580,320 690,210 790,340 890,240 1000,380 1000,600 0,600"
        fill="#2b170b"
      />
      <polygon
        points="0,470 120,340 220,420 340,300 450,430 560,330 680,440 800,320 910,430 1000,360 1000,600 0,600"
        fill="#3d2211"
      />
      <ellipse cx="170" cy="330" rx="260" ry="220" fill="url(#rk-torch)" className="gx-pulse" />
      <ellipse
        cx="830"
        cy="330"
        rx="260"
        ry="220"
        fill="url(#rk-torch)"
        className="gx-pulse"
        style={{ animationDelay: '-1.3s' }}
      />
      <polygon
        points="400,0 600,0 780,600 220,600"
        fill="url(#rk-beam)"
        className="gx-pulse"
        style={{ animationDuration: '6s' }}
      />
      {stalactites.map((s, i) => (
        <polygon
          key={i}
          points={`${s.x},0 ${s.x + s.w},0 ${s.x + s.w / 2},${s.h}`}
          fill="#160b05"
          stroke="#2b170b"
          strokeWidth="3"
        />
      ))}
      <polygon points="0,470 1000,450 1000,600 0,600" fill="url(#rk-floor)" />
      <g stroke="#1a0d05" strokeWidth="3" fill="none" opacity="0.7" strokeLinecap="round">
        <path d="M120 520 l40 14 l-10 22 l36 12" />
        <path d="M520 500 l30 20 l-16 18 l30 24" />
        <path d="M800 510 l-34 16 l14 20 l-30 18" />
      </g>
      {boulders.map(([x, y, s], i) => (
        <g key={i}>
          <ellipse
            cx={x}
            cy={y}
            rx={s}
            ry={s * 0.72}
            fill="#4b2e16"
            stroke="#1a0d05"
            strokeWidth="4"
          />
          <ellipse cx={x - s * 0.25} cy={y - s * 0.25} rx={s * 0.4} ry={s * 0.22} fill="#6a4426" />
        </g>
      ))}
      <Flame x={110} y={430} s={1.4} colour="#ff7a1a" inner="#ffe27a" delay={0} />
      <Flame x={890} y={430} s={1.4} colour="#ff7a1a" inner="#ffe27a" delay={-0.5} />
      <rect x="104" y="428" width="12" height="60" fill="#2b170b" />
      <rect x="884" y="428" width="12" height="60" fill="#2b170b" />
      <Particles list={dots(3, 26, 1.5, 3.5)} cls="gx-drift" fill="#ffe9b0" opacity={0.55} />
      <polygon points="480,0 520,0 500,18" fill="#ffd36b" className="gx-pulse" />
    </g>
  )
}

// -------------------------------------------------------------- Water (Misty)
function WaterScene(): React.JSX.Element {
  const r = rng(21)
  const weeds = Array.from({ length: 12 }, (_, i) => ({
    x: i * 90 + r() * 40,
    h: 90 + r() * 120,
    d: -r() * 4
  }))
  return (
    <g>
      <defs>
        <linearGradient id="wt-bg" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#9be8ff" />
          <stop offset="0.4" stopColor="#2f9ae0" />
          <stop offset="1" stopColor="#06285e" />
        </linearGradient>
        <linearGradient id="wt-ray" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#ffffff" stopOpacity="0.5" />
          <stop offset="1" stopColor="#ffffff" stopOpacity="0" />
        </linearGradient>
      </defs>
      <rect width="1000" height="600" fill="url(#wt-bg)" />
      {[120, 330, 520, 720, 900].map((x, i) => (
        <polygon
          key={i}
          points={`${x},0 ${x + 70},0 ${x + 220},600 ${x - 80},600`}
          fill="url(#wt-ray)"
          className="gx-sway-wide"
          style={{ animationDelay: `${-i * 1.7}s` }}
          opacity="0.35"
        />
      ))}
      <path
        d="M0 80 Q 125 40 250 80 T 500 80 T 750 80 T 1000 80"
        stroke="#ffffff"
        strokeWidth="5"
        fill="none"
        opacity="0.5"
        className="gx-drift"
      />
      <polygon points="0,600 0,330 70,380 120,300 190,420 230,600" fill="#0d4a8a" opacity="0.8" />
      <polygon
        points="1000,600 1000,320 920,390 860,290 790,410 760,600"
        fill="#0d4a8a"
        opacity="0.8"
      />
      {weeds.map((w, i) => (
        <path
          key={i}
          className="gx-sway"
          style={{ animationDelay: `${w.d}s` }}
          d={`M${w.x} 560 q -20 -${w.h * 0.4} 0 -${w.h * 0.6} q 20 -${w.h * 0.3} 0 -${w.h * 0.4}`}
          stroke="#1ec28a"
          strokeWidth="9"
          fill="none"
          strokeLinecap="round"
          opacity="0.7"
        />
      ))}
      {[
        [140, 520, 1],
        [860, 500, 1.2],
        [520, 585, 0.7]
      ].map(([x, y, s], i) => (
        <polygon
          key={i}
          transform={`translate(${x} ${y}) scale(${s})`}
          points="0,-34 9,-11 33,-11 14,4 21,28 0,14 -21,28 -14,4 -33,-11 -9,-11"
          fill="#ff8a65"
          stroke="#c4492a"
          strokeWidth="3"
        />
      ))}
      <polygon points="0,470 1000,470 1000,600 0,600" fill="#0a4a92" opacity="0.65" />
      <g stroke="#8fd8ff" strokeWidth="3" opacity="0.5" fill="none">
        <path d="M80 520 q 30 -12 60 0 t 60 0" />
        <path d="M400 550 q 30 -12 60 0 t 60 0" />
        <path d="M700 515 q 30 -12 60 0 t 60 0" />
      </g>
      <Particles list={dots(5, 42, 3, 11, 300, 640)} cls="gx-rise" fill="#dff6ff" opacity={0.6} />
      <path
        d="M0 560 Q 125 520 250 560 T 500 560 T 750 560 T 1000 560 V 600 H 0 Z"
        fill="#1d7fd0"
        opacity="0.55"
        className="gx-drift"
      />
    </g>
  )
}

// --------------------------------------------------------- Electric (Lt. Surge)
function ElectricScene(): React.JSX.Element {
  const bolts = [
    { pts: '300,0 262,150 296,150 236,330 330,120 292,120 340,0', delay: 0 },
    { pts: '700,0 668,130 700,130 650,300 740,100 706,100 750,0', delay: -2.4 },
    { pts: '500,0 478,90 498,90 462,210 530,80 508,80 536,0', delay: -4.1 }
  ]
  return (
    <g>
      <defs>
        <linearGradient id="el-bg" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#06061c" />
          <stop offset="0.6" stopColor="#1a1850" />
          <stop offset="1" stopColor="#3b2c7a" />
        </linearGradient>
        <radialGradient id="el-glow">
          <stop offset="0" stopColor="#fff29a" stopOpacity="0.8" />
          <stop offset="1" stopColor="#fff29a" stopOpacity="0" />
        </radialGradient>
        <linearGradient id="el-floor" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#2a2a5a" />
          <stop offset="1" stopColor="#0b0b25" />
        </linearGradient>
      </defs>
      <rect width="1000" height="600" fill="url(#el-bg)" />
      <g fill="#10103a" opacity="0.95">
        <ellipse cx="150" cy="70" rx="260" ry="70" />
        <ellipse cx="520" cy="40" rx="300" ry="64" />
        <ellipse cx="880" cy="80" rx="250" ry="72" />
      </g>
      {bolts.map((b, i) => (
        <g key={i} className="gx-flash" style={{ animationDelay: `${b.delay}s` }}>
          <polygon
            points={b.pts}
            fill="#fff6a8"
            stroke="#ffffff"
            strokeWidth="3"
            strokeLinejoin="round"
          />
          <polygon
            points={b.pts}
            fill="none"
            stroke="#ffe03a"
            strokeWidth="14"
            opacity="0.35"
            strokeLinejoin="round"
          />
        </g>
      ))}
      <rect width="1000" height="600" fill="#fff6a8" opacity="0" className="gx-flash-screen" />
      {[
        [130, 270],
        [870, 270]
      ].map(([x, y], i) => (
        <g key={i} fill="#0c0c2c" stroke="#2a2a66" strokeWidth="4">
          <polygon points={`${x - 40},480 ${x - 12},${y} ${x + 12},${y} ${x + 40},480`} />
          <rect x={x - 62} y={y + 24} width="124" height="10" />
          <rect x={x - 46} y={y + 70} width="92" height="8" />
          <circle cx={x} cy={y - 8} r="14" fill="#ffe03a" className="gx-pulse" />
        </g>
      ))}
      <path
        d="M192 294 Q 330 380 500 330 T 808 294"
        stroke="#ffe03a"
        strokeWidth="4"
        fill="none"
        className="gx-flash"
        style={{ animationDuration: '1.6s' }}
      />
      <ellipse
        cx="500"
        cy="500"
        rx="480"
        ry="140"
        fill="url(#el-glow)"
        opacity="0.5"
        className="gx-pulse"
      />
      <polygon points="0,440 1000,440 1000,600 0,600" fill="url(#el-floor)" />
      <g stroke="#ffe03a" strokeWidth="2.5" opacity="0.7">
        {[0, 1, 2, 3, 4, 5].map((i) => (
          <line key={i} x1={500 + (i - 2.5) * 40} y1="440" x2={500 + (i - 2.5) * 260} y2="600" />
        ))}
        {[460, 490, 530, 580].map((y) => (
          <line key={y} x1="0" y1={y} x2="1000" y2={y} />
        ))}
      </g>
      <Particles
        list={dots(9, 34, 1.5, 3.5, 100, 560)}
        cls="gx-twinkle"
        fill="#fff29a"
        opacity={0.95}
      />
    </g>
  )
}

// ------------------------------------------------------------- Grass (Erika)
function GrassScene(): React.JSX.Element {
  const r = rng(41)
  const flowers = Array.from({ length: 22 }, () => ({
    x: r() * 1000,
    y: 440 + r() * 150,
    s: 0.7 + r() * 0.9,
    c: ['#ff8fb1', '#ffd84d', '#ffffff', '#c8a2ff', '#ff7a7a'][Math.floor(r() * 5)]
  }))
  return (
    <g>
      <defs>
        <linearGradient id="gr-bg" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#8fe3ff" />
          <stop offset="0.55" stopColor="#d8ffd0" />
          <stop offset="1" stopColor="#6ed06a" />
        </linearGradient>
        <linearGradient id="gr-lawn" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#52c05a" />
          <stop offset="1" stopColor="#1f7a38" />
        </linearGradient>
        <radialGradient id="gr-sun">
          <stop offset="0" stopColor="#fffbc8" stopOpacity="0.95" />
          <stop offset="1" stopColor="#fffbc8" stopOpacity="0" />
        </radialGradient>
      </defs>
      <rect width="1000" height="600" fill="url(#gr-bg)" />
      <circle cx="820" cy="80" r="190" fill="url(#gr-sun)" />
      <g
        className="gx-spin"
        style={{ transformOrigin: '820px 80px', animationDuration: '60s' }}
        opacity="0.25"
        fill="#fffbc8"
      >
        {Array.from({ length: 10 }, (_, i) => (
          <polygon
            key={i}
            points="820,80 790,-300 850,-300"
            transform={`rotate(${i * 36} 820 80)`}
          />
        ))}
      </g>
      <g stroke="#ffffff" strokeWidth="5" fill="none" opacity="0.75">
        <path d="M-20 440 Q 120 40 260 440" />
        <path d="M240 440 Q 380 -10 520 440" />
        <path d="M500 440 Q 640 -10 780 440" />
        <path d="M760 440 Q 900 40 1040 440" />
        <path d="M0 200 H1000" opacity="0.6" />
      </g>
      <polygon points="0,420 1000,420 1000,600 0,600" fill="url(#gr-lawn)" />
      <g fill="none" stroke="#2e9a48" strokeWidth="2" opacity="0.5">
        {[470, 520, 575].map((y) => (
          <path key={y} d={`M0 ${y} Q 250 ${y - 18} 500 ${y} T 1000 ${y}`} />
        ))}
      </g>
      {[
        [-30, 560, -20],
        [1030, 560, 20]
      ].map(([x, y, a], i) => (
        <g
          key={i}
          transform={`translate(${x} ${y}) rotate(${a})`}
          className="gx-sway-wide"
          style={{ animationDelay: `${-i * 2}s` }}
        >
          <path
            d="M0 0 C -80 -120 -40 -300 0 -380 C 40 -300 80 -120 0 0 Z"
            fill="#1f8a3c"
            stroke="#126a2a"
            strokeWidth="5"
          />
          <path d="M0 0 V -360" stroke="#126a2a" strokeWidth="5" />
        </g>
      ))}
      {flowers.map((f, i) => (
        <g key={i} transform={`translate(${f.x} ${f.y}) scale(${f.s})`}>
          <rect x="-2" y="0" width="4" height="22" fill="#2e8a3c" />
          {[0, 72, 144, 216, 288].map((a) => (
            <circle
              key={a}
              cx={Math.cos((a * Math.PI) / 180) * 9}
              cy={Math.sin((a * Math.PI) / 180) * 9}
              r="7"
              fill={f.c}
            />
          ))}
          <circle r="5" fill="#ffd84d" />
        </g>
      ))}
      <Particles list={dots(6, 22, 4, 8, -40, 200)} cls="gx-fall" fill="#ffb0cf" opacity={0.85} />
    </g>
  )
}

// ------------------------------------------------------------- Poison (Koga)
function PoisonScene(): React.JSX.Element {
  const r = rng(51)
  const bamboo = Array.from({ length: 13 }, (_, i) => ({
    x: i * 80 + r() * 30,
    w: 12 + r() * 10,
    h: 260 + r() * 200
  }))
  return (
    <g>
      <defs>
        <linearGradient id="po-bg" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#0c0418" />
          <stop offset="0.6" stopColor="#3a1458" />
          <stop offset="1" stopColor="#5a2a6e" />
        </linearGradient>
        <radialGradient id="po-moon">
          <stop offset="0" stopColor="#e8ffa8" stopOpacity="0.7" />
          <stop offset="1" stopColor="#e8ffa8" stopOpacity="0" />
        </radialGradient>
        <linearGradient id="po-floor" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#3a1a4a" />
          <stop offset="1" stopColor="#12061c" />
        </linearGradient>
      </defs>
      <rect width="1000" height="600" fill="url(#po-bg)" />
      <circle cx="680" cy="170" r="210" fill="url(#po-moon)" />
      <circle cx="680" cy="170" r="96" fill="#e8ffa8" stroke="#b6d96a" strokeWidth="5" />
      <circle cx="650" cy="150" r="14" fill="#c8e888" />
      <circle cx="705" cy="195" r="20" fill="#c8e888" />
      <circle cx="715" cy="135" r="9" fill="#c8e888" />
      {bamboo.map((b, i) => (
        <g key={i} className="gx-sway" style={{ animationDelay: `${-i * 0.6}s` }}>
          <rect x={b.x} y={560 - b.h} width={b.w} height={b.h} fill="#0b0414" />
          {[0.25, 0.5, 0.75].map((t) => (
            <rect key={t} x={b.x - 2} y={560 - b.h * t} width={b.w + 4} height="5" fill="#1d0a2c" />
          ))}
        </g>
      ))}
      <ellipse
        cx="300"
        cy="470"
        rx="420"
        ry="60"
        fill="#7a3aa0"
        opacity="0.35"
        className="gx-drift"
      />
      <ellipse
        cx="760"
        cy="500"
        rx="380"
        ry="50"
        fill="#4ad06a"
        opacity="0.22"
        className="gx-drift"
        style={{ animationDelay: '-4s' }}
      />
      <polygon points="0,480 1000,480 1000,600 0,600" fill="url(#po-floor)" />
      {[
        [160, 540, 90],
        [520, 560, 120],
        [850, 535, 80]
      ].map(([x, y, rx], i) => (
        <g key={i}>
          <ellipse
            cx={x}
            cy={y}
            rx={rx}
            ry={rx * 0.22}
            fill="#52e07a"
            opacity="0.8"
            className="gx-pulse"
          />
          <ellipse cx={x} cy={y} rx={rx * 0.6} ry={rx * 0.13} fill="#b8ffc8" opacity="0.7" />
        </g>
      ))}
      <Particles list={dots(8, 30, 4, 12, 380, 640)} cls="gx-rise" fill="#9aff8a" opacity={0.5} />
      <Particles list={dots(12, 16, 3, 7, 380, 640)} cls="gx-rise" fill="#e07aff" opacity={0.5} />
    </g>
  )
}

// ----------------------------------------------------------- Psychic (Sabrina)
function PsychicScene(): React.JSX.Element {
  const r = rng(61)
  const shapes = Array.from({ length: 14 }, () => ({
    x: 40 + r() * 920,
    y: 40 + r() * 380,
    s: 14 + r() * 34,
    kind: Math.floor(r() * 3),
    d: -r() * 6
  }))
  return (
    <g>
      <defs>
        <radialGradient id="ps-bg" cx="0.5" cy="0.45" r="0.8">
          <stop offset="0" stopColor="#8a2a9a" />
          <stop offset="0.5" stopColor="#3a0f5a" />
          <stop offset="1" stopColor="#0a0420" />
        </radialGradient>
        <radialGradient id="ps-core">
          <stop offset="0" stopColor="#ffd0f0" stopOpacity="0.9" />
          <stop offset="1" stopColor="#ffd0f0" stopOpacity="0" />
        </radialGradient>
      </defs>
      <rect width="1000" height="600" fill="url(#ps-bg)" />
      <circle cx="500" cy="250" r="220" fill="url(#ps-core)" className="gx-pulse" />
      <g fill="none" stroke="#ff7ac8" strokeWidth="3" opacity="0.55">
        {[80, 140, 210, 290, 380].map((rad, i) => (
          <circle
            key={rad}
            cx="500"
            cy="250"
            r={rad}
            strokeDasharray={i % 2 ? '6 14' : '30 10'}
            className="gx-spin"
            style={{
              transformOrigin: '500px 250px',
              animationDuration: `${30 + i * 12}s`,
              animationDirection: i % 2 ? 'reverse' : 'normal'
            }}
          />
        ))}
      </g>
      {shapes.map((s, i) => (
        <g key={i} className="gx-bob" style={{ animationDelay: `${s.d}s` }}>
          {s.kind === 0 && (
            <polygon
              points={`${s.x},${s.y - s.s} ${s.x + s.s * 0.7},${s.y} ${s.x},${s.y + s.s} ${s.x - s.s * 0.7},${s.y}`}
              fill="#ff9ae0"
              opacity="0.7"
              stroke="#ffffff"
              strokeWidth="2"
            />
          )}
          {s.kind === 1 && (
            <polygon
              points={`${s.x},${s.y - s.s} ${s.x + s.s},${s.y + s.s * 0.7} ${s.x - s.s},${s.y + s.s * 0.7}`}
              fill="#b48aff"
              opacity="0.65"
              stroke="#ffffff"
              strokeWidth="2"
            />
          )}
          {s.kind === 2 && (
            <circle
              cx={s.x}
              cy={s.y}
              r={s.s * 0.6}
              fill="#7ad8ff"
              opacity="0.6"
              stroke="#ffffff"
              strokeWidth="2"
            />
          )}
        </g>
      ))}
      <polygon points="0,460 1000,460 1000,600 0,600" fill="#1a0838" opacity="0.8" />
      <g fill="none" stroke="#ff7ac8" strokeWidth="3" opacity="0.8">
        <ellipse cx="500" cy="520" rx="330" ry="56" />
        <ellipse cx="500" cy="520" rx="240" ry="40" />
        <ellipse cx="500" cy="520" rx="140" ry="22" />
        <line x1="170" y1="520" x2="830" y2="520" opacity="0.5" />
        <line x1="500" y1="470" x2="500" y2="570" opacity="0.5" />
      </g>
      <Particles
        list={dots(14, 40, 1.5, 3.5, 0, 600)}
        cls="gx-twinkle"
        fill="#ffffff"
        opacity={0.95}
      />
    </g>
  )
}

// ---------------------------------------------------------------- Fire (Blaine)
function FireScene(): React.JSX.Element {
  return (
    <g>
      <defs>
        <linearGradient id="fi-bg" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#1c0303" />
          <stop offset="0.5" stopColor="#8a1a06" />
          <stop offset="1" stopColor="#ff7a1a" />
        </linearGradient>
        <radialGradient id="fi-glow">
          <stop offset="0" stopColor="#ffd36b" stopOpacity="0.95" />
          <stop offset="1" stopColor="#ff5a1a" stopOpacity="0" />
        </radialGradient>
        <linearGradient id="fi-lava" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#ffd36b" />
          <stop offset="1" stopColor="#e03a0a" />
        </linearGradient>
      </defs>
      <rect width="1000" height="600" fill="url(#fi-bg)" />
      <ellipse cx="500" cy="190" rx="360" ry="200" fill="url(#fi-glow)" className="gx-pulse" />
      <polygon
        points="120,520 400,200 440,150 560,150 600,200 880,520"
        fill="#2a0a06"
        stroke="#4a140a"
        strokeWidth="5"
      />
      <polygon points="440,150 560,150 535,168 465,168" fill="#ffb347" className="gx-pulse" />
      <path
        d="M470 168 Q 455 260 410 340 M530 168 Q 548 250 580 330 M500 170 Q 498 280 490 380"
        stroke="#ff7a1a"
        strokeWidth="9"
        fill="none"
        strokeLinecap="round"
        className="gx-pulse"
      />
      <g fill="#3a1010" opacity="0.8">
        <ellipse cx="200" cy="90" rx="220" ry="60" className="gx-drift" />
        <ellipse
          cx="800"
          cy="70"
          rx="240"
          ry="56"
          className="gx-drift"
          style={{ animationDelay: '-5s' }}
        />
      </g>
      <polygon points="0,450 1000,450 1000,600 0,600" fill="#2a0e08" />
      <path
        d="M0 500 Q 200 470 400 505 T 800 495 T 1000 510 V 600 H 0 Z"
        fill="url(#fi-lava)"
        className="gx-pulse"
        style={{ animationDuration: '3s' }}
      />
      <path
        d="M0 555 Q 250 535 500 560 T 1000 550 V 600 H 0 Z"
        fill="#ffd36b"
        opacity="0.8"
        className="gx-drift"
      />
      {[
        [70, 470, 1.9],
        [150, 480, 1.2],
        [930, 470, 1.9],
        [850, 485, 1.2],
        [300, 520, 0.9],
        [700, 525, 1]
      ].map(([x, y, s], i) => (
        <Flame key={i} x={x} y={y} s={s} colour="#ff5a1a" inner="#ffd36b" delay={-i * 0.37} />
      ))}
      <Particles
        list={dots(17, 50, 1.5, 4.5, 300, 660)}
        cls="gx-rise"
        fill="#ffb347"
        opacity={0.9}
      />
    </g>
  )
}

// -------------------------------------------------------------- Ground (Giovanni)
function GroundScene(): React.JSX.Element {
  const r = rng(81)
  const rocks = Array.from({ length: 7 }, () => ({
    x: 60 + r() * 880,
    y: 120 + r() * 240,
    s: 18 + r() * 40,
    d: -r() * 6
  }))
  return (
    <g>
      <defs>
        <linearGradient id="gd-bg" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#2a1208" />
          <stop offset="0.45" stopColor="#c0561a" />
          <stop offset="0.75" stopColor="#f5b45a" />
          <stop offset="1" stopColor="#8a4a1c" />
        </linearGradient>
        <radialGradient id="gd-sun">
          <stop offset="0" stopColor="#fff0b0" stopOpacity="0.95" />
          <stop offset="1" stopColor="#ffb347" stopOpacity="0" />
        </radialGradient>
        <linearGradient id="gd-floor" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#9a5a24" />
          <stop offset="1" stopColor="#3a1e0a" />
        </linearGradient>
      </defs>
      <rect width="1000" height="600" fill="url(#gd-bg)" />
      <circle cx="500" cy="350" r="260" fill="url(#gd-sun)" className="gx-pulse" />
      <circle cx="500" cy="350" r="120" fill="#fff0b0" opacity="0.95" />
      <polygon points="0,470 0,330 90,330 110,290 230,290 250,340 330,340 340,470" fill="#5a2a10" />
      <polygon
        points="1000,470 1000,300 910,300 890,260 760,260 740,320 650,320 640,470"
        fill="#5a2a10"
      />
      <polygon
        points="200,470 210,380 300,370 320,330 420,330 430,470"
        fill="#7a3a16"
        opacity="0.9"
      />
      <polygon
        points="580,470 590,340 690,340 700,390 800,390 810,470"
        fill="#7a3a16"
        opacity="0.9"
      />
      {rocks.map((k, i) => (
        <g key={i} className="gx-bob" style={{ animationDelay: `${k.d}s` }}>
          <polygon
            points={`${k.x},${k.y - k.s} ${k.x + k.s},${k.y} ${k.x + k.s * 0.5},${k.y + k.s * 0.8} ${k.x - k.s * 0.7},${k.y + k.s * 0.5}`}
            fill="#4a2410"
            stroke="#1c0c04"
            strokeWidth="3"
          />
        </g>
      ))}
      <polygon points="0,450 1000,450 1000,600 0,600" fill="url(#gd-floor)" />
      <g stroke="#1c0c04" strokeWidth="3" opacity="0.65" fill="none" strokeLinecap="round">
        <path d="M60 520 l50 -20 l30 30 l60 -14" />
        <path d="M420 500 l40 26 l-20 30 l50 20" />
        <path d="M780 510 l60 -18 l20 34 l50 -10" />
        <path d="M250 575 l60 -14 l24 18" />
      </g>
      <g stroke="#ffe3a0" strokeWidth="3" opacity="0.5" strokeLinecap="round">
        {Array.from({ length: 14 }, (_, i) => (
          <line
            key={i}
            className="gx-streak"
            style={{ animationDuration: `${2 + (i % 5) * 0.7}s`, animationDelay: `${-i * 0.5}s` }}
            x1={0}
            x2={70 + (i % 3) * 30}
            y1={120 + i * 32}
            y2={120 + i * 32}
          />
        ))}
      </g>
      <Particles
        list={dots(19, 30, 1.5, 3, 100, 560)}
        cls="gx-drift"
        fill="#ffe3a0"
        opacity={0.6}
      />
    </g>
  )
}

// ---------------------------------------------------------- Fighting (Brawly)
function FightingScene(): React.JSX.Element {
  return (
    <g>
      <defs>
        <linearGradient id="fg-bg" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#3a0a14" />
          <stop offset="0.5" stopColor="#c8321e" />
          <stop offset="1" stopColor="#ff9a3c" />
        </linearGradient>
        <radialGradient id="fg-sun">
          <stop offset="0" stopColor="#fff0b0" stopOpacity="0.95" />
          <stop offset="1" stopColor="#ff7a1a" stopOpacity="0" />
        </radialGradient>
        <linearGradient id="fg-floor" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#c89a5a" />
          <stop offset="1" stopColor="#5a3a1c" />
        </linearGradient>
      </defs>
      <rect width="1000" height="600" fill="url(#fg-bg)" />
      <circle cx="500" cy="300" r="280" fill="url(#fg-sun)" className="gx-pulse" />
      <circle cx="500" cy="300" r="130" fill="#fff0b0" opacity="0.95" />
      <g fill="#2a0a0a">
        <polygon
          points="0,440 0,330 120,350 220,300 320,360 420,320 500,370 600,320 700,360 800,300 900,350 1000,330 1000,440"
          opacity="0.85"
        />
      </g>
      {[110, 890].map((x) => (
        <g key={x}>
          <rect
            x={x - 28}
            y="60"
            width="56"
            height="420"
            fill="#4a1810"
            stroke="#1c0804"
            strokeWidth="4"
          />
          <rect x={x - 38} y="48" width="76" height="22" fill="#2a0c08" />
          <rect x={x - 38} y="470" width="76" height="22" fill="#2a0c08" />
        </g>
      ))}
      {[
        [250, 0],
        [750, -1.2]
      ].map(([x, d], i) => (
        <g key={i} className="gx-sway-wide" style={{ animationDelay: `${d}s` }}>
          <polygon
            points={`${x - 50},40 ${x + 50},40 ${x + 50},230 ${x},200 ${x - 50},230`}
            fill="#e0261a"
            stroke="#fff"
            strokeWidth="4"
          />
          <circle cx={x} cy="110" r="26" fill="none" stroke="#fff" strokeWidth="5" />
          <path d={`M${x - 14} 110 h28 M${x} 96 v28`} stroke="#fff" strokeWidth="5" />
        </g>
      ))}
      <polygon points="0,450 1000,450 1000,600 0,600" fill="url(#fg-floor)" />
      <g fill="none" stroke="#7a4a20" strokeWidth="3" opacity="0.8">
        <path d="M0 500 H1000 M0 550 H1000" />
        {Array.from({ length: 9 }, (_, i) => (
          <path key={i} d={`M${i * 125} 450 L${i * 125 - 90 + i * 22} 600`} />
        ))}
      </g>
      <ellipse
        cx="500"
        cy="520"
        rx="300"
        ry="48"
        fill="none"
        stroke="#e0261a"
        strokeWidth="7"
        opacity="0.85"
      />
      {[
        [330, 250],
        [670, 220],
        [520, 140],
        [210, 360],
        [800, 380]
      ].map(([x, y], i) => (
        <polygon
          key={i}
          className="gx-pulse"
          style={{ animationDelay: `${-i * 0.6}s` }}
          transform={`translate(${x} ${y})`}
          points="0,-26 7,-8 26,-8 11,3 17,22 0,10 -17,22 -11,3 -26,-8 -7,-8"
          fill="#ffe27a"
          stroke="#fff"
          strokeWidth="3"
        />
      ))}
      <Particles list={dots(23, 36, 1.5, 4, 150, 640)} cls="gx-rise" fill="#ffd36b" opacity={0.9} />
    </g>
  )
}

// ------------------------------------------------------------ Normal (Norman)
function NormalScene(): React.JSX.Element {
  const r = rng(91)
  const crowd = Array.from({ length: 46 }, (_, i) => ({
    x: i * 22 + r() * 8,
    y: 300 + (i % 3) * 22 + r() * 8,
    s: 9 + r() * 5
  }))
  return (
    <g>
      <defs>
        <linearGradient id="nm-bg" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#1a2a5a" />
          <stop offset="0.6" stopColor="#5a7ac0" />
          <stop offset="1" stopColor="#c8d8f0" />
        </linearGradient>
        <linearGradient id="nm-beam" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#ffffff" stopOpacity="0.55" />
          <stop offset="1" stopColor="#ffffff" stopOpacity="0" />
        </linearGradient>
        <linearGradient id="nm-floor" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#e8e8c8" />
          <stop offset="1" stopColor="#8a8a62" />
        </linearGradient>
      </defs>
      <rect width="1000" height="600" fill="url(#nm-bg)" />
      <polygon points="0,400 0,250 1000,250 1000,400" fill="#2a3a6a" />
      <polygon points="0,330 0,280 1000,280 1000,330" fill="#3a4c82" />
      {crowd.map((c, i) => (
        <circle
          key={i}
          cx={c.x}
          cy={c.y}
          r={c.s}
          fill={['#e8c0a0', '#c89070', '#f5d8b8', '#a87050'][i % 4]}
          opacity="0.85"
        />
      ))}
      {[
        [150, -22],
        [500, 0],
        [850, 22]
      ].map(([x, a], i) => (
        <g
          key={i}
          className="gx-spotlight"
          style={{ transformOrigin: `${x}px 0px`, animationDelay: `${-i * 1.4}s` }}
        >
          <polygon
            points={`${x - 16},0 ${x + 16},0 ${x + 150 + a * 2},520 ${x - 150 + a * 2},520`}
            fill="url(#nm-beam)"
          />
          <circle cx={x} cy="6" r="22" fill="#fff" />
        </g>
      ))}
      <polygon points="0,440 1000,440 1000,600 0,600" fill="url(#nm-floor)" />
      <g fill="#b0b088" opacity="0.7">
        {Array.from({ length: 24 }, (_, i) => (
          <rect
            key={i}
            x={(i % 8) * 125 + (Math.floor(i / 8) % 2) * 62}
            y={450 + Math.floor(i / 8) * 50}
            width="62"
            height="50"
          />
        ))}
      </g>
      <ellipse cx="500" cy="520" rx="320" ry="52" fill="none" stroke="#e03a3a" strokeWidth="7" />
      <ellipse cx="500" cy="520" rx="60" ry="10" fill="#e03a3a" opacity="0.8" />
      <Particles list={dots(31, 32, 3, 6, -40, 300)} cls="gx-fall" fill="#ffd84d" opacity={0.9} />
      <Particles list={dots(33, 24, 3, 6, -40, 300)} cls="gx-fall" fill="#ff7a9a" opacity={0.9} />
    </g>
  )
}

// ------------------------------------------------------------- Flying (Winona)
function FlyingScene(): React.JSX.Element {
  const clouds = [
    [120, 440, 1.6],
    [470, 500, 2],
    [820, 460, 1.7],
    [300, 560, 1.4],
    [680, 580, 1.5]
  ]
  const islands = [
    [200, 220, 1],
    [760, 160, 0.8],
    [520, 300, 0.6]
  ]
  return (
    <g>
      <defs>
        <linearGradient id="fl-bg" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#2a6ad8" />
          <stop offset="0.6" stopColor="#7ac4ff" />
          <stop offset="1" stopColor="#e8f6ff" />
        </linearGradient>
        <radialGradient id="fl-sun">
          <stop offset="0" stopColor="#fffbd0" stopOpacity="0.95" />
          <stop offset="1" stopColor="#fffbd0" stopOpacity="0" />
        </radialGradient>
      </defs>
      <rect width="1000" height="600" fill="url(#fl-bg)" />
      <circle cx="820" cy="110" r="220" fill="url(#fl-sun)" />
      <g
        className="gx-spin"
        style={{ transformOrigin: '820px 110px', animationDuration: '90s' }}
        opacity="0.2"
        fill="#ffffff"
      >
        {Array.from({ length: 12 }, (_, i) => (
          <polygon
            key={i}
            points="820,110 800,-300 840,-300"
            transform={`rotate(${i * 30} 820 110)`}
          />
        ))}
      </g>
      {islands.map(([x, y, s], i) => (
        <g
          key={i}
          className="gx-bob"
          style={{ animationDelay: `${-i * 1.6}s` }}
          transform={`translate(${x} ${y}) scale(${s})`}
        >
          <polygon
            points="-120,0 120,0 70,70 20,130 -30,90 -80,50"
            fill="#8a6a45"
            stroke="#4a3520"
            strokeWidth="4"
          />
          <path d="M-130 4 Q 0 -50 130 4 Z" fill="#58c05a" stroke="#2e8a3c" strokeWidth="4" />
          <circle cx="-40" cy="-20" r="22" fill="#3aa04a" />
          <circle cx="30" cy="-24" r="26" fill="#44b054" />
        </g>
      ))}
      {[
        [70, 90],
        [900, 260],
        [420, 120]
      ].map(([x, y], i) => (
        <g
          key={i}
          className="gx-drift"
          style={{ animationDelay: `${-i * 2.5}s`, animationDuration: '7s' }}
          fill="none"
          stroke="#1a3a8a"
          strokeWidth="4"
          strokeLinecap="round"
        >
          <path d={`M${x} ${y} q 14 -16 28 0 q 14 -16 28 0`} />
        </g>
      ))}
      <g stroke="#ffffff" strokeWidth="3" opacity="0.5" strokeLinecap="round">
        {Array.from({ length: 12 }, (_, i) => (
          <line
            key={i}
            className="gx-streak"
            style={{ animationDuration: `${1.8 + (i % 4) * 0.6}s`, animationDelay: `${-i * 0.4}s` }}
            x1={0}
            x2={90 + (i % 3) * 40}
            y1={90 + i * 38}
            y2={90 + i * 38}
          />
        ))}
      </g>
      {clouds.map(([x, y, s], i) => (
        <g
          key={i}
          className="gx-drift"
          style={{ animationDelay: `${-i * 1.8}s`, animationDuration: '14s' }}
          transform={`translate(${x} ${y}) scale(${s})`}
        >
          <ellipse cx="0" cy="0" rx="120" ry="44" fill="#ffffff" />
          <ellipse cx="-60" cy="-22" rx="56" ry="40" fill="#ffffff" />
          <ellipse cx="40" cy="-30" rx="64" ry="46" fill="#ffffff" />
          <ellipse cx="0" cy="22" rx="110" ry="20" fill="#dcecf8" />
        </g>
      ))}
      <Particles list={dots(37, 18, 5, 9, -40, 260)} cls="gx-fall" fill="#ffffff" opacity={0.85} />
    </g>
  )
}

// ------------------------------------------------------------------- Bug (Bugsy)
function BugScene(): React.JSX.Element {
  const r = rng(101)
  const hexes = Array.from({ length: 28 }, (_, i) => ({
    x: (i % 7) * 150 + (Math.floor(i / 7) % 2) * 75 - 20,
    y: 470 + Math.floor(i / 7) * 42
  }))
  const leaves = Array.from({ length: 7 }, () => ({
    x: r() * 1000,
    y: 30 + r() * 220,
    s: 0.7 + r() * 1.1,
    a: r() * 60 - 30
  }))
  return (
    <g>
      <defs>
        <linearGradient id="bg-bg" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#0f2a0c" />
          <stop offset="0.55" stopColor="#3f7a1e" />
          <stop offset="1" stopColor="#a8d84a" />
        </linearGradient>
        <radialGradient id="bg-glow">
          <stop offset="0" stopColor="#f4ff8a" stopOpacity="0.6" />
          <stop offset="1" stopColor="#f4ff8a" stopOpacity="0" />
        </radialGradient>
        <linearGradient id="bg-floor" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#5a8a22" />
          <stop offset="1" stopColor="#1f3a0c" />
        </linearGradient>
      </defs>
      <rect width="1000" height="600" fill="url(#bg-bg)" />
      <ellipse cx="500" cy="260" rx="420" ry="220" fill="url(#bg-glow)" className="gx-pulse" />
      {leaves.map((l, i) => (
        <g
          key={i}
          className="gx-sway-wide"
          style={{ animationDelay: `${-i * 1.3}s` }}
          transform={`translate(${l.x} ${l.y}) rotate(${l.a}) scale(${l.s})`}
        >
          <path
            d="M0 0 C 60 -50 150 -30 190 20 C 130 60 50 60 0 0 Z"
            fill="#1f5a14"
            stroke="#0f3a0a"
            strokeWidth="4"
          />
          <path d="M0 0 L180 18" stroke="#0f3a0a" strokeWidth="4" />
        </g>
      ))}
      {[
        [110, 120],
        [900, 150]
      ].map(([x, y], i) => (
        <g key={i} stroke="#e8f5d0" strokeWidth="2" fill="none" opacity="0.7">
          {[0, 25, 50, 75, 100, 125, 150].map((a) => (
            <line
              key={a}
              x1={x}
              y1={y}
              x2={x + Math.cos(((a + (i ? 90 : 0)) * Math.PI) / 180) * 150}
              y2={y + Math.sin(((a + (i ? 90 : 0)) * Math.PI) / 180) * 150}
            />
          ))}
          {[40, 80, 120].map((rad) => (
            <circle key={rad} cx={x} cy={y} r={rad} strokeDasharray="10 8" />
          ))}
        </g>
      ))}
      <polygon points="0,440 1000,440 1000,600 0,600" fill="url(#bg-floor)" />
      {hexes.map((h, i) => (
        <polygon
          key={i}
          transform={`translate(${h.x} ${h.y})`}
          points="40,0 100,0 130,26 100,52 40,52 10,26"
          fill="#ffc83a"
          fillOpacity="0.28"
          stroke="#ffe27a"
          strokeWidth="3"
        />
      ))}
      {[
        [70, 520, 1],
        [920, 530, 1.2]
      ].map(([x, y, s], i) => (
        <g key={i} transform={`translate(${x} ${y}) scale(${s})`}>
          <rect
            x="-6"
            y="-26"
            width="12"
            height="30"
            fill="#e8d8b8"
            stroke="#8a7a5a"
            strokeWidth="2"
          />
          <ellipse
            cx="0"
            cy="-30"
            rx="34"
            ry="20"
            fill="#e8453a"
            stroke="#8a1a14"
            strokeWidth="3"
          />
          <circle cx="-12" cy="-34" r="5" fill="#fff" />
          <circle cx="10" cy="-28" r="6" fill="#fff" />
          <circle cx="2" cy="-40" r="4" fill="#fff" />
        </g>
      ))}
      <Particles
        list={dots(41, 30, 2, 4.5, 200, 560)}
        cls="gx-twinkle"
        fill="#f4ff8a"
        opacity={0.95}
      />
      <Particles list={dots(43, 16, 2, 4, 200, 560)} cls="gx-bob" fill="#ffffff" opacity={0.5} />
    </g>
  )
}

// ---------------------------------------------------------------- Ghost (Morty, Fantina)
function GhostScene(): React.JSX.Element {
  const bats = [
    [160, 120, 1],
    [420, 70, 0.8],
    [760, 130, 1.1],
    [900, 60, 0.7]
  ]
  return (
    <g>
      <defs>
        <linearGradient id="gh-bg" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#0a0518" />
          <stop offset="0.6" stopColor="#2a1450" />
          <stop offset="1" stopColor="#4a2a78" />
        </linearGradient>
        <radialGradient id="gh-moon">
          <stop offset="0" stopColor="#e8dcff" stopOpacity="0.7" />
          <stop offset="1" stopColor="#e8dcff" stopOpacity="0" />
        </radialGradient>
        <linearGradient id="gh-floor" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#2a1a44" />
          <stop offset="1" stopColor="#0c0618" />
        </linearGradient>
      </defs>
      <rect width="1000" height="600" fill="url(#gh-bg)" />
      <circle cx="800" cy="130" r="170" fill="url(#gh-moon)" />
      <circle cx="800" cy="130" r="78" fill="#efe8ff" />
      <circle cx="778" cy="112" r="13" fill="#d4c8f0" />
      <circle cx="822" cy="150" r="17" fill="#d4c8f0" />
      <g fill="#0a0414" stroke="#1c1030" strokeWidth="4">
        <polygon points="330,470 330,260 380,260 380,210 430,160 470,210 470,150 500,100 530,150 530,210 570,160 620,210 620,260 670,260 670,470" />
        <polygon points="470,100 500,40 530,100" />
        <rect x="300" y="300" width="40" height="170" />
        <rect x="660" y="300" width="40" height="170" />
      </g>
      {[
        [400, 320],
        [460, 260],
        [540, 260],
        [600, 320],
        [500, 190],
        [500, 390]
      ].map(([x, y], i) => (
        <rect
          key={i}
          x={x - 14}
          y={y - 20}
          width="28"
          height="40"
          fill={i % 2 ? '#c8a0ff' : '#8affc8'}
          className="gx-pulse"
          style={{ animationDelay: `${-i * 0.7}s` }}
        />
      ))}
      <ellipse
        cx="500"
        cy="470"
        rx="600"
        ry="50"
        fill="#b8a0e8"
        opacity="0.18"
        className="gx-drift"
      />
      {bats.map(([x, y, s], i) => (
        <g
          key={i}
          className="gx-drift"
          style={{ animationDelay: `${-i * 2.3}s`, animationDuration: '8s' }}
          transform={`translate(${x} ${y}) scale(${s})`}
          fill="#080410"
        >
          <path d="M0 0 q-18 -22 -42 -6 q12 2 16 12 q-14 -2 -22 8 q22 -6 30 4 q4 -6 18 -4 q14 -2 18 4 q8 -10 30 -4 q-8 -10 -22 -8 q4 -10 16 -12 q-24 -16 -42 6 z" />
        </g>
      ))}
      <polygon points="0,470 1000,470 1000,600 0,600" fill="url(#gh-floor)" />
      <g opacity="0.55">
        {Array.from({ length: 16 }, (_, i) => (
          <rect
            key={i}
            x={(i % 8) * 125}
            y={480 + Math.floor(i / 8) * 55}
            width="125"
            height="55"
            fill={(i + Math.floor(i / 8)) % 2 ? '#3a2860' : '#1a1030'}
          />
        ))}
      </g>
      <Flame x={250} y={500} s={1.3} colour="#8a68ff" inner="#e0d0ff" delay={0} />
      <Flame x={750} y={500} s={1.3} colour="#8a68ff" inner="#e0d0ff" delay={-0.4} />
      <rect x="245" y="498" width="10" height="60" fill="#1c1030" />
      <rect x="745" y="498" width="10" height="60" fill="#1c1030" />
      <Particles list={dots(47, 18, 6, 14, 200, 640)} cls="gx-rise" fill="#c8a0ff" opacity={0.35} />
      <Particles list={dots(49, 12, 5, 10, 200, 640)} cls="gx-rise" fill="#8affc8" opacity={0.35} />
    </g>
  )
}

// -------------------------------------------------------------- Steel (Jasmine, Byron)
function SteelScene(): React.JSX.Element {
  const gear = (
    cx: number,
    cy: number,
    rad: number,
    teeth: number,
    dur: number,
    rev: boolean
  ): React.JSX.Element => (
    <g
      className="gx-spin"
      style={{
        transformOrigin: `${cx}px ${cy}px`,
        animationDuration: `${dur}s`,
        animationDirection: rev ? 'reverse' : 'normal'
      }}
    >
      <circle cx={cx} cy={cy} r={rad} fill="#3a4152" stroke="#1a1e28" strokeWidth="5" />
      {Array.from({ length: teeth }, (_, i) => (
        <rect
          key={i}
          x={cx - 14}
          y={cy - rad - 20}
          width="28"
          height="34"
          fill="#3a4152"
          stroke="#1a1e28"
          strokeWidth="4"
          transform={`rotate(${(i * 360) / teeth} ${cx} ${cy})`}
        />
      ))}
      <circle cx={cx} cy={cy} r={rad * 0.45} fill="#222733" stroke="#1a1e28" strokeWidth="4" />
      <circle cx={cx} cy={cy} r={rad * 0.12} fill="#8a93a8" />
    </g>
  )
  return (
    <g>
      <defs>
        <linearGradient id="st-bg" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#12151d" />
          <stop offset="0.6" stopColor="#3a4254" />
          <stop offset="1" stopColor="#8a93a8" />
        </linearGradient>
        <linearGradient id="st-floor" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#6a7388" />
          <stop offset="1" stopColor="#262b38" />
        </linearGradient>
        <linearGradient id="st-beam" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#ffffff" stopOpacity="0.4" />
          <stop offset="1" stopColor="#ffffff" stopOpacity="0" />
        </linearGradient>
        <radialGradient id="st-furnace">
          <stop offset="0" stopColor="#ff9a3c" stopOpacity="0.7" />
          <stop offset="1" stopColor="#ff9a3c" stopOpacity="0" />
        </radialGradient>
      </defs>
      <rect width="1000" height="600" fill="url(#st-bg)" />
      <ellipse cx="500" cy="470" rx="380" ry="150" fill="url(#st-furnace)" className="gx-pulse" />
      {gear(150, 190, 100, 12, 40, false)}
      {gear(300, 120, 56, 9, 26, true)}
      {gear(850, 200, 120, 14, 50, true)}
      {gear(700, 110, 62, 10, 30, false)}
      <g fill="#2a3040" stroke="#14171f" strokeWidth="4">
        <rect x="0" y="300" width="1000" height="26" />
        <rect x="0" y="352" width="1000" height="16" />
        {[120, 380, 620, 880].map((x) => (
          <rect key={x} x={x} y="290" width="22" height="90" />
        ))}
      </g>
      {[
        [250, -8],
        [500, 0],
        [750, 8]
      ].map(([x, a], i) => (
        <polygon
          key={i}
          points={`${x - 16},0 ${x + 16},0 ${x + 130 + a * 3},470 ${x - 130 + a * 3},470`}
          fill="url(#st-beam)"
          className="gx-pulse"
          style={{ animationDelay: `${-i * 1.2}s` }}
        />
      ))}
      <polygon points="0,450 1000,450 1000,600 0,600" fill="url(#st-floor)" />
      <g stroke="#1a1e28" strokeWidth="3" opacity="0.8">
        {Array.from({ length: 8 }, (_, i) => (
          <line key={i} x1={i * 143} y1="450" x2={i * 143 - 70} y2="600" />
        ))}
        <line x1="0" y1="510" x2="1000" y2="510" />
        <line x1="0" y1="560" x2="1000" y2="560" />
      </g>
      <g fill="#b8c0d4">
        {Array.from({ length: 14 }, (_, i) => (
          <circle key={i} cx={36 + i * 72} cy={470 + (i % 3) * 52} r="4" />
        ))}
      </g>
      <Particles
        list={dots(53, 40, 1.5, 3.5, 300, 640)}
        cls="gx-rise"
        fill="#ffb347"
        opacity={0.95}
      />
    </g>
  )
}

// -------------------------------------------------------------------- Ice (Pryce, Candice, Brycen)
function IceScene(): React.JSX.Element {
  const r = rng(131)
  const icicles = Array.from({ length: 18 }, (_, i) => ({
    x: i * 58 + r() * 20,
    w: 30 + r() * 30,
    h: 50 + r() * 150
  }))
  return (
    <g>
      <defs>
        <linearGradient id="ic-bg" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#0b2a52" />
          <stop offset="0.55" stopColor="#3a86c8" />
          <stop offset="1" stopColor="#d4f2ff" />
        </linearGradient>
        <linearGradient id="ic-floor" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#bdeaff" />
          <stop offset="1" stopColor="#5a9fd0" />
        </linearGradient>
        <radialGradient id="ic-shine">
          <stop offset="0" stopColor="#ffffff" stopOpacity="0.85" />
          <stop offset="1" stopColor="#ffffff" stopOpacity="0" />
        </radialGradient>
      </defs>
      <rect width="1000" height="600" fill="url(#ic-bg)" />
      <path
        d="M0 110 Q 250 40 500 110 T 1000 90 V 190 Q 750 230 500 190 T 0 210 Z"
        fill="#5affc0"
        opacity="0.2"
        className="gx-pulse"
      />
      <polygon
        points="0,470 90,300 170,380 270,230 380,370 500,260 620,380 740,240 850,370 940,290 1000,380 1000,600 0,600"
        fill="#7ab8e0"
        opacity="0.7"
      />
      <polygon
        points="0,480 130,380 240,440 380,340 500,450 640,360 790,440 900,380 1000,430 1000,600 0,600"
        fill="#a8d8f5"
      />
      {icicles.map((c, i) => (
        <polygon
          key={i}
          points={`${c.x},0 ${c.x + c.w},0 ${c.x + c.w / 2},${c.h}`}
          fill="#d8f4ff"
          stroke="#8ac8e8"
          strokeWidth="3"
          opacity="0.92"
        />
      ))}
      <polygon points="0,470 1000,470 1000,600 0,600" fill="url(#ic-floor)" />
      <ellipse cx="500" cy="520" rx="420" ry="46" fill="url(#ic-shine)" className="gx-pulse" />
      {[
        [110, 520, 1],
        [880, 530, 1.2],
        [300, 575, 0.6],
        [700, 580, 0.7]
      ].map(([x, y, s], i) => (
        <g
          key={i}
          transform={`translate(${x} ${y}) scale(${s})`}
          fill="#e8fbff"
          stroke="#8ac8e8"
          strokeWidth="3"
          opacity="0.95"
        >
          <polygon points="0,-70 14,-20 0,0 -14,-20" />
          <polygon points="26,-46 38,-12 22,0 12,-14" />
          <polygon points="-26,-40 -12,-10 -30,0 -38,-18" />
        </g>
      ))}
      <Particles
        list={dots(59, 46, 1.8, 4.5, -60, 300)}
        cls="gx-fall"
        fill="#ffffff"
        opacity={0.95}
      />
    </g>
  )
}

// ---------------------------------------------------------------- Dragon (Clair, Drayden)
function DragonScene(): React.JSX.Element {
  return (
    <g>
      <defs>
        <linearGradient id="dr-bg" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#0a0620" />
          <stop offset="0.5" stopColor="#3a1478" />
          <stop offset="1" stopColor="#c0462a" />
        </linearGradient>
        <radialGradient id="dr-core">
          <stop offset="0" stopColor="#ffd36b" stopOpacity="0.85" />
          <stop offset="1" stopColor="#ff6a2a" stopOpacity="0" />
        </radialGradient>
        <linearGradient id="dr-floor" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#3a2a4a" />
          <stop offset="1" stopColor="#120a1c" />
        </linearGradient>
      </defs>
      <rect width="1000" height="600" fill="url(#dr-bg)" />
      <ellipse cx="500" cy="300" rx="420" ry="230" fill="url(#dr-core)" className="gx-pulse" />
      <g
        fill="#0c0618"
        stroke="#2a1648"
        strokeWidth="4"
        className="gx-pulse"
        style={{ animationDuration: '5s' }}
      >
        <path d="M500 250 C 420 130 260 90 90 160 C 190 170 250 200 290 270 C 230 250 170 260 120 300 C 230 290 300 320 340 380 C 420 340 470 310 500 250 Z" />
        <path d="M500 250 C 580 130 740 90 910 160 C 810 170 750 200 710 270 C 770 250 830 260 880 300 C 770 290 700 320 660 380 C 580 340 530 310 500 250 Z" />
        <ellipse cx="500" cy="300" rx="34" ry="64" />
        <path d="M486 236 l-12 -42 l24 22 l2 -38 l14 40 l24 -24 l-8 42 z" />
      </g>
      <polygon
        points="0,470 0,350 100,300 190,380 300,320 400,400 500,360 600,400 700,320 810,380 900,300 1000,350 1000,470"
        fill="#0e0820"
      />
      {[60, 940].map((x) => (
        <g key={x}>
          <rect
            x={x - 26}
            y="250"
            width="52"
            height="230"
            fill="#241638"
            stroke="#0a0614"
            strokeWidth="4"
          />
          <path
            d={`M${x - 14} 300 h28 M${x - 14} 350 h28 M${x} 290 v80`}
            stroke="#ffd36b"
            strokeWidth="4"
            className="gx-pulse"
          />
        </g>
      ))}
      <g className="gx-flash" style={{ animationDelay: '-1s' }}>
        <polygon
          points="220,0 196,100 220,100 180,210 250,90 226,90 250,0"
          fill="#e0d0ff"
          stroke="#fff"
          strokeWidth="2"
        />
      </g>
      <g className="gx-flash" style={{ animationDelay: '-3.2s' }}>
        <polygon
          points="800,0 778,90 800,90 764,190 826,80 806,80 826,0"
          fill="#e0d0ff"
          stroke="#fff"
          strokeWidth="2"
        />
      </g>
      <polygon points="0,460 1000,460 1000,600 0,600" fill="url(#dr-floor)" />
      <g fill="none" stroke="#ffd36b" strokeWidth="4" opacity="0.8">
        <ellipse cx="500" cy="525" rx="320" ry="52" className="gx-pulse" />
        <ellipse cx="500" cy="525" rx="220" ry="34" />
        <ellipse cx="500" cy="525" rx="110" ry="17" />
        <path d="M180 525 h640 M500 475 v100" opacity="0.5" />
      </g>
      <Particles list={dots(61, 40, 1.5, 4, 250, 660)} cls="gx-rise" fill="#ffb347" opacity={0.9} />
    </g>
  )
}

const SCENES: Record<GymType, () => React.JSX.Element> = {
  rock: RockScene,
  water: WaterScene,
  electric: ElectricScene,
  grass: GrassScene,
  poison: PoisonScene,
  psychic: PsychicScene,
  fire: FireScene,
  ground: GroundScene,
  fighting: FightingScene,
  normal: NormalScene,
  flying: FlyingScene,
  bug: BugScene,
  ghost: GhostScene,
  steel: SteelScene,
  ice: IceScene,
  dragon: DragonScene
}

export default function GymBackdrop({ type }: { type: GymType | null }): React.JSX.Element {
  const Scene = type ? SCENES[type] : null
  return (
    <svg
      className="gym-backdrop"
      viewBox="0 0 1000 600"
      preserveAspectRatio="xMidYMid slice"
      aria-hidden="true"
    >
      <defs>
        <radialGradient id="gx-vignette" cx="0.5" cy="0.5" r="0.75">
          <stop offset="0.55" stopColor="#000000" stopOpacity="0" />
          <stop offset="1" stopColor="#000000" stopOpacity="0.55" />
        </radialGradient>
      </defs>
      {Scene ? <Scene /> : <rect width="1000" height="600" fill="#2a2a44" />}
      <rect width="1000" height="600" fill="url(#gx-vignette)" />
    </svg>
  )
}
