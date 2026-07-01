import { Users, BookOpen, CheckSquare, TrendingUp, Clock, Sparkles, ChevronRight } from 'lucide-react';

const InstructorDashboardOverview = ({ data, onTabChange }) => {
  if (!data) return null;

  const { user, courses, totalStudents, pendingTasks, activities } = data;

  const kpis = [
    { title: 'Total Students', value: totalStudents, icon: <Users size={22} />, color: '#6366f1', bg: 'rgba(99,102,241,0.1)' },
    { title: 'Active Courses', value: courses?.length || 0, icon: <BookOpen size={22} />, color: '#10b981', bg: 'rgba(16,185,129,0.1)' },
    { title: 'Pending Grades', value: pendingTasks?.length || 0, icon: <CheckSquare size={22} />, color: '#f59e0b', bg: 'rgba(245,158,11,0.1)' },
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      {/* Welcome */}
      <div style={{ background: 'linear-gradient(135deg, #1e293b 0%, #334155 100%)', borderRadius: '16px', padding: '28px 32px', color: '#fff', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <p style={{ margin: 0, fontSize: '14px', color: '#94a3b8', fontWeight: 500 }}>Welcome back,</p>
          <h2 style={{ margin: '4px 0 8px', fontSize: '26px', fontWeight: 700 }}>{user?.name || 'Instructor'} 👋</h2>
          <p style={{ margin: 0, fontSize: '14px', color: '#94a3b8' }}>You have <span style={{ color: '#fbbf24', fontWeight: 600 }}>{pendingTasks?.length || 0} submissions</span> waiting to be graded.</p>
        </div>
        <Sparkles size={60} style={{ color: '#6366f1', opacity: 0.4 }} />
      </div>

      {/* KPI Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '20px' }}>
        {kpis.map((kpi, i) => (
          <div key={i} style={{ background: '#fff', borderRadius: '14px', padding: '24px', border: '1px solid #e5e7eb', boxShadow: '0 1px 4px rgba(0,0,0,0.06)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <p style={{ margin: '0 0 8px', fontSize: '13px', color: '#6b7280', fontWeight: 500 }}>{kpi.title}</p>
              <p style={{ margin: 0, fontSize: '36px', fontWeight: 800, color: '#111827' }}>{kpi.value}</p>
            </div>
            <div style={{ width: '52px', height: '52px', borderRadius: '12px', background: kpi.bg, color: kpi.color, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              {kpi.icon}
            </div>
          </div>
        ))}
      </div>

      {/* Pending Grading Table */}
      <div style={{ background: '#fff', borderRadius: '14px', border: '1px solid #e5e7eb', boxShadow: '0 1px 4px rgba(0,0,0,0.06)', overflow: 'hidden' }}>
        <div style={{ padding: '20px 24px', borderBottom: '1px solid #e5e7eb', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h3 style={{ margin: 0, fontSize: '16px', fontWeight: 700, color: '#111827' }}>🕐 Pending Submissions</h3>
          <button onClick={() => onTabChange('Grading Queue')} style={{ display: 'flex', alignItems: 'center', gap: '4px', background: 'none', border: 'none', color: '#6366f1', fontWeight: 600, fontSize: '13px', cursor: 'pointer' }}>View All <ChevronRight size={16} /></button>
        </div>
        {pendingTasks?.length === 0 ? (
          <p style={{ textAlign: 'center', padding: '32px', color: '#6b7280', fontSize: '14px' }}>🎉 All caught up! No submissions pending.</p>
        ) : (
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '14px' }}>
            <thead>
              <tr style={{ background: '#f9fafb', color: '#6b7280' }}>
                <th style={{ padding: '12px 20px', textAlign: 'left', fontWeight: 600 }}>Student</th>
                <th style={{ padding: '12px 20px', textAlign: 'left', fontWeight: 600 }}>Assignment</th>
                <th style={{ padding: '12px 20px', textAlign: 'left', fontWeight: 600 }}>Course</th>
                <th style={{ padding: '12px 20px', textAlign: 'left', fontWeight: 600 }}>Submitted</th>
              </tr>
            </thead>
            <tbody>
              {(pendingTasks || []).slice(0, 5).map((task, i) => (
                <tr key={i} style={{ borderTop: '1px solid #f3f4f6', color: '#111827' }}>
                  <td style={{ padding: '14px 20px', fontWeight: 500 }}>{task.studentName}</td>
                  <td style={{ padding: '14px 20px', color: '#4b5563' }}>{task.assignmentTitle}</td>
                  <td style={{ padding: '14px 20px' }}><span style={{ background: '#eff6ff', color: '#3b82f6', padding: '3px 10px', borderRadius: '20px', fontSize: '12px', fontWeight: 600 }}>{task.courseTitle}</span></td>
                  <td style={{ padding: '14px 20px', color: '#9ca3af', fontSize: '13px' }}>
                    <Clock size={13} style={{ marginRight: '4px', verticalAlign: 'middle' }} />
                    {task.submittedAt ? new Date(task.submittedAt).toLocaleDateString() : 'N/A'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Recent Activity */}
      <div style={{ background: '#fff', borderRadius: '14px', border: '1px solid #e5e7eb', boxShadow: '0 1px 4px rgba(0,0,0,0.06)', padding: '24px' }}>
        <h3 style={{ margin: '0 0 16px', fontSize: '16px', fontWeight: 700, color: '#111827' }}>📋 Recent Activity</h3>
        {activities?.length === 0 ? (
          <p style={{ color: '#6b7280', fontSize: '14px' }}>No recent activity.</p>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {(activities || []).slice(0, 5).map((act, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '12px', background: '#f9fafb', borderRadius: '10px' }}>
                <div style={{ width: '36px', height: '36px', borderRadius: '50%', background: '#eff6ff', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <TrendingUp size={16} color="#6366f1" />
                </div>
                <div>
                  <p style={{ margin: 0, fontSize: '14px', fontWeight: 500, color: '#111827' }}>{act.title}</p>
                  <p style={{ margin: '2px 0 0', fontSize: '12px', color: '#9ca3af' }}>{new Date(act.createdAt).toLocaleDateString()}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default InstructorDashboardOverview;
