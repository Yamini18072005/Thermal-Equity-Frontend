import React from 'react';
import { RiskLevel } from '../../types';

interface BadgeProps {
  level?: RiskLevel | string;
  variant?: 'risk' | 'status' | 'category' | 'mode';
  className?: string;
  children?: React.ReactNode;
}

export const Badge: React.FC<BadgeProps> = ({ level, variant = 'risk', className = '', children }) => {
  let styleClasses = 'bg-slate-800 text-slate-300 border-slate-700';

  if (variant === 'risk') {
    switch (level) {
      case 'Extreme':
      case 'Critical / Extreme':
      case 'Critical':
        styleClasses = 'bg-rose-950/80 text-rose-300 border-rose-600/50 shadow-sm shadow-rose-950/50';
        break;
      case 'High':
        styleClasses = 'bg-orange-950/80 text-orange-300 border-orange-600/50';
        break;
      case 'Moderate':
        styleClasses = 'bg-amber-950/80 text-amber-300 border-amber-600/50';
        break;
      case 'Low':
        styleClasses = 'bg-emerald-950/80 text-emerald-300 border-emerald-600/50';
        break;
    }
  } else if (variant === 'status') {
    switch (level) {
      case 'active':
      case 'Active':
        styleClasses = 'bg-rose-950/60 text-rose-300 border-rose-700/40';
        break;
      case 'acknowledged':
      case 'Acknowledged':
        styleClasses = 'bg-amber-950/60 text-amber-300 border-amber-700/40';
        break;
      case 'resolved':
      case 'Resolved':
        styleClasses = 'bg-emerald-950/60 text-emerald-300 border-emerald-700/40';
        break;
    }
  } else if (variant === 'mode') {
    styleClasses = 'bg-cyan-950/60 text-cyan-300 border-cyan-700/40 font-mono text-[11px]';
  }

  return (
    <span
      className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold border ${styleClasses} ${className}`}
    >
      {children || level}
    </span>
  );
};
