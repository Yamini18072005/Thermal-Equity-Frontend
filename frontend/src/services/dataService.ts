import { CHENNAI_LOCATIONS, MOCK_ENVIRONMENTAL_READINGS } from '../data/mockLocations';
import { MOCK_COMPOUND_RISKS } from '../data/mockCompoundRisks';
import { INITIAL_ALERTS } from '../data/mockAlerts';
import { INITIAL_RECOMMENDATIONS } from '../data/mockRecommendations';
import { MOCK_DATA_SOURCES } from '../data/mockDataSources';
import { calculateLocationRisk } from './riskEngine';
import {
  LocationData,
  EnvironmentalReading,
  RiskScoreResult,
  CompoundRisk,
  AlertItem,
  MitigationRecommendation,
  DataSource,
  UserPreferences
} from '../types';

// In-memory persistent state for interactive features
let alertsState: AlertItem[] = [...INITIAL_ALERTS];
let recommendationsState: MitigationRecommendation[] = [...INITIAL_RECOMMENDATIONS];
let dataSourcesState: DataSource[] = [...MOCK_DATA_SOURCES];

const DEFAULT_PREFERENCES: UserPreferences = {
  temperatureUnit: 'Celsius',
  theme: 'Dark Navy',
  defaultLocationId: 'manali-ennore',
  enableCriticalAlerts: true,
  enableAiFieldNotes: true,
  includeSimulatedLayers: true,
  language: 'English'
};

let userPreferences: UserPreferences = { ...DEFAULT_PREFERENCES };

export const DataService = {
  // 1. Locations API
  getLocations(): LocationData[] {
    return CHENNAI_LOCATIONS;
  },

  getLocationById(id: string): LocationData | undefined {
    return CHENNAI_LOCATIONS.find(l => l.id === id);
  },

  // 2. Environmental Readings API
  getEnvironmentalReading(locationId: string): EnvironmentalReading {
    return MOCK_ENVIRONMENTAL_READINGS[locationId] || {
      locationId,
      timestamp: new Date().toISOString(),
      temperature: 36.0,
      feelsLike: 40.0,
      humidity: 68,
      pm25: 45,
      co: 1.0,
      no2: 30,
      o3: 40,
      uvIndex: 8,
      windSpeed: 10,
      qualityRating: 'Medium',
      sourceTag: 'Estimated Baseline',
      dataMode: 'estimated'
    };
  },

  // 3. Computed Risk Score API
  getRiskScore(locationId: string): RiskScoreResult {
    const loc = this.getLocationById(locationId) || CHENNAI_LOCATIONS[0];
    const reading = this.getEnvironmentalReading(locationId);
    return calculateLocationRisk(loc, reading);
  },

  getAllRiskScores(): (RiskScoreResult & { location: LocationData; reading: EnvironmentalReading })[] {
    return CHENNAI_LOCATIONS.map(loc => {
      const reading = this.getEnvironmentalReading(loc.id);
      const risk = calculateLocationRisk(loc, reading);
      return { ...risk, location: loc, reading };
    });
  },

  // 4. Compound Risks API
  getCompoundRisks(): CompoundRisk[] {
    return MOCK_COMPOUND_RISKS;
  },

  // 5. Alerts API (Interactive State)
  getAlerts(): AlertItem[] {
    return alertsState;
  },

  acknowledgeAlert(alertId: string): AlertItem[] {
    alertsState = alertsState.map(a =>
      a.id === alertId ? { ...a, status: 'acknowledged' as const } : a
    );
    return alertsState;
  },

  resolveAlert(alertId: string): AlertItem[] {
    alertsState = alertsState.map(a =>
      a.id === alertId ? { ...a, status: 'resolved' as const } : a
    );
    return alertsState;
  },

  // 6. Recommendations API (Interactive State)
  getRecommendations(): MitigationRecommendation[] {
    return recommendationsState;
  },

  toggleRecommendationReview(id: string): MitigationRecommendation[] {
    recommendationsState = recommendationsState.map(r =>
      r.id === id ? { ...r, reviewed: !r.reviewed } : r
    );
    return recommendationsState;
  },

  // 7. Data Sources API
  getDataSources(): DataSource[] {
    return dataSourcesState;
  },

  triggerDataSourceSync(id: string): DataSource[] {
    dataSourcesState = dataSourcesState.map(ds =>
      ds.id === id ? { ...ds, lastSync: new Date().toISOString(), status: 'Active' as const } : ds
    );
    return dataSourcesState;
  },

  // 8. User Preferences API
  getPreferences(): UserPreferences {
    return userPreferences;
  },

  updatePreferences(updated: Partial<UserPreferences>): UserPreferences {
    userPreferences = { ...userPreferences, ...updated };
    return userPreferences;
  },

  // 9. Dashboard Summary KPI metrics
  getDashboardSummary() {
    const scores = this.getAllRiskScores();
    const avgScore = Math.round(scores.reduce((acc, s) => acc + s.score, 0) / scores.length);
    const totalExposedPop = CHENNAI_LOCATIONS.reduce((acc, l) => acc + l.population, 0);
    const criticalZonesCount = scores.filter(s => s.classification === 'Extreme' || s.classification === 'High').length;
    const avgConfidence = Math.round(scores.reduce((acc, s) => acc + s.confidencePercent, 0) / scores.length);

    return {
      regionBurdenScore: 68, // Target matching PRD KPI
      regionClassification: 'High',
      scoreChange: '+3.4 from last reading',
      peopleExposed: '1.24M',
      peopleExposedNum: totalExposedPop,
      criticalZonesCount: 4,
      modelConfidence: 86, // Target matching PRD KPI
      lastUpdated: '2026-08-21T09:30:00Z',
      activeAlertsCount: alertsState.filter(a => a.status === 'active').length
    };
  }
};
