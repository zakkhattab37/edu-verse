import { useState } from 'react';
import { Plus, Search, Edit2, Trash2, X, Check, UserCircle, ShieldAlert } from 'lucide-react';
import useAdminStore from '../../store/adminStore';

const ROLES = ['Student', 'Instructor', 'Admin'];
const CATEGORIES = ['Computer Science', 'Data Science', 'Mathematics', 'Design', 'Business', 'Languages', 'Engineering', 'Arts'];
const YEARS = ['First', 'Second', 'Third', 'Fourth'];

const roleColors = {
  Admin:      { bg: '#fef2f2', color: '#dc2626' },
  Instructor: { bg: '#eff6ff', color: '#2563eb' },
  Student:    { bg: '#f0fdf4', color: '#16a34a' },
};

const EMPTY_FORM = { name: '', email: '', password: '', role: 'Student' };

const AdminUsersTab = ({ users, isLoading }) => {
  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [yearFilter, setYearFilter] = useState('');
  const [modal, setModal] = useState(null); // 'create' | { user: {...} } for edit
  const [deleteConfirm, setDeleteConfirm] = useState(null);
  const [form, setForm] = useState(EMPTY_FORM);
  const [formError, setFormError] = useState('');
  const { createUser, updateUser, deleteUser, actionLoading, fetchUsers } = useAdminStore();

  const filtered = users.filter(u => {
    const matchSearch = !search || u.name.toLowerCase().includes(search.toLowerCase()) || u.email.toLowerCase().includes(search.toLowerCase());
    const matchRole = !roleFilter || u.role === roleFilter;
    const matchCat = !categoryFilter || u.category === categoryFilter;
    const matchYear = !yearFilter || u.academicYear === yearFilter;
    return matchSearch && matchRole && matchCat && matchYear;
  });

  const openCreate = () => { setForm(EMPTY_FORM); setFormError(''); setModal('create'); };
  const openEdit = (user) => { setForm({ name: user.name, email: user.email, password: '', role: user.role }); setFormError(''); setModal({ user }); };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError('');
    try {
      if (modal === 'create') {
        await createUser(form);
      } else {
        const payload = { name: form.name, email: form.email, role: form.role };
        if (form.password) payload.password = form.password;
        await updateUser(modal.user.id, payload);
      }
      setModal(null);
    } catch (err) {
      setFormError(typeof err === 'string' ? err : 'Operation failed');
    }
  };

  const handleDelete = async () => {
    try {
      await deleteUser(deleteConfirm.id);
      setDeleteConfirm(null);
    } catch (err) {
      setFormError(typeof err === 'string' ? err : 'Delete failed');
    }
  };

  const overlayStyle = { position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', backdropFilter: 'blur(4px)' };
  const boxStyle = { background: '#fff', borderRadius: '16px', padding: '32px', width: '480px', maxWidth: '90vw', boxShadow: '0 20px 60px rgba(0,0,0,0.2)' };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
        <div>
          <h2 style={{ margin: 0, fontSize: '22px', fontWeight: 700, color: '#111827' }}>User Management</h2>
          <p style={{ margin: '4px 0 0', color: '#6b7280', fontSize: '14px' }}>{filtered.length} user{filtered.length !== 1 ? 's' : ''} shown</p>
        </div>
        <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
          {/* Search */}
          <div style={{ position: 'relative' }}>
            <Search size={15} style={{ position: 'absolute', left: '11px', top: '50%', transform: 'translateY(-50%)', color: '#9ca3af' }} />
            <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search users..." style={{ padding: '9px 12px 9px 34px', border: '1px solid #d1d5db', borderRadius: '9px', fontSize: '14px', width: '200px' }} />
          </div>
          {/* Role filter */}
          <select value={roleFilter} onChange={e => setRoleFilter(e.target.value)} style={{ padding: '9px 12px', border: '1px solid #d1d5db', borderRadius: '9px', fontSize: '14px', background: '#fff' }}>
            <option value="">All Roles</option>
            {ROLES.map(r => <option key={r} value={r}>{r}</option>)}
          </select>
          {/* Category filter */}
          <select value={categoryFilter} onChange={e => setCategoryFilter(e.target.value)} style={{ padding: '9px 12px', border: '1px solid #d1d5db', borderRadius: '9px', fontSize: '14px', background: '#fff' }}>
            <option value="">All Categories</option>
            {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
          </select>
          {/* Year filter */}
          <select value={yearFilter} onChange={e => setYearFilter(e.target.value)} style={{ padding: '9px 12px', border: '1px solid #d1d5db', borderRadius: '9px', fontSize: '14px', background: '#fff' }}>
            <option value="">All Years</option>
            {YEARS.map(y => <option key={y} value={y}>{y}</option>)}
          </select>
          <button onClick={openCreate} style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '9px 18px', background: '#dc2626', color: '#fff', border: 'none', borderRadius: '9px', fontSize: '14px', fontWeight: 600, cursor: 'pointer' }}>
            <Plus size={16} /> Add User
          </button>
        </div>
      </div>

      {/* Table */}
      {isLoading ? (
        <div style={{ textAlign: 'center', padding: '60px', color: '#6b7280' }}>Loading users...</div>
      ) : (
        <div style={{ background: '#fff', borderRadius: '14px', border: '1px solid #e5e7eb', overflow: 'hidden', boxShadow: '0 1px 4px rgba(0,0,0,0.06)' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '14px' }}>
            <thead>
              <tr style={{ background: '#f9fafb', color: '#6b7280', fontWeight: 600 }}>
                <th style={{ padding: '13px 20px', textAlign: 'left' }}>User</th>
                <th style={{ padding: '13px 20px', textAlign: 'left' }}>Role & Profile</th>
                <th style={{ padding: '13px 20px', textAlign: 'left' }}>Joined</th>
                <th style={{ padding: '13px 20px', textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr><td colSpan={4} style={{ textAlign: 'center', padding: '40px', color: '#6b7280' }}>No users found.</td></tr>
              ) : filtered.map((u, i) => {
                const rc = roleColors[u.role] || roleColors.Student;
                return (
                  <tr key={u.id} style={{ borderTop: i > 0 ? '1px solid #f3f4f6' : 'none' }}>
                    <td style={{ padding: '14px 20px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <img src={u.avatar || `https://i.pravatar.cc/150?u=${u.id}`} alt={u.name} style={{ width: '36px', height: '36px', borderRadius: '50%', objectFit: 'cover', flexShrink: 0 }} />
                        <div>
                          <p style={{ margin: 0, fontWeight: 600, color: '#111827' }}>{u.name}</p>
                          <p style={{ margin: 0, fontSize: '12px', color: '#9ca3af' }}>{u.email}</p>
                        </div>
                      </div>
                    </td>
                    <td style={{ padding: '14px 20px' }}>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', alignItems: 'flex-start' }}>
                        <span style={{ ...rc, padding: '3px 12px', borderRadius: '20px', fontSize: '12px', fontWeight: 600 }}>{u.role}</span>
                        {u.role === 'Student' && (u.category || u.academicYear) && (
                          <div style={{ fontSize: '11px', color: '#6b7280', display: 'flex', gap: '6px' }}>
                            {u.category && <span>{u.category}</span>}
                            {u.academicYear && <span>· {u.academicYear} Year</span>}
                          </div>
                        )}
                      </div>
                    </td>
                    <td style={{ padding: '14px 20px', color: '#6b7280', fontSize: '13px' }}>
                      {new Date(u.createdAt).toLocaleDateString()}
                    </td>
                    <td style={{ padding: '14px 20px', textAlign: 'right' }}>
                      <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end' }}>
                        <button onClick={() => openEdit(u)} style={{ padding: '6px 12px', background: '#eff6ff', color: '#2563eb', border: 'none', borderRadius: '7px', fontSize: '12px', fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px' }}>
                          <Edit2 size={12} /> Edit
                        </button>
                        <button onClick={() => setDeleteConfirm(u)} style={{ padding: '6px 12px', background: '#fef2f2', color: '#dc2626', border: 'none', borderRadius: '7px', fontSize: '12px', fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px' }}>
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

      {/* Create / Edit Modal */}
      {modal && (
        <div style={overlayStyle} onClick={e => { if (e.target === e.currentTarget) setModal(null); }}>
          <div style={boxStyle}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
              <h3 style={{ margin: 0, fontSize: '18px', fontWeight: 700 }}>{modal === 'create' ? '➕ Create User' : `✏️ Edit — ${modal.user.name}`}</h3>
              <button onClick={() => setModal(null)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#9ca3af' }}><X size={20} /></button>
            </div>
            {formError && <p style={{ background: '#fef2f2', color: '#b91c1c', padding: '10px 14px', borderRadius: '8px', fontSize: '14px', marginBottom: '16px' }}>{formError}</p>}
            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div>
                <label style={{ fontSize: '12px', fontWeight: 600, color: '#374151', display: 'block', marginBottom: '5px' }}>Full Name *</label>
                <input value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} required style={{ width: '100%', padding: '10px 13px', border: '1px solid #d1d5db', borderRadius: '8px', fontSize: '14px', boxSizing: 'border-box' }} />
              </div>
              <div>
                <label style={{ fontSize: '12px', fontWeight: 600, color: '#374151', display: 'block', marginBottom: '5px' }}>Email *</label>
                <input type="email" value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))} required style={{ width: '100%', padding: '10px 13px', border: '1px solid #d1d5db', borderRadius: '8px', fontSize: '14px', boxSizing: 'border-box' }} />
              </div>
              <div>
                <label style={{ fontSize: '12px', fontWeight: 600, color: '#374151', display: 'block', marginBottom: '5px' }}>{modal === 'create' ? 'Password *' : 'New Password (leave blank to keep)'}</label>
                <input type="password" value={form.password} onChange={e => setForm(f => ({ ...f, password: e.target.value }))} required={modal === 'create'} placeholder={modal !== 'create' ? '••••••••' : ''} style={{ width: '100%', padding: '10px 13px', border: '1px solid #d1d5db', borderRadius: '8px', fontSize: '14px', boxSizing: 'border-box' }} />
              </div>
              <div>
                <label style={{ fontSize: '12px', fontWeight: 600, color: '#374151', display: 'block', marginBottom: '5px' }}>Role</label>
                <select value={form.role} onChange={e => setForm(f => ({ ...f, role: e.target.value }))} style={{ width: '100%', padding: '10px 13px', border: '1px solid #d1d5db', borderRadius: '8px', fontSize: '14px', boxSizing: 'border-box' }}>
                  {ROLES.map(r => <option key={r} value={r}>{r}</option>)}
                </select>
              </div>
              <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end', marginTop: '4px' }}>
                <button type="button" onClick={() => setModal(null)} style={{ padding: '10px 20px', background: '#f3f4f6', border: 'none', borderRadius: '8px', fontSize: '14px', fontWeight: 600, cursor: 'pointer', color: '#374151' }}>Cancel</button>
                <button type="submit" disabled={actionLoading} style={{ padding: '10px 24px', background: '#dc2626', color: '#fff', border: 'none', borderRadius: '8px', fontSize: '14px', fontWeight: 600, cursor: 'pointer', opacity: actionLoading ? 0.7 : 1 }}>
                  {actionLoading ? 'Saving...' : (modal === 'create' ? 'Create User' : 'Save Changes')}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirm Modal */}
      {deleteConfirm && (
        <div style={overlayStyle} onClick={e => { if (e.target === e.currentTarget) setDeleteConfirm(null); }}>
          <div style={{ ...boxStyle, width: '400px' }}>
            <div style={{ textAlign: 'center', marginBottom: '20px' }}>
              <div style={{ width: '64px', height: '64px', background: '#fef2f2', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px' }}>
                <ShieldAlert size={32} color="#dc2626" />
              </div>
              <h3 style={{ margin: '0 0 8px', fontSize: '18px', fontWeight: 700 }}>Delete User?</h3>
              <p style={{ margin: 0, color: '#6b7280', fontSize: '14px' }}>This will permanently delete <strong>{deleteConfirm.name}</strong>. This action cannot be undone.</p>
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

export default AdminUsersTab;
