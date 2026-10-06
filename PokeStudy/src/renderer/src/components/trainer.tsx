import { useState } from 'react'
import { trainerSprite } from '../sprites'

interface Props {
  playerName: string
  trainerId: string
  onClick?: () => void
}

export default function Trainer({ playerName, trainerId, onClick }: Props): React.JSX.Element {
  const [failedId, setFailedId] = useState<string | null>(null)
  const failed = failedId === trainerId

  return (
    <div className="trainer">
      <span className="trainer-name">{playerName}</span>

      <div className="trainer-stage" onClick={onClick}>
        <div className="platform" />
        {failed ? (
          <div className="trainer-fallback">?</div>
        ) : (
          <img
            className="trainer-sprite"
            src={trainerSprite(trainerId)}
            alt={playerName}
            onError={() => setFailedId(trainerId)}
          />
        )}
      </div>
    </div>
  )
}
