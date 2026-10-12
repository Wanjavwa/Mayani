import {
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import { environmentalObservations, projectedRainfall, rainfallSeries } from '@/data/catalog'
import { sourceById } from '@/data/sources'
import { usePlatform, useSiteBundle } from '@/context/PlatformState'

export function EnvironmentalRisksPage() {
  const { siteId } = usePlatform()
  const { site } = useSiteBundle()
  const rows = environmentalObservations.filter((o) => o.siteId === siteId)
  const series = [
    ...rainfallSeries.map((d) => ({ year: d.year, historical: d.mm, projected: undefined as number | undefined })),
    ...projectedRainfall.map((d) => ({ year: d.year, historical: undefined, projected: d.mm })),
  ]

  return (
    <div>
      <div className="label">Climate and ground</div>
      <h2 className="serif" style={{ marginTop: 4, fontSize: '2rem' }}>
        Environmental risks
      </h2>
      <p className="callout">
        Charts use a labeled demonstration series. Copernicus Climate Change Service and NASA Earthdata
        are reserved connections, not active extracts.
      </p>
      <div className="grid-4" style={{ margin: '1rem 0' }}>
        <div className="card stat">
          <span className="label">Rainfall (demo)</span>
          <strong>{site.exposure.rainfallMmAnnual} mm</strong>
        </div>
        <div className="card stat">
          <span className="label">Heat-extreme days</span>
          <strong>{site.exposure.heatExtremeDays}</strong>
        </div>
        <div className="card stat">
          <span className="label">Flood / drainage</span>
          <strong>{site.exposure.floodDrainageRisk}</strong>
        </div>
        <div className="card stat">
          <span className="label">Wind exposure</span>
          <strong>{site.exposure.windExposure}</strong>
        </div>
      </div>
      <div className="card" style={{ height: 340 }}>
        <div className="label">Rainfall series — demonstration</div>
        <ResponsiveContainer width="100%" height="90%">
          <LineChart data={series} margin={{ top: 12, right: 12, left: 0, bottom: 0 }}>
            <CartesianGrid stroke="#c8b79d" strokeDasharray="3 3" />
            <XAxis dataKey="year" stroke="#65432f" tick={{ fill: '#3d2b1f', fontSize: 12 }} />
            <YAxis stroke="#65432f" tick={{ fill: '#3d2b1f', fontSize: 12 }} />
            <Tooltip contentStyle={{ background: '#faf6ed', borderColor: '#c8b79d' }} />
            <Legend />
            <Line type="monotone" dataKey="historical" name="Historical (demo)" stroke="#65432f" dot={false} connectNulls />
            <Line
              type="monotone"
              dataKey="projected"
              name="Projected envelope (demo)"
              stroke="#a7864d"
              strokeDasharray="4 4"
              dot={false}
              connectNulls
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
      <div className="card" style={{ marginTop: '1rem', overflowX: 'auto' }}>
        <table className="table">
          <thead>
            <tr>
              <th>Factor</th>
              <th>Period</th>
              <th>Value</th>
              <th>Relevance / mechanism</th>
              <th>Quality</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((r) => {
              const src = sourceById(r.sourceId)
              return (
                <tr key={r.id}>
                  <td>{r.factor.replaceAll('_', ' ')}</td>
                  <td>{r.period}</td>
                  <td>{r.value}</td>
                  <td>
                    {r.relevance}
                    <div className="muted">{r.mechanism}</div>
                  </td>
                  <td>
                    {r.quality}
                    <div className="muted">
                      {src.name} · {r.evidenceKind}
                    </div>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </div>
  )
}
