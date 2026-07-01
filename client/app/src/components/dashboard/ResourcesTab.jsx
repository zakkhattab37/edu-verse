import { Book, Compass, Library, BrainCircuit, ExternalLink, HelpCircle } from 'lucide-react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

const ResourcesTab = () => {
  const navigate = useNavigate();

  const resources = [
    {
      category: 'AI Study Tools',
      items: [
        { title: 'NotebookLM Workspace', description: 'Interact with your course materials using AI.', icon: <BrainCircuit size={24} />, path: '/ai-workspace-2', color: '#0B57D0', bg: '#D3E3FD' },
        { title: 'AI Flashcards', description: 'Auto-generate flashcards from your notes.', icon: <Compass size={24} />, path: '/ai-workspace-1', color: '#8B5CF6', bg: '#EDE9FE' }
      ]
    },
    {
      category: 'University Services',
      items: [
        { title: 'Digital Library', description: 'Access academic journals and books.', icon: <Library size={24} />, path: '#', color: '#10B981', bg: '#D1FAE5' },
        { title: 'Student Support', description: 'Get help with enrollment and advising.', icon: <HelpCircle size={24} />, path: '#', color: '#F59E0B', bg: '#FEF3C7' }
      ]
    }
  ];

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.5 }}
      style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}
    >
      <div>
        <h2 style={{ fontSize: '24px', fontWeight: 700, color: '#111827', marginBottom: '8px' }}>Resources & Tools</h2>
        <p style={{ color: '#6B7280' }}>Quick access to study tools, libraries, and university services.</p>
      </div>

      {resources.map((section, idx) => (
         <div key={idx}>
            <h3 style={{ fontSize: '18px', fontWeight: 600, color: '#111827', marginBottom: '16px', paddingBottom: '8px', borderBottom: '1px solid #E5E7EB' }}>
               {section.category}
            </h3>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '24px' }}>
               {section.items.map((item, i) => (
                  <motion.div 
                     key={i}
                     initial={{ opacity: 0, scale: 0.95 }}
                     animate={{ opacity: 1, scale: 1 }}
                     transition={{ delay: i * 0.1 }}
                     onClick={() => item.path !== '#' && navigate(item.path)}
                     style={{ background: '#FFFFFF', borderRadius: '16px', padding: '24px', border: '1px solid #E5E7EB', boxShadow: '0 1px 3px rgba(0,0,0,0.05)', display: 'flex', alignItems: 'flex-start', gap: '16px', cursor: item.path === '#' ? 'default' : 'pointer', transition: 'all 0.2s' }}
                     onMouseOver={e => item.path !== '#' && (e.currentTarget.style.transform = 'translateY(-2px)')}
                     onMouseOut={e => item.path !== '#' && (e.currentTarget.style.transform = 'translateY(0)')}
                  >
                     <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: item.bg, color: item.color, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                        {item.icon}
                     </div>
                     <div style={{ flex: 1 }}>
                        <h4 style={{ fontSize: '16px', fontWeight: 600, color: '#111827', marginBottom: '4px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                           {item.title} {item.path === '#' && <ExternalLink size={14} color="#9CA3AF" />}
                        </h4>
                        <p style={{ fontSize: '14px', color: '#6B7280', lineHeight: '1.5' }}>{item.description}</p>
                     </div>
                  </motion.div>
               ))}
            </div>
         </div>
      ))}
    </motion.div>
  );
};

export default ResourcesTab;
