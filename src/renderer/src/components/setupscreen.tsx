import { useState } from 'react'
import { PLAN_OPTIONS, formatPlan, type StudyMode } from '../game/stamina'
import { STARTERS } from '../game/progress'
import { REGIONS } from '../game/regions'
import { TRAINERS } from '../game/trainers'
import type { Settings } from '../hooks/usesettings'
import { REGION_DEX } from '../game/boxes'
import { artwork, trainerSprite } from '../sprites'
import MeadowScene from './meadowscene'
import { StarterChoice } from './starterchoice'

interface Props {
  onFinish: (patch: Partial<Settings>, starter: number) => void
}

const GOALS = [30, 60, 90, 120, 180, 240]
const STEPS = ['Welcome', 'Trainer', 'Study style', 'Region', 'Starter']

const HOW_IT_WORKS = [
  {
    title: 'Study to power up',
    text: 'Start the clock and your Pokémon earn XP in random bursts while you focus.'
  },
  {
    title: 'They get tired',
    text: "Studying drains their HP. Take breaks to heal: about 5 min after an hour of study, 10 after two, 30 after three or more. Worn-out Pokémon can't earn XP or help you catch."
  },
  {
    title: 'Catch new Pokémon',
    text: 'Roughly every 20 minutes of healthy studying brings a wild Pokémon. When you finish, you reveal each catch one by one.'
  },
  {
    title: 'Beat the gyms',
    text: 'Level caps stop your Pokémon at each badge and type matchups matter. Lose and you rest for 5 hours. Earn all 8 badges to unlock the other regions.'
  }
]

