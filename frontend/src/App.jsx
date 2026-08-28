import { useState, useMemo, useEffect, useCallback } from 'react';
import './App.css';

const API_URL = import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000';

// --- CHENNAI BASE LOCALITIES DATASET ---
const chennaiLocations = [
  {
    id: 'perambur',
    name: 'Perambur',
    airTemp: 41.8,
    lstTemp: 44.6,
    heatIndex: 46.2,
    humidity: '67%',
    popDensity: 'High (24,500 / km²)',
    greenAccess: 'Low (4.2%)',
    vulnerabilityScore: 91,
    risk: 'Critical',
    aiPriority: 'Immediate Intervention',
    x: 28,
    y: 20,
    offset: 'offset-top',
  },
  {
    id: 'royapuram',
    name: 'Royapuram',
    airTemp: 41.5,
    lstTemp: 44.1,
    heatIndex: 45.4,
    humidity: '72%',
    popDensity: 'High (21,200 / km²)',
    greenAccess: 'Low (3.8%)',
    vulnerabilityScore: 89,
    risk: 'Critical',
    aiPriority: 'Rapid Emergency Response',
    x: 76,
    y: 18,
    offset: 'offset-right',
  },
  {
    id: 'tnagar',
    name: 'T. Nagar',
    airTemp: 40.9,
    lstTemp: 43.3,
    heatIndex: 44.7,
    humidity: '64%',
    popDensity: 'Very High (26,000 / km²)',
    greenAccess: 'Low (4.6%)',
    vulnerabilityScore: 84,
    risk: 'High',
    aiPriority: 'Commercial Heat Relief',
    x: 54,
    y: 56,
    offset: 'offset-right',
  },
  {
    id: 'ambattur',
    name: 'Ambattur',
    airTemp: 40.6,
    lstTemp: 42.8,
    heatIndex: 43.9,
    humidity: '61%',
    popDensity: 'High (16,800 / km²)',
    greenAccess: 'Moderate (8.5%)',
    vulnerabilityScore: 82,
    risk: 'High',
    aiPriority: 'Protect Outdoor Workers',
    x: 14,
    y: 36,
    offset: 'offset-left',
  },
  {
    id: 'guindy',
    name: 'Guindy',
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
    y: 84,
    offset: 'offset-top',
  },
  {
    id: 'annanagar',
    name: 'Anna Nagar',
    airTemp: 36.9,
    lstTemp: 38.4,
    heatIndex: 39.1,
    humidity: '58%',
    popDensity: 'Medium (12,400 / km²)',
    greenAccess: 'Moderate (14.2%)',
    vulnerabilityScore: 54,
    risk: 'Medium',
    aiPriority: 'Monitor Closely',
    x: 38,
    y: 44,
    offset: 'offset-top',
  },
  {
    id: 'adyar',
    name: 'Adyar',
    airTemp: 34.7,
    lstTemp: 35.9,
    heatIndex: 36.8,
    humidity: '78%',
    popDensity: 'Medium (9,800 / km²)',
    greenAccess: 'High (26.4%)',
    vulnerabilityScore: 29,
    risk: 'Low',
    aiPriority: 'Green Buffer Model',
    x: 84,
    y: 68,
    offset: 'offset-right',
  },
];

const aiInsightsData = [
  {
    icon: '🔥',
    title: 'Critical Thermal Exposure',
    text: 'Perambur and Royapuram show the highest combined heat and vulnerability risk in North Chennai.',
  },
  {
    icon: '👥',
    title: 'Population Pressure',
    text: 'T. Nagar has elevated exposure due to very high population density and radiant asphalt heat.',
  },
  {
    icon: '🦺',
    title: 'Outdoor Worker Risk',
    text: 'Ambattur requires priority protection measures for industrial outdoor workers during peak daytime.',
  },
  {
    icon: '🌿',
    title: 'Green Space Advantage',
    text: 'Adyar shows lower thermal exposure supported by stronger coastal tree canopy access.',
  },
];

const cityActionsData = [
  {
    id: 'act-1',
    icon: '🌳',
    title: 'Increase Green Cover',
    area: 'Perambur',
    priority: 'Critical',
    impact: 'Reduce surface heat by 2.4°C',
    confidence: '95%',
    actionDetails: 'Deploying municipal native urban tree canopy planting along high-radiance concrete corridors.',
  },
  {
    id: 'act-2',
    icon: '💧',
    title: 'Improve Public Cooling Access',
    area: 'T. Nagar',
    priority: 'High',
    impact: 'Support dense pedestrian zones',
    confidence: '92%',
    actionDetails: 'Activating 15 misting stations and 40 free electrolyte distribution hubs along Ranganathan St.',
  },
  {
    id: 'act-3',
    icon: '🚌',
    title: 'Install Shaded Public Waiting Areas',
    area: 'Ambattur',
    priority: 'High',
    impact: 'Lower commuter heat exposure',
    confidence: '89%',
    actionDetails: 'Retrofitting reflective cool roofs and solar-powered cooling shelters at major bus transit stops.',
  },
  {
    id: 'act-4',
    icon: '🏥',
    title: 'Activate Community Heat Response',
    area: 'Royapuram',
    priority: 'Critical',
    impact: 'Protect vulnerable elderly groups',
    confidence: '94%',
    actionDetails: 'Dispatching mobile medical heat-health monitoring vans and establishing climate refuge shelters.',
  },
];

