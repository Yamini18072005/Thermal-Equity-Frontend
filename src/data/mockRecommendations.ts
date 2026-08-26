import { MitigationRecommendation } from '../types';

export const INITIAL_RECOMMENDATIONS: MitigationRecommendation[] = [
  {
    id: 'rec-01',
    title: 'Install Shaded & Solar-Cooled Bus Terminals in Manali–Ennore',
    locationId: 'manali-ennore',
    locationName: 'Manali–Ennore',
    priority: 'Immediate',
    estimatedImpactPoints: -8,
    populationBenefit: 42000,
    category: 'Heat protection',
    complexity: 'Medium',
    timeline: '1-3 months',
    explanation: 'Installing shaded roofs and mist-cooling fans at 12 primary transit stops reduces radiant surface temperature exposure by 6.2°C for transit commuters.',
    actionPlan: [
      'Identify 12 high-volume bus stops along Express Canal Road',
      'Deploy solar-powered reflective shade awnings with evaporative mist fans',
      'Install live water replenishment kiosks'
    ],
    reviewed: false
  },
  {
    id: 'rec-02',
    title: 'Expand Public Resilience Cooling Centre Access in North Chennai',
    locationId: 'north-chennai',
    locationName: 'North Chennai Central',
    priority: 'High',
    estimatedImpactPoints: -6,
    populationBenefit: 68000,
    category: 'Public health',
    complexity: 'Low',
    timeline: 'Immediate',
    explanation: 'Converting 6 municipal auditoriums into daytime public cooling spaces provides immediate heat relief to vulnerable low-income households with inadequate home cooling.',
    actionPlan: [
      'Designate public primary schools and ward community halls as resilience centers',
      'Supply backup diesel generators and medical heat-stroke emergency kits',
      'Publish multilingual SMS guidance to ward residents'
    ],
    reviewed: false
  },
  {
    id: 'rec-03',
    title: 'Increase Urban Tree Canopy Buffer along Tondiarpet Freight Roads',
    locationId: 'tondiarpet',
    locationName: 'Tondiarpet',
    priority: 'Medium',
    estimatedImpactPoints: -5,
    populationBenefit: 31000,
    category: 'Green infrastructure',
    complexity: 'High',
    timeline: '6-12 months',
    explanation: 'Planting dense native evergreen street trees (Neem, Pongamia) along port access corridors mitigates ambient surface heat and filters coarse airborne dust.',
    actionPlan: [
      'Allocate 3.2 km road shoulder for Miyawaki dense urban forestry',
      'Integrate drip irrigation fed by treated municipal graywater',
      'Target 15% NDVI increase over 24 months'
    ],
    reviewed: false
  },
  {
    id: 'rec-04',
    title: 'Deploy Real-Time PM2.5 Public Early Warning Network',
    locationId: 'manali-ennore',
    locationName: 'Manali–Ennore Industrial Corridor',
    priority: 'Immediate',
    estimatedImpactPoints: -4,
    populationBenefit: 284000,
    category: 'Air quality',
    complexity: 'Low',
    timeline: '1 month',
    explanation: 'Automated early morning air quality warnings allow outdoor manual laborers, schools, and eldercare facilities to adjust schedule windows before peak pollution spikes.',
    actionPlan: [
      'Connect CPCB monitoring feeds directly to municipal automated broadcast API',
      'Issue automated WhatsApp / SMS alerts when PM2.5 crosses 75 µg/m³ threshold',
      'Distribute respiratory protective equipment to sanitation and port crews'
    ],
    reviewed: false
  },
  {
    id: 'rec-05',
    title: 'Implement Reflective Cool Roof Coatings in High-Density Wards',
    locationId: 'tondiarpet',
    locationName: 'Tondiarpet High-Density Wards',
    priority: 'High',
    estimatedImpactPoints: -7,
    populationBenefit: 54000,
    category: 'Heat protection',
    complexity: 'Medium',
    timeline: '2-4 months',
    explanation: 'Applying high-albedo solar reflective white paint to metal and concrete roofs lowers indoor ambient temperature by up to 4.5°C during afternoon peaks.',
    actionPlan: [
      'Target 400 low-income households with tin/asbestos roof structures',
      'Provide subsidized high-albedo elastomeric paint and volunteer application teams',
      'Measure pre- and post-intervention indoor heat metrics'
    ],
    reviewed: false
  }
];