export default function SetupScreen({ onFinish }: Props): React.JSX.Element {
  const [step, setStep] = useState(0)
  const [name, setName] = useState('')
  const [trainerId, setTrainerId] = useState(TRAINERS[0].id)
  const [studyMode, setStudyMode] = useState<StudyMode>('stopwatch')
  const [planMin, setPlanMin] = useState(60)
  const [dailyGoalMin, setDailyGoalMin] = useState(120)
  const [region, setRegion] = useState<string | null>(null)
  const [starter, setStarter] = useState<number | null>(null)

  const trimmed = name.trim()
  const canNext = step === 1 ? trimmed.length > 0 : step === 3 ? region !== null : true

  function finish(): void {
    if (!region || starter === null) return
    onFinish(
      {
        name: trimmed,
        trainerId,
        background: 'meadow',
        studyMode,
        planMin,
        dailyGoalMin,
        startRegion: region,
        regionId: region
      },
      starter
    )
  }

  return (
    <div className="setup">
      <div className="setup-dots">
        {STEPS.map((s, i) => (
          <span key={s} className={`setup-dot${i === step ? ' on' : i < step ? ' done' : ''}`}>
            {s}
          </span>
        ))}
      </div>

      <div className="setup-body">
        {step === 0 && (
          <div className="setup-welcome">
            <h1 className="setup-title">Welcome to PokéStudy!</h1>
            <p className="setup-sub">
              Study hard, catch Pokémon, and take on the gyms. Here&apos;s how it works:
            </p>
            <div className="setup-cards">
              {HOW_IT_WORKS.map((c, i) => (
                <div key={c.title} className="setup-card">
                  <span className="setup-num">{i + 1}</span>
                  <h3>{c.title}</h3>
                  <p>{c.text}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {step === 1 && (
          <div className="setup-trainer">
            <div className="set-preview setup-preview">
              <MeadowScene background="meadow" />
              <span className="trainer-name">{trimmed || 'Your name'}</span>
              <div className="set-preview-shadow" />
              <img className="set-preview-sprite" src={trainerSprite(trainerId)} alt="" />
            </div>

            <div className="setup-form">
              <h2 className="setup-h2">What&apos;s your name, trainer?</h2>
              <input
                className="set-input"
                autoFocus
                value={name}
                maxLength={12}
                placeholder="Enter your name"
                onChange={(e) => setName(e.target.value)}
              />
              <h2 className="setup-h2">Pick your character</h2>
              <div className="set-characters setup-chars">
                {TRAINERS.map((t) => (
                  <button
                    key={t.id}
                    className={`set-char${t.id === trainerId ? ' selected' : ''}`}
                    title={`${t.name} (${t.game})`}
                    onClick={() => setTrainerId(t.id)}
                  >
                    <img src={trainerSprite(t.id)} alt={t.name} />
                    <span>{t.name}</span>
                  </button>
                ))}
              </div>
              <p className="set-note">
                You can change your name, character and background later in Settings.
              </p>
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="setup-study">
            <h1 className="setup-title">How do you like to study?</h1>
            <p className="setup-sub">
              Your party can study for about an hour before every Pokémon is worn out and needs a
              rest. You can change all of this any time from the cog next to Start, including a
              custom timer with scheduled breaks.
            </p>

            <h2 className="setup-h2">Clock style</h2>
            <div className="seg setup-seg">
              {(['stopwatch', 'timer'] as const).map((m) => (
                <button
                  key={m}
                  className={`seg-btn${studyMode === m ? ' active' : ''}`}
                  onClick={() => setStudyMode(m)}
                >
                  {m === 'stopwatch' ? 'Stopwatch (count up)' : 'Timer (count down)'}
                </button>
              ))}
            </div>

            {studyMode === 'timer' && (
              <>
                <h2 className="setup-h2">Timer length</h2>
                <div className="chips">
                  {PLAN_OPTIONS.map((m) => (
                    <button
                      key={m}
                      className={`chip${planMin === m ? ' active' : ''}`}
                      onClick={() => setPlanMin(m)}
                    >
                      {formatPlan(m)}
                    </button>
                  ))}
                </div>
              </>
            )}
            <h2 className="setup-h2">Daily study goal</h2>
            <div className="chips">
              {GOALS.map((m) => (
                <button
                  key={m}
                  className={`chip${dailyGoalMin === m ? ' active' : ''}`}
                  onClick={() => setDailyGoalMin(m)}
                >
                  {formatPlan(m)}
                </button>
              ))}
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="setup-region">
            <h1 className="setup-title">Choose your starting region</h1>
            <p className="setup-sub">
              Earn all 8 badges here to unlock the other regions. You can&apos;t change this later.
            </p>
            <div className="picker-grid">
              {Object.entries(REGIONS).map(([id, r]) => (
                <button
                  key={id}
                  className={`picker-card${region === id ? ' selected' : ''}`}
                  style={{ '--region': r.colour } as React.CSSProperties}
                  onClick={() => {
                    setRegion(id)
                    setStarter(null)
                  }}
                >
                  <span className="picker-name">{r.name}</span>
                  <span className="picker-starters">
                    {STARTERS[id].map((dex) => (
                      <img key={dex} src={artwork(dex)} alt="" />
                    ))}
                  </span>
                  <span className="picker-meta">
                    {REGION_DEX[id][1] - REGION_DEX[id][0] + 1} Pokémon &middot; 8 gyms
                  </span>
                </button>
              ))}
            </div>
          </div>
        )}

        {step === 4 && region && (
          <div className="setup-region">
            <h1 className="setup-title">Choose your starter</h1>
            <p className="setup-sub">
              Your partner for the journey. It joins your party at level 1, and every Pokémon you
              catch will join it.
            </p>
            <StarterChoice regionId={region} value={starter} onChange={setStarter} />
          </div>
        )}
      </div>

      <div className="setup-nav">
        {step > 0 ? (
          <button className="btn btn-secondary" onClick={() => setStep(step - 1)}>
            Back
          </button>
        ) : (
          <span />
        )}
        {step < STEPS.length - 1 ? (
          <button className="btn btn-primary" disabled={!canNext} onClick={() => setStep(step + 1)}>
            {step === 0 ? "Let's go!" : 'Next'}
          </button>
        ) : (
          <button className="btn btn-primary" disabled={starter === null} onClick={finish}>
            {starter === null ? 'Pick a starter' : 'Begin your journey!'}
          </button>
        )}
      </div>
    </div>
  )
}
