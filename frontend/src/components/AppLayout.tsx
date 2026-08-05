import { NavLink, Outlet } from 'react-router-dom'

const links = [
  { to: '/', label: 'Today', end: true },
  { to: '/planning', label: 'Planning' },
  { to: '/tasks', label: 'Tasks' },
  { to: '/focus', label: 'Focus' },
]

export function AppLayout() {
  return (
    <div className="app-shell">
      <aside className="sidebar">
        <div>
          <p className="eyebrow">Task Goblin</p>
          <h1>Local-first productivity</h1>
          <p className="muted">Capture tasks quickly, plan your day, and focus on what matters next.</p>
        </div>
        <nav>
          {links.map((link) => (
            <NavLink key={link.to} to={link.to} end={link.end} className={({ isActive }) => (isActive ? 'nav-link active' : 'nav-link')}>
              {link.label}
            </NavLink>
          ))}
        </nav>
      </aside>
      <main className="content">
        <Outlet />
      </main>
    </div>
  )
}
