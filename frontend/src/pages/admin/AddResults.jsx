import React, { useEffect, useState } from 'react';
import api from '../../api/axios';

const emptySubject = { name: '', marks: '' };

const AddResults = () => {
  const [students, setStudents] = useState([]);
  const [selectedStudentId, setSelectedStudentId] = useState('');
  const [term, setTerm] = useState('');
  const [subjects, setSubjects] = useState([{ ...emptySubject }]);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    const load = async () => {
      try {
        const res = await api.get('/students');
        setStudents(res.data);
      } catch (e) {
        console.error(e);
      }
    };
    load();
  }, []);

  const handleSubjectChange = (index, field, value) => {
    setSubjects((prev) => {
      const copy = [...prev];
      copy[index] = { ...copy[index], [field]: value };
      return copy;
    });
  };

  const addSubjectRow = () => {
    setSubjects((prev) => [...prev, { ...emptySubject }]);
  };

  const removeSubjectRow = (index) => {
    setSubjects((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedStudentId || !term) {
      setMessage('Please select student and term.');
      return;
    }
    const cleanedSubjects = subjects
      .filter((s) => s.name && s.marks !== '')
      .map((s) => ({ name: s.name, marks: Number(s.marks) }));

    if (!cleanedSubjects.length) {
      setMessage('Please add at least one subject.');
      return;
    }

    setSaving(true);
    setMessage('');

    try {
      await api.post('/results', {
        studentId: selectedStudentId,
        term,
        subjects: cleanedSubjects
      });
      setMessage('Results saved successfully.');
    } catch (e) {
      setMessage(e.response?.data?.message || 'Failed to save results.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-xl font-semibold text-slate-900">Add / Update Results</h1>
        <p className="mt-1 text-sm text-slate-500">
          Assign marks per subject for a student and term.
        </p>
      </div>
      <form onSubmit={handleSubmit} className="card space-y-4">
        <div className="grid gap-4 md:grid-cols-3">
          <div>
            <label className="label">Student</label>
            <select
              className="input"
              value={selectedStudentId}
              onChange={(e) => setSelectedStudentId(e.target.value)}
              required
            >
              <option value="">Select student</option>
              {students.map((s) => (
                <option key={s._id} value={s._id}>
                  {s.name} ({s.rollNumber})
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="label">Term / Exam</label>
            <input
              className="input"
              value={term}
              onChange={(e) => setTerm(e.target.value)}
              placeholder="Midterm, Final, etc."
              required
            />
          </div>
        </div>
        <div>
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-semibold text-slate-800">Subjects</h2>
            <button
              type="button"
              onClick={addSubjectRow}
              className="rounded-lg border border-slate-300 px-3 py-1.5 text-xs font-medium text-slate-700 hover:bg-slate-50"
            >
              Add Subject
            </button>
          </div>
          <div className="mt-3 space-y-2">
            {subjects.map((subject, index) => (
              <div
                key={index}
                className="grid gap-2 rounded-lg border border-slate-200 bg-slate-50/80 p-3 md:grid-cols-[2fr,1fr,auto]"
              >
                <input
                  className="input"
                  placeholder="Subject name"
                  value={subject.name}
                  onChange={(e) =>
                    handleSubjectChange(index, 'name', e.target.value)
                  }
                />
                <input
                  className="input"
                  type="number"
                  min="0"
                  max="100"
                  placeholder="Marks"
                  value={subject.marks}
                  onChange={(e) =>
                    handleSubjectChange(index, 'marks', e.target.value)
                  }
                />
                <button
                  type="button"
                  onClick={() => removeSubjectRow(index)}
                  className="mt-2 rounded-lg border border-slate-300 px-3 py-1.5 text-xs font-medium text-slate-600 hover:bg-slate-100 md:mt-0"
                >
                  Remove
                </button>
              </div>
            ))}
          </div>
        </div>
        {message && (
          <div className="rounded-md bg-slate-50 px-3 py-2 text-xs text-slate-600">
            {message}
          </div>
        )}
        <button type="submit" className="btn-primary" disabled={saving}>
          {saving ? 'Saving…' : 'Save Results'}
        </button>
      </form>
    </div>
  );
};

export default AddResults;

