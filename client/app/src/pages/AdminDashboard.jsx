import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import useAuthStore from '../store/authStore';
import useAdminStore from '../store/adminStore';
import AdminOverviewTab from '../components/admin/AdminOverviewTab';
import AdminUsersTab from '../components/admin/AdminUsersTab';
import AdminCoursesTab from '../components/admin/AdminCoursesTab';
import {
  Shield, LayoutDashboard, Users, BookOpen,
  LogOut, Bell, AlertCircle, Loader
} from 'lucide-react';

const AdminDashboard = () => {
  const [activeMenu, setActiveMenu] = useState('Overview');
  const navigate = useNavigate();
  const { user, logout } = useAuthStore();
  const { overview, users, courses, isLoading, error, fetchOverview, fetchUsers, fetchCourses } = useAdminStore();

  // Guard: only Admin
  useEffect(() => {
    if (user && user.role !== 'Admin') navigate('/dashboard');
  }, [user, navigate]);

  // Load data based on active tab
  useEffect(() => {
    if (activeMenu === 'Overview') fetchOverview();
    if (activeMenu === 'Manage Users') fetchUsers();
    if (activeMenu === 'Manage Courses') fetchCourses();
  }, [activeMenu]);

  const menuItems = [
    { name: 'Overview',        icon: <LayoutDashboard size={19} /> },
    { name: 'Manage Users',    icon: <Users size={19} />,    badge: overview?.stats?.totalUsers },
    { name: 'Manage Courses',  icon: <BookOpen size={19} />, badge: overview?.stats?.pendingCourses || null },
  ];

  const renderContent = () => {
    if (isLoading && !overview && !users.length && !courses.length) {
      return (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '60vh', gap: '16px', color: '#6b7280' }}>
          <Loader size={40} color="#dc2626" style={{ animation: 'spin 1s linear infinite' }} />
          <p style={{ fontSize: '16px' }}>Loading admin panel...</p>
        </div>
      );
    }
    if (error && !overview) {
      return (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '60vh', gap: '16px', color: '#dc2626' }}>
          <AlertCircle size={48} />
          <p style={{ fontSize: '16px', fontWeight: 600 }}>Failed to load data</p>
          <p style={{ fontSize: '14px', color: '#6b7280' }}>{error}</p>
          <button onClick={() => { fetchOverview(); fetchUsers(); fetchCourses(); }} style={{ padding: '10px 24px', background: '#dc2626', color: '#fff', border: 'none', borderRadius: '10px', fontWeight: 600, cursor: 'pointer' }}>Retry</button>
        </div>
      );
    }
    switch (activeMenu) {
      case 'Overview':       return <AdminOverviewTab overview={overview} />;
      case 'Manage Users':   return <AdminUsersTab users={users} isLoading={isLoading} />;
      case 'Manage Courses': return <AdminCoursesTab courses={courses} isLoading={isLoading} />;
      default:               return <AdminOverviewTab overview={overview} />;
    }
  };

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: '#f8fafc', fontFamily: "'Inter', sans-serif" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap');
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        ::-webkit-scrollbar { width: 6px; }
        ::-webkit-scrollbar-track { background: transparent; }
        ::-webkit-scrollbar-thumb { background: #cbd5e1; border-radius: 3px; }
      `}</style>

      {/* Sidebar */}
      <aside style={{ width: '256px', background: 'linear-gradient(180deg, #0f172a 0%, #1e293b 100%)', color: '#94a3b8', display: 'flex', flexDirection: 'column', position: 'sticky', top: 0, height: '100vh', flexShrink: 0 }}>
        {/* Logo */}
        <div style={{ padding: '28px 24px 20px', display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div style={{ width: '38px', height: '38px', background: 'linear-gradient(135deg, #dc2626, #b91c1c)', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Shield size={22} color="#fff" />
          </div>
          <div>
            <div style={{ color: '#fff', fontWeight: 800, fontSize: '17px', letterSpacing: '-0.3px' }}>EduVerse</div>
            <div style={{ fontSize: '11px', color: '#64748b', fontWeight: 500 }}>Admin Panel</div>
          </div>
        </div>

        {/* Admin Profile Card */}
        <div style={{ margin: '0 16px 20px', background: 'rgba(255,255,255,0.05)', borderRadius: '12px', padding: '14px 16px', display: 'flex', alignItems: 'center', gap: '10px', border: '1px solid rgba(255,255,255,0.08)' }}>
          {user?.avatar ? (
            <img src={user.avatar} alt={user.name} style={{ width: '40px', height: '40px', borderRadius: '50%', objectFit: 'cover', flexShrink: 0, border: '2px solid #dc2626' }} />
          ) : (
            <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: 'linear-gradient(135deg, #dc2626, #b91c1c)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, color: '#fff', fontSize: '16px', flexShrink: 0 }}>
              {user?.name?.[0]?.toUpperCase() || 'A'}
            </div>
          )}
          <div>
            <div style={{ color: '#fff', fontWeight: 700, fontSize: '14px' }}>{user?.name || 'Admin'}</div>
            <div style={{ fontSize: '11px', color: '#ef4444', fontWeight: 600 }}>⚡ Super Admin</div>
          </div>
        </div>

        {/* Navigation */}
        <nav style={{ display: 'flex', flexDirection: 'column', gap: '2px', padding: '0 12px', flex: 1 }}>
          {menuItems.map(item => {
            const isActive = activeMenu === item.name;
            return (
              <div
                key={item.name}
                onClick={() => setActiveMenu(item.name)}
                style={{
                  display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                  padding: '11px 14px', borderRadius: '10px', cursor: 'pointer',
                  background: isActive ? 'linear-gradient(135deg, #dc2626, #b91c1c)' : 'transparent',
                  color: isActive ? '#fff' : '#94a3b8',
                  transition: 'all 0.2s',
                  fontWeight: isActive ? 600 : 400,
                }}
                onMouseOver={e => { if (!isActive) e.currentTarget.style.background = 'rgba(255,255,255,0.06)'; }}
                onMouseOut={e => { if (!isActive) e.currentTarget.style.background = 'transparent'; }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  {item.icon}
                  <span style={{ fontSize: '14px' }}>{item.name}</span>
                </div>
                {item.badge != null && item.badge > 0 && (
                  <span style={{ background: isActive ? 'rgba(255,255,255,0.25)' : '#dc2626', color: '#fff', fontSize: '11px', fontWeight: 700, borderRadius: '12px', padding: '2px 8px' }}>
                    {item.badge}
                  </span>
                )}
              </div>
            );
          })}
        </nav>

        {/* Sign Out */}
        <div
          onClick={() => { logout(); navigate('/login'); }}
          style={{ margin: '12px 12px 24px', display: 'flex', alignItems: 'center', gap: '12px', padding: '11px 14px', borderRadius: '10px', cursor: 'pointer', color: '#64748b', transition: 'all 0.2s' }}
          onMouseOver={e => { e.currentTarget.style.background = 'rgba(248,113,113,0.1)'; e.currentTarget.style.color = '#f87171'; }}
          onMouseOut={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = '#64748b'; }}
        >
          <LogOut size={18} />
          <span style={{ fontSize: '14px', fontWeight: 500 }}>Sign Out</span>
        </div>
      </aside>

      {/* Main Content */}
      <main style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
        {/* Top Bar */}
        <header style={{ height: '72px', background: '#fff', borderBottom: '1px solid #e2e8f0', display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 36px', flexShrink: 0 }}>
          <div>
            <h1 style={{ margin: 0, fontSize: '20px', fontWeight: 700, color: '#0f172a' }}>{activeMenu}</h1>
            <p style={{ margin: 0, fontSize: '13px', color: '#94a3b8' }}>
              {overview?.stats?.totalUsers || 0} users · {overview?.stats?.totalCourses || 0} courses · {overview?.stats?.totalEnrollments || 0} enrollments
            </p>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{ padding: '6px 14px', background: '#fef2f2', color: '#dc2626', borderRadius: '20px', fontSize: '12px', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '6px' }}>
              <span style={{ width: '7px', height: '7px', background: '#22c55e', borderRadius: '50%', display: 'inline-block' }} />
              All Systems Operational
            </div>
            <div style={{ position: 'relative', width: '40px', height: '40px', background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: '#64748b' }}>
              <Bell size={18} />
            </div>
          </div>
        </header>

        {/* Content */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '32px 36px' }}>
          <AnimatePresence mode="wait">
            <motion.div
              key={activeMenu}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.2 }}
            >
              {renderContent()}
            </motion.div>
          </AnimatePresence>
        </div>
      </main>
    </div>
  );
};

export default AdminDashboard;
