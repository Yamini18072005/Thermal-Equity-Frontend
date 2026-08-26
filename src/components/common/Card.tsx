import React from 'react';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  title?: React.ReactNode;
  subtitle?: React.ReactNode;
  action?: React.ReactNode;
  footer?: React.ReactNode;
}

export const Card: React.FC<CardProps> = ({
  children,
  className = '',
  title,
  subtitle,
  action,
  footer
}) => {
  return (
    <div
      className={`bg-[#1E3E62]/70 border border-slate-700/60 rounded-xl p-5 shadow-lg backdrop-blur-md hover:border-slate-600 transition-all duration-200 ${className}`}
    >
      {(title || action) && (
        <div className="flex items-start justify-between gap-4 mb-4 pb-3 border-b border-slate-700/50">
          <div>
            {typeof title === 'string' ? (
              <h3 className="text-base font-semibold text-slate-100 tracking-tight">{title}</h3>
            ) : (
              title
            )}
            {subtitle && <p className="text-xs text-slate-400 mt-0.5">{subtitle}</p>}
          </div>
          {action && <div className="shrink-0">{action}</div>}
        </div>
      )}
      <div>{children}</div>
      {footer && (
        <div className="mt-4 pt-3 border-t border-slate-700/50 text-xs text-slate-400">
          {footer}
        </div>
      )}
    </div>
  );
};
