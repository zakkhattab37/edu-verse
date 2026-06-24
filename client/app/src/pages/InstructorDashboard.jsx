import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import useCourseStore from '../store/courseStore';
import useAuthStore from '../store/authStore';
import { 
  BookOpen, Users, LayoutDashboard, BarChart2, 
  Settings, BrainCircuit, Calendar, Bell, MessageSquare, 
  CheckSquare, ChevronDown, Sparkles, Plus, LogOut
} from 'lucide-react';

const InstructorDashboard = () => {
  const [activeMenu, setActiveMenu] = useState('Dashboard');
  const navigate = useNavigate();
  const { user, logout } = useAuthStore();
  const { courses, fetchCourses } = useCourseStore();

  useEffect(() => {
    fetchCourses();
  }, [fetchCourses]);

  const myCourses = courses.filter(c => c.instructor_id === user?.id);

  const menuItems = [
    { name: 'Dashboard', icon: <LayoutDashboard size={20} /> },
    { name: 'My Courses', icon: <BookOpen size={20} /> },
    { name: 'Students', icon: <Users size={20} /> },
    { name: 'Grading Queue', icon: <CheckSquare size={20} /> },
    { name: 'Reports & Analytics', icon: <BarChart2 size={20} /> },
    { name: 'AI Tools', icon: <BrainCircuit size={20} /> },
    { name: 'Settings', icon: <Settings size={20} /> }
  ];

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: '#F9FAFB', fontFamily: 'Inter, sans-serif' }}>
      
      {/* Sidebar */}
      <aside style={{ width: '260px', background: '#1E293B', color: '#94A3B8', display: 'flex', flexDirection: 'column' }}>
         <div style={{ padding: '24px', display: 'flex', alignItems: 'center', gap: '12px', color: '#FFFFFF', fontWeight: 'bold', fontSize: '20px' }}>
            <BrainCircuit size={28} color="var(--accent-primary)" />
            <span>Academia AI</span>
         </div>
         
         <div style={{ padding: '0 24px 24px', display: 'flex', alignItems: 'center', gap: '12px' }}>
            <img src="https://i.pravatar.cc/150?u=12" alt={user?.name || "Instructor"} style={{ width: '40px', height: '40px', borderRadius: '50%' }} />
            <div>
               <div style={{ color: '#FFFFFF', fontWeight: 600, fontSize: '14px' }}>{user?.name || "Instructor"}</div>
               <div style={{ fontSize: '12px' }}>Professor</div>
            </div>
         </div>

         <nav style={{ display: 'flex', flexDirection: 'column', gap: '4px', padding: '0 16px' }}>
            {menuItems.map(item => (
              <div 
                key={item.name}
                onClick={() => setActiveMenu(item.name)}
                style={{
                  display: 'flex', alignItems: 'center', gap: '16px', padding: '12px 16px', borderRadius: '8px', cursor: 'pointer',
                  background: activeMenu === item.name ? 'rgba(255, 255, 255, 0.1)' : 'transparent',
                  color: activeMenu === item.name ? '#FFFFFF' : 'inherit',
                  transition: 'all 0.2s'
                }}
              >
                {item.icon}
                <span style={{ fontWeight: 500, fontSize: '14px' }}>{item.name}</span>
              </div>
            ))}
         </nav>

         <div 
            onClick={() => {
              logout();
              navigate('/login');
            }}
            style={{
              display: 'flex', alignItems: 'center', gap: '16px', padding: '12px 16px', margin: '0 16px 24px', borderRadius: '8px', cursor: 'pointer',
              color: '#94A3B8', marginTop: 'auto',
              transition: 'color 0.2s'
            }}
            onMouseOver={(e) => e.currentTarget.style.color = '#F87171'}
            onMouseOut={(e) => e.currentTarget.style.color = '#94A3B8'}
         >
            <LogOut size={20} />
            <span style={{ fontWeight: 500, fontSize: '14px' }}>Sign Out</span>
         </div>
      </aside>

      {/* Main Content Area */}
      <main style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
         
         {/* Top Navigation Bar */}
         <header style={{ height: '80px', background: '#F9FAFB', display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 40px' }}>
            <h1 style={{ fontSize: '28px', fontWeight: 700, color: '#111827' }}>Instructor Dashboard</h1>
            
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
               <button 
                 onClick={() => navigate('/sandbox/course-creation')}
                 style={{ display: 'flex', alignItems: 'center', gap: '8px', background: 'var(--accent-primary)', color: 'white', border: 'none', padding: '10px 20px', borderRadius: '8px', cursor: 'pointer', fontSize: '14px', fontWeight: 600 }}
               >
                 <Plus size={18} />
                 Create Course
               </button>
               
               <div style={{ display: 'flex', alignItems: 'center', gap: '8px', background: '#FFFFFF', border: '1px solid #E5E7EB', padding: '8px 16px', borderRadius: '8px', cursor: 'pointer', fontSize: '14px', color: '#374151', fontWeight: 500 }}>
                  <Calendar size={18} />
                  Fall 2024 Term
                  <ChevronDown size={18} />
               </div>
               
               <div style={{ position: 'relative', background: '#FFFFFF', border: '1px solid #E5E7EB', padding: '10px', borderRadius: '8px', cursor: 'pointer', color: '#6B7280' }}>
                  <Bell size={20} />
                  <div style={{ position: 'absolute', top: -4, right: -4, width: '10px', height: '10px', background: 'var(--danger)', borderRadius: '50%', border: '2px solid #FFFFFF' }}></div>
               </div>
               
               <div style={{ position: 'relative', background: '#FFFFFF', border: '1px solid #E5E7EB', padding: '10px', borderRadius: '8px', cursor: 'pointer', color: '#6B7280' }}>
                  <MessageSquare size={20} />
                  <div style={{ position: 'absolute', top: -6, right: -6, background: 'var(--danger)', color: 'white', fontSize: '10px', fontWeight: 'bold', borderRadius: '10px', padding: '2px 6px', border: '2px solid #FFFFFF' }}>1</div>
               </div>
            </div>
         </header>

         {/* Dashboard Content */}
         <div style={{ padding: '0 40px 40px', flex: 1, overflowY: 'auto' }}>
            
            {/* KPI Cards */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '24px', marginBottom: '24px' }}>
               {[
                 { title: 'Total Students', value: '1,245', icon: <Users size={24} /> },
                 { title: 'Active Courses', value: myCourses.length, icon: <BookOpen size={24} /> },
                 { title: 'Pending Reviews', value: '42', icon: <CheckSquare size={24} /> }
               ].map((kpi, idx) => (
                 <div key={idx} style={{ background: '#FFFFFF', borderRadius: '12px', padding: '24px', border: '1px solid #E5E7EB', display: 'flex', justifyContent: 'space-between', alignItems: 'center', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
                    <div>
                       <div style={{ fontSize: '14px', color: '#4B5563', fontWeight: 500, marginBottom: '8px' }}>{kpi.title}</div>
                       <div style={{ fontSize: '32px', fontWeight: 700, color: '#111827' }}>{kpi.value}</div>
                    </div>
                    <div style={{ width: '56px', height: '56px', background: 'rgba(246, 36, 64, 0.1)', color: 'var(--accent-primary)', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                       {kpi.icon}
                    </div>
                 </div>
               ))}
            </div>

            {/* Middle Row: Chart & AI Insights */}
            <div style={{ display: 'grid', gridTemplateColumns: '3fr 1fr', gap: '24px', marginBottom: '24px' }}>
               
               {/* Chart Card */}
               <div style={{ background: '#FFFFFF', borderRadius: '12px', padding: '24px', border: '1px solid #E5E7EB', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
                  <h3 style={{ fontSize: '16px', fontWeight: 700, color: '#111827', marginBottom: '16px' }}>Course Performance Trends</h3>
                  <div style={{ textAlign: 'center', fontSize: '14px', color: '#4B5563', fontWeight: 500, marginBottom: '24px' }}>Average Quiz Scores (Last 8 Weeks)</div>
                  
                  {/* Mock Chart SVG */}
                  <div style={{ position: 'relative', height: '240px', width: '100%' }}>
                     <svg width="100%" height="100%" viewBox="0 0 800 240" preserveAspectRatio="none">
                        {/* Grid lines */}
                        {[40, 80, 120, 160, 200].map(y => (
                           <line key={y} x1="0" y1={y} x2="800" y2={y} stroke="#F3F4F6" strokeWidth="1" />
                        ))}
                        {/* Y-Axis Labels */}
                        {[120, 100, 80, 60, 40, 20, 0].map((val, i) => (
                           <text key={i} x="0" y={i * 40 + 10} fontSize="10" fill="#9CA3AF">{val}</text>
                        ))}
                        {/* Lines */}
                        <polyline points="20,180 150,140 300,100 450,160 600,120 750,140" fill="none" stroke="var(--accent-primary)" strokeWidth="2" />
                        <polyline points="20,120 150,160 300,120 450,100 600,140 750,100" fill="none" stroke="#93C5FD" strokeWidth="2" />
                        <polyline points="20,160 150,120 300,140 450,120 600,100 750,160" fill="none" stroke="#FBBF24" strokeWidth="2" />
                     </svg>
                     <div style={{ display: 'flex', justifyContent: 'space-between', paddingLeft: '20px', marginTop: '16px', fontSize: '12px', color: '#9CA3AF' }}>
                        <span>Week 1</span><span>Week 2</span><span>Week 3</span><span>Week 4</span><span>Week 5</span><span>Week 6</span>
                     </div>
                  </div>
               </div>

               {/* AI Insights */}
               <div style={{ background: '#FFFFFF', borderRadius: '12px', padding: '24px', border: '1px solid #E5E7EB', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
                  <div style={{ background: 'rgba(246, 36, 64, 0.05)', color: 'var(--accent-primary)', padding: '12px 16px', borderRadius: '8px', display: 'flex', alignItems: 'center', gap: '8px', fontWeight: 600, fontSize: '15px', marginBottom: '24px' }}>
                     <Sparkles size={18} /> AI Insights
                  </div>
                  <ul style={{ paddingLeft: '20px', margin: 0, display: 'flex', flexDirection: 'column', gap: '16px', color: '#111827', fontSize: '14px', lineHeight: '1.6' }}>
                     <li>Predictive analysis suggests focusing on Week 5 concepts for CS101.</li>
                     <li>Predictive analysis suggests focusing on Week 5 concepts for CS101.</li>
                     <li>Predictive analysis suggests focusing on Week 5 concepts for CS102.</li>
                  </ul>
               </div>

            </div>

            {/* Bottom Row: Assignments Needing Grading */}
            <div style={{ background: '#FFFFFF', borderRadius: '12px', border: '1px solid #E5E7EB', boxShadow: '0 1px 3px rgba(0,0,0,0.05)', overflow: 'hidden' }}>
               <div style={{ padding: '24px', borderBottom: '1px solid #E5E7EB' }}>
                  <h3 style={{ fontSize: '18px', fontWeight: 700, color: '#111827' }}>Assignments Needing Grading</h3>
               </div>
               
               <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '14px' }}>
                  <thead>
                     <tr style={{ background: '#F9FAFB', borderBottom: '1px solid #E5E7EB', color: '#4B5563', fontWeight: 600 }}>
                        <th style={{ padding: '16px 24px', fontWeight: 600 }}>Course</th>
                        <th style={{ padding: '16px 24px', fontWeight: 600 }}>Assignment</th>
                        <th style={{ padding: '16px 24px', fontWeight: 600 }}>Students submitted</th>
                        <th style={{ padding: '16px 24px', fontWeight: 600 }}>Due Date</th>
                        <th style={{ padding: '16px 24px' }}></th>
                     </tr>
                  </thead>
                  <tbody>
                     {[
                        { course: 'CS101 - Intro to Programming', assignment: 'Midterm Project', submitted: '115 / 120', date: 'Oct 25' },
                        { course: 'AI400 - Machine Learning', assignment: 'Neural Network Implementation', submitted: '28 / 30', date: 'Oct 28' },
                        { course: 'CS202 - Data Structures', assignment: 'Graph Algorithms Quiz', submitted: '76 / 80', date: 'Nov 1' }
                     ].map((row, idx) => (
                        <tr key={idx} style={{ borderBottom: idx !== 2 ? '1px solid #E5E7EB' : 'none', color: '#111827' }}>
                           <td style={{ padding: '16px 24px' }}>{row.course}</td>
                           <td style={{ padding: '16px 24px' }}>{row.assignment}</td>
                           <td style={{ padding: '16px 24px' }}>{row.submitted}</td>
                           <td style={{ padding: '16px 24px' }}>{row.date}</td>
                           <td style={{ padding: '16px 24px', textAlign: 'right' }}>
                              <button style={{ padding: '8px 16px', background: '#4B5563', color: 'white', border: 'none', borderRadius: '6px', fontWeight: 500, fontSize: '13px', cursor: 'pointer' }}>
                                 Grade Now
                              </button>
                           </td>
                        </tr>
                     ))}
                  </tbody>
               </table>
            </div>

         </div>
      </main>

    </div>
  );
};

export default InstructorDashboard;
