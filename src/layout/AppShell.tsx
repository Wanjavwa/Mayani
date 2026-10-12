import { NavLink, Outlet } from 'react-router-dom'
import { sites } from '@/data/catalog'
import { usePlatform } from '@/context/PlatformState'

const links = [
  { to: '/', label: 'Overview' },
  { to: '/twin', label: 'Digital Twin' },
  { to: '/materials', label: 'Materials & Condition' },
  { to: '/risks', label: 'Environmental Risks' },
  { to: '/simulator', label: 'Degradation Simulator' },
  { to: '/plan', label: 'Preservation Plan' },
  { to: '/monitoring', label: 'Monitoring & Reports' },
]

export function AppShell() {
  const { siteId, setSiteId } = usePlatform()

  return (
    <div className="app-shell">
      <aside className="sidebar">
        <div>
          <p className="script brand-script">Heritage</p>
          <p className="brand-sub">Preservation intelligence</p>
        </div>
        <hr className="rule" />
        <nav className="nav">
          {links.map((l) => (
            <NavLink key={l.to} to={l.to} end={l.to === '/'}>
              {l.label}
            </NavLink>
          ))}
        </nav>
        <p className="sidebar-note">
          Archival research interface. Demonstration forecasts are simulated and not scientifically
          validated.
        </p>
      </aside>
      <main className="main">
        <div className="page-head">
          <div>
            <div className="label">Selected site record</div>
            <h1 className="serif">Field archive</h1>
          </div>
          <label>
            <span className="label">Site selector</span>
            <br />
            <select className="site-select" value={siteId} onChange={(e) => setSiteId(e.target.value)}>
              {sites.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.name} — {s.country}
                </option>
              ))}
            </select>
          </label>
        </div>
        <Outlet />
      </main>
    </div>
  )
}
