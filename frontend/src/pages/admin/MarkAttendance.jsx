import React, { useEffect, useState } from 'react';
import api from '../../api/axios';

const MarkAttendance = () => {
  const [students, setStudents] = useState([]);
  const [date, setDate] = useState(() => new Date().toISOString().slice(0, 10));
  const [statusById, setStatusById] = useState({});
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const fetchStudents = async () => {
      try {
        const res = await api.get('/students');
        setStudents(res.data);
        const initial = {};
        res.data.forEach((s) => {
          initial[s._id] = 'present';
        });
        setStatusById(initial);
      } catch (e) {
        console.error(e);
      }
    };
    fetchStudents();
  }, []);

  const handleToggle = (id) => {
    setStatusById((prev) => ({
      ...prev,
      [id]: prev[id] === 'present' ? 'absent' : 'present'
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const records = students.map((s) => ({
        studentId: s._id,
        status: statusById[s._id] || 'absent'
      }));
      await api.post('/attendance/mark', {
        date,
        records
      });
      alert('Attendance saved.');
    } catch (e) {
      console.error(e);
      alert('Failed to save attendance.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between gap-3">
        <div>
          <h1 className="text-xl font-semibold text-slate-900">Mark Attendance</h1>
          <p className="mt-1 text-sm text-slate-500">
            Quickly mark present/absent for each student.
          </p>
        </div>
        <div className="card flex items-center gap-2">
          <label className="label mb-0">Date</label>
          <input
            type="date"
            className="input w-auto"
            value={date}
            onChange={(e) => setDate(e.target.value)}
          />
        </div>
      </div>
      <form onSubmit={handleSubmit} className="space-y-3">
        <div className="overflow-hidden rounded-xl bg-white shadow-sm ring-1 ring-slate-200">
          <div className="max-h-[480px] overflow-auto">
            <table className="min-w-full divide-y divide-slate-200 text-sm">
              <thead className="bg-slate-50">
                <tr>
                  <th className="px-4 py-2 text-left text-[11px] font-semibold uppercase tracking-wide text-slate-500">
                    Name
                  </th>
                  <th className="px-4 py-2 text-left text-[11px] font-semibold uppercase tracking-wide text-slate-500">
                    Roll No.
                  </th>
                  <th className="px-4 py-2 text-center text-[11px] font-semibold uppercase tracking-wide text-slate-500">
                    Status
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 bg-white">
                {students.map((s) => (
                  <tr key={s._id} className="hover:bg-slate-50/60">
                    <td className="px-4 py-2 text-sm text-slate-800">{s.name}</td>
                    <td className="px-4 py-2 text-xs font-mono text-slate-700">
                      {s.rollNumber}
                    </td>
                    <td className="px-4 py-2 text-center text-xs">
                      <button
                        type="button"
                        onClick={() => handleToggle(s._id)}
                        className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-medium ${
                          statusById[s._id] === 'present'
                            ? 'bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200'
                            : 'bg-rose-50 text-rose-700 ring-1 ring-rose-200'
                        }`}
                      >
                        {statusById[s._id] === 'present' ? 'Present' : 'Absent'}
                      </button>
                    </td>
                  </tr>
                ))}
                {students.length === 0 && (
                  <tr>
                    <td
                      colSpan={3}
                      className="px-4 py-6 text-center text-xs text-slate-500"
                    >
                      No students found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
        <button type="submit" className="btn-primary" disabled={saving}>
          {saving ? 'Saving…' : 'Save Attendance'}
        </button>
      </form>
    </div>
  );
};

export default MarkAttendance;

