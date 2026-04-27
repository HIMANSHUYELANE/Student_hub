import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../../api/axios';

const ActivityDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [activity, setActivity] = useState(null);
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  
  const [studentId, setStudentId] = useState('');
  const [achievement, setAchievement] = useState('Participant');

  const fetchActivity = async () => {
    try {
      const res = await api.get(`/activities/${id}`);
      setActivity(res.data);
    } catch (e) {
      console.error(e);
      alert('Failed to load activity');
    }
  };

  const fetchStudents = async () => {
    try {
      const res = await api.get('/students');
      setStudents(res.data);
    } catch (e) {
      console.error('Failed to load students', e);
    }
  };

  useEffect(() => {
    const init = async () => {
      await fetchActivity();
      await fetchStudents();
      setLoading(false);
    };
    init();
  }, [id]);

  const handleAddParticipant = async (e) => {
    e.preventDefault();
    if (!studentId) return alert('Select a student');
    
    try {
      await api.post(`/activities/${id}/participate`, { studentId, achievement });
      setStudentId('');
      setAchievement('Participant');
      fetchActivity(); // Refresh details
    } catch (e) {
      console.error(e);
      alert(e.response?.data?.message || 'Failed to add participant');
    }
  };

  if (loading) return <div className="text-sm text-slate-500">Loading activity...</div>;
  if (!activity) return null;

  return (
    <div className="space-y-6">
      <div>
        <button onClick={() => navigate('/admin/activities')} className="text-sm text-indigo-600 hover:text-indigo-800 mb-2 inline-flex items-center">
          &larr; Back to Activities
        </button>
        <h1 className="text-2xl font-bold text-slate-900">{activity.name} {activity.title ? `- ${activity.title}` : ''}</h1>
        <p className="mt-1 text-sm text-slate-500">{new Date(activity.date).toLocaleDateString()} &middot; Category: {activity.category}</p>
        {activity.description && <p className="mt-2 text-sm text-slate-700">{activity.description}</p>}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1">
          <div className="card space-y-4">
            <h2 className="text-sm font-semibold text-slate-800">Assign Student Result</h2>
            <form onSubmit={handleAddParticipant} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700">Student</label>
                <select
                  className="input-field mt-1"
                  value={studentId}
                  onChange={(e) => setStudentId(e.target.value)}
                  required
                >
                  <option value="">Select a student...</option>
                  {students.map(s => (
                    <option key={s._id} value={s._id}>{s.name} ({s.rollNumber})</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700">Achievement</label>
                <select
                  className="input-field mt-1"
                  value={achievement}
                  onChange={(e) => setAchievement(e.target.value)}
                >
                  <option value="Participant">Participant</option>
                  <option value="Winner">Winner</option>
                  <option value="Runner-up">Runner-up</option>
                  <option value="1st Runner-up">1st Runner-up</option>
                  <option value="2nd Runner-up">2nd Runner-up</option>
                </select>
              </div>
              <button type="submit" className="btn-primary w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                Add Participant
              </button>
            </form>
          </div>
        </div>

        <div className="lg:col-span-2 space-y-4">
          <h2 className="text-lg font-semibold text-slate-800">Participants ({activity.participants.length})</h2>
          <div className="bg-white border text-sm border-slate-200 rounded-lg overflow-hidden shadow-sm">
            {activity.participants.length === 0 ? (
              <div className="p-4 text-slate-500">No participants added yet.</div>
            ) : (
              <table className="min-w-full divide-y divide-slate-200">
                <thead className="bg-slate-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Student</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Class</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Achievement</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-slate-200">
                  {activity.participants.map(p => (
                    <tr key={p._id}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-slate-900">{p.student.name}</div>
                        <div className="text-xs text-slate-500">{p.student.rollNumber}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">
                        {p.student.className}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          p.achievement === 'Winner' ? 'bg-green-100 text-green-800' : 
                          p.achievement.includes('Runner-up') ? 'bg-yellow-100 text-yellow-800' :
                          'bg-slate-100 text-slate-800'
                        }`}>
                          {p.achievement}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ActivityDetails;
