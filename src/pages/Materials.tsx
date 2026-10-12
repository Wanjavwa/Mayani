import { conditionObservations, materials } from '@/data/catalog'
import { sourceById } from '@/data/sources'
import { usePlatform } from '@/context/PlatformState'

const kindLabel = {
  verified_site: 'Verified site information',
  literature: 'Literature-derived',
  expert_estimate: 'Expert estimate',
  demonstration: 'Demonstration data',
}

export function MaterialsPage() {
  const { siteId } = usePlatform()
  const rows = materials.filter((m) => m.siteId === siteId)
  const obs = conditionObservations.filter((o) => o.siteId === siteId)

  return (
    <div>
      <div className="label">Inventory</div>
      <h2 className="serif" style={{ marginTop: 4, fontSize: '2rem' }}>
        Materials and condition
      </h2>
      <p className="callout">
        Evidence kinds are labeled on every row. Literature properties are material-class priors, not
        laboratory results from this place.
      </p>
      <div className="card" style={{ marginTop: '1rem', overflowX: 'auto' }}>
        <table className="table">
          <thead>
            <tr>
              <th>Material</th>
              <th>Location</th>
              <th>Condition / damage</th>
              <th>Mechanisms</th>
              <th>Treatments</th>
              <th>Source</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((m) => {
              const src = sourceById(m.sourceId)
              return (
                <tr key={m.id}>
                  <td>
                    <strong>{m.name}</strong>
                    <div className="muted">
                      {m.category} · assessed {m.assessmentDate}
                    </div>
                    <div>{m.composition}</div>
                    <div className="muted">{m.physicalProperties}</div>
                    <div className="muted">{m.constructionTechnique}</div>
                  </td>
                  <td>{m.location}</td>
                  <td>
                    {m.currentCondition}
                    <div>{m.observedDamage}</div>
                    <div className="muted">Repair history: {m.repairHistory}</div>
                  </td>
                  <td>{m.deteriorationMechanisms.join('; ')}</td>
                  <td>{m.compatibleTreatments}</td>
                  <td>
                    <span className="badge">{kindLabel[m.evidenceKind]}</span>
                    <div className="muted">
                      {src.name}. Confidence: {m.confidence}
                    </div>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
      <div className="card" style={{ marginTop: '1rem' }}>
        <div className="label">Condition observations</div>
        <table className="table">
          <thead>
            <tr>
              <th>Date</th>
              <th>Location</th>
              <th>Damage</th>
              <th>Severity</th>
              <th>Notes / plate</th>
            </tr>
          </thead>
          <tbody>
            {obs.map((o) => (
              <tr key={o.id}>
                <td>{o.date}</td>
                <td>{o.location}</td>
                <td>{o.damageType}</td>
                <td>{o.severity}</td>
                <td>
                  {o.notes}
                  {o.photographRef ? <div className="muted">{o.photographRef}</div> : null}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
