import { BookOpen, Search, Filter, Clock, Users } from 'lucide-react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import useDashboardStore from '../../store/dashboardStore';

const CoursesTab = () => {
  const navigate = useNavigate();
  const { enrollments, isLoading } = useDashboardStore();

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.5 }}
      style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h2 style={{ fontSize: '24px', fontWeight: 700, color: '#111827' }}>My Courses</h2>
        <div style={{ display: 'flex', gap: '16px' }}>
          <div style={{ position: 'relative' }}>
            <Search size={18} color="#9CA3AF" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
            <input type="text" placeholder="Search courses..." style={{ padding: '10px 16px 10px 40px', border: '1px solid #E5E7EB', borderRadius: '8px', outline: 'none', fontSize: '14px' }} />
          </div>
          <button style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 16px', background: '#FFFFFF', border: '1px solid #E5E7EB', borderRadius: '8px', cursor: 'pointer', fontWeight: 500 }}>
            <Filter size={18} /> Filter
          </button>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '24px' }}>
        {isLoading ? (
          <p>Loading courses...</p>
        ) : enrollments?.length === 0 ? (
          <div style={{ background: '#FFFFFF', padding: '40px', borderRadius: '16px', textAlign: 'center', gridColumn: '1 / -1' }}>
             <BookOpen size={48} color="#D1D5DB" style={{ margin: '0 auto 16px' }} />
             <h3 style={{ fontSize: '18px', fontWeight: 600, color: '#111827', marginBottom: '8px' }}>No Courses Yet</h3>
             <p style={{ color: '#6B7280' }}>You haven't enrolled in any courses. Check out the catalog to get started!</p>
          </div>
        ) : (
          enrollments?.map((enrollment, index) => (
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.1 }}
              key={enrollment.id}
              style={{ background: '#FFFFFF', borderRadius: '16px', overflow: 'hidden', border: '1px solid #E5E7EB', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)', display: 'flex', flexDirection: 'column' }}
            >
              <div style={{ height: '120px', background: `linear-gradient(135deg, hsl(${index * 60}, 70%, 60%), hsl(${index * 60 + 40}, 70%, 50%))`, position: 'relative' }}>
                 <div style={{ position: 'absolute', bottom: '-20px', left: '20px', width: '56px', height: '56px', background: '#FFFFFF', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
                    <BookOpen size={28} color={`hsl(${index * 60}, 70%, 50%)`} />
                 </div>
              </div>
              <div style={{ padding: '32px 24px 24px', flex: 1, display: 'flex', flexDirection: 'column' }}>
                <h3 style={{ fontSize: '18px', fontWeight: 600, color: '#111827', marginBottom: '8px' }}>{enrollment.Course?.title || 'Unknown Course'}</h3>
                <p style={{ fontSize: '14px', color: '#6B7280', marginBottom: '24px', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                  {enrollment.Course?.description || 'No description available for this course.'}
                </p>
                
                <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '24px', fontSize: '13px', color: '#6B7280' }}>
                   <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}><Clock size={16} /> 12 Weeks</div>
                   <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}><Users size={16} /> 1.2k Enrolled</div>
                </div>

                <div style={{ marginTop: 'auto' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', marginBottom: '8px', fontWeight: 500 }}>
                    <span style={{ color: '#4B5563' }}>Course Progress</span>
                    <span style={{ color: 'var(--accent-primary)' }}>{enrollment.progress || 0}%</span>
                  </div>
                  <div style={{ height: '8px', background: '#F3F4F6', borderRadius: '4px', overflow: 'hidden', marginBottom: '16px' }}>
                    <div style={{ height: '100%', width: `${enrollment.progress || 0}%`, background: 'var(--accent-primary)', borderRadius: '4px' }}></div>
                  </div>
                  
                  <button 
                    onClick={() => navigate(`/course-workspace/${enrollment.course_id}`)}
                    style={{ width: '100%', padding: '12px', background: 'var(--bg-secondary)', border: '1px solid #E5E7EB', borderRadius: '8px', color: '#111827', fontWeight: 600, cursor: 'pointer', transition: 'background 0.2s' }}
                    onMouseOver={e => e.currentTarget.style.background = '#F3F4F6'}
                    onMouseOut={e => e.currentTarget.style.background = 'var(--bg-secondary)'}
                  >
                    Continue Learning
                  </button>
                </div>
              </div>
            </motion.div>
          ))
        )}
      </div>
    </motion.div>
  );
};

export default CoursesTab;
