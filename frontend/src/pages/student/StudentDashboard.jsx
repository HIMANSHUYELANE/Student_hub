import React, { useEffect, useState } from 'react';
import api from '../../api/axios';
import { useAuth } from '../../context/AuthContext';
import StatCard from '../../components/ui/StatCard';
import ProgressBar from '../../components/ui/ProgressBar';
import SubjectBarChart from '../../components/charts/SubjectBarChart';
import DistributionRadar from '../../components/charts/DistributionRadar';

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
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          label="Overall Performance"
          value={data?.performanceLevel || 'N/A'}
          subtitle="Comprehensive Rating"
        />
        <StatCard
          label="Exam Average"
          value={`${data?.avgMarks ?? 0}%`}
          subtitle={latest?.term ? `Latest: ${latest.term}` : 'No results yet'}
        />
        <StatCard
          label="Activity Score"
          value={`${data?.activityScore ?? 0}/100`}
          subtitle="Extracurricular Engagement"
        />
        <StatCard
          label="Attendance"
          value={`${data?.attendancePercentage ?? 0}%`}
          subtitle="Monthly Baseline"
        />
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        <div className="card lg:col-span-1 border-indigo-100 bg-indigo-50/30">
          <h2 className="text-sm font-semibold text-slate-800 text-center">
            Performance Distribution
          </h2>
          <div className="mt-2">
            <DistributionRadar metrics={{
              avgMarks: data?.avgMarks, 
              activityScore: data?.activityScore, 
              attendancePercentage: data?.attendancePercentage 
            }} />
          </div>
        </div>

        <div className="card lg:col-span-2">
          <h2 className="text-sm font-semibold text-slate-800">
            Attendance Progress
          </h2>
          <div className="mt-3">
            <ProgressBar percentage={data?.attendancePercentage ?? 0} />
          </div>
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

      {data?.recommendations && data.recommendations.length > 0 && (
        <div className="mt-8 space-y-4">
          <h2 className="text-lg font-semibold text-slate-900">Future Recommendations & Path</h2>
          <div className="grid gap-4 md:grid-cols-2">
            {data.recommendations.map((rec, idx) => (
              <div key={idx} className="card border-l-4" style={{ borderLeftColor: rec.type === 'Academic' ? '#3b82f6' : (rec.type === 'General' ? '#f59e0b' : '#10b981') }}>
                <div className="flex items-center justify-between">
                  <span className="text-xs font-medium uppercase tracking-wider text-slate-500">{rec.type}</span>
                </div>
                <h3 className="mt-2 text-md font-bold text-slate-800">{rec.title}</h3>
                <p className="mt-1 text-sm text-slate-600 font-medium">{rec.description}</p>
                <div className="mt-3 p-3 bg-slate-50 rounded-md">
                  <p className="text-sm text-slate-700 italic">"{rec.rationale}"</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default StudentDashboard;

