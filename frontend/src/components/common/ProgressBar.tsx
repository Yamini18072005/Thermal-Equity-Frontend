import React from 'react';

interface ProgressBarProps {
  value: number; // 0 - 100
  max?: number;
  color?: 'rose' | 'orange' | 'amber' | 'emerald' | 'cyan' | 'indigo';
  label?: string;
  showPercent?: boolean;
  className?: string;
}

export const ProgressBar: React.FC<ProgressBarProps> = ({
  value,
  max = 100,
  color = 'cyan',
  label,
  showPercent = true,
  className = ''
}) => {
  const percentage = Math.min(100, Math.max(0, (value / max) * 100));

  let barColor = 'bg-cyan-500';
  if (color === 'rose') barColor = 'bg-rose-500';
  if (color === 'orange') barColor = 'bg-orange-500';
  if (color === 'amber') barColor = 'bg-amber-500';
  if (color === 'emerald') barColor = 'bg-emerald-500';
  if (color === 'indigo') barColor = 'bg-indigo-500';

  return (
    <div className={`w-full ${className}`}>
      {(label || showPercent) && (
        <div className="flex justify-between items-center text-xs mb-1">
          {label && <span className="font-medium text-slate-300">{label}</span>}
          {showPercent && <span className="font-mono text-slate-400">{Math.round(percentage)}%</span>}
        </div>
      )}
      <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden border border-slate-700/50">
        <div
          className={`h-full ${barColor} transition-all duration-500 ease-out`}
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
};
