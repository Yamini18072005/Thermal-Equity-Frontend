import React, { useState } from 'react';
import { Search, MapPin, Calendar, Menu, User, Sparkles } from 'lucide-react';
import { NotificationCenter } from './NotificationCenter';
import { useNavigate } from 'react-router-dom';
import { DataService } from '../../services/dataService';

interface HeaderProps {
  onToggleMobileNav: () => void;
  selectedTimeRange?: string;
  onTimeRangeChange?: (range: string) => void;
}

export const Header: React.FC<HeaderProps> = ({
  onToggleMobileNav,
  selectedTimeRange = 'Today',
  onTimeRangeChange
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();
  const locations = DataService.getLocations();

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;

    const matched = locations.find(l =>
      l.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      l.district.toLowerCase().includes(searchQuery.toLowerCase())
    );

    if (matched) {
      navigate(`/locations/${matched.id}`);
      setSearchQuery('');
    } else {
      navigate(`/locations?search=${encodeURIComponent(searchQuery)}`);
    }
  };

  const timeRanges = ['Today', '7 days', '30 days', '90 days'];

  return (
    <header className="sticky top-0 z-20 bg-[#0B192C]/90 backdrop-blur-md border-b border-slate-800/80 px-4 lg:px-8 py-3 flex items-center justify-between gap-4">
      {/* Left: Mobile Nav Toggle & Search */}
      <div className="flex items-center gap-3 flex-1 max-w-xl">
        <button
          onClick={onToggleMobileNav}
          className="lg:hidden p-2 rounded-lg text-slate-300 hover:bg-slate-800 hover:text-white transition-colors"
          aria-label="Open mobile menu"
        >
          <Menu className="w-5 h-5" />
        </button>

        {/* Global Search Bar */}
        <form onSubmit={handleSearchSubmit} className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            placeholder="Search Chennai wards, districts or locations (e.g. Manali, Velachery)..."
            className="w-full bg-[#1E3E62]/60 border border-slate-700/60 rounded-xl pl-9 pr-4 py-1.5 text-xs text-slate-100 placeholder-slate-400 focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition-all"
          />
        </form>
      </div>

      {/* Right Controls: Location Selector, Time Filter, Notifications, User */}
      <div className="flex items-center gap-3">
        {/* Workspace Location Indicator */}
        <div className="hidden md:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#1E3E62]/40 border border-slate-700/50 text-xs text-slate-300">
          <MapPin className="w-3.5 h-3.5 text-cyan-400" />
          <span className="font-semibold text-slate-200">Chennai Region</span>
        </div>

        {/* Time Control Filter */}
        <div className="hidden sm:flex items-center bg-[#1E3E62]/40 border border-slate-700/50 rounded-xl p-0.5 text-xs">
          <div className="px-2 text-slate-400 flex items-center gap-1">
            <Calendar className="w-3.5 h-3.5" />
          </div>
          {timeRanges.map(range => (
            <button
              key={range}
              onClick={() => onTimeRangeChange?.(range)}
              className={`px-2.5 py-1 rounded-lg transition-all ${
                selectedTimeRange === range
                  ? 'bg-cyan-600 text-white font-medium shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              {range}
            </button>
          ))}
        </div>

        {/* AI Field Notes Status indicator */}
        <div className="hidden xl:flex items-center gap-1 px-2.5 py-1 rounded-lg bg-teal-950/60 border border-teal-700/40 text-[11px] text-teal-300">
          <Sparkles className="w-3 h-3 text-teal-400" />
          <span>AI Assisted</span>
        </div>

        {/* Notification Center */}
        <NotificationCenter />

        {/* User Profile */}
        <div className="flex items-center gap-2 pl-2 border-l border-slate-800">
          <div className="w-8 h-8 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center text-cyan-400 text-xs font-bold shadow-sm">
            <User className="w-4 h-4" />
          </div>
          <div className="hidden lg:block text-left">
            <p className="text-xs font-bold text-slate-200 leading-tight">Dr. V. Ramesh</p>
            <p className="text-[10px] text-slate-400">Chief Officer, Health & Urban Env</p>
          </div>
        </div>
      </div>
    </header>
  );
};
