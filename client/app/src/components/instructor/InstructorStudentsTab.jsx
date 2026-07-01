import { useState } from 'react';
import { Search, MessageSquare, Tag, X, Check, User } from 'lucide-react';
import useInstructorStore from '../../store/instructorStore';

const CATEGORIES = ['Top Performer', 'At Risk', 'Leader', 'Regular', 'Needs Attention'];
const COURSE_ROLES = ['Regular', 'Study Group Leader', 'Mentor', 'Peer Tutor'];
const STUDENT_CATEGORIES = ['Computer Science', 'Data Science', 'Mathematics', 'Design', 'Business', 'Languages', 'Engineering', 'Arts'];
const ACADEMIC_YEARS = ['First', 'Second', 'Third', 'Fourth'];

const CATEGORY_COLORS = {
  'Top Performer': { bg: '#d1fae5', color: '#065f46' },
  'At Risk':       { bg: '#fee2e2', color: '#991b1b' },
  'Leader':        { bg: '#ddd6fe', color: '#5b21b6' },
  'Regular':       { bg: '#f3f4f6', color: '#374151' },
  'Needs Attention': { bg: '#fef3c7', color: '#92400e' },
};

const InstructorStudentsTab = ({ students, studentsLoading }) => {
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [yearFilter, setYearFilter] = useState('');
  const [messageModal, setMessageModal] = useState(null); // { studentId, name }
  const [categoryModal, setCategoryModal] = useState(null); // { studentId, name, enrollments }
  const [msgForm, setMsgForm] = useState({ title: '', message: '' });
  const [catForm, setCatForm] = useState({ courseId: '', category: '', courseRole: '' });
  const [actionLoading, setActionLoading] = useState(false);
  const [feedback, setFeedback] = useState('');

  const { sendMessage, updateStudentCategory } = useInstructorStore();

  const filtered = (students || []).filter(s => {
    const matchSearch = s.name.toLowerCase().includes(search.toLowerCase()) || s.email.toLowerCase().includes(search.toLowerCase());
    const matchCat = !categoryFilter || s.category === categoryFilter;
    const matchYear = !yearFilter || s.academicYear === yearFilter;
    return matchSearch && matchCat && matchYear;
  });

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!msgForm.message.trim()) return;
    setActionLoading(true);
    try {
      await sendMessage(messageModal.studentId, msgForm.title, msgForm.message);
      setFeedback('Message sent successfully!');
      setTimeout(() => { setMessageModal(null); setFeedback(''); setMsgForm({ title: '', message: '' }); }, 1500);
    } catch (err) {
      setFeedback(typeof err === 'string' ? err : 'Failed to send message');
    } finally {
      setActionLoading(false);
    }
  };

  const handleCategoryUpdate = async (e) => {
    e.preventDefault();
    if (!catForm.courseId) return;
    setActionLoading(true);
    try {
      await updateStudentCategory(categoryModal.studentId, catForm.courseId, catForm.category, catForm.courseRole);
      setFeedback('Updated successfully!');
      setTimeout(() => { setCategoryModal(null); setFeedback(''); setCatForm({ courseId: '', category: '', courseRole: '' }); }, 1500);
    } catch (err) {
      setFeedback(typeof err === 'string' ? err : 'Failed to update');
    } finally {
      setActionLoading(false);
    }
  };

  const modalOverlay = { position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', backdropFilter: 'blur(4px)' };
  const modalBox = { background: '#fff', borderRadius: '16px', padding: '32px', width: '460px', maxWidth: '90vw', boxShadow: '0 20px 60px rgba(0,0,0,0.2)' };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      {/* Header + Search */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h2 style={{ margin: 0, fontSize: '22px', fontWeight: 700, color: '#111827' }}>Students</h2>
          <p style={{ margin: '4px 0 0', color: '#6b7280', fontSize: '14px' }}>{filtered.length} student{filtered.length !== 1 ? 's' : ''} enrolled across your courses</p>
        </div>
        <div style={{ display: 'flex', gap: '10px' }}>
          <select value={categoryFilter} onChange={e => setCategoryFilter(e.target.value)} style={{ padding: '10px 14px', border: '1px solid #d1d5db', borderRadius: '10px', fontSize: '14px', background: '#fff' }}>
            <option value="">All Categories</option>
            {STUDENT_CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
          </select>
          <select value={yearFilter} onChange={e => setYearFilter(e.target.value)} style={{ padding: '10px 14px', border: '1px solid #d1d5db', borderRadius: '10px', fontSize: '14px', background: '#fff' }}>
            <option value="">All Years</option>
            {ACADEMIC_YEARS.map(y => <option key={y} value={y}>{y}</option>)}
          </select>
          <div style={{ position: 'relative' }}>
            <Search size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#9ca3af' }} />
            <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search students..." style={{ padding: '10px 14px 10px 38px', border: '1px solid #d1d5db', borderRadius: '10px', fontSize: '14px', width: '200px' }} />
          </div>
        </div>
      </div>

      {studentsLoading ? (
        <div style={{ textAlign: 'center', padding: '60px', color: '#6b7280' }}>Loading students...</div>
      ) : filtered.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '60px', background: '#fff', borderRadius: '14px', border: '1px solid #e5e7eb', color: '#6b7280' }}>
          <User size={48} style={{ color: '#d1d5db', marginBottom: '12px' }} />
          <p>{search ? 'No students match your search.' : 'No students enrolled in your courses yet.'}</p>
        </div>
      ) : (
        <div style={{ background: '#fff', borderRadius: '14px', border: '1px solid #e5e7eb', overflow: 'hidden', boxShadow: '0 1px 4px rgba(0,0,0,0.06)' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '14px' }}>
            <thead>
              <tr style={{ background: '#f9fafb', color: '#6b7280', fontWeight: 600 }}>
                <th style={{ padding: '14px 20px', textAlign: 'left' }}>Student Profile</th>
                <th style={{ padding: '14px 20px', textAlign: 'left' }}>Courses</th>
                <th style={{ padding: '14px 20px', textAlign: 'left' }}>Avg. Score</th>
                <th style={{ padding: '14px 20px', textAlign: 'left' }}>Performance Category</th>
                <th style={{ padding: '14px 20px', textAlign: 'left' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((student, i) => {
                const avgAll = student.enrollments.filter(e => e.avgScore !== null);
                const overallAvg = avgAll.length > 0 ? Math.round(avgAll.reduce((s, e) => s + e.avgScore, 0) / avgAll.length) : null;
                const allCategories = student.enrollments.map(e => e.category).filter(Boolean);
                const primaryCat = allCategories[0] || null;
                const catStyle = primaryCat ? CATEGORY_COLORS[primaryCat] || CATEGORY_COLORS['Regular'] : null;

                return (
                  <tr key={student.id} style={{ borderTop: i > 0 ? '1px solid #f3f4f6' : 'none' }}>
                    <td style={{ padding: '16px 20px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <img src={student.avatar || `https://i.pravatar.cc/150?u=${student.id}`} alt={student.name} style={{ width: '38px', height: '38px', borderRadius: '50%', objectFit: 'cover', flexShrink: 0 }} />
                        <div>
                          <p style={{ margin: 0, fontWeight: 600, color: '#111827' }}>{student.name}</p>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginTop: '2px' }}>
                            {student.category && <span style={{ fontSize: '11px', color: '#6b7280', background: '#f3f4f6', padding: '2px 6px', borderRadius: '4px' }}>{student.category}</span>}
                            {student.academicYear && <span style={{ fontSize: '11px', color: '#6b7280', background: '#f3f4f6', padding: '2px 6px', borderRadius: '4px' }}>{student.academicYear} Year</span>}
                            {(!student.category && !student.academicYear) && <span style={{ margin: 0, fontSize: '12px', color: '#9ca3af' }}>{student.email}</span>}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td style={{ padding: '16px 20px' }}>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '3px' }}>
                        {student.enrollments.slice(0, 2).map((enr, j) => (
                          <span key={j} style={{ background: '#eff6ff', color: '#3b82f6', padding: '2px 8px', borderRadius: '20px', fontSize: '11px', fontWeight: 600, display: 'inline-block' }}>{enr.courseTitle}</span>
                        ))}
                        {student.enrollments.length > 2 && <span style={{ fontSize: '11px', color: '#9ca3af' }}>+{student.enrollments.length - 2} more</span>}
                      </div>
                    </td>
                    <td style={{ padding: '16px 20px' }}>
                      {overallAvg !== null ? (
                        <span style={{ fontWeight: 700, color: overallAvg >= 75 ? '#059669' : overallAvg >= 50 ? '#d97706' : '#dc2626', fontSize: '16px' }}>{overallAvg}%</span>
                      ) : <span style={{ color: '#9ca3af', fontSize: '13px' }}>N/A</span>}
                    </td>
                    <td style={{ padding: '16px 20px' }}>
                      {catStyle ? (
                        <span style={{ ...catStyle, padding: '4px 12px', borderRadius: '20px', fontSize: '12px', fontWeight: 600 }}>{primaryCat}</span>
                      ) : (
                        <span style={{ color: '#9ca3af', fontSize: '12px' }}>—</span>
                      )}
                    </td>
                    <td style={{ padding: '16px 20px' }}>
                      <div style={{ display: 'flex', gap: '8px' }}>
                        <button onClick={() => { setMessageModal({ studentId: student.id, name: student.name }); setFeedback(''); }}
                          style={{ display: 'flex', alignItems: 'center', gap: '5px', padding: '7px 13px', background: '#eff6ff', color: '#3b82f6', border: 'none', borderRadius: '8px', fontSize: '12px', fontWeight: 600, cursor: 'pointer' }}>
                          <MessageSquare size={13} /> Message
                        </button>
                        <button onClick={() => { setCategoryModal({ studentId: student.id, name: student.name, enrollments: student.enrollments }); setCatForm({ courseId: student.enrollments[0]?.courseId || '', category: student.enrollments[0]?.category || '', courseRole: student.enrollments[0]?.courseRole || '' }); setFeedback(''); }}
                          style={{ display: 'flex', alignItems: 'center', gap: '5px', padding: '7px 13px', background: '#f5f3ff', color: '#6366f1', border: 'none', borderRadius: '8px', fontSize: '12px', fontWeight: 600, cursor: 'pointer' }}>
                          <Tag size={13} /> Assign
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {/* Message Modal */}
      {messageModal && (
        <div style={modalOverlay} onClick={e => { if (e.target === e.currentTarget) setMessageModal(null); }}>
          <div style={modalBox}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <h3 style={{ margin: 0, fontSize: '18px', fontWeight: 700 }}>✉️ Message {messageModal.name}</h3>
              <button onClick={() => setMessageModal(null)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#9ca3af' }}><X size={20} /></button>
            </div>
            {feedback && <p style={{ background: feedback.includes('success') ? '#d1fae5' : '#fee2e2', color: feedback.includes('success') ? '#065f46' : '#991b1b', padding: '10px 16px', borderRadius: '8px', fontSize: '14px', marginBottom: '16px' }}>{feedback}</p>}
            <form onSubmit={handleSendMessage} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div>
                <label style={{ fontSize: '13px', fontWeight: 600, color: '#374151', display: 'block', marginBottom: '6px' }}>Subject</label>
                <input value={msgForm.title} onChange={e => setMsgForm(f => ({ ...f, title: e.target.value }))} placeholder="e.g. Assignment feedback" style={{ width: '100%', padding: '10px 14px', border: '1px solid #d1d5db', borderRadius: '8px', fontSize: '14px', boxSizing: 'border-box' }} />
              </div>
              <div>
                <label style={{ fontSize: '13px', fontWeight: 600, color: '#374151', display: 'block', marginBottom: '6px' }}>Message *</label>
                <textarea value={msgForm.message} onChange={e => setMsgForm(f => ({ ...f, message: e.target.value }))} placeholder="Write your message..." rows={4} required style={{ width: '100%', padding: '10px 14px', border: '1px solid #d1d5db', borderRadius: '8px', fontSize: '14px', resize: 'vertical', boxSizing: 'border-box' }} />
              </div>
              <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
                <button type="button" onClick={() => setMessageModal(null)} style={{ padding: '10px 20px', background: '#f3f4f6', border: 'none', borderRadius: '8px', fontSize: '14px', fontWeight: 600, cursor: 'pointer', color: '#374151' }}>Cancel</button>
                <button type="submit" disabled={actionLoading} style={{ padding: '10px 24px', background: '#3b82f6', color: '#fff', border: 'none', borderRadius: '8px', fontSize: '14px', fontWeight: 600, cursor: 'pointer', opacity: actionLoading ? 0.7 : 1, display: 'flex', alignItems: 'center', gap: '6px' }}>
                  {actionLoading ? 'Sending...' : <><MessageSquare size={15} /> Send Message</>}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Category/Role Modal */}
      {categoryModal && (
        <div style={modalOverlay} onClick={e => { if (e.target === e.currentTarget) setCategoryModal(null); }}>
          <div style={modalBox}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <h3 style={{ margin: 0, fontSize: '18px', fontWeight: 700 }}>🏷️ Assign Category — {categoryModal.name}</h3>
              <button onClick={() => setCategoryModal(null)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#9ca3af' }}><X size={20} /></button>
            </div>
            {feedback && <p style={{ background: feedback.includes('success') ? '#d1fae5' : '#fee2e2', color: feedback.includes('success') ? '#065f46' : '#991b1b', padding: '10px 16px', borderRadius: '8px', fontSize: '14px', marginBottom: '16px' }}>{feedback}</p>}
            <form onSubmit={handleCategoryUpdate} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div>
                <label style={{ fontSize: '13px', fontWeight: 600, color: '#374151', display: 'block', marginBottom: '6px' }}>Course *</label>
                <select value={catForm.courseId} onChange={e => {
                  const courseId = e.target.value;
                  const enr = categoryModal.enrollments.find(en => en.courseId === courseId);
                  setCatForm(f => ({ ...f, courseId, category: enr?.category || '', courseRole: enr?.courseRole || '' }));
                }} required style={{ width: '100%', padding: '10px 14px', border: '1px solid #d1d5db', borderRadius: '8px', fontSize: '14px', boxSizing: 'border-box' }}>
                  <option value="">Select course...</option>
                  {categoryModal.enrollments.map(enr => <option key={enr.courseId} value={enr.courseId}>{enr.courseTitle}</option>)}
                </select>
              </div>
              <div>
                <label style={{ fontSize: '13px', fontWeight: 600, color: '#374151', display: 'block', marginBottom: '8px' }}>Performance Category</label>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                  {CATEGORIES.map(cat => {
                    const cs = CATEGORY_COLORS[cat] || CATEGORY_COLORS['Regular'];
                    const active = catForm.category === cat;
                    return (
                      <button key={cat} type="button" onClick={() => setCatForm(f => ({ ...f, category: cat }))}
                        style={{ padding: '7px 14px', borderRadius: '20px', border: active ? '2px solid #6366f1' : `1px solid ${cs.bg}`, background: active ? '#eff6ff' : cs.bg, color: active ? '#6366f1' : cs.color, fontSize: '13px', fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '5px' }}>
                        {active && <Check size={13} />}{cat}
                      </button>
                    );
                  })}
                </div>
              </div>
              <div>
                <label style={{ fontSize: '13px', fontWeight: 600, color: '#374151', display: 'block', marginBottom: '6px' }}>Course Role</label>
                <select value={catForm.courseRole} onChange={e => setCatForm(f => ({ ...f, courseRole: e.target.value }))} style={{ width: '100%', padding: '10px 14px', border: '1px solid #d1d5db', borderRadius: '8px', fontSize: '14px', boxSizing: 'border-box' }}>
                  <option value="">Select role...</option>
                  {COURSE_ROLES.map(r => <option key={r} value={r}>{r}</option>)}
                </select>
              </div>
              <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
                <button type="button" onClick={() => setCategoryModal(null)} style={{ padding: '10px 20px', background: '#f3f4f6', border: 'none', borderRadius: '8px', fontSize: '14px', fontWeight: 600, cursor: 'pointer', color: '#374151' }}>Cancel</button>
                <button type="submit" disabled={actionLoading} style={{ padding: '10px 24px', background: '#6366f1', color: '#fff', border: 'none', borderRadius: '8px', fontSize: '14px', fontWeight: 600, cursor: 'pointer', opacity: actionLoading ? 0.7 : 1 }}>
                  {actionLoading ? 'Saving...' : 'Save Changes'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default InstructorStudentsTab;
