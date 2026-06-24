import { BarChart, TrendingUp, Target, Clock, Calendar } from 'lucide-react';

const StudentAnalyticsDashboard = () => {
  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: 'var(--bg-primary)' }}>
      <main style={{ flex: 1, padding: '48px 64px' }}>
        <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '40px' }}>
          <div>
            <h2 style={{ fontSize: '32px', marginBottom: '8px' }}>Learning Analytics</h2>
            <p style={{ color: 'var(--text-secondary)' }}>Track your progress, study habits, and performance metrics.</p>
          </div>
          <div className="flex gap-2">
            <button className="btn btn-secondary">This Week</button>
            <button className="btn btn-secondary" style={{ background: 'var(--bg-secondary)', color: 'var(--text-muted)' }}>This Month</button>
          </div>
        </header>

        {/* KPI Row */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '24px', marginBottom: '40px' }}>
            <div className="glass-panel flex items-center gap-4" style={{ padding: '24px' }}>
                <div style={{ padding: '16px', background: 'rgba(99, 102, 241, 0.1)', color: 'var(--accent-primary)', borderRadius: '12px' }}>
                   <Clock size={24} />
                </div>
                <div>
                   <div style={{ fontSize: '14px', color: 'var(--text-secondary)', marginBottom: '4px' }}>Time Studied</div>
                   <div style={{ fontSize: '24px', fontWeight: 'bold' }}>14h 30m</div>
                </div>
            </div>
            <div className="glass-panel flex items-center gap-4" style={{ padding: '24px' }}>
                <div style={{ padding: '16px', background: 'rgba(16, 185, 129, 0.1)', color: 'var(--success)', borderRadius: '12px' }}>
                   <Target size={24} />
                </div>
                <div>
                   <div style={{ fontSize: '14px', color: 'var(--text-secondary)', marginBottom: '4px' }}>Avg. Quiz Score</div>
                   <div style={{ fontSize: '24px', fontWeight: 'bold' }}>92%</div>
                </div>
            </div>
            <div className="glass-panel flex items-center gap-4" style={{ padding: '24px' }}>
                <div style={{ padding: '16px', background: 'rgba(245, 158, 11, 0.1)', color: 'var(--warning)', borderRadius: '12px' }}>
                   <TrendingUp size={24} />
                </div>
                <div>
                   <div style={{ fontSize: '14px', color: 'var(--text-secondary)', marginBottom: '4px' }}>Current Streak</div>
                   <div style={{ fontSize: '24px', fontWeight: 'bold' }}>5 Days</div>
                </div>
            </div>
            <div className="glass-panel flex items-center gap-4" style={{ padding: '24px' }}>
                <div style={{ padding: '16px', background: 'rgba(99, 102, 241, 0.1)', color: 'var(--accent-primary)', borderRadius: '12px' }}>
                   <Calendar size={24} />
                </div>
                <div>
                   <div style={{ fontSize: '14px', color: 'var(--text-secondary)', marginBottom: '4px' }}>Classes Attended</div>
                   <div style={{ fontSize: '24px', fontWeight: 'bold' }}>12/15</div>
                </div>
            </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '24px' }}>
          {/* Main Chart Placeholder */}
          <div className="glass-panel" style={{ padding: '32px', display: 'flex', flexDirection: 'column' }}>
             <h3 style={{ fontSize: '20px', marginBottom: '24px' }}>Study Hours per Day</h3>
             <div style={{ flex: 1, display: 'flex', alignItems: 'flex-end', gap: '16px', height: '200px' }}>
                {[30, 50, 80, 40, 90, 60, 20].map((h, i) => (
                  <div key={i} style={{ flex: 1, background: 'var(--accent-primary)', height: `${h}%`, borderRadius: '4px 4px 0 0', opacity: i === 4 ? 1 : 0.5 }}></div>
                ))}
             </div>
             <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '16px', color: 'var(--text-muted)', fontSize: '12px' }}>
                <span>Mon</span><span>Tue</span><span>Wed</span><span>Thu</span><span>Fri</span><span>Sat</span><span>Sun</span>
             </div>
          </div>

          {/* Radar Chart / Skills Breakdown Placeholder */}
          <div className="glass-panel" style={{ padding: '32px' }}>
             <h3 style={{ fontSize: '20px', marginBottom: '24px' }}>Skill Mastery</h3>
             <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                {[
                  { skill: 'Python Programming', mastery: 85 },
                  { skill: 'Linear Algebra', mastery: 70 },
                  { skill: 'Data Structures', mastery: 95 }
                ].map((s, i) => (
                  <div key={i}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', fontSize: '14px' }}>
                      <span>{s.skill}</span>
                      <span style={{ color: 'var(--accent-primary)' }}>{s.mastery}%</span>
                    </div>
                    <div style={{ height: '6px', background: 'var(--bg-secondary)', borderRadius: '3px', overflow: 'hidden' }}>
                      <div style={{ width: `${s.mastery}%`, height: '100%', background: 'var(--accent-gradient)' }}></div>
                    </div>
                  </div>
                ))}
             </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default StudentAnalyticsDashboard;
