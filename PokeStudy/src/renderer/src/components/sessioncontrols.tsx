import type { StudySession } from '../hooks/usestudysession'
import { formatClock, planSummary, type StudyPlan } from '../game/stamina'
import HomeMenu, { type MenuId } from './homemenu'

interface Props {
  session: StudySession
  plan: StudyPlan
  onStart: () => void
  onPause: () => void
  onResume: () => void
  onSkipBreak: () => void
  onEnd: () => void
  onOpenMenu: (id: MenuId) => void
  onOpenOptions: () => void
  onOpenInfo: () => void
}

function minutes(sec: number): number {
  return Math.max(1, Math.round(sec / 60))
}

export default function SessionControls({
  session,
  plan,
  onStart,
  onPause,
  onResume,
  onSkipBreak,
  onEnd,
  onOpenMenu,
  onOpenOptions,
  onOpenInfo
}: Props): React.JSX.Element {
  const { status, fatigue, restSec } = session
  const energy = Math.round((1 - fatigue) * 100)
  const shownSec =
    status === 'break'
      ? session.breakLeftSec
      : plan.kind !== 'stopwatch' && session.limitSec !== null
        ? session.limitSec - session.studiedSec
        : session.studiedSec

  if (status === 'idle') {
    let note: string
    if (!session.canStart) {
      note = `Your party is exhausted. Rest ${formatClock(restSec)} before studying.`
    } else if (fatigue > 0) {
      note = `Your party is still recovering: ${formatClock(restSec)} to full health.`
    } else {
      note = `${planSummary(plan)}. Your party can study about ${minutes(session.staminaSec)} min before needing a rest.`
    }

    return (
      <div className="controls">
        <div className="idle-row">
          <HomeMenu ids={['pc', 'gym']} onOpen={onOpenMenu} />
          <div className="split">
            <button className="split-main" disabled={!session.canStart} onClick={onStart}>
              Start
            </button>
            <button
              className="split-cog"
              onClick={onOpenOptions}
              title="Study options"
              aria-label="Study options"
            >
              <svg viewBox="0 0 24 24" aria-hidden="true">
                <path d="M19.14 12.94c.04-.3.06-.61.06-.94 0-.32-.02-.64-.07-.94l2.03-1.58a.49.49 0 0 0 .12-.61l-1.92-3.32a.488.488 0 0 0-.59-.22l-2.39.96c-.5-.38-1.03-.7-1.62-.94l-.36-2.54a.484.484 0 0 0-.48-.41h-3.84c-.24 0-.43.17-.47.41l-.36 2.54c-.59.24-1.13.57-1.62.94l-2.39-.96c-.22-.08-.47 0-.59.22L2.74 8.87c-.12.21-.08.47.12.61l2.03 1.58c-.05.3-.09.63-.09.94s.02.64.07.94l-2.03 1.58a.49.49 0 0 0-.12.61l1.92 3.32c.12.22.37.29.59.22l2.39-.96c.5.38 1.03.7 1.62.94l.36 2.54c.05.24.24.41.48.41h3.84c.24 0 .44-.17.47-.41l.36-2.54c.59-.24 1.13-.56 1.62-.94l2.39.96c.22.08.47 0 .59-.22l1.92-3.32c.12-.22.07-.47-.12-.61l-2.01-1.58zM12 15.6c-1.98 0-3.6-1.62-3.6-3.6s1.62-3.6 3.6-3.6 3.6 1.62 3.6 3.6-1.62 3.6-3.6 3.6z" />
              </svg>
            </button>
          </div>
          <HomeMenu ids={['stats', 'settings']} onOpen={onOpenMenu} />
        </div>
        <p className="note">
          {note}{' '}
          <button
            className="info-dot"
            onClick={onOpenInfo}
            title="How studying works"
            aria-label="How studying works"
          >
            i
          </button>
        </p>
      </div>
    )
  }

  let note: string
  if (status === 'running') {
    note = `Party energy ${energy}%. About ${minutes(session.staminaSec * (1 - fatigue))} min left before a rest.`
  } else if (status === 'break') {
    note = `Break ${session.block - 1} of ${session.blocks - 1}: your party is healing. Studying starts again in ${formatClock(session.breakLeftSec)}.`
  } else if (status === 'paused') {
    note =
      fatigue > 0
        ? `Resting. Your party is healing: full in ${formatClock(restSec)}.`
        : 'Your party is fully rested.'
  } else {
    note = `Your party is exhausted! Rest ${formatClock(restSec)} to heal before you can continue.`
  }

  return (
    <div className="controls">
      {status === 'break' && <p className="break-tag">Scheduled break</p>}
      <p className={status === 'running' ? 'clock' : 'clock paused'}>{formatClock(shownSec)}</p>
      <div className="energy" title="Party energy">
        <div className="energy-fill" style={{ width: `${energy}%` }} />
      </div>
      <p className="note">{note}</p>
      <div className="controls-row">
        {status === 'running' && (
          <button className="btn btn-secondary" onClick={onPause}>
            Break
          </button>
        )}
        {status === 'break' && (
          <button className="btn btn-secondary" onClick={onSkipBreak}>
            Skip break
          </button>
        )}
        {status === 'paused' && (
          <button className="btn btn-secondary" onClick={onResume}>
            Resume
          </button>
        )}
        {status === 'exhausted' && (
          <button className="btn btn-secondary" disabled>
            Resting
          </button>
        )}
        <button className="btn btn-primary" onClick={onEnd}>
          End
        </button>
      </div>
    </div>
  )
}
