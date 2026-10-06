import { useEffect, useState } from 'react'
import { speciesOf } from '../game/battle'
import { speciesName } from '../game/catching'
import { displayName, type PartyMember } from '../mock'
import { artwork } from '../sprites'
import { ConfirmDialog } from './studydialogs'

interface Props {
  member: PartyMember
  toDex: number
  onFinish: (evolved: boolean) => void
}

type Phase = 'intro' | 'morph' | 'flash' | 'done' | 'stopped'

const INTRO_MS = 2400
const FLASH_MS = 1000
const FRAMES = 34 // silhouette swaps; they get faster until the flash
const FIRST_DELAY = 460
const MIN_DELAY = 70

// Same idea as the games: the silhouette flickers between the old and new shapes, faster and faster
export default function EvolutionScreen({ member, toDex, onFinish }: Props): React.JSX.Element {
  const [phase, setPhase] = useState<Phase>('intro')
  const [frame, setFrame] = useState(0)
  const [asking, setAsking] = useState(false) // the "stop evolving?" question pauses everything

  const oldName = displayName(member)
  const newName = speciesName(toDex)
  const types = speciesOf(toDex).types

  useEffect(() => {
    if (asking) return undefined

    if (phase === 'intro') {
      const id = setTimeout(() => setPhase('morph'), INTRO_MS)
      return () => clearTimeout(id)
    }
    if (phase === 'morph') {
      const delay = Math.max(MIN_DELAY, FIRST_DELAY * 0.88 ** frame)
      const id = setTimeout(
        () => (frame >= FRAMES ? setPhase('flash') : setFrame(frame + 1)),
        delay
      )
      return () => clearTimeout(id)
    }
    if (phase === 'flash') {
      const id = setTimeout(() => setPhase('done'), FLASH_MS)
      return () => clearTimeout(id)
    }
    return undefined
  }, [phase, frame, asking])

  // B or Escape asks to stop, like pressing B in the games
  useEffect(() => {
    function onKey(e: KeyboardEvent): void {
      if (
        (e.key === 'Escape' || e.key.toLowerCase() === 'b') &&
        (phase === 'intro' || phase === 'morph')
      )
        setAsking(true)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [phase])

  const animating = phase === 'intro' || phase === 'morph'
  const showNew = phase === 'morph' && frame % 2 === 1
  const speed = phase === 'morph' ? Math.min(1, frame / FRAMES) : 0

  return (
    <div className="evo" style={{ '--speed': speed } as React.CSSProperties}>
      <div className="evo-bg" />
      {animating && <div className="evo-rays" style={{ opacity: 0.2 + speed * 0.7 }} />}

      {animating && (
        <button className="battle-skip" onClick={() => setAsking(true)}>
          Stop evolving (B)
        </button>
      )}

      <div className="evo-stage">
        {animating && (
          <img
            className={`evo-sprite${phase === 'morph' ? ' morphing' : ''}`}
            src={artwork(showNew ? toDex : member.dexId)}
            alt=""
          />
        )}
        {phase === 'flash' && <div className="evo-whiteout" />}
        {(phase === 'done' || phase === 'stopped') && (
          <>
            {phase === 'done' && (
              <div className="burst evo-burst" aria-hidden="true">
                {Array.from({ length: 18 }, (_, i) => i * 20).map((a) => (
                  <span key={a} style={{ '--a': `${a}deg` } as React.CSSProperties} />
                ))}
              </div>
            )}
            <img
              className="evo-final"
              src={artwork(phase === 'done' ? toDex : member.dexId)}
              alt={phase === 'done' ? newName : oldName}
            />
          </>
        )}
      </div>

      {phase === 'done' && (
        <div className="evo-types">
          {types.map((t) => (
            <span key={t} className={`type type-${t}`}>
              {t}
            </span>
          ))}
        </div>
      )}

      <div className="evo-text">
        {phase === 'intro' && (
          <p>
            What? <strong>{oldName}</strong> is evolving!
          </p>
        )}
        {phase === 'morph' && (
          <p>
            What? <strong>{oldName}</strong> is evolving!
          </p>
        )}
        {phase === 'flash' && <p>&nbsp;</p>}
        {phase === 'done' && (
          <>
            <p>
              Congratulations! Your <strong>{oldName}</strong> evolved into{' '}
              <strong>{newName}</strong>!
            </p>
            <button className="btn btn-primary" onClick={() => onFinish(true)}>
              Continue
            </button>
          </>
        )}
        {phase === 'stopped' && (
          <>
            <p>
              Huh? <strong>{oldName}</strong> stopped evolving! You can evolve it any time from your
              party or the PC.
            </p>
            <button className="btn btn-primary" onClick={() => onFinish(false)}>
              Continue
            </button>
          </>
        )}
      </div>

      {asking && (
        <ConfirmDialog
          title="Stop evolving?"
          confirmLabel="Yes, stop evolving"
          cancelLabel="No, keep evolving"
          onConfirm={() => {
            setAsking(false)
            setPhase('stopped')
          }}
          onCancel={() => setAsking(false)}
        >
          <p>
            Do you want <strong>{oldName}</strong> to stop evolving? It will stay as it is, and you
            can evolve it later from your party or the PC.
          </p>
        </ConfirmDialog>
      )}
    </div>
  )
}
