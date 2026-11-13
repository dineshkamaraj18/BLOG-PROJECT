import React from 'react';
import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import Blog from './pages/Blog';
import Login from './pages/admin/Login';
import Layout from './pages/admin/Layout';
import Dashboard from './pages/admin/Dashboard';
import AddBlog from './pages/admin/AddBlog';
import Command from './pages/admin/Command';
import Authors from './pages/admin/Authors';

// Layout wrapper to conditionally show public Navbar and Footer
const AppLayout = ({ children }) => {
  const location = useLocation();
  const isAdminDashboard = location.pathname.startsWith('/admin') && location.pathname !== '/admin/login';

  return (
    <div className="min-h-screen flex flex-col font-['Inter',sans-serif]">
      {!isAdminDashboard && <Navbar />}
      <main className="flex-1">{children}</main>
      {!isAdminDashboard && <Footer />}
    </div>
  );
};

function App() {
  return (
    <BrowserRouter>
      <AppLayout>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<Home />} />
          <Route path="/blog/:id" element={<Blog />} />

          {/* Admin Authentication */}
          <Route path="/admin/login" element={<Login />} />

          {/* Protected Admin Routes */}
          <Route path="/admin" element={<Layout />}>
            <Route index element={<Navigate to="/admin/dashboard" replace />} />
            <Route path="dashboard" element={<Dashboard />} />
            <Route path="add-blog" element={<AddBlog />} />
            <Route path="edit-blog/:id" element={<AddBlog />} />
            <Route path="comments" element={<Command />} />
            <Route path="authors" element={<Authors />} />
          </Route>

          {/* Catch-all redirect */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </AppLayout>
    </BrowserRouter>
  );
}

export default App;

