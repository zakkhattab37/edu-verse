import { useState } from 'react';
import { Flag, Check } from 'lucide-react';

const QuizInterface = () => {
  const [selectedOption, setSelectedOption] = useState('A');

  const options = [
    { id: 'A', text: 'A. Feature extraction and pattern recognition' },
    { id: 'B', text: 'B. Data normalization and scaling' },
    { id: 'C', text: 'C. Sequence prediction in time-series data' },
    { id: 'D', text: 'D. Linear regression for trend analysis' }
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', background: '#F3F4F6', fontFamily: 'Inter, sans-serif' }}>
      
      {/* Top Header */}
      <header style={{ background: 'var(--accent-primary)', color: 'white', padding: '24px 48px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
         <h1 style={{ fontSize: '24px', fontWeight: 500, margin: 0 }}>Midterm Quiz: Advanced Machine Learning</h1>
         
         <div style={{ display: 'flex', alignItems: 'center', gap: '48px' }}>
            <div style={{ fontSize: '24px', fontWeight: 500 }}>00:28:45 Remaining</div>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', minWidth: '200px' }}>
               <div style={{ fontSize: '14px', textAlign: 'right' }}>Question 5 of 20</div>
               <div style={{ width: '100%', height: '8px', background: 'rgba(255,255,255,0.3)', borderRadius: '4px' }}>
                  <div style={{ width: '25%', height: '100%', background: 'white', borderRadius: '4px' }}></div>
               </div>
            </div>
         </div>
      </header>

      {/* Main Layout */}
      <main style={{ padding: '40px', display: 'flex', gap: '32px', maxWidth: '1400px', margin: '0 auto', width: '100%' }}>
         
         {/* Left Column (Question Area) */}
         <div style={{ flex: 3, display: 'flex', flexDirection: 'column' }}>
            <div style={{ background: '#FFFFFF', borderRadius: '12px', padding: '40px', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)', marginBottom: '24px' }}>
               <h2 style={{ fontSize: '22px', fontWeight: 700, color: '#111827', marginBottom: '16px' }}>Question 5:</h2>
               <p style={{ fontSize: '18px', color: '#111827', lineHeight: '1.5', marginBottom: '40px' }}>
                  What is the primary function of a Convolutional Neural Network (CNN) in image processing?
               </p>

               <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                  {options.map(opt => (
                     <div 
                        key={opt.id}
                        onClick={() => setSelectedOption(opt.id)}
                        style={{ 
                           display: 'flex', alignItems: 'center', gap: '16px', padding: '16px 24px', 
                           borderRadius: '8px', cursor: 'pointer',
                           border: selectedOption === opt.id ? '2px solid var(--accent-primary)' : '1px solid #D1D5DB',
                           background: selectedOption === opt.id ? 'rgba(246, 36, 64, 0.05)' : '#F9FAFB'
                        }}
                     >
                        {/* Custom Radio */}
                        <div style={{ 
                           width: '20px', height: '20px', borderRadius: '50%', border: '2px solid',
                           borderColor: selectedOption === opt.id ? 'var(--accent-primary)' : '#9CA3AF',
                           display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#FFFFFF'
                        }}>
                           {selectedOption === opt.id && <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: 'var(--accent-primary)' }}></div>}
                        </div>
                        <span style={{ fontSize: '16px', color: '#111827' }}>{opt.text}</span>
                     </div>
                  ))}
               </div>
            </div>

            <div>
               <button style={{ padding: '14px 32px', background: '#1E3A8A', color: 'white', border: 'none', borderRadius: '8px', fontSize: '16px', fontWeight: 500, cursor: 'pointer' }}>
                  Submit Quiz
               </button>
            </div>
         </div>

         {/* Right Column (Navigator) */}
         <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '24px' }}>
            <div style={{ background: '#FFFFFF', borderRadius: '12px', padding: '32px', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)' }}>
               <h3 style={{ fontSize: '18px', fontWeight: 700, color: '#111827', marginBottom: '24px' }}>Question Navigator</h3>
               
               <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '12px', marginBottom: '32px' }}>
                  {Array.from({ length: 20 }, (_, i) => i + 1).map(num => {
                     const isCompleted = num < 5;
                     const isCurrent = num === 5;
                     const isFlagged = num === 8;
                     
                     let bgColor = '#E5E7EB'; // Unanswered
                     let color = '#4B5563';
                     
                     if (isCompleted) {
                        bgColor = 'var(--success)';
                        color = 'white';
                     } else if (isCurrent) {
                        bgColor = 'var(--accent-primary)';
                        color = 'white';
                     }

                     return (
                        <div key={num} style={{ position: 'relative', width: '100%', aspectRatio: '1', display: 'flex', alignItems: 'center', justifyContent: 'center', background: bgColor, color, borderRadius: '8px', fontWeight: 600, fontSize: '16px', cursor: 'pointer' }}>
                           {num}
                           {isCompleted && <Check size={12} color="white" style={{ position: 'absolute', top: 4, right: 4 }} />}
                           {isFlagged && <Flag size={14} color="#F59E0B" fill="#F59E0B" style={{ position: 'absolute', top: 4, right: 4 }} />}
                        </div>
                     )
                  })}
               </div>

               <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', fontSize: '14px', color: '#111827' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                     <div style={{ width: '16px', height: '16px', borderRadius: '4px', background: 'var(--success)' }}></div>
                     Completed
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '24px' }}>
                     <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <div style={{ width: '16px', height: '16px', borderRadius: '4px', background: 'var(--accent-primary)' }}></div>
                        Current
                     </div>
                     <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <div style={{ width: '16px', height: '16px', borderRadius: '4px', background: '#E5E7EB' }}></div>
                        Unanswered
                     </div>
                  </div>
               </div>
            </div>

            <div style={{ display: 'flex', gap: '16px', justifyContent: 'space-between' }}>
               <button style={{ flex: 1, padding: '14px', background: '#FFFFFF', color: '#1E3A8A', border: '1px solid #1E3A8A', borderRadius: '8px', fontSize: '16px', fontWeight: 500, cursor: 'pointer' }}>
                  Next
               </button>
               <button style={{ flex: 1, padding: '14px', background: '#F3F4F6', color: '#1E3A8A', border: '1px solid #D1D5DB', borderRadius: '8px', fontSize: '16px', fontWeight: 500, cursor: 'pointer' }}>
                  Previous
               </button>
            </div>
         </div>

      </main>

    </div>
  );
};

export default QuizInterface;
