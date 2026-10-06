import { REGIONS } from '../game/regions'
import BadgeIcon from './badgeicon'

interface Props {
  regionId: string
  earned: number
}

export default function BadgeRail({ regionId, earned }: Props): React.JSX.Element {
  const region = REGIONS[regionId]

  return (
    <div className="badge-column">
      <span className="region-label" style={{ background: region.colour }}>
        {region.name}
      </span>

      <div className="badge-rail">
        {region.badges.map((badge, i) => {
          const isEarned = i < earned
          return (
            <div
              key={badge.name}
              className={isEarned ? 'badge-slot earned' : 'badge-slot'}
              title={isEarned ? `${badge.name} (${badge.leader})` : '???'}
            >
              <BadgeIcon sheet={region.sheet} badge={badge} />
            </div>
          )
        })}
      </div>
    </div>
  )
}
