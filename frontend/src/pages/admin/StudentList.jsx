import React, { useEffect, useState } from 'react';
import api from '../../api/axios';

const StudentList = () => {
  const [students, setStudents] = useState([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);

  const fetchStudents = async () => {
    setLoading(true);
    try {
      const res = await api.get('/students', {
        params: { search: search || undefined }
      });
      setStudents(res.data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStudents();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this student?')) return;
    try {
      await api.delete(`/students/${id}`);
      setStudents((prev) => prev.filter((s) => s._id !== id));
    } catch (e) {
      console.error(e);
    }
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    fetchStudents();
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between gap-3">
        <div>
          <h1 className="text-xl font-semibold text-slate-900">Students</h1>
          <p className="mt-1 text-sm text-slate-500">
            View, search and manage student records.
          </p>
        </div>
      </div>
      <form
        onSubmit={handleSearchSubmit}
        className="flex flex-col gap-2 rounded-xl bg-white p-3 shadow-sm ring-1 ring-slate-200 md:flex-row md:items-center"
      >
        <input
          type="text"
          className="input md:max-w-xs"
          placeholder="Search by name or roll number"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <div className="flex gap-2">
          <button type="submit" className="btn-primary">
            Search
          </button>
          <button
            type="button"
            className="rounded-lg border border-slate-300 px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100"
            onClick={() => {
              setSearch('');
              fetchStudents();
            }}
          >
            Reset
          </button>
        </div>
      </form>
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
                <th className="px-4 py-2 text-left text-[11px] font-semibold uppercase tracking-wide text-slate-500">
                  Class
                </th>
                <th className="px-4 py-2 text-left text-[11px] font-semibold uppercase tracking-wide text-slate-500">
                  Email
                </th>
                <th className="px-4 py-2 text-right text-[11px] font-semibold uppercase tracking-wide text-slate-500">
                  Actions
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
                  <td className="px-4 py-2 text-xs text-slate-700">{s.className}</td>
                  <td className="px-4 py-2 text-xs text-slate-600">{s.email || '-'}</td>
                  <td className="px-4 py-2 text-right text-xs">
                    <button
                      onClick={() => handleDelete(s._id)}
                      className="rounded-lg border border-red-200 px-2.5 py-1 text-xs font-medium text-red-600 hover:bg-red-50"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
              {!loading && students.length === 0 && (
                <tr>
                  <td
                    colSpan={5}
                    className="px-4 py-6 text-center text-xs text-slate-500"
                  >
                    No students found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        {loading && (
          <div className="border-t border-slate-200 px-4 py-2 text-xs text-slate-500">
            Loading…
          </div>
        )}
      </div>
    </div>
  );
};

export default StudentList;

