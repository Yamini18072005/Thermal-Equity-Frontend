import { useState, useMemo, useEffect } from 'react';
import './App.css';

// --- CHENNAI DEMO / SIMULATED DATASET ---
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
    icon: '🌳',
    title: 'Increase Green Cover',
    area: 'Perambur',
    priority: 'Critical',
    impact: 'Reduce surface heat by 2.4°C',
    confidence: '95%',
  },
  {
    icon: '💧',
    title: 'Improve Public Cooling Access',
    area: 'T. Nagar',
    priority: 'High',
    impact: 'Support dense pedestrian zones',
    confidence: '92%',
  },
  {
    icon: '🚌',
    title: 'Install Shaded Public Waiting Areas',
    area: 'Ambattur',
    priority: 'High',
    impact: 'Lower commuter heat exposure',
    confidence: '89%',
  },
  {
    icon: '🏥',
    title: 'Activate Community Heat Response',
    area: 'Royapuram',
    priority: 'Critical',
    impact: 'Protect vulnerable elderly groups',
    confidence: '94%',
  },
];

const reportsData = [
  {
    icon: '◫',
    title: 'Weekly Heat Risk Report',
    text: 'Seven-day satellite land surface temperature shift analysis and hotspot tracking.',
  },
  {
    icon: '◩',
    title: 'Thermal Equity Summary',
    text: 'Correlates heat intensity with community vulnerability scores and cooling access gaps.',
  },
  {
    icon: '▤',
    title: 'Community Vulnerability Assessment',
    text: 'Multidimensional Census model for density, occupational exposure, and canopy access.',
  },
  {
    icon: '▥',
    title: 'Priority Intervention Report',
    text: 'AI-generated intervention roadmap for municipal tree planting and misting dispatches.',
  },
];

