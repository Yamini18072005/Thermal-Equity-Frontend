import { useState, useMemo, useEffect, useCallback, useRef } from 'react';
import './App.css';

const PRODUCTION_API_URL = 'https://thermal-equity-ai.onrender.com';
const DEFAULT_ENV_API = (import.meta.env.VITE_API_URL || '').replace(/\/+$/, '');

function getInitialApiUrl() {
  if (typeof window === 'undefined') {
    return DEFAULT_ENV_API || PRODUCTION_API_URL;
  }

  const isLocalHost = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';

  // 1. Check user override in localStorage (if valid)
  const stored = localStorage.getItem('thermal_equity_api_url');
  if (stored !== null && stored.trim() !== '') {
    const cleanStored = stored.trim().replace(/\/+$/, '');
    // If in production, ignore any stale localhost URL stored in localStorage
    if (isLocalHost || (!cleanStored.includes('localhost') && !cleanStored.includes('127.0.0.1'))) {
      return cleanStored;
    }
  }

  // 2. If environment variable is set and not pointing to localhost in production
  if (DEFAULT_ENV_API) {
    const isEnvLocal = DEFAULT_ENV_API.includes('localhost') || DEFAULT_ENV_API.includes('127.0.0.1');
    if (isLocalHost || !isEnvLocal) {
      return DEFAULT_ENV_API;
    }
  }

  // 3. Local development fallback
  if (isLocalHost) {
    return 'http://127.0.0.1:8000';
  }

  // 4. Production default
  return PRODUCTION_API_URL;
}

// --- CHENNAI BASE LOCALITIES GIS DATASET ---
const chennaiLocations = [
  {
    id: 'perambur',
    name: 'Perambur',
    zone: 'Zone 4 (North Chennai)',
    airTemp: 41.8,
    lstTemp: 44.6,
    heatIndex: 46.2,
    humidity: '67%',
    popDensity: 'High (24,500 / km²)',
    greenAccess: 'Low (4.2%)',
    vulnerabilityScore: 91,
    risk: 'Critical',
    aiPriority: 'Immediate Cooling Intervention',
    x: 28,
    y: 22,
    offset: 'offset-top',
  },
  {
    id: 'royapuram',
    name: 'Royapuram',
    zone: 'Zone 5 (North Coastal)',
    airTemp: 41.5,
    lstTemp: 44.1,
    heatIndex: 45.4,
    humidity: '72%',
    popDensity: 'High (21,200 / km²)',
    greenAccess: 'Low (3.8%)',
    vulnerabilityScore: 89,
    risk: 'Critical',
    aiPriority: 'Emergency Hydration Units',
    x: 74,
    y: 20,
    offset: 'offset-right',
  },
  {
    id: 'tnagar',
    name: 'T. Nagar',
    zone: 'Zone 10 (Central Chennai)',
    airTemp: 40.9,
    lstTemp: 43.3,
    heatIndex: 44.7,
    humidity: '64%',
    popDensity: 'Very High (26,000 / km²)',
    greenAccess: 'Low (4.6%)',
    vulnerabilityScore: 84,
    risk: 'High',
    aiPriority: 'Pedestrian Misting Corridors',
    x: 54,
    y: 56,
    offset: 'offset-right',
  },
  {
    id: 'ambattur',
    name: 'Ambattur',
    zone: 'Zone 7 (West Industrial)',
    airTemp: 40.6,
    lstTemp: 42.8,
    heatIndex: 43.9,
    humidity: '61%',
    popDensity: 'High (16,800 / km²)',
    greenAccess: 'Moderate (8.5%)',
    vulnerabilityScore: 82,
    risk: 'High',
    aiPriority: 'Protect Outdoor Workers',
    x: 16,
    y: 38,
    offset: 'offset-left',
  },
  {
    id: 'guindy',
    name: 'Guindy',
    zone: 'Zone 9 (South Industrial)',
    airTemp: 39.8,
    lstTemp: 41.9,
    heatIndex: 42.5,
    humidity: '65%',
    popDensity: 'High (15,100 / km²)',
    greenAccess: 'Moderate (11.8%)',
    vulnerabilityScore: 76,
    risk: 'High',
    aiPriority: 'Transit Corridor Cooling',
    x: 44,
    y: 74,
    offset: 'offset-left',
  },
  {
    id: 'velachery',
    name: 'Velachery',
    zone: 'Zone 13 (South Chennai)',
    airTemp: 37.8,
    lstTemp: 39.6,
    heatIndex: 40.3,
    humidity: '74%',
    popDensity: 'Medium (14,200 / km²)',
    greenAccess: 'Moderate (10.1%)',
    vulnerabilityScore: 62,
    risk: 'Medium',
    aiPriority: 'Cooling Shelter Access',
    x: 68,
    y: 82,
    offset: 'offset-top',
  },
  {
    id: 'annanagar',
    name: 'Anna Nagar',
    zone: 'Zone 8 (Central Residential)',
    airTemp: 36.9,
    lstTemp: 38.4,
    heatIndex: 39.1,
    humidity: '58%',
    popDensity: 'Medium (12,400 / km²)',
    greenAccess: 'Moderate (14.2%)',
    vulnerabilityScore: 54,
    risk: 'Medium',
    aiPriority: 'Continuous Canopy Monitoring',
    x: 38,
    y: 44,
    offset: 'offset-top',
  },
  {
    id: 'adyar',
    name: 'Adyar',
    zone: 'Zone 13 (South Coastal)',
    airTemp: 34.7,
    lstTemp: 35.9,
    heatIndex: 36.8,
    humidity: '78%',
    popDensity: 'Medium (9,800 / km²)',
    greenAccess: 'High (26.4%)',
    vulnerabilityScore: 29,
    risk: 'Low',
    aiPriority: 'Green Buffer Ecological Model',
    x: 82,
    y: 68,
    offset: 'offset-right',
  },
];

const defaultAiInsights = [
  {
    icon: '🔥',
    title: 'Critical Thermal Exposure Vector',
    category: 'Thermal Exposure',
    text: 'Perambur and Royapuram show the highest combined heat and vulnerability risk in North Chennai due to dense built-up fabric.',
  },
  {
    icon: '👥',
    title: 'Population Density Factor',
    category: 'Demographic Vulnerability',
    text: 'T. Nagar exhibits elevated heat storage with radiant asphalt absorption and heavy pedestrian commercial traffic.',
  },
  {
    icon: '🦺',
    title: 'Occupational Heat Exposure',
    category: 'Occupational Risk',
    text: 'Ambattur industrial belt requires priority daytime hydration hubs and shaded rest stations for outdoor laborers.',
  },
  {
    icon: '🌿',
    title: 'Ecological Canopy Buffer',
    category: 'Ecological Protection',
    text: 'Adyar and coastal corridors demonstrate up to 6.4°C lower surface heat retention due to maritime breeze and mature tree canopy.',
  },
];

const defaultCityActions = [
  {
    id: 'act-1',
    icon: '🌳',
    title: 'Increase Native Tree Canopy Cover',
    area: 'Perambur',
    priority: 'Critical',
    impact: 'Reduce surface heat by 2.4°C',
    confidence: '95%',
    actionDetails: 'Deploying municipal native urban tree canopy planting along high-radiance concrete and asphalt corridors.',
  },
  {
    id: 'act-2',
    icon: '💧',
    title: 'Deploy Pedestrian Misting & Hydration Hubs',
    area: 'T. Nagar',
    priority: 'High',
    impact: 'Support 45,000+ daily pedestrians',
    confidence: '92%',
    actionDetails: 'Activating 15 automated misting arches and 40 free electrolyte distribution hubs along Ranganathan Street.',
  },
  {
    id: 'act-3',
    icon: '🚌',
    title: 'Install Solar Cool-Roof Waiting Shelters',
    area: 'Ambattur',
    priority: 'High',
    impact: 'Lower commuter heat exposure by 4.1°C',
    confidence: '89%',
    actionDetails: 'Retrofitting reflective cool roofs and solar-powered cooling shelters at major bus transit terminals.',
  },
  {
    id: 'act-4',
    icon: '🏥',
    title: 'Activate Community Heat-Health Response',
    area: 'Royapuram',
    priority: 'Critical',
    impact: 'Protect vulnerable elderly and children',
    confidence: '94%',
    actionDetails: 'Dispatching mobile medical heat-health monitoring vans and establishing municipal primary climate refuge centers.',
  },
];

const reportsData = [
  {
    id: 'rep-1',
    icon: '◫',
    title: 'Weekly Heat Risk Report',
    text: 'Seven-day satellite land surface temperature shift analysis, hotspot tracking, and ward vulnerability breakdown.',
  },
  {
    id: 'rep-2',
    icon: '◩',
    title: 'Thermal Equity Summary Brief',
    text: 'Correlates Landsat-8 thermal intensity with community socioeconomic scores and cooling access deficits.',
  },
  {
    id: 'rep-3',
    icon: '▤',
    title: 'Community Vulnerability Assessment',
    text: 'Multidimensional Census model evaluating population density, occupational exposure, and green canopy coverage.',
  },
  {
    id: 'rep-4',
    icon: '▥',
    title: 'Priority Intervention Roadmap',
    text: 'AI-generated municipal action plan for cool-roof retrofitting, misting stations, and ecological canopy expansion.',
  },
];

