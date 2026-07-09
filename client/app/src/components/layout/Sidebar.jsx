import { useNavigate } from 'react-router-dom';
import useAuthStore from '../../store/authStore';
import { BrainCircuit, LogOut } from 'lucide-react';

const Sidebar = ({ menuItems, activeMenu, setActiveMenu }) => {
  const navigate = useNavigate();
  const { user, logout } = useAuthStore();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <aside style={{ 
      width: '260px', 
      background: 'linear-gradient(180deg, #0f172a 0%, #1e293b 100%)', 
      color: '#94a3b8', 
      display: 'flex', 
      flexDirection: 'column', 
      position: 'sticky', 
      top: 0, 
      height: '100vh', 
      flexShrink: 0,
      borderRight: '1px solid rgba(255,255,255,0.05)'
    }}>
      {/* Logo */}
      <div 
        onClick={() => navigate('/dashboard')}
        style={{ padding: '28px 24px 20px', display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer' }}
      >
        <div style={{ width: '38px', height: '38px', background: 'linear-gradient(135deg, #6366f1, #8b5cf6)', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <BrainCircuit size={22} color="#fff" />
        </div>
        <div>
          <div style={{ color: '#fff', fontWeight: 800, fontSize: '17px', letterSpacing: '-0.3px' }}>EduVerse</div>
          <div style={{ fontSize: '11px', color: '#64748b', fontWeight: 500 }}>{user?.role} Portal</div>
        </div>
      </div>

      {/* User Profile Card */}
      <div 
        onClick={() => navigate(user?.role === 'Student' ? '/student-profile' : '/instructor-profile')} 
        style={{ margin: '0 16px 20px', background: 'rgba(255,255,255,0.05)', borderRadius: '12px', padding: '16px', display: 'flex', alignItems: 'center', gap: '12px', border: '1px solid rgba(255,255,255,0.08)', cursor: 'pointer', transition: 'background 0.2s' }}
        onMouseOver={e => e.currentTarget.style.background = 'rgba(255,255,255,0.1)'}
        onMouseOut={e => e.currentTarget.style.background = 'rgba(255,255,255,0.05)'}
      >
        <img
          src={user?.avatar || `https://i.pravatar.cc/150?u=${user?.id}`}
          alt={user?.name}
          style={{ width: '42px', height: '42px', borderRadius: '50%', border: '2px solid #6366f1', flexShrink: 0, objectFit: 'cover' }}
        />
        <div style={{ overflow: 'hidden' }}>
          <div style={{ color: '#fff', fontWeight: 700, fontSize: '14px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{user?.name || 'User'}</div>
          <div style={{ fontSize: '11px', color: '#64748b', fontWeight: 500 }}>{user?.role}</div>
        </div>
      </div>

      {/* Navigation Links */}
      <nav style={{ display: 'flex', flexDirection: 'column', gap: '4px', padding: '0 12px', flex: 1, overflowY: 'auto' }}>
        {menuItems.map(item => {
          const isActive = activeMenu === item.name;
          return (
            <div
              key={item.name}
              onClick={() => setActiveMenu(item.name)}
              style={{
                display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                padding: '12px 16px', borderRadius: '10px', cursor: 'pointer',
                background: isActive ? 'linear-gradient(135deg, #6366f1, #8b5cf6)' : 'transparent',
                color: isActive ? '#fff' : '#94a3b8',
                fontWeight: isActive ? 600 : 500,
                transition: 'all 0.2s ease',
                boxShadow: isActive ? '0 4px 12px rgba(99,102,241,0.25)' : 'none'
              }}
              onMouseOver={e => {
                if (!isActive) {
                  e.currentTarget.style.background = 'rgba(255,255,255,0.05)';
                  e.currentTarget.style.color = '#e2e8f0';
                }
              }}
              onMouseOut={e => {
                if (!isActive) {
                  e.currentTarget.style.background = 'transparent';
                  e.currentTarget.style.color = '#94a3b8';
                }
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', fontSize: '14px' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', color: isActive ? '#fff' : '#64748b' }}>
                  {item.icon}
                </div>
                {item.name}
              </div>
              {item.badge && (
                <span style={{ background: isActive ? 'rgba(255,255,255,0.2)' : '#ef4444', color: '#fff', fontSize: '11px', fontWeight: 700, padding: '2px 8px', borderRadius: '20px' }}>
                  {item.badge}
                </span>
              )}
            </div>
          );
        })}
      </nav>

      {/* Logout */}
      <div style={{ padding: '16px' }}>
        <button
          onClick={handleLogout}
          style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', padding: '12px', background: 'rgba(255,255,255,0.05)', color: '#94a3b8', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '10px', fontSize: '14px', fontWeight: 600, cursor: 'pointer', transition: 'all 0.2s' }}
          onMouseOver={e => { e.currentTarget.style.background = '#ef4444'; e.currentTarget.style.color = '#fff'; e.currentTarget.style.borderColor = '#ef4444'; }}
          onMouseOut={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.05)'; e.currentTarget.style.color = '#94a3b8'; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.1)'; }}
        >
          <LogOut size={16} /> Log Out
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
