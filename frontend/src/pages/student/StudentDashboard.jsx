import React, { useEffect, useState } from 'react';
import api from '../../api/axios';
import { useAuth } from '../../context/AuthContext';
import StatCard from '../../components/ui/StatCard';
import ProgressBar from '../../components/ui/ProgressBar';
import SubjectBarChart from '../../components/charts/SubjectBarChart';

const StudentDashboard = () => {
  const { user } = useAuth();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      if (!user?.studentId) {
        setLoading(false);
        return;
      }
      try {
        const res = await api.get(`/dashboard/student/${user.studentId}`);
        setData(res.data);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [user]);

  if (loading) {
    return <div className="text-sm text-slate-500">Loading dashboard…</div>;
  }

  if (!user?.studentId) {
    return (
      <div className="text-sm text-slate-500">
        No linked student profile. Please contact your administrator.
      </div>
    );
  }

  const latest = data?.latestResult;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-semibold text-slate-900">Student Dashboard</h1>
        <p className="mt-1 text-sm text-slate-500">
          Quick snapshot of your attendance and academic performance.
        </p>
      </div>
      <div className="grid gap-4 md:grid-cols-3">
        <StatCard
          label="Attendance"
          value={`${data?.attendancePercentage ?? 0}%`}
          subtitle="Overall attendance"
        />
        <StatCard
          label="Average Marks"
          value={data?.avgMarks ?? 0}
          subtitle={latest?.term ? `Latest term: ${latest.term}` : 'No results yet'}
        />
        <StatCard
          label="Performance Level"
          value={data?.performanceLevel || 'N/A'}
          subtitle={
            data?.weakSubjects?.length
              ? `Weak in: ${data.weakSubjects.map((s) => s.name).join(', ')}`
              : 'No weak subjects detected'
          }
        />
      </div>
      <div className="grid gap-4 md:grid-cols-2">
        <div className="card">
          <h2 className="text-sm font-semibold text-slate-800">
            Attendance Progress
          </h2>
          <div className="mt-3">
            <ProgressBar percentage={data?.attendancePercentage ?? 0} />
          </div>
        </div>
        <div className="card">
          <h2 className="text-sm font-semibold text-slate-800">
            Subject-wise Performance
          </h2>
          <div className="mt-3">
            <SubjectBarChart subjects={latest?.subjects || []} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentDashboard;

