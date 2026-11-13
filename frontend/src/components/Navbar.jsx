import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { ArrowRight, LogOut, LayoutDashboard } from 'lucide-react';
import Logo from './Logo';

const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const token = localStorage.getItem('token');

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('adminUser');
    navigate('/admin/login');
  };

  const isAdminRoute = location.pathname.startsWith('/admin');

  return (
    <header className="w-full bg-white/95 backdrop-blur-md sticky top-0 z-40 border-b border-slate-100 transition-all shadow-[0_1px_3px_rgba(0,0,0,0.02)]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
        {/* Modern Brand Logo */}
        <Link to="/" className="outline-none">
          <Logo size="md" />
        </Link>

        {/* Action Controls */}
        <div className="flex items-center gap-3">
          {token ? (
            <div className="flex items-center gap-3">
              {!isAdminRoute ? (
                <Link
                  to="/admin/dashboard"
                  className="inline-flex items-center gap-2 bg-blue-50 text-blue-700 hover:bg-blue-100 px-4 py-2 rounded-full text-sm font-semibold transition"
                >
                  <LayoutDashboard className="w-4 h-4" />
                  Dashboard
                </Link>
              ) : (
                <Link
                  to="/"
                  className="text-sm font-medium text-slate-600 hover:text-blue-600 px-3 py-2 transition"
                >
                  View Site
                </Link>
              )}
              <button
                onClick={handleLogout}
                className="inline-flex items-center gap-1.5 text-sm font-medium text-rose-600 hover:bg-rose-50 px-3.5 py-2 rounded-full transition"
                title="Logout"
              >
                <LogOut className="w-4 h-4" />
                <span className="hidden sm:inline">Logout</span>
              </button>
            </div>
          ) : (
            <Link
              to="/admin/login"
              className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-semibold px-5 py-2.5 rounded-full text-sm shadow-md shadow-blue-500/20 transition-all hover:shadow-lg hover:shadow-blue-500/30 active:scale-95"
            >
              <span>Admin Login</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          )}
        </div>
      </div>
    </header>
  );
};

export default Navbar;
