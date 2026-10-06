import { useEffect, useState } from 'react'
import { weaknessesOf, type BattleResult, type Segment } from '../game/battle'
import { COOLDOWN_MS, SPEECH, TYPE_COLOURS, type GymLeader } from '../game/gyms'
import { REGIONS } from '../game/regions'
import { artwork, trainerSprite } from '../sprites'
import BadgeIcon from './badgeicon'
import GymBackdrop from './gymbackdrop'

interface Props {
  leader: GymLeader
  regionId: string
  badgeIndex: number
  trainerId: string
  playerName: string
  result: BattleResult
  onWin: () => void
  onLose: () => void
  onClose: () => void
}

type Phase = 'intro' | 'clash' | 'fade' | 'speech'

const INTRO_MS = 2400
const FADE_MS = 2000
const STEP_MS = [400, 600, 600, 750] // ready, player strikes, foe strikes, faint
const MAX_SHOWN = 6
const TYPE_MS = 28

const CONFETTI = Array.from({ length: 40 }, (_, i) => ({
  x: (i * 53) % 100,
  delay: ((i * 37) % 20) / 10,
  dur: 2 + ((i * 17) % 20) / 10,
  colour: ['#ffd84d', '#ff5a5a', '#5ad8ff', '#7aff8a', '#ff8fe0'][i % 5]
}))

// Long battles are trimmed to the opening and closing knockouts so the show stays short
function trim(segments: Segment[]): Segment[] {
  if (segments.length <= MAX_SHOWN) return segments
  const half = MAX_SHOWN / 2
  return [...segments.slice(0, half), ...segments.slice(-half)]
}

function Typewriter({ text, onDone }: { text: string; onDone: () => void }): React.JSX.Element {
  const [n, setN] = useState(0)

  useEffect(() => {
    if (n >= text.length) {
      const id = setTimeout(onDone, 500)
      return () => clearTimeout(id)
    }
    const id = setTimeout(() => setN(n + 1), TYPE_MS)
    return () => clearTimeout(id)
  }, [n, text, onDone])

  return <>{text.slice(0, n)}</>
}

// Plays back the real knockouts from the battle simulation
function Clash({
  leader,
  segments,
  onDone
}: {
  leader: GymLeader
  segments: Segment[]
  onDone: () => void
}): React.JSX.Element {
  const [round, setRound] = useState(0)
  const [step, setStep] = useState(0)

  useEffect(() => {
    const id = setTimeout(() => {
      if (step < 3) setStep(step + 1)
      else if (round < segments.length - 1) {
        setRound(round + 1)
        setStep(0)
      } else onDone()
    }, STEP_MS[step])
    return () => clearTimeout(id)
  }, [step, round, segments.length, onDone])

  const seg = segments[round]
  const { me, foe } = seg
  const fainted = step === 3

  // Bars step down with each exchange and settle on the real end-of-fight values
  const foeMid = seg.loser === 'foe' ? seg.foeStart * 0.35 : (seg.foeStart + seg.foeEnd) / 2
  const meMid = seg.loser === 'me' ? seg.meStart * 0.35 : (seg.meStart + seg.meEnd) / 2
  const foeHp = step === 0 ? seg.foeStart : step < 3 ? foeMid : seg.foeEnd
  const myHp = step < 2 ? seg.meStart : step === 2 ? meMid : seg.meEnd
  const hitKey = `${round}-${step}`

  return (
    <div className={`clash${step === 1 ? ' shake-a' : ''}${step === 2 ? ' shake-b' : ''}`}>
      <GymBackdrop type={leader.type} />
      <div className="clash-dim" />

      <div className="clash-hp clash-hp-foe">
        <span>
          {foe.name} <em>Lv {foe.level}</em>
        </span>
        <div className="clash-bar">
          <div
            className={`clash-bar-fill${foeHp < 0.5 ? ' low' : ''}`}
            style={{ width: `${foeHp * 100}%` }}
          />
        </div>
      </div>
      <div className="clash-hp clash-hp-me">
        <span>
          {me.name} <em>Lv {me.level}</em>
        </span>
        <div className="clash-bar">
          <div
            className={`clash-bar-fill${myHp < 0.5 ? ' low' : ''}`}
            style={{ width: `${myHp * 100}%` }}
          />
        </div>
      </div>

      <div className="clash-platform clash-platform-me" />
      <div className="clash-platform clash-platform-foe" />

      <img
        key={`me-${round}`}
        className={`clash-mon clash-me${step === 1 ? ' lunge-right' : ''}${step === 2 ? ' recoil-left' : ''}${fainted && seg.loser === 'me' ? ' faint' : ''}`}
        src={artwork(me.dexId)}
        alt=""
      />
      <img
        key={`foe-${round}`}
        className={`clash-mon clash-foe${step === 2 ? ' lunge-left' : ''}${step === 1 ? ' recoil-right' : ''}${fainted && seg.loser === 'foe' ? ' faint' : ''}`}
        src={artwork(foe.dexId)}
        alt=""
      />

      {step === 1 && <div key={`ix-${hitKey}`} className="impact impact-foe" />}
      {step === 2 && <div key={`ix-${hitKey}`} className="impact impact-me" />}
      {(step === 1 || step === 2) && <div key={`fl-${hitKey}`} className="clash-flash" />}

      <p className="clash-round">
        Knockout {round + 1} / {segments.length}
      </p>
    </div>
  )
}

