import React from 'react';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, Cell } from 'recharts';
import { DataService } from '../../services/dataService';

export const CompareBarChart: React.FC = () => {
  const scores = DataService.getAllRiskScores().sort((a, b) => b.score - a.score);

  const data = scores.map(s => ({
    name: s.location.name,
    score: s.score,
    classification: s.classification
  }));

  const getBarColor = (score: number) => {
    if (score >= 80) return '#ef4444';
    if (score >= 60) return '#f97316';
    if (score >= 30) return '#f59e0b';
    return '#10b981';
  };

  return (
    <div className="w-full h-64">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} layout="vertical" margin={{ top: 5, right: 30, left: 40, bottom: 5 }}>
          <XAxis type="number" domain={[0, 100]} stroke="#94a3b8" fontSize={11} />
          <YAxis dataKey="name" type="category" stroke="#94a3b8" fontSize={11} width={110} tickLine={false} />
          <Tooltip
            content={({ active, payload }) => {
              if (active && payload && payload.length) {
                const item = payload[0].payload;
                return (
                  <div className="bg-[#0B192C] border border-slate-700 rounded-lg p-2.5 text-xs shadow-xl font-mono">
                    <p className="font-bold text-slate-100">{item.name}</p>
                    <p className="text-cyan-400">Score: {item.score} / 100</p>
                    <p className="text-slate-400">Classification: {item.classification}</p>
                  </div>
                );
              }
              return null;
            }}
          />
          <Bar dataKey="score" radius={[0, 4, 4, 0]}>
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={getBarColor(entry.score)} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};
