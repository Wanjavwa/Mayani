export type EvidenceKind =
  | 'verified_site'
  | 'literature'
  | 'expert_estimate'
  | 'demonstration'

export type MaterialCategory = 'stone' | 'earthen' | 'mortar' | 'timber' | 'other'

export type HorizonYears = 5 | 10 | 20

export type ClimateScenarioId =
  | 'current'
  | 'increased_rainfall'
  | 'higher_temperatures'
  | 'increased_flood'

export type MaintenanceScenarioId = 'none' | 'routine' | 'conservation'

export type TwinViewMode = 'current' | 'degradation' | 'intervention'

export type ForecastStatus = 'computed' | 'insufficient_evidence'

export interface DataSource {
  id: string
  name: string
  kind: EvidenceKind
  citation: string
  url?: string
  notes: string
}

export interface Site {
  id: string
  name: string
  country: string
  regionLabel: string
  siteType: string
  description: string
  historicalContext: string
  constructionMaterialsSummary: string
  geographicLocation: string
  surroundingTerrain: string
  conditionSummary: string
  mainRisks: string[]
  lastAssessmentDate: string
  dataCompletenessPct: number
  confidenceLabel: string
  priorityActions: string[]
  isDemonstration: boolean
  demonstrationDisclaimer: string
  coordinates: { lat: number; lon: number; accuracy: 'demonstration' }
  exposure: EnvironmentalExposure
  glbPath?: string
}

export interface EnvironmentalExposure {
  rainfallMmAnnual: number
  projectedRainfallChangePct: number
  meanTemperatureC: number
  heatExtremeDays: number
  humidityPct: number
  windExposure: 'low' | 'moderate' | 'high'
  floodDrainageRisk: 'low' | 'moderate' | 'high'
  geologicalHazard: string
}

export interface Structure {
  id: string
  siteId: string
  name: string
  kind: string
  description: string
  materialIds: string[]
  baselineCondition: number
  observedDamage: string
  riskNotes: string
  mesh: {
    position: [number, number, number]
    size: [number, number, number]
    rotationY?: number
  }
}

export interface MaterialVulnerabilities {
  rain: number
  heat: number
  flood: number
  wind: number
  humidity: number
}

export interface Material {
  id: string
  siteId: string
  name: string
  category: MaterialCategory
  location: string
  composition: string
  physicalProperties: string
  constructionTechnique: string
  currentCondition: string
  observedDamage: string
  deteriorationMechanisms: string[]
  repairHistory: string
  compatibleTreatments: string
  sourceId: string
  assessmentDate: string
  confidence: string
  evidenceKind: EvidenceKind
  vulnerabilities: MaterialVulnerabilities
  inventoryWeight: number
}

export interface ConditionObservation {
  id: string
  siteId: string
  structureId?: string
  date: string
  location: string
  damageType: string
  severity: 'low' | 'moderate' | 'high' | 'severe'
  notes: string
  photographRef?: string
  sourceId: string
}

export interface EnvironmentalObservation {
  id: string
  siteId: string
  factor:
    | 'rainfall'
    | 'projected_rainfall'
    | 'temperature'
    | 'humidity'
    | 'wind'
    | 'flood_drainage'
    | 'geological'
  period: string
  value: string
  relevance: string
  mechanism: string
  quality: string
  sourceId: string
  evidenceKind: EvidenceKind
}

export interface ClimateScenario {
  id: ClimateScenarioId
  label: string
  description: string
  multipliers: MaterialVulnerabilities
  sourceId: string
}

export interface DeteriorationModel {
  id: string
  name: string
  version: string
  description: string
  assumptions: string[]
  uncertainty: string
  replaceable: true
  scientificallyValidated: false
}

export interface Forecast {
  id: string
  siteId: string
  structureId: string
  modelId: string
  horizonYears: HorizonYears
  climateScenarioId: ClimateScenarioId
  maintenanceScenarioId: MaintenanceScenarioId
  inputs: Record<string, number | string>
  projectedCondition: number
  conditionDelta: number
  status: ForecastStatus
  drivers: { mechanism: string; contribution: number; status: ForecastStatus }[]
  assumptions: string[]
  uncertainty: string
}

export interface ConservationIntervention {
  id: string
  siteId: string
  structureId?: string
  materialId?: string
  title: string
  description: string
  riskAddressed: string
  urgency: 'immediate' | 'near_term' | 'scheduled' | 'watch'
  costRange: string
  expectedBenefit: string
  feasibility: 'high' | 'moderate' | 'constrained'
  evidence: string
  confidence: string
  limitations: string
  expertReviewRequired: true
  rankScore: number
}

export interface MonitoringRecord {
  id: string
  siteId: string
  date: string
  kind: 'observation' | 'sensor' | 'photograph'
  location: string
  payload: string
  sourceId: string
}

export interface ScenarioSelection {
  horizonYears: HorizonYears
  climateScenarioId: ClimateScenarioId
  maintenanceScenarioId: MaintenanceScenarioId
}
