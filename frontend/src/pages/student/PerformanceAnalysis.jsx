import React, { useEffect, useState } from 'react';
import api from '../../api/axios';
import { useAuth } from '../../context/AuthContext';
import ProgressBar from '../../components/ui/ProgressBar';
import SubjectBarChart from '../../components/charts/SubjectBarChart';

const PerformanceAnalysis = () => {
  const { user } = useAuth();
  const [data, setData] = useState(null);

  useEffect(() => {
    const load = async () => {
      if (!user?.studentId) return;
      try {
        const res = await api.get(`/dashboard/student/${user.studentId}`);
        setData(res.data);
      } catch (e) {
        console.error(e);
      }
    };
    load();
  }, [user]);

  const weakSubjects = data?.weakSubjects || [];

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-xl font-semibold text-slate-900">
          Performance Analysis
        </h1>
        <p className="mt-1 text-sm text-slate-500">
          Combined view of your attendance, marks and weak subjects.
        </p>
      </div>
      <div className="grid gap-4 md:grid-cols-2">
        <div className="card space-y-3">
          <h2 className="text-sm font-semibold text-slate-800">
            Overall Performance
          </h2>
          <p className="text-sm text-slate-600">
            Level:{' '}
            <span className="font-semibold">
              {data?.performanceLevel || 'N/A'}
            </span>
          </p>
          <p className="text-sm text-slate-600">
            Average Marks:{' '}
            <span className="font-semibold">{data?.avgMarks ?? 0}</span>
          </p>
          <ProgressBar percentage={data?.attendancePercentage ?? 0} />
        </div>
        <div className="card">
          <h2 className="text-sm font-semibold text-slate-800">
            Subject-wise Visualization
          </h2>
          <div className="mt-3">
            <SubjectBarChart subjects={data?.latestResult?.subjects || []} />
          </div>
        </div>
      </div>
      <div className="card">
        <h2 className="text-sm font-semibold text-slate-800">Weak Subjects</h2>
        {weakSubjects.length ? (
          <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-slate-700">
            {weakSubjects.map((s) => (
              <li key={s.name}>
                <span className="font-semibold">{s.name}:</span> {s.marks} marks
              </li>
            ))}
          </ul>
        ) : (
          <p className="mt-2 text-sm text-slate-500">
            No weak subjects detected. Keep up the good work!
          </p>
        )}
      </div>
    </div>
  );
};

export default PerformanceAnalysis;

