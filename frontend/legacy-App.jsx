// App.jsx - Thermal Equity AI Urban Heat Intelligence Dashboard (Perfect Alignment & Layout)
import React, { useState, useMemo } from 'react';
import './App.css';

// Comprehensive dataset of 25 Chennai Localities with realistic urban heat metrics and non-overlapping map positions
const CHENNAI_LOCALITIES = [
  {
    id: 'tnagar',
    name: 'T. Nagar',
    temp: 42.3,
    feelsLike: 45.1,
    riskLevel: 'Critical',
    vulnScore: 91,
    popDensity: '88%',
    popDensityVal: 88,
    outdoorExpVal: 84,
    greenSpace: '18%',
    greenSpaceVal: 18,
    coolingInfra: '42%',
    coolingInfraVal: 42,
    priority: 'Immediate',
    lat: 13.0418,
    lng: 80.2341,
    mapX: 52,
    mapY: 52,
    uhiIndex: 4.8,
    treeCover: '4.2%',
    builtUpArea: '91%',
    primaryFactors: ['Dense Commercial Concrete', 'High Vehicular Emissions', 'Low Canopy Cover'],
    trend7Days: [39.5, 40.1, 41.2, 40.8, 41.9, 42.1, 42.3],
    trendFeels: [42.1, 43.0, 44.1, 43.5, 44.8, 44.9, 45.1],
    isMajor: true
  },
  {
    id: 'velachery',
    name: 'Velachery',
    temp: 41.0,
    feelsLike: 43.8,
    riskLevel: 'High',
    vulnScore: 84,
    popDensity: '79%',
    popDensityVal: 79,
    outdoorExpVal: 78,
    greenSpace: '24%',
    greenSpaceVal: 24,
    coolingInfra: '51%',
    coolingInfraVal: 51,
    priority: 'High',
    lat: 12.9815,
    lng: 80.2180,
    mapX: 58,
    mapY: 76,
    uhiIndex: 4.1,
    treeCover: '6.5%',
    builtUpArea: '84%',
    primaryFactors: ['Urban Sprawl over Wetlands', 'Reflective Asphalt', 'High Population Growth'],
    trend7Days: [38.2, 39.0, 39.8, 40.2, 40.5, 40.9, 41.0],
    trendFeels: [40.8, 41.7, 42.5, 43.0, 43.2, 43.6, 43.8],
    isMajor: true
  },
  {
    id: 'annanagar',
    name: 'Anna Nagar',
    temp: 40.2,
    feelsLike: 42.9,
    riskLevel: 'High',
    vulnScore: 76,
    popDensity: '72%',
    popDensityVal: 72,
    outdoorExpVal: 70,
    greenSpace: '35%',
    greenSpaceVal: 35,
    coolingInfra: '68%',
    coolingInfraVal: 68,
    priority: 'High',
    lat: 13.0878,
    lng: 80.2105,
    mapX: 38,
    mapY: 32,
    uhiIndex: 3.6,
    treeCover: '14.8%',
    builtUpArea: '78%',
    primaryFactors: ['Grid Layout Heat Trapping', 'High AC Exhaust Waste Heat'],
    trend7Days: [38.0, 38.5, 39.1, 39.4, 39.9, 40.0, 40.2],
    trendFeels: [40.5, 41.0, 41.8, 42.0, 42.5, 42.7, 42.9],
    isMajor: true
  },
  {
    id: 'adyar',
    name: 'Adyar',
    temp: 35.5,
    feelsLike: 38.0,
    riskLevel: 'Medium',
    vulnScore: 48,
    popDensity: '55%',
    popDensityVal: 55,
    outdoorExpVal: 50,
    greenSpace: '58%',
    greenSpaceVal: 58,
    coolingInfra: '75%',
    coolingInfraVal: 75,
    priority: 'Medium',
    lat: 13.0012,
    lng: 80.2565,
    mapX: 78,
    mapY: 68,
    uhiIndex: 2.1,
    treeCover: '28.4%',
    builtUpArea: '58%',
    primaryFactors: ['Estuary Cooling Breeze', 'Dense Riverfront Canopy'],
    trend7Days: [34.0, 34.2, 34.8, 35.0, 35.2, 35.4, 35.5],
    trendFeels: [36.2, 36.5, 37.1, 37.4, 37.6, 37.8, 38.0],
    isMajor: true
  },
  {
    id: 'perambur',
    name: 'Perambur',
    temp: 41.5,
    feelsLike: 44.5,
    riskLevel: 'Critical',
    vulnScore: 89,
    popDensity: '92%',
    popDensityVal: 92,
    outdoorExpVal: 86,
    greenSpace: '15%',
    greenSpaceVal: 15,
    coolingInfra: '38%',
    coolingInfraVal: 38,
    priority: 'Immediate',
    lat: 13.1147,
    lng: 80.2329,
    mapX: 52,
    mapY: 18,
    uhiIndex: 4.5,
    treeCover: '3.8%',
    builtUpArea: '93%',
    primaryFactors: ['Industrial Rail Hubs', 'Metal Roofing Concentration', 'Unshaded Streets'],
    trend7Days: [39.0, 39.8, 40.5, 41.0, 41.2, 41.4, 41.5],
    trendFeels: [41.8, 42.6, 43.4, 44.0, 44.1, 44.3, 44.5],
    isMajor: true
  },
  {
    id: 'guindy',
    name: 'Guindy',
    temp: 39.8,
    feelsLike: 42.1,
    riskLevel: 'High',
    vulnScore: 70,
    popDensity: '68%',
    popDensityVal: 68,
    outdoorExpVal: 72,
    greenSpace: '42%',
    greenSpaceVal: 42,
    coolingInfra: '62%',
    coolingInfraVal: 62,
    priority: 'High',
    lat: 13.0067,
    lng: 80.2206,
    mapX: 45,
    mapY: 66,
    uhiIndex: 3.4,
    treeCover: '22.1%',
    builtUpArea: '70%',
    primaryFactors: ['Industrial Estate Heat Flux', 'Buffer from Guindy National Park'],
    trend7Days: [37.8, 38.2, 38.9, 39.1, 39.4, 39.6, 39.8],
    trendFeels: [40.0, 40.5, 41.2, 41.4, 41.7, 41.9, 42.1],
    isMajor: true
  },
  {
    id: 'saidapet',
    name: 'Saidapet',
    temp: 40.8,
    feelsLike: 43.5,
    riskLevel: 'High',
    vulnScore: 82,
    popDensity: '85%',
    popDensityVal: 85,
    outdoorExpVal: 80,
    greenSpace: '20%',
    greenSpaceVal: 20,
    coolingInfra: '45%',
    coolingInfraVal: 45,
    priority: 'High',
    lat: 13.0213,
    lng: 80.2231,
    mapX: 46,
    mapY: 58,
    uhiIndex: 4.0,
    treeCover: '5.9%',
    builtUpArea: '88%',
    primaryFactors: ['High Informal Settlement Density', 'Lack of Urban Shading'],
    trend7Days: [38.5, 39.1, 39.7, 40.0, 40.3, 40.6, 40.8],
    trendFeels: [41.0, 41.8, 42.4, 42.7, 43.0, 43.3, 43.5],
    isMajor: false
  },
  {
    id: 'mylapore',
    name: 'Mylapore',
    temp: 37.2,
    feelsLike: 39.6,
    riskLevel: 'Medium',
    vulnScore: 62,
    popDensity: '78%',
    popDensityVal: 78,
    outdoorExpVal: 65,
    greenSpace: '30%',
    greenSpaceVal: 30,
    coolingInfra: '60%',
    coolingInfraVal: 60,
    priority: 'Medium',
    lat: 13.0368,
    lng: 80.2676,
    mapX: 82,
    mapY: 50,
    uhiIndex: 2.8,
    treeCover: '11.2%',
    builtUpArea: '82%',
    primaryFactors: ['Narrow Heritage Corridors', 'Coastal Sea Breeze Offset'],
    trend7Days: [35.5, 35.9, 36.3, 36.6, 36.9, 37.0, 37.2],
    trendFeels: [37.8, 38.2, 38.7, 39.0, 39.3, 39.4, 39.6],
    isMajor: false
  },
  {
    id: 'egmore',
    name: 'Egmore',
    temp: 40.5,
    feelsLike: 43.1,
    riskLevel: 'High',
    vulnScore: 79,
    popDensity: '84%',
    popDensityVal: 84,
    outdoorExpVal: 76,
    greenSpace: '22%',
    greenSpaceVal: 22,
    coolingInfra: '50%',
    coolingInfraVal: 50,
    priority: 'High',
    lat: 13.0732,
    lng: 80.2609,
    mapX: 72,
    mapY: 36,
    uhiIndex: 3.9,
    treeCover: '7.8%',
    builtUpArea: '86%',
    primaryFactors: ['Transit Hub Congestion', 'High Thermal Inertia Materials'],
    trend7Days: [38.2, 38.8, 39.4, 39.8, 40.1, 40.3, 40.5],
    trendFeels: [40.7, 41.3, 42.0, 42.4, 42.7, 42.9, 43.1],
    isMajor: false
  },
  {
    id: 'nungambakkam',
    name: 'Nungambakkam',
    temp: 39.5,
    feelsLike: 41.8,
    riskLevel: 'High',
    vulnScore: 68,
    popDensity: '70%',
    popDensityVal: 70,
    outdoorExpVal: 66,
    greenSpace: '38%',
    greenSpaceVal: 38,
    coolingInfra: '72%',
    coolingInfraVal: 72,
    priority: 'Medium',
    lat: 13.0627,
    lng: 80.2407,
    mapX: 60,
    mapY: 42,
    uhiIndex: 3.2,
    treeCover: '16.5%',
    builtUpArea: '76%',
    primaryFactors: ['Commercial District AC Waste', 'Mature Street Trees Corridor'],
    trend7Days: [37.5, 38.0, 38.5, 38.8, 39.1, 39.3, 39.5],
    trendFeels: [39.8, 40.3, 40.8, 41.1, 41.4, 41.6, 41.8],
    isMajor: false
  },
  {
    id: 'ambattur',
    name: 'Ambattur',
    temp: 41.8,
    feelsLike: 44.8,
    riskLevel: 'Critical',
    vulnScore: 87,
    popDensity: '81%',
    popDensityVal: 81,
    outdoorExpVal: 85,
    greenSpace: '19%',
    greenSpaceVal: 19,
    coolingInfra: '40%',
    coolingInfraVal: 40,
    priority: 'Immediate',
    lat: 13.1143,
    lng: 80.1548,
    mapX: 24,
    mapY: 22,
    uhiIndex: 4.6,
    treeCover: '4.9%',
    builtUpArea: '89%',
    primaryFactors: ['Heavy Industrial Zone Heat Radiation', 'Low Vegetation Index'],
    trend7Days: [39.2, 39.9, 40.6, 41.0, 41.3, 41.6, 41.8],
    trendFeels: [42.0, 42.8, 43.5, 44.0, 44.3, 44.6, 44.8],
    isMajor: true
  },
  {
    id: 'porur',
    name: 'Porur',
    temp: 39.2,
    feelsLike: 41.5,
    riskLevel: 'High',
    vulnScore: 65,
    popDensity: '64%',
    popDensityVal: 64,
    outdoorExpVal: 62,
    greenSpace: '32%',
    greenSpaceVal: 32,
    coolingInfra: '55%',
    coolingInfraVal: 55,
    priority: 'Medium',
    lat: 13.0382,
    lng: 80.1565,
    mapX: 22,
    mapY: 54,
    uhiIndex: 3.1,
    treeCover: '12.0%',
    builtUpArea: '75%',
    primaryFactors: ['Lake Microclimate Cooling', 'Rapid Highway Urbanization'],
    trend7Days: [37.0, 37.5, 38.1, 38.5, 38.8, 39.0, 39.2],
    trendFeels: [39.2, 39.8, 40.4, 40.8, 41.1, 41.3, 41.5],
    isMajor: false
  },
  {
    id: 'sholinganallur',
    name: 'Sholinganallur',
    temp: 37.8,
    feelsLike: 40.2,
    riskLevel: 'Medium',
    vulnScore: 58,
    popDensity: '52%',
    popDensityVal: 52,
    outdoorExpVal: 54,
    greenSpace: '45%',
    greenSpaceVal: 45,
    coolingInfra: '65%',
    coolingInfraVal: 65,
    priority: 'Low',
    lat: 12.9010,
    lng: 80.2279,
    mapX: 68,
    mapY: 92,
    uhiIndex: 2.7,
    treeCover: '18.9%',
    builtUpArea: '62%',
    primaryFactors: ['IT Park Glass Glazing Heat', 'Proximity to Marshland'],
    trend7Days: [35.8, 36.2, 36.7, 37.0, 37.3, 37.6, 37.8],
    trendFeels: [38.0, 38.5, 39.0, 39.4, 39.7, 40.0, 40.2],
    isMajor: false
  },
  {
    id: 'omr',
    name: 'OMR Corridor',
    temp: 38.5,
    feelsLike: 41.0,
    riskLevel: 'High',
    vulnScore: 60,
    popDensity: '58%',
    popDensityVal: 58,
    outdoorExpVal: 60,
    greenSpace: '40%',
    greenSpaceVal: 40,
    coolingInfra: '70%',
    coolingInfraVal: 70,
    priority: 'Medium',
    lat: 12.9350,
    lng: 80.2370,
    mapX: 74,
    mapY: 84,
    uhiIndex: 3.0,
    treeCover: '15.4%',
    builtUpArea: '68%',
    primaryFactors: ['Wide Asphalt Highways', 'High Energy Intensity Infrastructure'],
    trend7Days: [36.4, 36.9, 37.4, 37.8, 38.1, 38.3, 38.5],
    trendFeels: [38.8, 39.4, 39.9, 40.3, 40.6, 40.8, 41.0],
    isMajor: false
  },
  {
    id: 'pallavaram',
    name: 'Pallavaram',
    temp: 40.1,
    feelsLike: 42.7,
    riskLevel: 'High',
    vulnScore: 75,
    popDensity: '76%',
    popDensityVal: 76,
    outdoorExpVal: 74,
    greenSpace: '25%',
    greenSpaceVal: 25,
    coolingInfra: '48%',
    coolingInfraVal: 48,
    priority: 'High',
    lat: 12.9675,
    lng: 80.1491,
    mapX: 28,
    mapY: 78,
    uhiIndex: 3.5,
    treeCover: '9.1%',
    builtUpArea: '81%',
    primaryFactors: ['Quarry Topography Heat Trap', 'High Surface Reflectance'],
    trend7Days: [37.9, 38.4, 39.0, 39.3, 39.7, 39.9, 40.1],
    trendFeels: [40.4, 40.9, 41.6, 41.9, 42.3, 42.5, 42.7],
    isMajor: false
  },
  {
    id: 'thiruvanmiyur',
    name: 'Thiruvanmiyur',
    temp: 34.6,
    feelsLike: 37.1,
    riskLevel: 'Low',
    vulnScore: 42,
    popDensity: '50%',
    popDensityVal: 50,
    outdoorExpVal: 44,
    greenSpace: '62%',
    greenSpaceVal: 62,
    coolingInfra: '78%',
    coolingInfraVal: 78,
    priority: 'Low',
    lat: 12.9830,
    lng: 80.2594,
    mapX: 84,
    mapY: 74,
    uhiIndex: 1.8,
    treeCover: '31.2%',
    builtUpArea: '52%',
    primaryFactors: ['Direct Sea Breeze Corridor', 'High Coastal Canopy Density'],
    trend7Days: [33.2, 33.5, 33.9, 34.1, 34.3, 34.5, 34.6],
    trendFeels: [35.5, 35.8, 36.3, 36.5, 36.7, 36.9, 37.1],
    isMajor: false
  },
  {
    id: 'kodambakkam',
    name: 'Kodambakkam',
    temp: 40.9,
    feelsLike: 43.6,
    riskLevel: 'High',
    vulnScore: 81,
    popDensity: '83%',
    popDensityVal: 83,
    outdoorExpVal: 79,
    greenSpace: '21%',
    greenSpaceVal: 21,
    coolingInfra: '47%',
    coolingInfraVal: 47,
    priority: 'High',
    lat: 13.0510,
    lng: 80.2205,
    mapX: 42,
    mapY: 48,
    uhiIndex: 4.1,
    treeCover: '6.2%',
    builtUpArea: '87%',
    primaryFactors: ['Commercial Studio Concrete Mass', 'High Vehicular Density'],
    trend7Days: [38.6, 39.1, 39.8, 40.1, 40.4, 40.7, 40.9],
    trendFeels: [41.2, 41.7, 42.4, 42.8, 43.1, 43.4, 43.6],
    isMajor: false
  },
  {
    id: 'vadapalani',
    name: 'Vadapalani',
    temp: 40.6,
    feelsLike: 43.2,
    riskLevel: 'High',
    vulnScore: 78,
    popDensity: '80%',
    popDensityVal: 80,
    outdoorExpVal: 75,
    greenSpace: '23%',
    greenSpaceVal: 23,
    coolingInfra: '52%',
    coolingInfraVal: 52,
    priority: 'High',
    lat: 13.0500,
    lng: 80.2121,
    mapX: 35,
    mapY: 48,
    uhiIndex: 3.9,
    treeCover: '7.1%',
    builtUpArea: '85%',
    primaryFactors: ['Metro Flyover Shadow Heat Sink', 'High Traffic Idle Emissions'],
    trend7Days: [38.3, 38.8, 39.4, 39.8, 40.1, 40.4, 40.6],
    trendFeels: [40.8, 41.4, 42.0, 42.4, 42.7, 43.0, 43.2],
    isMajor: false
  },
  {
    id: 'royapettah',
    name: 'Royapettah',
    temp: 39.9,
    feelsLike: 42.4,
    riskLevel: 'High',
    vulnScore: 74,
    popDensity: '82%',
    popDensityVal: 82,
    outdoorExpVal: 71,
    greenSpace: '26%',
    greenSpaceVal: 26,
    coolingInfra: '54%',
    coolingInfraVal: 54,
    priority: 'Medium',
    lat: 13.0537,
    lng: 80.2612,
    mapX: 74,
    mapY: 44,
    uhiIndex: 3.5,
    treeCover: '9.8%',
    builtUpArea: '83%',
    primaryFactors: ['High Structural Density', 'Narrow Alleys Heat Retention'],
    trend7Days: [37.8, 38.2, 38.8, 39.1, 39.4, 39.7, 39.9],
    trendFeels: [40.2, 40.6, 41.3, 41.6, 41.9, 42.2, 42.4],
    isMajor: false
  },
  {
    id: 'besantnagar',
    name: 'Besant Nagar',
    temp: 33.8,
    feelsLike: 36.2,
    riskLevel: 'Low',
    vulnScore: 35,
    popDensity: '44%',
    popDensityVal: 44,
    outdoorExpVal: 38,
    greenSpace: '71%',
    greenSpaceVal: 71,
    coolingInfra: '85%',
    coolingInfraVal: 85,
    priority: 'Low',
    lat: 13.0002,
    lng: 80.2667,
    mapX: 86,
    mapY: 64,
    uhiIndex: 1.4,
    treeCover: '35.8%',
    builtUpArea: '45%',
    primaryFactors: ['Direct Oceanfront Cooling', 'Extensive Avenue Trees'],
    trend7Days: [32.5, 32.8, 33.1, 33.3, 33.5, 33.7, 33.8],
    trendFeels: [34.8, 35.1, 35.4, 35.6, 35.8, 36.0, 36.2],
    isMajor: true
  },
  {
    id: 'chromepet',
    name: 'Chromepet',
    temp: 39.7,
    feelsLike: 42.3,
    riskLevel: 'High',
    vulnScore: 71,
    popDensity: '73%',
    popDensityVal: 73,
    outdoorExpVal: 69,
    greenSpace: '28%',
    greenSpaceVal: 28,
    coolingInfra: '53%',
    coolingInfraVal: 53,
    priority: 'Medium',
    lat: 12.9516,
    lng: 80.1462,
    mapX: 20,
    mapY: 86,
    uhiIndex: 3.3,
    treeCover: '10.5%',
    builtUpArea: '79%',
    primaryFactors: ['Industrial Flyover Corridor', 'High Commercial Footfall'],
    trend7Days: [37.6, 38.0, 38.6, 38.9, 39.2, 39.5, 39.7],
    trendFeels: [40.1, 40.5, 41.1, 41.4, 41.7, 42.0, 42.3],
    isMajor: false
  },
  {
    id: 'avadi',
    name: 'Avadi',
    temp: 38.1,
    feelsLike: 40.5,
    riskLevel: 'Medium',
    vulnScore: 63,
    popDensity: '60%',
    popDensityVal: 60,
    outdoorExpVal: 62,
    greenSpace: '36%',
    greenSpaceVal: 36,
    coolingInfra: '59%',
    coolingInfraVal: 59,
    priority: 'Medium',
    lat: 13.1147,
    lng: 80.1098,
    mapX: 12,
    mapY: 16,
    uhiIndex: 2.9,
    treeCover: '16.2%',
    builtUpArea: '68%',
    primaryFactors: ['Open Lake Buffer Zone', 'Defense Establishment Canopy'],
    trend7Days: [36.0, 36.4, 37.0, 37.3, 37.6, 37.9, 38.1],
    trendFeels: [38.2, 38.7, 39.3, 39.6, 39.9, 40.2, 40.5],
    isMajor: true
  },
  {
    id: 'madhuravoyal',
    name: 'Madhuravoyal',
    temp: 41.2,
    feelsLike: 44.0,
    riskLevel: 'High',
    vulnScore: 83,
    popDensity: '77%',
    popDensityVal: 77,
    outdoorExpVal: 81,
    greenSpace: '20%',
    greenSpaceVal: 20,
    coolingInfra: '43%',
    coolingInfraVal: 43,
    priority: 'High',
    lat: 13.0645,
    lng: 80.1610,
    mapX: 24,
    mapY: 42,
    uhiIndex: 4.2,
    treeCover: '5.4%',
    builtUpArea: '86%',
    primaryFactors: ['Bypass Junction Heat Sink', 'High Truck Freight Exhaust'],
    trend7Days: [38.8, 39.4, 40.1, 40.5, 40.8, 41.0, 41.2],
    trendFeels: [41.5, 42.1, 42.8, 43.2, 43.5, 43.8, 44.0],
    isMajor: false
  },
  {
    id: 'thoraipakkam',
    name: 'Thoraipakkam',
    temp: 36.4,
    feelsLike: 38.9,
    riskLevel: 'Low',
    vulnScore: 50,
    popDensity: '53%',
    popDensityVal: 53,
    outdoorExpVal: 52,
    greenSpace: '48%',
    greenSpaceVal: 48,
    coolingInfra: '64%',
    coolingInfraVal: 64,
    priority: 'Low',
    lat: 12.9416,
    lng: 80.2362,
    mapX: 64,
    mapY: 82,
    uhiIndex: 2.2,
    treeCover: '20.5%',
    builtUpArea: '60%',
    primaryFactors: ['Pallikaranai Canal Buffer', 'Open Coastal Plain'],
    trend7Days: [34.8, 35.1, 35.6, 35.9, 36.1, 36.3, 36.4],
    trendFeels: [37.1, 37.4, 38.0, 38.3, 38.5, 38.7, 38.9],
    isMajor: false
  },
  {
    id: 'perungudi',
    name: 'Perungudi',
    temp: 34.8,
    feelsLike: 37.2,
    riskLevel: 'Low',
    vulnScore: 45,
    popDensity: '49%',
    popDensityVal: 49,
    outdoorExpVal: 46,
    greenSpace: '54%',
    greenSpaceVal: 54,
    coolingInfra: '67%',
    coolingInfraVal: 67,
    priority: 'Low',
    lat: 12.9654,
    lng: 80.2461,
    mapX: 70,
    mapY: 76,
    uhiIndex: 1.9,
    treeCover: '23.8%',
    builtUpArea: '54%',
    primaryFactors: ['Wetland Ecosystem Moisture Sink', 'Sea Breeze Mitigation'],
    trend7Days: [33.4, 33.7, 34.0, 34.3, 34.5, 34.7, 34.8],
    trendFeels: [35.7, 36.0, 36.3, 36.6, 36.8, 37.0, 37.2],
    isMajor: false
  }
];

