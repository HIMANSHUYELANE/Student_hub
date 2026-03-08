import React from 'react';
import { Link, NavLink, Outlet } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const StudentLayout = () => {
  const { user, logout } = useAuth();

  const navItems = [
    { to: '/student/dashboard', label: 'Dashboard' },
    { to: '/student/profile', label: 'Profile' },
    { to: '/student/attendance', label: 'Attendance' },
    { to: '/student/results', label: 'Results' },
    { to: '/student/performance', label: 'Performance' }
  ];

  return (
    <div className="flex min-h-screen bg-slate-50">
      <aside className="hidden w-60 flex-shrink-0 border-r border-slate-200 bg-white/80 backdrop-blur sm:block">
        <div className="flex items-center justify-between px-5 py-4">
          <Link to="/student/dashboard" className="text-lg font-semibold text-primary-600">
            My Studies
          </Link>
        </div>
        <nav className="mt-4 space-y-1 px-3">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                `flex items-center rounded-lg px-3 py-2 text-sm font-medium ${
                  isActive
                    ? 'bg-primary-50 text-primary-700'
                    : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                }`
              }
            >
              {item.label}
            </NavLink>
          ))}
        </nav>
      </aside>
      <div className="flex min-h-screen flex-1 flex-col">
        <header className="flex items-center justify-between border-b border-slate-200 bg-white/70 px-4 py-3 backdrop-blur">
          <div className="text-sm font-medium text-slate-700">
            Welcome, <span className="font-semibold">{user?.name}</span>
          </div>
          <button
            onClick={logout}
            className="rounded-lg border border-slate-300 px-3 py-1.5 text-sm font-medium text-slate-700 hover:bg-slate-100">
            Logout
          </button>
        </header>
        <main className="mx-auto flex w-full max-w-5xl flex-1 flex-col px-4 py-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default StudentLayout;