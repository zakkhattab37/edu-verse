import { useEffect } from 'react';
import useAuthStore from '../store/authStore';
import { BookOpen, LogOut, Shield, Activity, Users, Database } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const AdminDashboard = () => {
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();

  useEffect(() => {
    if (user?.role !== 'Admin') {
      navigate('/dashboard');
    }
  }, [user, navigate]);

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: 'var(--bg-primary)' }}>
      {/* Sidebar */}
      <aside className="glass-panel" style={{ width: '280px', borderRadius: '0', borderRight: '1px solid rgba(255,255,255,0.05)', padding: '32px 24px', display: 'flex', flexDirection: 'column' }}>
        <div className="flex items-center gap-2" style={{ marginBottom: '48px', color: 'var(--danger)' }}>
          <Shield size={28} />
          <h1 style={{ fontSize: '20px', margin: 0, color: 'var(--text-primary)' }}>EDUVERSE Admin</h1>
        </div>

        <nav style={{ display: 'flex', flexDirection: 'column', gap: '8px', flex: 1 }}>
          <a href="#" className="flex items-center gap-2" style={{ padding: '12px 16px', background: 'rgba(239, 68, 68, 0.1)', color: 'var(--danger)', borderRadius: '8px', fontWeight: 500 }}>
            <Activity size={18} /> Platform Health
          </a>
          <a href="#" className="flex items-center gap-2" style={{ padding: '12px 16px', color: 'var(--text-secondary)', borderRadius: '8px', fontWeight: 500, transition: 'all 0.2s' }}>
            <Users size={18} /> Manage Users
          </a>
          <a href="#" className="flex items-center gap-2" style={{ padding: '12px 16px', color: 'var(--text-secondary)', borderRadius: '8px', fontWeight: 500, transition: 'all 0.2s' }}>
            <Database size={18} /> Course Approvals
          </a>
        </nav>

        <div style={{ marginTop: 'auto', paddingTop: '24px', borderTop: '1px solid rgba(255,255,255,0.1)' }}>
          <div className="flex items-center gap-4" style={{ marginBottom: '16px' }}>
            <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: 'var(--danger)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold' }}>
              A
            </div>
            <div>
              <div style={{ fontWeight: 600, fontSize: '14px' }}>System Admin</div>
            </div>
          </div>
          <button onClick={() => { logout(); navigate('/login'); }} className="btn" style={{ width: '100%', background: 'rgba(255,255,255,0.05)' }}>
            <LogOut size={16} /> Sign Out
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main style={{ flex: 1, padding: '48px 64px' }}>
        <header style={{ marginBottom: '40px' }}>
          <h2 style={{ fontSize: '32px', marginBottom: '8px' }}>System Administration</h2>
          <p style={{ color: 'var(--text-secondary)' }}>Monitor platform health, server load, and manage institutional accounts.</p>
        </header>

        {/* Stats Row */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '24px', marginBottom: '40px' }}>
            <div className="glass-panel" style={{ padding: '24px', borderTop: '4px solid var(--danger)' }}>
                <div style={{ fontSize: '14px', color: 'var(--text-secondary)', marginBottom: '8px' }}>System Status</div>
                <div style={{ fontSize: '24px', fontWeight: 'bold', color: 'var(--success)' }}>All Systems Operational</div>
            </div>
            <div className="glass-panel" style={{ padding: '24px' }}>
                <div style={{ fontSize: '14px', color: 'var(--text-secondary)', marginBottom: '8px' }}>Active Users (Live)</div>
                <div style={{ fontSize: '32px', fontWeight: 'bold' }}>8,492</div>
            </div>
            <div className="glass-panel" style={{ padding: '24px' }}>
                <div style={{ fontSize: '14px', color: 'var(--text-secondary)', marginBottom: '8px' }}>Pending Course Approvals</div>
                <div style={{ fontSize: '32px', fontWeight: 'bold', color: 'var(--warning)' }}>14</div>
            </div>
        </div>

        <section className="glass-panel" style={{ padding: '32px' }}>
           <h3 style={{ fontSize: '20px', marginBottom: '24px' }}>Recent Activity Logs</h3>
           <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {[
                  { time: '10:42 AM', action: 'New Instructor Registration: Dr. Alan Turing', ip: '192.168.1.1' },
                  { time: '10:15 AM', action: 'Course "Advanced Math" published by Bob', ip: '10.0.0.4' },
                  { time: '09:30 AM', action: 'System Backup Completed', ip: 'localhost' },
              ].map((log, i) => (
                  <div key={i} style={{ display: 'flex', justifyContent: 'space-between', padding: '16px', background: 'var(--bg-secondary)', borderRadius: '8px', fontSize: '14px' }}>
                      <div><span style={{ color: 'var(--text-muted)', marginRight: '16px' }}>{log.time}</span> {log.action}</div>
                      <div style={{ color: 'var(--text-muted)', fontFamily: 'monospace' }}>{log.ip}</div>
                  </div>
              ))}
           </div>
        </section>
      </main>
    </div>
  );
};

export default AdminDashboard;