const notificationsData = [
  {
    id: 1,
    title: 'Critical heat advisory issued for Perambur (41.8°C)',
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
  // State management
  const [activeNav, setActiveNav] = useState('dashboard');
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showSettings, setShowSettings] = useState(false);

  // Modals state
  const [showAlertModal, setShowAlertModal] = useState(false);
  const [showInsightsModal, setShowInsightsModal] = useState(false);
  const [showMapModal, setShowMapModal] = useState(false);
  const [showSafetyModal, setShowSafetyModal] = useState(false);
  const [showReportModal, setShowReportModal] = useState(false);

  // Active locality & controls state
  const [selectedLocality, setSelectedLocality] = useState(chennaiLocations[0]);
  const [selectedReport, setSelectedReport] = useState(reportsData[0]);
  const [tempUnit, setTempUnit] = useState('C');
  const [liveSeconds, setLiveSeconds] = useState(0);

  // Live timer tick effect
  useEffect(() => {
    const timer = setInterval(() => {
      setLiveSeconds((prev) => (prev + 1) % 60);
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Temperature unit conversion helper
  const formatTemp = (celsius) => {
    if (tempUnit === 'F') {
      return `${((celsius * 9) / 5 + 32).toFixed(1)}°F`;
    }
    return `${celsius.toFixed(1)}°C`;
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
            onClick={() => { setActiveNav('dashboard'); setMobileSidebarOpen(false); }}
          >
            <span><span className="nav-icon">⌘</span> Dashboard</span>
          </button>
          <button
            type="button"
            className={`nav-btn ${activeNav === 'map' ? 'active' : ''}`}
            onClick={() => { setActiveNav('map'); setMobileSidebarOpen(false); }}
          >
            <span><span className="nav-icon">◉</span> Thermal Map</span>
          </button>
          <button
            type="button"
            className={`nav-btn ${activeNav === 'analytics' ? 'active' : ''}`}
            onClick={() => { setActiveNav('analytics'); setMobileSidebarOpen(false); }}
          >
            <span><span className="nav-icon">∿</span> Heat Analytics</span>
          </button>
          <button
            type="button"
            className={`nav-btn ${activeNav === 'vulnerability' ? 'active' : ''}`}
            onClick={() => { setActiveNav('vulnerability'); setMobileSidebarOpen(false); }}
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
            onClick={() => { setActiveNav('alerts'); setMobileSidebarOpen(false); }}
          >
            <span><span className="nav-icon">⚠</span> Heat Alerts</span>
            <span className="badge-alert">3</span>
          </button>
          <button
            type="button"
            className={`nav-btn ${activeNav === 'insights' ? 'active' : ''}`}
            onClick={() => { setActiveNav('insights'); setMobileSidebarOpen(false); }}
          >
            <span><span className="nav-icon">✦</span> AI Insights</span>
          </button>
          <button
            type="button"
            className={`nav-btn ${activeNav === 'recommendations' ? 'active' : ''}`}
            onClick={() => { setActiveNav('recommendations'); setMobileSidebarOpen(false); }}
          >
            <span><span className="nav-icon">➜</span> Recommendations</span>
          </button>
          <button
            type="button"
            className={`nav-btn ${activeNav === 'reports' ? 'active' : ''}`}
            onClick={() => { setActiveNav('reports'); setMobileSidebarOpen(false); }}
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
          <div className="header-title-block">
            <span className="header-breadcrumb">THERMAL EQUITY AI / LIVE INTELLIGENCE</span>
            <h1 className="header-main-heading">
              Urban Heat <span className="gradient-text-highlight">Intelligence</span>
            </h1>
          </div>

          <div className="header-right-group">
            <div className="monitoring-area-tag">
              <span>📍</span> MONITORING AREA: <strong>Chennai, India</strong>
            </div>

            <button
              type="button"
              className="btn-secondary"
              onClick={() => setTempUnit(tempUnit === 'C' ? 'F' : 'C')}
            >
              °{tempUnit}
            </button>

            {/* Notification Bell */}
            <div style={{ position: 'relative' }}>
              <button
                type="button"
                className="notification-bell-btn"
                onClick={() => setShowNotifications(!showNotifications)}
              >
                🔔
                {notificationsData.some((n) => n.unread) && <span className="unread-dot-badge" />}
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
                    {notificationsData.map((n) => (
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
          
          {/* 3. LIVE THERMAL MONITORING STATUS BAR */}
          <div className="live-status-bar">
            <div className="ls-left">
              <div className="live-pulse-ring">
                <span className="pulse-red-core" />
              </div>
              <span className="ls-title">LIVE THERMAL MONITORING</span>
              <span className="ls-desc">AI system is analyzing urban heat conditions and vulnerability patterns across Chennai.</span>
            </div>
            <div className="ls-updated">
              LAST UPDATED: Just now (:{liveSeconds < 10 ? `0${liveSeconds}` : liveSeconds}s)
            </div>
          </div>

          {/* 4 & 5. TOP METRICS ROW (CURRENT HEAT & AI EQUITY SCORE) */}
          <div className="metrics-top-row">
            
            {/* CURRENT HEAT CARD */}
            <div className="metric-card-frame heat-focus">
              <div className="heat-shimmer-bg" />
              <div className="card-top-header">
                <span className="card-label">CURRENT HEAT</span>
                <span style={{ fontSize: '0.7rem', color: 'var(--color-crimson)', fontWeight: 800 }}>🔥 HIGH THERMAL ADVISORY</span>
              </div>
              <div className="heat-big-val">{formatTemp(41.8)}</div>
              <div style={{ fontSize: '0.78rem', color: '#FFF', fontWeight: 700 }}>
                Extremely high thermal conditions detected in Perambur
              </div>
              <div className="heat-sub-info">
                <span>Feels like: <strong>{formatTemp(44.2)}</strong></span>
                <span style={{ color: 'var(--color-heat-orange)', fontWeight: 800 }}>Heat increase: ↑ 2.4°C</span>
              </div>
            </div>

            {/* AI THERMAL EQUITY SCORE CARD */}
            <div className="metric-card-frame equity-focus">
              <div className="card-top-header">
                <span className="card-label">AI THERMAL EQUITY SCORE</span>
                <span className="risk-scale-pill">CRITICAL RISK</span>
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
                      strokeDashoffset="27"
                      strokeLinecap="round"
                    />
                  </svg>
                  <div className="score-number-overlay">87</div>
                </div>
                <div>
                  <div style={{ fontFamily: 'var(--font-title)', fontSize: '1.4rem', fontWeight: 900, color: '#FFF' }}>
                    87 <span style={{ fontSize: '0.8rem', color: '#94A3B8' }}>/ 100</span>
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

            {/* QUICK STAT: LAND SURFACE HEAT */}
            <div className="metric-card-frame">
              <div className="card-top-header">
                <span className="card-label">PEAK LAND SURFACE TEMP</span>
              </div>
              <div style={{ fontFamily: 'var(--font-title)', fontSize: '2.1rem', fontWeight: 900, color: 'var(--color-cyan)', margin: '0.3rem 0' }}>
                {formatTemp(44.6)}
              </div>
              <div style={{ fontSize: '0.75rem', color: '#94A3B8' }}>
                Highest radiant asphalt temperature recorded in industrial corridors.
              </div>
            </div>

            {/* QUICK STAT: CANOPY DEFICIT */}
            <div className="metric-card-frame">
              <div className="card-top-header">
                <span className="card-label">COMMUNITY CANOPY DEFICIT</span>
              </div>
              <div style={{ fontFamily: 'var(--font-title)', fontSize: '2.1rem', fontWeight: 900, color: '#F59E0B', margin: '0.3rem 0' }}>
                -78% Avg
              </div>
              <div style={{ fontSize: '0.75rem', color: '#94A3B8' }}>
                Critical green space deficit in high-density commercial & residential zones.
              </div>
            </div>

          </div>

          {/* 6 & 7. LIVE CHENNAI THERMAL RISK MAP & AI INSIGHTS */}
          <div className="map-insights-grid">
            
            {/* LIVE CHENNAI THERMAL RISK MAP */}
            <div className="cyber-card-frame">
              <div className="card-header-bar">
                <div className="card-title-wrap">
                  <h3>LIVE CHENNAI THERMAL RISK MAP</h3>
                  <p>Interactive spatial AI intelligence analyzing local Chennai micro-climates</p>
                </div>
                <button
                  type="button"
                  className="btn-secondary"
                  onClick={() => setShowMapModal(true)}
                >
                  EXPAND MAP ⛶
                </button>
              </div>

              {/* Map Canvas */}
              <div className="chennai-map-canvas">
                <div className="radar-sweep-beam" />

                {chennaiLocations.map((loc) => {
                  const isSelected = selectedLocality.name === loc.name;
                  const riskClass = loc.risk.toLowerCase();

                  return (
                    <div
                      key={loc.id}
                      className={`map-locality-pin ${loc.offset} ${isSelected ? 'active' : ''}`}
                      style={{ left: `${loc.x}%`, top: `${loc.y}%` }}
                      onClick={() => setSelectedLocality(loc)}
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
                      Air Temp: {formatTemp(selectedLocality.airTemp)} | LST: {formatTemp(selectedLocality.lstTemp)} | Heat Index: {formatTemp(selectedLocality.heatIndex)} | Vulnerability: {selectedLocality.vulnerabilityScore}/100
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
              <div style={{ display: 'flex', gap: '1.5rem', fontSize: '0.72rem', color: '#94A3B8', fontWeight: 700, marginTop: '0.2rem' }}>
                <span style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}><span style={{ width: '10px', height: '10px', borderRadius: '50%', background: 'var(--color-crimson)' }} /> Critical (Perambur, Royapuram)</span>
                <span style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}><span style={{ width: '10px', height: '10px', borderRadius: '50%', background: 'var(--color-heat-orange)' }} /> High (T. Nagar, Ambattur, Guindy)</span>
                <span style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}><span style={{ width: '10px', height: '10px', borderRadius: '50%', background: 'var(--color-amber)' }} /> Medium (Velachery, Anna Nagar)</span>
                <span style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}><span style={{ width: '10px', height: '10px', borderRadius: '50%', background: 'var(--color-teal)' }} /> Low (Adyar)</span>
              </div>
            </div>

            {/* 7. AI INSIGHTS ("What the AI Sees") */}
            <div className="cyber-card-frame">
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
            <div className="cyber-card-frame">
              <div className="card-header-bar">
                <div className="card-title-wrap">
                  <h3>HEAT ANALYTICS</h3>
                  <p>Surface temperatures are 5.2°C above simulated seasonal baseline</p>
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '0.75rem', background: 'rgba(0,0,0,0.4)', padding: '0.75rem', borderRadius: '10px' }}>
                <div>
                  <span style={{ fontSize: '0.65rem', color: '#64748B', fontWeight: 800 }}>CURRENT TEMP</span>
                  <div style={{ fontFamily: 'var(--font-title)', fontSize: '1.2rem', fontWeight: 900, color: '#FFF' }}>{formatTemp(41.8)}</div>
                </div>
                <div>
                  <span style={{ fontSize: '0.65rem', color: '#64748B', fontWeight: 800 }}>DAILY PEAK</span>
                  <div style={{ fontFamily: 'var(--font-title)', fontSize: '1.2rem', fontWeight: 900, color: 'var(--color-crimson)' }}>{formatTemp(43.2)}</div>
                </div>
                <div>
                  <span style={{ fontSize: '0.65rem', color: '#64748B', fontWeight: 800 }}>AVERAGE</span>
                  <div style={{ fontFamily: 'var(--font-title)', fontSize: '1.2rem', fontWeight: 900, color: 'var(--color-cyan)' }}>{formatTemp(37.6)}</div>
                </div>
                <div>
                  <span style={{ fontSize: '0.65rem', color: '#64748B', fontWeight: 800 }}>HEAT ANOMALY</span>
                  <div style={{ fontFamily: 'var(--font-title)', fontSize: '1.2rem', fontWeight: 900, color: 'var(--color-heat-orange)' }}>+5.2°C</div>
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
            <div className="cyber-card-frame">
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
          <div className="cyber-card-frame" style={{ borderColor: 'var(--border-cyber)' }}>
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
          <div className="urgent-alert-banner">
            <div>
              <span className="modal-tag" style={{ background: 'rgba(239, 68, 68, 0.2)', color: 'var(--color-crimson)', borderColor: 'var(--border-critical)' }}>
                LIVE ALERT — HIGH HEAT EXPOSURE DETECTED
              </span>
              <div style={{ fontFamily: 'var(--font-title)', fontSize: '1.25rem', fontWeight: 900, color: '#FFF', marginTop: '0.2rem' }}>
                Location: Perambur, Chennai | Temp: {formatTemp(42.3)} | Vulnerability: HIGH (91/100)
              </div>
              <div style={{ fontSize: '0.78rem', color: '#CBD5E1', marginTop: '0.1rem' }}>
                Temperature and community vulnerability indicators are currently elevated in this monitored area.
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
          <div className="cyber-card-frame">
            <div className="card-header-bar">
              <div className="card-title-wrap">
                <h3>Recommended City Actions</h3>
                <p>AI-prioritized cooling interventions for Chennai municipal authority</p>
              </div>
            </div>

            <div className="city-actions-grid">
              {cityActionsData.map((act) => (
                <div key={act.title} className="action-card-item">
                  <span style={{ fontSize: '1.5rem' }}>{act.icon}</span>
                  <div style={{ fontFamily: 'var(--font-title)', fontWeight: 900, fontSize: '0.9rem', color: '#FFF' }}>{act.title}</div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--color-cyan)', fontWeight: 800 }}>Priority: {act.area}</div>
                  <div style={{ fontSize: '0.72rem', color: '#94A3B8' }}>{act.impact}</div>
                  <div style={{ fontSize: '0.68rem', color: '#64748B' }}>AI Confidence: {act.confidence}</div>
                  <button
                    type="button"
                    className="btn-secondary"
                    style={{ marginTop: '0.4rem' }}
                    onClick={() => alert(`Initiating action: ${act.title} in ${act.area}`)}
                  >
                    DEPLOY ACTION
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* 13. REPORTS */}
          <div className="cyber-card-frame">
            <div className="card-header-bar">
              <div className="card-title-wrap">
                <h3>REPORTS & POLICY BRIEFS</h3>
                <p>Exportable municipal intelligence documentation</p>
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              {reportsData.map((rep) => (
                <div key={rep.title} style={{ background: 'rgba(0,0,0,0.4)', border: '1px solid var(--border-subtle)', borderRadius: '10px', padding: '1rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
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
                      onClick={() => alert(`Downloading ${rep.title}...`)}
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
        onClose={() => setShowAlertModal(false)}
        title="OPERATIONAL HEAT RELIEF DISPATCH"
        tag="EMERGENCY DISPATCH"
      >
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div style={{ background: 'rgba(239, 68, 68, 0.15)', border: '1px solid var(--border-critical)', padding: '1rem', borderRadius: '10px', color: '#FFF', fontSize: '0.82rem', lineHeight: 1.4 }}>
            🚨 Initiating cooling misting trucks and hydration stations for <strong>{selectedLocality.name}</strong>.
          </div>
          <button
            type="button"
            className="btn-primary"
            onClick={() => { alert(`Relief units dispatched to ${selectedLocality.name}`); setShowAlertModal(false); }}
          >
            CONFIRM DISPATCH
          </button>
        </div>
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
          {chennaiLocations.map((loc) => (
            <div
              key={loc.id}
              className={`map-locality-pin ${loc.offset}`}
              style={{ left: `${loc.x}%`, top: `${loc.y}%` }}
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
            🔥 <strong>Extreme Heat Alert:</strong> Limit outdoor exertion between 11:00 AM and 4:00 PM.
          </div>
          <div>💧 <strong>Hydration Hubs:</strong> 42 free electrolyte stations active across Perambur & Royapuram.</div>
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
          <p style={{ fontSize: '0.82rem', color: '#94A3B8' }}>{selectedReport?.text}</p>
          <button
            type="button"
            className="btn-primary"
            onClick={() => { alert(`Downloading PDF for ${selectedReport?.title}...`); setShowReportModal(false); }}
          >
            DOWNLOAD PDF BRIEF
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
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'rgba(0,0,0,0.4)', padding: '0.85rem', borderRadius: '10px' }}>
          <div>
            <div style={{ fontFamily: 'var(--font-title)', fontWeight: 800, color: '#FFF', fontSize: '0.85rem' }}>Temperature Unit</div>
            <div style={{ fontSize: '0.72rem', color: '#64748B' }}>Celsius / Fahrenheit Switch</div>
          </div>
          <button
            type="button"
            className="btn-secondary"
            onClick={() => setTempUnit(tempUnit === 'C' ? 'F' : 'C')}
          >
            °{tempUnit}
          </button>
        </div>
      </Modal>

    </div>
  );
}
