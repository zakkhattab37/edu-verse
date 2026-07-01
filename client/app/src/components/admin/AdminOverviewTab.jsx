import { Users, BookOpen, Activity, Database, TrendingUp, AlertCircle } from 'lucide-react';

const roleColors = {
  Admin:      { bg: '#fef2f2', color: '#dc2626' },
  Instructor: { bg: '#eff6ff', color: '#2563eb' },
  Student:    { bg: '#f0fdf4', color: '#16a34a' },
};

const AdminOverviewTab = ({ overview }) => {
  if (!overview) return null;
  const { stats, usersByRole, recentActivities } = overview;

  const kpis = [
    { label: 'Total Users',       value: stats.totalUsers,       icon: <Users size={22} />,    color: '#6366f1', bg: 'rgba(99,102,241,0.1)' },
    { label: 'Total Courses',     value: stats.totalCourses,     icon: <BookOpen size={22} />, color: '#10b981', bg: 'rgba(16,185,129,0.1)' },
    { label: 'Enrollments',       value: stats.totalEnrollments, icon: <Database size={22} />, color: '#f59e0b', bg: 'rgba(245,158,11,0.1)'  },
    { label: 'Draft Courses',     value: stats.pendingCourses,   icon: <AlertCircle size={22}/>,color: '#ef4444', bg: 'rgba(239,68,68,0.1)' },
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      {/* KPIs */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '18px' }}>
        {kpis.map((k, i) => (
          <div key={i} style={{ background: '#fff', borderRadius: '14px', padding: '22px', border: '1px solid #e5e7eb', display: 'flex', justifyContent: 'space-between', alignItems: 'center', boxShadow: '0 1px 4px rgba(0,0,0,0.05)' }}>
            <div>
              <p style={{ margin: '0 0 6px', fontSize: '12px', color: '#6b7280', fontWeight: 500 }}>{k.label}</p>
              <p style={{ margin: 0, fontSize: '32px', fontWeight: 800, color: '#111827' }}>{k.value}</p>
            </div>
            <div style={{ width: '50px', height: '50px', borderRadius: '12px', background: k.bg, color: k.color, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>{k.icon}</div>
          </div>
        ))}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '20px' }}>
        {/* Users by Role */}
        <div style={{ background: '#fff', borderRadius: '14px', border: '1px solid #e5e7eb', padding: '24px', boxShadow: '0 1px 4px rgba(0,0,0,0.05)' }}>
          <h3 style={{ margin: '0 0 20px', fontSize: '16px', fontWeight: 700, color: '#111827' }}>👥 Users by Role</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {(usersByRole || []).map((r, i) => {
              const rc = roleColors[r.role] || roleColors.Student;
              return (
                <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 16px', background: '#f9fafb', borderRadius: '10px' }}>
                  <span style={{ ...rc, padding: '3px 12px', borderRadius: '20px', fontSize: '13px', fontWeight: 600 }}>{r.role}</span>
                  <span style={{ fontSize: '20px', fontWeight: 800, color: '#111827' }}>{r.count}</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Recent Activity */}
        <div style={{ background: '#fff', borderRadius: '14px', border: '1px solid #e5e7eb', padding: '24px', boxShadow: '0 1px 4px rgba(0,0,0,0.05)' }}>
          <h3 style={{ margin: '0 0 20px', fontSize: '16px', fontWeight: 700, color: '#111827' }}>📋 Recent Platform Activity</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {(recentActivities || []).map((act, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '10px 14px', background: '#f9fafb', borderRadius: '10px' }}>
                <div style={{ width: '34px', height: '34px', borderRadius: '50%', background: '#eff6ff', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <Activity size={15} color="#6366f1" />
                </div>
                <div style={{ flex: 1, overflow: 'hidden' }}>
                  <p style={{ margin: 0, fontSize: '13px', fontWeight: 600, color: '#111827', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{act.title}</p>
                  <p style={{ margin: 0, fontSize: '11px', color: '#9ca3af' }}>{act.User?.name} · {new Date(act.createdAt).toLocaleString()}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminOverviewTab;
