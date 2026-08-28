import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';

interface BurdenDonutChartProps {
  data?: { name: string; value: number; color: string }[];
}

const DEFAULT_BURDEN_DATA = [
  { name: 'Heat & Surface Temp', value: 31, color: '#f97316' },
  { name: 'PM2.5 Air Pollution', value: 27, color: '#ef4444' },
  { name: 'Social Vulnerability', value: 23, color: '#f59e0b' },
  { name: 'Canopy Deficit (NDVI)', value: 12, color: '#10b981' },
  { name: 'Cooling Access Deficit', value: 7, color: '#00adb5' }
];

export const BurdenDonutChart: React.FC<BurdenDonutChartProps> = ({ data = DEFAULT_BURDEN_DATA }) => {
  return (
    <div className="w-full flex flex-col sm:flex-row items-center justify-between gap-4">
      {/* Recharts Pie Chart Container */}
      <div className="w-full sm:w-1/2 h-52 relative">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              innerRadius={55}
              outerRadius={80}
              paddingAngle={4}
              dataKey="value"
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} stroke="#1E3E62" strokeWidth={2} />
              ))}
            </Pie>
            <Tooltip
              content={({ active, payload }) => {
                if (active && payload && payload.length) {
                  const item = payload[0].payload;
                  return (
                    <div className="bg-[#0B192C] border border-slate-700 rounded-lg p-2 text-xs shadow-xl font-mono">
                      <p className="font-semibold text-slate-100">{item.name}</p>
                      <p className="text-cyan-400 font-bold">{item.value}% contribution</p>
                    </div>
                  );
                }
                return null;
              }}
            />
          </PieChart>
        </ResponsiveContainer>

        {/* Center Label */}
        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
          <span className="text-xs text-slate-400 font-medium">Combined</span>
          <span className="text-lg font-bold text-slate-100 font-mono">Burden</span>
        </div>
      </div>

      {/* Legend list */}
      <div className="w-full sm:w-1/2 space-y-2 text-xs">
        {data.map((item, idx) => (
          <div key={idx} className="flex items-center justify-between gap-2 p-1.5 rounded-lg bg-[#0B192C]/50 border border-slate-800">
            <div className="flex items-center gap-2 overflow-hidden">
              <span className="w-3 h-3 rounded-full shrink-0" style={{ backgroundColor: item.color }} />
              <span className="text-slate-300 truncate">{item.name}</span>
            </div>
            <span className="font-mono font-bold text-slate-100 shrink-0">{item.value}%</span>
          </div>
        ))}
      </div>
    </div>
  );
};
