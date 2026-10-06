import {
  CUSTOM_LIMITS,
  HEAL_TABLE,
  PLAN_OPTIONS,
  buildPlan,
  formatPlan,
  planSummary,
  staminaSeconds
} from '../game/stamina'
import type { Settings } from '../hooks/usesettings'

interface ShellProps {
  title: string
  onClose: () => void
  children: React.ReactNode
}

function Dialog({ title, onClose, children }: ShellProps): React.JSX.Element {
  return (
    <div className="dialog-backdrop" onClick={onClose}>
      <div className="dialog" onClick={(e) => e.stopPropagation()}>
        <h2 className="dialog-title">{title}</h2>
        {children}
        <button className="btn btn-primary dialog-close" onClick={onClose}>
          Done
        </button>
      </div>
    </div>
  )
}

interface OptionsProps {
  settings: Settings
  onChange: (patch: Partial<Settings>) => void
  onClose: () => void
}

function NumberField({
  label,
  value,
  range,
  suffix,
  onChange
}: {
  label: string
  value: number
  range: readonly [number, number]
  suffix: string
  onChange: (n: number) => void
}): React.JSX.Element {
  return (
    <label className="num-field">
      <span>{label}</span>
      <span className="num-input">
        <input
          type="number"
          min={range[0]}
          max={range[1]}
          value={value}
          onChange={(e) => {
            const n = Math.round(Number(e.target.value))
            if (Number.isFinite(n)) onChange(Math.min(range[1], Math.max(range[0], n)))
          }}
        />
        {suffix}
      </span>
    </label>
  )
}

export function StudyOptions({ settings, onChange, onClose }: OptionsProps): React.JSX.Element {
  const mode = settings.studyMode
  const custom = mode === 'timer' && settings.customTimer
  const plan = buildPlan(settings)
  const lasts = Math.round(staminaSeconds(plan) / 60)
  const maxBreaks = Math.max(0, Math.floor(settings.customStudyMin / 10) - 1)

  return (
    <Dialog title="Study options" onClose={onClose}>
      <div className="seg">
        {(['stopwatch', 'timer'] as const).map((m) => (
          <button
            key={m}
            className={`seg-btn${mode === m ? ' active' : ''}`}
            onClick={() => onChange({ studyMode: m })}
          >
            {m === 'stopwatch' ? 'Stopwatch' : 'Timer'}
          </button>
        ))}
      </div>

      {mode === 'timer' && (
        <>
          <h3 className="dialog-sub">Timer length</h3>
          <div className="chips">
            {PLAN_OPTIONS.map((m) => (
              <button
                key={m}
                className={`chip${!custom && settings.planMin === m ? ' active' : ''}`}
                onClick={() => onChange({ planMin: m, customTimer: false })}
              >
                {formatPlan(m)}
              </button>
            ))}
            <button
              className={`chip${custom ? ' active' : ''}`}
              onClick={() => onChange({ customTimer: true })}
            >
              Custom
            </button>
          </div>
        </>
      )}

      {custom && (
        <div className="custom-box">
          <NumberField
            label="Study time"
            value={settings.customStudyMin}
            range={CUSTOM_LIMITS.study}
            suffix="min"
            onChange={(n) => onChange({ customStudyMin: n })}
          />
          <NumberField
            label="Break length"
            value={settings.customBreakMin}
            range={CUSTOM_LIMITS.breakLen}
            suffix="min"
            onChange={(n) => onChange({ customBreakMin: n })}
          />
          <NumberField
            label="Number of breaks"
            value={Math.min(settings.customBreaks, maxBreaks)}
            range={[0, Math.min(CUSTOM_LIMITS.breaks[1], maxBreaks)]}
            suffix=""
            onChange={(n) => onChange({ customBreaks: n })}
          />
        </div>
      )}

      <p className="dialog-text">
        {mode === 'stopwatch' && 'The stopwatch runs until you end it. '}
        {mode === 'timer' && !custom && 'The session ends by itself when the timer runs out. '}
        {custom &&
          `${planSummary(plan)}. Your study time is split evenly around the breaks, and each break starts by itself. `}
        Your party can study about <strong>{lasts} min</strong> before every Pokémon is worn out and
        needs a rest
        {custom && settings.customStudyMin >= 240
          ? ' (2 hours on custom plans of 4 hours or more)'
          : ''}
        . Each hour of studying earns at most 3 levels per Pokémon and about 3 catches.
      </p>
    </Dialog>
  )
}
export function StudyInfo({ onClose }: { onClose: () => void }): React.JSX.Element {
  return (
    <Dialog title="How studying works" onClose={onClose}>
      <ul className="dialog-list">
        <li>
          <strong>Studying tires your party.</strong> Their HP drains while the clock runs and
          everyone is worn out after an hour (two hours on custom plans of 4+ hours). Some Pokémon
          tire faster than others, and it changes every session. Each hour earns at most 3 levels
          per Pokémon and about 3 catches.
        </li>
        <li>
          <strong>Breaks heal them.</strong> Press Break any time to start healing. The longer you
          studied, the longer a full heal takes:
        </li>
      </ul>
      <table className="dialog-table">
        <tbody>
          {HEAL_TABLE.map((row) => (
            <tr key={row.study}>
              <td>Studied {row.study}</td>
              <td>{row.rest} rest</td>
            </tr>
          ))}
        </tbody>
      </table>
      <ul className="dialog-list">
        <li>
          <strong>At zero HP</strong> your Pokémon are exhausted and you must rest until they are
          healed. Fainted Pokémon can&apos;t catch new Pokémon or gain levels.
        </li>
        <li>
          <strong>Healing keeps going</strong> after you end a session, so a rest away from the app
          counts too.
        </li>
      </ul>
    </Dialog>
  )
}

interface ConfirmProps {
  title: string
  children: React.ReactNode
  confirmLabel: string
  cancelLabel?: string
  onConfirm: () => void
  onCancel: () => void
}

export function ConfirmDialog({
  title,
  children,
  confirmLabel,
  cancelLabel = 'Cancel',
  onConfirm,
  onCancel
}: ConfirmProps): React.JSX.Element {
  return (
    <div className="dialog-backdrop" onClick={onCancel}>
      <div className="dialog" onClick={(e) => e.stopPropagation()}>
        <h2 className="dialog-title">{title}</h2>
        <div className="dialog-text">{children}</div>
        <div className="dialog-actions">
          <button className="btn btn-secondary" onClick={onCancel}>
            {cancelLabel}
          </button>
          <button className="btn btn-danger" onClick={onConfirm}>
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  )
}
