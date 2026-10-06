import pcIcon from '../assets/icons/pc.png'
import gymIcon from '../assets/icons/potion.png'
import statsIcon from '../assets/icons/journal.png'
import settingsIcon from '../assets/icons/explorer-kit.png'

export type MenuId = 'pc' | 'gym' | 'stats' | 'settings'

const MENU_ITEMS: { id: MenuId; label: string; icon?: string; image?: string }[] = [
  { id: 'pc', label: 'PC', image: pcIcon },
  { id: 'gym', label: 'Gym', image: gymIcon },
  { id: 'stats', label: 'Stats', image: statsIcon },
  { id: 'settings', label: 'Settings', image: settingsIcon }
]

interface Props {
  onOpen: (id: MenuId) => void
  ids: MenuId[] // which buttons this group shows
}

export default function HomeMenu({ onOpen, ids }: Props): React.JSX.Element {
  return (
    <div className="home-menu">
      {MENU_ITEMS.filter((item) => ids.includes(item.id)).map((item) => (
        <button key={item.id} className="menu-btn" onClick={() => onOpen(item.id)}>
          <span className="menu-icon">
            {item.image ? (
              <img
                className={item.id === 'pc' ? 'menu-img' : 'menu-img square'}
                src={item.image}
                alt=""
              />
            ) : (
              item.icon
            )}
          </span>
          <span>{item.label}</span>
        </button>
      ))}
    </div>
  )
}
