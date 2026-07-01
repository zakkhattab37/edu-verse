import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import useAuthStore from '../store/authStore';
import useInstructorStore from '../store/instructorStore';
import InstructorDashboardOverview from '../components/instructor/InstructorDashboardOverview';
import InstructorCoursesTab from '../components/instructor/InstructorCoursesTab';
import InstructorStudentsTab from '../components/instructor/InstructorStudentsTab';
import InstructorGradingTab from '../components/instructor/InstructorGradingTab';
import {
  BookOpen, Users, LayoutDashboard, BarChart2,
  Settings, BrainCircuit, CheckSquare, Bell, MessageSquare,
  ChevronDown, Plus, LogOut, AlertCircle, Loader
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const InstructorDashboard = () => {
  const [activeMenu, setActiveMenu] = useState('Dashboard');
  const navigate = useNavigate();
  const { user, logout } = useAuthStore();

  const {
    dashboardData,
    students,
    isLoading,
    studentsLoading,
    error,
    fetchInstructorDashboard,
    fetchInstructorStudents
  } = useInstructorStore();

  useEffect(() => {
    fetchInstructorDashboard();
  }, [fetchInstructorDashboard]);

  useEffect(() => {
    if (activeMenu === 'Students') {
      fetchInstructorStudents();
    }
  }, [activeMenu, fetchInstructorStudents]);

  const pendingCount = dashboardData?.pendingTasks?.length || 0;

  const menuItems = [
    { name: 'Dashboard', icon: <LayoutDashboard size={19} /> },
    { name: 'My Courses', icon: <BookOpen size={19} /> },
    { name: 'Students', icon: <Users size={19} /> },
    { name: 'Grading Queue', icon: <CheckSquare size={19} />, badge: pendingCount > 0 ? pendingCount : null },
    { name: 'Settings', icon: <Settings size={19} /> },
  ];

  const renderContent = () => {
    if (isLoading && !dashboardData) {
      return (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '60vh', gap: '16px', color: '#6b7280' }}>
          <Loader size={40} style={{ animation: 'spin 1s linear infinite', color: '#6366f1' }} />
          <p style={{ fontSize: '16px' }}>Loading your dashboard...</p>
        </div>
      );
    }

    if (error && !dashboardData) {
      return (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '60vh', gap: '16px', color: '#dc2626' }}>
          <AlertCircle size={48} />
          <p style={{ fontSize: '16px', fontWeight: 600 }}>Failed to load dashboard</p>
          <p style={{ fontSize: '14px', color: '#6b7280' }}>{error}</p>
          <button onClick={fetchInstructorDashboard} style={{ padding: '10px 24px', background: '#6366f1', color: '#fff', border: 'none', borderRadius: '10px', fontWeight: 600, cursor: 'pointer' }}>Retry</button>
        </div>
      );
    }

    switch (activeMenu) {
      case 'Dashboard':
        return <InstructorDashboardOverview data={dashboardData} onTabChange={setActiveMenu} />;
      case 'My Courses':
        return <InstructorCoursesTab data={dashboardData} />;
      case 'Students':
        return <InstructorStudentsTab students={students} studentsLoading={studentsLoading} />;
      case 'Grading Queue':
        return <InstructorGradingTab pendingTasks={dashboardData?.pendingTasks || []} onGraded={fetchInstructorDashboard} />;
      case 'Settings':
        return <InstructorSettingsTab user={dashboardData?.user} />;
      default:
        return <InstructorDashboardOverview data={dashboardData} onTabChange={setActiveMenu} />;
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
          <div style={{ width: '38px', height: '38px', background: 'linear-gradient(135deg, #6366f1, #8b5cf6)', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <BrainCircuit size={22} color="#fff" />
          </div>
          <div>
            <div style={{ color: '#fff', fontWeight: 800, fontSize: '17px', letterSpacing: '-0.3px' }}>EduVerse</div>
            <div style={{ fontSize: '11px', color: '#64748b', fontWeight: 500 }}>Instructor Portal</div>
          </div>
        </div>

        {/* Instructor Profile Card */}
        <div style={{ margin: '0 16px 20px', background: 'rgba(255,255,255,0.05)', borderRadius: '12px', padding: '16px', display: 'flex', alignItems: 'center', gap: '12px', border: '1px solid rgba(255,255,255,0.08)' }}>
          <img
            src={user?.avatar || `https://i.pravatar.cc/150?u=${user?.id}`}
            alt={user?.name}
            style={{ width: '42px', height: '42px', borderRadius: '50%', border: '2px solid #6366f1', flexShrink: 0, objectFit: 'cover' }}
          />
          <div style={{ overflow: 'hidden' }}>
            <div style={{ color: '#fff', fontWeight: 700, fontSize: '14px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{user?.name || 'Instructor'}</div>
            <div style={{ fontSize: '11px', color: '#64748b', fontWeight: 500 }}>Instructor · EduVerse</div>
          </div>
        </div>

        {/* Navigation */}
        <nav style={{ display: 'flex', flexDirection: 'column', gap: '2px', padding: '0 12px', flex: 1, overflowY: 'auto' }}>
          {menuItems.map(item => {
            const isActive = activeMenu === item.name;
            return (
              <div
                key={item.name}
                onClick={() => setActiveMenu(item.name)}
                style={{
                  display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                  padding: '11px 14px', borderRadius: '10px', cursor: 'pointer',
                  background: isActive ? 'linear-gradient(135deg, #6366f1, #8b5cf6)' : 'transparent',
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
                {item.badge && (
                  <span style={{ background: '#f59e0b', color: '#fff', fontSize: '11px', fontWeight: 700, borderRadius: '12px', padding: '2px 8px', minWidth: '22px', textAlign: 'center' }}>
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
              {dashboardData?.courses?.length || 0} course{dashboardData?.courses?.length !== 1 ? 's' : ''} · {dashboardData?.totalStudents || 0} students
            </p>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <button
              onClick={() => setActiveMenu('My Courses')}
              style={{ display: 'flex', alignItems: 'center', gap: '8px', background: 'linear-gradient(135deg, #6366f1, #8b5cf6)', color: '#fff', border: 'none', padding: '10px 20px', borderRadius: '10px', cursor: 'pointer', fontSize: '14px', fontWeight: 600, boxShadow: '0 2px 8px rgba(99,102,241,0.3)' }}
            >
              <Plus size={16} /> New Course
            </button>
            <div style={{ position: 'relative', width: '40px', height: '40px', background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: '#64748b' }}>
              <Bell size={18} />
              {pendingCount > 0 && <span style={{ position: 'absolute', top: '-4px', right: '-4px', background: '#f59e0b', width: '16px', height: '16px', borderRadius: '50%', fontSize: '9px', color: '#fff', fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center', border: '2px solid #fff' }}>{pendingCount}</span>}
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

// ─── Inline Settings Tab ───────────────────────────────────────────
const InstructorSettingsTab = ({ user: profileData }) => {
  const [form, setForm] = useState({ name: profileData?.name || '', bio: profileData?.bio || '' });
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const { fetchInstructorDashboard } = useInstructorStore();
  const token = localStorage.getItem('token');

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await fetch('http://localhost:5000/api/dashboard/settings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ name: form.name, bio: form.bio })
      });
      await fetchInstructorDashboard();
      setSaved(true);
      setTimeout(() => setSaved(false), 2500);
    } catch {
      // silently fail
    } finally {
      setSaving(false);
    }
  };

  return (
    <div style={{ maxWidth: '540px' }}>
      <h2 style={{ margin: '0 0 24px', fontSize: '22px', fontWeight: 700, color: '#111827' }}>Account Settings</h2>
      <div style={{ background: '#fff', borderRadius: '14px', border: '1px solid #e5e7eb', padding: '28px', boxShadow: '0 1px 4px rgba(0,0,0,0.06)' }}>
        {saved && <p style={{ background: '#d1fae5', color: '#065f46', padding: '10px 16px', borderRadius: '8px', fontSize: '14px', marginBottom: '16px' }}>✓ Profile updated successfully!</p>}
        <form onSubmit={handleSave} style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
          <div>
            <label style={{ fontSize: '13px', fontWeight: 600, color: '#374151', display: 'block', marginBottom: '6px' }}>Full Name</label>
            <input value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} style={{ width: '100%', padding: '10px 14px', border: '1px solid #d1d5db', borderRadius: '8px', fontSize: '14px', boxSizing: 'border-box' }} />
          </div>
          <div>
            <label style={{ fontSize: '13px', fontWeight: 600, color: '#374151', display: 'block', marginBottom: '6px' }}>Bio</label>
            <textarea value={form.bio} onChange={e => setForm(f => ({ ...f, bio: e.target.value }))} rows={4} placeholder="Tell students about yourself..." style={{ width: '100%', padding: '10px 14px', border: '1px solid #d1d5db', borderRadius: '8px', fontSize: '14px', resize: 'vertical', boxSizing: 'border-box' }} />
          </div>
          <button type="submit" disabled={saving} style={{ padding: '11px', background: 'linear-gradient(135deg, #6366f1, #8b5cf6)', color: '#fff', border: 'none', borderRadius: '10px', fontWeight: 700, fontSize: '15px', cursor: 'pointer', opacity: saving ? 0.7 : 1 }}>
            {saving ? 'Saving...' : 'Save Changes'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default InstructorDashboard;
