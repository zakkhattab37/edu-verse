import { Home, BookOpen, FileText, Users, MessageSquare, LogOut, Play, Heart, Download, Bold, Italic, Underline, Strikethrough, List, AlignLeft, Type, Send, ChevronUp, CheckCircle, Circle, MoreHorizontal } from 'lucide-react';
import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import useCourseStore from '../store/courseStore';
import useAuthStore from '../store/authStore';
import './CourseWorkspace.css';

const CourseWorkspace = () => {
  const [activeTab, setActiveTab] = useState('Overview');
  const [noteContent, setNoteContent] = useState('');
  const { id } = useParams();
  const navigate = useNavigate();
  const { currentCourse, fetchCourseById, isLoading } = useCourseStore();
  const { user } = useAuthStore();

  useEffect(() => {
    if (id) {
      fetchCourseById(id);
    }
  }, [id, fetchCourseById]);

  return (
    <div className="course-workspace-container">
      
      {/* Narrow Left Sidebar */}
      <aside className="course-sidebar">
         <div className="sidebar-logo">SU</div>
         <nav className="sidebar-nav">
            <Home size={24} className="sidebar-icon" style={{ cursor: 'pointer' }} onClick={() => navigate('/dashboard')} />
            <div className="sidebar-icon active">
               <FileText size={24} />
            </div>
            <Users size={24} className="sidebar-icon" />
            <MessageSquare size={24} className="sidebar-icon" />
         </nav>
         <LogOut size={24} className="sidebar-icon" />
      </aside>

      <div className="main-layout">
         
         {/* Top Navbar */}
         <header className="top-navbar">
            <div className="navbar-left">
               <div className="university-name">Stellar University<br/><span className="hub-name">AI Hub</span></div>
               <div className="navbar-divider"></div>
               <div className="course-title">
                  {isLoading ? 'Loading...' : currentCourse?.title || 'Advanced AI & Ethics'}
               </div>
            </div>
            <div className="navbar-right">
               <img src={user?.avatar || `https://i.pravatar.cc/150?u=${user?.id || 5}`} alt={user?.name || "Profile"} className="profile-pic" style={{ objectFit: 'cover' }} />
            </div>
         </header>

         {/* Main Content Layout */}
         <main className="main-content">
            
            {/* Left Area (Video & Info) */}
            <div className="left-panel">
               <h1 className="page-title">Course Workspace</h1>
               
               {/* Video Section Split */}
               <div className="video-section">
                  <div className="video-player">
                     <img src="https://images.unsplash.com/photo-1516321318423-f06f85e504b3?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80" alt="Video Placeholder" className="video-thumbnail" />
                     {/* Fake Video Controls */}
                     <div className="video-controls">
                        <Play size={20} />
                        <span className="time-stamp">0:28 / 9:18</span>
                        <div className="progress-bar-bg">
                           <div className="progress-bar-fill"></div>
                        </div>
                     </div>
                  </div>
                  
                  <div className="video-info">
                     <h2 className="lecture-title">Lecture 3: AI in Research Methods</h2>
                     <div className="meta-item">
                        <div className="su-badge">SU</div>
                        Stellar University AI Hub
                     </div>
                     <div className="meta-item">
                        <Play size={16} /> 20 minutes
                     </div>
                     <div className="meta-item">
                        <Users size={16} /> Remam Hiviaott
                     </div>
                     
                     <div className="action-buttons">
                        <button className="play-btn">
                           <Play size={20} fill="white" /> Play Lecture
                        </button>
                        <button className="play-btn" style={{background: '#10B981', marginLeft: '10px'}} onClick={() => navigate('/quiz')}>
                           <CheckCircle size={20} fill="white" color="#10B981" /> Take Quiz
                        </button>
                        <button className="like-btn" style={{marginLeft: '10px'}}>
                           <Heart size={20} color="#4B5563" />
                        </button>
                     </div>
                  </div>
               </div>

               {/* Tabs */}
               <div className="tabs-container">
                  {['Overview', 'Lessons', 'Assignments', 'Discussion'].map(tab => (
                     <div 
                       key={tab}
                       onClick={() => setActiveTab(tab)}
                       className={`tab-item ${activeTab === tab ? 'active' : ''}`}
                     >
                        {tab === 'Overview' && <Home size={18} />}
                        {tab === 'Lessons' && <BookOpen size={18} />}
                        {tab === 'Assignments' && <FileText size={18} />}
                        {tab === 'Discussion' && <MessageSquare size={18} />}
                        {tab}
                     </div>
                  ))}
               </div>

               {/* Bottom Split (Description & Navigation) */}
               <div className="content-split">
                  <div className="description-section">
                     <h3 className="section-title">Description</h3>
                     <p className="description-text">
                       This lecture 3: AI in Research Methods. Comprehend this is proactive exploring that create all constructions and ensure analysis of risk a rewarding, texts and computer data analysis techniques., at question, data-verifiable methods, and research navigations.
                     </p>
                     <p className="description-text" style={{marginBottom: '16px'}}>Lecture know:</p>
                     <ul className="description-list">
                        <li>Introduction - system of practice on AI in research methods.</li>
                        <li>Data Analysis Techniques - resort data analysis or avenues.</li>
                        <li>Data Analysis Techniques - minimizement of chat-methods.</li>
                        <li>Complete the result of techniques - AI in research: the respiration or with experience and event delays in participation.</li>
                     </ul>
                  </div>

                  <div className="navigation-section">
                     <h3 className="nav-subtitle">Content Navigation</h3>
                     <div className="nav-items-list">
                        {[
                           { name: 'Introduction', progress: 100 },
                           { name: 'Data Analysis Techniques', progress: 100 },
                           { name: 'Data Analysis Techniques', progress: 60 },
                           { name: 'Q&A Session', progress: 100 },
                           { name: 'Personal content', progress: 50 }
                        ].map((item, i) => (
                           <div key={i} className="nav-item">
                              {item.progress === 100 ? (
                                <CheckCircle size={20} color="#2563EB" fill="#2563EB" style={{ color: 'white' }} />
                              ) : (
                                <Circle size={20} color="#D1D5DB" />
                              )}
                              <span className="nav-item-name">{item.name}</span>
                              <div className="nav-item-progress-container">
                                 <div className="nav-progress-bg">
                                    <div className="nav-progress-fill" style={{ width: `${item.progress}%` }}></div>
                                 </div>
                                 <span className="nav-progress-text">{item.progress}%</span>
                              </div>
                           </div>
                        ))}
                     </div>
                  </div>
               </div>

            </div>

            {/* Right Sidebar (Notes & Resources) */}
            <div className="right-sidebar">
               <div className="right-header">
                  <h2 className="right-title">My Notes & Resources</h2>
                  <MoreHorizontal size={20} color="#9CA3AF" cursor="pointer" />
               </div>

               <h3 className="sub-title">Personal Notes</h3>
               
               {/* Rich Text Editor */}
               <div className="editor-container">
                  <div className="editor-toolbar">
                     <Bold size={16} cursor="pointer" />
                     <Italic size={16} cursor="pointer" />
                     <Underline size={16} cursor="pointer" />
                     <Strikethrough size={16} cursor="pointer" />
                     <div className="toolbar-divider"></div>
                     <Type size={16} cursor="pointer" />
                     <AlignLeft size={16} cursor="pointer" />
                     <List size={16} cursor="pointer" />
                  </div>
                  <textarea 
                     placeholder="Your personal notes here..."
                     value={noteContent}
                     onChange={(e) => setNoteContent(e.target.value)}
                     className="editor-textarea"
                  ></textarea>
               </div>
               
               <div className="save-btn-container">
                  <button className="save-btn">Save</button>
               </div>

               <h3 className="sub-title">Resources</h3>
               <div className="resources-list">
                  {[
                     { name: 'Lecture Slides.pdf', icon: <FileText size={18} /> },
                     { name: 'Reading Material.docx', icon: <FileText size={18} /> },
                     { name: 'Reading Material.docx', icon: <FileText size={18} /> },
                     { name: 'Lecture Slides.pdf', icon: <FileText size={18} /> }
                  ].map((res, i) => (
                     <div key={i} className="resource-item">
                        <div className="resource-info">
                           {res.icon}
                           <span>{res.name}</span>
                        </div>
                        <Download size={18} color="#9CA3AF" cursor="pointer" />
                     </div>
                  ))}
               </div>

               {/* AI Tutor Floating Chat Widget */}
               <div className="ai-tutor-widget">
                  <div className="tutor-header" onClick={() => navigate('/ai-assistant')} style={{cursor: 'pointer'}}>
                     <div className="tutor-title">
                        <MessageSquare size={16} /> AI Tutor
                     </div>
                     <div className="tutor-controls">
                        <ChevronUp size={16} cursor="pointer" />
                     </div>
                  </div>
                  <div className="tutor-body">
                     <div className="tutor-message">
                        <img src="https://i.pravatar.cc/150?u=6" alt="AI" className="tutor-avatar" />
                        <div className="tutor-bubble">
                           Hi, Will you attend class today?
                        </div>
                     </div>
                     <div className="tutor-input-wrapper">
                        <input type="text" placeholder="Type a message..." className="tutor-input" />
                        <Send size={16} className="tutor-send" />
                     </div>
                  </div>
               </div>

            </div>

         </main>
      </div>
    </div>
  );
};

export default CourseWorkspace;
