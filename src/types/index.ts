export type RiskLevel = 'Low' | 'Moderate' | 'High' | 'Extreme';

export type AlertType = 'Official Warning' | 'AI Risk Alert' | 'Informational Notification';

export type AlertStatus = 'active' | 'acknowledged' | 'resolved';

export type RecommendationCategory = 'Heat protection' | 'Public health' | 'Green infrastructure' | 'Air quality';

export type RecommendationPriority = 'Immediate' | 'High' | 'Medium';

export interface Coordinates {
  lat: number;
  lng: number;
}

export interface LocationData {
  id: string;
  name: string;
  district: string;
  coordinates: Coordinates;
  bounds?: [number, number][]; // Polygon bounding box for zone rendering
  population: number;
  vulnerablePopulation: number; // Count or estimated percentage
  coolingAccessScore: number; // 0-100 (% access to public/private cooling)
  vegetationNdvi: number; // 0-1 NDVI rating
  builtUpDensity: number; // 0-100%
  populationDensity: number; // people / km2
  description: string;
  primaryStressors: string[];
}

export interface EnvironmentalReading {
  locationId: string;
  timestamp: string;
  temperature: number; // °C
  feelsLike: number; // °C
  humidity: number; // %
  pm25: number; // µg/m³
  co: number; // ppm
  no2: number; // ppb
  o3: number; // ppb
  uvIndex: number; // 0 - 12+
  windSpeed: number; // km/h
  qualityRating: 'High' | 'Medium' | 'Low';
  sourceTag: string;
  dataMode: 'observed' | 'estimated' | 'simulated';
}

export interface RiskFactor {
  factorKey: string;
  factorName: string;
  currentRawValue: number;
  unit: string;
  normalizedScore: number; // 0 - 100
  weight: number; // Decimal weight e.g. 0.25
  contributionPercent: number; // e.g. 31%
  severity: RiskLevel;
  plainLanguageExplanation: string;
}

export interface RiskScoreResult {
  locationId: string;
  score: number; // 0 - 100
  classification: RiskLevel;
  confidencePercent: number; // e.g. 86%
  dataQualityPercent: number;
  exposureSubScore: number; // 50% weight
  vulnerabilitySubScore: number; // 30% weight
  accessSubScore: number; // 20% weight
  mainDrivers: RiskFactor[];
  aiFieldNote: string;
  limitations: string;
  timestamp: string;
}

export interface CompoundRisk {
  id: string;
  title: string;
  severity: RiskLevel;
  affectedLocationIds: string[];
  affectedLocationNames: string[];
  factorsInvolved: string[];
  detectedAt: string;
  explanation: string;
  publicActionAdvice: string;
  sourceType: 'AI Model Detection' | 'Multi-Sensor Fusion' | 'Public Health Alert';
}

export interface AlertItem {
  id: string;
  title: string;
  locationId: string;
  locationName: string;
  district: string;
  severity: RiskLevel;
  type: AlertType;
  status: AlertStatus;
  timestamp: string;
  triggerFactors: string[];
  publicAction: string;
}

export interface MitigationRecommendation {
  id: string;
  title: string;
  locationId: string;
  locationName: string;
  priority: RecommendationPriority;
  estimatedImpactPoints: number; // e.g. -8 points
  populationBenefit: number; // e.g. 42000
  category: RecommendationCategory;
  complexity: 'Low' | 'Medium' | 'High';
  timeline: string;
  explanation: string;
  actionPlan: string[];
  reviewed: boolean;
}

export interface InterventionParameters {
  treePlantingCoverage: number; // 0 - 50% boost
  coolRoofAdoption: number; // 0 - 60% adoption
  coolingCenterCount: number; // 0 - 10 new centers
  shadedBusStops: number; // 0 - 50 shelters
  waterStations: number; // 0 - 30 kiosks
  pm25MitigationPct: number; // 0 - 40% reduction
}

export interface SimulationResult {
  baselineScore: number;
  projectedScore: number;
  scoreReduction: number;
  populationBenefited: number;
  implementationComplexity: 'Low' | 'Medium' | 'High';
  timelineEstimate: string;
  beforeAfterDrivers: {
    category: string;
    beforePct: number;
    afterPct: number;
  }[];
  summary: string;
}

export interface DataSource {
  id: string;
  name: string;
  type: 'Meteorological' | 'Air Quality' | 'Satellite Imagery' | 'GIS Infrastructure' | 'Demographics' | 'Sensor Network';
  status: 'Active' | 'Degraded' | 'Offline';
  lastSync: string;
  qualityRating: number; // %
  recordsCount: number;
  coverage: string;
  updateFrequency: string;
}

export interface UserPreferences {
  temperatureUnit: 'Celsius' | 'Fahrenheit';
  theme: 'Dark Navy' | 'Coastal Teal Light';
  defaultLocationId: string;
  enableCriticalAlerts: boolean;
  enableAiFieldNotes: boolean;
  includeSimulatedLayers: boolean;
  language: 'English' | 'Tamil';
}
