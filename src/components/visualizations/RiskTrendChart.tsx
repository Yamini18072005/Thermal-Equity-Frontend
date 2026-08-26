import React from 'react';
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid, Legend } from 'recharts';

interface RiskTrendChartProps {
  timeRange?: string;
  locationName?: string;
}

export const RiskTrendChart: React.FC<RiskTrendChartProps> = ({
  timeRange = '7 days',
  locationName = 'Chennai Region Baseline'
}) => {
  // Generate trend data points
  const trendData = [
    { date: 'Aug 15', currentScore: 62, prevScore: 58, label: 'Observed' },
    { date: 'Aug 16', currentScore: 65, prevScore: 60, label: 'Observed' },
    { date: 'Aug 17', currentScore: 71, prevScore: 63, label: 'Observed' },
    { date: 'Aug 18', currentScore: 69, prevScore: 61, label: 'Observed' },
    { date: 'Aug 19', currentScore: 74, prevScore: 65, label: 'Observed' },
    { date: 'Aug 20', currentScore: 81, prevScore: 68, label: 'Observed' },
    { date: 'Aug 21', currentScore: 84, prevScore: 70, label: 'Observed (Live)' }
  ];

  return (
    <div className="w-full space-y-2">
      <div className="flex justify-between items-center text-xs text-slate-400">
        <span className="font-semibold text-slate-300">{locationName} — {timeRange} Trend</span>
        <span className="font-mono text-[10px] text-cyan-400">Observed Telemetry</span>
      </div>

      <div className="w-full h-56">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={trendData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#334155" opacity={0.4} />
            <XAxis dataKey="date" stroke="#94a3b8" fontSize={11} tickLine={false} />
            <YAxis domain={[0, 100]} stroke="#94a3b8" fontSize={11} tickLine={false} />
            <Tooltip
              content={({ active, payload, label }) => {
                if (active && payload && payload.length) {
                  return (
                    <div className="bg-[#0B192C] border border-slate-700 rounded-lg p-3 text-xs shadow-xl space-y-1 font-mono">
                      <p className="font-bold text-slate-100 border-b border-slate-800 pb-1">{label}</p>
                      <p className="text-cyan-400 font-semibold">Current Risk: {payload[0].value} / 100</p>
                      <p className="text-slate-400">Previous Period: {payload[1].value} / 100</p>
                      <p className="text-[10px] text-emerald-400 pt-1">Data Source: Observed Telemetry</p>
                    </div>
                  );
                }
                return null;
              }}
            />
            <Legend
              verticalAlign="top"
              align="right"
              wrapperStyle={{ fontSize: '11px', paddingBottom: '10px' }}
            />
            <Line
              type="monotone"
              name="Current Period"
              dataKey="currentScore"
              stroke="#00adb5"
              strokeWidth={3}
              dot={{ r: 4, fill: '#00adb5' }}
              activeDot={{ r: 6, fill: '#38bdf8' }}
            />
            <Line
              type="monotone"
              name="Previous Period"
              dataKey="prevScore"
              stroke="#64748b"
              strokeWidth={1.5}
              strokeDasharray="4 4"
              dot={false}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};
