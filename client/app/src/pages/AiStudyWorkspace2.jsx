import { Menu, Bell, Search, FileText, Link as LinkIcon, MessageSquare, MoreHorizontal, Send, Grid, Plus, Bold, Italic, Underline, Link2, List, ListOrdered, Image as ImageIcon, Undo, Redo, Sparkles } from 'lucide-react';
import useAuthStore from '../store/authStore';

const AiStudyWorkspace2 = () => {
  const { user } = useAuthStore();
  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100vh', background: '#F0F4F9', fontFamily: 'Inter, sans-serif' }}>
      
      {/* Header */}
      <header style={{ height: '64px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 24px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
           <Menu size={24} color="#444746" cursor="pointer" />
           <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ fontSize: '20px', fontWeight: 500, color: '#1F1F1F' }}>NotebookLM</span>
           </div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
           <Bell size={24} color="#444746" cursor="pointer" />
           <img src={user?.avatar || `https://i.pravatar.cc/150?u=${user?.id || 9}`} alt={user?.name || "User"} style={{ width: '32px', height: '32px', borderRadius: '50%', objectFit: 'cover' }} />
        </div>
      </header>

      {/* Main Layout */}
      <main style={{ flex: 1, padding: '0 16px 16px', display: 'flex', gap: '12px', overflow: 'hidden' }}>
        
        {/* Column 1: Sources */}
        <div style={{ width: '320px', display: 'flex', flexDirection: 'column', background: '#FFFFFF', borderRadius: '24px', overflow: 'hidden' }}>
          <div style={{ padding: '24px 24px 16px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
               <h2 style={{ color: '#1F1F1F', fontSize: '18px', fontWeight: 500 }}>Sources</h2>
               <button style={{ background: '#D3E3FD', color: '#041E49', border: 'none', borderRadius: '100px', width: '32px', height: '32px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>
                  <Plus size={20} />
               </button>
            </div>
            
            <div style={{ position: 'relative' }}>
               <Search size={18} color="#444746" style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)' }} />
               <input type="text" placeholder="Search sources" style={{ width: '100%', background: '#F0F4F9', border: 'none', borderRadius: '100px', padding: '12px 16px 12px 44px', color: '#1F1F1F', fontSize: '14px', outline: 'none' }} />
            </div>
          </div>
          
          <div style={{ flex: 1, overflowY: 'auto', padding: '0 24px 24px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
             
             {[
               { name: 'Intro_to_Machine_Learning.pdf', type: 'PDF', iconColor: '#EA4335' },
               { name: 'Deep_Learning_Textbook_Chap4.pdf', type: 'PDF', iconColor: '#EA4335' },
               { name: 'Course_Syllabus_Fall2023.docx', type: 'Doc', iconColor: '#4285F4' },
               { name: 'Lecture_Slides_Week5.pptx', type: 'Slides', iconColor: '#FBBC04' },
               { name: 'MIT Tech Review Article', type: 'Link', iconColor: '#444746' },
               { name: 'Stanford CS229 - Class Notes', type: 'Link', iconColor: '#444746' },
             ].map((doc, i) => (
                <div key={i} style={{ background: '#F0F4F9', padding: '16px', borderRadius: '16px', display: 'flex', alignItems: 'flex-start', gap: '12px', cursor: 'pointer' }}>
                   <div style={{ width: '32px', height: '32px', borderRadius: '8px', background: '#FFFFFF', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                      {doc.type === 'Link' ? <LinkIcon size={18} color={doc.iconColor} /> : <FileText size={18} color={doc.iconColor} />}
                   </div>
                   <div>
                      <div style={{ fontSize: '14px', fontWeight: 500, color: '#1F1F1F', marginBottom: '2px', wordBreak: 'break-all', lineHeight: '1.4' }}>{doc.name}</div>
                      <div style={{ fontSize: '12px', color: '#444746' }}>{doc.type}</div>
                   </div>
                </div>
             ))}

          </div>
        </div>

        {/* Column 2: Notebook Guide (Chat) */}
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', background: '#FFFFFF', borderRadius: '24px', overflow: 'hidden', position: 'relative' }}>
          
          <div style={{ padding: '24px', display: 'flex', alignItems: 'center', gap: '8px', borderBottom: '1px solid #F0F4F9' }}>
             <Sparkles size={20} color="#0B57D0" />
             <h2 style={{ color: '#1F1F1F', fontSize: '18px', fontWeight: 500 }}>Notebook guide</h2>
          </div>

          <div style={{ flex: 1, overflowY: 'auto', padding: '24px 40px', display: 'flex', flexDirection: 'column' }}>
             
             {/* Welcome Area */}
             <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', margin: '40px 0 60px', textAlign: 'center' }}>
                <div style={{ fontSize: '32px', fontWeight: 400, color: '#1F1F1F', marginBottom: '16px' }}>Hi there!</div>
                <div style={{ fontSize: '16px', color: '#444746', maxWidth: '400px', lineHeight: '1.5' }}>
                  I'm your Notebook guide. I can help you understand your sources, create study materials, or summarize key concepts.
                </div>
             </div>

             {/* Suggestions */}
             <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '40px' }}>
                {[
                  "Summarize the key findings",
                  "Compare deep learning definitions",
                  "Create a study guide",
                  "Suggest exam questions"
                ].map((sugg, i) => (
                  <button key={i} style={{ background: '#FFFFFF', border: '1px solid #E0E2E0', color: '#1F1F1F', padding: '16px', borderRadius: '16px', fontSize: '14px', cursor: 'pointer', textAlign: 'left', display: 'flex', alignItems: 'center', gap: '8px', transition: 'background 0.2s' }}
                          onMouseOver={e => e.currentTarget.style.background = '#F0F4F9'}
                          onMouseOut={e => e.currentTarget.style.background = '#FFFFFF'}>
                    <Sparkles size={16} color="#0B57D0" />
                    {sugg}
                  </button>
                ))}
             </div>

             {/* Example Conversation */}
             <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', marginTop: 'auto' }}>
                {/* User Message */}
                <div style={{ alignSelf: 'flex-end', background: '#F0F4F9', padding: '12px 20px', borderRadius: '24px 24px 4px 24px', color: '#1F1F1F', fontSize: '15px', maxWidth: '80%' }}>
                  What are the main challenges mentioned in the MIT article?
                </div>
                {/* AI Message */}
                <div style={{ display: 'flex', gap: '16px', maxWidth: '85%' }}>
                   <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: '#D3E3FD', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                      <Sparkles size={16} color="#0B57D0" />
                   </div>
                   <div style={{ color: '#1F1F1F', fontSize: '15px', lineHeight: '1.6', paddingTop: '4px' }}>
                     According to the MIT article, the primary challenges include:
                     <ul style={{ paddingLeft: '20px', margin: '8px 0 0', display: 'flex', flexDirection: 'column', gap: '4px' }}>
                        <li style={{ listStyleType: 'disc' }}>The requirement for massive amounts of labeled data.</li>
                        <li style={{ listStyleType: 'disc' }}>Ethical concerns regarding bias in training sets.</li>
                        <li style={{ listStyleType: 'disc' }}>The "black box" problem of understanding how algorithms make decisions.</li>
                     </ul>
                   </div>
                </div>
             </div>

          </div>

          {/* Input Area */}
          <div style={{ padding: '0 24px 24px' }}>
             <div style={{ position: 'relative', background: '#F0F4F9', borderRadius: '100px', display: 'flex', alignItems: 'center', padding: '4px 8px' }}>
                <input type="text" placeholder="Ask anything..." style={{ flex: 1, background: 'transparent', border: 'none', padding: '16px 20px', fontSize: '15px', outline: 'none', color: '#1F1F1F' }} />
                <button style={{ width: '40px', height: '40px', borderRadius: '50%', background: '#0B57D0', border: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', flexShrink: 0, marginRight: '4px' }}>
                   <Send size={18} color="#FFFFFF" />
                </button>
             </div>
             <div style={{ textAlign: 'center', fontSize: '11px', color: '#444746', marginTop: '12px' }}>
               Notebook guide may produce inaccurate information about people, places, or facts.
             </div>
          </div>

        </div>

        {/* Column 3: Notes & Insights */}
        <div style={{ width: '380px', display: 'flex', flexDirection: 'column', background: '#FFFFFF', borderRadius: '24px', overflow: 'hidden' }}>
          
          <div style={{ padding: '24px 24px 0' }}>
            <h2 style={{ color: '#1F1F1F', fontSize: '18px', fontWeight: 500, marginBottom: '20px' }}>Notes & Insights</h2>
            
            {/* Pill Tabs */}
            <div style={{ display: 'flex', gap: '8px', borderBottom: '1px solid #E0E2E0', paddingBottom: '12px' }}>
               <div style={{ background: '#C2E7FF', color: '#001D35', padding: '8px 16px', borderRadius: '100px', fontSize: '13px', fontWeight: 500, cursor: 'pointer' }}>Extracts</div>
               <div style={{ background: 'transparent', color: '#444746', padding: '8px 16px', borderRadius: '100px', fontSize: '13px', fontWeight: 500, cursor: 'pointer' }}>Flashcards</div>
               <div style={{ background: 'transparent', color: '#444746', padding: '8px 16px', borderRadius: '100px', fontSize: '13px', fontWeight: 500, cursor: 'pointer' }}>Study Guide</div>
            </div>
          </div>

          <div style={{ flex: 1, overflowY: 'auto', padding: '24px', display: 'flex', flexDirection: 'column', gap: '24px' }}>
             
             {/* Key Summaries Cards */}
             <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <div style={{ background: '#FFFFFF', border: '1px solid #E0E2E0', borderRadius: '16px', padding: '20px' }}>
                   <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
                      <div style={{ width: '24px', height: '24px', borderRadius: '6px', background: '#F0F4F9', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                         <FileText size={14} color="#EA4335" />
                      </div>
                      <div style={{ fontSize: '12px', color: '#444746', fontWeight: 500 }}>Intro_to_Machine_Learning.pdf</div>
                   </div>
                   <div style={{ fontSize: '14px', color: '#1F1F1F', lineHeight: '1.6' }}>Supervised learning requires labeled data, while unsupervised does not. Reinforcement learning relies on a reward system.</div>
                </div>
                <div style={{ background: '#FFFFFF', border: '1px solid #E0E2E0', borderRadius: '16px', padding: '20px' }}>
                   <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
                      <div style={{ width: '24px', height: '24px', borderRadius: '6px', background: '#F0F4F9', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                         <LinkIcon size={14} color="#444746" />
                      </div>
                      <div style={{ fontSize: '12px', color: '#444746', fontWeight: 500 }}>MIT Tech Review Article</div>
                   </div>
                   <div style={{ fontSize: '14px', color: '#1F1F1F', lineHeight: '1.6' }}>Ethical concerns focus on bias in training data and lack of transparency. The black box issue makes model interpretation difficult.</div>
                </div>
             </div>

             {/* Study Guide Draft */}
             <div style={{ background: '#F0F4F9', borderRadius: '16px', overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
                {/* Editor Toolbar */}
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', padding: '12px 16px', borderBottom: '1px solid #E0E2E0', background: '#FFFFFF' }}>
                   <Bold size={16} color="#444746" cursor="pointer" />
                   <Italic size={16} color="#444746" cursor="pointer" />
                   <Underline size={16} color="#444746" cursor="pointer" />
                   <div style={{ width: '1px', height: '16px', background: '#E0E2E0', margin: '0 4px' }}></div>
                   <List size={16} color="#444746" cursor="pointer" />
                   <ListOrdered size={16} color="#444746" cursor="pointer" />
                </div>
                {/* Editor Content */}
                <div style={{ padding: '20px', flex: 1, minHeight: '200px' }}>
                   <h3 style={{ fontSize: '16px', fontWeight: 500, color: '#1F1F1F', marginBottom: '16px' }}>Midterm Study Guide Draft</h3>
                   <ol style={{ paddingLeft: '20px', margin: 0, fontSize: '14px', color: '#444746', display: 'flex', flexDirection: 'column', gap: '12px', lineHeight: '1.6' }}>
                      <li><strong>Introduction to AI concepts</strong>: Definitions of AI, Machine Learning, and Deep Learning.</li>
                      <li><strong>Supervised vs Unsupervised</strong>: Key differences and common algorithms (Linear Regression, K-Means).</li>
                      <li><strong>Ethics in AI</strong>: Bias, transparency, and data privacy issues.</li>
                   </ol>
                </div>
             </div>

          </div>
        </div>

      </main>

    </div>
  );
};

export default AiStudyWorkspace2;
