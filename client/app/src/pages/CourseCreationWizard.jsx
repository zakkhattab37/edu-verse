import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Check, Upload, BookOpen, FileCheck, ArrowRight, Bold, Italic, Underline, Strikethrough, Code, Link as LinkIcon, List, ListOrdered, AlignLeft, Undo, Redo, BrainCircuit, Loader } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import useCourseStore from '../store/courseStore';
import './CourseCreationWizard.css';

const CourseCreationWizard = () => {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({ title: '', subtitle: '', category: '', description: '' });
  const navigate = useNavigate();
  const { createCourse, isLoading, error } = useCourseStore();

  const steps = [
    { id: 1, label: 'Course Info', icon: <Check size={16} /> },
    { id: 2, label: 'Upload Content', icon: <Upload size={16} /> },
    { id: 3, label: 'Lessons', icon: <BookOpen size={16} /> },
    { id: 4, label: 'Quizzes', icon: <FileCheck size={16} /> },
    { id: 5, label: 'Publish', icon: <ArrowRight size={16} /> },
  ];

  const handleNextOrPublish = async () => {
    if (step < 5) {
      setStep(step + 1);
    } else {
      try {
        await createCourse(formData);
        alert('Course successfully published!');
        navigate('/instructor');
      } catch (err) {
        console.error('Failed to publish course', err);
      }
    }
  };

  return (
    <div className="wizard-container">
      
      {/* Top Horizontal Stepper */}
      <div className="top-stepper">
        <div className={`stepper-line ${step > 1 ? 'active' : ''}`}></div>
        <div className="stepper-line-active" style={{ width: `${((step - 1) / (steps.length - 1)) * 100}%`, maxWidth: 'calc(100% - 240px)' }}></div>
        
        {steps.map((s, index) => (
          <div key={s.id} className="top-step-item">
            <div className={`top-step-circle ${step >= s.id ? 'active' : 'inactive'}`}>
              {step > s.id ? <Check size={16} /> : s.id}
            </div>
            <span className={`top-step-label ${step >= s.id ? 'active' : 'inactive'}`}>{s.label}</span>
          </div>
        ))}
      </div>

      <div className="wizard-content-layout">
        
        {/* Vertical Sidebar Stepper */}
        <div className="side-stepper">
          {steps.map((s, index) => (
            <div key={s.id} className="side-step-item">
               {index < steps.length - 1 && (
                  <div className={`side-step-line ${step > s.id ? 'active' : ''}`}></div>
               )}
               <div className={`side-step-icon ${step >= s.id ? 'active' : 'inactive'}`}>
                  {step > s.id ? <Check size={16} /> : s.icon}
               </div>
               <span className={`side-step-label ${step >= s.id ? 'active' : 'inactive'}`}>{s.label}</span>
            </div>
          ))}
        </div>

        {/* Main Content Area */}
        <div className="wizard-main-card">
          <AnimatePresence mode="wait">
          {step === 1 && (
            <motion.div 
              key="step1"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
            >
              <h2 className="section-heading">Course Information</h2>
              <p className="section-subheading">Start building your course foundation.</p>
              {error && <div style={{ color: 'var(--danger)', marginBottom: '16px' }}>{error}</div>}

              <div className="form-grid">
                
                {/* Left Column (Inputs & Editor) */}
                <div className="form-column">
                  <div className="form-group">
                    <label className="form-label">Course Title</label>
                    <input 
                      className="form-input" 
                      placeholder="e.g., Introduction to Artificial Intelligence"
                      value={formData.title}
                      onChange={e => setFormData({...formData, title: e.target.value})}
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">Course Subtitle</label>
                    <input 
                      className="form-input" 
                      placeholder="e.g., A comprehensive guide for beginners"
                      value={formData.subtitle}
                      onChange={e => setFormData({...formData, subtitle: e.target.value})}
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">Course Category</label>
                    <select 
                      className="form-select"
                      value={formData.category}
                      onChange={e => setFormData({...formData, category: e.target.value})}
                    >
                      <option value="">Select Category</option>
                      <option value="Computer Science">Computer Science</option>
                      <option value="Business">Business</option>
                      <option value="Design">Design</option>
                    </select>
                  </div>

                  <div className="form-group">
                    <label className="form-label">Course Description</label>
                    <div className="editor-wrapper">
                      <div className="editor-toolbar-top">
                        <Bold size={16} />
                        <Italic size={16} />
                        <Underline size={16} />
                        <Strikethrough size={16} />
                        <div className="toolbar-separator"></div>
                        <Code size={16} />
                        <LinkIcon size={16} />
                        <div className="toolbar-separator"></div>
                        <List size={16} />
                        <ListOrdered size={16} />
                        <AlignLeft size={16} />
                        <div className="toolbar-separator"></div>
                        <Undo size={16} />
                        <Redo size={16} />
                      </div>
                      <textarea 
                        className="editor-textarea-large"
                        value={formData.description}
                        onChange={e => setFormData({...formData, description: e.target.value})}
                      ></textarea>
                    </div>
                  </div>
                </div>

                {/* Right Column (Thumbnail Upload) */}
                <div className="form-column">
                  <div className="thumbnail-header">
                    <span className="form-label">Course Thumbnail</span>
                    <span className="ai-badge">AI</span>
                  </div>
                  <div className="upload-box">
                    <BrainCircuit size={48} className="upload-icon" />
                    <div className="upload-text">Drag & drop or click to upload.</div>
                    <div className="upload-subtext">AI suggestions available.</div>
                  </div>
                </div>

              </div>
            </motion.div>
          )}

          {step > 1 && (
            <motion.div 
              key={`step${step}`}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
              style={{ textAlign: 'center', padding: '64px 0' }}
            >
              <h2 className="section-heading">Step {step}: {steps[step-1].label}</h2>
              <p className="section-subheading">Content for this step will go here.</p>
              {step === 5 && (
                <div style={{ marginTop: '24px' }}>
                  <p>You are about to publish the course: <strong>{formData.title || 'Untitled Course'}</strong></p>
                  {error && <p style={{ color: 'var(--danger)', marginTop: '8px' }}>{error}</p>}
                </div>
              )}
            </motion.div>
          )}
          </AnimatePresence>

          <div className="wizard-footer">
            <button className="btn-draft" disabled={isLoading}>Save Draft</button>
            <button className="btn-next" onClick={handleNextOrPublish} disabled={isLoading}>
              {isLoading ? <Loader size={16} className="animate-spin" /> : (step < 5 ? 'Next Step' : 'Publish Course')}
            </button>
          </div>
          
        </div>

      </div>
    </div>
  );
};

export default CourseCreationWizard;
