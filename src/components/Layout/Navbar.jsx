import { Link, NavLink } from 'react-router-dom'
import { Icon } from '../ui/index.js'
import { NAV_ITEMS } from './navItems.js'
import './navbar.css'

export default function Navbar() {
  return (
    <header className="navbar">
      <div className="navbar__inner container">
        <Link to="/" className="navbar__brand" aria-label="DEFIDER USM, ir al inicio">
          <span className="navbar__logo" aria-hidden="true">DU</span>
          <span className="navbar__brand-text">
            <strong>DEFIDER USM</strong>
            <small>Deportes y Recreación · Casa Central</small>
          </span>
        </Link>

        <nav className="navbar__nav" aria-label="Principal">
          {NAV_ITEMS.map(({ to, label, icon, end }) => (
            <NavLink
              key={to} to={to} end={end}
              className={({ isActive }) => `navbar__link${isActive ? ' navbar__link--active' : ''}`}
            >
              <Icon name={icon} size={16} />
              {label}
            </NavLink>
          ))}
        </nav>

        {/* Solo visible en móvil */}
        <Link to="/perfil" className="navbar__profile" aria-label="Perfil">
          <Icon name="user" size={20} />
        </Link>
      </div>
    </header>
  )
}