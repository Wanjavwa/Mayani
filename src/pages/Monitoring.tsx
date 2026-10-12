import { FormEvent, useState } from 'react'
import { deteriorationModel, structures } from '@/data/catalog'
import { usePlatform, useSiteBundle } from '@/context/PlatformState'
import type { ConditionObservation, MonitoringRecord } from '@/types'

export function MonitoringPage() {
  const { siteId, observations, addObservation, monitoring, addMonitoring, scenario } = usePlatform()
  const { site, meanCurrent, meanDegraded, structures: siteStructures } = useSiteBundle()
  const [report, setReport] = useState('')

  const siteObs = observations.filter((o) => o.siteId === siteId)
  const siteMon = monitoring.filter((m) => m.siteId === siteId)

  function onObservation(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const data = new FormData(e.currentTarget)
    const obs: ConditionObservation = {
      id: `obs-${Date.now()}`,
      siteId,
      structureId: String(data.get('structureId') || '') || undefined,
      date: String(data.get('date')),
      location: String(data.get('location')),
      damageType: String(data.get('damageType')),
      severity: String(data.get('severity')) as ConditionObservation['severity'],
      notes: String(data.get('notes')),
      photographRef: String(data.get('photographRef') || '') || undefined,
      sourceId: 'src-demo-composite',
    }
    addObservation(obs)
    e.currentTarget.reset()
  }

  function onSensor(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const data = new FormData(e.currentTarget)
    const rec: MonitoringRecord = {
      id: `mon-${Date.now()}`,
      siteId,
      date: String(data.get('date')),
      kind: 'sensor',
      location: String(data.get('location')),
      payload: String(data.get('payload')),
      sourceId: 'src-demo-composite',
    }
    addMonitoring(rec)
    e.currentTarget.reset()
  }

  function generate() {
    const lines = [
      `HERITAGE PRESERVATION INTELLIGENCE — SITE CONDITION REPORT`,
      `Record: ${site.name}`,
      `Status: DEMONSTRATION / NOT A VERIFIED MONUMENT FILE`,
      `Assessment date on file: ${site.lastAssessmentDate}`,
      `Condition index (inventory mean): ${meanCurrent}`,
      `Simulated ${scenario.horizonYears}y, climate ${scenario.climateScenarioId}, no intervention: ${meanDegraded}`,
      `Model: ${deteriorationModel.id} — not scientifically validated.`,
      `Data completeness: ${site.dataCompletenessPct}% (${site.confidenceLabel})`,
      '',
      'Priority actions (unreviewed):',
      ...site.priorityActions.map((a) => ` - ${a}`),
      '',
      'Latest observations:',
      ...siteObs.slice(0, 8).map((o) => ` - ${o.date} ${o.location}: ${o.damageType} (${o.severity})`),
      '',
      'This report does not constitute a conservation specification.',
    ]
    setReport(lines.join('\n'))
  }

  return (
    <div>
      <div className="label">Field book</div>
      <h2 className="serif" style={{ marginTop: 4, fontSize: '2rem' }}>
        Monitoring and reports
      </h2>
      <p className="callout">
        New observations are stored locally in this browser and are intended to support later model
        calibration. They do not alter the demonstration forecast until a calibration step exists.
      </p>
      <div className="grid-2" style={{ marginTop: '1rem' }}>
        <form className="card stack" onSubmit={onObservation}>
          <div className="label">New condition observation</div>
          <label>
            Date
            <input name="date" type="date" required />
          </label>
          <label>
            Structure
            <select name="structureId">
              <option value="">Site-wide</option>
              {siteStructures.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.name}
                </option>
              ))}
            </select>
          </label>
          <label>
            Location
            <input name="location" required placeholder="e.g. East wall basal course" />
          </label>
          <label>
            Damage type
            <input name="damageType" required placeholder="e.g. basal undercutting" />
          </label>
          <label>
            Severity
            <select name="severity" required>
              <option value="low">low</option>
              <option value="moderate">moderate</option>
              <option value="high">high</option>
              <option value="severe">severe</option>
            </select>
          </label>
          <label>
            Photograph reference
            <input name="photographRef" placeholder="filename or URL" />
          </label>
          <label>
            Notes
            <textarea name="notes" rows={3} />
          </label>
          <button className="btn" type="submit">
            Save observation
          </button>
        </form>
        <form className="card stack" onSubmit={onSensor}>
          <div className="label">Sensor measurement</div>
          <label>
            Date
            <input name="date" type="date" required />
          </label>
          <label>
            Location
            <input name="location" required />
          </label>
          <label>
            Reading
            <input name="payload" required placeholder="e.g. moisture index 0.48" />
          </label>
          <button className="btn" type="submit">
            Save reading
          </button>
        </form>
      </div>
      <div className="card" style={{ marginTop: '1rem' }}>
        <div className="label">Change log</div>
        <table className="table">
          <thead>
            <tr>
              <th>Date</th>
              <th>Type</th>
              <th>Where</th>
              <th>Record</th>
            </tr>
          </thead>
          <tbody>
            {siteObs.map((o) => (
              <tr key={o.id}>
                <td>{o.date}</td>
                <td>observation</td>
                <td>{o.location}</td>
                <td>
                  {o.damageType} ({o.severity}) {o.photographRef ?? ''}
                </td>
              </tr>
            ))}
            {siteMon.map((m) => (
              <tr key={m.id}>
                <td>{m.date}</td>
                <td>{m.kind}</td>
                <td>{m.location}</td>
                <td>{m.payload}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="card" style={{ marginTop: '1rem' }}>
        <div className="label">Generate summary</div>
        <button className="btn" type="button" onClick={generate} style={{ margin: '0.6rem 0' }}>
          Site condition report
        </button>
        {report && (
          <pre
            style={{
              whiteSpace: 'pre-wrap',
              background: '#f3ebdd',
              border: '1px solid #c8b79d',
              padding: '0.8rem',
              fontFamily: 'Source Sans 3, sans-serif',
              fontSize: '0.92rem',
            }}
          >
            {report}
          </pre>
        )}
      </div>
      <p className="muted">Known structures in this file: {structures.filter((s) => s.siteId === siteId).length}.</p>
    </div>
  )
}
