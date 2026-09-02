import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  Map,
  MapPin,
  Flame,
  Bell,
  ShieldCheck,
  Sliders,
  Database,
  FileCode,
  Settings,
  ChevronDown
} from 'lucide-react';
import { DataService } from '../../services/dataService';

interface SidebarProps {
  isOpenMobile?: boolean;
  onCloseMobile?: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ isOpenMobile, onCloseMobile }) => {
  const alerts = DataService.getAlerts();
  const activeAlertsCount = alerts.filter(a => a.status === 'active').length;

  const navGroups = [
    {
      title: 'WORKSPACE',
      items: [
        { label: 'Risk Overview', icon: LayoutDashboard, path: '/' },
        { label: 'Risk Map', icon: Map, path: '/risk-map' },
        { label: 'Locations', icon: MapPin, path: '/locations' }
      ]
    },
    {
      title: 'UNDERSTAND',
      items: [
        { label: 'Compound Risks', icon: Flame, path: '/compound-risks' },
        {
          label: 'Alerts',
          icon: Bell,
          path: '/alerts',
          badge: activeAlertsCount > 0 ? activeAlertsCount : undefined
        },
        { label: 'Mitigation Center', icon: ShieldCheck, path: '/mitigation' }
      ]
    },
    {
      title: 'MODEL & SYSTEM',
      items: [
        { label: 'What-If Simulator', icon: Sliders, path: '/what-if' },
        { label: 'Data Sources', icon: Database, path: '/admin/data-sources' },
        { label: 'Model Transparency', icon: FileCode, path: '/admin/model-transparency' },
        { label: 'Settings', icon: Settings, path: '/admin/settings' }
      ]
    }
  ];

  const sidebarContent = (
    <div className="flex flex-col h-full bg-[#0B192C] border-r border-slate-800 text-slate-300 w-64 shrink-0 select-none">
      {/* Brand Header */}
      <div className="p-4 border-b border-slate-800/80">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-cyan-500 to-teal-700 flex items-center justify-center text-slate-950 font-black tracking-tighter text-sm shadow-md shadow-cyan-900/30">
            TE
          </div>
          <div>
            <h1 className="text-sm font-bold text-slate-100 tracking-wide uppercase">Thermal Equity AI</h1>
            <p className="text-[10px] text-cyan-400 font-medium">Environmental Intelligence</p>
          </div>
        </div>

        {/* Workspace Selector */}
        <div className="mt-3 bg-[#1E3E62]/60 border border-slate-700/60 rounded-lg p-2 flex items-center justify-between text-xs cursor-pointer hover:border-slate-600 transition-colors">
          <div className="overflow-hidden">
            <p className="text-[10px] text-slate-400 uppercase font-semibold">Workspace</p>
            <p className="text-slate-200 font-medium truncate text-xs">Chennai Metropolitan Region</p>
            <p className="text-[10px] text-emerald-400 font-mono">Demo / simulated live view</p>
          </div>
          <ChevronDown className="w-4 h-4 text-slate-400 shrink-0" />
        </div>
      </div>

      {/* Navigation Sections */}
      <div className="flex-1 overflow-y-auto py-3 px-3 space-y-5">
        {navGroups.map((group, idx) => (
          <div key={idx}>
            <p className="px-3 text-[10px] font-bold text-slate-400 tracking-wider uppercase mb-1.5">
              {group.title}
            </p>
            <div className="space-y-0.5">
              {group.items.map((item, itemIdx) => (
                <NavLink
                  key={itemIdx}
                  to={item.path}
                  onClick={onCloseMobile}
                  className={({ isActive }) =>
                    `flex items-center justify-between px-3 py-2 rounded-lg text-xs font-medium transition-all ${
                      isActive
                        ? 'bg-cyan-950/80 text-cyan-300 border border-cyan-700/50 shadow-sm shadow-cyan-950'
                        : 'text-slate-300 hover:text-slate-100 hover:bg-slate-800/60'
                    }`
                  }
                >
                  <div className="flex items-center gap-2.5">
                    <item.icon className="w-4 h-4 text-cyan-400 shrink-0" />
                    <span>{item.label}</span>
                  </div>
                  {item.badge && (
                    <span className="px-1.5 py-0.2 bg-rose-600 text-white rounded-full text-[10px] font-bold font-mono">
                      {item.badge}
                    </span>
                  )}
                </NavLink>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Sidebar Footer */}
      <div className="p-3 border-t border-slate-800/80 bg-[#081220] text-[11px] text-slate-400 space-y-1.5">
        <div className="flex items-center justify-between">
          <span className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-500 live-pulse-dot" />
            <span className="text-slate-300 font-medium">Data Pulse</span>
          </span>
          <span className="font-mono text-[10px] text-emerald-400">ONLINE</span>
        </div>
        <div className="flex justify-between text-[10px] text-slate-400">
          <span>Last Sync:</span>
          <span className="font-mono text-slate-300">09:30 AM IST</span>
        </div>
        <div className="pt-1 border-t border-slate-800 flex justify-between text-[10px] text-slate-400">
          <span>Role: Municipal Officer</span>
          <span className="text-cyan-400">v1.0-prod</span>
        </div>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Navigation */}
      <aside className="hidden lg:block h-screen sticky top-0 z-30">
        {sidebarContent}
      </aside>

      {/* Mobile Drawer Overlay */}
      {isOpenMobile && (
        <div className="fixed inset-0 z-50 lg:hidden flex">
          <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm" onClick={onCloseMobile} />
          <div className="relative z-10 w-64 max-w-full h-full">
            {sidebarContent}
          </div>
        </div>
      )}
    </>
  );
};
