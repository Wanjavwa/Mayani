import { SiteScene, TwinToolbar } from '@/components/twin/SiteScene'
import { materials, conditionObservations } from '@/data/catalog'
import { sourceById } from '@/data/sources'
import { usePlatform, useSiteBundle } from '@/context/PlatformState'
import { conditionLabel } from '@/engine/deterioration'

export function DigitalTwinPage() {
  const { selectedStructureId, scenario } = usePlatform()
  const { structures, degraded, conserved } = useSiteBundle()
  const selected = structures.find((s) => s.id === selectedStructureId)
  const deg = degraded.find((f) => f.structureId === selected?.id)
  const cons = conserved.find((f) => f.structureId === selected?.id)
  const mats = materials.filter((m) => selected?.materialIds.includes(m.id))
  const obs = conditionObservations.filter((o) => o.structureId === selected?.id)

  return (
    <div>
      <div className="label">Museum reconstruction laboratory</div>
      <h2 className="serif" style={{ margin: '0.15rem 0 0.7rem', fontSize: '2rem' }}>
        Interactive digital twin
      </h2>
      <p className="callout">
        Orbit, zoom, and pan in the viewport. Hover a mass for name and condition index. Click to open
        the inventory panel. Overlay colours are a spatial risk index from the demonstration model.
        Procedural terrain and the east drainage band are not surveyed. A GLB/glTF path can replace
        this mesh later (`site.glbPath`).
      </p>
      <div style={{ margin: '0.8rem 0' }}>
        <TwinToolbar />
      </div>
      <div className="grid-2">
        <SiteScene />
        <div className="card">
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
    </div>
  )
}
