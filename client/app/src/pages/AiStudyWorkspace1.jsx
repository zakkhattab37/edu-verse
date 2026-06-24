import { Code, Play, RefreshCw, Terminal, CheckCircle } from 'lucide-react';

const AiStudyWorkspace1 = () => {
  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: 'var(--bg-primary)' }}>
       {/* Sidebar / Requirements */}
       <aside className="glass-panel" style={{ width: '400px', borderRadius: 0, padding: '32px 24px', display: 'flex', flexDirection: 'column', borderRight: '1px solid rgba(255,255,255,0.05)' }}>
          <div className="flex items-center gap-2" style={{ color: 'var(--accent-primary)', marginBottom: '24px' }}>
             <Code size={24} />
             <h2 style={{ fontSize: '20px' }}>AI Coding Workspace</h2>
          </div>
          
          <h3 style={{ fontSize: '18px', marginBottom: '16px' }}>Exercise: Implement ReLU</h3>
          <p style={{ color: 'var(--text-secondary)', lineHeight: '1.6', marginBottom: '24px' }}>
            Write a Python function that implements the Rectified Linear Unit (ReLU) activation function. 
            The function should take a single numerical input `x` and return `x` if `x &gt; 0`, otherwise `0`.
          </p>

          <div style={{ padding: '16px', background: 'rgba(16, 185, 129, 0.1)', borderRadius: '8px', color: 'var(--success)', display: 'flex', gap: '12px', marginBottom: 'auto' }}>
             <CheckCircle size={20} style={{ flexShrink: 0 }} />
             <span style={{ fontSize: '14px' }}>AI Tip: You can use the built-in `max()` function to solve this elegantly in one line!</span>
          </div>

          <button className="btn btn-secondary" style={{ width: '100%', marginTop: '24px' }}>Get AI Hint</button>
       </aside>

       {/* Editor & Terminal */}
       <main style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
          {/* Editor Placeholder */}
          <div style={{ flex: 2, padding: '24px', background: '#1E1E1E', fontFamily: 'monospace', fontSize: '16px', color: '#D4D4D4', display: 'flex', flexDirection: 'column' }}>
             <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '16px', color: '#858585', fontSize: '14px' }}>
                <span>main.py</span>
                <div className="flex gap-4">
                   <button className="flex items-center gap-2" style={{ background: 'none', border: 'none', color: '#858585', cursor: 'pointer' }}><RefreshCw size={14} /> Reset</button>
                   <button className="flex items-center gap-2" style={{ background: 'var(--success)', border: 'none', color: 'white', padding: '4px 12px', borderRadius: '4px', cursor: 'pointer' }}><Play size={14} /> Run Tests</button>
                </div>
             </div>
             <pre style={{ flex: 1, margin: 0 }}>
<span style={{ color: '#569CD6' }}>def</span> <span style={{ color: '#DCDCAA' }}>relu</span>(x):
    <span style={{ color: '#6A9955' }}># Your code here</span>
    <span style={{ color: '#C586C0' }}>return</span> x
             </pre>
          </div>

          {/* Terminal / Output */}
          <div style={{ flex: 1, background: '#0A0A0A', padding: '24px', borderTop: '1px solid #333', fontFamily: 'monospace' }}>
             <div className="flex items-center gap-2" style={{ color: '#858585', marginBottom: '16px', fontSize: '14px' }}>
                <Terminal size={16} /> Console Output
             </div>
             <div style={{ color: '#EF4444' }}>
                &gt; AssertionError: relu(-5) expected 0, got -5
             </div>
          </div>
       </main>
    </div>
  );
};

export default AiStudyWorkspace1;
