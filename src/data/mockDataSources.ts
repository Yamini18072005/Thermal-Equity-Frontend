import { DataSource } from '../types';

export const MOCK_DATA_SOURCES: DataSource[] = [
  {
    id: 'ds-01',
    name: 'India Meteorological Department (IMD) Weather Station Telemetry',
    type: 'Meteorological',
    status: 'Active',
    lastSync: '2026-08-21T09:30:00Z',
    qualityRating: 98,
    recordsCount: 142800,
    coverage: 'Chennai Airport, Nungambakkam, Ennore, Meenambakkam Stations',
    updateFrequency: 'Hourly'
  },
  {
    id: 'ds-02',
    name: 'Central Pollution Control Board (CPCB) Continuous AQI Feed',
    type: 'Air Quality',
    status: 'Active',
    lastSync: '2026-08-21T09:15:00Z',
    qualityRating: 94,
    recordsCount: 89400,
    coverage: 'Manali, Alandur, Velachery, Royapuram, IIT Madras Monitors',
    updateFrequency: 'Every 15 mins'
  },
  {
    id: 'ds-03',
    name: 'Sentinel-2 / Landsat-9 Surface Temperature & NDVI Layers',
    type: 'Satellite Imagery',
    status: 'Active',
    lastSync: '2026-08-20T11:00:00Z',
    qualityRating: 92,
    recordsCount: 14500,
    coverage: '10m spatial resolution grid across Chennai Metropolitan Area',
    updateFrequency: '5-day pass cycle'
  },
  {
    id: 'ds-04',
    name: 'OpenStreetMap (OSM) Built Environment & Green Space Layer',
    type: 'GIS Infrastructure',
    status: 'Active',
    lastSync: '2026-08-19T14:20:00Z',
    qualityRating: 88,
    recordsCount: 423000,
    coverage: 'Road networks, building footprints, parks, water bodies',
    updateFrequency: 'Weekly'
  },
  {
    id: 'ds-05',
    name: 'Census of India & Tamil Nadu Municipal Vulnerability Survey',
    type: 'Demographics',
    status: 'Active',
    lastSync: '2026-08-15T08:00:00Z',
    qualityRating: 95,
    recordsCount: 15500,
    coverage: 'Ward-level age demographics, outdoor worker ratio, housing types',
    updateFrequency: 'Annual refresh'
  },
  {
    id: 'ds-06',
    name: 'Hyperlocal Environmental Sensor Network (Pilot)',
    type: 'Sensor Network',
    status: 'Degraded',
    lastSync: '2026-08-21T07:45:00Z',
    qualityRating: 79,
    recordsCount: 312000,
    coverage: '24 IoT micro-stations along North Chennai Industrial Belt',
    updateFrequency: 'Every 5 mins'
  }
];
