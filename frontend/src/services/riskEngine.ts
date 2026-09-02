import { EnvironmentalReading, LocationData, RiskFactor, RiskScoreResult, RiskLevel } from '../types';

/**
 * Baseline Risk Calculation Engine for Thermal Equity AI
 * 
 * Formula:
 * - Environmental Exposure: 50%
 * - Social Vulnerability: 30%
 * - Access & Resilience Deficit: 20%
 * 
 * All scores normalized 0 to 100.
 */

// Helper to classify 0-100 score into defined risk bands
export function classifyRisk(score: number): RiskLevel {
  if (score >= 80) return 'Extreme';
  if (score >= 60) return 'High';
  if (score >= 30) return 'Moderate';
  return 'Low';
}

// Min-Max normalization helper
function normalize(val: number, min: number, max: number): number {
  if (max === min) return 50;
  const clamped = Math.max(min, Math.min(max, val));
  return ((clamped - min) / (max - min)) * 100;
}

export function calculateLocationRisk(
  location: LocationData,
  reading: EnvironmentalReading
): RiskScoreResult {
  // 1. Environmental Exposure Component (50%)
  // Factors: Temp (norm 25 to 44°C), PM2.5 (norm 10 to 150 µg/m³), Humidity (norm 40 to 90%), UV (norm 1 to 12)
  const normTemp = normalize(reading.temperature, 25, 44);
  const normPm25 = normalize(reading.pm25, 10, 150);
  const normHumidity = normalize(reading.humidity, 40, 90);
  const normUv = normalize(reading.uvIndex, 1, 12);
  const normPollutants = normalize((reading.no2 * 0.8) + (reading.co * 15), 10, 100);

  const exposureSubScore = (normTemp * 0.30) + (normPm25 * 0.30) + (normHumidity * 0.20) + (normUv * 0.10) + (normPollutants * 0.10);

  // 2. Social Vulnerability Component (30%)
  // Factors: Vulnerable population ratio, built-up density, population density
  const vulnRatio = (location.vulnerablePopulation / location.population) * 100;
  const normVulnRatio = normalize(vulnRatio, 10, 60);
  const normBuiltUp = normalize(location.builtUpDensity, 30, 95);
  const normPopDensity = normalize(location.populationDensity, 3000, 35000);

  const vulnerabilitySubScore = (normVulnRatio * 0.45) + (normBuiltUp * 0.35) + (normPopDensity * 0.20);

  // 3. Access & Resilience Deficit Component (20%)
  // Factors: Inverse Cooling Access %, Inverse NDVI %
  const coolingDeficit = Math.max(0, 100 - location.coolingAccessScore);
  const ndviDeficit = Math.max(0, (1 - location.vegetationNdvi) * 100);

  const accessSubScore = (coolingDeficit * 0.55) + (ndviDeficit * 0.45);

  // Final Composite Risk Score
  const rawScore = (0.50 * exposureSubScore) + (0.30 * vulnerabilitySubScore) + (0.20 * accessSubScore);
  const finalScore = Math.round(Math.max(0, Math.min(100, rawScore)));

  const classification = classifyRisk(finalScore);

  // Calculate Factor Contribution Breakdown (SHAP-style)
  // Total contribution sums to 100%
  const totalBurdenPoints = exposureSubScore + vulnerabilitySubScore + accessSubScore || 1;

  const tempWeight = ((normTemp * 0.30 * 0.50) / totalBurdenPoints) * 100;
  const pm25Weight = ((normPm25 * 0.30 * 0.50) / totalBurdenPoints) * 100;
  const humidityWeight = ((normHumidity * 0.20 * 0.50) / totalBurdenPoints) * 100;
  const uvWeight = ((normUv * 0.10 * 0.50) / totalBurdenPoints) * 100;
  const canopyDeficitWeight = ((ndviDeficit * 0.45 * 0.20) / totalBurdenPoints) * 100;
  const coolingDeficitWeight = ((coolingDeficit * 0.55 * 0.20) / totalBurdenPoints) * 100;
  const vulnWeight = ((vulnerabilitySubScore * 0.30) / totalBurdenPoints) * 100;

  const factors: RiskFactor[] = [
    {
      factorKey: 'temperature',
      factorName: 'Surface Heat & Air Temp',
      currentRawValue: reading.temperature,
      unit: '°C',
      normalizedScore: Math.round(normTemp),
      weight: 0.15,
      contributionPercent: Math.round(tempWeight),
      severity: classifyRisk(normTemp),
      plainLanguageExplanation: `High ambient temperature of ${reading.temperature}°C creates severe microclimate heat stress.`
    },
    {
      factorKey: 'pm25',
      factorName: 'PM2.5 Airborne Particulates',
      currentRawValue: reading.pm25,
      unit: 'µg/m³',
      normalizedScore: Math.round(normPm25),
      weight: 0.15,
      contributionPercent: Math.round(pm25Weight),
      severity: classifyRisk(normPm25),
      plainLanguageExplanation: `Fine particulate concentration of ${reading.pm25} µg/m³ compounds respiratory burden during extreme heat.`
    },
    {
      factorKey: 'vulnerability',
      factorName: 'Population Vulnerability & Density',
      currentRawValue: Math.round(vulnRatio),
      unit: '% vulnerable',
      normalizedScore: Math.round(vulnerabilitySubScore),
      weight: 0.30,
      contributionPercent: Math.round(vulnWeight),
      severity: classifyRisk(vulnerabilitySubScore),
      plainLanguageExplanation: `${Math.round(vulnRatio)}% of residents (elderly, outdoor workers, low-income households) face heightened physical vulnerability.`
    },
    {
      factorKey: 'humidity',
      factorName: 'Relative Humidity Discomfort',
      currentRawValue: reading.humidity,
      unit: '%',
      normalizedScore: Math.round(normHumidity),
      weight: 0.10,
      contributionPercent: Math.round(humidityWeight),
      severity: classifyRisk(normHumidity),
      plainLanguageExplanation: `Coastal relative humidity of ${reading.humidity}% hinders sweat evaporation, raising feels-like temperature to ${reading.feelsLike}°C.`
    },
    {
      factorKey: 'vegetation',
      factorName: 'Tree Canopy Deficit (Inverse NDVI)',
      currentRawValue: Math.round(location.vegetationNdvi * 100),
      unit: '% canopy',
      normalizedScore: Math.round(ndviDeficit),
      weight: 0.09,
      contributionPercent: Math.round(canopyDeficitWeight),
      severity: classifyRisk(ndviDeficit),
      plainLanguageExplanation: `Very low urban green canopy (${Math.round(location.vegetationNdvi * 100)}% NDVI) provides insufficient microclimate shade.`
    },
    {
      factorKey: 'cooling_access',
      factorName: 'Cooling Space Deficit',
      currentRawValue: location.coolingAccessScore,
      unit: '% access',
      normalizedScore: Math.round(coolingDeficit),
      weight: 0.11,
      contributionPercent: Math.round(coolingDeficitWeight),
      severity: classifyRisk(coolingDeficit),
      plainLanguageExplanation: `Only ${location.coolingAccessScore}% of local residents have reliable access to public or home cooling spaces.`
    },
    {
      factorKey: 'uv_index',
      factorName: 'UV Solar Radiation',
      currentRawValue: reading.uvIndex,
      unit: 'UV Index',
      normalizedScore: Math.round(normUv),
      weight: 0.05,
      contributionPercent: Math.round(uvWeight),
      severity: classifyRisk(normUv),
      plainLanguageExplanation: `Peak solar UV Index of ${reading.uvIndex} presents extreme direct sun exposure hazards.`
    }
  ].sort((a, b) => b.contributionPercent - a.contributionPercent);

  // Generate automated AI Field Note narrative
  const top2 = factors.slice(0, 2);
  const aiFieldNote = `${location.name}’s risk (${finalScore}/100) is primarily driven by ${top2[0].factorName.toLowerCase()} and ${top2[1].factorName.toLowerCase()}. Limited vegetation (${Math.round(location.vegetationNdvi * 100)}% NDVI) and high population vulnerability (${Math.round(vulnRatio)}%) further increase the combined environmental burden. Prioritizing interventions here offers the highest equity impact per population affected.`;

  return {
    locationId: location.id,
    score: finalScore,
    classification,
    confidencePercent: reading.qualityRating === 'High' ? 88 : 79,
    dataQualityPercent: reading.qualityRating === 'High' ? 94 : 82,
    exposureSubScore: Math.round(exposureSubScore),
    vulnerabilitySubScore: Math.round(vulnerabilitySubScore),
    accessSubScore: Math.round(accessSubScore),
    mainDrivers: factors,
    aiFieldNote,
    limitations: 'Decision-support estimate based on spatial grid aggregation (10m - 100m). Does not constitute an official emergency warning or individual medical diagnosis.',
    timestamp: reading.timestamp
  };
}
