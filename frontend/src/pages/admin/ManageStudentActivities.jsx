import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../../api/axios';

const ManageStudentActivities = () => {
  const { studentId } = useParams();
  const navigate = useNavigate();
  const [student, setStudent] = useState(null);
  const [studentActivities, setStudentActivities] = useState([]);
  const [allActivities, setAllActivities] = useState([]);
  const [loading, setLoading] = useState(true);
  
  const [selectedActivityId, setSelectedActivityId] = useState('');
  const [achievement, setAchievement] = useState('Participant');

  const fetchData = async () => {
    try {
      const [studentRes, myActsRes, allActsRes] = await Promise.all([
        api.get(`/students/${studentId}`),
        api.get(`/activities/student/${studentId}`),
        api.get('/activities')
      ]);
      setStudent(studentRes.data);
      setStudentActivities(myActsRes.data);
      setAllActivities(allActsRes.data);
    } catch (e) {
      console.error(e);
      alert('Failed to load data.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [studentId]);

  const handleAssign = async (e) => {
    e.preventDefault();
    if (!selectedActivityId) return alert('Select an activity');
    
    try {
      await api.post(`/activities/${selectedActivityId}/participate`, { studentId, achievement });
      setSelectedActivityId('');
      setAchievement('Participant');
      fetchData(); // Refresh list
    } catch (e) {
      console.error(e);
      alert(e.response?.data?.message || 'Failed to assign activity');
    }
  };

  if (loading) return <div className="text-sm text-slate-500">Loading student details...</div>;
  if (!student) return <div className="text-sm text-red-500">Student not found</div>;

  // Filter out activities the student is already in
  const unassignedActivities = allActivities.filter(
    (act) => !studentActivities.some((sa) => sa._id === act._id)
  );

  return (
    <div className="space-y-6">
      <div>
        <button onClick={() => navigate('/admin/students')} className="text-sm text-indigo-600 hover:text-indigo-800 mb-2 inline-flex items-center">
          &larr; Back to Students List
        </button>
        <h1 className="text-xl font-semibold text-slate-900">Manage Activities for {student.name}</h1>
        <p className="mt-1 text-sm text-slate-500">Roll No: {student.rollNumber} &middot; Class: {student.className}</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1">
          <div className="card space-y-4">
            <h2 className="text-sm font-semibold text-slate-800">Assign to Event</h2>
            {unassignedActivities.length === 0 ? (
              <p className="text-xs text-slate-500">This student is already assigned to all existing activities or no activities exist.</p>
            ) : (
              <form onSubmit={handleAssign} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700">Select Activity</label>
                  <select
                    className="input-field mt-1"
                    value={selectedActivityId}
                    onChange={(e) => setSelectedActivityId(e.target.value)}
                    required
                  >
                    <option value="">Select an activity...</option>
                    {unassignedActivities.map(act => (
                      <option key={act._id} value={act._id}>{act.name} {act.title ? `- ${act.title}` : ''}</option>
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
                <button type="submit" className="btn-primary w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700">
                  Assign Student
                </button>
              </form>
            )}
          </div>
        </div>

        <div className="lg:col-span-2 space-y-4">
          <h2 className="text-lg font-semibold text-slate-800">Current Extracurriculars</h2>
          <div className="bg-white border text-sm border-slate-200 rounded-lg overflow-hidden shadow-sm">
            {studentActivities.length === 0 ? (
              <div className="p-4 text-slate-500">No activities recorded for this student.</div>
            ) : (
              <table className="min-w-full divide-y divide-slate-200">
                <thead className="bg-slate-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Event Name</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Category</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Achievement</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-slate-200">
                  {studentActivities.map(act => (
                    <tr key={act._id}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-900">{act.name} {act.title ? `- ${act.title}` : ''}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">{act.category}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          act.achievement === 'Winner' ? 'bg-green-100 text-green-800' : 
                          act.achievement.includes('Runner-up') ? 'bg-yellow-100 text-yellow-800' :
                          'bg-slate-100 text-slate-800'
                        }`}>
                          {act.achievement}
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

export default ManageStudentActivities;
