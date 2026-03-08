import React from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer
} from 'recharts';

const SubjectBarChart = ({ subjects }) => {
  if (!subjects || !subjects.length) {
    return (
      <div className="text-sm text-slate-500">
        No subject marks available.
      </div>
    );
  }

  return (
    <ResponsiveContainer width="100%" height={260}>
      <BarChart data={subjects} margin={{ top: 10, right: 20, left: 0, bottom: 30 }}>
        <CartesianGrid strokeDasharray="3 3" vertical={false} />
        <XAxis dataKey="name" angle={-30} textAnchor="end" interval={0} height={60} />
        <YAxis domain={[0, 100]} />
        <Tooltip />
        <Bar dataKey="marks" fill="#4f46e5" radius={[4, 4, 0, 0]} />
      </BarChart>
    </ResponsiveContainer>
  );
};

export default SubjectBarChart;

