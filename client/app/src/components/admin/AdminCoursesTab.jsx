import { useState } from 'react';
import { Plus, Search, Edit2, Trash2, X, BookOpen, CheckCircle, AlertCircle, Archive } from 'lucide-react';
import useAdminStore from '../../store/adminStore';

const STATUSES = ['Draft', 'Published', 'Archived'];
const CATEGORIES = ['Computer Science', 'Data Science', 'Mathematics', 'Design', 'Business', 'Languages', 'Engineering', 'Arts'];
const YEARS = ['First', 'Second', 'Third', 'Fourth', 'All'];

const statusColors = {
  Published: { bg: '#d1fae5', color: '#065f46' },
  Draft:     { bg: '#fef3c7', color: '#92400e' },
  Archived:  { bg: '#e5e7eb', color: '#374151' },
};

const StatusIcon = ({ s }) => {
  if (s === 'Published') return <CheckCircle size={13} />;
  if (s === 'Archived')  return <Archive size={13} />;
  return <AlertCircle size={13} />;
};

const EMPTY_FORM = { title: '', description: '', category: '', targetYear: 'All', status: 'Draft' };

const AdminCoursesTab = ({ courses, isLoading }) => {
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [modal, setModal] = useState(null);
  const [deleteConfirm, setDeleteConfirm] = useState(null);
  const [form, setForm] = useState(EMPTY_FORM);
  const [formError, setFormError] = useState('');
  const { createCourse, updateCourse, deleteCourse, actionLoading } = useAdminStore();

  const filtered = courses.filter(c => {
    const matchSearch = !search || c.title.toLowerCase().includes(search.toLowerCase());
    const matchStatus = !statusFilter || c.status === statusFilter;
    return matchSearch && matchStatus;
  });

  const openCreate = () => { setForm(EMPTY_FORM); setFormError(''); setModal('create'); };
  const openEdit = (course) => {
    setForm({ title: course.title, description: course.description, category: course.category || '', targetYear: course.targetYear || 'All', status: course.status });
    setFormError('');
    setModal({ course });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError('');
    try {
      if (modal === 'create') {
        await createCourse(form);
      } else {
        await updateCourse(modal.course.id, form);
      }
      setModal(null);
    } catch (err) {
      setFormError(typeof err === 'string' ? err : 'Operation failed');
    }
  };

  const handleDelete = async () => {
    try {
      await deleteCourse(deleteConfirm.id);
      setDeleteConfirm(null);
    } catch (err) {
      setFormError(typeof err === 'string' ? err : 'Delete failed');
    }
  };

  const overlayStyle = { position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', backdropFilter: 'blur(4px)' };
  const boxStyle = { background: '#fff', borderRadius: '16px', padding: '32px', width: '520px', maxWidth: '90vw', boxShadow: '0 20px 60px rgba(0,0,0,0.2)' };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
        <div>
          <h2 style={{ margin: 0, fontSize: '22px', fontWeight: 700, color: '#111827' }}>Course Management</h2>
          <p style={{ margin: '4px 0 0', color: '#6b7280', fontSize: '14px' }}>{filtered.length} course{filtered.length !== 1 ? 's' : ''} shown</p>
        </div>
        <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
          <div style={{ position: 'relative' }}>
            <Search size={15} style={{ position: 'absolute', left: '11px', top: '50%', transform: 'translateY(-50%)', color: '#9ca3af' }} />
            <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search courses..." style={{ padding: '9px 12px 9px 34px', border: '1px solid #d1d5db', borderRadius: '9px', fontSize: '14px', width: '200px' }} />
          </div>
          <select value={statusFilter} onChange={e => setStatusFilter(e.target.value)} style={{ padding: '9px 12px', border: '1px solid #d1d5db', borderRadius: '9px', fontSize: '14px', background: '#fff' }}>
            <option value="">All Statuses</option>
            {STATUSES.map(s => <option key={s} value={s}>{s}</option>)}
          </select>
          <button onClick={openCreate} style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '9px 18px', background: '#dc2626', color: '#fff', border: 'none', borderRadius: '9px', fontSize: '14px', fontWeight: 600, cursor: 'pointer' }}>
            <Plus size={16} /> Add Course
          </button>
        </div>
      </div>

      {/* Table */}
      {isLoading ? (
        <div style={{ textAlign: 'center', padding: '60px', color: '#6b7280' }}>Loading courses...</div>
      ) : (
        <div style={{ background: '#fff', borderRadius: '14px', border: '1px solid #e5e7eb', overflow: 'hidden', boxShadow: '0 1px 4px rgba(0,0,0,0.06)' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '14px' }}>
            <thead>
              <tr style={{ background: '#f9fafb', color: '#6b7280', fontWeight: 600 }}>
                <th style={{ padding: '13px 20px', textAlign: 'left' }}>Course</th>
                <th style={{ textAlign: 'left', padding: '16px 20px', fontWeight: 600, color: '#6b7280', fontSize: '13px', width: '20%' }}>Instructor</th>
                <th style={{ textAlign: 'left', padding: '16px 20px', fontWeight: 600, color: '#6b7280', fontSize: '13px' }}>Category & Year</th>
                <th style={{ textAlign: 'left', padding: '16px 20px', fontWeight: 600, color: '#6b7280', fontSize: '13px' }}>Status</th>
                <th style={{ padding: '13px 20px', textAlign: 'left' }}>Students</th>
                <th style={{ padding: '13px 20px', textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr><td colSpan={6} style={{ textAlign: 'center', padding: '40px', color: '#6b7280' }}>No courses found.</td></tr>
              ) : filtered.map((c, i) => {
                const sc = statusColors[c.status] || statusColors.Draft;
                return (
                  <tr key={c.id} style={{ borderTop: i > 0 ? '1px solid #f3f4f6' : 'none' }}>
                    <td style={{ padding: '14px 20px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <div style={{ width: '36px', height: '36px', background: '#eff6ff', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                          <BookOpen size={16} color="#6366f1" />
                        </div>
                        <p style={{ margin: 0, fontWeight: 600, color: '#111827', maxWidth: '200px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{c.title}</p>
                      </div>
                    </td>
                    <td style={{ padding: '14px 20px', color: '#4b5563', fontSize: '13px' }}>{c.instructor?.name || '—'}</td>
                    <td style={{ padding: '14px 20px' }}>
                      {c.category && <span style={{ background: '#f3f4f6', color: '#6b7280', padding: '3px 10px', borderRadius: '20px', fontSize: '11px', fontWeight: 600, marginRight: '4px' }}>{c.category}</span>}
                      {c.targetYear && <span style={{ background: '#e0e7ff', color: '#4f46e5', padding: '3px 10px', borderRadius: '20px', fontSize: '11px', fontWeight: 600 }}>{c.targetYear}</span>}
                    </td>
                    <td style={{ padding: '14px 20px' }}>
                      <span style={{ ...sc, padding: '3px 10px', borderRadius: '20px', fontSize: '12px', fontWeight: 600, display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                        <StatusIcon s={c.status} /> {c.status}
                      </span>
                    </td>
                    <td style={{ padding: '14px 20px', fontWeight: 600, color: '#111827' }}>{c.enrollmentCount || 0}</td>
                    <td style={{ padding: '14px 20px', textAlign: 'right' }}>
                      <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end' }}>
                        {/* Quick Publish toggle */}
                        {c.status !== 'Published' && (
                          <button onClick={() => updateCourse(c.id, { status: 'Published' })} style={{ padding: '6px 10px', background: '#d1fae5', color: '#065f46', border: 'none', borderRadius: '7px', fontSize: '11px', fontWeight: 600, cursor: 'pointer' }}>
                            Publish
                          </button>
                        )}
                        <button onClick={() => openEdit(c)} style={{ padding: '6px 12px', background: '#eff6ff', color: '#2563eb', border: 'none', borderRadius: '7px', fontSize: '12px', fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px' }}>
                          <Edit2 size={12} /> Edit
                        </button>
                        <button onClick={() => setDeleteConfirm(c)} style={{ padding: '6px 12px', background: '#fef2f2', color: '#dc2626', border: 'none', borderRadius: '7px', fontSize: '12px', fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px' }}>
                          <Trash2 size={12} /> Delete
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

      {/* Create/Edit Modal */}
      {modal && (
        <div style={overlayStyle} onClick={e => { if (e.target === e.currentTarget) setModal(null); }}>
          <div style={boxStyle}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
              <h3 style={{ margin: 0, fontSize: '18px', fontWeight: 700 }}>{modal === 'create' ? '📘 Create Course' : `✏️ Edit — ${modal.course.title}`}</h3>
              <button onClick={() => setModal(null)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#9ca3af' }}><X size={20} /></button>
            </div>
            {formError && <p style={{ background: '#fef2f2', color: '#b91c1c', padding: '10px 14px', borderRadius: '8px', fontSize: '14px', marginBottom: '16px' }}>{formError}</p>}
            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div>
                <label style={{ fontSize: '12px', fontWeight: 600, color: '#374151', display: 'block', marginBottom: '5px' }}>Title *</label>
                <input value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value }))} required style={{ width: '100%', padding: '10px 13px', border: '1px solid #d1d5db', borderRadius: '8px', fontSize: '14px', boxSizing: 'border-box' }} />
              </div>
              <div>
                <label style={{ fontSize: '12px', fontWeight: 600, color: '#374151', display: 'block', marginBottom: '5px' }}>Description *</label>
                <textarea value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} required rows={3} style={{ width: '100%', padding: '10px 13px', border: '1px solid #d1d5db', borderRadius: '8px', fontSize: '14px', resize: 'vertical', boxSizing: 'border-box' }} />
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div>
                  <label style={{ fontSize: '12px', fontWeight: 600, color: '#374151', display: 'block', marginBottom: '5px' }}>Category</label>
                  <select value={form.category} onChange={e => setForm(f => ({ ...f, category: e.target.value }))} style={{ width: '100%', padding: '10px 13px', border: '1px solid #d1d5db', borderRadius: '8px', fontSize: '14px', boxSizing: 'border-box' }}>
                    <option value="">No category</option>
                    {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
                <div>
                  <label style={{ fontSize: '12px', fontWeight: 600, color: '#374151', display: 'block', marginBottom: '5px' }}>Target Year</label>
                  <select value={form.targetYear} onChange={e => setForm(f => ({ ...f, targetYear: e.target.value }))} style={{ width: '100%', padding: '10px 13px', border: '1px solid #d1d5db', borderRadius: '8px', fontSize: '14px', boxSizing: 'border-box' }}>
                    {YEARS.map(y => <option key={y} value={y}>{y}</option>)}
                  </select>
                </div>
                <div>
                  <label style={{ fontSize: '12px', fontWeight: 600, color: '#374151', display: 'block', marginBottom: '5px' }}>Status</label>
                  <select value={form.status} onChange={e => setForm(f => ({ ...f, status: e.target.value }))} style={{ width: '100%', padding: '10px 13px', border: '1px solid #d1d5db', borderRadius: '8px', fontSize: '14px', boxSizing: 'border-box' }}>
                    {STATUSES.map(s => <option key={s} value={s}>{s}</option>)}
                  </select>
                </div>
              </div>
              <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end', marginTop: '4px' }}>
                <button type="button" onClick={() => setModal(null)} style={{ padding: '10px 20px', background: '#f3f4f6', border: 'none', borderRadius: '8px', fontSize: '14px', fontWeight: 600, cursor: 'pointer', color: '#374151' }}>Cancel</button>
                <button type="submit" disabled={actionLoading} style={{ padding: '10px 24px', background: '#dc2626', color: '#fff', border: 'none', borderRadius: '8px', fontSize: '14px', fontWeight: 600, cursor: 'pointer', opacity: actionLoading ? 0.7 : 1 }}>
                  {actionLoading ? 'Saving...' : (modal === 'create' ? 'Create Course' : 'Save Changes')}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirm */}
      {deleteConfirm && (
        <div style={overlayStyle} onClick={e => { if (e.target === e.currentTarget) setDeleteConfirm(null); }}>
          <div style={{ ...boxStyle, width: '400px' }}>
            <div style={{ textAlign: 'center', marginBottom: '20px' }}>
              <div style={{ width: '64px', height: '64px', background: '#fef2f2', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px' }}>
                <Trash2 size={32} color="#dc2626" />
              </div>
              <h3 style={{ margin: '0 0 8px', fontSize: '18px', fontWeight: 700 }}>Delete Course?</h3>
              <p style={{ margin: 0, color: '#6b7280', fontSize: '14px' }}>This will permanently delete <strong>{deleteConfirm.title}</strong> and all its assignments. Cannot be undone.</p>
            </div>
            <div style={{ display: 'flex', gap: '10px' }}>
              <button onClick={() => setDeleteConfirm(null)} style={{ flex: 1, padding: '11px', background: '#f3f4f6', border: 'none', borderRadius: '10px', fontWeight: 600, cursor: 'pointer', color: '#374151' }}>Cancel</button>
              <button onClick={handleDelete} disabled={actionLoading} style={{ flex: 1, padding: '11px', background: '#dc2626', color: '#fff', border: 'none', borderRadius: '10px', fontWeight: 700, cursor: 'pointer', opacity: actionLoading ? 0.7 : 1 }}>
                {actionLoading ? 'Deleting...' : 'Yes, Delete'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminCoursesTab;
