import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import DashboardLayout from '../components/layout/DashboardLayout';
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
    <DashboardLayout
      menuItems={menuItems}
      activeMenu={activeMenu}
      setActiveMenu={setActiveMenu}
    >
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
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
      </div>
    </DashboardLayout>
  );
};

export default AdminDashboard;
