import './css/nav-bar.css'
import banana from '../images/banana-logo.png'
import { Link, NavLink } from 'react-router'

const navClassName = ({ isActive }) =>
  isActive ? 'nav-link nav-link-active' : 'nav-link'

const NavBar = () => {
  return (
    <nav className="app-nav">
      <Link className="brand-link" to="/">
        <img src={banana} className="logo" alt="Banana Tracker logo" />
        <span>Banana Tracker</span>
      </Link>
      <div className="nav-links">
        <NavLink className={navClassName} to="/analytics">
          Analytics
        </NavLink>
        <NavLink className={navClassName} to="/buy">
          Buy
        </NavLink>
        <NavLink className={navClassName} to="/sell">
          Sell
        </NavLink>
      </div>
    </nav>
  )
}

export default NavBar
