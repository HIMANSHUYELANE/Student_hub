import React, { useEffect, useState } from 'react';
import api from '../../api/axios';
import { useAuth } from '../../context/AuthContext';

const MyActivities = () => {
  const { user } = useAuth();
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchActivities = async () => {
      if (!user?.studentId) {
        setLoading(false);
        return;
      }
      try {
        const res = await api.get(`/activities/student/${user.studentId}`);
        setActivities(res.data);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };
    fetchActivities();
  }, [user]);

  if (loading) return <div className="text-sm text-slate-500">Loading activities...</div>;

  if (!user?.studentId) {
    return (
      <div className="text-sm text-slate-500">
        No linked student profile. Please contact your administrator.
      </div>
    );
  }

  // Group activities by category for better display
  const groupedActivities = activities.reduce((acc, act) => {
    if (!acc[act.category]) acc[act.category] = [];
    acc[act.category].push(act);
    return acc;
  }, {});

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-semibold text-slate-900">Extracurricular Portfolio</h1>
        <p className="mt-1 text-sm text-slate-500">
          A record of your participation in sports, cultural, and technical events.
        </p>
      </div>

      {activities.length === 0 ? (
        <div className="card text-center py-10">
          <p className="text-slate-500">You haven't participated in any activities yet.</p>
        </div>
      ) : (
        <div className="space-y-8">
          {['Technical', 'Cultural', 'Sports'].map(cat => {
            const catActivities = groupedActivities[cat];
            if (!catActivities || catActivities.length === 0) return null;

            return (
              <div key={cat} className="space-y-4">
                <h2 className="text-lg font-semibold text-indigo-700 border-b pb-2">{cat} Events</h2>
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                  {catActivities.map(act => (
                    <div key={act._id} className="card relative overflow-hidden">
                      <div className="absolute top-0 right-0 p-2">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold ${
                          act.achievement === 'Winner' ? 'bg-amber-100 text-amber-800' :
                          act.achievement.includes('Runner') ? 'bg-slate-200 text-slate-800' :
                          'bg-indigo-50 text-indigo-700'
                        }`}>
                          {act.achievement}
                        </span>
                      </div>
                      <h3 className="text-md font-medium text-slate-900 pr-20">{act.name}</h3>
                      {act.title && <p className="text-sm font-medium text-slate-600 mt-1">{act.title}</p>}
                      <p className="text-xs text-slate-400 mt-2">{new Date(act.date).toLocaleDateString()}</p>
                      {act.description && <p className="text-xs text-slate-500 mt-3 line-clamp-3">{act.description}</p>}
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default MyActivities;