const reportsData = [
  {
    id: 'rep-1',
    icon: '◫',
    title: 'Weekly Heat Risk Report',
    text: 'Seven-day satellite land surface temperature shift analysis and hotspot tracking.',
  },
  {
    id: 'rep-2',
    icon: '◩',
    title: 'Thermal Equity Summary',
    text: 'Correlates heat intensity with community vulnerability scores and cooling access gaps.',
  },
  {
    id: 'rep-3',
    icon: '▤',
    title: 'Community Vulnerability Assessment',
    text: 'Multidimensional Census model for density, occupational exposure, and canopy access.',
  },
  {
    id: 'rep-4',
    icon: '▥',
    title: 'Priority Intervention Report',
    text: 'AI-generated intervention roadmap for municipal tree planting and misting dispatches.',
  },
];

// --- REUSABLE MODAL COMPONENT ---
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
          <button className="modal-close" type="button" onClick={onClose}>
            ✕
          </button>
        </div>
        <div className="modal-body">{children}</div>
      </div>
    </div>
  );
}

export default function App() {
  // Navigation & UI States
  const [activeNav, setActiveNav] = useState('dashboard');
  const [dashboardData, setDashboardData] = useState(null);
  const [backendLoading, setBackendLoading] = useState(true);
  const [backendError, setBackendError] = useState(null);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showSettings, setShowSettings] = useState(false);

  // Modals state
  const [showAlertModal, setShowAlertModal] = useState(false);
  const [showInsightsModal, setShowInsightsModal] = useState(false);
  const [showMapModal, setShowMapModal] = useState(false);
  const [showSafetyModal, setShowSafetyModal] = useState(false);
  const [showReportModal, setShowReportModal] = useState(false);
  const [selectedAction, setSelectedAction] = useState(null);
  const [showDeployModal, setShowDeployModal] = useState(false);
  const [actionSuccessMsg, setActionSuccessMsg] = useState(null);
  const [alertSuccessMsg, setAlertSuccessMsg] = useState(null);

  // Active locality & controls state
  const [selectedLocalityId, setSelectedLocalityId] = useState('perambur');
  const [selectedReport, setSelectedReport] = useState(reportsData[0]);
  const [tempUnit, setTempUnit] = useState('C');
  const [liveSeconds, setLiveSeconds] = useState(0);
  const [localitySearch, setLocalitySearch] = useState('');

  // Notifications State
  const [notifications, setNotifications] = useState([
    {
      id: 1,
      title: 'Critical heat advisory issued for Perambur',
      time: '2 mins ago',
      icon: '🔥',
      unread: true,
    },
    {
      id: 2,
      title: 'AI model recalculated thermal equity score for T. Nagar',
      time: '8 mins ago',
      icon: '✦',
      unread: true,
    },
    {
      id: 3,
      title: 'Weekly Chennai thermal risk report ready',
      time: '15 mins ago',
      icon: '▣',
      unread: false,
    },
  ]);

  // Live timer tick effect
  useEffect(() => {
    const timer = setInterval(() => {
      setLiveSeconds((prev) => (prev + 1) % 60);
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Fetch Dashboard Summary from FastAPI Backend
  const fetchDashboardData = useCallback(async () => {
    console.log('[API] Dashboard request started: fetching /api/dashboard/summary from', `${API_URL}/api/dashboard/summary`);
    try {
      setBackendLoading(true);
      const response = await fetch(`${API_URL}/api/dashboard/summary`);
      console.log('[API] Dashboard response received: status', response.status, response.statusText);

      if (!response.ok) {
        throw new Error(`Backend returned HTTP ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();
      console.log('[API] Dashboard JSON received:', data);

      setDashboardData(data);
      console.log('[API] Dashboard data stored successfully');
      setBackendError(null);
    } catch (error) {
      console.error('[API] Dashboard request failed:', error.message);
      setBackendError(error.message);
    } finally {
      setBackendLoading(false);
    }
  }, []);

  // Initial fetch on mount + auto refresh every 30s
  useEffect(() => {
    fetchDashboardData();
    const interval = setInterval(fetchDashboardData, 30000);
    return () => clearInterval(interval);
  }, [fetchDashboardData]);

  // Derived merged localities data combining base coordinates with live backend telemetry
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

  // Filtered localities for search
  const filteredLocations = useMemo(() => {
    if (!localitySearch.trim()) return displayLocations;
    return displayLocations.filter((loc) =>
      loc.name.toLowerCase().includes(localitySearch.toLowerCase())
    );
  }, [displayLocations, localitySearch]);

  // Temperature unit conversion helper
  const formatTemp = (celsius) => {
    if (typeof celsius !== 'number' || Number.isNaN(celsius)) return '--';
    if (tempUnit === 'F') {
      return `${((celsius * 9) / 5 + 32).toFixed(1)}°F`;
    }
    return `${celsius.toFixed(1)}°C`;
  };

  // Real backend metrics calculations
  const latestReading = dashboardData?.latest_thermal_readings?.[0];
  const activeAlertsCount = dashboardData?.active_alerts ?? 9;
  const totalLocationsCount = dashboardData?.total_monitored_locations ?? displayLocations.length;
  const recentMeasurementsCount = dashboardData?.recent_measurements ?? 13;
  const topRisk = dashboardData?.high_risk_locations?.[0];
  const riskScore = topRisk ? Math.round(topRisk.risk_score) : (selectedLocality?.vulnerabilityScore ?? 90);
  const riskLevel = topRisk ? topRisk.risk_level.toUpperCase() : (selectedLocality?.risk?.toUpperCase() ?? 'HIGH');
  const peakTemp = dashboardData?.latest_thermal_readings?.length
    ? Math.max(...dashboardData.latest_thermal_readings.map((r) => r.temperature))
    : 44.6;

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
    const reportText = `# THERMAL EQUITY AI - MUNICIPAL REPORT\n` +
      `Title: ${rep.title}\n` +
      `Generated: ${new Date().toLocaleString()}\n` +
      `City: Chennai, Tamil Nadu, India\n` +
      `Active Monitored Stations: ${totalLocationsCount}\n` +
      `Total Recorded Measurements: ${recentMeasurementsCount}\n` +
      `Active Thermal Risk Alerts: ${activeAlertsCount}\n\n` +
      `--- EXECUTIVE SUMMARY ---\n` +
      `${rep.text}\n\n` +
      `--- LIVE TELEMETRY SNAPSHOT ---\n` +
      `Peak Land Surface Temperature: ${formatTemp(peakTemp)}\n` +
      `Selected Station: ${selectedLocality.name}\n` +
      `Air Temperature: ${formatTemp(selectedLocality.airTemp)}\n` +
      `Heat Index (Apparent): ${formatTemp(selectedLocality.heatIndex)}\n` +
      `Relative Humidity: ${selectedLocality.humidity}\n` +
      `Vulnerability Score: ${selectedLocality.vulnerabilityScore}/100 (${selectedLocality.risk} Risk)\n` +
      `Priority AI Action: ${selectedLocality.aiPriority}\n\n` +
      `Generated automatically by Thermal Equity AI Platform.`;

    const blob = new Blob([reportText], { type: 'text/markdown;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${rep.title.toLowerCase().replace(/[^a-z0-9]/g, '_')}_brief.md`;
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
      title: `Dispatched: ${selectedAction.title} in ${selectedAction.area}`,
      time: 'Just now',
      icon: selectedAction.icon,
      unread: true,
    };
    setNotifications((prev) => [newNotif, ...prev]);
    setActionSuccessMsg(`Success! ${selectedAction.title} dispatched to ${selectedAction.area}. Mobile units deployed.`);
    setTimeout(() => {
      setActionSuccessMsg(null);
      setShowDeployModal(false);
    }, 2200);
  };

  return (
    <div className="app-master-container">
      {/* Ambient Layered Background */}
      <div className="ambient-bg-layer">
        <div className="bg-thermal-glow" />
        <div className="bg-cyan-glow" />
        <div className="bg-city-grid" />
      </div>

      {/* 1. PREMIUM LEFT SIDEBAR */}
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
            <span><span className="nav-icon">⌘</span> Dashboard</span>
          </button>
          <button
            type="button"
            className={`nav-btn ${activeNav === 'map' ? 'active' : ''}`}
            onClick={() => handleNavClick('map', 'section-map')}
          >
            <span><span className="nav-icon">◉</span> Thermal Map</span>
          </button>
          <button
            type="button"
            className={`nav-btn ${activeNav === 'analytics' ? 'active' : ''}`}
            onClick={() => handleNavClick('analytics', 'section-analytics')}
          >
            <span><span className="nav-icon">∿</span> Heat Analytics</span>
          </button>
          <button
            type="button"
            className={`nav-btn ${activeNav === 'vulnerability' ? 'active' : ''}`}
            onClick={() => handleNavClick('vulnerability', 'section-vulnerability')}
          >
            <span><span className="nav-icon">◎</span> Vulnerability</span>
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
            <span><span className="nav-icon">⚠</span> Heat Alerts</span>
            <span className="badge-alert">{activeAlertsCount}</span>
          </button>
          <button
            type="button"
            className={`nav-btn ${activeNav === 'insights' ? 'active' : ''}`}
            onClick={() => handleNavClick('insights', 'section-insights')}
          >
            <span><span className="nav-icon">✦</span> AI Insights</span>
          </button>
          <button
            type="button"
            className={`nav-btn ${activeNav === 'recommendations' ? 'active' : ''}`}
            onClick={() => handleNavClick('recommendations', 'section-actions')}
          >
            <span><span className="nav-icon">➜</span> Recommendations</span>
          </button>
          <button
            type="button"
            className={`nav-btn ${activeNav === 'reports' ? 'active' : ''}`}
            onClick={() => handleNavClick('reports', 'section-reports')}
          >
            <span><span className="nav-icon">▣</span> Reports</span>
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
            title="Settings"
          >
            ⚙
          </button>
        </div>
      </aside>

      {/* MAIN LAYOUT WRAPPER */}
      <div className="main-layout-wrapper">
        {/* 2. TOP HEADER */}
        <header className="top-header-bar">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <button
              type="button"
              className="mobile-toggle-btn"
              onClick={() => setMobileSidebarOpen(!mobileSidebarOpen)}
              title="Toggle Menu"
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
              <span>📍</span> MONITORING AREA: <strong>Chennai, India</strong>
            </div>

            {/* Live Backend Connection Indicator */}
            <div
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.4rem',
                background: backendError ? 'rgba(239, 68, 68, 0.15)' : 'rgba(16, 185, 129, 0.12)',
                border: `1px solid ${backendError ? 'var(--border-critical)' : 'rgba(16, 185, 129, 0.35)'}`,
                padding: '0.35rem 0.75rem',
                borderRadius: '8px',
                fontSize: '0.72rem',
                fontWeight: 700,
                color: backendError ? 'var(--color-crimson)' : 'var(--color-teal)',
              }}
            >
              <span
                style={{
                  width: '7px',
                  height: '7px',
                  borderRadius: '50%',
                  background: backendError ? 'var(--color-crimson)' : 'var(--color-teal)',
                  display: 'inline-block',
                }}
              />
              {backendLoading
                ? 'CONNECTING API...'
                : backendError
                ? 'BACKEND OFFLINE (FALLBACK)'
                : 'API CONNECTED'}
            </div>

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
                      style={{ background: 'none', border: 'none', color: 'var(--color-cyan)', fontSize: '0.72rem', cursor: 'pointer' }}
                      onClick={() => setShowNotifications(false)}
                    >
                      Close
                    </button>
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                    {notifications.map((n) => (
                      <div key={n.id} style={{ background: 'rgba(0,0,0,0.4)', padding: '0.6rem', borderRadius: '8px', borderLeft: n.unread ? '3px solid var(--color-crimson)' : '3px solid #64748B', display: 'flex', gap: '0.6rem' }}>
                        <span>{n.icon}</span>
                        <div>
                          <div style={{ fontSize: '0.75rem', color: '#FFF', fontWeight: n.unread ? 800 : 500 }}>{n.title}</div>
                          <div style={{ fontSize: '0.65rem', color: '#64748B' }}>{n.time}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </header>

        {/* DASHBOARD CONTENT AREA */}
        <main className="dashboard-content-container">

          {/* Error Banner with Retry */}
          {backendError && (
            <div
              style={{
                background: 'rgba(239, 68, 68, 0.15)',
                border: '1px solid var(--border-critical)',
                borderRadius: '10px',
                padding: '0.75rem 1rem',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                fontSize: '0.8rem',
                color: '#FFF',
              }}
            >
              <span>⚠️ <strong>Unable to load live dashboard data:</strong> {backendError}. Operating on cached telemetry.</span>
              <button
                type="button"
                className="btn-secondary"
                onClick={fetchDashboardData}
                style={{ fontSize: '0.72rem', padding: '0.3rem 0.75rem' }}
              >
                ↻ Retry Connection
              </button>
            </div>
          )}
          
          {/* 3. LIVE THERMAL MONITORING STATUS BAR */}
          <div className="live-status-bar">
            <div className="ls-left">
              <div className="live-pulse-ring">
                <span className="pulse-red-core" />
              </div>
              <span className="ls-title">LIVE THERMAL MONITORING</span>
              <span className="ls-desc">
                {backendLoading
                  ? 'Loading dashboard data from FastAPI backend...'
                  : dashboardData
                  ? `FastAPI Telemetry Stream Active: ${recentMeasurementsCount} readings collected across ${totalLocationsCount} Chennai monitoring zones.`
                  : 'AI system is analyzing urban heat conditions and vulnerability patterns across Chennai.'}
              </span>
            </div>
            <div className="ls-updated" style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
              <span>
                LAST UPDATED: {latestReading ? new Date(latestReading.recorded_at).toLocaleTimeString() : 'Just now'} (:{liveSeconds < 10 ? `0${liveSeconds}` : liveSeconds}s)
              </span>
              <button
                type="button"
                className="btn-secondary"
                style={{ padding: '0.2rem 0.5rem', fontSize: '0.65rem' }}
                onClick={fetchDashboardData}
                title="Sync with FastAPI backend"
              >
                ↻ Refresh
              </button>
            </div>
          </div>

          {/* 4 & 5. TOP METRICS ROW (CURRENT HEAT & AI EQUITY SCORE) */}
          <div className="metrics-top-row" id="section-top-metrics">
            
            {/* CURRENT HEAT CARD */}
            <div className="metric-card-frame heat-focus">
              <div className="heat-shimmer-bg" />
              <div className="card-top-header">
                <span className="card-label">CURRENT HEAT</span>
                <span style={{ fontSize: '0.7rem', color: 'var(--color-crimson)', fontWeight: 800 }}>🔥 HIGH THERMAL ADVISORY</span>
              </div>
              <div className="heat-big-val">
                {formatTemp(latestReading ? latestReading.temperature : selectedLocality.airTemp)}
              </div>
              <div style={{ fontSize: '0.78rem', color: '#FFF', fontWeight: 700 }}>
                {latestReading
                  ? `Live measurement for ${latestReading.location_name || selectedLocality.name} (${latestReading.location_area || 'Chennai'})`
                  : `High thermal conditions detected in ${selectedLocality.name}`}
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
                  <svg width="72" height="72" viewBox="0 0 80 80">
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
                  <div style={{ fontFamily: 'var(--font-title)', fontSize: '1.4rem', fontWeight: 900, color: '#FFF' }}>
                    {riskScore} <span style={{ fontSize: '0.8rem', color: '#94A3B8' }}>/ 100</span>
                  </div>
                  <div style={{ fontSize: '0.72rem', color: '#CBD5E1', marginTop: '0.1rem' }}>
                    Heat exposure & vulnerability significantly elevated
                  </div>
                </div>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.65rem', color: '#64748B', fontWeight: 800, textTransform: 'uppercase', marginTop: '0.2rem' }}>
                <span>LOW</span><span>MEDIUM</span><span>HIGH</span><span style={{ color: 'var(--color-crimson)' }}>CRITICAL</span>
              </div>
            </div>

            {/* QUICK STAT: MONITORED STATIONS & PEAK TEMP */}
            <div className="metric-card-frame">
              <div className="card-top-header">
                <span className="card-label">PEAK LAND SURFACE TEMP</span>
              </div>
              <div style={{ fontFamily: 'var(--font-title)', fontSize: '2.1rem', fontWeight: 900, color: 'var(--color-cyan)', margin: '0.3rem 0' }}>
                {formatTemp(peakTemp)}
              </div>
              <div style={{ fontSize: '0.75rem', color: '#94A3B8' }}>
                {dashboardData
                  ? `Telemetry active across ${totalLocationsCount} stations in Chennai.`
                  : 'Highest radiant asphalt temperature recorded in industrial corridors.'}
              </div>
            </div>

            {/* QUICK STAT: RECENT MEASUREMENTS & ALERTS */}
            <div className="metric-card-frame">
              <div className="card-top-header">
                <span className="card-label">TELEMETRY & ALERTS</span>
              </div>
              <div style={{ fontFamily: 'var(--font-title)', fontSize: '2.1rem', fontWeight: 900, color: '#F59E0B', margin: '0.3rem 0' }}>
                {recentMeasurementsCount} Readings
              </div>
              <div style={{ fontSize: '0.75rem', color: '#94A3B8' }}>
                {activeAlertsCount} active heat advisory alerts flagged by risk calculation engine.
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
                <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                  <input
                    type="text"
                    placeholder="Search locality..."
                    value={localitySearch}
                    onChange={(e) => setLocalitySearch(e.target.value)}
                    style={{
                      background: 'rgba(0,0,0,0.4)',
                      border: '1px solid var(--border-subtle)',
                      borderRadius: '6px',
                      padding: '0.35rem 0.6rem',
                      color: '#FFF',
                      fontSize: '0.72rem',
                      width: '130px',
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
                    <span style={{ fontSize: '0.65rem', color: 'var(--color-cyan)', fontWeight: 900, textTransform: 'uppercase' }}>SELECTED LOCALITY INSPECTOR</span>
                    <div style={{ fontFamily: 'var(--font-title)', fontSize: '1.1rem', fontWeight: 900, color: '#FFF' }}>
                      {selectedLocality.name} — <span style={{ color: selectedLocality.risk === 'Critical' ? 'var(--color-crimson)' : 'var(--color-heat-orange)' }}>{selectedLocality.risk.toUpperCase()} RISK</span>
                    </div>
                    <div style={{ fontSize: '0.72rem', color: '#CBD5E1', marginTop: '0.15rem' }}>
                      Air Temp: {formatTemp(selectedLocality.airTemp)} | LST: {formatTemp(selectedLocality.lstTemp)} | Heat Index: {formatTemp(selectedLocality.heatIndex)} | Humidity: {selectedLocality.humidity} | Vulnerability: {selectedLocality.vulnerabilityScore}/100
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
              <div style={{ display: 'flex', gap: '1.5rem', fontSize: '0.72rem', color: '#94A3B8', fontWeight: 700, marginTop: '0.2rem', flexWrap: 'wrap' }}>
                <span style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}><span style={{ width: '10px', height: '10px', borderRadius: '50%', background: 'var(--color-crimson)' }} /> Critical (Perambur, Royapuram)</span>
                <span style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}><span style={{ width: '10px', height: '10px', borderRadius: '50%', background: 'var(--color-heat-orange)' }} /> High (T. Nagar, Ambattur, Guindy)</span>
                <span style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}><span style={{ width: '10px', height: '10px', borderRadius: '50%', background: 'var(--color-amber)' }} /> Medium (Velachery, Anna Nagar)</span>
                <span style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}><span style={{ width: '10px', height: '10px', borderRadius: '50%', background: 'var(--color-teal)' }} /> Low (Adyar)</span>
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

              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                {aiInsightsData.map((ins) => (
                  <div key={ins.title} style={{ background: 'rgba(0,0,0,0.4)', border: '1px solid var(--border-subtle)', borderRadius: '10px', padding: '0.75rem', display: 'flex', gap: '0.65rem' }}>
                    <span style={{ fontSize: '1.25rem' }}>{ins.icon}</span>
                    <div>
                      <div style={{ fontFamily: 'var(--font-title)', fontWeight: 800, fontSize: '0.82rem', color: '#FFF' }}>{ins.title}</div>
                      <div style={{ fontSize: '0.72rem', color: '#94A3B8', marginTop: '0.15rem', lineHeight: 1.3 }}>{ins.text}</div>
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
          <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '1.5rem' }}>
            
            {/* 8. HEAT ANALYTICS */}
            <div className="cyber-card-frame" id="section-analytics">
              <div className="card-header-bar">
                <div className="card-title-wrap">
                  <h3>HEAT ANALYTICS</h3>
                  <p>Surface temperatures are 5.2°C above seasonal baseline</p>
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '0.75rem', background: 'rgba(0,0,0,0.4)', padding: '0.75rem', borderRadius: '10px' }}>
                <div>
                  <span style={{ fontSize: '0.65rem', color: '#64748B', fontWeight: 800 }}>CURRENT TEMP</span>
                  <div style={{ fontFamily: 'var(--font-title)', fontSize: '1.2rem', fontWeight: 900, color: '#FFF' }}>
                    {formatTemp(latestReading ? latestReading.temperature : 41.8)}
                  </div>
                </div>
                <div>
                  <span style={{ fontSize: '0.65rem', color: '#64748B', fontWeight: 800 }}>DAILY PEAK</span>
                  <div style={{ fontFamily: 'var(--font-title)', fontSize: '1.2rem', fontWeight: 900, color: 'var(--color-crimson)' }}>
                    {formatTemp(peakTemp)}
                  </div>
                </div>
                <div>
                  <span style={{ fontSize: '0.65rem', color: '#64748B', fontWeight: 800 }}>HUMIDITY</span>
                  <div style={{ fontFamily: 'var(--font-title)', fontSize: '1.2rem', fontWeight: 900, color: 'var(--color-cyan)' }}>
                    {latestReading ? `${latestReading.humidity}%` : '67%'}
                  </div>
                </div>
                <div>
                  <span style={{ fontSize: '0.65rem', color: '#64748B', fontWeight: 800 }}>MEASUREMENTS</span>
                  <div style={{ fontFamily: 'var(--font-title)', fontSize: '1.2rem', fontWeight: 900, color: 'var(--color-heat-orange)' }}>
                    {recentMeasurementsCount}
                  </div>
                </div>
              </div>

              {/* Animated SVG Line Chart */}
              <div className="chart-container-box">
                <svg width="100%" height="100%" viewBox="0 0 500 130" preserveAspectRatio="none">
                  <defs>
                    <linearGradient id="chartHeatGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#FF5500" stopOpacity="0.4" />
                      <stop offset="100%" stopColor="#FF5500" stopOpacity="0" />
                    </linearGradient>
                  </defs>
                  <path
                    d="M 10,95 Q 75,70 140,42 T 270,10 T 400,28 T 490,65 L 490,125 L 10,125 Z"
                    fill="url(#chartHeatGrad)"
                  />
                  <path
                    d="M 10,95 Q 75,70 140,42 T 270,10 T 400,28 T 490,65"
                    fill="none"
                    stroke="#FF5500"
                    strokeWidth="3.5"
                  />
                  <circle cx="270" cy="10" r="5" fill="#00F2FE" stroke="#FFF" strokeWidth="2" />
                </svg>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.68rem', color: '#64748B', fontFamily: 'var(--font-title)', fontWeight: 700, marginTop: '0.2rem' }}>
                  <span>06:00</span><span>09:00</span><span>12:00</span><span>15:00</span><span>18:00</span><span>21:00</span>
                </div>
              </div>
            </div>

            {/* 9. VULNERABILITY ANALYSIS ("Who is Most Vulnerable?") */}
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
                    <span>Population Density</span>
                    <span>82%</span>
                  </div>
                  <div className="vf-bar-bg"><div className="vf-bar-fill" style={{ width: '82%' }} /></div>
                </div>

                <div className="vf-item">
                  <div className="vf-header">
                    <span>Outdoor Worker Exposure</span>
                    <span>74%</span>
                  </div>
                  <div className="vf-bar-bg"><div className="vf-bar-fill" style={{ width: '74%', background: 'var(--gradient-heat-orange)' }} /></div>
                </div>

                <div className="vf-item">
                  <div className="vf-header">
                    <span>Green Space Access Deficit</span>
                    <span>31%</span>
                  </div>
                  <div className="vf-bar-bg"><div className="vf-bar-fill" style={{ width: '31%', background: 'var(--color-amber)' }} /></div>
                </div>

                <div className="vf-item">
                  <div className="vf-header">
                    <span>Elderly Population Exposure</span>
                    <span>71%</span>
                  </div>
                  <div className="vf-bar-bg"><div className="vf-bar-fill" style={{ width: '71%' }} /></div>
                </div>
              </div>

              <div style={{ fontSize: '0.72rem', color: '#94A3B8', marginTop: '0.5rem', fontStyle: 'italic', lineHeight: 1.3 }}>
                "The AI combines environmental exposure and social vulnerability indicators to identify communities experiencing disproportionate heat risk."
              </div>
            </div>

          </div>

          {/* 10. THERMAL INEQUALITY GAP (PROJECT CORE FEATURE) */}
          <div className="cyber-card-frame" id="section-gap" style={{ borderColor: 'var(--border-cyber)' }}>
            <div className="card-header-bar">
              <div className="card-title-wrap">
                <h3 style={{ fontSize: '1.1rem' }}>Thermal Inequality Gap</h3>
                <p>Proving why Chennai communities experience heat disproportionately</p>
              </div>
              <span className="modal-tag">CORE DEMO FEATURE</span>
            </div>

            <div className="inequality-comparison-grid">
              <div className="inequality-side-box high-exposure">
                <div style={{ fontFamily: 'var(--font-title)', fontWeight: 900, color: 'var(--color-crimson)', fontSize: '0.9rem' }}>
                  HIGH-DENSITY + LOW GREEN COVER
                </div>
                <div style={{ fontSize: '0.75rem', color: '#CBD5E1' }}>Focus Areas: <strong>Perambur, Royapuram, T. Nagar</strong></div>
                <div style={{ fontFamily: 'var(--font-title)', fontSize: '1.5rem', fontWeight: 900, color: '#FFF', marginTop: '0.2rem' }}>
                  Heat Difference: <span style={{ color: 'var(--color-crimson)' }}>+6.4°C</span>
                </div>
                <div style={{ fontSize: '0.72rem', color: '#94A3B8' }}>
                  Sustained thermal storage in paved concrete surfaces with low canopy cooling.
                </div>
              </div>

              <div className="inequality-side-box protected">
                <div style={{ fontFamily: 'var(--font-title)', fontWeight: 900, color: 'var(--color-teal)', fontSize: '0.9rem' }}>
                  HIGHER GREEN COVER + BETTER PROTECTION
                </div>
                <div style={{ fontSize: '0.75rem', color: '#CBD5E1' }}>Focus Areas: <strong>Adyar, Anna Nagar</strong></div>
                <div style={{ fontFamily: 'var(--font-title)', fontSize: '1.5rem', fontWeight: 900, color: '#FFF', marginTop: '0.2rem' }}>
                  Vulnerability Difference: <span style={{ color: 'var(--color-teal)' }}>-39%</span>
                </div>
                <div style={{ fontSize: '0.72rem', color: '#94A3B8' }}>
                  Strong tree canopy & shaded access buffering urban surface temperature accumulation.
                </div>
              </div>
            </div>

            {/* Visual Data Flow */}
            <div className="flow-diagram-strip">
              <span>HEAT</span> ➜ <span>EXPOSURE</span> ➜ <span>VULNERABILITY</span> ➜ <span>INEQUALITY</span> ➜ <span>AI ANALYSIS</span> ➜ <span>ACTION</span>
            </div>
          </div>

          {/* 11. REAL-TIME HEAT ALERT */}
          <div className="urgent-alert-banner" id="section-alerts">
            <div>
              <span className="modal-tag" style={{ background: 'rgba(239, 68, 68, 0.2)', color: 'var(--color-crimson)', borderColor: 'var(--border-critical)' }}>
                LIVE ALERT — HIGH HEAT EXPOSURE DETECTED
              </span>
              <div style={{ fontFamily: 'var(--font-title)', fontSize: '1.25rem', fontWeight: 900, color: '#FFF', marginTop: '0.2rem' }}>
                Location: {topRisk?.location_name || selectedLocality.name}, Chennai | Temp: {formatTemp(latestReading ? latestReading.temperature : 42.3)} | Risk: {riskLevel} ({riskScore}/100)
              </div>
              <div style={{ fontSize: '0.78rem', color: '#CBD5E1', marginTop: '0.1rem' }}>
                {topRisk?.explanation || 'Temperature and community vulnerability indicators are currently elevated in this monitored area.'}
              </div>
            </div>
            <button
              type="button"
              className="btn-primary"
              style={{ background: 'var(--gradient-btn-alert)', boxShadow: 'var(--shadow-red)' }}
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
              {cityActionsData.map((act) => (
                <div key={act.id || act.title} className="action-card-item">
                  <span style={{ fontSize: '1.5rem' }}>{act.icon}</span>
                  <div style={{ fontFamily: 'var(--font-title)', fontWeight: 900, fontSize: '0.9rem', color: '#FFF' }}>{act.title}</div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--color-cyan)', fontWeight: 800 }}>Priority: {act.area}</div>
                  <div style={{ fontSize: '0.72rem', color: '#94A3B8' }}>{act.impact}</div>
                  <div style={{ fontSize: '0.68rem', color: '#64748B' }}>AI Confidence: {act.confidence}</div>
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

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              {reportsData.map((rep) => (
                <div key={rep.id || rep.title} style={{ background: 'rgba(0,0,0,0.4)', border: '1px solid var(--border-subtle)', borderRadius: '10px', padding: '1rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>
                    <div style={{ fontFamily: 'var(--font-title)', fontWeight: 900, fontSize: '0.88rem', color: '#FFF' }}>{rep.title}</div>
                    <div style={{ fontSize: '0.72rem', color: '#94A3B8', marginTop: '0.15rem' }}>{rep.text}</div>
                  </div>
                  <div style={{ display: 'flex', gap: '0.4rem' }}>
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

      {/* 14. MODAL DIALOG OVERLAYS */}

      {/* Alert Modal */}
      <Modal
        open={showAlertModal}
        onClose={() => {
          setAlertSuccessMsg(null);
          setShowAlertModal(false);
        }}
        title="OPERATIONAL HEAT RELIEF DISPATCH"
        tag="EMERGENCY DISPATCH"
      >
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div style={{ background: 'rgba(239, 68, 68, 0.15)', border: '1px solid var(--border-critical)', padding: '1rem', borderRadius: '10px', color: '#FFF', fontSize: '0.82rem', lineHeight: 1.4 }}>
            🚨 Initiating cooling misting trucks, hydration hubs, and shaded transit zones for <strong>{selectedLocality.name}</strong>.
          </div>
          <div style={{ fontSize: '0.75rem', color: '#CBD5E1' }}>
            Current Ambient Temperature: <strong>{formatTemp(selectedLocality.airTemp)}</strong> | Heat Index: <strong>{formatTemp(selectedLocality.heatIndex)}</strong>
          </div>

          {alertSuccessMsg && (
            <div style={{ background: 'rgba(16, 185, 129, 0.2)', border: '1px solid var(--color-teal)', padding: '0.75rem', borderRadius: '8px', color: 'var(--color-teal)', fontSize: '0.8rem', fontWeight: 700 }}>
              ✓ {alertSuccessMsg}
            </div>
          )}

          <div style={{ display: 'flex', gap: '0.5rem' }}>
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
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div style={{ background: 'rgba(0, 242, 254, 0.1)', border: '1px solid var(--border-cyber)', padding: '1rem', borderRadius: '10px', color: '#FFF', fontSize: '0.82rem', lineHeight: 1.4 }}>
              <div style={{ fontWeight: 800, color: 'var(--color-cyan)', marginBottom: '0.3rem' }}>Priority Target: {selectedAction.area}</div>
              <p>{selectedAction.actionDetails || selectedAction.impact}</p>
              <div style={{ marginTop: '0.5rem', fontSize: '0.72rem', color: '#94A3B8' }}>
                AI Model Confidence: <strong>{selectedAction.confidence}</strong> | Impact: <strong>{selectedAction.impact}</strong>
              </div>
            </div>

            {actionSuccessMsg && (
              <div style={{ background: 'rgba(16, 185, 129, 0.2)', border: '1px solid var(--color-teal)', padding: '0.75rem', borderRadius: '8px', color: 'var(--color-teal)', fontSize: '0.8rem', fontWeight: 700 }}>
                ✓ {actionSuccessMsg}
              </div>
            )}

            <div style={{ display: 'flex', gap: '0.5rem' }}>
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
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <p style={{ fontSize: '0.82rem', color: '#CBD5E1', lineHeight: 1.5 }}>
            The AI platform integrates high-resolution satellite land surface temperature anomaly layers, census demographic density, occupational exposure rates, and urban green-canopy cover indices across all Chennai wards.
          </p>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
            <div style={{ background: 'rgba(0,0,0,0.4)', padding: '0.75rem', borderRadius: '8px', border: '1px solid var(--border-subtle)' }}>
              <div style={{ color: 'var(--color-crimson)', fontWeight: 800, fontSize: '0.8rem' }}>High-Risk Exposure Vector</div>
              <div style={{ fontSize: '0.72rem', color: '#94A3B8', marginTop: '0.2rem' }}>Perambur, Royapuram, and T. Nagar feature heavy asphalt-to-canopy ratios resulting in localized nocturnal heat trapping.</div>
            </div>
            <div style={{ background: 'rgba(0,0,0,0.4)', padding: '0.75rem', borderRadius: '8px', border: '1px solid var(--border-subtle)' }}>
              <div style={{ color: 'var(--color-teal)', fontWeight: 800, fontSize: '0.8rem' }}>Ecological Buffer Vector</div>
              <div style={{ fontSize: '0.72rem', color: '#94A3B8', marginTop: '0.2rem' }}>Adyar and coastal corridors demonstrate up to 6.4°C lower radiant heat retention due to maritime breeze and mature tree canopy.</div>
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
        <div className="chennai-map-canvas" style={{ height: '480px' }}>
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

      {/* Safety Recommendations Modal */}
      <Modal
        open={showSafetyModal}
        onClose={() => setShowSafetyModal(false)}
        title="PUBLIC HEAT SAFETY & HYDRATION GUIDELINES"
        tag="SAFETY ADVISORY"
      >
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem', fontSize: '0.82rem', color: '#E2E8F0' }}>
          <div style={{ background: 'rgba(255, 85, 0, 0.15)', border: '1px solid var(--border-heat-orange)', padding: '0.85rem', borderRadius: '10px' }}>
            🔥 <strong>Extreme Heat Advisory:</strong> Limit outdoor physical exertion between 11:00 AM and 4:00 PM in North & Central Chennai corridors.
          </div>
          <div style={{ background: 'rgba(0, 242, 254, 0.1)', border: '1px solid var(--border-cyber)', padding: '0.85rem', borderRadius: '10px' }}>
            💧 <strong>Hydration Hubs:</strong> 42 free electrolyte & chilled water stations actively dispensing across Perambur, Royapuram, and T. Nagar.
          </div>
          <div style={{ background: 'rgba(139, 92, 246, 0.1)', border: '1px solid rgba(139, 92, 246, 0.4)', padding: '0.85rem', borderRadius: '10px' }}>
            🏥 <strong>First-Aid Cooling Centers:</strong> Dedicated heat stroke response units stationed at all municipal primary health clinics.
          </div>
        </div>
      </Modal>

      {/* Report Modal */}
      <Modal
        open={showReportModal}
        onClose={() => setShowReportModal(false)}
        title={selectedReport?.title?.toUpperCase()}
        tag="POLICY BRIEF"
      >
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <p style={{ fontSize: '0.82rem', color: '#CBD5E1', lineHeight: 1.5 }}>{selectedReport?.text}</p>
          <div style={{ background: 'rgba(0,0,0,0.4)', padding: '0.75rem', borderRadius: '8px', border: '1px solid var(--border-subtle)', fontSize: '0.75rem', color: '#94A3B8' }}>
            <div>Monitoring Period: <strong>Last 7 Days</strong></div>
            <div>Dataset: <strong>Open-Meteo Telemetry & Satellite Land Surface Indices</strong></div>
            <div>Status: <strong>Verified by Chennai Climate Intelligence Engine</strong></div>
          </div>
          <button
            type="button"
            className="btn-primary"
            onClick={() => handleDownloadReport(selectedReport)}
          >
            DOWNLOAD PDF / MARKDOWN BRIEF
          </button>
        </div>
      </Modal>

      {/* Settings Modal */}
      <Modal
        open={showSettings}
        onClose={() => setShowSettings(false)}
        title="SYSTEM CONFIGURATION"
        tag="SETTINGS"
      >
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'rgba(0,0,0,0.4)', padding: '0.85rem', borderRadius: '10px' }}>
            <div>
              <div style={{ fontFamily: 'var(--font-title)', fontWeight: 800, color: '#FFF', fontSize: '0.85rem' }}>Temperature Unit</div>
              <div style={{ fontSize: '0.72rem', color: '#64748B' }}>Celsius (°C) / Fahrenheit (°F)</div>
            </div>
            <button
              type="button"
              className="btn-secondary"
              onClick={() => setTempUnit(tempUnit === 'C' ? 'F' : 'C')}
            >
              °{tempUnit}
            </button>
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'rgba(0,0,0,0.4)', padding: '0.85rem', borderRadius: '10px' }}>
            <div>
              <div style={{ fontFamily: 'var(--font-title)', fontWeight: 800, color: '#FFF', fontSize: '0.85rem' }}>FastAPI Backend Endpoint</div>
              <div style={{ fontSize: '0.72rem', color: '#64748B' }}>{API_URL}</div>
            </div>
            <button
              type="button"
              className="btn-secondary"
              onClick={fetchDashboardData}
            >
              Test Connection
            </button>
          </div>
        </div>
      </Modal>

    </div>
  );
}
