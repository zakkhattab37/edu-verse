import { Award, TrendingUp, Filter } from 'lucide-react';
import { motion } from 'framer-motion';
import useDashboardStore from '../../store/dashboardStore';

const GradesTab = () => {
  const { grades } = useDashboardStore();

  // Calculate Cumulative GPA (simplified)
  let totalScore = 0;
  let totalMax = 0;
  grades.forEach(g => {
    totalScore += (g.score || 0);
    totalMax += (g.totalPoints || 100);
  });
  
  const percentage = totalMax > 0 ? (totalScore / totalMax) * 100 : 0;
  const gpa = ((percentage / 100) * 4.0).toFixed(2);

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.5 }}
      style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h2 style={{ fontSize: '24px', fontWeight: 700, color: '#111827' }}>Grades & Progress</h2>
        <button style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 16px', background: '#FFFFFF', border: '1px solid #E5E7EB', borderRadius: '8px', cursor: 'pointer', fontWeight: 500 }}>
          <Filter size={18} /> Term: Fall 2023
        </button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '24px' }}>
         <div style={{ background: '#FFFFFF', padding: '24px', borderRadius: '16px', border: '1px solid #E5E7EB', boxShadow: '0 1px 3px rgba(0,0,0,0.05)', display: 'flex', alignItems: 'center', gap: '20px' }}>
            <div style={{ width: '64px', height: '64px', borderRadius: '16px', background: 'rgba(37, 99, 235, 0.1)', color: '#2563EB', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
               <Award size={32} />
            </div>
            <div>
               <div style={{ fontSize: '14px', color: '#6B7280', marginBottom: '4px', fontWeight: 500 }}>Cumulative GPA</div>
               <div style={{ fontSize: '28px', fontWeight: 700, color: '#111827' }}>{totalMax > 0 ? gpa : 'N/A'}</div>
            </div>
         </div>
         <div style={{ background: '#FFFFFF', padding: '24px', borderRadius: '16px', border: '1px solid #E5E7EB', boxShadow: '0 1px 3px rgba(0,0,0,0.05)', display: 'flex', alignItems: 'center', gap: '20px' }}>
            <div style={{ width: '64px', height: '64px', borderRadius: '16px', background: 'rgba(16, 185, 129, 0.1)', color: '#10B981', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
               <TrendingUp size={32} />
            </div>
            <div>
               <div style={{ fontSize: '14px', color: '#6B7280', marginBottom: '4px', fontWeight: 500 }}>Assignments Completed</div>
               <div style={{ fontSize: '28px', fontWeight: 700, color: '#111827' }}>{grades.length}</div>
            </div>
         </div>
      </div>

      <div style={{ background: '#FFFFFF', borderRadius: '16px', border: '1px solid #E5E7EB', boxShadow: '0 1px 3px rgba(0,0,0,0.05)', overflow: 'hidden', marginTop: '8px' }}>
         <div style={{ padding: '24px', borderBottom: '1px solid #E5E7EB' }}>
            <h3 style={{ fontSize: '18px', fontWeight: 600, color: '#111827' }}>Recent Grades</h3>
         </div>
         {grades.length === 0 ? (
           <div style={{ padding: '24px', color: '#6B7280' }}>No grades available yet.</div>
         ) : (
           <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
              <thead>
                 <tr style={{ background: '#F9FAFB', borderBottom: '1px solid #E5E7EB' }}>
                    <th style={{ padding: '16px 24px', fontWeight: 600, color: '#4B5563', fontSize: '13px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Course</th>
                    <th style={{ padding: '16px 24px', fontWeight: 600, color: '#4B5563', fontSize: '13px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Assignment</th>
                    <th style={{ padding: '16px 24px', fontWeight: 600, color: '#4B5563', fontSize: '13px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Date Graded</th>
                    <th style={{ padding: '16px 24px', fontWeight: 600, color: '#4B5563', fontSize: '13px', textTransform: 'uppercase', letterSpacing: '0.05em', textAlign: 'right' }}>Score</th>
                 </tr>
              </thead>
              <tbody>
                 {grades.map((grade) => (
                    <tr key={grade.id} style={{ borderBottom: '1px solid #E5E7EB' }}>
                       <td style={{ padding: '16px 24px', color: '#111827', fontWeight: 500, fontSize: '14px' }}>{grade.course}</td>
                       <td style={{ padding: '16px 24px', color: '#6B7280', fontSize: '14px' }}>{grade.title}</td>
                       <td style={{ padding: '16px 24px', color: '#6B7280', fontSize: '14px' }}>{new Date(grade.submittedAt || Date.now()).toLocaleDateString()}</td>
                       <td style={{ padding: '16px 24px', textAlign: 'right' }}>
                          <span style={{ 
                             background: (grade.score / grade.totalPoints) >= 0.9 ? '#ECFDF5' : (grade.score / grade.totalPoints) >= 0.8 ? '#EFF6FF' : '#FFFBEB',
                             color: (grade.score / grade.totalPoints) >= 0.9 ? '#10B981' : (grade.score / grade.totalPoints) >= 0.8 ? '#2563EB' : '#F59E0B',
                             padding: '6px 12px', borderRadius: '100px', fontSize: '14px', fontWeight: 600
                          }}>
                             {grade.score || 0} / {grade.totalPoints}
                          </span>
                       </td>
                    </tr>
                 ))}
              </tbody>
           </table>
         )}
      </div>
    </motion.div>
  );
};

export default GradesTab;
