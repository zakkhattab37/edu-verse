import { BookOpen, Search, Bell, LayoutDashboard, FileText, Award, Settings, Book, LogOut } from 'lucide-react';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import useDashboardStore from '../store/dashboardStore';
import useAuthStore from '../store/authStore';
import { motion, AnimatePresence } from 'framer-motion';

import DashboardOverview from '../components/dashboard/DashboardOverview';
import CoursesTab from '../components/dashboard/CoursesTab';
import AssignmentsTab from '../components/dashboard/AssignmentsTab';
import GradesTab from '../components/dashboard/GradesTab';
import ResourcesTab from '../components/dashboard/ResourcesTab';
import SettingsTab from '../components/dashboard/SettingsTab';

const Dashboard = () => {
  const [activeMenu, setActiveMenu] = useState('Dashboard');
  const navigate = useNavigate();
  const { user, logout } = useAuthStore();
  const { fetchDashboardData } = useDashboardStore();

  useEffect(() => {
    fetchDashboardData();
  }, [fetchDashboardData]);

  const menuItems = [
    { name: 'Dashboard', icon: <LayoutDashboard size={20} /> },
    { name: 'Courses', icon: <BookOpen size={20} /> },
    { name: 'Assignments', icon: <FileText size={20} /> },
    { name: 'Grades', icon: <Award size={20} /> },
    { name: 'Resources', icon: <Book size={20} /> },
    { name: 'Settings', icon: <Settings size={20} /> }
  ];

  const renderActiveTab = () => {
    switch (activeMenu) {
      case 'Dashboard': return <DashboardOverview key="dashboard" />;
      case 'Courses': return <CoursesTab key="courses" />;
      case 'Assignments': return <AssignmentsTab key="assignments" />;
      case 'Grades': return <GradesTab key="grades" />;
      case 'Resources': return <ResourcesTab key="resources" />;
      case 'Settings': return <SettingsTab key="settings" />;
      default: return <DashboardOverview key="default" />;
    }
  };

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: '#F9FAFB', fontFamily: 'Inter, sans-serif' }}>
      
      {/* Sidebar */}
      <aside style={{ width: '260px', background: '#111827', color: '#9CA3AF', display: 'flex', flexDirection: 'column', padding: '24px 16px' }}>
         <div style={{ display: 'flex', alignItems: 'center', gap: '12px', color: '#FFFFFF', fontWeight: 'bold', fontSize: '20px', padding: '0 12px', marginBottom: '40px' }}>
            <BookOpen size={28} color="var(--accent-primary)" />
            <span>EDUVERSE</span>
         </div>

         <nav style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {menuItems.map(item => (
              <div 
                key={item.name}
                onClick={() => setActiveMenu(item.name)}
                style={{
                  display: 'flex', alignItems: 'center', gap: '16px', padding: '12px 16px', borderRadius: '8px', cursor: 'pointer',
                  background: activeMenu === item.name ? 'var(--accent-primary)' : 'transparent',
                  color: activeMenu === item.name ? '#FFFFFF' : 'inherit',
                  transition: 'all 0.2s'
                }}
              >
                {item.icon}
                <span style={{ fontWeight: 500 }}>{item.name}</span>
              </div>
            ))}
         </nav>

         <div 
            onClick={() => {
              logout();
              navigate('/login');
            }}
            style={{
              display: 'flex', alignItems: 'center', gap: '16px', padding: '12px 16px', borderRadius: '8px', cursor: 'pointer',
              color: '#9CA3AF', marginTop: 'auto',
              transition: 'color 0.2s'
            }}
            onMouseOver={(e) => e.currentTarget.style.color = '#F87171'}
            onMouseOut={(e) => e.currentTarget.style.color = '#9CA3AF'}
         >
            <LogOut size={20} />
            <span style={{ fontWeight: 500 }}>Sign Out</span>
         </div>
      </aside>

      {/* Main Content Area */}
      <main style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
         
         {/* Top Navigation Bar */}
         <header style={{ height: '80px', background: '#FFFFFF', borderBottom: '1px solid #E5E7EB', display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 40px' }}>
            <div style={{ position: 'relative', width: '400px' }}>
               <Search size={18} style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', color: '#9CA3AF' }} />
               <input 
                 type="text" 
                 placeholder="Search courses, topics, or ask AI..." 
                 style={{ width: '100%', padding: '12px 16px 12px 48px', background: '#F3F4F6', border: '1px solid transparent', borderRadius: '8px', outline: 'none', fontSize: '14px' }}
               />
            </div>
            
            <div style={{ display: 'flex', alignItems: 'center', gap: '24px' }}>
               <div style={{ position: 'relative', cursor: 'pointer', color: '#6B7280' }}>
                  <Bell size={24} />
                  <div style={{ position: 'absolute', top: 0, right: 0, width: '8px', height: '8px', background: 'var(--danger)', borderRadius: '50%' }}></div>
               </div>
               <div style={{ display: 'flex', alignItems: 'center', gap: '12px', cursor: 'pointer' }}>
                  <img src="https://i.pravatar.cc/150?u=4" alt={user?.name || "Student"} style={{ width: '40px', height: '40px', borderRadius: '50%' }} />
                  <span style={{ fontWeight: 600, color: '#111827', fontSize: '14px' }}>{user?.name || "Student"}</span>
               </div>
            </div>
         </header>

         {/* Dashboard Content */}
         <div style={{ padding: '40px', flex: 1, overflowY: 'auto', position: 'relative' }}>
            <AnimatePresence mode="wait">
               {renderActiveTab()}
            </AnimatePresence>
         </div>
      </main>
    </div>
  );
};

export default Dashboard;
