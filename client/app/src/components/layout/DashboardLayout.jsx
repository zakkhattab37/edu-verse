import Sidebar from './Sidebar';
import ChatWidget from '../ui/ChatWidget';

const DashboardLayout = ({ menuItems, activeMenu, setActiveMenu, children }) => {
  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: '#f8fafc', fontFamily: "'Inter', sans-serif" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap');
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        ::-webkit-scrollbar { width: 6px; }
        ::-webkit-scrollbar-track { background: transparent; }
        ::-webkit-scrollbar-thumb { background: #cbd5e1; border-radius: 3px; }
      `}</style>
      
      <Sidebar 
        menuItems={menuItems} 
        activeMenu={activeMenu} 
        setActiveMenu={setActiveMenu} 
      />
      
      <main style={{ flex: 1, height: '100vh', overflowY: 'auto' }}>
        {children}
      </main>

      {/* Global floating chat widget */}
      <ChatWidget />
    </div>
  );
};

export default DashboardLayout;