export default function GymBattle({
  leader,
  regionId,
  badgeIndex,
  trainerId,
  playerName,
  result,
  onWin,
  onLose,
  onClose
}: Props): React.JSX.Element {
  // Frozen at the start: earning the badge changes the numbers the outcome was based on
  const [{ won, segments }] = useState(() => ({ won: result.won, segments: trim(result.segments) }))
  const [phase, setPhase] = useState<Phase>('intro')
  const [spoken, setSpoken] = useState(false)
  const colours = TYPE_COLOURS[leader.type]
  const region = REGIONS[regionId]
  const badge = region.badges[badgeIndex]
  const lines = SPEECH[leader.name] ?? {
    win: 'Well fought! Keep working hard.',
    lose: 'Keep studying and come back stronger.'
  }
  const line = won ? lines.win : lines.lose
  const weak = weaknessesOf([leader.type])

  useEffect(() => {
    if (phase === 'intro') {
      const id = setTimeout(() => setPhase('clash'), INTRO_MS)
      return () => clearTimeout(id)
    }
    if (phase === 'fade') {
      const id = setTimeout(() => {
        setPhase('speech')
        if (won) onWin()
        else onLose()
      }, FADE_MS)
      return () => clearTimeout(id)
    }
    return undefined
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [phase])

  return (
    <div
      className="battle"
      style={
        {
          '--gx-main': colours.main,
          '--gx-dark': colours.dark,
          '--gx-light': colours.light
        } as React.CSSProperties
      }
    >
      {phase === 'intro' && (
        <>
          <div className="battle-half battle-left" />
          <div className="battle-half battle-right" />
          <div className="battle-stripes" />
          <img className="battle-fighter battle-player" src={trainerSprite(trainerId)} alt="" />
          <img className="battle-fighter battle-leader" src={leader.sprite} alt="" />
          <div className="battle-vs">VS</div>
          <p className="battle-name battle-name-left">{playerName}</p>
          <p className="battle-name battle-name-right">{leader.name}</p>
          <p className="battle-banner">Gym Leader {leader.name} wants to battle!</p>
        </>
      )}

      {phase === 'clash' && (
        <Clash leader={leader} segments={segments} onDone={() => setPhase('fade')} />
      )}

      {(phase === 'clash' || phase === 'intro') && (
        <button className="battle-skip" onClick={() => setPhase('fade')}>
          Skip
        </button>
      )}

      {phase === 'fade' && (
        <div className="battle-fade">
          <span className="battle-fade-text">. . .</span>
        </div>
      )}

      {phase === 'speech' && (
        <div className={`verdict ${won ? 'win' : 'lose'}`}>
          <GymBackdrop type={leader.type} />
          <div className="verdict-dim" />
          {won &&
            CONFETTI.map((c, i) => (
              <span
                key={i}
                className="confetti"
                style={{
                  left: `${c.x}%`,
                  background: c.colour,
                  animationDelay: `${c.delay}s`,
                  animationDuration: `${c.dur}s`
                }}
              />
            ))}

          <div className="verdict-body">
            {spoken && (
              <div className="verdict-head">
                <h2 className="verdict-title">{won ? 'VICTORY!' : 'DEFEATED...'}</h2>
                {won && (
                  <div className="verdict-badge">
                    <BadgeIcon sheet={region.sheet} badge={badge} />
                  </div>
                )}
              </div>
            )}

            <img className="verdict-leader" src={leader.sprite} alt={leader.name} />

            <div className="verdict-bubble">
              <span className="verdict-speaker">{leader.name}</span>
              <p>
                <Typewriter text={line} onDone={() => setSpoken(true)} />
              </p>
            </div>

            {spoken && (
              <div className="verdict-foot">
                <p className="verdict-note">
                  {won
                    ? `You earned the ${badge.name}!`
                    : `${leader.type[0].toUpperCase()}${leader.type.slice(1)} types are weak to ${weak.join(', ')}. Build a team around that, then try again in ${Math.round(COOLDOWN_MS / 3_600_000)} hours.`}
                </p>
                <button className="btn btn-primary btn-big" onClick={onClose}>
                  {won ? 'Continue' : 'Back to gym'}
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
