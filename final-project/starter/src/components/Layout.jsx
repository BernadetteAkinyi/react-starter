import { NavLink, Outlet } from 'react-router-dom'

const linkClass = ({ isActive }) =>
  isActive ? 'nav-link nav-link-active' : 'nav-link'

export default function Layout() {
  return (
    <div className="app">
      <a className="skip-link" href="#main">
        Skip to content
      </a>

      <header className="header">
        <NavLink to="/" className="brand">
          <span className="brand-mark" aria-hidden="true">
            SS
          </span>
          StudySync
        </NavLink>

        <nav className="nav" aria-label="Main navigation">
          <NavLink to="/" end className={linkClass}>
            Dashboard
          </NavLink>
          <NavLink to="/sessions" className={linkClass}>
            Sessions
          </NavLink>
          <NavLink to="/subjects" className={linkClass}>
            Subjects
          </NavLink>
        </nav>
      </header>

      <main className="main" id="main" tabIndex={-1}>
        <Outlet />
      </main>

      <footer className="footer">
        <p>StudySync · capstone starter</p>
        <p>Replace this footer with your own.</p>
      </footer>
    </div>
  )
}
