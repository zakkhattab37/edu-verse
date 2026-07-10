import { useState, useEffect } from 'react';
import { ArrowLeft, BookOpen, FileText, CheckCircle, Plus, X, Trash2 } from 'lucide-react';
import useInstructorStore from '../../store/instructorStore';

const InstructorCourseManager = ({ courseId, onBack }) => {
  const [activeTab, setActiveTab] = useState('Assignments');
  const { activeCourseDetails, courseDetailsLoading, fetchCourseDetails, createAssignment, createMaterial, createQuiz, updateMaterial, deleteMaterial, updateAssignment, deleteAssignment, updateQuiz, deleteQuiz } = useInstructorStore();

  useEffect(() => {
    fetchCourseDetails(courseId);
  }, [courseId, fetchCourseDetails]);

  if (courseDetailsLoading || !activeCourseDetails) {
    return <div style={{ padding: '40px', textAlign: 'center' }}>Loading course details...</div>;
  }

  const tabs = [
    { name: 'Overview', icon: <BookOpen size={18} /> },
    { name: 'Lessons', icon: <BookOpen size={18} /> },
    { name: 'Assignments', icon: <FileText size={18} /> },
    { name: 'Quizzes', icon: <CheckCircle size={18} /> },
    { name: 'Discussions', icon: <CheckCircle size={18} /> }
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
        <button onClick={onBack} style={{ background: '#fff', border: '1px solid #e5e7eb', borderRadius: '50%', width: '40px', height: '40px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>
          <ArrowLeft size={20} color="#374151" />
        </button>
        <div>
          <h2 style={{ margin: 0, fontSize: '24px', fontWeight: 700, color: '#111827' }}>{activeCourseDetails.title}</h2>
          <p style={{ margin: '4px 0 0', color: '#6b7280', fontSize: '14px' }}>Course Management</p>
        </div>
      </div>

      {/* Tabs */}
      <div style={{ display: 'flex', gap: '12px', borderBottom: '1px solid #e5e7eb', paddingBottom: '16px' }}>
        {tabs.map(tab => (
          <button
            key={tab.name}
            onClick={() => setActiveTab(tab.name)}
            style={{
              display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 20px', borderRadius: '100px', cursor: 'pointer',
              background: activeTab === tab.name ? '#e0e7ff' : 'transparent',
              color: activeTab === tab.name ? '#4f46e5' : '#6b7280',
              border: 'none', fontWeight: 600, fontSize: '14px'
            }}
          >
            {tab.icon} {tab.name}
          </button>
        ))}
      </div>

      {/* Content */}
      <div style={{ background: '#fff', borderRadius: '14px', border: '1px solid #e5e7eb', padding: '24px' }}>
        {activeTab === 'Overview' && (
          <div style={{ padding: '20px', textAlign: 'center', color: '#6b7280' }}>
            <h3 style={{ margin: '0 0 10px', color: '#111827' }}>Course Overview</h3>
            <p>Welcome to the overview. Analytics and general course settings will appear here.</p>
          </div>
        )}
        {activeTab === 'Lessons' && <LessonsManager courseId={courseId} materials={activeCourseDetails.materials || []} onCreate={createMaterial} onUpdate={updateMaterial} onDelete={deleteMaterial} />}
        {activeTab === 'Assignments' && <AssignmentsManager courseId={courseId} assignments={activeCourseDetails.assignments || []} onCreate={createAssignment} onUpdate={updateAssignment} onDelete={deleteAssignment} />}
        {activeTab === 'Quizzes' && <QuizzesManager courseId={courseId} quizzes={activeCourseDetails.quizzes || []} materials={activeCourseDetails.materials || []} onCreate={createQuiz} onUpdate={updateQuiz} onDelete={deleteQuiz} />}
        {activeTab === 'Discussions' && (
          <div style={{ padding: '20px', textAlign: 'center', color: '#6b7280' }}>
            <h3 style={{ margin: '0 0 10px', color: '#111827' }}>Discussions</h3>
            <p>Course discussion boards will be implemented here soon.</p>
          </div>
        )}
      </div>
    </div>
  );
};

// --- Sub-components ---

const AssignmentsManager = ({ courseId, assignments, onCreate, onUpdate, onDelete }) => {
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState({ title: '', description: '', dueDate: '', totalPoints: 100 });
  const [file, setFile] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  const handleEdit = (a) => {
    setEditingId(a.id);
    setForm({
      title: a.title,
      description: a.description || '',
      dueDate: a.dueDate ? new Date(a.dueDate).toISOString().slice(0, 16) : '',
      totalPoints: a.totalPoints || 100
    });
    setFile(null);
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if(window.confirm('Are you sure you want to delete this assignment?')) {
      await onDelete(courseId, id);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    if (editingId) {
      await onUpdate(courseId, editingId, { ...form, file });
    } else {
      await onCreate(courseId, { ...form, file });
    }
    setForm({ title: '', description: '', dueDate: '', totalPoints: 100 });
    setFile(null);
    setEditingId(null);
    setShowForm(false);
    setSubmitting(false);
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '24px' }}>
        <h3 style={{ margin: 0, fontSize: '18px' }}>Assignments</h3>
        <button onClick={() => { setEditingId(null); setForm({ title: '', description: '', dueDate: '', totalPoints: 100 }); setShowForm(!showForm); }} style={{ display: 'flex', alignItems: 'center', gap: '6px', background: '#6366f1', color: '#fff', border: 'none', padding: '8px 16px', borderRadius: '8px', cursor: 'pointer', fontWeight: 600 }}>
          {showForm && !editingId ? <><X size={16} /> Cancel</> : <><Plus size={16} /> New Assignment</>}
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} style={{ background: '#f9fafb', padding: '20px', borderRadius: '12px', marginBottom: '24px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <h4 style={{ margin: 0 }}>{editingId ? 'Edit Assignment' : 'Create Assignment'}</h4>
          <input required value={form.title} onChange={e => setForm({...form, title: e.target.value})} placeholder="Assignment Title" style={{ padding: '10px', borderRadius: '8px', border: '1px solid #d1d5db' }} />
          <textarea required value={form.description} onChange={e => setForm({...form, description: e.target.value})} placeholder="Description" rows={3} style={{ padding: '10px', borderRadius: '8px', border: '1px solid #d1d5db' }} />
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
            <input type="datetime-local" value={form.dueDate} onChange={e => setForm({...form, dueDate: e.target.value})} style={{ padding: '10px', borderRadius: '8px', border: '1px solid #d1d5db' }} />
            <input type="number" required value={form.totalPoints} onChange={e => setForm({...form, totalPoints: parseInt(e.target.value)})} placeholder="Total Points" style={{ padding: '10px', borderRadius: '8px', border: '1px solid #d1d5db' }} />
          </div>
          <div style={{ padding: '10px', borderRadius: '8px', border: '1px dashed #d1d5db', background: '#fff', display: 'flex', alignItems: 'center' }}>
            <span style={{ fontSize: '14px', color: '#6b7280', marginRight: '10px' }}>Attach File (Optional, replaces existing):</span>
            <input type="file" onChange={e => setFile(e.target.files[0])} />
          </div>
          <div style={{ display: 'flex', gap: '12px' }}>
            <button type="submit" disabled={submitting} style={{ background: '#4f46e5', color: '#fff', padding: '10px', borderRadius: '8px', border: 'none', fontWeight: 600, cursor: 'pointer', flex: 1 }}>{submitting ? 'Saving...' : (editingId ? 'Update Assignment' : 'Create Assignment')}</button>
            <button type="button" onClick={() => { setShowForm(false); setEditingId(null); }} style={{ background: '#e5e7eb', color: '#374151', padding: '10px', borderRadius: '8px', border: 'none', fontWeight: 600, cursor: 'pointer' }}>Cancel</button>
          </div>
        </form>
      )}

      {assignments.length === 0 ? <p style={{ color: '#6b7280' }}>No assignments created yet.</p> : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {assignments.map(a => (
            <div key={a.id} style={{ border: '1px solid #e5e7eb', padding: '16px', borderRadius: '10px', display: 'flex', justifyContent: 'space-between' }}>
              <div>
                <div style={{ fontWeight: 600, fontSize: '16px' }}>{a.title}</div>
                <div style={{ fontSize: '14px', color: '#6b7280', marginTop: '4px' }}>{a.description}</div>
                <div style={{ display: 'flex', gap: '16px', marginTop: '12px', fontSize: '12px', color: '#4b5563', fontWeight: 500, alignItems: 'center' }}>
                  <span style={{ background: '#f3f4f6', padding: '4px 8px', borderRadius: '6px' }}>{a.totalPoints} Points</span>
                  {a.dueDate && <span style={{ background: '#fef3c7', color: '#92400e', padding: '4px 8px', borderRadius: '6px' }}>Due: {new Date(a.dueDate).toLocaleString()}</span>}
                  {a.fileUrl && (
                    <a href={`http://localhost:5000${a.fileUrl}`} target="_blank" rel="noopener noreferrer" style={{ color: '#4f46e5', textDecoration: 'none', background: '#e0e7ff', padding: '4px 8px', borderRadius: '6px' }}>View Attached File</a>
                  )}
                </div>
              </div>
              <div style={{ display: 'flex', gap: '8px', alignItems: 'flex-start' }}>
                 <button onClick={() => handleEdit(a)} style={{ background: 'transparent', border: 'none', cursor: 'pointer', color: '#6366f1', padding: '4px' }}>Edit</button>
                 <button onClick={() => handleDelete(a.id)} style={{ background: 'transparent', border: 'none', cursor: 'pointer', color: '#ef4444', padding: '4px' }}><Trash2 size={18} /></button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

const LessonsManager = ({ courseId, materials, onCreate, onUpdate, onDelete }) => {
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState({ title: '', description: '', type: 'PDF', fileUrl: '' });
  const [file, setFile] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  const handleEdit = (m) => {
    setEditingId(m.id);
    setForm({
      title: m.title,
      description: m.description || '',
      type: m.type || 'PDF',
      fileUrl: m.fileUrl || ''
    });
    setFile(null);
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if(window.confirm('Are you sure you want to delete this lesson?')) {
      await onDelete(courseId, id);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file && form.type !== 'Link' && !editingId) {
      alert("Please upload a file or select 'Link' as the type.");
      return;
    }

    setSubmitting(true);
    if (editingId) {
      await onUpdate(courseId, editingId, { ...form, file });
    } else {
      await onCreate(courseId, { ...form, file });
    }
    setForm({ title: '', description: '', type: 'PDF', fileUrl: '' });
    setFile(null);
    setEditingId(null);
    setShowForm(false);
    setSubmitting(false);
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '24px' }}>
        <h3 style={{ margin: 0, fontSize: '18px' }}>Course Lessons</h3>
        <button onClick={() => { setEditingId(null); setForm({ title: '', description: '', type: 'PDF', fileUrl: '' }); setShowForm(!showForm); }} style={{ display: 'flex', alignItems: 'center', gap: '6px', background: '#6366f1', color: '#fff', border: 'none', padding: '8px 16px', borderRadius: '8px', cursor: 'pointer', fontWeight: 600 }}>
          {showForm && !editingId ? <><X size={16} /> Cancel</> : <><Plus size={16} /> Add Lesson Material</>}
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} style={{ background: '#f9fafb', padding: '20px', borderRadius: '12px', marginBottom: '24px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <h4 style={{ margin: 0 }}>{editingId ? 'Edit Lesson' : 'Add Lesson'}</h4>
          <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '16px' }}>
            <input required value={form.title} onChange={e => setForm({...form, title: e.target.value})} placeholder="Lesson Title" style={{ padding: '10px', borderRadius: '8px', border: '1px solid #d1d5db' }} />
            <select value={form.type} onChange={e => setForm({...form, type: e.target.value})} style={{ padding: '10px', borderRadius: '8px', border: '1px solid #d1d5db' }}>
              <option value="PDF">PDF</option>
              <option value="Video">Video</option>
              <option value="Link">Link</option>
            </select>
          </div>

          {form.type === 'Link' ? (
             <input required type="url" value={form.fileUrl || ''} onChange={e => setForm({...form, fileUrl: e.target.value})} placeholder="Lesson URL (e.g. YouTube)" style={{ padding: '10px', borderRadius: '8px', border: '1px solid #d1d5db' }} />
          ) : (
             <div style={{ padding: '10px', borderRadius: '8px', border: '1px dashed #d1d5db', background: '#fff', display: 'flex', alignItems: 'center' }}>
                <span style={{ fontSize: '14px', color: '#6b7280', marginRight: '10px' }}>{editingId ? 'Replace File (Optional):' : 'Upload File:'}</span>
                <input type="file" onChange={e => setFile(e.target.files[0])} accept={form.type === 'PDF' ? "application/pdf" : "video/*"} required={!editingId && form.type !== 'Link'} />
             </div>
          )}
          
          <textarea value={form.description} onChange={e => setForm({...form, description: e.target.value})} placeholder="Description (Optional)" rows={2} style={{ padding: '10px', borderRadius: '8px', border: '1px solid #d1d5db' }} />
          <div style={{ display: 'flex', gap: '12px' }}>
             <button type="submit" disabled={submitting} style={{ background: '#4f46e5', color: '#fff', padding: '10px', borderRadius: '8px', border: 'none', fontWeight: 600, cursor: 'pointer', flex: 1 }}>{submitting ? 'Saving...' : (editingId ? 'Update Lesson' : 'Add Lesson')}</button>
             <button type="button" onClick={() => { setShowForm(false); setEditingId(null); }} style={{ background: '#e5e7eb', color: '#374151', padding: '10px', borderRadius: '8px', border: 'none', fontWeight: 600, cursor: 'pointer' }}>Cancel</button>
          </div>
        </form>
      )}

      {materials.length === 0 ? <p style={{ color: '#6b7280' }}>No lessons added yet.</p> : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {materials.map(m => (
            <div key={m.id} style={{ border: '1px solid #e5e7eb', padding: '16px', borderRadius: '10px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <div style={{ fontWeight: 600, fontSize: '16px' }}>{m.title} <span style={{ fontSize: '12px', background: '#e0e7ff', color: '#4f46e5', padding: '2px 8px', borderRadius: '12px', marginLeft: '8px' }}>{m.type}</span></div>
                {m.description && <div style={{ fontSize: '14px', color: '#6b7280', marginTop: '4px' }}>{m.description}</div>}
              </div>
              <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                <a href={m.fileUrl?.startsWith('/') ? `http://localhost:5000${m.fileUrl}` : m.fileUrl} target="_blank" rel="noopener noreferrer" style={{ color: '#4f46e5', fontSize: '14px', fontWeight: 600, textDecoration: 'none' }}>View Material</a>
                <button onClick={() => handleEdit(m)} style={{ background: 'transparent', border: 'none', cursor: 'pointer', color: '#6366f1', padding: '4px' }}>Edit</button>
                <button onClick={() => handleDelete(m.id)} style={{ background: 'transparent', border: 'none', cursor: 'pointer', color: '#ef4444', padding: '4px' }}><Trash2 size={18} /></button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

const QuizzesManager = ({ courseId, quizzes, materials, onCreate, onUpdate, onDelete }) => {
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState({ title: '', description: '', timeLimitMinutes: 30 });
  const [questions, setQuestions] = useState([]);
  const [submitting, setSubmitting] = useState(false);
  const [generatingAI, setGeneratingAI] = useState(false);
  const [showMaterialSelect, setShowMaterialSelect] = useState(false);
  const [selectedMaterials, setSelectedMaterials] = useState([]);
  const { generateQuizByAI } = useInstructorStore();

  const handleEdit = (q) => {
    setEditingId(q.id);
    setForm({
      title: q.title,
      description: q.description || '',
      timeLimitMinutes: q.timeLimitMinutes || 30
    });
    setQuestions([]); // Questions are not editable here currently
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if(window.confirm('Are you sure you want to delete this quiz?')) {
      await onDelete(courseId, id);
    }
  };

  const handleGenerateAI = async () => {
    if (selectedMaterials.length === 0) {
      alert("Please select at least one material to generate the quiz.");
      return;
    }
    setGeneratingAI(true);
    setShowMaterialSelect(false);
    try {
      const generatedQuiz = await generateQuizByAI(courseId, selectedMaterials);
      setForm({
        title: generatedQuiz.title || 'AI Generated Quiz',
        description: generatedQuiz.description || '',
        timeLimitMinutes: 30
      });
      if (generatedQuiz.questions && Array.isArray(generatedQuiz.questions)) {
        setQuestions(generatedQuiz.questions);
      }
      setShowForm(true);
    } catch (err) {
      alert(err.message || 'Failed to generate quiz');
    } finally {
      setGeneratingAI(false);
    }
  };

  const toggleMaterial = (id) => {
    setSelectedMaterials(prev => 
      prev.includes(id) ? prev.filter(mId => mId !== id) : [...prev, id]
    );
  };

  const addQuestion = () => {
    setQuestions([...questions, { questionText: '', options: ['', '', '', ''], correctAnswer: '' }]);
  };

  const updateQuestion = (index, field, value) => {
    const updated = [...questions];
    updated[index][field] = value;
    setQuestions(updated);
  };

  const updateOption = (qIndex, optIndex, value) => {
    const updated = [...questions];
    updated[qIndex].options[optIndex] = value;
    setQuestions(updated);
  };

  const removeQuestion = (index) => {
    setQuestions(questions.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!editingId && questions.some(q => !q.questionText || !q.correctAnswer || q.options.some(o => !o))) {
      alert('Please fill out all questions, options, and select correct answers.');
      return;
    }
    setSubmitting(true);
    if (editingId) {
      await onUpdate(courseId, editingId, form);
    } else {
      await onCreate(courseId, { ...form, questions });
    }
    setForm({ title: '', description: '', timeLimitMinutes: 30 });
    setQuestions([]);
    setEditingId(null);
    setShowForm(false);
    setSubmitting(false);
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '24px' }}>
        <h3 style={{ margin: 0, fontSize: '18px' }}>Quizzes</h3>
        <div style={{ display: 'flex', gap: '12px' }}>
          <button onClick={() => setShowMaterialSelect(true)} disabled={generatingAI} style={{ display: 'flex', alignItems: 'center', gap: '6px', background: '#10b981', color: '#fff', border: 'none', padding: '8px 16px', borderRadius: '8px', cursor: 'pointer', fontWeight: 600 }}>
            {generatingAI ? 'Generating...' : '✨ Generate with AI'}
          </button>
          <button onClick={() => { setEditingId(null); setForm({ title: '', description: '', timeLimitMinutes: 30 }); setQuestions([]); setShowForm(!showForm); }} style={{ display: 'flex', alignItems: 'center', gap: '6px', background: '#6366f1', color: '#fff', border: 'none', padding: '8px 16px', borderRadius: '8px', cursor: 'pointer', fontWeight: 600 }}>
            {showForm && !editingId ? <><X size={16} /> Cancel</> : <><Plus size={16} /> Create Quiz</>}
          </button>
        </div>
      </div>

      {showMaterialSelect && (
        <div style={{ background: '#f9fafb', padding: '20px', borderRadius: '12px', marginBottom: '24px', border: '1px solid #e5e7eb' }}>
          <h4 style={{ margin: '0 0 12px 0' }}>Select Materials for AI Quiz Generation</h4>
          {materials && materials.length > 0 ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '16px' }}>
              {materials.map(m => (
                <label key={m.id} style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
                  <input type="checkbox" checked={selectedMaterials.includes(m.id)} onChange={() => toggleMaterial(m.id)} />
                  <span style={{ fontWeight: 500 }}>{m.title}</span> <span style={{ color: '#6b7280', fontSize: '13px' }}>({m.type})</span>
                </label>
              ))}
            </div>
          ) : (
            <p style={{ color: '#6b7280', fontSize: '14px', marginBottom: '16px' }}>No materials found. Upload materials first in the Lessons tab.</p>
          )}
          <div style={{ display: 'flex', gap: '12px' }}>
            <button onClick={handleGenerateAI} disabled={generatingAI || selectedMaterials.length === 0} style={{ background: '#10b981', color: '#fff', padding: '8px 16px', borderRadius: '6px', border: 'none', fontWeight: 600, cursor: selectedMaterials.length === 0 ? 'not-allowed' : 'pointer' }}>
              {generatingAI ? 'Generating...' : 'Confirm & Generate'}
            </button>
            <button onClick={() => setShowMaterialSelect(false)} style={{ background: '#e5e7eb', color: '#374151', padding: '8px 16px', borderRadius: '6px', border: 'none', fontWeight: 600, cursor: 'pointer' }}>Cancel</button>
          </div>
        </div>
      )}

      {showForm && (
        <form onSubmit={handleSubmit} style={{ background: '#f9fafb', padding: '20px', borderRadius: '12px', marginBottom: '24px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <div style={{ background: '#fff', padding: '16px', borderRadius: '8px', border: '1px solid #e5e7eb', display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <h4 style={{ margin: 0 }}>{editingId ? 'Edit Quiz Details' : 'Quiz Details'}</h4>
            <input required value={form.title} onChange={e => setForm({...form, title: e.target.value})} placeholder="Quiz Title" style={{ padding: '10px', borderRadius: '8px', border: '1px solid #d1d5db' }} />
            <textarea required value={form.description} onChange={e => setForm({...form, description: e.target.value})} placeholder="Description" rows={2} style={{ padding: '10px', borderRadius: '8px', border: '1px solid #d1d5db' }} />
            <div>
               <label style={{ fontSize: '13px', color: '#4b5563', marginRight: '10px' }}>Time Limit (Minutes)</label>
               <input type="number" required value={form.timeLimitMinutes} onChange={e => setForm({...form, timeLimitMinutes: parseInt(e.target.value)})} style={{ padding: '10px', borderRadius: '8px', border: '1px solid #d1d5db', width: '100px' }} />
            </div>
          </div>

          {!editingId && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <h4 style={{ margin: 0 }}>Questions ({questions.length})</h4>
                <button type="button" onClick={addQuestion} style={{ background: '#e0e7ff', color: '#4f46e5', border: 'none', padding: '6px 12px', borderRadius: '6px', cursor: 'pointer', fontWeight: 600, fontSize: '13px' }}>+ Add Question</button>
              </div>
              
              {questions.map((q, qIndex) => (
                <div key={qIndex} style={{ background: '#fff', padding: '16px', borderRadius: '8px', border: '1px solid #e5e7eb', position: 'relative' }}>
                  <button type="button" onClick={() => removeQuestion(qIndex)} style={{ position: 'absolute', top: '16px', right: '16px', background: 'transparent', border: 'none', color: '#ef4444', cursor: 'pointer' }}><Trash2 size={18} /></button>
                  <div style={{ fontWeight: 600, marginBottom: '12px' }}>Question {qIndex + 1}</div>
                  <input required value={q.questionText} onChange={e => updateQuestion(qIndex, 'questionText', e.target.value)} placeholder="Type question here..." style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #d1d5db', marginBottom: '16px', boxSizing: 'border-box' }} />
                  
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '16px' }}>
                    {q.options.map((opt, oIndex) => (
                      <input key={oIndex} required value={opt} onChange={e => updateOption(qIndex, oIndex, e.target.value)} placeholder={`Option ${oIndex + 1}`} style={{ padding: '10px', borderRadius: '8px', border: '1px solid #d1d5db', boxSizing: 'border-box' }} />
                    ))}
                  </div>
                  
                  <div>
                    <label style={{ fontSize: '13px', color: '#4b5563', marginRight: '10px' }}>Correct Answer:</label>
                    <select required value={q.correctAnswer} onChange={e => updateQuestion(qIndex, 'correctAnswer', e.target.value)} style={{ padding: '10px', borderRadius: '8px', border: '1px solid #d1d5db' }}>
                      <option value="">Select correct option...</option>
                      {q.options.filter(o => o.trim() !== '').map((opt, i) => <option key={i} value={opt}>{opt}</option>)}
                    </select>
                  </div>
                </div>
              ))}
            </div>
          )}

          <div style={{ display: 'flex', gap: '12px' }}>
             <button type="submit" disabled={submitting || (!editingId && questions.length === 0)} style={{ background: '#4f46e5', color: '#fff', padding: '12px', borderRadius: '8px', border: 'none', fontWeight: 600, cursor: 'pointer', flex: 1, opacity: (submitting || (!editingId && questions.length === 0)) ? 0.7 : 1 }}>
               {submitting ? 'Saving...' : (editingId ? 'Update Quiz Details' : 'Save & Publish Quiz')}
             </button>
             <button type="button" onClick={() => { setShowForm(false); setEditingId(null); }} style={{ background: '#e5e7eb', color: '#374151', padding: '12px', borderRadius: '8px', border: 'none', fontWeight: 600, cursor: 'pointer' }}>Cancel</button>
          </div>
        </form>
      )}

      {quizzes.length === 0 ? <p style={{ color: '#6b7280' }}>No quizzes created yet.</p> : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {quizzes.map(q => (
            <div key={q.id} style={{ border: '1px solid #e5e7eb', padding: '16px', borderRadius: '10px', display: 'flex', justifyContent: 'space-between' }}>
              <div>
                <div style={{ fontWeight: 600, fontSize: '16px' }}>{q.title}</div>
                <div style={{ fontSize: '14px', color: '#6b7280', marginTop: '4px' }}>{q.description}</div>
                <div style={{ display: 'flex', gap: '16px', marginTop: '12px', fontSize: '12px', color: '#4b5563', fontWeight: 500 }}>
                  <span style={{ background: '#f3f4f6', padding: '4px 8px', borderRadius: '6px' }}>{q.timeLimitMinutes} Mins</span>
                  <span style={{ background: '#f3f4f6', padding: '4px 8px', borderRadius: '6px' }}>{q.Questions?.length || 0} Questions</span>
                </div>
              </div>
              <div style={{ display: 'flex', gap: '8px', alignItems: 'flex-start' }}>
                 <button onClick={() => handleEdit(q)} style={{ background: 'transparent', border: 'none', cursor: 'pointer', color: '#6366f1', padding: '4px' }}>Edit</button>
                 <button onClick={() => handleDelete(q.id)} style={{ background: 'transparent', border: 'none', cursor: 'pointer', color: '#ef4444', padding: '4px' }}><Trash2 size={18} /></button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default InstructorCourseManager;
