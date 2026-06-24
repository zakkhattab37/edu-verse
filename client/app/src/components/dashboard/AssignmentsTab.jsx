import { FileText, Calendar, CheckCircle, Clock, AlertCircle } from 'lucide-react';
import { motion } from 'framer-motion';
import useDashboardStore from '../../store/dashboardStore';

const AssignmentsTab = () => {
  const { assignments } = useDashboardStore();

  const getStatusIcon = (status) => {
    switch (status) {
      case 'urgent': return <AlertCircle size={20} color="#EF4444" />;
      case 'pending': return <Clock size={20} color="#F59E0B" />;
      case 'completed': return <CheckCircle size={20} color="#10B981" />;
      case 'graded': return <CheckCircle size={20} color="#10B981" />;
      default: return <FileText size={20} />;
    }
  };

  const urgent = assignments.filter(a => a.status === 'urgent');
  const pending = assignments.filter(a => a.status === 'pending');
  const completed = assignments.filter(a => a.status === 'completed' || a.status === 'graded');

  const AssignmentSection = ({ title, items }) => (
    <div style={{ marginBottom: '32px' }}>
      <h3 style={{ fontSize: '18px', fontWeight: 600, color: '#111827', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
        {title} <span style={{ background: '#F3F4F6', padding: '2px 8px', borderRadius: '12px', fontSize: '12px', color: '#6B7280' }}>{items.length}</span>
      </h3>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
        {items.map((assignment, idx) => (
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: idx * 0.1 }}
            key={assignment.id} 
            style={{ display: 'flex', alignItems: 'center', padding: '20px', background: '#FFFFFF', border: '1px solid #E5E7EB', borderRadius: '12px', gap: '20px', transition: 'all 0.2s', cursor: 'pointer' }}
            onMouseOver={e => { e.currentTarget.style.borderColor = '#D1D5DB'; e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 4px 6px -1px rgba(0,0,0,0.05)'; }}
            onMouseOut={e => { e.currentTarget.style.borderColor = '#E5E7EB'; e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = 'none'; }}
          >
            <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: assignment.status === 'urgent' ? '#FEF2F2' : (assignment.status === 'completed' || assignment.status === 'graded') ? '#ECFDF5' : '#FFFBEB', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              {getStatusIcon(assignment.status)}
            </div>
            <div style={{ flex: 1 }}>
              <h4 style={{ fontSize: '16px', fontWeight: 600, color: '#111827', marginBottom: '4px' }}>{assignment.title}</h4>
              <div style={{ fontSize: '14px', color: '#6B7280' }}>{assignment.course}</div>
            </div>
            <div style={{ textAlign: 'right' }}>
              <div style={{ fontSize: '14px', fontWeight: 500, color: assignment.status === 'urgent' ? '#EF4444' : '#4B5563', display: 'flex', alignItems: 'center', gap: '6px', justifyContent: 'flex-end', marginBottom: '4px' }}>
                <Calendar size={14} /> {new Date(assignment.dueDate).toLocaleDateString()}
              </div>
              <div style={{ fontSize: '12px', color: '#9CA3AF' }}>{assignment.totalPoints} Points</div>
            </div>
            {assignment.status !== 'completed' && assignment.status !== 'graded' && (
              <button style={{ marginLeft: '16px', padding: '8px 24px', background: assignment.status === 'urgent' ? 'var(--accent-primary)' : '#F3F4F6', color: assignment.status === 'urgent' ? '#FFFFFF' : '#111827', border: 'none', borderRadius: '8px', fontWeight: 500, cursor: 'pointer' }}>
                Start
              </button>
            )}
          </motion.div>
        ))}
      </div>
    </div>
  );

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.5 }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
        <h2 style={{ fontSize: '24px', fontWeight: 700, color: '#111827' }}>Assignments</h2>
        <div style={{ display: 'flex', gap: '16px', background: '#F3F4F6', padding: '4px', borderRadius: '8px' }}>
          <button style={{ padding: '8px 16px', background: '#FFFFFF', border: 'none', borderRadius: '6px', boxShadow: '0 1px 2px rgba(0,0,0,0.05)', fontWeight: 500, color: '#111827' }}>All</button>
          <button style={{ padding: '8px 16px', background: 'transparent', border: 'none', fontWeight: 500, color: '#6B7280', cursor: 'pointer' }}>Upcoming</button>
          <button style={{ padding: '8px 16px', background: 'transparent', border: 'none', fontWeight: 500, color: '#6B7280', cursor: 'pointer' }}>Completed</button>
        </div>
      </div>

      <div style={{ background: '#FFFFFF', padding: '32px', borderRadius: '16px', border: '1px solid #E5E7EB', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
        {assignments.length === 0 ? (
          <p style={{ color: '#6B7280' }}>No assignments found.</p>
        ) : (
          <>
            {urgent.length > 0 && <AssignmentSection title="Urgent / Overdue" items={urgent} />}
            {pending.length > 0 && <AssignmentSection title="Upcoming" items={pending} />}
            {completed.length > 0 && <AssignmentSection title="Completed" items={completed} />}
          </>
        )}
      </div>
    </motion.div>
  );
};

export default AssignmentsTab;
