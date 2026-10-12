import { climateScenarios, deteriorationModel, materials, structures } from '@/data/catalog'
import type {
  ClimateScenarioId,
  EnvironmentalExposure,
  Forecast,
  HorizonYears,
  MaintenanceScenarioId,
  MaterialVulnerabilities,
  ScenarioSelection,
  Structure,
} from '@/types'

export const TIME_FACTOR: Record<HorizonYears, number> = {
  5: 1,
  10: 1.85,
  20: 3.4,
}

export const MAINTENANCE_FACTOR: Record<MaintenanceScenarioId, number> = {
  none: 1,
  routine: 0.62,
  conservation: 0.38,
}

const LOSS_SCALE = 6.2

const MECHANISM_LABEL: Record<keyof MaterialVulnerabilities, string> = {
  rain: 'Rain splash and wetting–drying',
  heat: 'Thermal cycling',
  flood: 'Drainage concentration and capillary moisture',
  wind: 'Wind abrasion',
  humidity: 'Hygroscopic moisture',
}

export function climateById(id: ClimateScenarioId) {
  const found = climateScenarios.find((c) => c.id === id)
  if (!found) throw new Error(`Unknown climate scenario ${id}`)
  return found
}

function clamp(n: number, min: number, max: number) {
  return Math.min(max, Math.max(min, n))
}

function structureMaterials(structure: Structure) {
  return materials.filter((m) => structure.materialIds.includes(m.id))
}

/**
 * Deterministic demonstration forecast. No stochastic terms.
 * Insect/biological attack on timber is withheld (insufficient evidence).
 */
export function forecastStructure(
  structure: Structure,
  scenario: ScenarioSelection,
  siteExposure: EnvironmentalExposure,
): Forecast {
  const climate = climateById(scenario.climateScenarioId)
  const time = TIME_FACTOR[scenario.horizonYears]
  const maint = MAINTENANCE_FACTOR[scenario.maintenanceScenarioId]
  const mats = structureMaterials(structure)

  const windMap = { low: 0.4, moderate: 0.7, high: 1 }
  const floodMap = { low: 0.35, moderate: 0.7, high: 1 }

  const exposure: MaterialVulnerabilities = {
    rain: siteExposure.rainfallMmAnnual / 900,
    heat: siteExposure.heatExtremeDays / 60,
    flood: floodMap[siteExposure.floodDrainageRisk],
    wind: windMap[siteExposure.windExposure],
    humidity: siteExposure.humidityPct / 100,
  }

  const driverTotals: Record<keyof MaterialVulnerabilities, number> = {
    rain: 0,
    heat: 0,
    flood: 0,
    wind: 0,
    humidity: 0,
  }

  let weightedLoss = 0
  let weightSum = 0

  for (const mat of mats) {
    const keys: (keyof MaterialVulnerabilities)[] = ['rain', 'heat', 'flood', 'wind', 'humidity']
    let matLoss = 0
    for (const key of keys) {
      const contribution =
        exposure[key] * mat.vulnerabilities[key] * climate.multipliers[key] * time * maint * LOSS_SCALE
      matLoss += contribution
      driverTotals[key] += contribution * mat.inventoryWeight
    }
    weightedLoss += matLoss * mat.inventoryWeight
    weightSum += mat.inventoryWeight
  }

  const loss = weightSum === 0 ? 0 : weightedLoss / weightSum
  const projected = clamp(structure.baselineCondition - loss, 0, 100)

  const drivers: Forecast['drivers'] = (Object.keys(driverTotals) as (keyof MaterialVulnerabilities)[]).map(
    (key) => ({
      mechanism: MECHANISM_LABEL[key],
      contribution: Number(driverTotals[key].toFixed(2)),
      status: 'computed',
    }),
  )

  if (structure.materialIds.includes('mat-timber')) {
    drivers.push({
      mechanism: 'Biological / insect attack on timber',
      contribution: 0,
      status: 'insufficient_evidence',
    })
  }

  return {
    id: `fc-${structure.id}-${scenario.horizonYears}-${scenario.climateScenarioId}-${scenario.maintenanceScenarioId}`,
    siteId: structure.siteId,
    structureId: structure.id,
    modelId: deteriorationModel.id,
    horizonYears: scenario.horizonYears,
    climateScenarioId: scenario.climateScenarioId,
    maintenanceScenarioId: scenario.maintenanceScenarioId,
    inputs: {
      baselineCondition: structure.baselineCondition,
      timeFactor: time,
      maintenanceFactor: maint,
      climate: climate.label,
    },
    projectedCondition: Number(projected.toFixed(1)),
    conditionDelta: Number((projected - structure.baselineCondition).toFixed(1)),
    status: 'computed',
    drivers,
    assumptions: deteriorationModel.assumptions,
    uncertainty: deteriorationModel.uncertainty,
  }
}

export function forecastSite(siteId: string, scenario: ScenarioSelection, siteExposure: EnvironmentalExposure) {
  return structures
    .filter((s) => s.siteId === siteId)
    .map((s) => forecastStructure(s, scenario, siteExposure))
}

export function meanProjected(forecasts: Forecast[]) {
  if (forecasts.length === 0) return 0
  return Number((forecasts.reduce((a, f) => a + f.projectedCondition, 0) / forecasts.length).toFixed(1))
}

export function conditionColor(value: number): string {
  if (value >= 75) return '#6b7a4a'
  if (value >= 60) return '#a7864d'
  if (value >= 45) return '#b56a3c'
  return '#8a3f32'
}

export function conditionLabel(value: number): string {
  if (value >= 75) return 'Fair–good (index)'
  if (value >= 60) return 'Fair (index)'
  if (value >= 45) return 'Poor–fair (index)'
  return 'Poor (index)'
}
