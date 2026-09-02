import React from 'react';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, Legend } from 'recharts';

interface WhatIfImpactChartProps {
  data: {
    category: string;
    beforePct: number;
    afterPct: number;
  }[];
}

export const WhatIfImpactChart: React.FC<WhatIfImpactChartProps> = ({ data }) => {
  return (
    <div className="w-full h-64">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} margin={{ top: 20, right: 20, left: -10, bottom: 20 }}>
          <XAxis dataKey="category" stroke="#94a3b8" fontSize={10} angle={-15} textAnchor="end" />
          <YAxis domain={[0, 50]} stroke="#94a3b8" fontSize={11} unit="%" />
          <Tooltip
            content={({ active, payload, label }) => {
              if (active && payload && payload.length) {
                return (
                  <div className="bg-[#0B192C] border border-slate-700 rounded-lg p-3 text-xs shadow-xl font-mono space-y-1">
                    <p className="font-bold text-slate-100">{label}</p>
                    <p className="text-orange-400">Baseline Contribution: {payload[0].value}%</p>
                    <p className="text-emerald-400">Projected Contribution: {payload[1].value}%</p>
                  </div>
                );
              }
              return null;
            }}
          />
          <Legend verticalAlign="top" align="right" wrapperStyle={{ fontSize: '11px' }} />
          <Bar name="Baseline Driver Contribution" dataKey="beforePct" fill="#f97316" radius={[4, 4, 0, 0]} />
          <Bar name="Projected Driver Contribution" dataKey="afterPct" fill="#10b981" radius={[4, 4, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};
