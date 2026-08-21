import { CompoundRisk } from '../types';

export const MOCK_COMPOUND_RISKS: CompoundRisk[] = [
  {
    id: 'cr-01',
    title: 'Extreme Heat + High Humidity Discomfort',
    severity: 'Extreme',
    affectedLocationIds: ['manali-ennore', 'tondiarpet', 'north-chennai', 'velachery'],
    affectedLocationNames: ['Manali–Ennore', 'Tondiarpet', 'North Chennai Central', 'Velachery'],
    factorsInvolved: ['Air Temperature (39.4°C)', 'Relative Humidity (78%)', 'Cooling Access Deficit (28%)'],
    detectedAt: '2026-08-21T08:15:00Z',
    explanation: 'Extremely high surface air temperature combined with high coastal relative humidity severely impairs human thermoregulation via sweat evaporation. Low municipal cooling center availability escalates public health risk.',
    publicActionAdvice: 'Issue immediate heat advisory, extend public hydration centers, pause outdoor manual labor between 11:00 AM - 3:30 PM.',
    sourceType: 'Multi-Sensor Fusion'
  },
  {
    id: 'cr-02',
    title: 'Severe PM2.5 + Low Wind Dispersion',
    severity: 'High',
    affectedLocationIds: ['manali-ennore', 'tondiarpet', 'ambattur'],
    affectedLocationNames: ['Manali–Ennore', 'Tondiarpet', 'Ambattur'],
    factorsInvolved: ['PM2.5 Pollution (86 µg/m³)', 'Low Wind Speed (7-8 km/h)', 'Built-up Density (88%)'],
    detectedAt: '2026-08-21T07:45:00Z',
    explanation: 'Industrial atmospheric particulates trapped under stagnant coastal inversion layer. High built-up concrete walls prevent natural corridor ventilation.',
    publicActionAdvice: 'Advise sensitive groups and children to remain indoors with air filtration. Enforce industrial dust suppression controls.',
    sourceType: 'AI Model Detection'
  },
  {
    id: 'cr-03',
    title: 'Extreme UV Radiation + Canopy Deficit',
    severity: 'High',
    affectedLocationIds: ['manali-ennore', 'tondiarpet', 'north-chennai', 'velachery', 'tambaram', 'sholinganallur'],
    affectedLocationNames: ['Manali–Ennore', 'Tondiarpet', 'North Chennai Central', 'Velachery', 'Tambaram', 'Sholinganallur'],
    factorsInvolved: ['UV Index 11 (Extreme)', 'Tree Canopy Deficit (8-11% NDVI)', 'Shade Deficit'],
    detectedAt: '2026-08-21T09:00:00Z',
    explanation: 'Peak solar irradiance combined with absent street tree shade creates rapid thermal exhaustion and acute skin damage hazards for transit commuters.',
    publicActionAdvice: 'Deploy temporary pop-up shade shelters at major bus terminals and street vendor hubs.',
    sourceType: 'Public Health Alert'
  }
];
