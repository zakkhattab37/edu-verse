import { useNavigate, Link } from 'react-router-dom';
import { useEffect, useState } from 'react';
import useAuthStore from '../store/authStore';
import useDashboardStore from '../store/dashboardStore';
import useCourseStore from '../store/courseStore';
import { motion } from 'framer-motion';
import {
  GraduationCap, BookOpen, BarChart2, Sparkles,
  ArrowRight, Bell, LogOut, LayoutDashboard,
  Trophy, Clock, TrendingUp, Star, ChevronRight, User, FileText
} from 'lucide-react';
import DashboardLayout from '../components/layout/DashboardLayout';

const CATEGORY_ICONS = {
  'Computer Science': '💻', 'Data Science': '📊', 'Mathematics': '📐',
  'Design': '🎨', 'Business': '💼', 'Languages': '🌐',
  'Engineering': '⚙️', 'Arts': '🎭', 'default': '📚'
};

const YEAR_COLORS = {
  'First':  { bg: '#eff6ff', color: '#3b82f6' },
  'Second': { bg: '#f0fdf4', color: '#16a34a' },
  'Third':  { bg: '#fdf4ff', color: '#9333ea' },
  'Fourth': { bg: '#fff7ed', color: '#ea580c' },
};

const StudentHome = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuthStore();
  const { fetchDashboardData, enrollments, assignments, quizzes, activities, isLoading } = useDashboardStore();
  const { courses, fetchCourses, enrollInCourse } = useCourseStore();
  const [enrollingId, setEnrollingId] = useState(null);

  useEffect(() => {
    fetchDashboardData();
    fetchCourses();
  }, [fetchDashboardData, fetchCourses]);

  const pendingAssignments = assignments.filter(a => a.status === 'submitted' || a.status === 'pending');
  const yearStyle = YEAR_COLORS[user?.academicYear] || { bg: '#f3f4f6', color: '#6b7280' };
  const catIcon = CATEGORY_ICONS[user?.category] || CATEGORY_ICONS.default;

  // Filter courses the student is NOT enrolled in yet
  const availableCourses = courses.filter(c => !enrollments.some(e => e.course_id === c.id));

  const handleEnroll = async (courseId) => {
    setEnrollingId(courseId);
    try {
      await enrollInCourse(courseId);
      await fetchDashboardData(); // Refresh dashboard counts
    } catch (err) {
      alert('Failed to enroll: ' + (err.response?.data?.message || err.message));
    } finally {
      setEnrollingId(null);
    }
  };
  const [activeMenu, setActiveMenu] = useState('Dashboard');
  const menuItems = [
    { name: 'Dashboard', icon: <LayoutDashboard size={18} /> },
    { name: 'My Courses', icon: <BookOpen size={18} /> },
    { name: 'Assignments', icon: <FileText size={18} /> },
    { name: 'Activity', icon: <Clock size={18} /> }
  ];

  useEffect(() => {
    if (activeMenu === 'Dashboard') document.getElementById('overview')?.scrollIntoView({ behavior: 'smooth' });
    if (activeMenu === 'My Courses') document.getElementById('courses')?.scrollIntoView({ behavior: 'smooth' });
    if (activeMenu === 'Assignments') document.getElementById('assignments')?.scrollIntoView({ behavior: 'smooth' });
    if (activeMenu === 'Activity') document.getElementById('activity')?.scrollIntoView({ behavior: 'smooth' });
  }, [activeMenu]);

  return (
    <DashboardLayout
      menuItems={menuItems}
      activeMenu={activeMenu}
      setActiveMenu={setActiveMenu}
    >
      <div style={{ minHeight: '100vh', background: '#f8fafc', fontFamily: "'Inter', sans-serif" }}>
      <style>{`
        @keyframes float { 0%, 100% { transform: translateY(0px); } 50% { transform: translateY(-10px); } }
        @keyframes pulse-glow { 0%, 100% { box-shadow: 0 0 0 0 rgba(99,102,241,0.2); } 50% { box-shadow: 0 0 0 12px rgba(99,102,241,0); } }
      `}</style>

      {/* ── Hero / Welcome Banner ── */}
      <section id="overview" style={{ background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 60%, #312e81 100%)', padding: '64px 48px', position: 'relative', overflow: 'hidden' }}>
        {/* Background glows */}
        <div style={{ position: 'absolute', top: '-60px', left: '-60px', width: '400px', height: '400px', background: 'radial-gradient(circle, rgba(99,102,241,0.25) 0%, transparent 70%)', pointerEvents: 'none' }} />
        <div style={{ position: 'absolute', bottom: '-80px', right: '-40px', width: '360px', height: '360px', background: 'radial-gradient(circle, rgba(139,92,246,0.2) 0%, transparent 70%)', pointerEvents: 'none' }} />

        <div style={{ maxWidth: '1200px', margin: '0 auto', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '48px', alignItems: 'center', position: 'relative' }}>
          {/* Left: Greeting */}
          <motion.div initial={{ opacity: 0, x: -30 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.7 }}>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', background: 'rgba(99,102,241,0.15)', border: '1px solid rgba(99,102,241,0.3)', borderRadius: '20px', padding: '6px 16px', marginBottom: '20px' }}>
              <Sparkles size={14} color="#a78bfa" />
              <span style={{ fontSize: '12px', color: '#a78bfa', fontWeight: 600 }}>AI-Powered Learning Platform</span>
            </div>
            <h1 style={{ fontSize: '42px', fontWeight: 800, color: '#fff', margin: '0 0 16px', lineHeight: 1.2, letterSpacing: '-1px' }}>
              Welcome back,<br />
              <span style={{ background: 'linear-gradient(135deg, #818cf8, #c084fc)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                {user?.name?.split(' ')[0] || 'Student'}! 👋
              </span>
            </h1>
            <p style={{ color: '#94a3b8', fontSize: '16px', lineHeight: 1.7, margin: '0 0 32px', maxWidth: '440px' }}>
              {(pendingAssignments.length > 0 || quizzes.length > 0)
                ? `You have ${pendingAssignments.length + quizzes.length} tasks due soon. Keep the momentum going!`
                : `You're all caught up! Continue exploring your ${enrollments.length} enrolled course${enrollments.length !== 1 ? 's' : ''}.`}
            </p>
            <button onClick={() => navigate('/dashboard')}
              style={{ display: 'inline-flex', alignItems: 'center', gap: '10px', padding: '14px 28px', background: 'linear-gradient(135deg, #6366f1, #8b5cf6)', color: '#fff', border: 'none', borderRadius: '12px', fontSize: '15px', fontWeight: 700, cursor: 'pointer', boxShadow: '0 4px 20px rgba(99,102,241,0.4)', animation: 'pulse-glow 2.5s infinite' }}
            >
              <LayoutDashboard size={18} /> Go to Full Dashboard <ArrowRight size={16} />
            </button>
          </motion.div>

          {/* Right: Student Profile Card */}
          <motion.div initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.7, delay: 0.1 }}>
            <div style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '20px', padding: '32px', backdropFilter: 'blur(10px)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '24px' }}>
                <div style={{ position: 'relative' }}>
                  <img src={user?.avatar || `https://i.pravatar.cc/150?u=${user?.id}`} alt={user?.name} style={{ width: '64px', height: '64px', borderRadius: '50%', border: '3px solid #6366f1', objectFit: 'cover' }} />
                  <div style={{ position: 'absolute', bottom: 0, right: 0, width: '18px', height: '18px', background: '#22c55e', borderRadius: '50%', border: '2px solid #1e293b' }} />
                </div>
                <div>
                  <h3 style={{ margin: 0, color: '#fff', fontWeight: 700, fontSize: '18px' }}>{user?.name}</h3>
                  <p style={{ margin: '3px 0 0', color: '#94a3b8', fontSize: '13px' }}>{user?.email}</p>
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                {user?.studentId && (
                  <div style={{ background: 'rgba(255,255,255,0.05)', borderRadius: '10px', padding: '12px 14px' }}>
                    <p style={{ margin: '0 0 3px', fontSize: '11px', color: '#64748b', fontWeight: 500 }}>STUDENT ID</p>
                    <p style={{ margin: 0, color: '#e2e8f0', fontWeight: 700, fontSize: '14px', letterSpacing: '0.5px' }}>{user.studentId}</p>
                  </div>
                )}
                {user?.academicYear && (
                  <div style={{ background: 'rgba(255,255,255,0.05)', borderRadius: '10px', padding: '12px 14px' }}>
                    <p style={{ margin: '0 0 3px', fontSize: '11px', color: '#64748b', fontWeight: 500 }}>YEAR</p>
                    <span style={{ ...yearStyle, padding: '3px 10px', borderRadius: '20px', fontSize: '12px', fontWeight: 700 }}>{user.academicYear} Year</span>
                  </div>
                )}
                {user?.category && (
                  <div style={{ background: 'rgba(255,255,255,0.05)', borderRadius: '10px', padding: '12px 14px' }}>
                    <p style={{ margin: '0 0 3px', fontSize: '11px', color: '#64748b', fontWeight: 500 }}>MAJOR</p>
                    <p style={{ margin: 0, color: '#e2e8f0', fontWeight: 600, fontSize: '13px' }}>{catIcon} {user.category}</p>
                  </div>
                )}
                {user?.phone && (
                  <div style={{ background: 'rgba(255,255,255,0.05)', borderRadius: '10px', padding: '12px 14px' }}>
                    <p style={{ margin: '0 0 3px', fontSize: '11px', color: '#64748b', fontWeight: 500 }}>PHONE</p>
                    <p style={{ margin: 0, color: '#e2e8f0', fontWeight: 600, fontSize: '13px' }}>{user.phone}</p>
                  </div>
                )}
              </div>

              {/* Quick stats */}
              <div style={{ display: 'flex', gap: '16px', marginTop: '16px' }}>
                <div style={{ flex: 1, textAlign: 'center', padding: '12px', background: 'rgba(99,102,241,0.1)', borderRadius: '10px', border: '1px solid rgba(99,102,241,0.2)' }}>
                  <p style={{ margin: 0, fontSize: '22px', fontWeight: 800, color: '#818cf8' }}>{enrollments.length}</p>
                  <p style={{ margin: '2px 0 0', fontSize: '11px', color: '#64748b' }}>Courses</p>
                </div>
                <div style={{ flex: 1, textAlign: 'center', padding: '12px', background: 'rgba(245,158,11,0.1)', borderRadius: '10px', border: '1px solid rgba(245,158,11,0.2)' }}>
                  <p style={{ margin: 0, fontSize: '22px', fontWeight: 800, color: '#fbbf24' }}>{pendingAssignments.length + quizzes.length}</p>
                  <p style={{ margin: '2px 0 0', fontSize: '11px', color: '#64748b' }}>Due Soon</p>
                </div>
                <div style={{ flex: 1, textAlign: 'center', padding: '12px', background: 'rgba(16,185,129,0.1)', borderRadius: '10px', border: '1px solid rgba(16,185,129,0.2)' }}>
                  <p style={{ margin: 0, fontSize: '22px', fontWeight: 800, color: '#34d399' }}>{activities.length}</p>
                  <p style={{ margin: '2px 0 0', fontSize: '11px', color: '#64748b' }}>Activities</p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ── My Courses ── */}
      <section id="courses" style={{ maxWidth: '1200px', margin: '0 auto', padding: '52px 24px 0' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
          <div>
            <h2 style={{ margin: 0, fontSize: '22px', fontWeight: 700, color: '#0f172a' }}>📚 My Enrolled Courses</h2>
            <p style={{ margin: '4px 0 0', color: '#64748b', fontSize: '14px' }}>{enrollments.length} course{enrollments.length !== 1 ? 's' : ''} active this semester</p>
          </div>
          <button onClick={() => navigate('/dashboard')} style={{ display: 'flex', alignItems: 'center', gap: '5px', padding: '9px 16px', background: '#eff6ff', color: '#6366f1', border: 'none', borderRadius: '9px', fontSize: '13px', fontWeight: 600, cursor: 'pointer' }}>
            View All <ChevronRight size={15} />
          </button>
        </div>

        {isLoading ? (
          <p style={{ color: '#9ca3af', textAlign: 'center', padding: '40px' }}>Loading courses...</p>
        ) : enrollments.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '60px', background: '#fff', borderRadius: '16px', border: '1px solid #e5e7eb' }}>
            <BookOpen size={48} style={{ color: '#d1d5db', marginBottom: '12px' }} />
            <p style={{ color: '#6b7280', fontSize: '16px' }}>You're not enrolled in any courses yet.</p>
            <button onClick={() => navigate('/dashboard')} style={{ marginTop: '12px', padding: '10px 22px', background: '#6366f1', color: '#fff', border: 'none', borderRadius: '10px', fontWeight: 600, cursor: 'pointer' }}>Browse Courses</button>
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '20px' }}>
            {enrollments.map((enr) => (
              <motion.div key={enr.id}
                whileHover={{ y: -4, boxShadow: '0 8px 24px rgba(0,0,0,0.12)' }}
                style={{ background: '#fff', borderRadius: '16px', border: '1px solid #e5e7eb', padding: '24px', cursor: 'pointer', boxShadow: '0 1px 4px rgba(0,0,0,0.06)', transition: 'box-shadow 0.2s' }}
                onClick={() => navigate(`/course-workspace/${enr.course_id}`)}
              >
                <div style={{ width: '44px', height: '44px', background: 'linear-gradient(135deg, #eff6ff, #ddd6fe)', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '16px', fontSize: '22px' }}>
                  {catIcon}
                </div>
                <h3 style={{ margin: '0 0 8px', fontSize: '16px', fontWeight: 700, color: '#111827', lineHeight: 1.4 }}>{enr.Course?.title || 'Course'}</h3>
                <p style={{ margin: '0 0 16px', fontSize: '13px', color: '#6b7280', overflow: 'hidden', textOverflow: 'ellipsis', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical' }}>{enr.Course?.description || ''}</p>
                <div style={{ marginBottom: '10px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px', fontSize: '12px', color: '#6b7280' }}>
                    <span>Progress</span><span style={{ fontWeight: 700, color: '#6366f1' }}>{enr.progress || 0}%</span>
                  </div>
                  <div style={{ height: '6px', background: '#f3f4f6', borderRadius: '3px' }}>
                    <div style={{ width: `${enr.progress || 0}%`, height: '100%', background: 'linear-gradient(90deg, #6366f1, #8b5cf6)', borderRadius: '3px', transition: 'width 0.4s' }} />
                  </div>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  {enr.category && <span style={{ background: '#f0fdf4', color: '#16a34a', padding: '3px 10px', borderRadius: '20px', fontSize: '11px', fontWeight: 600 }}>{enr.category}</span>}
                  {enr.courseRole && <span style={{ background: '#fdf4ff', color: '#9333ea', padding: '3px 10px', borderRadius: '20px', fontSize: '11px', fontWeight: 600 }}>{enr.courseRole}</span>}
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </section>

      {/* ── Explore Course Catalog ── */}
      <section id="catalog" style={{ maxWidth: '1200px', margin: '0 auto', padding: '52px 24px 0' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
          <div>
            <h2 style={{ margin: 0, fontSize: '22px', fontWeight: 700, color: '#0f172a' }}>🌍 Explore Course Catalog</h2>
            <p style={{ margin: '4px 0 0', color: '#64748b', fontSize: '14px' }}>Discover and enroll in new courses</p>
          </div>
        </div>

        {availableCourses.length === 0 ? (
          <p style={{ color: '#9ca3af', textAlign: 'center', padding: '40px' }}>No new courses available to enroll in.</p>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '20px' }}>
            {availableCourses.map((course) => (
              <motion.div key={`cat-${course.id}`}
                whileHover={{ y: -4, boxShadow: '0 8px 24px rgba(0,0,0,0.12)' }}
                style={{ background: '#fff', borderRadius: '16px', border: '1px solid #e5e7eb', padding: '24px', display: 'flex', flexDirection: 'column', boxShadow: '0 1px 4px rgba(0,0,0,0.06)', transition: 'box-shadow 0.2s' }}
              >
                <div style={{ width: '44px', height: '44px', background: 'linear-gradient(135deg, #fdf4ff, #e879f9)', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '16px', fontSize: '22px' }}>
                  {CATEGORY_ICONS[course.category] || CATEGORY_ICONS.default}
                </div>
                <h3 style={{ margin: '0 0 8px', fontSize: '16px', fontWeight: 700, color: '#111827', lineHeight: 1.4 }}>{course.title}</h3>
                <p style={{ margin: '0 0 16px', fontSize: '13px', color: '#6b7280', overflow: 'hidden', textOverflow: 'ellipsis', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', flex: 1 }}>{course.description}</p>
                
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 'auto' }}>
                  {course.category && <span style={{ background: '#f0fdf4', color: '#16a34a', padding: '3px 10px', borderRadius: '20px', fontSize: '11px', fontWeight: 600 }}>{course.category}</span>}
                  
                  <button 
                    onClick={() => handleEnroll(course.id)}
                    disabled={enrollingId === course.id}
                    style={{ padding: '8px 16px', background: 'linear-gradient(135deg, #6366f1, #8b5cf6)', color: 'white', border: 'none', borderRadius: '8px', fontSize: '12px', fontWeight: 600, cursor: enrollingId === course.id ? 'not-allowed' : 'pointer', opacity: enrollingId === course.id ? 0.7 : 1, transition: 'transform 0.2s' }}
                    onMouseOver={e => !enrollingId && (e.currentTarget.style.transform = 'scale(1.05)')}
                    onMouseOut={e => !enrollingId && (e.currentTarget.style.transform = 'scale(1)')}
                  >
                    {enrollingId === course.id ? 'Enrolling...' : 'Enroll Now'}
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </section>

      {/* ── Assignments & Quizzes Due ── */}
      {(pendingAssignments.length > 0 || quizzes.length > 0) && (
        <section id="assignments" style={{ maxWidth: '1200px', margin: '0 auto', padding: '52px 24px 0' }}>
          <h2 style={{ margin: '0 0 20px', fontSize: '22px', fontWeight: 700, color: '#0f172a' }}>⏰ Due Soon</h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            
            {pendingAssignments.slice(0, 3).map(a => (
              <div key={`ass-${a.id}`} style={{ background: '#fff', borderRadius: '14px', border: '1px solid #fde68a', padding: '18px 24px', display: 'flex', alignItems: 'center', gap: '16px', boxShadow: '0 1px 4px rgba(245,158,11,0.08)' }}>
                <div style={{ width: '40px', height: '40px', background: '#fef3c7', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <Clock size={20} color="#d97706" />
                </div>
                <div style={{ flex: 1 }}>
                  <p style={{ margin: 0, fontWeight: 700, color: '#111827', fontSize: '15px' }}>{a.title}</p>
                  <div style={{ display: 'flex', gap: '12px', marginTop: '4px', fontSize: '13px', color: '#6b7280' }}>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}><BookOpen size={13} /> {a.course}</span>
                    <span>• {a.totalPoints} points</span>
                  </div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <p style={{ margin: '0 0 6px', fontSize: '12px', fontWeight: 600, color: '#d97706' }}>
                    {a.dueDate ? new Date(a.dueDate).toLocaleDateString() : 'No Due Date'}
                  </p>
                  <button onClick={() => navigate(`/course-workspace/${a.course_id}`)} style={{ padding: '6px 16px', background: '#fff', border: '1px solid #d1d5db', borderRadius: '8px', fontSize: '12px', fontWeight: 600, color: '#374151', cursor: 'pointer' }}>View</button>
                </div>
              </div>
            ))}

            {quizzes.slice(0, 3).map(q => (
              <div key={`quiz-${q.id}`} style={{ background: '#fff', borderRadius: '14px', border: '1px solid #c7d2fe', padding: '18px 24px', display: 'flex', alignItems: 'center', gap: '16px', boxShadow: '0 1px 4px rgba(99,102,241,0.08)' }}>
                <div style={{ width: '40px', height: '40px', background: '#e0e7ff', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <Clock size={20} color="#4338ca" />
                </div>
                <div style={{ flex: 1 }}>
                  <p style={{ margin: 0, fontWeight: 700, color: '#111827', fontSize: '15px' }}>Quiz: {q.title}</p>
                  <div style={{ display: 'flex', gap: '12px', marginTop: '4px', fontSize: '13px', color: '#6b7280' }}>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}><BookOpen size={13} /> {q.Course?.title || 'Course'}</span>
                    <span>• {q.timeLimitMinutes} mins</span>
                  </div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <p style={{ margin: '0 0 6px', fontSize: '12px', fontWeight: 600, color: '#4338ca' }}>
                    {q.dueDate ? new Date(q.dueDate).toLocaleDateString() : 'No Due Date'}
                  </p>
                  <button onClick={() => navigate(`/quiz/${q.id}`)} style={{ padding: '6px 16px', background: '#4f46e5', border: 'none', borderRadius: '8px', fontSize: '12px', fontWeight: 600, color: '#fff', cursor: 'pointer' }}>Take Quiz</button>
                </div>
              </div>
            ))}

          </div>
        </section>
      )}

      {/* ── Recent Activity ── */}
      <section id="activity" style={{ maxWidth: '1200px', margin: '0 auto', padding: '52px 24px 64px' }}>
        <h2 style={{ margin: '0 0 20px', fontSize: '22px', fontWeight: 700, color: '#0f172a' }}>📋 Recent Activity</h2>
        {activities.length === 0 ? (
          <div style={{ background: '#fff', borderRadius: '14px', border: '1px solid #e5e7eb', padding: '40px', textAlign: 'center', color: '#9ca3af' }}>No recent activity yet.</div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '14px' }}>
            {activities.slice(0, 6).map(act => (
              <div key={act.id} style={{ background: '#fff', borderRadius: '14px', border: '1px solid #e5e7eb', padding: '18px 20px', display: 'flex', gap: '12px', boxShadow: '0 1px 4px rgba(0,0,0,0.05)' }}>
                <div style={{ width: '38px', height: '38px', borderRadius: '50%', background: act.type === 'message' ? '#eff6ff' : '#f0fdf4', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  {act.type === 'message' ? <Bell size={17} color="#3b82f6" /> : <TrendingUp size={17} color="#16a34a" />}
                </div>
                <div>
                  <p style={{ margin: 0, fontSize: '14px', fontWeight: 600, color: '#111827' }}>{act.title}</p>
                  {act.message && <p style={{ margin: '4px 0 0', fontSize: '12px', color: '#3b82f6', background: '#eff6ff', padding: '4px 8px', borderRadius: '6px' }}>💬 {act.message}</p>}
                  <p style={{ margin: '6px 0 0', fontSize: '11px', color: '#9ca3af' }}>{new Date(act.createdAt).toLocaleString()}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
      </div>
    </DashboardLayout>
  );
};

export default StudentHome;
// sss
