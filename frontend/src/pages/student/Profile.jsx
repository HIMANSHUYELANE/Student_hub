import React, { useEffect, useState } from 'react';
import api from '../../api/axios';
import { useAuth } from '../../context/AuthContext';

const Profile = () => {
  const { user } = useAuth();
  const [student, setStudent] = useState(null);

  useEffect(() => {
    const load = async () => {
      if (!user?.studentId) return;
      try {
        const res = await api.get(`/dashboard/student/${user.studentId}`);
        setStudent(res.data.student);
      } catch (e) {
        console.error(e);
      }
    };
    load();
  }, [user]);

  if (!user?.studentId) {
    return (
      <div className="text-sm text-slate-500">
        No linked student profile. Please contact your administrator.
      </div>
    );
  }

  return (
    <div className="max-w-xl space-y-4">
      <div>
        <h1 className="text-xl font-semibold text-slate-900">Profile</h1>
        <p className="mt-1 text-sm text-slate-500">
          Your basic student information.
        </p>
      </div>
      <div className="card space-y-2 text-sm text-slate-700">
        <p>
          <span className="font-semibold">Name:</span> {student?.name}
        </p>
        <p>
          <span className="font-semibold">Roll Number:</span> {student?.rollNumber}
        </p>
        <p>
          <span className="font-semibold">Class:</span> {student?.className}
        </p>
        <p>
          <span className="font-semibold">Email:</span> {student?.email}
        </p>
        <p>
          <span className="font-semibold">Phone:</span> {student?.phone}
        </p>
        <p>
          <span className="font-semibold">Address:</span> {student?.address}
        </p>
      </div>
    </div>
  );
};

export default Profile;

