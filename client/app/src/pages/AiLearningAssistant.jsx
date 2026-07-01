import { BookOpen, BrainCircuit, MoreHorizontal, Send, Sparkles } from 'lucide-react';
import { useState } from 'react';
import useAuthStore from '../store/authStore';

const AiLearningAssistant = () => {
  const [input, setInput] = useState('');
  const { user } = useAuthStore();
  
  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', background: '#F9FAFB', fontFamily: 'Inter, sans-serif' }}>
      
      {/* Top Navbar */}
      <header style={{ height: '72px', background: '#111827', color: '#FFFFFF', display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 40px' }}>
         <div style={{ display: 'flex', alignItems: 'center', gap: '32px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', fontWeight: 'bold', fontSize: '18px' }}>
               <BookOpen size={24} color="var(--accent-primary)" />
               <span>University of Tomorrow</span>
            </div>
            <nav style={{ display: 'flex', gap: '24px', color: '#9CA3AF', fontSize: '14px', fontWeight: 500 }}>
               <span style={{ cursor: 'pointer', color: '#FFFFFF' }}>My Courses</span>
               <span style={{ cursor: 'pointer', hover: { color: '#FFFFFF' } }}>Calendar</span>
               <span style={{ cursor: 'pointer', hover: { color: '#FFFFFF' } }}>Library</span>
               <span style={{ cursor: 'pointer', hover: { color: '#FFFFFF' } }}>Community</span>
            </nav>
         </div>
         <div style={{ display: 'flex', alignItems: 'center', gap: '12px', cursor: 'pointer' }}>
            <img src={user?.avatar || `https://i.pravatar.cc/150?u=${user?.id || 4}`} alt={user?.name || "Student"} style={{ width: '32px', height: '32px', borderRadius: '50%', objectFit: 'cover' }} />
            <span style={{ fontSize: '14px', fontWeight: 500 }}>{user?.name || "Student"}</span>
         </div>
      </header>

      {/* Main Content Area */}
      <main style={{ flex: 1, padding: '40px', display: 'flex', gap: '32px', maxWidth: '1400px', margin: '0 auto', width: '100%' }}>
         
         {/* Left Panel: AI Learning Assistant */}
         <div style={{ flex: 2, background: '#FFFFFF', borderRadius: '24px', border: '1px solid #E5E7EB', display: 'flex', flexDirection: 'column', boxShadow: '0 10px 25px -5px rgba(0,0,0,0.05)' }}>
            
            {/* Panel Header */}
            <div style={{ padding: '24px 32px', borderBottom: '1px solid #F3F4F6', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
               <div style={{ display: 'flex', alignItems: 'center', gap: '12px', color: '#111827', fontWeight: 700, fontSize: '20px' }}>
                  <BrainCircuit size={28} color="var(--accent-primary)" />
                  AI Learning Assistant
               </div>
               <MoreHorizontal size={24} color="#9CA3AF" cursor="pointer" />
            </div>

            {/* Chat Area */}
            <div style={{ flex: 1, padding: '32px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '24px' }}>
               
               {/* User Message */}
               <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '16px' }}>
                  <div style={{ background: '#F3F4F6', color: '#111827', padding: '16px 24px', borderRadius: '20px', borderTopRightRadius: '4px', fontSize: '15px' }}>
                     Hello!
                  </div>
                  <img src={user?.avatar || `https://i.pravatar.cc/150?u=${user?.id || 4}`} alt={user?.name || "User"} style={{ width: '40px', height: '40px', borderRadius: '50%', objectFit: 'cover' }} />
               </div>

               {/* AI Message */}
               <div style={{ display: 'flex', gap: '16px' }}>
                  <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: 'rgba(246, 36, 64, 0.1)', color: 'var(--accent-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                     <BrainCircuit size={20} />
                  </div>
                  <div style={{ background: '#FFFFFF', border: '1px solid #E5E7EB', color: '#374151', padding: '16px 24px', borderRadius: '20px', borderTopLeftRadius: '4px', fontSize: '15px', lineHeight: '1.6', boxShadow: '0 2px 4px rgba(0,0,0,0.02)' }}>
                     Hello Alex! Based on your recent progress in 'Intro to Data Science', I've found some resources. How can I assist you today?
                  </div>
               </div>

            </div>

            {/* Input Area */}
            <div style={{ padding: '0 32px 32px' }}>
               
               {/* Suggestion Pills */}
               <div style={{ display: 'flex', gap: '16px', marginBottom: '24px' }}>
                  <button style={{ 
                     padding: '12px 24px', background: '#FFFFFF', border: '1px solid #10B981', borderRadius: '100px', color: '#10B981', fontWeight: 600, fontSize: '14px', cursor: 'pointer',
                     boxShadow: '0 0 10px rgba(16, 185, 129, 0.1)'
                  }}>
                     Generate Study Plan
                  </button>
                  <button style={{ 
                     padding: '12px 24px', background: '#FFFFFF', border: '1px solid #3B82F6', borderRadius: '100px', color: '#3B82F6', fontWeight: 600, fontSize: '14px', cursor: 'pointer',
                     boxShadow: '0 0 10px rgba(59, 130, 246, 0.1)'
                  }}>
                     Summarize Lesson
                  </button>
                  <button style={{ 
                     padding: '12px 24px', background: '#FFFFFF', border: '1px solid var(--warning)', borderRadius: '100px', color: 'var(--warning)', fontWeight: 600, fontSize: '14px', cursor: 'pointer',
                     boxShadow: '0 0 10px rgba(245, 158, 11, 0.1)'
                  }}>
                     Explain Concept
                  </button>
               </div>

               {/* Chat Input */}
               <div style={{ position: 'relative' }}>
                  <input 
                     type="text" 
                     placeholder="Ask me anything about your courses..." 
                     value={input}
                     onChange={(e) => setInput(e.target.value)}
                     style={{ width: '100%', padding: '20px 24px', paddingRight: '64px', background: '#F9FAFB', border: '1px solid #E5E7EB', borderRadius: '100px', fontSize: '15px', outline: 'none', color: '#111827' }}
                  />
                  <button style={{ position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)', width: '40px', height: '40px', background: 'transparent', border: 'none', color: '#9CA3AF', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                     <Send size={20} />
                  </button>
               </div>
            </div>

         </div>

         {/* Right Panel: AI-Powered Recommendations */}
         <div style={{ flex: 1, background: '#FFFFFF', borderRadius: '24px', border: '1px solid #E5E7EB', display: 'flex', flexDirection: 'column', boxShadow: '0 10px 25px -5px rgba(0,0,0,0.05)' }}>
            
            <div style={{ padding: '24px 32px', borderBottom: '1px solid #F3F4F6' }}>
               <h2 style={{ fontSize: '18px', fontWeight: 700, color: '#111827', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Sparkles size={20} color="var(--accent-primary)" />
                  AI-Powered Recommendations
               </h2>
            </div>

            <div style={{ padding: '32px', display: 'flex', flexDirection: 'column', gap: '24px' }}>
               
               {/* Card 1 */}
               <div style={{ background: '#F9FAFB', border: '1px solid #E5E7EB', borderRadius: '16px', padding: '20px' }}>
                  <div style={{ fontSize: '12px', color: '#6B7280', marginBottom: '4px', fontWeight: 500 }}>Recommended Course:</div>
                  <h3 style={{ fontSize: '16px', fontWeight: 700, color: '#111827', marginBottom: '8px' }}>Advanced Machine Learning</h3>
                  <p style={{ fontSize: '13px', color: '#4B5563', lineHeight: '1.5', marginBottom: '16px' }}>Based on your high performance in Data Science. Enrollment open.</p>
                  <button style={{ padding: '8px 16px', background: '#FFFFFF', border: '1px solid #D1D5DB', borderRadius: '100px', fontSize: '13px', fontWeight: 600, color: '#374151', cursor: 'pointer' }}>View Details</button>
               </div>

               {/* Card 2 */}
               <div style={{ background: '#F9FAFB', border: '1px solid #E5E7EB', borderRadius: '16px', padding: '20px' }}>
                  <div style={{ fontSize: '12px', color: '#6B7280', marginBottom: '4px', fontWeight: 500 }}>Supplementary Module:</div>
                  <h3 style={{ fontSize: '16px', fontWeight: 700, color: '#111827', marginBottom: '8px' }}>Data Ethics & Policy</h3>
                  <p style={{ fontSize: '13px', color: '#4B5563', lineHeight: '1.5', marginBottom: '16px' }}>Highly relevant to your current module. Completes in 2 hours.</p>
                  <button style={{ padding: '8px 16px', background: '#FFFFFF', border: '1px solid #D1D5DB', borderRadius: '100px', fontSize: '13px', fontWeight: 600, color: '#374151', cursor: 'pointer' }}>Start Module</button>
               </div>

               {/* Card 3 */}
               <div style={{ background: '#F9FAFB', border: '1px solid #E5E7EB', borderRadius: '16px', padding: '20px' }}>
                  <div style={{ fontSize: '12px', color: '#6B7280', marginBottom: '4px', fontWeight: 500 }}>Learning Path:</div>
                  <h3 style={{ fontSize: '16px', fontWeight: 700, color: '#111827', marginBottom: '8px' }}>Quantum Computing Basics</h3>
                  <p style={{ fontSize: '13px', color: '#4B5563', lineHeight: '1.5', marginBottom: '16px' }}>Explore a new field aligned with your interests.</p>
                  <button style={{ padding: '8px 16px', background: '#FFFFFF', border: '1px solid #D1D5DB', borderRadius: '100px', fontSize: '13px', fontWeight: 600, color: '#374151', cursor: 'pointer' }}>Explore Path</button>
               </div>

            </div>

         </div>

      </main>

    </div>
  );
};

export default AiLearningAssistant;