export default function App() {
  const [activeTab, setActiveTab] = useState('Dashboard');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedLocality, setSelectedLocality] = useState(CHENNAI_LOCALITIES[0]); // T. Nagar default
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [mapLayer, setMapLayer] = useState('heat');
  const [mapZoom, setMapZoom] = useState(1);
  const [showAiModal, setShowAiModal] = useState(false);
  const [showSafetyModal, setShowSafetyModal] = useState(false);
  const [showCompareModal, setShowCompareModal] = useState(false);
  const [compareLocality, setCompareLocality] = useState(CHENNAI_LOCALITIES[1]);
  const [timeRange, setTimeRange] = useState('7');
  const [notificationOpen, setNotificationOpen] = useState(false);

  // Search filter
  const filteredLocalities = useMemo(() => {
    if (!searchQuery.trim()) return CHENNAI_LOCALITIES;
    return CHENNAI_LOCALITIES.filter(item =>
      item.name.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [searchQuery]);

  const handleSelectArea = (locality) => {
    setSelectedLocality(locality);
    setSearchQuery(locality.name);
    setIsSearchFocused(false);
  };

  const getRiskClass = (level) => {
    switch (level) {
      case 'Critical': return 'risk-critical';
      case 'High': return 'risk-high';
      case 'Medium': return 'risk-medium';
      case 'Low': return 'risk-low';
      default: return 'risk-low';
    }
  };

  const stats = useMemo(() => {
    const temps = CHENNAI_LOCALITIES.map(l => l.temp);
    const avg = (temps.reduce((a, b) => a + b, 0) / temps.length).toFixed(1);
    const max = Math.max(...temps);
    const criticalCount = CHENNAI_LOCALITIES.filter(l => l.riskLevel === 'Critical' || l.riskLevel === 'High').length;
    return { avg, max, criticalCount };
  }, []);

  const renderTrendSvg = (dataArray, color) => {
    if (!dataArray || dataArray.length === 0) return null;
    const min = 30;
    const max = 48;
    const height = 90;
    const width = 280;
    const points = dataArray.map((val, idx) => {
      const x = (idx / (dataArray.length - 1)) * width;
      const y = height - ((val - min) / (max - min)) * height;
      return `${x},${y}`;
    }).join(' ');

    return (
      <svg className="trend-svg" viewBox={`0 0 ${width} ${height}`}>
        <defs>
          <linearGradient id={`grad-${color.replace('#','')}`} x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor={color} stopOpacity="0.4" />
            <stop offset="100%" stopColor={color} stopOpacity="0.0" />
          </linearGradient>
        </defs>
        <polygon points={`0,${height} ${points} ${width},${height}`} fill={`url(#grad-${color.replace('#','')})`} />
        <polyline fill="none" stroke={color} strokeWidth="2.5" points={points} strokeLinecap="round" />
        {dataArray.map((val, idx) => {
          const x = (idx / (dataArray.length - 1)) * width;
          const y = height - ((val - min) / (max - min)) * height;
          return (
            <circle key={idx} cx={x} cy={y} r="3.5" fill="#060911" stroke={color} strokeWidth="2" />
          );
        })}
      </svg>
    );
  };

  return (
    <div className="thermal-app-root">
      {/* ATMOSPHERIC BACKGROUND EFFECTS */}
      <div className="bg-glow bg-glow-1"></div>
      <div className="bg-glow bg-glow-2"></div>
      <div className="bg-grid-overlay"></div>

      {/* TOP HEADER BAR */}
      <header className="top-header">
        <div className="header-left">
          <div className="brand-logo-container">
            <div className="logo-icon-wrap">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z" fill="url(#logo-grad)"/>
                <defs>
                  <linearGradient id="logo-grad" x1="0" y1="0" x2="24" y2="24">
                    <stop offset="0%" stopColor="#ff3b5c" />
                    <stop offset="100%" stopColor="#ff8c37" />
                  </linearGradient>
                </defs>
              </svg>
            </div>
            <div className="brand-text">
              <span className="brand-title">THERMAL EQUITY AI</span>
              <span className="brand-subtitle">URBAN CLIMATE INTELLIGENCE</span>
            </div>
          </div>

          <div className="status-pill-online">
            <span className="pulse-dot"></span>
            SYSTEM ONLINE
          </div>
        </div>

        {/* SEARCH BAR */}
        <div className="header-search-wrap">
          <div className="search-input-box">
            <svg className="search-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="11" cy="11" r="8"></circle>
              <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
            </svg>
            <input
              type="text"
              placeholder="Search Chennai locality (Velachery, T. Nagar, Adyar...)"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onFocus={() => setIsSearchFocused(true)}
            />
            {searchQuery && (
              <button className="clear-search-btn" onClick={() => setSearchQuery('')}>×</button>
            )}
          </div>

          {isSearchFocused && filteredLocalities.length > 0 && (
            <div className="search-results-dropdown">
              <div className="dropdown-header">
                <span>Chennai Areas ({filteredLocalities.length})</span>
                <button onClick={() => setIsSearchFocused(false)}>Close</button>
              </div>
              <div className="results-list">
                {filteredLocalities.map(loc => (
                  <div
                    key={loc.id}
                    className={`result-item ${selectedLocality.id === loc.id ? 'active' : ''}`}
                    onClick={() => handleSelectArea(loc)}
                  >
                    <div className="result-info">
                      <span className="result-name">{loc.name}</span>
                      <span className="result-meta">UHI: +{loc.uhiIndex}°C | Green: {loc.greenSpace}</span>
                    </div>
                    <div className="result-temp-badge">
                      <span className={`risk-tag ${getRiskClass(loc.riskLevel)}`}>{loc.riskLevel}</span>
                      <span className="temp-val">{loc.temp}°C</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="header-right">
          <div className="location-picker">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
              <circle cx="12" cy="10" r="3"></circle>
            </svg>
            <span>Chennai, TN</span>
          </div>

          <div className="notification-btn-wrap">
            <button className="icon-badge-btn" onClick={() => setNotificationOpen(!notificationOpen)}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path>
                <path d="M13.73 21a2 2 0 0 1-3.46 0"></path>
              </svg>
              <span className="badge-count">4</span>
            </button>

            {notificationOpen && (
              <div className="notification-popup">
                <div className="notif-header">
                  <span>Live Heat Alerts</span>
                  <span className="notif-time">20 Aug 2026</span>
                </div>
                <div className="notif-item critical">
                  <span className="alert-dot"></span>
                  <div>
                    <strong>T. Nagar Heat Emergency</strong>
                    <p>Temperature exceeded 42.3°C threshold. Vulnerability 91%.</p>
                  </div>
                </div>
                <div className="notif-item high">
                  <span className="alert-dot"></span>
                  <div>
                    <strong>Ambattur Industrial Heat Spike</strong>
                    <p>41.8°C thermal cluster detected in northern zone.</p>
                  </div>
                </div>
              </div>
            )}
          </div>

          <div className="header-clock">
            <span className="clock-time">10:14 AM</span>
            <span className="clock-date">20 Aug 2026</span>
          </div>
        </div>
      </header>

      {/* DASHBOARD BODY CONTAINER */}
      <div className="main-layout">
        {/* SIDEBAR NAVIGATION */}
        <aside className="sidebar">
          <nav className="nav-menu">
            <div className="menu-group-label">INTELLIGENCE</div>
            {[
              { id: 'Dashboard', icon: 'M3 13h8V3H3v10zm0 8h8v-6H3v6zm10 0h8v-10h-8v10zm0-18v6h8V3h-8z' },
              { id: 'Thermal Map', icon: 'M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 17.93c-3.95-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z' },
              { id: 'Heat Analytics', icon: 'M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zM9 17H7v-7h2v7zm4 0h-2V7h2v10zm4 0h-2v-4h2v4z' },
              { id: 'Vulnerability', icon: 'M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-5.45 9-12V5l-9-4zm0 10.99h7c-.53 4.12-3.28 7.79-7 8.94V12H5V6.3l7-3.11v8.8Z' },
            ].map(item => (
              <button
                key={item.id}
                className={`nav-item ${activeTab === item.id ? 'active' : ''}`}
                onClick={() => setActiveTab(item.id)}
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                  <path d={item.icon} />
                </svg>
                <span>{item.id}</span>
                {activeTab === item.id && <div className="active-indicator"></div>}
              </button>
            ))}

            <div className="menu-group-label" style={{ marginTop: '16px' }}>ACTIONS & REPORTS</div>
            {[
              { id: 'Heat Alerts', icon: 'M12 22c1.1 0 2-.9 2-2h-4c0 1.1.89 2 2 2zm6-6v-5c0-3.07-1.64-5.64-4.5-6.32V4c0-.83-.67-1.5-1.5-1.5s-1.5.67-1.5 1.5v.68C7.63 5.36 6 7.92 6 11v5l-2 2v1h16v-1l-2-2z', badge: '4' },
              { id: 'AI Insights', icon: 'M9 21c0 .55.45 1 1 1h4c.55 0 1-.45 1-1v-1H9v1zm3-19C8.14 2 5 5.14 5 9c0 2.38 1.19 4.47 3 5.74V17c0 .55.45 1 1 1h6c.55 0 1-.45 1-1v-2.26c1.81-1.27 3-3.36 3-5.74 0-3.86-3.14-7-7-7z' },
              { id: 'Recommendations', icon: 'M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z' },
              { id: 'Reports', icon: 'M19 3h-4.18C14.4 1.84 13.3 1 12 1c-1.3 0-2.4.84-2.82 2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-7 0c.55 0 1 .45 1 1s-.45 1-1 1-1-.45-1-1 .45-1 1-1zm2 14H7v-2h7v2zm3-4H7v-2h10v2zm0-4H7V7h10v2z' }
            ].map(item => (
              <button
                key={item.id}
                className={`nav-item ${activeTab === item.id ? 'active' : ''}`}
                onClick={() => setActiveTab(item.id)}
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                  <path d={item.icon} />
                </svg>
                <span>{item.id}</span>
                {item.badge && <span className="nav-badge">{item.badge}</span>}
              </button>
            ))}
          </nav>

          <div className="sidebar-footer">
            <div className="user-profile">
              <div className="avatar-circle">YM</div>
              <div className="user-info">
                <span className="user-name">Yamini M</span>
                <span className="user-role">Frontend & Dashboard Developer</span>
              </div>
            </div>
          </div>
        </aside>

        {/* MAIN SCROLLABLE CONTENT AREA */}
        <main className="content-container">
          {/* HERO BAR */}
          <div className="hero-banner">
            <div className="hero-text-area">
              <div className="breadcrumbs">THERMAL EQUITY AI / <span>LIVE INTELLIGENCE</span></div>
              <h1 className="hero-title">
                Urban Heat <span className="highlight-text">Intelligence</span>
              </h1>
            </div>

            <div className="hero-status-box">
              <div className="monitoring-indicator">
                <span className="green-pulse"></span>
                <span>LIVE THERMAL MONITORING</span>
              </div>
              <div className="heartbeat-wave">
                <svg width="90" height="18" viewBox="0 0 90 18">
                  <path d="M0 9 H20 L25 2 L32 16 L38 1 L44 13 L49 9 H90" fill="none" stroke="#00e676" strokeWidth="2" />
                </svg>
              </div>
              <div className="last-updated">
                <span>LAST UPDATED</span>
                <strong>Just now</strong>
              </div>
            </div>
          </div>

          {/* TOP METRICS CARDS ROW */}
          <div className="top-metrics-grid">
            {/* CARD 1: SELECTED LOCATION HEAT */}
            <div className="metric-card current-heat-card glass-panel">
              <div className="card-header">
                <span className="card-label">CURRENT HEAT ({selectedLocality.name.toUpperCase()})</span>
                <span className="live-tag">LIVE</span>
              </div>
              <div className="card-body-heat">
                <div className="temp-huge-wrap">
                  <span className="temp-number">{selectedLocality.temp}</span>
                  <span className="temp-unit">°C</span>
                </div>
                <div className="heat-meta-stack">
                  <span className="temp-status-alert">Extremely high thermal conditions</span>
                  <div className="temp-feels-line">
                    <span>Feels like <strong>{selectedLocality.feelsLike}°C</strong></span>
                    <span className="temp-diff-up">↑ +2.4°C</span>
                  </div>
                </div>
              </div>
              <div className="heat-bar-visual">
                <div className="heat-bar-fill" style={{ width: `${(selectedLocality.temp / 45) * 100}%` }}></div>
              </div>
            </div>

            {/* CARD 2: AI THERMAL EQUITY SCORE */}
            <div className="metric-card equity-score-card glass-panel">
              <div className="card-header">
                <span className="card-label">AI THERMAL EQUITY SCORE</span>
                <span className="info-icon" title="Combines Heat Risk + Vulnerability">ⓘ</span>
              </div>
              <div className="equity-card-body">
                <div className="gauge-container">
                  <svg width="74" height="74" viewBox="0 0 100 100">
                    <circle cx="50" cy="50" r="40" fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="10" />
                    <circle
                      cx="50"
                      cy="50"
                      r="40"
                      fill="none"
                      stroke="url(#equity-grad)"
                      strokeWidth="10"
                      strokeDasharray="251.2"
                      strokeDashoffset={251.2 - (251.2 * selectedLocality.vulnScore) / 100}
                      strokeLinecap="round"
                      transform="rotate(-90 50 50)"
                    />
                    <defs>
                      <linearGradient id="equity-grad" x1="0" y1="0" x2="1" y2="1">
                        <stop offset="0%" stopColor="#ffd15c" />
                        <stop offset="50%" stopColor="#ff8c37" />
                        <stop offset="100%" stopColor="#ff3b5c" />
                      </linearGradient>
                    </defs>
                  </svg>
                  <div className="gauge-center-text">
                    <span className="gauge-val">{selectedLocality.vulnScore}</span>
                    <span className="gauge-sub">/100</span>
                  </div>
                </div>
                <div className="gauge-details">
                  <div className={`risk-headline ${getRiskClass(selectedLocality.riskLevel)}`}>
                    {selectedLocality.riskLevel.toUpperCase()} RISK
                  </div>
                  <p className="gauge-desc">Elevated exposure + vulnerability in {selectedLocality.name}.</p>
                  <div className="risk-scale-legend">
                    <span className="dot low"></span> Low
                    <span className="dot medium"></span> Med
                    <span className="dot high"></span> High
                    <span className="dot critical"></span> Crit
                  </div>
                </div>
              </div>
            </div>

            {/* CARD 3: CITY CLIMATE SUMMARY */}
            <div className="metric-card city-summary-card glass-panel">
              <div className="card-header">
                <span className="card-label">CHENNAI CLIMATE SUMMARY</span>
                <button className="compare-trigger-btn" onClick={() => setShowCompareModal(true)}>
                  ⚖ Compare Areas
                </button>
              </div>
              <div className="city-stats-row">
                <div className="mini-stat-item">
                  <span className="stat-label">Avg City Temp</span>
                  <span className="stat-value">{stats.avg}°C</span>
                </div>
                <div className="mini-stat-item">
                  <span className="stat-label">Max Hotspot</span>
                  <span className="stat-value text-red">{stats.max}°C</span>
                </div>
                <div className="mini-stat-item">
                  <span className="stat-label">High Risk</span>
                  <span className="stat-value text-orange">{stats.criticalCount}/25</span>
                </div>
              </div>
              <div className="quick-insight-banner">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#ff8c37" strokeWidth="2">
                  <circle cx="12" cy="12" r="10"></circle>
                  <line x1="12" y1="8" x2="12" y2="12"></line>
                  <line x1="12" y1="16" x2="12.01" y2="16"></line>
                </svg>
                <span>Central Chennai UHI effect up to <strong>+4.8°C</strong> due to concrete density.</span>
              </div>
            </div>
          </div>

          {/* MIDDLE SECTION: MAIN HEAT MAP + AI PANELS */}
          <div className="middle-dashboard-grid">
            {/* CENTERPIECE MAP VIEW */}
            <div className="map-view-card glass-panel">
              <div className="map-card-header">
                <div className="map-title-group">
                  <span className="map-live-dot"></span>
                  <span className="card-label">LIVE THERMAL RISK MAP — CHENNAI METRO AREA</span>
                </div>
                <div className="map-controls-top">
                  <div className="map-mode-selector">
                    <button className={mapLayer === 'heat' ? 'active' : ''} onClick={() => setMapLayer('heat')}>Heat Layer</button>
                    <button className={mapLayer === 'satellite' ? 'active' : ''} onClick={() => setMapLayer('satellite')}>Vector</button>
                    <button className={mapLayer === 'uhi' ? 'active' : ''} onClick={() => setMapLayer('uhi')}>UHI Zones</button>
                  </div>
                  <button className="expand-map-btn" onClick={() => setShowAiModal(true)}>
                    ⤢ Expand View
                  </button>
                </div>
              </div>

              <div className="map-canvas-container">
                <svg className="map-heat-overlay" viewBox="0 0 100 100" preserveAspectRatio="none">
                  <defs>
                    <radialGradient id="heat-tnagar" cx="52%" cy="52%" r="35%">
                      <stop offset="0%" stopColor="#ff0055" stopOpacity="0.8" />
                      <stop offset="50%" stopColor="#ff6b00" stopOpacity="0.5" />
                      <stop offset="100%" stopColor="#ffb700" stopOpacity="0" />
                    </radialGradient>
                    <radialGradient id="heat-ambattur" cx="24%" cy="22%" r="25%">
                      <stop offset="0%" stopColor="#ff0044" stopOpacity="0.75" />
                      <stop offset="60%" stopColor="#ff8800" stopOpacity="0.4" />
                      <stop offset="100%" stopColor="#ffd000" stopOpacity="0" />
                    </radialGradient>
                    <radialGradient id="heat-velachery" cx="58%" cy="76%" r="30%">
                      <stop offset="0%" stopColor="#ff4400" stopOpacity="0.7" />
                      <stop offset="70%" stopColor="#00f2fe" stopOpacity="0" />
                    </radialGradient>
                    <radialGradient id="heat-coastal" cx="84%" cy="68%" r="40%">
                      <stop offset="0%" stopColor="#00e676" stopOpacity="0.3" />
                      <stop offset="100%" stopColor="#00f2fe" stopOpacity="0" />
                    </radialGradient>
                  </defs>
                  <rect width="100" height="100" fill="#080e1a" />
                  <path d="M0,20 H100 M0,40 H100 M0,60 H100 M0,80 H100 M20,0 V100 M40,0 V100 M60,0 V100 M80,0 V100" stroke="rgba(255,255,255,0.04)" strokeWidth="0.5" />
                  
                  <path d="M12,16 L38,32 L52,52 L58,76 L68,92" stroke="rgba(255, 140, 55, 0.3)" strokeWidth="1.2" fill="none" strokeDasharray="2,1" />
                  <path d="M38,32 L60,42 L78,68 L86,64" stroke="rgba(0, 242, 254, 0.3)" strokeWidth="1.2" fill="none" />
                  <path d="M24,22 L38,32 L52,18 L72,36" stroke="rgba(255, 59, 92, 0.3)" strokeWidth="1.2" fill="none" />

                  {mapLayer === 'heat' && (
                    <>
                      <rect width="100" height="100" fill="url(#heat-tnagar)" />
                      <rect width="100" height="100" fill="url(#heat-ambattur)" />
                      <rect width="100" height="100" fill="url(#heat-velachery)" />
                      <rect width="100" height="100" fill="url(#heat-coastal)" />
                    </>
                  )}
                </svg>

                {/* SPREAD OUT NON-OVERLAPPING MAP PINS */}
                <div className="map-markers-layer" style={{ transform: `scale(${mapZoom})` }}>
                  {CHENNAI_LOCALITIES.map(loc => {
                    const isSelected = loc.id === selectedLocality.id;
                    const showBadge = loc.isMajor || isSelected;

                    return (
                      <div
                        key={loc.id}
                        className={`map-marker-pin ${getRiskClass(loc.riskLevel)} ${isSelected ? 'selected-pin' : ''}`}
                        style={{ left: `${loc.mapX}%`, top: `${loc.mapY}%` }}
                        onClick={() => handleSelectArea(loc)}
                      >
                        {showBadge && (
                          <div className="marker-bubble">
                            <span className="marker-name">{loc.name}</span>
                            <span className="marker-temp">{loc.temp}°C</span>
                          </div>
                        )}
                        <div className="marker-dot" title={`${loc.name}: ${loc.temp}°C (${loc.riskLevel} Risk)`}>
                          <div className="dot-pulse"></div>
                        </div>
                      </div>
                    );
                  })}

                  <div className="user-location-pin" style={{ left: '62%', top: '56%' }}>
                    <div className="you-badge">📍 YOU</div>
                  </div>
                </div>

                {/* FLOATING INSPECTOR CARD PLACED SAFELY INSIDE MAP CANVAS AT TOP RIGHT */}
                <div className="map-floating-inspector glass-panel">
                  <div className="inspector-top">
                    <span className="loc-dot-indicator" style={{ background: selectedLocality.riskLevel === 'Critical' ? '#ff3b5c' : '#ff8c37' }}></span>
                    <strong className="inspector-title">{selectedLocality.name.toUpperCase()}</strong>
                  </div>
                  <div className="inspector-grid">
                    <div className="ins-row"><span>Temp:</span> <strong>{selectedLocality.temp}°C</strong></div>
                    <div className="ins-row"><span>Risk:</span> <span className={`risk-tag ${getRiskClass(selectedLocality.riskLevel)}`}>{selectedLocality.riskLevel}</span></div>
                    <div className="ins-row"><span>Vuln Score:</span> <strong>{selectedLocality.vulnScore}%</strong></div>
                    <div className="ins-row"><span>Pop Density:</span> <strong>{selectedLocality.popDensity}</strong></div>
                    <div className="ins-row"><span>Green Cover:</span> <strong>{selectedLocality.greenSpace}</strong></div>
                  </div>
                  <button className="inspector-action-btn" onClick={() => setShowSafetyModal(true)}>
                    Intervention Protocol →
                  </button>
                </div>

                {/* MAP LEGEND */}
                <div className="map-legend-box glass-panel">
                  <div className="legend-title">RISK CATEGORIES</div>
                  <div className="legend-row"><span className="legend-color critical"></span> Critical (&gt;41°C)</div>
                  <div className="legend-row"><span className="legend-color high"></span> High (38-41°C)</div>
                  <div className="legend-row"><span className="legend-color medium"></span> Med (35-38°C)</div>
                  <div className="legend-row"><span className="legend-color low"></span> Low (&lt;35°C)</div>
                </div>

                <div className="map-zoom-controls">
                  <button onClick={() => setMapZoom(prev => Math.min(prev + 0.2, 1.5))}>+</button>
                  <button onClick={() => setMapZoom(1)}>⊙</button>
                  <button onClick={() => setMapZoom(prev => Math.max(prev - 0.2, 0.8))}>−</button>
                </div>
              </div>
            </div>

            {/* RIGHT SIDE AI PANELS COLUMN */}
            <div className="right-insights-column">
              <div className="insights-card glass-panel">
                <div className="card-header">
                  <span className="card-label">AI CLIMATE INSIGHTS</span>
                  <span className="ai-active-pill">AI ACTIVE</span>
                </div>

                <div className="insights-list">
                  <div className="insight-bullet">
                    <div className="insight-icon-wrap bg-orange">🔥</div>
                    <div className="insight-content">
                      <strong>Extreme Heat Detected</strong>
                      <p>12 zones exceed high-risk 38°C threshold in Chennai.</p>
                    </div>
                  </div>

                  <div className="insight-bullet">
                    <div className="insight-icon-wrap bg-teal">👥</div>
                    <div className="insight-content">
                      <strong>High Vulnerability Exposure</strong>
                      <p>68% vulnerability detected in dense commercial corridors.</p>
                    </div>
                  </div>

                  <div className="insight-bullet">
                    <div className="insight-icon-wrap bg-cyan">🎯</div>
                    <div className="insight-content">
                      <strong>Priority Zone Identified</strong>
                      <p>{selectedLocality.name} requires immediate cooling shelter intervention.</p>
                    </div>
                  </div>
                </div>

                <button className="full-ai-btn" onClick={() => setShowAiModal(true)}>
                  View Full AI Analysis →
                </button>
              </div>

              {/* REAL-TIME ALERT */}
              <div className="realtime-alert-card glass-panel">
                <div className="alert-top-bar">
                  <span className="alert-live-tag">● LIVE</span>
                  <span className="alert-title">REAL-TIME ALERT</span>
                </div>
                <div className="alert-banner">
                  <div className="caution-icon">⚠️</div>
                  <div className="banner-text">
                    <h4>YOU HAVE ENTERED HIGH HEAT ZONE</h4>
                    <p>Thermal levels elevated in your current area.</p>
                  </div>
                </div>

                <div className="alert-metrics-row">
                  <div className="alert-m-item">
                    <span>TEMP</span>
                    <strong>{selectedLocality.temp}°C</strong>
                  </div>
                  <div className="alert-m-item">
                    <span>VULNERABILITY</span>
                    <strong className="text-orange">{selectedLocality.riskLevel.toUpperCase()}</strong>
                  </div>
                  <div className="alert-m-item">
                    <span>SCORE</span>
                    <strong className="text-red">{selectedLocality.vulnScore}/100</strong>
                  </div>
                </div>

                <button className="safety-recom-btn" onClick={() => setShowSafetyModal(true)}>
                  Safety Recommendations →
                </button>
              </div>
            </div>
          </div>

          {/* BOTTOM ANALYTICS ROW */}
          <div className="bottom-dashboard-grid">
            {/* PANEL 1: VULNERABILITY */}
            <div className="analytics-card glass-panel">
              <div className="card-header">
                <span className="card-label">THERMAL EQUITY / VULNERABILITY</span>
                <span className="sub-tag">{selectedLocality.name}</span>
              </div>
              <div className="vulnerability-body">
                <div className="donut-summary-box">
                  <div className="v-donut-ring">
                    <span className="v-perc">{selectedLocality.vulnScore}%</span>
                    <span className="v-lbl">HIGH VULN</span>
                  </div>
                </div>

                <div className="breakdown-factors">
                  <div className="factor-row">
                    <div className="factor-info"><span>Pop Density</span><strong>{selectedLocality.popDensityVal}%</strong></div>
                    <div className="progress-track"><div className="progress-fill fill-purple" style={{ width: `${selectedLocality.popDensityVal}%` }}></div></div>
                  </div>
                  <div className="factor-row">
                    <div className="factor-info"><span>Outdoor Exposure</span><strong>{selectedLocality.outdoorExpVal}%</strong></div>
                    <div className="progress-track"><div className="progress-fill fill-orange" style={{ width: `${selectedLocality.outdoorExpVal}%` }}></div></div>
                  </div>
                  <div className="factor-row">
                    <div className="factor-info"><span>Green Space Deficit</span><strong>{selectedLocality.greenSpaceVal}%</strong></div>
                    <div className="progress-track"><div className="progress-fill fill-cyan" style={{ width: `${selectedLocality.greenSpaceVal}%` }}></div></div>
                  </div>
                </div>
              </div>
            </div>

            {/* PANEL 2: HEAT TREND */}
            <div className="analytics-card glass-panel">
              <div className="card-header">
                <span className="card-label">HEAT TREND ({selectedLocality.name})</span>
                <div className="time-toggle-group">
                  <button className={timeRange === '7' ? 'active' : ''} onClick={() => setTimeRange('7')}>7D</button>
                  <button className={timeRange === '14' ? 'active' : ''} onClick={() => setTimeRange('14')}>14D</button>
                  <button className={timeRange === '30' ? 'active' : ''} onClick={() => setTimeRange('30')}>30D</button>
                </div>
              </div>

              <div className="chart-wrapper">
                <div className="chart-y-axis">
                  <span>45°C</span>
                  <span>40°C</span>
                  <span>35°C</span>
                  <span>30°C</span>
                </div>
                <div className="chart-area">
                  {renderTrendSvg(selectedLocality.trend7Days, '#ff3b5c')}
                  {renderTrendSvg(selectedLocality.trendFeels, '#ff8c37')}
                </div>
              </div>
              <div className="chart-x-axis">
                <span>14 Aug</span><span>15 Aug</span><span>16 Aug</span><span>17 Aug</span><span>18 Aug</span><span>19 Aug</span><span>20 Aug</span>
              </div>
            </div>

            {/* PANEL 3: TOP HIGH RISK AREAS TABLE */}
            <div className="analytics-card glass-panel">
              <div className="card-header">
                <span className="card-label">TOP HIGH RISK AREAS</span>
                <span className="sub-tag">RANKED BY UHI INDEX</span>
              </div>
              <div className="table-wrapper">
                <table className="risk-table">
                  <thead>
                    <tr>
                      <th>RANK</th>
                      <th>AREA</th>
                      <th>TEMP</th>
                      <th>RISK</th>
                    </tr>
                  </thead>
                  <tbody>
                    {CHENNAI_LOCALITIES.slice(0, 5).map((item, idx) => (
                      <tr
                        key={item.id}
                        className={`table-row ${selectedLocality.id === item.id ? 'active-row' : ''}`}
                        onClick={() => handleSelectArea(item)}
                      >
                        <td className="rank-cell">{idx + 1}</td>
                        <td className="area-cell">
                          <strong>{item.name}</strong>
                          <span className="sub-detail">UHI +{item.uhiIndex}°C</span>
                        </td>
                        <td className="temp-cell">{item.temp}°C</td>
                        <td>
                          <span className={`risk-pill ${getRiskClass(item.riskLevel)}`}>{item.riskLevel}</span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {/* FOOTER BAR */}
          <footer className="dashboard-footer-bar">
            <div className="footer-stat"><span className="f-icon">🖥</span> Zones: <strong>156</strong></div>
            <div className="footer-stat"><span className="f-icon">🚨</span> Alerts: <strong className="text-red">4 Active</strong></div>
            <div className="footer-stat"><span className="f-icon">📡</span> Data Feeds: <strong>12 IoT</strong></div>
            <div className="footer-stat"><span className="f-icon">⚡</span> Model Accuracy: <strong className="text-green">94.7%</strong></div>
          </footer>
        </main>
      </div>

      {/* MODALS */}
      {showAiModal && (
        <div className="modal-backdrop" onClick={() => setShowAiModal(false)}>
          <div className="modal-content glass-panel" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h2>🤖 AI Thermal Equity Diagnostics</h2>
              <button className="close-modal-btn" onClick={() => setShowAiModal(false)}>×</button>
            </div>
            <div className="modal-body">
              <p>Predicts a persistent +4.8°C Urban Heat Island anomaly over {selectedLocality.name}.</p>
            </div>
            <div className="modal-footer">
              <button className="btn-primary" onClick={() => setShowAiModal(false)}>Close</button>
            </div>
          </div>
        </div>
      )}

      {showSafetyModal && (
        <div className="modal-backdrop" onClick={() => setShowSafetyModal(false)}>
          <div className="modal-content glass-panel" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h2>🛡️ Emergency Heat Action Protocol</h2>
              <button className="close-modal-btn" onClick={() => setShowSafetyModal(false)}>×</button>
            </div>
            <div className="modal-body">
              <p>Deploy mobile misting vans and cooling shelters near {selectedLocality.name}.</p>
            </div>
            <div className="modal-footer">
              <button className="btn-primary" onClick={() => setShowSafetyModal(false)}>Acknowledge</button>
            </div>
          </div>
        </div>
      )}

      {showCompareModal && (
        <div className="modal-backdrop" onClick={() => setShowCompareModal(false)}>
          <div className="modal-content compare-modal glass-panel" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h2>⚖️ Chennai Locality Thermal Equity Comparison</h2>
              <button className="close-modal-btn" onClick={() => setShowCompareModal(false)}>×</button>
            </div>
            <div className="modal-body">
              <div className="compare-selectors">
                <div className="comp-select-box">
                  <label>Location A:</label>
                  <select value={selectedLocality.id} onChange={e => setSelectedLocality(CHENNAI_LOCALITIES.find(l => l.id === e.target.value))}>
                    {CHENNAI_LOCALITIES.map(l => <option key={l.id} value={l.id}>{l.name}</option>)}
                  </select>
                </div>
                <div className="vs-circle">VS</div>
                <div className="comp-select-box">
                  <label>Location B:</label>
                  <select value={compareLocality.id} onChange={e => setCompareLocality(CHENNAI_LOCALITIES.find(l => l.id === e.target.value))}>
                    {CHENNAI_LOCALITIES.map(l => <option key={l.id} value={l.id}>{l.name}</option>)}
                  </select>
                </div>
              </div>

              <table className="compare-table">
                <thead>
                  <tr>
                    <th>METRIC</th>
                    <th>{selectedLocality.name}</th>
                    <th>{compareLocality.name}</th>
                    <th>DIFF</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>Temperature</td>
                    <td>{selectedLocality.temp}°C</td>
                    <td>{compareLocality.temp}°C</td>
                    <td className={selectedLocality.temp > compareLocality.temp ? 'text-red' : 'text-green'}>
                      {(selectedLocality.temp - compareLocality.temp).toFixed(1)}°C
                    </td>
                  </tr>
                  <tr>
                    <td>Vulnerability Score</td>
                    <td>{selectedLocality.vulnScore}/100</td>
                    <td>{compareLocality.vulnScore}/100</td>
                    <td>{selectedLocality.vulnScore - compareLocality.vulnScore} pts</td>
                  </tr>
                </tbody>
              </table>
            </div>
            <div className="modal-footer">
              <button className="btn-primary" onClick={() => setShowCompareModal(false)}>Done</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
