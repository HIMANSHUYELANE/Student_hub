import React from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import LoginPage from './pages/auth/LoginPage';
import { RequireAuth } from './components/routing/RequireAuth';
import AdminLayout from './components/layout/AdminLayout';
import StudentLayout from './components/layout/StudentLayout';
import AdminDashboard from './pages/admin/AdminDashboard';
import StudentDashboard from './pages/student/StudentDashboard';
import StudentList from './pages/admin/StudentList';
import AddStudent from './pages/admin/AddStudent';
import MarkAttendance from './pages/admin/MarkAttendance';
import AddResults from './pages/admin/AddResults';
import ClassPerformance from './pages/admin/ClassPerformance';
import Profile from './pages/student/Profile';
import ViewAttendance from './pages/student/ViewAttendance';
import ViewResults from './pages/student/ViewResults';
import PerformanceAnalysis from './pages/student/PerformanceAnalysis';
import ActivityList from './pages/admin/ActivityList';
import ActivityDetails from './pages/admin/ActivityDetails';
import ManageStudentActivities from './pages/admin/ManageStudentActivities';
import MyActivities from './pages/student/MyActivities';
const App = () => {
  const { isAuthenticated, user } = useAuth();

  const DefaultRedirect = () => {
    if (!isAuthenticated) return <Navigate to="/login" replace />;
    if (user.role === 'admin') return <Navigate to="/admin/dashboard" replace />;
    return <Navigate to="/student/dashboard" replace />;
  };

  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />

      <Route element={<RequireAuth role="admin" />}>
        <Route element={<AdminLayout />}>
          <Route path="/admin/dashboard" element={<AdminDashboard />} />
          <Route path="/admin/students" element={<StudentList />} />
          <Route path="/admin/students/add" element={<AddStudent />} />
          <Route path="/admin/attendance" element={<MarkAttendance />} />
          <Route path="/admin/results" element={<AddResults />} />
          <Route path="/admin/performance" element={<ClassPerformance />} />
          <Route path="/admin/activities" element={<ActivityList />} />
          <Route path="/admin/activities/:id" element={<ActivityDetails />} />
          <Route path="/admin/students/:studentId/activities" element={<ManageStudentActivities />} />
        </Route>
      </Route>

      <Route element={<RequireAuth role="student" />}>
        <Route element={<StudentLayout />}>
          <Route path="/student/dashboard" element={<StudentDashboard />} />
          <Route path="/student/profile" element={<Profile />} />
          <Route path="/student/attendance" element={<ViewAttendance />} />
          <Route path="/student/results" element={<ViewResults />} />
          <Route path="/student/performance" element={<PerformanceAnalysis />} />
          <Route path="/student/activities" element={<MyActivities />} />
        </Route>
      </Route>

      <Route path="/" element={<DefaultRedirect />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

export default App;

