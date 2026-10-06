import { useState } from 'react'
import { BACKGROUND_IDS, SCENE_THEMES, swatch } from '../game/backgrounds'
import { BADGES_TO_FINISH, regionUnlocked } from '../game/progress'
import { REGIONS } from '../game/regions'
import { TRAINERS } from '../game/trainers'
import type { Settings } from '../hooks/usesettings'
import { trainerSprite } from '../sprites'
import MeadowScene from './meadowscene'
import { ConfirmDialog } from './studydialogs'

interface Props {
  settings: Settings
  onChange: (patch: Partial<Settings>) => void
  onReset: () => void
  onResetAll: () => void
  onClose: () => void
}

const MAX_NAME = 12
const GOALS = [30, 60, 90, 120, 180, 240]

export default function SettingsScreen({
  settings,
  onChange,
  onReset,
  onResetAll,
  onClose
}: Props): React.JSX.Element {
  const shownName = settings.name.trim() || 'Trainer'
  const [confirming, setConfirming] = useState(false)

  return (
    <div className="settings">
      <header className="pc-header">
        <button className="btn btn-secondary" onClick={onClose}>
          Back
        </button>
        <h1 className="pc-title">Settings</h1>
      </header>

      <div className="settings-body">
        <div className="set-preview">
          <MeadowScene background={settings.background} />
          <span className="trainer-name">{shownName}</span>
          <div className="set-preview-shadow" />
          <img className="set-preview-sprite" src={trainerSprite(settings.trainerId)} alt="" />
        </div>

        <div className="set-form">
          <section className="set-section">
            <h2>Trainer name</h2>
            <input
              className="set-input"
              value={settings.name}
              maxLength={MAX_NAME}
              placeholder="Trainer"
              onChange={(e) => onChange({ name: e.target.value })}
            />
          </section>

          <section className="set-section">
            <h2>Character</h2>
            <div className="set-characters">
              {TRAINERS.map((t) => (
                <button
                  key={t.id}
                  className={`set-char${t.id === settings.trainerId ? ' selected' : ''}`}
                  title={`${t.name} (${t.game})`}
                  onClick={() => onChange({ trainerId: t.id })}
                >
                  <img src={trainerSprite(t.id)} alt={t.name} />
                  <span>{t.name}</span>
                </button>
              ))}
            </div>
          </section>

          <section className="set-section">
            <h2>Background</h2>
            <div className="set-backgrounds">
              {BACKGROUND_IDS.map((id) => (
                <button
                  key={id}
                  className={`set-bg${id === settings.background ? ' selected' : ''}`}
                  onClick={() => onChange({ background: id })}
                >
                  <span className="set-bg-swatch" style={{ background: swatch(id) }} />
                  <span>{SCENE_THEMES[id].label}</span>
                </button>
              ))}
            </div>
          </section>

          <div className="set-row">
            <section className="set-section">
              <h2>Home region</h2>
              <select
                className="set-input"
                value={settings.regionId}
                onChange={(e) => onChange({ regionId: e.target.value })}
              >
                {Object.entries(REGIONS).map(([id, r]) => {
                  const open = regionUnlocked(settings, id)
                  return (
                    <option key={id} value={id} disabled={!open}>
                      {open ? r.name : `${r.name} (locked)`}
                    </option>
                  )
                })}
              </select>
              <p className="set-note">
                {settings.startRegion
                  ? `Earn all ${BADGES_TO_FINISH} ${REGIONS[settings.startRegion].name} badges (${settings.badges[settings.startRegion] ?? 0}/${BADGES_TO_FINISH}) to unlock the other regions.`
                  : ''}
              </p>
            </section>

            <section className="set-section">
              <h2>Daily study goal</h2>
              <select
                className="set-input"
                value={settings.dailyGoalMin}
                onChange={(e) => onChange({ dailyGoalMin: Number(e.target.value) })}
              >
                {GOALS.map((m) => (
                  <option key={m} value={m}>
                    {m >= 60 ? `${m / 60} hr${m > 60 ? 's' : ''}` : `${m} min`}
                  </option>
                ))}
              </select>
              <p className="set-note">Saved now; used once progress tracking is added.</p>
            </section>
          </div>

          <div className="set-buttons">
            <button className="btn btn-secondary set-reset" onClick={onReset}>
              Reset background
            </button>
            <button className="btn btn-danger" onClick={() => setConfirming(true)}>
              Reset everything
            </button>
          </div>
        </div>
      </div>

      {confirming && (
        <ConfirmDialog
          title="Reset everything?"
          confirmLabel="Yes, reset everything"
          onConfirm={onResetAll}
          onCancel={() => setConfirming(false)}
        >
          <p>
            You will lose <strong>everything</strong>: your trainer, badges, study history,
            favourites and every Pokémon you&apos;ve caught. The app goes back to the setup screen.
            This can&apos;t be undone.
          </p>
        </ConfirmDialog>
      )}
    </div>
  )
}
