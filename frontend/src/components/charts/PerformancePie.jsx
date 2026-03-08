import React from 'react';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from 'recharts';

const COLORS = ['#4f46e5', '#22c55e', '#eab308', '#f97316'];

const PerformancePie = ({ data }) => {
  const chartData = Object.entries(data || {}).map(([name, value]) => ({
    name,
    value
  }));

  if (!chartData.length) {
    return (
      <div className="text-sm text-slate-500">
        No performance data yet.
      </div>
    );
  }

  return (
    <ResponsiveContainer width="100%" height={260}>
      <PieChart>
        <Pie
          data={chartData}
          dataKey="value"
          nameKey="name"
          cx="50%"
          cy="50%"
          outerRadius={90}
          label
        >
          {chartData.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
          ))}
        </Pie>
        <Tooltip />
      </PieChart>
    </ResponsiveContainer>
  );
};

export default PerformancePie;

