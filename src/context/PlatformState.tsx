import {
  createContext,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from 'react'
import {
  conditionObservations as seedObservations,
  seedMonitoring,
  sites,
  structures,
} from '@/data/catalog'
import { forecastSite, meanProjected } from '@/engine/deterioration'
import type {
  ConditionObservation,
  MonitoringRecord,
  ScenarioSelection,
  TwinViewMode,
} from '@/types'

const STORAGE_OBS = 'hpip.observations'
const STORAGE_MON = 'hpip.monitoring'

function loadJson<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key)
    return raw ? (JSON.parse(raw) as T) : fallback
  } catch {
    return fallback
  }
}

interface PlatformContextValue {
  siteId: string
  setSiteId: (id: string) => void
  selectedStructureId: string | null
  setSelectedStructureId: (id: string | null) => void
  hoveredStructureId: string | null
  setHoveredStructureId: (id: string | null) => void
  viewMode: TwinViewMode
  setViewMode: (mode: TwinViewMode) => void
  scenario: ScenarioSelection
  setScenario: (next: ScenarioSelection) => void
  observations: ConditionObservation[]
  addObservation: (obs: ConditionObservation) => void
  monitoring: MonitoringRecord[]
  addMonitoring: (rec: MonitoringRecord) => void
}

const PlatformContext = createContext<PlatformContextValue | null>(null)

export function PlatformProvider({ children }: { children: ReactNode }) {
  const [siteId, setSiteId] = useState(sites[0].id)
  const [selectedStructureId, setSelectedStructureId] = useState<string | null>(null)
  const [hoveredStructureId, setHoveredStructureId] = useState<string | null>(null)
  const [viewMode, setViewMode] = useState<TwinViewMode>('current')
  const [scenario, setScenario] = useState<ScenarioSelection>({
    horizonYears: 10,
    climateScenarioId: 'increased_rainfall',
    maintenanceScenarioId: 'none',
  })
  const [observations, setObservations] = useState<ConditionObservation[]>(() =>
    loadJson(STORAGE_OBS, seedObservations),
  )
  const [monitoring, setMonitoring] = useState<MonitoringRecord[]>(() =>
    loadJson(STORAGE_MON, seedMonitoring),
  )

  const value = useMemo(
    () => ({
      siteId,
      setSiteId,
      selectedStructureId,
      setSelectedStructureId,
      hoveredStructureId,
      setHoveredStructureId,
      viewMode,
      setViewMode,
      scenario,
      setScenario,
      observations,
      addObservation: (obs: ConditionObservation) => {
        setObservations((prev) => {
          const next = [obs, ...prev]
          localStorage.setItem(STORAGE_OBS, JSON.stringify(next))
          return next
        })
      },
      monitoring,
      addMonitoring: (rec: MonitoringRecord) => {
        setMonitoring((prev) => {
          const next = [rec, ...prev]
          localStorage.setItem(STORAGE_MON, JSON.stringify(next))
          return next
        })
      },
    }),
    [
      siteId,
      selectedStructureId,
      hoveredStructureId,
      viewMode,
      scenario,
      observations,
      monitoring,
    ],
  )

  return <PlatformContext.Provider value={value}>{children}</PlatformContext.Provider>
}

export function usePlatform() {
  const ctx = useContext(PlatformContext)
  if (!ctx) throw new Error('usePlatform outside provider')
  return ctx
}

export function useSiteBundle() {
  const { siteId, scenario } = usePlatform()
  const site = sites.find((s) => s.id === siteId) ?? sites[0]
  const siteStructures = structures.filter((s) => s.siteId === site.id)
  const noneScenario: ScenarioSelection = {
    ...scenario,
    maintenanceScenarioId: 'none',
  }
  const conservedScenario: ScenarioSelection = {
    ...scenario,
    maintenanceScenarioId: 'conservation',
  }
  const degraded = forecastSite(site.id, noneScenario, site.exposure)
  const conserved = forecastSite(site.id, conservedScenario, site.exposure)
  return {
    site,
    structures: siteStructures,
    degraded,
    conserved,
    meanDegraded: meanProjected(degraded),
    meanConserved: meanProjected(conserved),
    meanCurrent: Number(
      (siteStructures.reduce((a, s) => a + s.baselineCondition, 0) / siteStructures.length).toFixed(1),
    ),
  }
}
