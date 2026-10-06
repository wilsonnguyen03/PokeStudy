import { useState } from 'react'
import BadgeRail from './badgerail'

interface Props {
  regionId: string
  earned: number
}

export default function BadgeDrawer({ regionId, earned }: Props): React.JSX.Element {
  const [open, setOpen] = useState(false)

  return (
    <>
      <button className={open ? 'drawer-tab hidden' : 'drawer-tab'} onClick={() => setOpen(true)}>
        Badges
      </button>

      <div
        className={open ? 'drawer-panel open' : 'drawer-panel'}
        onClick={() => setOpen(false)}
        title="Click to close"
      >
        <BadgeRail regionId={regionId} earned={earned} />
      </div>
    </>
  )
}
