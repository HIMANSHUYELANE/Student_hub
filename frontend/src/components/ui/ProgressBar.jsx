import React from 'react';

const ProgressBar = ({ percentage }) => {
  const clamped = Math.max(0, Math.min(100, Number(percentage) || 0));

  return (
    <div className="w-full">
      <div className="flex items-center justify-between text-xs font-medium text-slate-600">
        <span>Attendance</span>
        <span>{clamped}%</span>
      </div>
      <div className="mt-1 h-2 w-full overflow-hidden rounded-full bg-slate-200">
        <div
          className="h-full rounded-full bg-gradient-to-r from-primary-500 to-emerald-500 transition-all"
          style={{ width: `${clamped}%` }}
        />
      </div>
    </div>
  );
};

export default ProgressBar;

