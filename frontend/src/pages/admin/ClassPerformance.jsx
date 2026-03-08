import React, { useEffect, useState } from 'react';
import api from '../../api/axios';
import PerformancePie from '../../components/charts/PerformancePie';

const ClassPerformance = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const res = await api.get('/dashboard/admin');
        setData(res.data);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  if (loading) {
    return <div className="text-sm text-slate-500">Loading…</div>;
  }

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-xl font-semibold text-slate-900">
          Class Performance Overview
        </h1>
        <p className="mt-1 text-sm text-slate-500">
          Visualize overall class performance based on marks and attendance.
        </p>
      </div>
      <div className="grid gap-4 md:grid-cols-2">
        <div className="card">
          <h2 className="text-sm font-semibold text-slate-800">
            Performance Distribution
          </h2>
          <div className="mt-3">
            <PerformancePie data={data?.performanceOverview} />
          </div>
        </div>
        <div className="card space-y-2 text-sm text-slate-700">
          <h2 className="text-sm font-semibold text-slate-800">
            Summary
          </h2>
          <p>
            <span className="font-semibold">
              Total students:
            </span>{' '}
            {data?.totalStudents ?? 0}
          </p>
          <p className="text-xs text-slate-500">
            Performance levels are calculated from a combination of average marks and
            attendance percentage.
          </p>
        </div>
      </div>
    </div>
  );
};

export default ClassPerformance;

