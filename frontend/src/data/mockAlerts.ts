import { AlertItem } from '../types';

export const INITIAL_ALERTS: AlertItem[] = [
  {
    id: 'alt-01',
    title: 'Extreme Heat & Humidity Alert — Manali–Ennore',
    locationId: 'manali-ennore',
    locationName: 'Manali–Ennore',
    district: 'North Chennai Industrial Corridor',
    severity: 'Extreme',
    type: 'AI Risk Alert',
    status: 'active',
    timestamp: '2026-08-21T09:15:00Z',
    triggerFactors: ['Temperature 39.4°C', 'Humidity 78%', 'Cooling Access 28%'],
    publicAction: 'Activate local municipal cooling shelter, halt non-essential outdoor port operations, and dispatch emergency hydration vans.'
  },
  {
    id: 'alt-02',
    title: 'Hazardous PM2.5 Exposure Alert — Tondiarpet',
    locationId: 'tondiarpet',
    locationName: 'Tondiarpet',
    district: 'North Chennai Urban Wards',
    severity: 'High',
    type: 'Official Warning',
    status: 'active',
    timestamp: '2026-08-21T08:50:00Z',
    triggerFactors: ['PM2.5 79 µg/m³', 'Population Density 26,500/km²'],
    publicAction: 'Restrict heavy truck idling along port access roads; recommend N95 masks for outdoor workers and elderly residents.'
  },
  {
    id: 'alt-03',
    title: 'Peak UV Exposure Warning — Velachery Corridor',
    locationId: 'velachery',
    locationName: 'Velachery',
    district: 'South Chennai Residential Corridor',
    severity: 'High',
    type: 'Informational Notification',
    status: 'active',
    timestamp: '2026-08-21T09:00:00Z',
    triggerFactors: ['UV Index 10', 'High Unshaded Pedestrian Traffic'],
    publicAction: 'Deploy shade awnings at railway station exits and bus stops.'
  },
  {
    id: 'alt-04',
    title: 'Severe Cooling Deficit Advisory — North Chennai Central',
    locationId: 'north-chennai',
    locationName: 'North Chennai Central',
    district: 'Royapuram – Pulianthope Wards',
    severity: 'Extreme',
    type: 'AI Risk Alert',
    status: 'active',
    timestamp: '2026-08-21T07:30:00Z',
    triggerFactors: ['Cooling Access 35%', 'Vulnerable Population 185,000'],
    publicAction: 'Open community halls as public air-conditioned relief centers.'
  },
  {
    id: 'alt-05',
    title: 'Thermal Comfort Discomfort Advisory — Ambattur',
    locationId: 'ambattur',
    locationName: 'Ambattur',
    district: 'Western Industrial Suburb',
    severity: 'Moderate',
    type: 'Informational Notification',
    status: 'acknowledged',
    timestamp: '2026-08-21T06:00:00Z',
    triggerFactors: ['PM2.5 68 µg/m³', 'Built-Up Density 76%'],
    publicAction: 'Monitor workplace ventilation in manufacturing units.'
  },
  {
    id: 'alt-06',
    title: 'Green Canopy Deficit Notice — Tambaram Junction',
    locationId: 'tambaram',
    locationName: 'Tambaram',
    district: 'Southern Metropolitan Gateway',
    severity: 'Moderate',
    type: 'Informational Notification',
    status: 'resolved',
    timestamp: '2026-08-20T16:00:00Z',
    triggerFactors: ['Commuter Heat Exposure', 'Vegetation Cover 29%'],
    publicAction: 'Planted 120 shade saplings near bus depot.'
  }
];
