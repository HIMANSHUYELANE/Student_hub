import React, { useState } from 'react';
import api from '../../api/axios';

const AddStudent = () => {
  const [form, setForm] = useState({
    name: '',
    rollNumber: '',
    className: '',
    email: '',
    phone: '',
    address: ''
  });
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setMessage('');
    try {
      await api.post('/students', form);
      setMessage('Student added successfully.');
      setForm({
        name: '',
        rollNumber: '',
        className: '',
        email: '',
        phone: '',
        address: ''
      });
    } catch (e) {
      setMessage(e.response?.data?.message || 'Failed to add student.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-xl space-y-4">
      <div>
        <h1 className="text-xl font-semibold text-slate-900">Add Student</h1>
        <p className="mt-1 text-sm text-slate-500">
          Create a new student record. A student login can be created using their email.
        </p>
      </div>
      <form onSubmit={handleSubmit} className="card space-y-4">
        <div className="grid gap-4 md:grid-cols-2">
          <div>
            <label className="label">Full Name</label>
            <input
              className="input"
              name="name"
              value={form.name}
              onChange={handleChange}
              required
            />
          </div>
          <div>
            <label className="label">Roll Number</label>
            <input
              className="input"
              name="rollNumber"
              value={form.rollNumber}
              onChange={handleChange}
              required
            />
          </div>
        </div>
        <div className="grid gap-4 md:grid-cols-2">
          <div>
            <label className="label">Class</label>
            <input
              className="input"
              name="className"
              value={form.className}
              onChange={handleChange}
              required
            />
          </div>
          <div>
            <label className="label">Email (for student login)</label>
            <input
              type="email"
              className="input"
              name="email"
              value={form.email}
              onChange={handleChange}
            />
          </div>
        </div>
        <div className="grid gap-4 md:grid-cols-2">
          <div>
            <label className="label">Phone</label>
            <input
              className="input"
              name="phone"
              value={form.phone}
              onChange={handleChange}
            />
          </div>
          <div>
            <label className="label">Address</label>
            <input
              className="input"
              name="address"
              value={form.address}
              onChange={handleChange}
            />
          </div>
        </div>
        {message && (
          <div className="rounded-md bg-slate-50 px-3 py-2 text-xs text-slate-600">
            {message}
          </div>
        )}
        <button type="submit" className="btn-primary" disabled={submitting}>
          {submitting ? 'Saving…' : 'Save Student'}
        </button>
      </form>
    </div>
  );
};

export default AddStudent;

