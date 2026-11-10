import { NavLink, Outlet } from 'react-router-dom'
import { useAuth } from '../context/useAuth.js'

const links = [
  { to: '/plans', label: 'Workout builder', roles: ['coach'] },
  { to: '/schedule', label: 'Schedule', roles: ['coach', 'athlete'] },
  { to: '/prs', label: 'PR tracker', roles: ['coach', 'athlete'] },
  { to: '/store', label: 'Store', roles: ['coach', 'athlete'] },
]

export default function Layout() {
  const { user, role, logout } = useAuth()

  return (
    <div className="app-shell">
      <header className="topbar">
        <NavLink to="/" className="brand">
          Ironworks <span>S&amp;C</span>
        </NavLink>
        <nav>
          {links
            .filter((link) => !role || link.roles.includes(role))
            .map((link) => (
              <NavLink key={link.to} to={link.to}>
                {link.label}
              </NavLink>
            ))}
        </nav>
        <div className="session">
          {user ? (
            <>
              <span>
                {user.name} · {role}
              </span>
              <button type="button" onClick={logout}>
                Sign out
              </button>
            </>
          ) : (
            <NavLink to="/login" className="button-link">
              Sign in
            </NavLink>
          )}
        </div>
      </header>
      <main>
        <Outlet />
      </main>
    </div>
  )
}
