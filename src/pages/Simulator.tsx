import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import { climateScenarios, deteriorationModel } from '@/data/catalog'
import { TwinToolbar, SiteScene } from '@/components/twin/SiteScene'
import { usePlatform, useSiteBundle } from '@/context/PlatformState'
import type { ClimateScenarioId, HorizonYears, MaintenanceScenarioId } from '@/types'

export function SimulatorPage() {
  const { scenario, setScenario, setViewMode } = usePlatform()
  const { structures, degraded, conserved, meanCurrent, meanDegraded, meanConserved } = useSiteBundle()

  const chart = structures.map((s) => ({
    name: s.name.replace(' enclosure', '').replace(' watch', ''),
    current: s.baselineCondition,
    noIntervention: degraded.find((f) => f.structureId === s.id)?.projectedCondition,
    conservation: conserved.find((f) => f.structureId === s.id)?.projectedCondition,
  }))

  const sample = degraded[0]

  return (
    <div>
      <div className="label">Scenario laboratory</div>
      <h2 className="serif" style={{ marginTop: 4, fontSize: '2rem' }}>
        Degradation simulator
      </h2>
      <p className="callout">
        {deteriorationModel.name} v{deteriorationModel.version}. {deteriorationModel.description} Results
        below are simulated projections, not verified future damage.
      </p>
      <div className="card" style={{ marginTop: '1rem' }}>
        <div className="toolbar">
          <label>
            Horizon
            <select
              className="site-select"
              style={{ marginLeft: 8 }}
              value={scenario.horizonYears}
              onChange={(e) =>
                setScenario({ ...scenario, horizonYears: Number(e.target.value) as HorizonYears })
              }
            >
              <option value={5}>5 years</option>
              <option value={10}>10 years</option>
              <option value={20}>20 years</option>
            </select>
          </label>
          <label>
            Climate
            <select
              className="site-select"
              style={{ marginLeft: 8 }}
              value={scenario.climateScenarioId}
              onChange={(e) =>
                setScenario({ ...scenario, climateScenarioId: e.target.value as ClimateScenarioId })
              }
            >
              {climateScenarios.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.label}
                </option>
              ))}
            </select>
          </label>
          <label>
            Maintenance (overlay)
            <select
              className="site-select"
              style={{ marginLeft: 8 }}
              value={scenario.maintenanceScenarioId}
              onChange={(e) => {
                const maintenanceScenarioId = e.target.value as MaintenanceScenarioId
                setScenario({ ...scenario, maintenanceScenarioId })
                setViewMode(maintenanceScenarioId === 'conservation' ? 'intervention' : 'degradation')
              }}
            >
              <option value="none">No additional intervention</option>
              <option value="routine">Routine maintenance</option>
              <option value="conservation">Proposed conservation modifier</option>
            </select>
          </label>
        </div>
      </div>
      <div className="compare" style={{ marginTop: '1rem' }}>
        <div className="card">
          <div className="label">Observed condition (inventory)</div>
          <h3 className="serif">Index {meanCurrent}</h3>
          <p className="muted">Documented demonstration inventory. Not a forecast.</p>
        </div>
        <div className="card">
          <div className="label">Simulated projection</div>
          <h3 className="serif">
            No intervention {meanDegraded} · conservation modifier {meanConserved}
          </h3>
          <p className="muted">
            Year +{scenario.horizonYears}. {climateScenarios.find((c) => c.id === scenario.climateScenarioId)?.description}
          </p>
        </div>
      </div>
      <div style={{ margin: '0.8rem 0' }}>
        <TwinToolbar />
      </div>
      <SiteScene />
      <div className="card" style={{ height: 320, marginTop: '1rem' }}>
        <div className="label">Structure comparison — demonstration index</div>
        <ResponsiveContainer width="100%" height="90%">
          <BarChart data={chart} margin={{ top: 8, right: 8, left: 0, bottom: 24 }}>
            <CartesianGrid stroke="#c8b79d" strokeDasharray="3 3" />
            <XAxis dataKey="name" tick={{ fontSize: 11, fill: '#3d2b1f' }} interval={0} angle={-18} textAnchor="end" />
            <YAxis domain={[0, 100]} tick={{ fill: '#3d2b1f' }} />
            <Tooltip contentStyle={{ background: '#faf6ed', borderColor: '#c8b79d' }} />
            <Legend />
            <Bar dataKey="current" name="Current" fill="#6b7a4a" />
            <Bar dataKey="noIntervention" name="Simulated, no intervention" fill="#8a3f32" />
            <Bar dataKey="conservation" name="Simulated, conservation modifier" fill="#a7864d" />
          </BarChart>
        </ResponsiveContainer>
      </div>
      {sample && (
        <div className="card" style={{ marginTop: '1rem' }}>
          <div className="label">Model card</div>
          <p>
            <strong>Assumptions.</strong> {deteriorationModel.assumptions.join(' ')}
          </p>
          <p>
            <strong>Uncertainty.</strong> {deteriorationModel.uncertainty}
          </p>
          <div className="label">Drivers for {structures[0]?.name}</div>
          <ul>
            {sample.drivers.map((d) => (
              <li key={d.mechanism}>
                {d.mechanism}: {d.status === 'insufficient_evidence' ? 'insufficient evidence' : d.contribution.toFixed(2)}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  )
}