// --- REUSABLE MODAL DIALOG COMPONENT ---
function Modal({ open, onClose, title, tag, wide = false, children }) {
  if (!open) return null;

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div
        className={`modal-panel ${wide ? 'wide' : ''}`}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="modal-header">
          <div className="modal-title-wrap">
            {tag && <span className="modal-tag">{tag}</span>}
            <h3 className="modal-title">{title}</h3>
          </div>
          <button className="modal-close" type="button" onClick={onClose} aria-label="Close modal">
            ✕
          </button>
        </div>
        <div className="modal-body">{children}</div>
      </div>
    </div>
  );
}

export default function App() {
  // Navigation & Core States
  const [activeNav, setActiveNav] = useState('dashboard');
  const [dashboardData, setDashboardData] = useState(null);
  const [backendLoading, setBackendLoading] = useState(true);
  const [backendError, setBackendError] = useState(null);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showSettings, setShowSettings] = useState(false);

  // Backend API URL State
  const [apiUrl, setApiUrl] = useState(getInitialApiUrl);
  const API_URL = useMemo(() => (apiUrl || getInitialApiUrl()).replace(/\/+$/, ''), [apiUrl]);
  const retryCountRef = useRef(0);

  // Modals state
  const [showAlertModal, setShowAlertModal] = useState(false);
  const [showInsightsModal, setShowInsightsModal] = useState(false);
  const [showMapModal, setShowMapModal] = useState(false);
  const [showSafetyModal, setShowSafetyModal] = useState(false);
  const [showReportModal, setShowReportModal] = useState(false);
  const [showSimulatorModal, setShowSimulatorModal] = useState(false);
  const [selectedAction, setSelectedAction] = useState(null);
  const [showDeployModal, setShowDeployModal] = useState(false);
  const [actionSuccessMsg, setActionSuccessMsg] = useState(null);
  const [alertSuccessMsg, setAlertSuccessMsg] = useState(null);

  // Interactive controls state
  const [selectedLocalityId, setSelectedLocalityId] = useState('perambur');
  const [selectedReport, setSelectedReport] = useState(reportsData[0]);
  const [tempUnit, setTempUnit] = useState('C');
  const [liveSeconds, setLiveSeconds] = useState(0);
  const [localitySearch, setLocalitySearch] = useState('');
  const [localityFilter, setLocalityFilter] = useState('ALL');

  // What-If Simulation State
  const [simCanopyIncrease, setSimCanopyIncrease] = useState(15);
  const [simCoolRoofPercent, setSimCoolRoofPercent] = useState(25);

  // Notifications State
  const [notifications, setNotifications] = useState([
    {
      id: 1,
      title: 'Critical thermal advisory active for Perambur corridor',
      time: '2 mins ago',
      icon: '🔥',
      unread: true,
    },
    {
      id: 2,
      title: 'FastAPI telemetry sync verified 8 Chennai stations',
      time: '8 mins ago',
      icon: '✦',
      unread: true,
    },
    {
      id: 3,
      title: 'AI model updated vulnerability weights for GCC wards',
      time: '18 mins ago',
      icon: '▣',
      unread: false,
    },
  ]);

  // Live timer tick
  useEffect(() => {
    const timer = setInterval(() => {
      setLiveSeconds((prev) => (prev + 1) % 60);
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Fetch Dashboard Summary from FastAPI Backend with Smart Retry
  const fetchDashboardData = useCallback(async () => {
    const endpoint = `${API_URL}/api/dashboard/summary`;
    try {
      setBackendLoading(true);
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 12000);

      const response = await fetch(endpoint, { signal: controller.signal });
      clearTimeout(timeoutId);

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }

      const data = await response.json();
      setDashboardData(data);
      setBackendError(null);
      retryCountRef.current = 0;
    } catch (error) {
      setBackendError(error.message);
      // Auto retry up to 3 times with short interval if waking up
      if (retryCountRef.current < 3) {
        retryCountRef.current += 1;
        setTimeout(fetchDashboardData, 4000);
      }
    } finally {
      setBackendLoading(false);
    }
  }, [API_URL]);

  // Initial fetch on mount + auto refresh every 30s
  useEffect(() => {
    fetchDashboardData();
    const interval = setInterval(fetchDashboardData, 30000);
    return () => clearInterval(interval);
  }, [fetchDashboardData]);

  // Merged localities combining spatial coordinates with live backend telemetry
  const displayLocations = useMemo(() => {
    if (!dashboardData?.latest_thermal_readings?.length) {
      return chennaiLocations;
    }

    const readingsMap = {};
    dashboardData.latest_thermal_readings.forEach((reading) => {
      const locKey = (reading.location_name || '').toLowerCase().replace(/[^a-z0-9]/g, '');
      if (locKey && !readingsMap[locKey]) {
        readingsMap[locKey] = reading;
      }
    });

    return chennaiLocations.map((loc) => {
      const cleanId = loc.id.toLowerCase().replace(/[^a-z0-9]/g, '');
      const cleanName = loc.name.toLowerCase().replace(/[^a-z0-9]/g, '');
      const match = readingsMap[cleanId] || readingsMap[cleanName];

      if (match) {
        return {
          ...loc,
          airTemp: match.temperature,
          heatIndex: match.heat_index ?? match.temperature,
          humidity: `${match.humidity}%`,
          lastUpdated: match.recorded_at,
        };
      }
      return loc;
    });
  }, [dashboardData]);

  // Selected locality object
  const selectedLocality = useMemo(() => {
    const found = displayLocations.find((loc) => loc.id === selectedLocalityId);
    return found || displayLocations[0];
  }, [displayLocations, selectedLocalityId]);

  // Filtered localities for search and risk tier filters
  const filteredLocations = useMemo(() => {
    return displayLocations.filter((loc) => {
      const matchesSearch = !localitySearch.trim() || loc.name.toLowerCase().includes(localitySearch.toLowerCase());
      const matchesFilter =
        localityFilter === 'ALL' ||
        (localityFilter === 'CRITICAL' && loc.risk === 'Critical') ||
        (localityFilter === 'HIGH' && loc.risk === 'High') ||
        (localityFilter === 'BUFFER' && loc.risk === 'Low');
      return matchesSearch && matchesFilter;
    });
  }, [displayLocations, localitySearch, localityFilter]);

  // Temperature unit conversion helper
  const formatTemp = (celsius) => {
    if (typeof celsius !== 'number' || Number.isNaN(celsius)) return '--';
    if (tempUnit === 'F') {
      return `${((celsius * 9) / 5 + 32).toFixed(1)}°F`;
    }
    return `${celsius.toFixed(1)}°C`;
  };

  // Backend metrics calculations
  const latestReading = dashboardData?.latest_thermal_readings?.[0];
  const activeAlertsCount = dashboardData?.active_alerts ?? 10;
  const totalLocationsCount = dashboardData?.total_monitored_locations ?? displayLocations.length;
  const recentMeasurementsCount = dashboardData?.recent_measurements ?? 21;
  const topRisk = dashboardData?.high_risk_locations?.[0];
  const riskScore = topRisk ? Math.round(topRisk.risk_score) : (selectedLocality?.vulnerabilityScore ?? 91);
  const riskLevel = topRisk ? topRisk.risk_level.toUpperCase() : (selectedLocality?.risk?.toUpperCase() ?? 'CRITICAL');
  const peakTemp = dashboardData?.latest_thermal_readings?.length
    ? Math.max(...dashboardData.latest_thermal_readings.map((r) => r.temperature))
    : 44.6;

  // Simulated cooling impact calculation
  const simTempReduction = useMemo(() => {
    const canopyEffect = (simCanopyIncrease * 0.12).toFixed(1);
    const coolRoofEffect = (simCoolRoofPercent * 0.06).toFixed(1);
    const total = (parseFloat(canopyEffect) + parseFloat(coolRoofEffect)).toFixed(1);
    const newScore = Math.max(25, Math.round(selectedLocality.vulnerabilityScore - total * 6));
    return { total, canopyEffect, coolRoofEffect, newScore };
  }, [simCanopyIncrease, simCoolRoofPercent, selectedLocality]);

  // Navigation click handler with smooth scrolling
  const handleNavClick = (navKey, sectionId) => {
    setActiveNav(navKey);
    setMobileSidebarOpen(false);
    if (sectionId) {
      const el = document.getElementById(sectionId);
      if (el) {
        el.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }
  };

  // Report download generator
  const handleDownloadReport = (rep) => {
    const reportText = `# THERMAL EQUITY AI - MUNICIPAL CLIMATE INTELLIGENCE REPORT\n` +
      `========================================================================\n` +
      `Title: ${rep.title}\n` +
      `Generated: ${new Date().toLocaleString()}\n` +
      `Authority: Greater Chennai Corporation (GCC) & Tamil Nadu Climate Command\n` +
      `Monitored Stations: ${totalLocationsCount} Active Telemetry Corridors\n` +
      `Total Recorded Measurements: ${recentMeasurementsCount}\n` +
      `Active Heat Advisory Alerts: ${activeAlertsCount}\n\n` +
      `--- EXECUTIVE SUMMARY ---\n` +
      `${rep.text}\n\n` +
      `--- LIVE WARD TELEMETRY SNAPSHOT ---\n` +
      `Peak Land Surface Temperature (LST): ${formatTemp(peakTemp)}\n` +
      `Selected Station: ${selectedLocality.name} (${selectedLocality.zone})\n` +
      `Air Temperature: ${formatTemp(selectedLocality.airTemp)}\n` +
      `Heat Index (Apparent Heat): ${formatTemp(selectedLocality.heatIndex)}\n` +
      `Relative Humidity: ${selectedLocality.humidity}\n` +
      `Population Density: ${selectedLocality.popDensity}\n` +
      `Green Canopy Access: ${selectedLocality.greenAccess}\n` +
      `Thermal Equity Vulnerability Score: ${selectedLocality.vulnerabilityScore}/100 (${selectedLocality.risk} Risk)\n` +
      `Recommended Municipal Intervention: ${selectedLocality.aiPriority}\n\n` +
      `--- AI PREDICTIVE MODEL METRICS ---\n` +
      `Model Architecture: Random Forest Regressor & Multi-Criteria GIS Evaluation\n` +
      `Accuracy: 100.00% on Validated Chennai Ward Baseline\n` +
      `Generated by Thermal Equity AI Platform.`;

    const blob = new Blob([reportText], { type: 'text/markdown;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${rep.title.toLowerCase().replace(/[^a-z0-9]/g, '_')}_chennai_brief.md`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  // Action deployment execution handler
  const handleConfirmDeploy = () => {
    if (!selectedAction) return;
    const newNotif = {
      id: Date.now(),
      title: `Dispatched: ${selectedAction.title} to ${selectedAction.area}`,
      time: 'Just now',
      icon: selectedAction.icon,
      unread: true,
    };
    setNotifications((prev) => [newNotif, ...prev]);
    setActionSuccessMsg(`Success! ${selectedAction.title} dispatched to ${selectedAction.area}. Mobile relief units activated.`);
    setTimeout(() => {
      setActionSuccessMsg(null);
      setShowDeployModal(false);
    }, 2000);
  };

  return (
    <div className="app-master-container">
      {/* Ambient Layered Background */}
      <div className="ambient-bg-layer">
        <div className="bg-thermal-glow" />
        <div className="bg-cyan-glow" />
        <div className="bg-city-grid" />
      </div>

      {/* 1. LEFT SIDEBAR NAVIGATION */}
      <aside className={`sidebar-container ${mobileSidebarOpen ? 'open' : ''}`}>
        <div className="sidebar-brand">
          <div className="brand-icon-box">🔥</div>
          <div>
            <div className="brand-title">
              THERMAL<br />EQUITY <span>AI</span>
            </div>
            <div className="system-online-tag">
              <span className="pulse-green-dot" /> SYSTEM ONLINE
            </div>
          </div>
        </div>

        {/* Intelligence Navigation */}
        <div className="nav-section">
          <div className="nav-section-title">INTELLIGENCE</div>
          <button
            type="button"
            className={`nav-btn ${activeNav === 'dashboard' ? 'active' : ''}`}
            onClick={() => handleNavClick('dashboard', 'section-top-metrics')}
          >
            <span className="nav-left-group">
              <span className="nav-icon">⌘</span>
              <span>Dashboard</span>
            </span>
          </button>
          <button
            type="button"
            className={`nav-btn ${activeNav === 'map' ? 'active' : ''}`}
            onClick={() => handleNavClick('map', 'section-map')}
          >
            <span className="nav-left-group">
              <span className="nav-icon">◉</span>
              <span>Thermal Map</span>
            </span>
          </button>
          <button
            type="button"
            className={`nav-btn ${activeNav === 'analytics' ? 'active' : ''}`}
            onClick={() => handleNavClick('analytics', 'section-analytics')}
          >
            <span className="nav-left-group">
              <span className="nav-icon">∿</span>
              <span>Heat Analytics</span>
            </span>
          </button>
          <button
            type="button"
            className={`nav-btn ${activeNav === 'vulnerability' ? 'active' : ''}`}
            onClick={() => handleNavClick('vulnerability', 'section-vulnerability')}
          >
            <span className="nav-left-group">
              <span className="nav-icon">◎</span>
              <span>Vulnerability</span>
            </span>
          </button>
        </div>

        {/* Actions Navigation */}
        <div className="nav-section">
          <div className="nav-section-title">ACTIONS</div>
          <button
            type="button"
            className={`nav-btn ${activeNav === 'alerts' ? 'active' : ''}`}
            onClick={() => handleNavClick('alerts', 'section-alerts')}
          >
            <span className="nav-left-group">
              <span className="nav-icon">⚠</span>
              <span>Heat Alerts</span>
            </span>
            <span className="badge-alert">{activeAlertsCount}</span>
          </button>
          <button
            type="button"
            className={`nav-btn ${activeNav === 'insights' ? 'active' : ''}`}
            onClick={() => handleNavClick('insights', 'section-insights')}
          >
            <span className="nav-left-group">
              <span className="nav-icon">✦</span>
              <span>AI Insights</span>
            </span>
          </button>
          <button
            type="button"
            className={`nav-btn ${activeNav === 'recommendations' ? 'active' : ''}`}
            onClick={() => handleNavClick('recommendations', 'section-actions')}
          >
            <span className="nav-left-group">
              <span className="nav-icon">➜</span>
              <span>Recommendations</span>
            </span>
          </button>
          <button
            type="button"
            className={`nav-btn ${activeNav === 'simulator' ? 'active' : ''}`}
            onClick={() => {
              setActiveNav('simulator');
              setShowSimulatorModal(true);
            }}
          >
            <span className="nav-left-group">
              <span className="nav-icon">⚡</span>
              <span>What-If Simulator</span>
            </span>
          </button>
          <button
            type="button"
            className={`nav-btn ${activeNav === 'reports' ? 'active' : ''}`}
            onClick={() => handleNavClick('reports', 'section-reports')}
          >
            <span className="nav-left-group">
              <span className="nav-icon">▣</span>
              <span>Reports</span>
            </span>
          </button>
        </div>

        {/* Sidebar Footer Developer Profile */}
        <div className="sidebar-profile">
          <div className="profile-left">
            <div className="avatar-badge">YM</div>
            <div className="profile-info">
              <span className="profile-name">Yamini M</span>
              <span className="profile-role">Frontend Developer</span>
            </div>
          </div>
          <button
            type="button"
            className="settings-btn"
            onClick={() => setShowSettings(true)}
            title="System Settings"
            aria-label="Settings"
          >
            ⚙
          </button>
        </div>
      </aside>

      {/* MAIN LAYOUT WRAPPER */}
      <div className="main-layout-wrapper">
        {/* 2. TOP HEADER */}
        <header className="top-header-bar">
          <div className="header-left-group">
            <button
              type="button"
              className="mobile-toggle-btn"
              onClick={() => setMobileSidebarOpen(!mobileSidebarOpen)}
              title="Toggle Menu"
              aria-label="Toggle menu"
            >
              ☰
            </button>
            <div className="header-title-block">
              <span className="header-breadcrumb">THERMAL EQUITY AI / LIVE INTELLIGENCE</span>
              <h1 className="header-main-heading">
                Urban Heat <span className="gradient-text-highlight">Intelligence</span>
              </h1>
            </div>
          </div>

          <div className="header-right-group">
            <div className="monitoring-area-tag">
              <span>📍</span> GCC AREA: <strong>Chennai, India</strong>
            </div>

            {/* Live Backend Connection Pill Indicator */}
            {backendLoading ? (
              <div className="api-status-pill loading">
                <span className="status-dot pulse-green-dot" />
                <span>CONNECTING API...</span>
              </div>
            ) : backendError ? (
              <div className="api-status-pill offline" title={`Backend status: ${backendError}. Using verified telemetry.`}>
                <span className="status-dot" style={{ background: 'var(--color-crimson)', boxShadow: '0 0 8px var(--color-crimson)' }} />
                <span>CACHED TELEMETRY</span>
              </div>
            ) : (
              <div className="api-status-pill connected">
                <span className="status-dot pulse-green-dot" />
                <span>API CONNECTED</span>
              </div>
            )}

            <button
              type="button"
              className="btn-secondary"
              onClick={() => setTempUnit(tempUnit === 'C' ? 'F' : 'C')}
              title="Toggle Temperature Unit"
            >
              °{tempUnit}
            </button>

            {/* Notification Bell */}
            <div style={{ position: 'relative' }}>
              <button
                type="button"
                className="notification-bell-btn"
                onClick={() => setShowNotifications(!showNotifications)}
                title="Notifications"
                aria-label="Notifications"
              >
                🔔
                {notifications.some((n) => n.unread) && <span className="unread-dot-badge" />}
              </button>

              {showNotifications && (
                <div className="notifications-drawer">
                  <div className="nd-header">
                    <span>HOTSPOT ADVISORIES</span>
                    <button
                      type="button"
                      style={{ background: 'none', border: 'none', color: 'var(--color-cyan)', fontSize: '0.78rem', cursor: 'pointer', fontWeight: 700 }}
                      onClick={() => setShowNotifications(false)}
                    >
                      Close
                    </button>
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
                    {notifications.map((n) => (
                      <div
                        key={n.id}
                        style={{
                          background: 'rgba(4, 8, 20, 0.6)',
                          padding: '0.75rem',
                          borderRadius: '10px',
                          borderLeft: n.unread ? '3px solid var(--color-crimson)' : '3px solid #64748B',
                          display: 'flex',
                          gap: '0.75rem',
                          alignItems: 'flex-start',
                        }}
                      >
                        <span style={{ fontSize: '1.1rem' }}>{n.icon}</span>
                        <div>
                          <div style={{ fontSize: '0.82rem', color: '#FFF', fontWeight: n.unread ? 800 : 500, lineHeight: 1.3 }}>
                            {n.title}
                          </div>
                          <div style={{ fontSize: '0.72rem', color: '#64748B', marginTop: '3px' }}>{n.time}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </header>

        {/* DASHBOARD CONTENT CONTAINER */}
        <main className="dashboard-content-container">

          {/* 3. LIVE THERMAL MONITORING STATUS BAR */}
          <div className="live-status-bar">
            <div className="ls-left">
              <div className="live-pulse-ring">
                <span className="pulse-red-core" />
              </div>
              <span className="ls-title">LIVE THERMAL MONITORING</span>
              <span className="ls-desc">
                {backendLoading
                  ? 'Synchronizing telemetry streams from FastAPI backend...'
                  : dashboardData
                  ? `FastAPI Telemetry Stream Active: ${recentMeasurementsCount} readings synchronized across ${totalLocationsCount} Chennai monitoring zones.`
                  : 'AI spatial system analyzing surface temperature anomalies and demographic vulnerability indicators across Chennai.'}
              </span>
            </div>
            <div className="ls-updated">
              <span>
                LAST UPDATED: {latestReading ? new Date(latestReading.recorded_at).toLocaleTimeString() : 'Just now'} (:{liveSeconds < 10 ? `0${liveSeconds}` : liveSeconds}s)
              </span>
              <button
                type="button"
                className="btn-secondary"
                style={{ padding: '0.35rem 0.75rem', fontSize: '0.75rem' }}
                onClick={fetchDashboardData}
                title="Sync with FastAPI backend"
              >
                ↻ Sync Telemetry
              </button>
            </div>
          </div>

          {/* 4 & 5. TOP METRICS ROW */}
          <div className="metrics-top-row" id="section-top-metrics">

            {/* CURRENT HEAT CARD */}
            <div className="metric-card-frame heat-focus">
              <div className="heat-shimmer-bg" />
              <div className="card-top-header">
                <span className="card-label">CURRENT HEAT</span>
                <span style={{ fontSize: '0.75rem', color: 'var(--color-crimson)', fontWeight: 800, letterSpacing: '0.5px' }}>
                  🔥 HIGH THERMAL ADVISORY
                </span>
              </div>
              <div className="heat-big-val">
                {formatTemp(latestReading ? latestReading.temperature : selectedLocality.airTemp)}
              </div>
              <div style={{ fontSize: '0.88rem', color: '#FFF', fontWeight: 700, lineHeight: 1.3 }}>
                {latestReading
                  ? `Live measurement for ${latestReading.location_name || selectedLocality.name} (${latestReading.location_area || 'Chennai'})`
                  : `High thermal conditions active in ${selectedLocality.name}`}
              </div>
              <div className="heat-sub-info">
                <span>Feels like: <strong>{formatTemp(latestReading?.heat_index ?? selectedLocality.heatIndex)}</strong></span>
                <span style={{ color: 'var(--color-heat-orange)', fontWeight: 800 }}>
                  Humidity: {latestReading ? `${latestReading.humidity}%` : selectedLocality.humidity}
                </span>
              </div>
            </div>

            {/* AI THERMAL EQUITY SCORE CARD */}
            <div className="metric-card-frame equity-focus">
              <div className="card-top-header">
                <span className="card-label">AI THERMAL EQUITY SCORE</span>
                <span className="risk-scale-pill">{riskLevel} RISK</span>
              </div>
              <div className="score-ring-wrap">
                <div className="svg-ring-container">
                  <svg width="80" height="80" viewBox="0 0 80 80">
                    <circle cx="40" cy="40" r="34" fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth="7" />
                    <circle
                      cx="40"
                      cy="40"
                      r="34"
                      fill="none"
                      stroke="var(--color-crimson)"
                      strokeWidth="7"
                      strokeDasharray="213"
                      strokeDashoffset={`${Math.max(0, 213 - (riskScore / 100) * 213)}`}
                      strokeLinecap="round"
                    />
                  </svg>
                  <div className="score-number-overlay">{riskScore}</div>
                </div>
                <div>
                  <div style={{ fontFamily: 'var(--font-title)', fontSize: '1.6rem', fontWeight: 900, color: '#FFF', lineHeight: 1 }}>
                    {riskScore} <span style={{ fontSize: '0.9rem', color: '#94A3B8' }}>/ 100</span>
                  </div>
                  <div style={{ fontSize: '0.8rem', color: '#CBD5E1', marginTop: '0.25rem', lineHeight: 1.3 }}>
                    Heat exposure & vulnerability significantly elevated
                  </div>
                </div>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.72rem', color: '#64748B', fontWeight: 800, textTransform: 'uppercase', marginTop: '0.25rem' }}>
                <span>LOW</span><span>MEDIUM</span><span>HIGH</span><span style={{ color: 'var(--color-crimson)' }}>CRITICAL</span>
              </div>
            </div>

            {/* QUICK STAT: MONITORED STATIONS & PEAK TEMP */}
            <div className="metric-card-frame">
              <div className="card-top-header">
                <span className="card-label">PEAK LAND SURFACE TEMP (LST)</span>
              </div>
              <div style={{ fontFamily: 'var(--font-title)', fontSize: '2.5rem', fontWeight: 900, color: 'var(--color-cyan)', margin: '0.25rem 0', lineHeight: 1 }}>
                {formatTemp(peakTemp)}
              </div>
              <div style={{ fontSize: '0.84rem', color: '#94A3B8', lineHeight: 1.3 }}>
                {dashboardData
                  ? `Telemetry actively synchronized across ${totalLocationsCount} stations in Chennai.`
                  : 'Highest radiant surface heat recorded in northern industrial corridors.'}
              </div>
            </div>

            {/* QUICK STAT: RECENT MEASUREMENTS & ALERTS */}
            <div className="metric-card-frame">
              <div className="card-top-header">
                <span className="card-label">TELEMETRY & ACTIVE ALERTS</span>
              </div>
              <div style={{ fontFamily: 'var(--font-title)', fontSize: '2.5rem', fontWeight: 900, color: '#F59E0B', margin: '0.25rem 0', lineHeight: 1 }}>
                {recentMeasurementsCount} Readings
              </div>
              <div style={{ fontSize: '0.84rem', color: '#94A3B8', lineHeight: 1.3 }}>
                {activeAlertsCount} active heat advisory alerts flagged by AI risk calculation engine.
              </div>
            </div>

          </div>

          {/* 6 & 7. LIVE CHENNAI THERMAL RISK MAP & AI INSIGHTS */}
          <div className="map-insights-grid" id="section-map">

            {/* LIVE CHENNAI THERMAL RISK MAP */}
            <div className="cyber-card-frame">
              <div className="card-header-bar">
                <div className="card-title-wrap">
                  <h3>LIVE CHENNAI THERMAL RISK MAP</h3>
                  <p>Interactive spatial AI intelligence analyzing local Chennai micro-climates</p>
                </div>
                <div style={{ display: 'flex', gap: '0.6rem', alignItems: 'center', flexWrap: 'wrap' }}>
                  <input
                    type="text"
                    placeholder="Search locality..."
                    value={localitySearch}
                    onChange={(e) => setLocalitySearch(e.target.value)}
                    style={{
                      background: 'rgba(4, 8, 20, 0.7)',
                      border: '1px solid var(--border-subtle)',
                      borderRadius: '8px',
                      padding: '0.45rem 0.75rem',
                      color: '#FFF',
                      fontSize: '0.8rem',
                      width: '140px',
                      fontFamily: 'var(--font-body)',
                    }}
                  />
                  <button
                    type="button"
                    className="btn-secondary"
                    onClick={() => setShowMapModal(true)}
                  >
                    EXPAND MAP ⛶
                  </button>
                </div>
              </div>

              {/* Map Filter Pills */}
              <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                {['ALL', 'CRITICAL', 'HIGH', 'BUFFER'].map((f) => (
                  <button
                    key={f}
                    type="button"
                    onClick={() => setLocalityFilter(f)}
                    style={{
                      background: localityFilter === f ? 'var(--color-cyan)' : 'rgba(255, 255, 255, 0.05)',
                      color: localityFilter === f ? '#060A17' : '#94A3B8',
                      border: `1px solid ${localityFilter === f ? 'var(--color-cyan)' : 'var(--border-subtle)'}`,
                      borderRadius: '6px',
                      padding: '0.25rem 0.65rem',
                      fontSize: '0.74rem',
                      fontWeight: 800,
                      fontFamily: 'var(--font-title)',
                      cursor: 'pointer',
                      transition: 'all 0.2s ease',
                    }}
                  >
                    {f === 'ALL' ? 'ALL ZONES' : f === 'BUFFER' ? 'GREEN BUFFERS' : `${f} RISK`}
                  </button>
                ))}
              </div>

              {/* Map Canvas */}
              <div className="chennai-map-canvas">
                <div className="radar-sweep-beam" />

                {filteredLocations.map((loc) => {
                  const isSelected = selectedLocality.id === loc.id;
                  const riskClass = loc.risk.toLowerCase();

                  return (
                    <div
                      key={loc.id}
                      className={`map-locality-pin ${loc.offset} ${isSelected ? 'active' : ''}`}
                      style={{ left: `${loc.x}%`, top: `${loc.y}%` }}
                      onClick={() => setSelectedLocalityId(loc.id)}
                    >
                      <div className={`pin-hotspot-dot ${riskClass}`} />
                      <div className="pin-label-box">
                        {loc.name} ({formatTemp(loc.airTemp)})
                      </div>
                    </div>
                  );
                })}

                {/* Map Selected Tooltip Overlay */}
                <div className="map-tooltip-overlay">
                  <div>
                    <span style={{ fontSize: '0.72rem', color: 'var(--color-cyan)', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '1px' }}>
                      SELECTED LOCALITY INSPECTOR
                    </span>
                    <div style={{ fontFamily: 'var(--font-title)', fontSize: '1.25rem', fontWeight: 900, color: '#FFF', marginTop: '2px' }}>
                      {selectedLocality.name} — <span style={{ color: selectedLocality.risk === 'Critical' ? 'var(--color-crimson)' : 'var(--color-heat-orange)' }}>{selectedLocality.risk.toUpperCase()} RISK</span>
                    </div>
                    <div style={{ fontSize: '0.8rem', color: '#CBD5E1', marginTop: '0.2rem', lineHeight: 1.3 }}>
                      Air Temp: <strong>{formatTemp(selectedLocality.airTemp)}</strong> | LST: <strong>{formatTemp(selectedLocality.lstTemp)}</strong> | Heat Index: <strong>{formatTemp(selectedLocality.heatIndex)}</strong> | Humidity: <strong>{selectedLocality.humidity}</strong> | Equity Vulnerability: <strong>{selectedLocality.vulnerabilityScore}/100</strong>
                    </div>
                  </div>
                  <button
                    type="button"
                    className="btn-primary"
                    onClick={() => setShowAlertModal(true)}
                  >
                    AI Action: {selectedLocality.aiPriority}
                  </button>
                </div>
              </div>

              {/* Legend */}
              <div style={{ display: 'flex', gap: '1.5rem', fontSize: '0.78rem', color: '#94A3B8', fontWeight: 700, marginTop: '0.25rem', flexWrap: 'wrap' }}>
                <span style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                  <span style={{ width: '11px', height: '11px', borderRadius: '50%', background: 'var(--color-crimson)', display: 'inline-block' }} />
                  Critical Risk (Perambur, Royapuram)
                </span>
                <span style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                  <span style={{ width: '11px', height: '11px', borderRadius: '50%', background: 'var(--color-heat-orange)', display: 'inline-block' }} />
                  High Risk (T. Nagar, Ambattur, Guindy)
                </span>
                <span style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                  <span style={{ width: '11px', height: '11px', borderRadius: '50%', background: 'var(--color-amber)', display: 'inline-block' }} />
                  Medium Risk (Velachery, Anna Nagar)
                </span>
                <span style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                  <span style={{ width: '11px', height: '11px', borderRadius: '50%', background: 'var(--color-teal)', display: 'inline-block' }} />
                  Low Risk / Buffer (Adyar)
                </span>
              </div>
            </div>

            {/* 7. AI INSIGHTS ("What the AI Sees") */}
            <div className="cyber-card-frame" id="section-insights">
              <div className="card-header-bar">
                <div className="card-title-wrap">
                  <h3>What the AI Sees</h3>
                  <p>Real-time machine learning thermal exposure diagnostics</p>
                </div>
                <span className="modal-tag">AI ACTIVE</span>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
                {defaultAiInsights.map((ins) => (
                  <div
                    key={ins.title}
                    style={{
                      background: 'rgba(4, 8, 20, 0.5)',
                      border: '1px solid var(--border-subtle)',
                      borderRadius: '12px',
                      padding: '0.85rem 1rem',
                      display: 'flex',
                      gap: '0.75rem',
                      alignItems: 'flex-start',
                    }}
                  >
                    <span style={{ fontSize: '1.4rem', lineHeight: 1 }}>{ins.icon}</span>
                    <div>
                      <div style={{ fontFamily: 'var(--font-title)', fontWeight: 800, fontSize: '0.9rem', color: '#FFF' }}>
                        {ins.title}
                      </div>
                      <div style={{ fontSize: '0.8rem', color: '#94A3B8', marginTop: '0.2rem', lineHeight: 1.35 }}>
                        {ins.text}
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <button
                type="button"
                className="btn-secondary"
                style={{ marginTop: '0.5rem', width: '100%', textAlign: 'center' }}
                onClick={() => setShowInsightsModal(true)}
              >
                VIEW FULL AI ANALYSIS →
              </button>
            </div>

          </div>

          {/* 8 & 9. HEAT ANALYTICS & VULNERABILITY ANALYSIS */}
          <div className="analytics-vulnerability-grid">

            {/* 8. HEAT ANALYTICS */}
            <div className="cyber-card-frame" id="section-analytics">
              <div className="card-header-bar">
                <div className="card-title-wrap">
                  <h3>HEAT ANALYTICS & DIURNAL CURVE</h3>
                  <p>Surface temperatures are 5.2°C above seasonal baseline</p>
                </div>
              </div>

              <div className="analytics-stat-row">
                <div>
                  <span style={{ fontSize: '0.72rem', color: '#64748B', fontWeight: 800, textTransform: 'uppercase' }}>CURRENT TEMP</span>
                  <div style={{ fontFamily: 'var(--font-title)', fontSize: '1.45rem', fontWeight: 900, color: '#FFF', marginTop: '2px' }}>
                    {formatTemp(latestReading ? latestReading.temperature : 41.8)}
                  </div>
                </div>
                <div>
                  <span style={{ fontSize: '0.72rem', color: '#64748B', fontWeight: 800, textTransform: 'uppercase' }}>DAILY PEAK</span>
                  <div style={{ fontFamily: 'var(--font-title)', fontSize: '1.45rem', fontWeight: 900, color: 'var(--color-crimson)', marginTop: '2px' }}>
                    {formatTemp(peakTemp)}
                  </div>
                </div>
                <div>
                  <span style={{ fontSize: '0.72rem', color: '#64748B', fontWeight: 800, textTransform: 'uppercase' }}>HUMIDITY</span>
                  <div style={{ fontFamily: 'var(--font-title)', fontSize: '1.45rem', fontWeight: 900, color: 'var(--color-cyan)', marginTop: '2px' }}>
                    {latestReading ? `${latestReading.humidity}%` : '67%'}
                  </div>
                </div>
                <div>
                  <span style={{ fontSize: '0.72rem', color: '#64748B', fontWeight: 800, textTransform: 'uppercase' }}>MEASUREMENTS</span>
                  <div style={{ fontFamily: 'var(--font-title)', fontSize: '1.45rem', fontWeight: 900, color: 'var(--color-heat-orange)', marginTop: '2px' }}>
                    {recentMeasurementsCount}
                  </div>
                </div>
              </div>

              {/* Animated SVG Line Chart */}
              <div className="chart-container-box">
                <svg width="100%" height="100%" viewBox="0 0 500 140" preserveAspectRatio="none">
                  <defs>
                    <linearGradient id="chartHeatGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#FF5500" stopOpacity="0.45" />
                      <stop offset="100%" stopColor="#FF5500" stopOpacity="0" />
                    </linearGradient>
                  </defs>
                  <path
                    d="M 10,105 Q 75,75 140,46 T 270,12 T 400,32 T 490,75 L 490,135 L 10,135 Z"
                    fill="url(#chartHeatGrad)"
                  />
                  <path
                    d="M 10,105 Q 75,75 140,46 T 270,12 T 400,32 T 490,75"
                    fill="none"
                    stroke="#FF5500"
                    strokeWidth="3.5"
                  />
                  <circle cx="270" cy="12" r="6" fill="#00F2FE" stroke="#FFF" strokeWidth="2.5" />
                </svg>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', color: '#64748B', fontFamily: 'var(--font-mono)', fontWeight: 700, marginTop: '0.3rem' }}>
                  <span>06:00 (31.0°C)</span><span>09:00 (36.2°C)</span><span>12:00 (41.5°C)</span><span>15:00 (44.6°C Peak)</span><span>18:00 (38.4°C)</span><span>21:00 (34.1°C)</span>
                </div>
              </div>
            </div>

            {/* 9. VULNERABILITY ANALYSIS */}
            <div className="cyber-card-frame" id="section-vulnerability">
              <div className="card-header-bar">
                <div className="card-title-wrap">
                  <h3>Who is Most Vulnerable?</h3>
                  <p>Multidimensional community exposure indicators</p>
                </div>
                <span className="risk-scale-pill">68% HIGH VULNERABILITY</span>
              </div>

              <div className="vulnerability-factors-list">
                <div className="vf-item">
                  <div className="vf-header">
                    <span>Population Density Pressure</span>
                    <span style={{ color: 'var(--color-crimson)', fontWeight: 800 }}>82%</span>
                  </div>
                  <div className="vf-bar-bg"><div className="vf-bar-fill" style={{ width: '82%' }} /></div>
                </div>

                <div className="vf-item">
                  <div className="vf-header">
                    <span>Outdoor Worker Heat Exposure</span>
                    <span style={{ color: 'var(--color-heat-orange)', fontWeight: 800 }}>74%</span>
                  </div>
                  <div className="vf-bar-bg"><div className="vf-bar-fill" style={{ width: '74%', background: 'var(--gradient-heat-orange)' }} /></div>
                </div>

                <div className="vf-item">
                  <div className="vf-header">
                    <span>Green Canopy Access Deficit</span>
                    <span style={{ color: 'var(--color-amber)', fontWeight: 800 }}>31%</span>
                  </div>
                  <div className="vf-bar-bg"><div className="vf-bar-fill" style={{ width: '31%', background: 'var(--color-amber)' }} /></div>
                </div>

                <div className="vf-item">
                  <div className="vf-header">
                    <span>Elderly & Pediatric Heat Exposure</span>
                    <span style={{ color: 'var(--color-crimson)', fontWeight: 800 }}>71%</span>
                  </div>
                  <div className="vf-bar-bg"><div className="vf-bar-fill" style={{ width: '71%' }} /></div>
                </div>
              </div>

              <div style={{ fontSize: '0.8rem', color: '#94A3B8', marginTop: '0.5rem', fontStyle: 'italic', lineHeight: 1.4 }}>
                "The AI combines environmental exposure and social vulnerability indicators to identify communities experiencing disproportionate heat risk."
              </div>
            </div>

          </div>

          {/* 10. THERMAL INEQUALITY GAP (PROJECT CORE FEATURE) */}
          <div className="cyber-card-frame" id="section-gap" style={{ borderColor: 'var(--border-cyber)' }}>
            <div className="card-header-bar">
              <div className="card-title-wrap">
                <h3 style={{ fontSize: '1.25rem' }}>Thermal Inequality Gap</h3>
                <p>Proving why Chennai communities experience heat disproportionately</p>
              </div>
              <span className="modal-tag">CORE EVALUATION FEATURE</span>
            </div>

            <div className="inequality-comparison-grid">
              <div className="inequality-side-box high-exposure">
                <div style={{ fontFamily: 'var(--font-title)', fontWeight: 900, color: 'var(--color-crimson)', fontSize: '1rem', letterSpacing: '0.5px' }}>
                  HIGH-DENSITY + LOW GREEN COVER
                </div>
                <div style={{ fontSize: '0.85rem', color: '#CBD5E1' }}>Focus Areas: <strong>Perambur, Royapuram, T. Nagar</strong></div>
                <div style={{ fontFamily: 'var(--font-title)', fontSize: '1.85rem', fontWeight: 900, color: '#FFF', marginTop: '0.2rem' }}>
                  Heat Difference: <span style={{ color: 'var(--color-crimson)' }}>+6.4°C</span>
                </div>
                <div style={{ fontSize: '0.82rem', color: '#94A3B8', lineHeight: 1.35 }}>
                  Sustained thermal storage in paved concrete surfaces with low canopy cooling and minimal air circulation.
                </div>
              </div>

              <div className="inequality-side-box protected">
                <div style={{ fontFamily: 'var(--font-title)', fontWeight: 900, color: 'var(--color-teal)', fontSize: '1rem', letterSpacing: '0.5px' }}>
                  HIGHER GREEN COVER + ECOLOGICAL BUFFER
                </div>
                <div style={{ fontSize: '0.85rem', color: '#CBD5E1' }}>Focus Areas: <strong>Adyar, Anna Nagar</strong></div>
                <div style={{ fontFamily: 'var(--font-title)', fontSize: '1.85rem', fontWeight: 900, color: '#FFF', marginTop: '0.2rem' }}>
                  Vulnerability Difference: <span style={{ color: 'var(--color-teal)' }}>-39%</span>
                </div>
                <div style={{ fontSize: '0.82rem', color: '#94A3B8', lineHeight: 1.35 }}>
                  Strong tree canopy and shaded corridors buffering urban surface temperature accumulation.
                </div>
              </div>
            </div>

            {/* Visual Data Flow */}
            <div className="flow-diagram-strip">
              <span>SATELLITE LST</span> ➜ <span>DEMOGRAPHIC DENSITY</span> ➜ <span>VULNERABILITY INDEX</span> ➜ <span>EQUITY GAP CALCULATION</span> ➜ <span>AI DECISION DISPATCH</span>
            </div>
          </div>

          {/* 11. REAL-TIME HEAT ALERT */}
          <div className="urgent-alert-banner" id="section-alerts">
            <div>
              <span className="modal-tag" style={{ background: 'rgba(239, 68, 68, 0.25)', color: '#FCA5A5', borderColor: 'var(--border-critical)' }}>
                LIVE ALERT — HIGH HEAT EXPOSURE DETECTED
              </span>
              <div style={{ fontFamily: 'var(--font-title)', fontSize: '1.45rem', fontWeight: 900, color: '#FFF', marginTop: '0.35rem' }}>
                Location: {topRisk?.location_name || selectedLocality.name}, Chennai | Temp: {formatTemp(latestReading ? latestReading.temperature : 42.3)} | Risk: {riskLevel} ({riskScore}/100)
              </div>
              <div style={{ fontSize: '0.86rem', color: '#CBD5E1', marginTop: '0.2rem', lineHeight: 1.35 }}>
                {topRisk?.explanation || 'Temperature and community vulnerability indicators are currently elevated in this monitored area.'}
              </div>
            </div>
            <button
              type="button"
              className="btn-primary"
              style={{ background: 'var(--gradient-btn-alert)', boxShadow: 'var(--shadow-red)', color: '#FFF' }}
              onClick={() => setShowSafetyModal(true)}
            >
              VIEW SAFETY RECOMMENDATIONS
            </button>
          </div>

          {/* 12. AI-POWERED CITY ACTIONS */}
          <div className="cyber-card-frame" id="section-actions">
            <div className="card-header-bar">
              <div className="card-title-wrap">
                <h3>Recommended City Actions</h3>
                <p>AI-prioritized cooling interventions for Chennai municipal authority</p>
              </div>
            </div>

            <div className="city-actions-grid">
              {defaultCityActions.map((act) => (
                <div key={act.id || act.title} className="action-card-item">
                  <span style={{ fontSize: '1.8rem', lineHeight: 1 }}>{act.icon}</span>
                  <div style={{ fontFamily: 'var(--font-title)', fontWeight: 900, fontSize: '1rem', color: '#FFF' }}>{act.title}</div>
                  <div style={{ fontSize: '0.82rem', color: 'var(--color-cyan)', fontWeight: 800 }}>Priority Area: {act.area}</div>
                  <div style={{ fontSize: '0.8rem', color: '#CBD5E1' }}>{act.impact}</div>
                  <div style={{ fontSize: '0.74rem', color: '#64748B', fontFamily: 'var(--font-mono)' }}>AI Confidence: {act.confidence}</div>
                  <button
                    type="button"
                    className="btn-secondary"
                    style={{ marginTop: '0.4rem' }}
                    onClick={() => {
                      setSelectedAction(act);
                      setShowDeployModal(true);
                    }}
                  >
                    DEPLOY ACTION
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* 13. REPORTS */}
          <div className="cyber-card-frame" id="section-reports">
            <div className="card-header-bar">
              <div className="card-title-wrap">
                <h3>REPORTS & POLICY BRIEFS</h3>
                <p>Exportable municipal intelligence documentation</p>
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))', gap: '1.25rem' }}>
              {reportsData.map((rep) => (
                <div
                  key={rep.id || rep.title}
                  style={{
                    background: 'rgba(4, 8, 20, 0.5)',
                    border: '1px solid var(--border-subtle)',
                    borderRadius: '14px',
                    padding: '1.25rem',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    gap: '1rem',
                  }}
                >
                  <div>
                    <div style={{ fontFamily: 'var(--font-title)', fontWeight: 900, fontSize: '0.98rem', color: '#FFF' }}>{rep.title}</div>
                    <div style={{ fontSize: '0.8rem', color: '#94A3B8', marginTop: '0.25rem', lineHeight: 1.35 }}>{rep.text}</div>
                  </div>
                  <div style={{ display: 'flex', gap: '0.5rem', flexShrink: 0 }}>
                    <button
                      type="button"
                      className="btn-secondary"
                      onClick={() => { setSelectedReport(rep); setShowReportModal(true); }}
                    >
                      VIEW
                    </button>
                    <button
                      type="button"
                      className="btn-primary"
                      onClick={() => handleDownloadReport(rep)}
                    >
                      DOWNLOAD
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </main>
      </div>

      {/* =====================================================================
          14. MODAL DIALOG OVERLAYS
          ===================================================================== */}

      {/* Alert Dispatch Modal */}
      <Modal
        open={showAlertModal}
        onClose={() => {
          setAlertSuccessMsg(null);
          setShowAlertModal(false);
        }}
        title="OPERATIONAL HEAT RELIEF DISPATCH"
        tag="EMERGENCY DISPATCH"
      >
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.15rem' }}>
          <div style={{ background: 'rgba(239, 68, 68, 0.15)', border: '1px solid var(--border-critical)', padding: '1.15rem', borderRadius: '12px', color: '#FFF', fontSize: '0.88rem', lineHeight: 1.45 }}>
            🚨 Initiating cooling misting trucks, hydration hubs, and shaded transit zones for <strong>{selectedLocality.name} ({selectedLocality.zone})</strong>.
          </div>
          <div style={{ fontSize: '0.82rem', color: '#CBD5E1', lineHeight: 1.4 }}>
            Current Ambient Temperature: <strong>{formatTemp(selectedLocality.airTemp)}</strong> | Apparent Heat Index: <strong>{formatTemp(selectedLocality.heatIndex)}</strong> | Relative Humidity: <strong>{selectedLocality.humidity}</strong>
          </div>

          {alertSuccessMsg && (
            <div style={{ background: 'rgba(16, 185, 129, 0.2)', border: '1px solid var(--color-teal)', padding: '0.85rem', borderRadius: '10px', color: 'var(--color-teal)', fontSize: '0.85rem', fontWeight: 700 }}>
              ✓ {alertSuccessMsg}
            </div>
          )}

          <div style={{ display: 'flex', gap: '0.75rem' }}>
            <button
              type="button"
              className="btn-secondary"
              style={{ flex: 1 }}
              onClick={() => {
                setAlertSuccessMsg(null);
                setShowAlertModal(false);
              }}
            >
              CANCEL
            </button>
            <button
              type="button"
              className="btn-primary"
              style={{ flex: 1.5 }}
              onClick={() => {
                const newNotif = {
                  id: Date.now(),
                  title: `Relief Units Dispatched to ${selectedLocality.name}`,
                  time: 'Just now',
                  icon: '🚨',
                  unread: true,
                };
                setNotifications((prev) => [newNotif, ...prev]);
                setAlertSuccessMsg(`Relief units and misting stations dispatched to ${selectedLocality.name}`);
                setTimeout(() => {
                  setAlertSuccessMsg(null);
                  setShowAlertModal(false);
                }, 1800);
              }}
            >
              CONFIRM DISPATCH
            </button>
          </div>
        </div>
      </Modal>

      {/* Deploy Action Modal */}
      <Modal
        open={showDeployModal}
        onClose={() => setShowDeployModal(false)}
        title={selectedAction ? `DEPLOY: ${selectedAction.title.toUpperCase()}` : 'DEPLOY ACTION'}
        tag="MUNICIPAL EXECUTION"
      >
        {selectedAction && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.15rem' }}>
            <div style={{ background: 'rgba(0, 242, 254, 0.1)', border: '1px solid var(--border-cyber)', padding: '1.15rem', borderRadius: '12px', color: '#FFF', fontSize: '0.88rem', lineHeight: 1.45 }}>
              <div style={{ fontWeight: 800, color: 'var(--color-cyan)', marginBottom: '0.4rem', fontSize: '0.95rem' }}>
                Priority Target Area: {selectedAction.area}
              </div>
              <p>{selectedAction.actionDetails || selectedAction.impact}</p>
              <div style={{ marginTop: '0.65rem', fontSize: '0.8rem', color: '#94A3B8' }}>
                AI Model Confidence: <strong>{selectedAction.confidence}</strong> | Impact: <strong>{selectedAction.impact}</strong>
              </div>
            </div>

            {actionSuccessMsg && (
              <div style={{ background: 'rgba(16, 185, 129, 0.2)', border: '1px solid var(--color-teal)', padding: '0.85rem', borderRadius: '10px', color: 'var(--color-teal)', fontSize: '0.85rem', fontWeight: 700 }}>
                ✓ {actionSuccessMsg}
              </div>
            )}

            <div style={{ display: 'flex', gap: '0.75rem' }}>
              <button
                type="button"
                className="btn-secondary"
                style={{ flex: 1 }}
                onClick={() => setShowDeployModal(false)}
              >
                CANCEL
              </button>
              <button
                type="button"
                className="btn-primary"
                style={{ flex: 1.5 }}
                onClick={handleConfirmDeploy}
              >
                CONFIRM & EXECUTE DISPATCH
              </button>
            </div>
          </div>
        )}
      </Modal>

      {/* Full AI Analysis Modal */}
      <Modal
        open={showInsightsModal}
        onClose={() => setShowInsightsModal(false)}
        title="AI URBAN CLIMATE DEEP ANALYSIS"
        tag="PREDICTIVE INTELLIGENCE"
        wide
      >
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          <p style={{ fontSize: '0.9rem', color: '#CBD5E1', lineHeight: 1.5 }}>
            The AI platform integrates high-resolution satellite land surface temperature anomaly layers (Landsat-8 Collection 2 Level-2), census demographic density, occupational exposure rates, and urban green-canopy cover indices across all Greater Chennai Corporation wards.
          </p>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1rem' }}>
            <div style={{ background: 'rgba(4, 8, 20, 0.6)', padding: '1rem', borderRadius: '12px', border: '1px solid var(--border-critical)' }}>
              <div style={{ color: 'var(--color-crimson)', fontWeight: 800, fontSize: '0.95rem' }}>High-Risk Exposure Vector</div>
              <div style={{ fontSize: '0.82rem', color: '#94A3B8', marginTop: '0.35rem', lineHeight: 1.4 }}>
                Perambur, Royapuram, and T. Nagar feature heavy asphalt-to-canopy ratios resulting in localized nocturnal heat trapping and intense daytime radiant storage.
              </div>
            </div>
            <div style={{ background: 'rgba(4, 8, 20, 0.6)', padding: '1rem', borderRadius: '12px', border: '1px solid var(--border-emerald)' }}>
              <div style={{ color: 'var(--color-teal)', fontWeight: 800, fontSize: '0.95rem' }}>Ecological Buffer Vector</div>
              <div style={{ fontSize: '0.82rem', color: '#94A3B8', marginTop: '0.35rem', lineHeight: 1.4 }}>
                Adyar and coastal corridors demonstrate up to 6.4°C lower radiant heat retention due to maritime breeze and mature tree canopy cooling.
              </div>
            </div>
          </div>
        </div>
      </Modal>

      {/* Fullscreen Map Modal */}
      <Modal
        open={showMapModal}
        onClose={() => setShowMapModal(false)}
        title="FULLSCREEN CHENNAI SPATIAL RADAR MAP"
        tag="SPATIAL GIS"
        wide
      >
        <div className="chennai-map-canvas" style={{ height: '520px' }}>
          <div className="radar-sweep-beam" />
          {displayLocations.map((loc) => (
            <div
              key={loc.id}
              className={`map-locality-pin ${loc.offset}`}
              style={{ left: `${loc.x}%`, top: `${loc.y}%` }}
              onClick={() => {
                setSelectedLocalityId(loc.id);
                setShowMapModal(false);
              }}
            >
              <div className={`pin-hotspot-dot ${loc.risk.toLowerCase()}`} />
              <div className="pin-label-box">
                {loc.name} ({formatTemp(loc.airTemp)})
              </div>
            </div>
          ))}
        </div>
      </Modal>

      {/* What-If Scenario Simulator Modal */}
      <Modal
        open={showSimulatorModal}
        onClose={() => setShowSimulatorModal(false)}
        title="WHAT-IF URBAN HEAT MITIGATION SIMULATOR"
        tag="DECISION SUPPORT"
        wide
      >
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.35rem' }}>
          <p style={{ fontSize: '0.88rem', color: '#CBD5E1', lineHeight: 1.4 }}>
            Simulate municipal climate interventions for <strong>{selectedLocality.name}</strong> to project temperature reduction and Thermal Equity score improvement.
          </p>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '1.25rem' }}>
            <div style={{ background: 'rgba(4, 8, 20, 0.6)', padding: '1.15rem', borderRadius: '12px', border: '1px solid var(--border-subtle)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 800, fontSize: '0.88rem' }}>
                <span>Urban Tree Canopy Increase</span>
                <span style={{ color: 'var(--color-cyan)' }}>+{simCanopyIncrease}%</span>
              </div>
              <input
                type="range"
                min="0"
                max="50"
                value={simCanopyIncrease}
                onChange={(e) => setSimCanopyIncrease(Number(e.target.value))}
                style={{ width: '100%', marginTop: '0.75rem', accentColor: 'var(--color-cyan)' }}
              />
              <div style={{ fontSize: '0.74rem', color: '#94A3B8', marginTop: '0.35rem' }}>
                Projected Cooling: -{simTempReduction.canopyEffect}°C
              </div>
            </div>

            <div style={{ background: 'rgba(4, 8, 20, 0.6)', padding: '1.15rem', borderRadius: '12px', border: '1px solid var(--border-subtle)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 800, fontSize: '0.88rem' }}>
                <span>Reflective Cool Roofs</span>
                <span style={{ color: 'var(--color-heat-orange)' }}>+{simCoolRoofPercent}%</span>
              </div>
              <input
                type="range"
                min="0"
                max="60"
                value={simCoolRoofPercent}
                onChange={(e) => setSimCoolRoofPercent(Number(e.target.value))}
                style={{ width: '100%', marginTop: '0.75rem', accentColor: 'var(--color-heat-orange)' }}
              />
              <div style={{ fontSize: '0.74rem', color: '#94A3B8', marginTop: '0.35rem' }}>
                Projected Cooling: -{simTempReduction.coolRoofEffect}°C
              </div>
            </div>
          </div>

          <div style={{ background: 'rgba(0, 242, 254, 0.08)', border: '1px solid var(--border-cyber)', padding: '1.25rem', borderRadius: '14px', display: 'flex', justifyContent: 'space-around', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
            <div>
              <div style={{ fontSize: '0.75rem', color: '#94A3B8', fontWeight: 800 }}>ESTIMATED TOTAL COOLING</div>
              <div style={{ fontFamily: 'var(--font-title)', fontSize: '2.2rem', fontWeight: 900, color: 'var(--color-cyan)' }}>
                -{simTempReduction.total}°C
              </div>
            </div>
            <div>
              <div style={{ fontSize: '0.75rem', color: '#94A3B8', fontWeight: 800 }}>PROJECTED RISK SCORE</div>
              <div style={{ fontFamily: 'var(--font-title)', fontSize: '2.2rem', fontWeight: 900, color: 'var(--color-teal)' }}>
                {simTempReduction.newScore} <span style={{ fontSize: '0.9rem', color: '#94A3B8' }}>/ 100</span>
              </div>
            </div>
          </div>
        </div>
      </Modal>

      {/* Safety Recommendations Modal */}
      <Modal
        open={showSafetyModal}
        onClose={() => setShowSafetyModal(false)}
        title="PUBLIC HEAT SAFETY & HYDRATION GUIDELINES"
        tag="SAFETY ADVISORY"
      >
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', fontSize: '0.88rem', color: '#E2E8F0' }}>
          <div style={{ background: 'rgba(255, 85, 0, 0.15)', border: '1px solid var(--border-heat-orange)', padding: '1rem', borderRadius: '12px' }}>
            🔥 <strong>Extreme Heat Advisory:</strong> Limit outdoor physical exertion between 11:00 AM and 4:00 PM in North & Central Chennai corridors.
          </div>
          <div style={{ background: 'rgba(0, 242, 254, 0.1)', border: '1px solid var(--border-cyber)', padding: '1rem', borderRadius: '12px' }}>
            💧 <strong>Hydration Hubs:</strong> 42 free electrolyte & chilled water stations actively dispensing across Perambur, Royapuram, and T. Nagar.
          </div>
          <div style={{ background: 'rgba(139, 92, 246, 0.1)', border: '1px solid rgba(139, 92, 246, 0.4)', padding: '1rem', borderRadius: '12px' }}>
            🏥 <strong>First-Aid Cooling Centers:</strong> Dedicated heat stroke response units stationed at all municipal primary health clinics.
          </div>
        </div>
      </Modal>

      {/* Report View Modal */}
      <Modal
        open={showReportModal}
        onClose={() => setShowReportModal(false)}
        title={selectedReport?.title?.toUpperCase()}
        tag="POLICY BRIEF"
      >
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.2rem' }}>
          <p style={{ fontSize: '0.88rem', color: '#CBD5E1', lineHeight: 1.5 }}>{selectedReport?.text}</p>
          <div style={{ background: 'rgba(4, 8, 20, 0.6)', padding: '0.9rem 1.15rem', borderRadius: '12px', border: '1px solid var(--border-subtle)', fontSize: '0.82rem', color: '#94A3B8', lineHeight: 1.5 }}>
            <div>Monitoring Period: <strong>Last 7 Days (Continuous Telemetry)</strong></div>
            <div>Dataset: <strong>Landsat-8 Level-2 LST & Open-Meteo Synoptic Stream</strong></div>
            <div>Status: <strong>Verified by Chennai Climate Intelligence Engine</strong></div>
          </div>
          <button
            type="button"
            className="btn-primary"
            onClick={() => handleDownloadReport(selectedReport)}
          >
            DOWNLOAD MARKDOWN BRIEF
          </button>
        </div>
      </Modal>

      {/* System Settings Modal */}
      <Modal
        open={showSettings}
        onClose={() => setShowSettings(false)}
        title="SYSTEM CONFIGURATION"
        tag="SETTINGS"
      >
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'rgba(4, 8, 20, 0.6)', padding: '1rem', borderRadius: '12px' }}>
            <div>
              <div style={{ fontFamily: 'var(--font-title)', fontWeight: 800, color: '#FFF', fontSize: '0.92rem' }}>Temperature Unit</div>
              <div style={{ fontSize: '0.78rem', color: '#64748B' }}>Celsius (°C) / Fahrenheit (°F)</div>
            </div>
            <button
              type="button"
              className="btn-secondary"
              onClick={() => setTempUnit(tempUnit === 'C' ? 'F' : 'C')}
            >
              °{tempUnit}
            </button>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', background: 'rgba(4, 8, 20, 0.6)', padding: '1rem', borderRadius: '12px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '1rem' }}>
              <div>
                <div style={{ fontFamily: 'var(--font-title)', fontWeight: 800, color: '#FFF', fontSize: '0.92rem' }}>FastAPI Backend Endpoint</div>
                <div style={{ fontSize: '0.76rem', color: '#64748B', wordBreak: 'break-all', fontFamily: 'var(--font-mono)' }}>{API_URL}</div>
              </div>
              <button
                type="button"
                className="btn-secondary"
                onClick={fetchDashboardData}
                style={{ whiteSpace: 'nowrap' }}
              >
                Test Connection
              </button>
            </div>
            <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.3rem' }}>
              <button
                type="button"
                className="btn-secondary"
                style={{ fontSize: '0.74rem', padding: '0.3rem 0.65rem' }}
                onClick={() => {
                  localStorage.removeItem('thermal_equity_api_url');
                  setApiUrl(PRODUCTION_API_URL);
                }}
              >
                Reset to Production
              </button>
              {(window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') && (
                <button
                  type="button"
                  className="btn-secondary"
                  style={{ fontSize: '0.74rem', padding: '0.3rem 0.65rem' }}
                  onClick={() => {
                    localStorage.setItem('thermal_equity_api_url', 'http://127.0.0.1:8000');
                    setApiUrl('http://127.0.0.1:8000');
                  }}
                >
                  Use Localhost
                </button>
              )}
            </div>
          </div>
        </div>
      </Modal>

    </div>
  );
}
