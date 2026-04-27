import React from 'react';
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer, Tooltip } from 'recharts';

const DistributionRadar = ({ metrics }) => {
  const data = [
    { subject: 'Academics', value: metrics.avgMarks || 0, fullMark: 100 },
    { subject: 'Activities', value: metrics.activityScore || 0, fullMark: 100 },
    { subject: 'Attendance', value: metrics.attendancePercentage || 0, fullMark: 100 }
  ];

  return (
    <ResponsiveContainer width="100%" height={260}>
      <RadarChart cx="50%" cy="50%" outerRadius="70%" data={data}>
        <PolarGrid stroke="#e2e8f0" />
        <PolarAngleAxis dataKey="subject" tick={{ fill: '#475569', fontSize: 13, fontWeight: 500 }} />
        <PolarRadiusAxis angle={90} domain={[0, 100]} tick={false} axisLine={false} />
        <Tooltip cursor={{ fill: 'transparent' }} contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
        <Radar name="Score" dataKey="value" stroke="#6366f1" strokeWidth={2} fill="#818cf8" fillOpacity={0.5} />
      </RadarChart>
    </ResponsiveContainer>
  );
};

export default DistributionRadar;
