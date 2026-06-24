import { BookOpen, Calendar as CalendarIcon, FileText, MoreHorizontal, ChevronLeft, ChevronRight, PlayCircle, Edit3 } from 'lucide-react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import useDashboardStore from '../../store/dashboardStore';

const DashboardOverview = () => {
  const navigate = useNavigate();
  const { userSettings, enrollments, assignments, activities, isLoading } = useDashboardStore();

  const pendingAssignments = assignments.filter(a => a.status === 'pending' || a.status === 'urgent').slice(0, 3);

  const getActivityIcon = (type) => {
    switch(type) {
      case 'video': return <PlayCircle size={16} />;
      case 'grade': return <FileText size={16} />;
      default: return <Edit3 size={16} />;
    }
  };

  return (
    <>
      <motion.div 
         initial={{ opacity: 0, y: 20 }}
         animate={{ opacity: 1, y: 0 }}
         exit={{ opacity: 0, y: -20 }}
         transition={{ duration: 0.5, staggerChildren: 0.1 }}
         style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '24px', marginBottom: '24px' }}>
         
         {/* Enrolled Courses */}
         <div style={{ background: '#FFFFFF', borderRadius: '16px', padding: '24px', border: '1px solid #E5E7EB', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
               <h3 style={{ fontSize: '18px', fontWeight: 600, color: '#111827' }}>Enrolled Courses</h3>
               <MoreHorizontal size={20} color="#9CA3AF" cursor="pointer" />
            </div>
            <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
               {isLoading ? (
                 <p>Loading courses...</p>
               ) : enrollments?.length === 0 ? (
                 <p style={{ color: '#6B7280' }}>You are not enrolled in any courses yet.</p>
               ) : (
                 enrollments?.map(enrollment => (
                   <div 
                     key={enrollment.id}
                     onClick={() => navigate(`/sandbox/course-workspace/${enrollment.course_id}`)} 
                     style={{ flex: 1, minWidth: '200px', border: '1px solid #E5E7EB', borderRadius: '12px', padding: '16px', cursor: 'pointer', transition: 'border-color 0.2s' }}
                   >
                      <div style={{ width: '40px', height: '40px', borderRadius: '8px', background: 'rgba(246, 36, 64, 0.1)', color: 'var(--accent-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '16px' }}>
                         <BookOpen size={20} />
                      </div>
                      <h4 style={{ fontSize: '14px', fontWeight: 600, color: '#111827', marginBottom: '16px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{enrollment.Course?.title || 'Unknown Course'}</h4>
                      <div style={{ fontSize: '12px', color: '#6B7280', marginBottom: '8px' }}>Progress</div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                         <div style={{ flex: 1, height: '6px', background: '#F3F4F6', borderRadius: '3px' }}>
                            <div style={{ width: `${enrollment.progress || 0}%`, height: '100%', background: 'var(--accent-primary)', borderRadius: '3px' }}></div>
                         </div>
                         <span style={{ fontSize: '12px', fontWeight: 600 }}>{enrollment.progress || 0}%</span>
                      </div>
                   </div>
                 ))
               )}
            </div>
         </div>

         {/* Upcoming Deadlines */}
         <div style={{ background: '#FFFFFF', borderRadius: '16px', padding: '24px', border: '1px solid #E5E7EB', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
               <h3 style={{ fontSize: '18px', fontWeight: 600, color: '#111827' }}>Upcoming Deadlines</h3>
               <MoreHorizontal size={20} color="#9CA3AF" cursor="pointer" />
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
               {pendingAssignments.length === 0 ? (
                 <p style={{ color: '#6B7280' }}>No upcoming deadlines!</p>
               ) : (
                 pendingAssignments.map((item, idx) => (
                    <div key={item.id} style={{ display: 'flex', alignItems: 'flex-start', gap: '16px', paddingBottom: '16px', borderBottom: idx !== pendingAssignments.length - 1 ? '1px solid #F3F4F6' : 'none' }}>
                       <div style={{ color: item.status === 'urgent' ? '#EF4444' : '#9CA3AF' }}>
                         <CalendarIcon size={20} />
                       </div>
                       <div>
                          <div style={{ fontSize: '14px', fontWeight: 600, color: '#111827', marginBottom: '4px' }}>{item.title}</div>
                          <div style={{ fontSize: '12px', color: item.status === 'urgent' ? '#EF4444' : '#6B7280' }}>
                            {new Date(item.dueDate).toLocaleDateString()}
                          </div>
                       </div>
                    </div>
                 ))
               )}
            </div>
         </div>

         {/* Learning Streak */}
         <div style={{ background: '#FFFFFF', borderRadius: '16px', padding: '24px', border: '1px solid #E5E7EB', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
               <h3 style={{ fontSize: '18px', fontWeight: 600, color: '#111827' }}>Learning Streak</h3>
               <MoreHorizontal size={20} color="#9CA3AF" cursor="pointer" />
            </div>
            <div style={{ background: 'var(--bg-secondary)', borderRadius: '12px', padding: '32px 24px', textAlign: 'center', height: 'calc(100% - 50px)', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
               <div style={{ fontSize: '48px', marginBottom: '16px' }}>🔥</div>
               <h2 style={{ fontSize: '24px', fontWeight: 700, color: '#111827', marginBottom: '8px' }}>
                 {userSettings?.streakDays || 0} Days Streak
               </h2>
               <p style={{ fontSize: '14px', color: '#4B5563', lineHeight: '1.5' }}>
                 Keep learning every day to build your streak!
               </p>
            </div>
         </div>

      </motion.div>

      <motion.div 
         initial={{ opacity: 0, y: 20 }}
         animate={{ opacity: 1, y: 0 }}
         exit={{ opacity: 0, y: -20 }}
         transition={{ duration: 0.5, delay: 0.2, staggerChildren: 0.1 }}
         style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '24px' }}>
         
         {/* Calendar */}
         <div style={{ background: '#FFFFFF', borderRadius: '16px', padding: '24px', border: '1px solid #E5E7EB', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
               <h3 style={{ fontSize: '18px', fontWeight: 600, color: '#111827' }}>Calendar</h3>
               <div style={{ display: 'flex', gap: '8px', color: '#9CA3AF' }}>
                  <ChevronLeft size={20} cursor="pointer" />
                  <ChevronRight size={20} cursor="pointer" />
               </div>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '8px', textAlign: 'center', fontSize: '14px' }}>
               {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
                  <div key={day} style={{ fontWeight: 600, color: '#111827', paddingBottom: '8px' }}>{day}</div>
               ))}
               {/* Mock Calendar Days */}
               {[25,26,27,28,29,30,31,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30,31,1,2,3,4].map((day, idx) => (
                  <div 
                    key={idx} 
                    style={{ 
                      padding: '8px 0', 
                      color: (idx < 7 || idx > 37) ? '#D1D5DB' : '#4B5563',
                      background: day === 4 && idx > 7 && idx < 37 ? 'var(--accent-primary)' : [28, 11, 25, 8, 9, 10, 12, 18, 1].includes(day) && idx > 7 && idx < 37 ? 'var(--bg-secondary)' : 'transparent',
                      color: day === 4 && idx > 7 && idx < 37 ? '#FFFFFF' : ((idx < 7 || idx > 37) ? '#D1D5DB' : '#4B5563'),
                      borderRadius: '8px',
                      fontWeight: day === 4 && idx > 7 && idx < 37 ? 'bold' : 'normal',
                      cursor: 'pointer'
                    }}
                  >
                    {day}
                  </div>
               ))}
            </div>
         </div>

         {/* Progress Chart */}
         <div style={{ background: '#FFFFFF', borderRadius: '16px', padding: '24px', border: '1px solid #E5E7EB', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
               <h3 style={{ fontSize: '18px', fontWeight: 600, color: '#111827' }}>Progress Chart</h3>
               <MoreHorizontal size={20} color="#9CA3AF" cursor="pointer" />
            </div>
            <div style={{ fontSize: '14px', fontWeight: 600, color: '#111827', marginBottom: '16px' }}>Weekly Study Hours</div>
            <div style={{ position: 'relative', height: '200px', display: 'flex', alignItems: 'flex-end', paddingTop: '20px' }}>
               {/* Mock Chart Area (Simplified with SVG) */}
               <svg width="100%" height="100%" viewBox="0 0 400 200" preserveAspectRatio="none">
                  <defs>
                    <linearGradient id="chartGradient" x1="0" x2="0" y1="0" y2="1">
                      <stop offset="0%" stopColor="var(--accent-primary)" stopOpacity="0.2" />
                      <stop offset="100%" stopColor="var(--accent-primary)" stopOpacity="0" />
                    </linearGradient>
                  </defs>
                  <line x1="0" y1="50" x2="400" y2="50" stroke="#F3F4F6" strokeWidth="1" />
                  <line x1="0" y1="100" x2="400" y2="100" stroke="#F3F4F6" strokeWidth="1" />
                  <line x1="0" y1="150" x2="400" y2="150" stroke="#F3F4F6" strokeWidth="1" />
                  <polygon points="0,180 50,120 100,150 150,50 200,30 250,80 300,120 350,20 400,0 400,200 0,200" fill="url(#chartGradient)" />
                  <polyline points="0,180 50,120 100,150 150,50 200,30 250,80 300,120 350,20 400,0" fill="none" stroke="var(--accent-primary)" strokeWidth="3" />
               </svg>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '16px', fontSize: '12px', color: '#9CA3AF' }}>
               <span>Mon</span><span>Tue</span><span>Wed</span><span>Thu</span><span>Fri</span><span>Sat</span><span>Sun</span>
            </div>
         </div>

         {/* Recent Activity */}
         <div style={{ background: '#FFFFFF', borderRadius: '16px', padding: '24px', border: '1px solid #E5E7EB', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
               <h3 style={{ fontSize: '18px', fontWeight: 600, color: '#111827' }}>Recent Activity</h3>
               <MoreHorizontal size={20} color="#9CA3AF" cursor="pointer" />
            </div>
            <div style={{ position: 'relative', display: 'flex', flexDirection: 'column', gap: '32px' }}>
               <div style={{ position: 'absolute', left: '15px', top: '20px', bottom: '0', width: '2px', background: '#F3F4F6' }}></div>
               
               {activities.length === 0 ? (
                 <p style={{ color: '#6B7280', zIndex: 1, background: '#fff', padding: '4px' }}>No recent activity.</p>
               ) : (
                 activities.map((item, idx) => (
                    <div key={item.id} style={{ display: 'flex', gap: '16px', position: 'relative', zIndex: 1 }}>
                       <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: 'var(--bg-secondary)', color: 'var(--accent-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, border: '2px solid #FFFFFF' }}>
                          {getActivityIcon(item.type)}
                       </div>
                       <div style={{ paddingTop: '4px' }}>
                          <div style={{ fontSize: '14px', fontWeight: 500, color: '#111827', marginBottom: '2px' }}>{item.title}</div>
                          <div style={{ fontSize: '12px', color: '#6B7280' }}>
                            {new Date(item.createdAt).toLocaleString()}
                          </div>
                       </div>
                    </div>
                 ))
               )}
            </div>
         </div>

      </motion.div>
    </>
  );
};

export default DashboardOverview;
