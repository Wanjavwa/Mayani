import { interventions, structures } from '@/data/catalog'
import { usePlatform, useSiteBundle } from '@/context/PlatformState'

const urgencyRank = { immediate: 4, near_term: 3, scheduled: 2, watch: 1 }
const feasibilityRank = { high: 3, moderate: 2, constrained: 1 }

export function PreservationPlanPage() {
  const { siteId } = usePlatform()
  const { meanCurrent, meanDegraded, meanConserved, site } = useSiteBundle()
  const rows = [...interventions]
    .filter((i) => i.siteId === siteId)
    .sort((a, b) => b.rankScore - a.rankScore)

  return (
    <div>
      <div className="label">Conservation desk</div>
      <h2 className="serif" style={{ marginTop: 4, fontSize: '2rem' }}>
        Preservation plan
      </h2>
      <p className="callout">
        Ranking is transparent and unreviewed: score = 12×urgency + 8×feasibility + listed
        evidence weight. No action is professionally approved. Expert review is required on every
        row.
      </p>
      <div className="grid-3" style={{ margin: '1rem 0' }}>
        <div className="card stat">
          <span className="label">Baseline index</span>
          <strong>{meanCurrent}</strong>
        </div>
        <div className="card stat">
          <span className="label">Simulated, no intervention</span>
          <strong>{meanDegraded}</strong>
        </div>
        <div className="card stat">
          <span className="label">Simulated, conservation modifier</span>
          <strong>{meanConserved}</strong>
        </div>
      </div>
      <p className="muted">
        Rank formula uses urgency {JSON.stringify(urgencyRank)} and feasibility {JSON.stringify(feasibilityRank)}.
        Cost ranges are demonstration bands only for {site.name}.
      </p>
      {rows.map((row, idx) => {
        const structure = structures.find((s) => s.id === row.structureId)
        return (
          <article className="card" key={row.id} style={{ marginTop: '0.8rem' }}>
            <div className="label">
              Priority {idx + 1} · score {row.rankScore} · {row.urgency.replace('_', ' ')}
            </div>
            <h3 className="serif" style={{ margin: '0.2rem 0' }}>
              {row.title}
            </h3>
            <p>{row.description}</p>
            <div className="grid-3">
              <div>
                <div className="label">Affected</div>
                {structure?.name ?? 'Site-wide'}
              </div>
              <div>
                <div className="label">Risk addressed</div>
                {row.riskAddressed}
              </div>
              <div>
                <div className="label">Cost range</div>
                {row.costRange}
              </div>
              <div>
                <div className="label">Expected benefit</div>
                {row.expectedBenefit}
              </div>
              <div>
                <div className="label">Feasibility</div>
                {row.feasibility}
              </div>
              <div>
                <div className="label">Expert review</div>
                Required
              </div>
            </div>
            <p>
              <strong>Evidence.</strong> {row.evidence}
            </p>
            <p className="muted">
              Confidence: {row.confidence}. Limitations: {row.limitations}
            </p>
          </article>
        )
      })}
    </div>
  )
}
