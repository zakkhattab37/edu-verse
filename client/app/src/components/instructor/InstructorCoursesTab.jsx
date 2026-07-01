import { useState } from 'react';
import { Plus, BookOpen, Users, Eye } from 'lucide-react';
import useInstructorStore from '../../store/instructorStore';

const CATEGORIES = ['Computer Science', 'Data Science', 'Mathematics', 'Design', 'Business', 'Languages', 'Engineering', 'Arts'];

const InstructorCoursesTab = ({ data }) => {
  const [showCreate, setShowCreate] = useState(false);
  const [form, setForm] = useState({ title: '', description: '', category: '' });
  const [creating, setCreating] = useState(false);
  const [formError, setFormError] = useState('');

  const { createCourse } = useInstructorStore();
  const courses = data?.courses || [];

  const handleCreate = async (e) => {
    e.preventDefault();
    if (!form.title || !form.description) { setFormError('Title and description are required.'); return; }
    setCreating(true);
    setFormError('');
    try {
      await createCourse(form);
      setForm({ title: '', description: '', category: '' });
      setShowCreate(false);
    } catch (err) {
      setFormError(typeof err === 'string' ? err : 'Failed to create course');
    } finally {
      setCreating(false);
    }
  };

  const statusColor = (status) => {
    if (status === 'Published') return { bg: '#d1fae5', color: '#065f46' };
    if (status === 'Draft') return { bg: '#fef3c7', color: '#92400e' };
    return { bg: '#e5e7eb', color: '#374151' };
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h2 style={{ margin: 0, fontSize: '22px', fontWeight: 700, color: '#111827' }}>My Courses</h2>
          <p style={{ margin: '4px 0 0', color: '#6b7280', fontSize: '14px' }}>{courses.length} course{courses.length !== 1 ? 's' : ''} created</p>
        </div>
        <button onClick={() => setShowCreate(v => !v)} style={{ display: 'flex', alignItems: 'center', gap: '8px', background: '#6366f1', color: '#fff', border: 'none', padding: '10px 20px', borderRadius: '10px', fontWeight: 600, fontSize: '14px', cursor: 'pointer' }}>
          <Plus size={18} /> New Course
        </button>
      </div>

      {/* Create Course Form */}
      {showCreate && (
        <div style={{ background: '#fff', border: '1px solid #e0e7ff', borderRadius: '14px', padding: '28px', boxShadow: '0 4px 20px rgba(99,102,241,0.08)' }}>
          <h3 style={{ margin: '0 0 20px', fontSize: '17px', fontWeight: 700, color: '#111827' }}>📘 Create New Course</h3>
          {formError && <p style={{ background: '#fef2f2', color: '#b91c1c', padding: '10px 16px', borderRadius: '8px', fontSize: '14px', marginBottom: '16px' }}>{formError}</p>}
          <form onSubmit={handleCreate} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
              <div>
                <label style={{ fontSize: '13px', fontWeight: 600, color: '#374151', display: 'block', marginBottom: '6px' }}>Course Title *</label>
                <input value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value }))} placeholder="e.g. Advanced Machine Learning" style={{ width: '100%', padding: '10px 14px', border: '1px solid #d1d5db', borderRadius: '8px', fontSize: '14px', boxSizing: 'border-box' }} />
              </div>
              <div>
                <label style={{ fontSize: '13px', fontWeight: 600, color: '#374151', display: 'block', marginBottom: '6px' }}>Category</label>
                <select value={form.category} onChange={e => setForm(f => ({ ...f, category: e.target.value }))} style={{ width: '100%', padding: '10px 14px', border: '1px solid #d1d5db', borderRadius: '8px', fontSize: '14px', boxSizing: 'border-box' }}>
                  <option value="">Select a category...</option>
                  {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
            </div>
            <div>
              <label style={{ fontSize: '13px', fontWeight: 600, color: '#374151', display: 'block', marginBottom: '6px' }}>Description *</label>
              <textarea value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} placeholder="Describe what students will learn..." rows={3} style={{ width: '100%', padding: '10px 14px', border: '1px solid #d1d5db', borderRadius: '8px', fontSize: '14px', resize: 'vertical', boxSizing: 'border-box' }} />
            </div>
            <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
              <button type="button" onClick={() => setShowCreate(false)} style={{ padding: '10px 20px', background: '#f3f4f6', border: 'none', borderRadius: '8px', fontSize: '14px', fontWeight: 600, cursor: 'pointer', color: '#374151' }}>Cancel</button>
              <button type="submit" disabled={creating} style={{ padding: '10px 24px', background: '#6366f1', color: '#fff', border: 'none', borderRadius: '8px', fontSize: '14px', fontWeight: 600, cursor: 'pointer', opacity: creating ? 0.7 : 1 }}>
                {creating ? 'Creating...' : 'Create Course'}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Courses Grid */}
      {courses.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '60px 20px', background: '#fff', borderRadius: '14px', border: '1px solid #e5e7eb' }}>
          <BookOpen size={48} style={{ color: '#d1d5db', marginBottom: '16px' }} />
          <p style={{ color: '#6b7280', fontSize: '16px' }}>No courses yet. Create your first one!</p>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '20px' }}>
          {courses.map(course => {
            const sc = statusColor(course.status);
            return (
              <div key={course.id} style={{ background: '#fff', borderRadius: '14px', border: '1px solid #e5e7eb', padding: '24px', boxShadow: '0 1px 4px rgba(0,0,0,0.06)', transition: 'box-shadow 0.2s' }}
                onMouseOver={e => e.currentTarget.style.boxShadow = '0 4px 16px rgba(0,0,0,0.1)'}
                onMouseOut={e => e.currentTarget.style.boxShadow = '0 1px 4px rgba(0,0,0,0.06)'}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
                  <div style={{ width: '44px', height: '44px', background: '#eff6ff', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <BookOpen size={22} color="#6366f1" />
                  </div>
                  <span style={{ ...sc, padding: '4px 12px', borderRadius: '20px', fontSize: '12px', fontWeight: 600 }}>{course.status}</span>
                </div>
                <h3 style={{ margin: '0 0 8px', fontSize: '16px', fontWeight: 700, color: '#111827', lineHeight: 1.4 }}>{course.title}</h3>
                <p style={{ margin: '0 0 16px', fontSize: '13px', color: '#6b7280', lineHeight: 1.5, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>{course.description}</p>
                {course.category && <span style={{ background: '#f3f4f6', color: '#6b7280', padding: '3px 10px', borderRadius: '20px', fontSize: '12px', fontWeight: 500 }}>{course.category}</span>}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default InstructorCoursesTab;
