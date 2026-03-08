import React, { useEffect, useState } from 'react';
import api from '../../api/axios';
import StatCard from '../../components/ui/StatCard';
import PerformancePie from '../../components/charts/PerformancePie';

const AdminDashboard = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await api.get('/dashboard/admin');
        setData(res.data);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) {
    return <div className="text-sm text-slate-500">Loading dashboard…</div>;
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-semibold text-slate-900">Admin Dashboard</h1>
        <p className="mt-1 text-sm text-slate-500">
          Overview of students, attendance and performance.
        </p>
      </div>
      <div className="grid gap-4 md:grid-cols-3">
        <StatCard
          label="Total Students"
          value={data?.totalStudents ?? 0}
        />
        <StatCard
          label="Today Present"
          value={data?.attendanceSummary?.present ?? 0}
          subtitle={`Absent: ${data?.attendanceSummary?.absent ?? 0}`}
        />
        <StatCard
          label="Records Marked Today"
          value={data?.attendanceSummary?.totalMarked ?? 0}
        />
      </div>
      <div className="card">
        <h2 className="text-sm font-semibold text-slate-800">
          Class Performance Overview
        </h2>
        <p className="mt-1 text-xs text-slate-500">
          Distribution of students across performance levels.
        </p>
        <div className="mt-4">
          <PerformancePie data={data?.performanceOverview} />
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;

