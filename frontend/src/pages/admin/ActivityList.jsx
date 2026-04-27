import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../../api/axios';

const ActivityList = () => {
  const [activities, setActivities] = parseInt ? useState([]) : React.useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    category: 'Sports',
    name: '',
    title: '',
    date: '',
    description: ''
  });

  const fetchActivities = async () => {
    try {
      const res = await api.get('/activities');
      setActivities(res.data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchActivities();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post('/activities', formData);
      setShowForm(false);
      setFormData({ category: 'Sports', name: '', title: '', date: '', description: '' });
      fetchActivities(); // Refresh list
    } catch (e) {
      console.error(e);
      alert('Failed to create activity');
    }
  };

  if (loading) return <div className="text-slate-500 text-sm">Loading activities...</div>;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-xl font-semibold text-slate-900">Extracurricular Activities</h1>
          <p className="mt-1 text-sm text-slate-500">Manage all sports, cultural, and technical events.</p>
        </div>
        <button
          onClick={() => setShowForm(!showForm)}
          className="btn-primary"
        >
          {showForm ? 'Cancel' : 'Add Activity'}
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className="card space-y-4">
          <h2 className="text-lg font-medium text-slate-800">Create New Activity</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700">Category</label>
              <select
                className="input-field mt-1"
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                required
              >
                <option value="Sports">Sports</option>
                <option value="Cultural">Cultural</option>
                <option value="Technical">Technical</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700">Event Type / Name</label>
              <input
                type="text"
                className="input-field mt-1"
                placeholder="e.g. Cricket, Hackathon"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700">Specific Title (Optional)</label>
              <input
                type="text"
                className="input-field mt-1"
                placeholder="e.g. Annual Inter-College Cup"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700">Date</label>
              <input
                type="date"
                className="input-field mt-1"
                value={formData.date}
                onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                required
              />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-slate-700">Description</label>
              <textarea
                className="input-field mt-1"
                rows="2"
                placeholder="Brief details about the event..."
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              />
            </div>
          </div>
          <div className="flex justify-end">
            <button type="submit" className="btn-primary flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
              Save Activity
            </button>
          </div>
        </form>
      )}

      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-sm">
        <ul className="divide-y divide-slate-200">
          {activities.length === 0 ? (
            <li className="px-6 py-4 text-sm text-slate-500">No activities found.</li>
          ) : (
            activities.map(act => (
              <li key={act._id} className="hover:bg-slate-50 transition-colors">
                <Link to={`/admin/activities\/${act._id}`} className="block px-6 py-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-indigo-600">{act.name} {act.title ? `- ${act.title}` : ''}</p>
                      <p className="text-xs text-slate-500 mt-1">{new Date(act.date).toLocaleDateString()} &middot; {act.category}</p>
                    </div>
                    <div>
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-slate-100 text-slate-800">
                        {act.category}
                      </span>
                    </div>
                  </div>
                </Link>
              </li>
            ))
          )}
        </ul>
      </div>
    </div>
  );
};

export default ActivityList;
