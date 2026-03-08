import React, { useEffect, useMemo, useState } from 'react';
import api from '../../api/axios';
import { useAuth } from '../../context/AuthContext';
import ProgressBar from '../../components/ui/ProgressBar';

const ViewAttendance = () => {
  const { user } = useAuth();
  const [records, setRecords] = useState([]);

  useEffect(() => {
    const load = async () => {
      if (!user?.studentId) return;
      try {
        const res = await api.get(`/attendance/student/${user.studentId}`);
        setRecords(res.data);
      } catch (e) {
        console.error(e);
      }
    };
    load();
  }, [user]);

  const percentage = useMemo(() => {
    if (!records.length) return 0;
    const present = records.filter((r) => r.status === 'present').length;
    return Math.round((present / records.length) * 100);
  }, [records]);

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-xl font-semibold text-slate-900">Attendance</h1>
        <p className="mt-1 text-sm text-slate-500">
          Your detailed attendance record with overall percentage.
        </p>
      </div>
      <div className="card">
        <ProgressBar percentage={percentage} />
      </div>
      <div className="overflow-hidden rounded-xl bg-white shadow-sm ring-1 ring-slate-200">
        <div className="max-h-[480px] overflow-auto">
          <table className="min-w-full divide-y divide-slate-200 text-sm">
            <thead className="bg-slate-50">
              <tr>
                <th className="px-4 py-2 text-left text-[11px] font-semibold uppercase tracking-wide text-slate-500">
                  Date
                </th>
                <th className="px-4 py-2 text-left text-[11px] font-semibold uppercase tracking-wide text-slate-500">
                  Status
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 bg-white">
              {records.map((r) => (
                <tr key={r._id}>
                  <td className="px-4 py-2 text-xs text-slate-700">
                    {new Date(r.date).toLocaleDateString()}
                  </td>
                  <td className="px-4 py-2 text-xs">
                    <span
                      className={`inline-flex rounded-full px-3 py-1 text-xs font-medium ${
                        r.status === 'present'
                          ? 'bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200'
                          : 'bg-rose-50 text-rose-700 ring-1 ring-rose-200'
                      }`}
                    >
                      {r.status === 'present' ? 'Present' : 'Absent'}
                    </span>
                  </td>
                </tr>
              ))}
              {records.length === 0 && (
                <tr>
                  <td
                    colSpan={2}
                    className="px-4 py-6 text-center text-xs text-slate-500"
                  >
                    No attendance records yet.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default ViewAttendance;

