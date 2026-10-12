import { TwinToolbar } from '@/components/twin/SiteScene'
import { HeritageViewer } from '@/components/twin/HeritageViewer'
import { interventions, materials, conditionObservations } from '@/data/catalog'
import { heritageAsset } from '@/data/heritageAssets'
import { sourceById } from '@/data/sources'
import { usePlatform, useSiteBundle } from '@/context/PlatformState'
import { conditionLabel } from '@/engine/deterioration'

export function DigitalTwinPage() {
  const { selectedStructureId, scenario, viewMode } = usePlatform()
  const { site, structures, degraded, conserved } = useSiteBundle()
  const selected = structures.find((s) => s.id === selectedStructureId)
  const deg = degraded.find((f) => f.structureId === selected?.id)
  const cons = conserved.find((f) => f.structureId === selected?.id)
  const mats = materials.filter((m) => selected?.materialIds.includes(m.id))
  const obs = conditionObservations.filter((o) => o.structureId === selected?.id)
  const relevantInterventions = interventions.filter(
    (i) => i.siteId === site.id && (!i.structureId || i.structureId === selected?.id),
  )
  const leadingDrivers = [...(deg?.drivers ?? [])]
    .filter((d) => d.contribution > 0)
    .sort((a, b) => b.contribution - a.contribution)
    .slice(0, 3)

  return (
    <div>
      <div className="label">Live heritage asset</div>
      <h2 className="serif" style={{ margin: '0.15rem 0 0.7rem', fontSize: '2rem' }}>
        Interactive digital twin
      </h2>
      <p className="callout">
        This view uses the current Beta Giorgis / Lalibela model as the primary heritage object. The
        degradation and conservation states are illustrative overlays on top of the live model, not a
        separate synthetic scene.
      </p>
      <div style={{ margin: '0.8rem 0' }}>
        <TwinToolbar />
      </div>

      <HeritageViewer asset={heritageAsset} />

      <div className="card" style={{ marginTop: '1rem' }}>
        {!selected && (
          <p className="muted">Select a structure in the twin to inspect materials, damage, and forecasts.</p>
        )}
        {selected && (
          <>
            <span className="badge">Selected structure</span>
            <h3 className="serif" style={{ fontSize: '1.8rem', margin: '0.35rem 0' }}>
              {selected.name}
            </h3>
            <p>{selected.description}</p>
            <p>
              <strong>Observed damage.</strong> {selected.observedDamage}
            </p>
            <p>
              <strong>Current index.</strong> {selected.baselineCondition} ({conditionLabel(selected.baselineCondition)})
            </p>
            {deg && (
              <p>
                <strong>Simulated {scenario.horizonYears}y, no intervention.</strong> {deg.projectedCondition}{' '}
                ({deg.conditionDelta}). Model {deg.modelId}. {deg.uncertainty.split('.')[0]}.
              </p>
            )}
            {cons && (
              <p>
                <strong>Simulated with conservation modifier.</strong> {cons.projectedCondition} (
                {cons.conditionDelta}).
              </p>
            )}
            {selected && viewMode === 'degradation' && (
              <div style={{ marginTop: '0.9rem' }}>
                <div className="label">Likely reasons for degradation</div>
                <ul>
                  {leadingDrivers.length > 0 ? (
                    leadingDrivers.map((driver) => (
                      <li key={driver.mechanism}>
                        <strong>{driver.mechanism}.</strong>{' '}
                        {driver.status === 'insufficient_evidence'
                          ? 'Evidence is insufficient for this mechanism in the current model.'
                          : `Model contribution ${driver.contribution.toFixed(2)} indicates this is a likely pressure pathway.`}
                      </li>
                    ))
                  ) : (
                    <li>No dominant driver is resolved in the current scenario.</li>
                  )}
                </ul>
                <p className="muted">
                  This summary is illustrative: it reflects the selected climate scenario, material
                  vulnerabilities, and the modelled exposure pattern rather than a verified field diagnosis.
                </p>
              </div>
            )}
            {selected && viewMode === 'intervention' && (
              <div style={{ marginTop: '0.9rem' }}>
                <div className="label">Conservation summary</div>
                <ul>
                  {relevantInterventions.length > 0 ? (
                    relevantInterventions.slice(0, 3).map((intervention) => (
                      <li key={intervention.id}>
                        <strong>{intervention.title}.</strong> {intervention.description}
                      </li>
                    ))
                  ) : (
                    <li>No structure-level intervention is currently attached; a broader site review would be needed.</li>
                  )}
                </ul>
                <p className="muted">
                  These are simulated mitigation actions for the current overlay, not approved treatment
                  prescriptions.
                </p>
              </div>
            )}
            <div className="label">Materials</div>
            <ul>
              {mats.map((m) => (
                <li key={m.id}>
                  {m.name} — {m.currentCondition} ({sourceById(m.sourceId).kind})
                </li>
              ))}
            </ul>
            <div className="label">Damage observations</div>
            {obs.length === 0 && <p className="muted">None in the seed inventory.</p>}
            {obs.map((o) => (
              <p key={o.id}>
                {o.date}: {o.damageType} ({o.severity}) — {o.notes}
              </p>
            ))}
          </>
        )}
      </div>
    </div>
  )
}
