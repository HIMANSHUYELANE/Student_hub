import React, { useEffect, useState } from 'react';
import api from '../../api/axios';
import { useAuth } from '../../context/AuthContext';
import SubjectBarChart from '../../components/charts/SubjectBarChart';

const ViewResults = () => {
  const { user } = useAuth();
  const [results, setResults] = useState([]);
  const [selectedIndex, setSelectedIndex] = useState(0);

  useEffect(() => {
    const load = async () => {
      if (!user?.studentId) return;
      try {
        const res = await api.get(`/results/student/${user.studentId}`);
        setResults(res.data);
      } catch (e) {
        console.error(e);
      }
    };
    load();
  }, [user]);

  const selected = results[selectedIndex];

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-xl font-semibold text-slate-900">Results</h1>
        <p className="mt-1 text-sm text-slate-500">
          View your term-wise marks and subject-wise performance.
        </p>
      </div>
      <div className="grid gap-4 md:grid-cols-[240px,1fr]">
        <div className="card space-y-2">
          <h2 className="text-sm font-semibold text-slate-800">Terms</h2>
          <div className="mt-2 space-y-1">
            {results.map((r, idx) => (
              <button
                key={r._id}
                type="button"
                onClick={() => setSelectedIndex(idx)}
                className={`flex w-full items-center justify-between rounded-lg px-3 py-2 text-xs ${
                  idx === selectedIndex
                    ? 'bg-primary-50 text-primary-700'
                    : 'text-slate-700 hover:bg-slate-50'
                }`}
              >
                <span>{r.term}</span>
                <span className="text-[10px] text-slate-500">
                  {new Date(r.createdAt).toLocaleDateString()}
                </span>
              </button>
            ))}
            {results.length === 0 && (
              <p className="text-xs text-slate-500">No results yet.</p>
            )}
          </div>
        </div>
        <div className="card">
          <h2 className="text-sm font-semibold text-slate-800">
            Subject-wise Marks
          </h2>
          <div className="mt-3">
            <SubjectBarChart subjects={selected?.subjects || []} />
          </div>
          {selected && (
            <div className="mt-4 overflow-hidden rounded-lg border border-slate-200">
              <table className="min-w-full divide-y divide-slate-200 text-sm">
                <thead className="bg-slate-50">
                  <tr>
                    <th className="px-4 py-2 text-left text-[11px] font-semibold uppercase tracking-wide text-slate-500">
                      Subject
                    </th>
                    <th className="px-4 py-2 text-left text-[11px] font-semibold uppercase tracking-wide text-slate-500">
                      Marks
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 bg-white">
                  {selected.subjects.map((s) => (
                    <tr key={s.name}>
                      <td className="px-4 py-2 text-xs text-slate-700">{s.name}</td>
                      <td className="px-4 py-2 text-xs text-slate-700">{s.marks}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ViewResults;

