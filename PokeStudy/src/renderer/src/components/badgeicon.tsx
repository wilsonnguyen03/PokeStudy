import { SHEET_WIDTH, SHEET_HEIGHT, type Badge } from '../game/regions'

interface Props {
  sheet: string
  badge: Badge
}

export default function BadgeIcon({ sheet, badge }: Props): React.JSX.Element {
  const [x, y, width, height] = badge.box

  return (
    <svg className="badge-icon" viewBox={`${x} ${y} ${width} ${height}`}>
      <image href={sheet} width={SHEET_WIDTH} height={SHEET_HEIGHT} />
    </svg>
  )
}
