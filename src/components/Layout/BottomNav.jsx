import { NavLink } from 'react-router-dom'
import { Icon } from '../ui/index.js'
import { NAV_ITEMS, BOTTOM_PATHS } from './navItems.js'
import './bottom-nav.css'

const ITEMS = NAV_ITEMS.filter((i) => BOTTOM_PATHS.includes(i.to))

export default function BottomNav() {
  return (
    <nav className="bottom-nav" aria-label="Navegación móvil">
      {ITEMS.map(({ to, label, icon, end }) => (
        <NavLink
          key={to} to={to} end={end}
          className={({ isActive }) => `bottom-nav__item${isActive ? ' bottom-nav__item--active' : ''}`}
        >
          <Icon name={icon} size={22} />
          <span>{label}</span>
        </NavLink>
      ))}
    </nav>
  )
}