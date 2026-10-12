import { Link } from 'react-router-dom'
import { SiteScene, TwinToolbar } from '@/components/twin/SiteScene'
import { useSiteBundle } from '@/context/PlatformState'
import { conditionLabel } from '@/engine/deterioration'

export function OverviewPage() {
  const { site, meanCurrent, meanDegraded } = useSiteBundle()

  return (
    <div>
      <div className="card hero">
        <SiteScene />
        <div className="hero-copy">
          <span className="badge warn">Demonstration reconstruction</span>
          <span className="script">{site.name}</span>
          <h2>{site.country}</h2>
          <p style={{ margin: 0 }}>{site.historicalContext}</p>
        </div>
      </div>
      <div style={{ marginTop: '0.7rem' }}>
        <TwinToolbar />
      </div>
      <p className="callout" style={{ marginTop: '0.9rem' }}>
        {site.demonstrationDisclaimer}
      </p>
      <div className="grid-4" style={{ marginTop: '1rem' }}>
        <div className="card stat">
          <span className="label">Condition index</span>
          <strong>{meanCurrent}</strong>
          <span className="muted">{conditionLabel(meanCurrent)} · observed inventory</span>
        </div>
        <div className="card stat">
          <span className="label">Simulated 10y, no intervention</span>
          <strong>{meanDegraded}</strong>
          <span className="muted">Demonstration forecast · not validated</span>
        </div>
        <div className="card stat">
          <span className="label">Data completeness</span>
          <strong>{site.dataCompletenessPct}%</strong>
          <span className="muted">{site.confidenceLabel}</span>
        </div>
        <div className="card stat">
          <span className="label">Last assessment</span>
          <strong>{site.lastAssessmentDate}</strong>
          <span className="muted">{site.siteType}</span>
        </div>
      </div>
      <div className="grid-2" style={{ marginTop: '1rem' }}>
        <div className="card">
          <div className="label">Site description</div>
          <h3 className="serif" style={{ margin: '0.2rem 0 0.5rem' }}>
            Opening leaf of the field journal
          </h3>
          <p>{site.description}</p>
          <p>
            <strong>Materials.</strong> {site.constructionMaterialsSummary}
          </p>
          <p>
            <strong>Geography.</strong> {site.geographicLocation} {site.surroundingTerrain}
          </p>
          <p>
            <strong>Condition.</strong> {site.conditionSummary}
          </p>
        </div>
        <div className="card">
          <div className="label">Preservation concerns</div>
          <h3 className="serif" style={{ margin: '0.2rem 0 0.5rem' }}>
            Main labeled risks
          </h3>
          <ul>
            {site.mainRisks.map((r) => (
              <li key={r}>{r}</li>
            ))}
          </ul>
          <div className="label">Priority actions (unreviewed)</div>
          <ul>
            {site.priorityActions.map((a) => (
              <li key={a}>{a}</li>
            ))}
          </ul>
          <Link to="/plan">Open preservation plan →</Link>
        </div>
      </div>
    </div>
  )
}
