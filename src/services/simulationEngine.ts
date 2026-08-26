import { LocationData, EnvironmentalReading, InterventionParameters, SimulationResult } from '../types';
import { calculateLocationRisk } from './riskEngine';

export function runWhatIfSimulation(
  location: LocationData,
  reading: EnvironmentalReading,
  params: InterventionParameters
): SimulationResult {
  // Baseline Risk
  const baselineResult = calculateLocationRisk(location, reading);

  // Apply hypothetical intervention adjustments
  const simulatedLocation: LocationData = {
    ...location,
    // Tree planting boosts NDVI
    vegetationNdvi: Math.min(0.85, location.vegetationNdvi + (params.treePlantingCoverage * 0.006)),
    // Cool roofs lower effective built-up thermal density
    builtUpDensity: Math.max(20, location.builtUpDensity - (params.coolRoofAdoption * 0.4)),
    // Cooling centers + shaded bus stops + water stations increase cooling access score
    coolingAccessScore: Math.min(95, location.coolingAccessScore + (params.coolingCenterCount * 4) + (params.shadedBusStops * 0.8) + (params.waterStations * 0.5))
  };

  const simulatedReading: EnvironmentalReading = {
    ...reading,
    // Tree canopy & cool roofs reduce surface ambient temperature by up to 2.8°C
    temperature: Math.max(25, reading.temperature - (params.treePlantingCoverage * 0.03) - (params.coolRoofAdoption * 0.02)),
    // PM2.5 mitigation reduces air pollution
    pm25: Math.max(10, reading.pm25 * (1 - (params.pm25MitigationPct / 100)))
  };

  const projectedResult = calculateLocationRisk(simulatedLocation, simulatedReading);

  const scoreReduction = Math.max(0, baselineResult.score - projectedResult.score);

  // Estimate population benefited based on location population and intervention intensity
  const intensity = (params.treePlantingCoverage * 0.2) + (params.coolRoofAdoption * 0.2) + (params.coolingCenterCount * 3) + (params.shadedBusStops * 0.5) + (params.pm25MitigationPct * 0.5);
  const populationBenefited = Math.round(Math.min(location.population, location.vulnerablePopulation * (intensity / 20)));

  // Estimate complexity
  let complexity: 'Low' | 'Medium' | 'High' = 'Low';
  if (params.coolRoofAdoption > 30 || params.treePlantingCoverage > 25) {
    complexity = 'High';
  } else if (params.coolingCenterCount > 3 || params.pm25MitigationPct > 15) {
    complexity = 'Medium';
  }

  // Before / After driver distribution comparison
  const beforeDrivers = baselineResult.mainDrivers.map(d => ({
    category: d.factorName,
    beforePct: d.contributionPercent,
    afterPct: 0
  }));

  const afterMap = new Map(projectedResult.mainDrivers.map(d => [d.factorName, d.contributionPercent]));
  const beforeAfterDrivers = beforeDrivers.map(d => ({
    ...d,
    afterPct: afterMap.get(d.category) || d.beforePct
  }));

  const summary = `Simulating these interventions reduces ${location.name}’s risk score from ${baselineResult.score}/100 down to ${projectedResult.score}/100 (a -${scoreReduction} point reduction). An estimated ${populationBenefited.toLocaleString()} vulnerable residents benefit directly from improved thermal comfort, reduced PM2.5 exposure, and expanded cooling shelter access.`;

  return {
    baselineScore: baselineResult.score,
    projectedScore: projectedResult.score,
    scoreReduction,
    populationBenefited,
    implementationComplexity: complexity,
    timelineEstimate: complexity === 'High' ? '6-12 months' : complexity === 'Medium' ? '3-6 months' : '1-3 months',
    beforeAfterDrivers,
    summary
  };
}
