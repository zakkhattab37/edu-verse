import {
  Home, BookOpen, FileText, CheckCircle, MessageSquare,
  Play, Download, Send, ChevronUp, Circle, MoreHorizontal,
  Bold, Italic, Underline, List, Clock, Award, Users,
  ArrowLeft, ExternalLink, Star, Zap, AlertCircle, Loader,
  ChevronDown, ChevronRight, Lock, BookMarked
} from 'lucide-react';
import { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import useCourseStore from '../store/courseStore';
import useAuthStore from '../store/authStore';
import axios from 'axios';

const API = 'http://localhost:5000/api';

/* ─── Helpers ─────────────────────────────────────────────── */
const fmtDate = (d) => d ? new Date(d).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : 'N/A';
const fmtTime = (d) => d ? new Date(d).toLocaleString() : 'N/A';

const TABS = [
  { key: 'Overview',     icon: Home,           label: 'Overview' },
  { key: 'Materials',    icon: BookOpen,        label: 'Materials' },
  { key: 'Assignments',  icon: FileText,        label: 'Assignments' },
  { key: 'Quizzes',      icon: CheckCircle,     label: 'Quizzes' },
  { key: 'Discussion',   icon: MessageSquare,   label: 'Discussion' },
];

/* ─── Sub-components ──────────────────────────────────────── */

// Empty state
const EmptyState = ({ icon: Icon, title, message }) => (
  <div style={{ textAlign: 'center', padding: '60px 20px', background: 'rgba(255,255,255,0.5)', borderRadius: '16px', border: '1px dashed #e2e8f0' }}>
    <Icon size={48} style={{ color: '#cbd5e1', margin: '0 auto 16px', display: 'block' }} />
    <p style={{ margin: 0, fontWeight: 700, color: '#64748b', fontSize: '16px' }}>{title}</p>
    <p style={{ margin: '6px 0 0', color: '#94a3b8', fontSize: '14px' }}>{message}</p>
  </div>
);

// ── Overview Tab ───────────────────────────────────────────
const OverviewTab = ({ course, assignments, materials, quizzes }) => {
  const completedAssignments = assignments.filter(a => a.Submissions?.[0]?.status === 'graded').length;
  const submittedAssignments = assignments.filter(a => a.Submissions?.[0]).length;
  const progress = assignments.length > 0 ? Math.round((submittedAssignments / assignments.length) * 100) : 0;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '28px' }}>
      {/* Hero Banner */}
      <div style={{ background: 'linear-gradient(135deg, #1e293b 0%, #0f172a 60%, #312e81 100%)', borderRadius: '20px', padding: '36px', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', top: '-40px', right: '-40px', width: '220px', height: '220px', background: 'radial-gradient(circle, rgba(99,102,241,0.3) 0%, transparent 70%)', pointerEvents: 'none' }} />
        <span style={{ background: 'rgba(99,102,241,0.2)', color: '#a78bfa', padding: '4px 14px', borderRadius: '20px', fontSize: '12px', fontWeight: 700, border: '1px solid rgba(99,102,241,0.3)' }}>
          {course?.category || 'Course'}
        </span>
        <h2 style={{ margin: '14px 0 8px', fontSize: '26px', fontWeight: 800, color: '#fff', lineHeight: 1.3 }}>{course?.title}</h2>
        <p style={{ margin: 0, color: '#94a3b8', fontSize: '15px', lineHeight: 1.7, maxWidth: '600px' }}>{course?.description}</p>
      </div>

      {/* Progress Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px' }}>
        {[
          { label: 'Materials', value: materials.length, icon: BookOpen, color: '#6366f1', bg: '#eff6ff' },
          { label: 'Assignments', value: assignments.length, icon: FileText, color: '#f59e0b', bg: '#fef9c3' },
          { label: 'Quizzes', value: quizzes.length, icon: CheckCircle, color: '#10b981', bg: '#dcfce7' },
          { label: 'Progress', value: `${progress}%`, icon: Star, color: '#8b5cf6', bg: '#f5f3ff' },
        ].map(s => (
          <div key={s.label} style={{ background: '#fff', border: '1px solid #e2e8f0', borderRadius: '14px', padding: '20px', display: 'flex', alignItems: 'center', gap: '14px' }}>
            <div style={{ width: '44px', height: '44px', borderRadius: '12px', background: s.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <s.icon size={22} color={s.color} />
            </div>
            <div>
              <p style={{ margin: 0, fontSize: '24px', fontWeight: 800, color: '#0f172a' }}>{s.value}</p>
              <p style={{ margin: '2px 0 0', fontSize: '12px', color: '#94a3b8' }}>{s.label}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Progress Bar */}
      <div style={{ background: '#fff', border: '1px solid #e2e8f0', borderRadius: '14px', padding: '24px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
          <span style={{ fontWeight: 700, color: '#0f172a', fontSize: '15px' }}>Course Completion</span>
          <span style={{ fontWeight: 700, color: '#6366f1' }}>{progress}%</span>
        </div>
        <div style={{ height: '10px', background: '#f1f5f9', borderRadius: '5px', overflow: 'hidden' }}>
          <div style={{ width: `${progress}%`, height: '100%', background: 'linear-gradient(90deg, #6366f1, #8b5cf6)', borderRadius: '5px', transition: 'width 0.8s ease' }} />
        </div>
        <p style={{ margin: '10px 0 0', fontSize: '13px', color: '#94a3b8' }}>{submittedAssignments} of {assignments.length} assignments submitted</p>
      </div>

      {/* Upcoming Assignments */}
      {assignments.filter(a => !a.Submissions?.[0]).length > 0 && (
        <div style={{ background: '#fff', border: '1px solid #e2e8f0', borderRadius: '14px', padding: '24px' }}>
          <h3 style={{ margin: '0 0 16px', fontSize: '16px', fontWeight: 700, color: '#0f172a' }}>⏰ Pending Assignments</h3>
          {assignments.filter(a => !a.Submissions?.[0]).slice(0, 3).map(a => (
            <div key={a.id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 0', borderBottom: '1px solid #f1f5f9' }}>
              <div>
                <p style={{ margin: 0, fontWeight: 600, color: '#1e293b', fontSize: '14px' }}>{a.title}</p>
                <p style={{ margin: '2px 0 0', fontSize: '12px', color: '#94a3b8' }}>{a.totalPoints} pts · Due: {fmtDate(a.dueDate)}</p>
              </div>
              <span style={{ background: '#fef3c7', color: '#d97706', padding: '4px 12px', borderRadius: '20px', fontSize: '12px', fontWeight: 600 }}>Pending</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

// ── Materials Tab ─────────────────────────────────────────
const MaterialsTab = ({ materials }) => {
  if (materials.length === 0) return <EmptyState icon={BookOpen} title="No Materials Yet" message="The instructor hasn't uploaded any materials for this course." />;

  const typeIcon = (type) => {
    if (type === 'Video') return { icon: Play, color: '#ef4444', bg: '#fee2e2' };
    if (type === 'PDF') return { icon: FileText, color: '#3b82f6', bg: '#dbeafe' };
    return { icon: BookMarked, color: '#8b5cf6', bg: '#f5f3ff' };
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
      {materials.map((m, i) => {
        const { icon: TIcon, color, bg } = typeIcon(m.type);
        const url = m.fileUrl?.startsWith('/') ? `${API.replace('/api', '')}${m.fileUrl}` : m.fileUrl;
        return (
          <div key={m.id} style={{ background: '#fff', border: '1.5px solid #e2e8f0', borderRadius: '14px', padding: '20px', display: 'flex', alignItems: 'center', gap: '16px', transition: 'box-shadow 0.2s', cursor: 'default' }}
            onMouseOver={e => e.currentTarget.style.boxShadow = '0 4px 16px rgba(0,0,0,0.08)'}
            onMouseOut={e => e.currentTarget.style.boxShadow = 'none'}
          >
            <div style={{ width: '50px', height: '50px', borderRadius: '12px', background: bg, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <TIcon size={24} color={color} />
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <p style={{ margin: 0, fontWeight: 700, color: '#0f172a', fontSize: '15px' }}>{m.title}</p>
              {m.description && <p style={{ margin: '3px 0 0', fontSize: '13px', color: '#64748b', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{m.description}</p>}
              <span style={{ marginTop: '6px', display: 'inline-block', background: bg, color, padding: '2px 10px', borderRadius: '20px', fontSize: '11px', fontWeight: 700 }}>{m.type || 'Resource'}</span>
            </div>
            {url && (
              <a href={url} target="_blank" rel="noopener noreferrer"
                style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '9px 18px', background: 'linear-gradient(135deg, #6366f1, #8b5cf6)', color: '#fff', textDecoration: 'none', borderRadius: '10px', fontWeight: 600, fontSize: '13px', flexShrink: 0, boxShadow: '0 2px 8px rgba(99,102,241,0.3)' }}
              >
                <ExternalLink size={14} /> Open
              </a>
            )}
          </div>
        );
      })}
    </div>
  );
};

// ── Assignments Tab ───────────────────────────────────────
const FILE_TYPES = {
  'application/pdf': { label: 'PDF', color: '#ef4444', bg: '#fee2e2' },
  'application/msword': { label: 'DOC', color: '#2563eb', bg: '#dbeafe' },
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document': { label: 'DOCX', color: '#2563eb', bg: '#dbeafe' },
  'application/vnd.ms-powerpoint': { label: 'PPT', color: '#ea580c', bg: '#ffedd5' },
  'application/vnd.openxmlformats-officedocument.presentationml.presentation': { label: 'PPTX', color: '#ea580c', bg: '#ffedd5' },
  'text/plain': { label: 'TXT', color: '#64748b', bg: '#f1f5f9' },
  'application/zip': { label: 'ZIP', color: '#8b5cf6', bg: '#f5f3ff' },
  'application/x-zip-compressed': { label: 'ZIP', color: '#8b5cf6', bg: '#f5f3ff' },
  'image/jpeg': { label: 'IMG', color: '#10b981', bg: '#dcfce7' },
  'image/png': { label: 'IMG', color: '#10b981', bg: '#dcfce7' },
  'image/gif': { label: 'GIF', color: '#10b981', bg: '#dcfce7' },
};
const ACCEPTED_TYPES = Object.keys(FILE_TYPES).join(',');
const MAX_SIZE_MB = 20;

const FileBadge = ({ type, label }) => {
  const t = FILE_TYPES[type] || { label: 'FILE', color: '#64748b', bg: '#f1f5f9' };
  return <span style={{ background: t.bg, color: t.color, padding: '3px 10px', borderRadius: '6px', fontSize: '11px', fontWeight: 800 }}>{t.label}</span>;
};

const AssignmentsTab = ({ assignments, onSubmit }) => {
  const [expandedId, setExpandedId] = useState(null);
  const [content, setContent] = useState('');
  const [file, setFile] = useState(null);
  const [dragging, setDragging] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState('');
  const [done, setDone] = useState({});
  const fileInputRef = useRef(null);

  if (assignments.length === 0) return <EmptyState icon={FileText} title="No Assignments" message="No assignments have been posted yet." />;

  const resetForm = () => { setContent(''); setFile(null); setSubmitError(''); };

  const handleFileSelect = (selected) => {
    if (!selected) return;
    if (selected.size > MAX_SIZE_MB * 1024 * 1024) {
      setSubmitError(`File too large. Max size is ${MAX_SIZE_MB} MB.`);
      return;
    }
    setFile(selected);
    setSubmitError('');
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragging(false);
    handleFileSelect(e.dataTransfer.files?.[0]);
  };

  const handleSubmit = async (e, assignmentId) => {
    e.preventDefault();
    if (!content.trim() && !file) {
      setSubmitError('Please provide a text answer or upload a file.');
      return;
    }
    setSubmitting(true);
    setSubmitError('');
    try {
      await onSubmit(assignmentId, content, file);
      setDone(p => ({ ...p, [assignmentId]: true }));
      resetForm();
      setExpandedId(null);
    } catch (err) {
      setSubmitError(err?.message || 'Submission failed. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
      {assignments.map(a => {
        const sub = a.Submissions?.[0];
        const isOpen = expandedId === a.id;
        const isDone = sub || done[a.id];
        const isOverdue = a.dueDate && new Date(a.dueDate) < new Date() && !isDone;

        return (
          <div key={a.id} style={{
            background: '#fff',
            border: `1.5px solid ${isOpen ? '#6366f1' : isOverdue ? '#fca5a5' : '#e2e8f0'}`,
            borderRadius: '16px', overflow: 'hidden', transition: 'all 0.25s',
            boxShadow: isOpen ? '0 8px 24px rgba(99,102,241,0.12)' : '0 1px 4px rgba(0,0,0,0.04)'
          }}>

            {/* ── Card Header ── */}
            <div onClick={() => { setExpandedId(isOpen ? null : a.id); resetForm(); }}
              style={{ padding: '20px 24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', cursor: 'pointer', background: isOpen ? 'linear-gradient(to right, #fafbff, #f5f3ff)' : '#fff' }}>

              <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                <div style={{ width: '46px', height: '46px', borderRadius: '12px', background: isDone ? '#dcfce7' : isOverdue ? '#fee2e2' : '#eff6ff', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  {isDone
                    ? <CheckCircle size={24} color="#16a34a" />
                    : isOverdue ? <AlertCircle size={24} color="#dc2626" />
                    : <FileText size={24} color="#6366f1" />}
                </div>
                <div>
                  <p style={{ margin: 0, fontWeight: 700, fontSize: '15px', color: '#0f172a', lineHeight: 1.3 }}>{a.title}</p>
                  <div style={{ display: 'flex', gap: '8px', marginTop: '6px', alignItems: 'center', flexWrap: 'wrap' }}>
                    <span style={{ background: '#f1f5f9', color: '#475569', padding: '2px 10px', borderRadius: '20px', fontSize: '12px', fontWeight: 600 }}>
                      <Award size={10} style={{ marginRight: '3px', verticalAlign: 'middle' }} />{a.totalPoints} pts
                    </span>
                    {a.dueDate && (
                      <span style={{ background: isOverdue ? '#fee2e2' : '#fef9c3', color: isOverdue ? '#dc2626' : '#a16207', padding: '2px 10px', borderRadius: '20px', fontSize: '12px', fontWeight: 600 }}>
                        <Clock size={10} style={{ marginRight: '3px', verticalAlign: 'middle' }} />
                        {isOverdue ? 'Overdue · ' : 'Due '}
                        {fmtDate(a.dueDate)}
                      </span>
                    )}
                  </div>
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexShrink: 0 }}>
                {sub ? (
                  <span style={{
                    display: 'flex', alignItems: 'center', gap: '6px', padding: '7px 16px', borderRadius: '20px',
                    background: sub.status === 'graded' ? '#eff6ff' : '#dcfce7',
                    color: sub.status === 'graded' ? '#2563eb' : '#16a34a',
                    fontSize: '13px', fontWeight: 700
                  }}>
                    <CheckCircle size={15} />
                    {sub.status === 'graded' ? `Graded · ${sub.score}/${a.totalPoints}` : 'Submitted'}
                  </span>
                ) : (
                  <span style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '7px 16px', borderRadius: '20px', background: isOverdue ? '#fee2e2' : '#fef3c7', color: isOverdue ? '#dc2626' : '#d97706', fontSize: '13px', fontWeight: 700 }}>
                    <Clock size={14} />{isOverdue ? 'Overdue' : 'Pending'}
                  </span>
                )}
                <div style={{ color: '#94a3b8', transition: 'transform 0.2s', transform: isOpen ? 'rotate(180deg)' : 'none' }}>
                  <ChevronDown size={18} />
                </div>
              </div>
            </div>

            {/* ── Expanded Body ── */}
            {isOpen && (
              <div style={{ borderTop: '1px solid #f1f5f9' }}>

                {/* Description + file link */}
                <div style={{ padding: '20px 24px', background: '#fafbff' }}>
                  {a.description && <p style={{ margin: '0 0 14px', color: '#475569', fontSize: '14px', lineHeight: 1.75 }}>{a.description}</p>}
                  {a.fileUrl && (
                    <a href={`http://localhost:5000${a.fileUrl}`} target="_blank" rel="noopener noreferrer"
                      style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '9px 18px', background: '#eff6ff', color: '#3b82f6', border: '1px solid #bfdbfe', borderRadius: '10px', textDecoration: 'none', fontWeight: 600, fontSize: '13px' }}>
                      <ExternalLink size={14} /> View Assignment Brief
                    </a>
                  )}
                </div>

                {/* Already submitted → show submission */}
                {sub ? (
                  <div style={{ padding: '0 24px 24px' }}>
                    <p style={{ margin: '0 0 12px', fontWeight: 700, color: '#0f172a', fontSize: '14px' }}>Your Submission</p>
                    <div style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '12px', padding: '18px' }}>
                      {sub.fileUrl && (
                        <a href={`http://localhost:5000${sub.fileUrl}`} target="_blank" rel="noopener noreferrer"
                          style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', marginBottom: sub.content ? '12px' : 0, padding: '9px 18px', background: 'linear-gradient(135deg, #eff6ff, #e0e7ff)', color: '#4f46e5', border: '1px solid #c7d2fe', borderRadius: '10px', textDecoration: 'none', fontWeight: 700, fontSize: '13px' }}>
                          <ExternalLink size={14} /> View Submitted File
                        </a>
                      )}
                      {sub.content && <p style={{ margin: 0, whiteSpace: 'pre-wrap', color: '#374151', fontSize: '14px', lineHeight: 1.7 }}>{sub.content}</p>}
                      <p style={{ margin: '12px 0 0', fontSize: '12px', color: '#94a3b8' }}>Submitted {fmtTime(sub.submittedAt)}</p>
                    </div>
                    {sub.status === 'graded' && (
                      <div style={{ marginTop: '14px', padding: '14px 18px', background: 'linear-gradient(to right, #eff6ff, #e0e7ff)', borderRadius: '12px', border: '1px solid #c7d2fe', display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <Award size={20} color="#4f46e5" />
                        <div>
                          <span style={{ fontWeight: 800, color: '#2563eb', fontSize: '20px' }}>{sub.score}</span>
                          <span style={{ color: '#64748b', fontSize: '14px' }}>/{a.totalPoints} points</span>
                          <p style={{ margin: '2px 0 0', fontSize: '12px', color: '#64748b' }}>{Math.round((sub.score / a.totalPoints) * 100)}%</p>
                        </div>
                      </div>
                    )}
                  </div>
                ) : (
                  /* ── Submit Form ── */
                  <form onSubmit={e => handleSubmit(e, a.id)} style={{ padding: '0 24px 24px' }}>
                    <p style={{ margin: '0 0 16px', fontWeight: 700, color: '#0f172a', fontSize: '15px' }}>📤 Submit Your Work</p>

                    {/* Text Answer */}
                    <div style={{ marginBottom: '16px' }}>
                      <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#374151', marginBottom: '8px' }}>
                        Text Answer <span style={{ color: '#94a3b8', fontWeight: 400 }}>(optional if you upload a file)</span>
                      </label>
                      <textarea
                        value={content}
                        onChange={e => setContent(e.target.value)}
                        placeholder="Type your answer here..."
                        rows={4}
                        style={{ width: '100%', padding: '14px', border: '1.5px solid #e2e8f0', borderRadius: '12px', fontSize: '14px', fontFamily: 'inherit', resize: 'vertical', outline: 'none', boxSizing: 'border-box', lineHeight: 1.7, color: '#374151', transition: 'border-color 0.2s' }}
                        onFocus={e => e.target.style.borderColor = '#6366f1'}
                        onBlur={e => e.target.style.borderColor = '#e2e8f0'}
                      />
                    </div>

                    {/* File Upload Zone */}
                    <div style={{ marginBottom: '16px' }}>
                      <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#374151', marginBottom: '8px' }}>
                        File Upload <span style={{ color: '#94a3b8', fontWeight: 400 }}>(PDF, Word, PPT, TXT, Images, ZIP — max {MAX_SIZE_MB}MB)</span>
                      </label>

                      {!file ? (
                        <div
                          onClick={() => fileInputRef.current?.click()}
                          onDragOver={e => { e.preventDefault(); setDragging(true); }}
                          onDragLeave={() => setDragging(false)}
                          onDrop={handleDrop}
                          style={{
                            border: `2px dashed ${dragging ? '#6366f1' : '#cbd5e1'}`,
                            borderRadius: '14px', padding: '36px 20px', textAlign: 'center', cursor: 'pointer',
                            background: dragging ? '#f5f3ff' : '#f8fafc', transition: 'all 0.2s'
                          }}
                        >
                          <div style={{ width: '52px', height: '52px', borderRadius: '14px', background: 'linear-gradient(135deg, #eff6ff, #e0e7ff)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 12px' }}>
                            <Download size={26} color="#6366f1" />
                          </div>
                          <p style={{ margin: '0 0 4px', fontWeight: 700, color: '#374151', fontSize: '15px' }}>
                            {dragging ? 'Drop your file here' : 'Drag & drop or click to upload'}
                          </p>
                          <p style={{ margin: 0, fontSize: '12px', color: '#94a3b8' }}>Supported: PDF, Word, PowerPoint, TXT, Images, ZIP</p>
                        </div>
                      ) : (
                        <div style={{ border: '1.5px solid #a5b4fc', borderRadius: '14px', padding: '16px 20px', background: '#f5f3ff', display: 'flex', alignItems: 'center', gap: '14px' }}>
                          <div style={{ width: '46px', height: '46px', borderRadius: '10px', background: (FILE_TYPES[file.type] || {}).bg || '#f1f5f9', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                            <FileText size={22} color={(FILE_TYPES[file.type] || {}).color || '#64748b'} />
                          </div>
                          <div style={{ flex: 1, minWidth: 0 }}>
                            <p style={{ margin: 0, fontWeight: 700, color: '#0f172a', fontSize: '14px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{file.name}</p>
                            <div style={{ display: 'flex', gap: '8px', marginTop: '4px', alignItems: 'center' }}>
                              <FileBadge type={file.type} />
                              <span style={{ fontSize: '12px', color: '#94a3b8' }}>{(file.size / 1024 / 1024).toFixed(2)} MB</span>
                            </div>
                          </div>
                          <button type="button" onClick={() => setFile(null)}
                            style={{ padding: '6px 12px', background: '#fee2e2', color: '#dc2626', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 700, fontSize: '12px', flexShrink: 0 }}>
                            Remove
                          </button>
                        </div>
                      )}

                      <input ref={fileInputRef} type="file" accept={ACCEPTED_TYPES} style={{ display: 'none' }}
                        onChange={e => handleFileSelect(e.target.files?.[0])} />
                    </div>

                    {/* Error */}
                    {submitError && (
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '12px 16px', background: '#fee2e2', border: '1px solid #fca5a5', borderRadius: '10px', marginBottom: '14px' }}>
                        <AlertCircle size={16} color="#dc2626" />
                        <span style={{ fontSize: '13px', color: '#dc2626', fontWeight: 600 }}>{submitError}</span>
                      </div>
                    )}

                    {/* Actions */}
                    <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
                      <button type="button" onClick={() => { setExpandedId(null); resetForm(); }}
                        style={{ padding: '11px 22px', background: '#fff', border: '1.5px solid #e2e8f0', color: '#64748b', borderRadius: '10px', fontWeight: 600, cursor: 'pointer', fontSize: '14px' }}>
                        Cancel
                      </button>
                      <button type="submit"
                        disabled={submitting || (!content.trim() && !file)}
                        style={{
                          padding: '11px 28px', border: 'none', borderRadius: '10px', fontWeight: 700, fontSize: '14px', cursor: submitting || (!content.trim() && !file) ? 'not-allowed' : 'pointer',
                          background: submitting || (!content.trim() && !file) ? '#e2e8f0' : 'linear-gradient(135deg, #6366f1, #8b5cf6)',
                          color: submitting || (!content.trim() && !file) ? '#94a3b8' : '#fff',
                          boxShadow: (content.trim() || file) && !submitting ? '0 4px 14px rgba(99,102,241,0.35)' : 'none',
                          display: 'flex', alignItems: 'center', gap: '8px', transition: 'all 0.2s'
                        }}>
                        {submitting ? (
                          <><div style={{ width: '16px', height: '16px', border: '2px solid rgba(255,255,255,0.4)', borderTop: '2px solid #fff', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} /> Submitting...</>
                        ) : (
                          <><Send size={16} /> Submit Assignment</>
                        )}
                      </button>
                    </div>
                  </form>
                )}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};

// ── Quizzes Tab ───────────────────────────────────────────
const QuizzesTab = ({ quizzes, token, navigate }) => {
  const [attempts, setAttempts] = useState({});

  useEffect(() => {
    quizzes.forEach(async (q) => {
      try {
        const res = await axios.get(`${API}/quizzes/${q.id}/attempt`, { headers: { Authorization: `Bearer ${token}` } });
        if (res.data) setAttempts(p => ({ ...p, [q.id]: res.data }));
      } catch { /* ignore */ }
    });
  }, [quizzes, token]);

  if (quizzes.length === 0) return <EmptyState icon={CheckCircle} title="No Quizzes" message="No quizzes have been created for this course yet." />;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
      {quizzes.map(q => {
        const attempt = attempts[q.id];
        const pct = attempt ? Math.round((attempt.score / attempt.totalQuestions) * 100) : null;
        const passed = pct !== null && pct >= 60;

        return (
          <div key={q.id} style={{ background: '#fff', border: '1.5px solid #e2e8f0', borderRadius: '14px', padding: '22px 24px', display: 'flex', alignItems: 'center', gap: '16px', boxShadow: '0 1px 4px rgba(0,0,0,0.05)' }}>
            <div style={{ width: '50px', height: '50px', borderRadius: '12px', background: attempt ? (passed ? '#dcfce7' : '#fef3c7') : 'linear-gradient(135deg, #eff6ff, #e0e7ff)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <CheckCircle size={26} color={attempt ? (passed ? '#16a34a' : '#d97706') : '#6366f1'} />
            </div>
            <div style={{ flex: 1 }}>
              <p style={{ margin: 0, fontWeight: 700, fontSize: '15px', color: '#0f172a' }}>{q.title}</p>
              {q.description && <p style={{ margin: '3px 0 6px', fontSize: '13px', color: '#64748b' }}>{q.description}</p>}
              <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                <span style={{ background: '#f1f5f9', color: '#475569', padding: '2px 10px', borderRadius: '20px', fontSize: '12px', fontWeight: 600 }}>
                  <Clock size={11} style={{ marginRight: '4px', verticalAlign: 'middle' }} />{q.timeLimitMinutes || '—'} mins
                </span>
                <span style={{ background: '#f1f5f9', color: '#475569', padding: '2px 10px', borderRadius: '20px', fontSize: '12px', fontWeight: 600 }}>
                  {q.Questions?.length || 0} questions
                </span>
                {q.dueDate && <span style={{ background: '#fef9c3', color: '#a16207', padding: '2px 10px', borderRadius: '20px', fontSize: '12px', fontWeight: 600 }}>Due {fmtDate(q.dueDate)}</span>}
              </div>
            </div>
            <div style={{ flexShrink: 0, textAlign: 'right' }}>
              {attempt ? (
                <div>
                  <div style={{ fontSize: '22px', fontWeight: 800, color: passed ? '#16a34a' : '#d97706' }}>{pct}%</div>
                  <div style={{ fontSize: '12px', color: '#94a3b8' }}>{attempt.score}/{attempt.totalQuestions} correct</div>
                  <button onClick={() => navigate(`/quiz/${q.id}`)}
                    style={{ marginTop: '8px', padding: '6px 14px', background: '#f1f5f9', color: '#64748b', border: 'none', borderRadius: '8px', fontWeight: 600, cursor: 'pointer', fontSize: '12px' }}>
                    View Result
                  </button>
                </div>
              ) : (
                <button onClick={() => navigate(`/quiz/${q.id}`)}
                  style={{ padding: '10px 22px', background: 'linear-gradient(135deg, #10b981, #059669)', color: '#fff', border: 'none', borderRadius: '10px', fontWeight: 700, cursor: 'pointer', fontSize: '14px', boxShadow: '0 4px 12px rgba(16,185,129,0.25)', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <Play size={15} fill="white" /> Take Quiz
                </button>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
};

// ── Discussion Tab ────────────────────────────────────────
const DiscussionTab = ({ courseId, user, token }) => {
  const [posts, setPosts] = useState([]);
  const [newPost, setNewPost] = useState('');
  const [posting, setPosting] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Load from localStorage as a simple local discussion board
    const stored = JSON.parse(localStorage.getItem(`discussion_${courseId}`) || '[]');
    setPosts(stored);
    setLoading(false);
  }, [courseId]);

  const handlePost = () => {
    if (!newPost.trim()) return;
    setPosting(true);
    const post = {
      id: Date.now(),
      author: user?.name || 'Anonymous',
      avatar: user?.avatar || `https://i.pravatar.cc/150?u=${user?.id}`,
      body: newPost.trim(),
      createdAt: new Date().toISOString(),
      replies: []
    };
    const updated = [post, ...posts];
    setPosts(updated);
    localStorage.setItem(`discussion_${courseId}`, JSON.stringify(updated));
    setNewPost('');
    setPosting(false);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      {/* Compose */}
      <div style={{ background: '#fff', border: '1.5px solid #e2e8f0', borderRadius: '14px', padding: '20px' }}>
        <div style={{ display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
          <img src={user?.avatar || `https://i.pravatar.cc/150?u=${user?.id}`} alt="" style={{ width: '40px', height: '40px', borderRadius: '50%', objectFit: 'cover', flexShrink: 0 }} />
          <div style={{ flex: 1 }}>
            <textarea
              value={newPost}
              onChange={e => setNewPost(e.target.value)}
              placeholder="Share a question or thought with your classmates..."
              rows={3}
              style={{ width: '100%', padding: '12px 14px', border: '1.5px solid #e2e8f0', borderRadius: '10px', fontSize: '14px', fontFamily: 'inherit', resize: 'none', outline: 'none', boxSizing: 'border-box', lineHeight: 1.6 }}
              onFocus={e => e.target.style.borderColor = '#6366f1'}
              onBlur={e => e.target.style.borderColor = '#e2e8f0'}
            />
            <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '10px' }}>
              <button onClick={handlePost} disabled={!newPost.trim() || posting}
                style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '10px 22px', background: newPost.trim() ? 'linear-gradient(135deg, #6366f1, #8b5cf6)' : '#e2e8f0', color: newPost.trim() ? '#fff' : '#94a3b8', border: 'none', borderRadius: '10px', fontWeight: 700, cursor: newPost.trim() ? 'pointer' : 'not-allowed', fontSize: '14px' }}>
                <Send size={15} /> Post
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Posts */}
      {loading ? (
        <p style={{ textAlign: 'center', color: '#94a3b8' }}>Loading...</p>
      ) : posts.length === 0 ? (
        <EmptyState icon={MessageSquare} title="No Posts Yet" message="Be the first to start a discussion!" />
      ) : (
        posts.map(p => (
          <div key={p.id} style={{ background: '#fff', border: '1.5px solid #e2e8f0', borderRadius: '14px', padding: '20px' }}>
            <div style={{ display: 'flex', gap: '12px' }}>
              <img src={p.avatar} alt="" style={{ width: '40px', height: '40px', borderRadius: '50%', objectFit: 'cover', flexShrink: 0 }} />
              <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                  <span style={{ fontWeight: 700, color: '#0f172a', fontSize: '14px' }}>{p.author}</span>
                  <span style={{ fontSize: '12px', color: '#94a3b8' }}>{new Date(p.createdAt).toLocaleDateString()}</span>
                </div>
                <p style={{ margin: 0, color: '#374151', fontSize: '14px', lineHeight: 1.7 }}>{p.body}</p>
              </div>
            </div>
          </div>
        ))
      )}
    </div>
  );
};

/* ─── Main Component ──────────────────────────────────────────────── */
const CourseWorkspace = () => {
  const [activeTab, setActiveTab] = useState('Overview');
  const [noteContent, setNoteContent] = useState('');
  const [noteSaved, setNoteSaved] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { id } = useParams();
  const navigate = useNavigate();
  const { user, token } = useAuthStore();
  const { currentCourse, fetchCourseById, fetchCourseWorkspaceData, courseAssignments, courseMaterials, courseQuizzes, submitAssignment, isLoading } = useCourseStore();

  useEffect(() => {
    if (id) {
      fetchCourseById(id);
      fetchCourseWorkspaceData(id);
    }
  }, [id, fetchCourseById, fetchCourseWorkspaceData]);

  // Persist notes per course
  useEffect(() => {
    if (id) setNoteContent(localStorage.getItem(`notes_${id}`) || '');
  }, [id]);

  const saveNote = () => {
    localStorage.setItem(`notes_${id}`, noteContent);
    setNoteSaved(true);
    setTimeout(() => setNoteSaved(false), 2000);
  };

  const handleSubmitAssignment = async (assignmentId, content, file) => {
    setIsSubmitting(true);
    try {
      await submitAssignment(assignmentId, content, file);
      await fetchCourseWorkspaceData(id);
    } finally {
      setIsSubmitting(false);
    }
  };

  const pendingCount = courseAssignments.filter(a => !a.Submissions?.[0]).length;
  const unreadQuizCount = courseQuizzes.length;

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: '#f1f5f9', fontFamily: "'Inter', -apple-system, sans-serif" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap');
        @keyframes spin { to { transform: rotate(360deg); } }
        @keyframes fadeUp { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
        .tab-btn:hover { background: rgba(99,102,241,0.08) !important; color: #4f46e5 !important; }
        .resource-link:hover { opacity: 0.85; transform: translateX(2px); }
      `}</style>

      {/* ── Narrow icon sidebar ── */}
      <aside style={{ width: '72px', background: 'linear-gradient(180deg, #0f172a 0%, #1e293b 100%)', display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '20px 0', gap: '8px', flexShrink: 0 }}>
        <div onClick={() => navigate('/dashboard')} style={{ width: '40px', height: '40px', background: 'linear-gradient(135deg, #6366f1, #8b5cf6)', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', marginBottom: '20px' }}>
          <Zap size={20} color="#fff" fill="white" />
        </div>
        {[
          { icon: Home, label: 'Home', action: () => navigate('/dashboard') },
          { icon: BookOpen, label: 'Materials', action: () => setActiveTab('Materials') },
          { icon: FileText, label: 'Assignments', action: () => setActiveTab('Assignments') },
          { icon: CheckCircle, label: 'Quizzes', action: () => setActiveTab('Quizzes') },
        ].map(({ icon: Ic, label, action }) => (
          <div key={label} onClick={action} title={label}
            style={{ width: '44px', height: '44px', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: '#64748b', transition: 'all 0.2s' }}
            onMouseOver={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.1)'; e.currentTarget.style.color = '#fff'; }}
            onMouseOut={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = '#64748b'; }}
          >
            <Ic size={20} />
          </div>
        ))}
        <div style={{ flex: 1 }} />
        <img src={user?.avatar || `https://i.pravatar.cc/150?u=${user?.id}`} alt="" style={{ width: '36px', height: '36px', borderRadius: '50%', objectFit: 'cover', border: '2px solid #374151', marginBottom: '16px' }} />
      </aside>

      {/* ── Main ── */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>

        {/* Top Bar */}
        <header style={{ height: '64px', background: '#fff', borderBottom: '1px solid #e2e8f0', display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 28px', flexShrink: 0, boxShadow: '0 1px 4px rgba(0,0,0,0.05)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
            <button onClick={() => navigate(-1)} style={{ display: 'flex', alignItems: 'center', gap: '6px', background: '#f8fafc', border: '1px solid #e2e8f0', color: '#64748b', padding: '7px 14px', borderRadius: '8px', cursor: 'pointer', fontWeight: 600, fontSize: '13px' }}>
              <ArrowLeft size={15} /> Back
            </button>
            <div style={{ height: '24px', width: '1px', background: '#e2e8f0' }} />
            {isLoading ? (
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#94a3b8', fontSize: '14px' }}>
                <Loader size={16} style={{ animation: 'spin 1s linear infinite' }} /> Loading...
              </div>
            ) : (
              <div>
                <p style={{ margin: 0, fontWeight: 700, color: '#0f172a', fontSize: '16px' }}>{currentCourse?.title || 'Course Workspace'}</p>
                {currentCourse?.category && <p style={{ margin: 0, fontSize: '12px', color: '#94a3b8' }}>{currentCourse.category}</p>}
              </div>
            )}
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            {pendingCount > 0 && (
              <span style={{ background: '#fef3c7', color: '#d97706', padding: '5px 12px', borderRadius: '20px', fontSize: '12px', fontWeight: 700 }}>
                {pendingCount} pending
              </span>
            )}
            <img src={user?.avatar || `https://i.pravatar.cc/150?u=${user?.id}`} alt="" style={{ width: '36px', height: '36px', borderRadius: '50%', objectFit: 'cover', border: '2px solid #6366f1' }} />
          </div>
        </header>

        {/* Body */}
        <div style={{ flex: 1, display: 'flex', overflow: 'hidden' }}>

          {/* Left: Tab content */}
          <main style={{ flex: 1, overflowY: 'auto', padding: '28px 32px' }}>

            {/* Tabs */}
            <div style={{ display: 'flex', gap: '4px', background: '#fff', border: '1px solid #e2e8f0', borderRadius: '14px', padding: '6px', marginBottom: '24px', width: 'fit-content' }}>
              {TABS.map(({ key, icon: Ic, label }) => {
                const isActive = activeTab === key;
                const badge = key === 'Assignments' ? pendingCount : key === 'Quizzes' ? unreadQuizCount : 0;
                return (
                  <button key={key} className="tab-btn" onClick={() => setActiveTab(key)}
                    style={{ display: 'flex', alignItems: 'center', gap: '7px', padding: '9px 18px', borderRadius: '10px', border: 'none', cursor: 'pointer', fontWeight: isActive ? 700 : 500, fontSize: '13px', background: isActive ? 'linear-gradient(135deg, #6366f1, #8b5cf6)' : 'transparent', color: isActive ? '#fff' : '#64748b', position: 'relative', transition: 'all 0.15s', boxShadow: isActive ? '0 4px 12px rgba(99,102,241,0.25)' : 'none' }}
                  >
                    <Ic size={16} /> {label}
                    {badge > 0 && !isActive && (
                      <span style={{ background: '#ef4444', color: '#fff', borderRadius: '50%', width: '18px', height: '18px', fontSize: '10px', fontWeight: 800, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>{badge}</span>
                    )}
                  </button>
                );
              })}
            </div>

            {/* Tab Content */}
            <div style={{ animation: 'fadeUp 0.25s ease' }} key={activeTab}>
              {isLoading && !currentCourse ? (
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '300px', color: '#94a3b8', gap: '12px' }}>
                  <Loader size={28} style={{ animation: 'spin 1s linear infinite' }} />
                  <span style={{ fontSize: '16px' }}>Loading course data...</span>
                </div>
              ) : (
                <>
                  {activeTab === 'Overview' && <OverviewTab course={currentCourse} assignments={courseAssignments} materials={courseMaterials} quizzes={courseQuizzes} />}
                  {activeTab === 'Materials' && <MaterialsTab materials={courseMaterials} />}
                  {activeTab === 'Assignments' && <AssignmentsTab assignments={courseAssignments} onSubmit={handleSubmitAssignment} />}
                  {activeTab === 'Quizzes' && <QuizzesTab quizzes={courseQuizzes} token={token} navigate={navigate} />}
                  {activeTab === 'Discussion' && <DiscussionTab courseId={id} user={user} token={token} />}
                </>
              )}
            </div>
          </main>

          {/* Right Sidebar */}
          <aside style={{ width: '320px', background: '#fff', borderLeft: '1px solid #e2e8f0', display: 'flex', flexDirection: 'column', flexShrink: 0, overflowY: 'auto' }}>

            {/* Course Info Card */}
            <div style={{ padding: '24px', borderBottom: '1px solid #f1f5f9' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px' }}>
                <div style={{ width: '40px', height: '40px', borderRadius: '10px', background: 'linear-gradient(135deg, #6366f1, #8b5cf6)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <BookOpen size={20} color="#fff" />
                </div>
                <div>
                  <p style={{ margin: 0, fontWeight: 700, fontSize: '14px', color: '#0f172a' }}>{currentCourse?.title || '—'}</p>
                  <p style={{ margin: 0, fontSize: '12px', color: '#94a3b8' }}>{currentCourse?.category}</p>
                </div>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
                {[
                  { label: 'Materials', val: courseMaterials.length },
                  { label: 'Quizzes', val: courseQuizzes.length },
                  { label: 'Assignments', val: courseAssignments.length },
                  { label: 'Pending', val: pendingCount },
                ].map(s => (
                  <div key={s.label} style={{ background: '#f8fafc', borderRadius: '10px', padding: '10px 12px', textAlign: 'center' }}>
                    <p style={{ margin: 0, fontWeight: 800, fontSize: '18px', color: '#6366f1' }}>{s.val}</p>
                    <p style={{ margin: 0, fontSize: '11px', color: '#94a3b8' }}>{s.label}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Notes */}
            <div style={{ padding: '20px 24px', borderBottom: '1px solid #f1f5f9', flex: 1 }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
                <p style={{ margin: 0, fontWeight: 700, fontSize: '14px', color: '#0f172a' }}>📝 My Notes</p>
                {noteSaved && <span style={{ fontSize: '12px', color: '#16a34a', fontWeight: 600 }}>✓ Saved!</span>}
              </div>
              <div style={{ border: '1.5px solid #e2e8f0', borderRadius: '10px', overflow: 'hidden', marginBottom: '10px' }}>
                <div style={{ display: 'flex', gap: '8px', padding: '8px 12px', background: '#f8fafc', borderBottom: '1px solid #e2e8f0' }}>
                  {[Bold, Italic, Underline, List].map((Ic, i) => (
                    <Ic key={i} size={14} style={{ color: '#94a3b8', cursor: 'pointer' }} />
                  ))}
                </div>
                <textarea
                  value={noteContent}
                  onChange={e => setNoteContent(e.target.value)}
                  placeholder="Jot down your thoughts, key points, or questions..."
                  style={{ width: '100%', height: '140px', padding: '12px', border: 'none', resize: 'none', outline: 'none', fontSize: '13px', fontFamily: 'inherit', lineHeight: 1.7, boxSizing: 'border-box', color: '#374151' }}
                />
              </div>
              <button onClick={saveNote}
                style={{ width: '100%', padding: '10px', background: 'linear-gradient(135deg, #6366f1, #8b5cf6)', color: '#fff', border: 'none', borderRadius: '10px', fontWeight: 700, cursor: 'pointer', fontSize: '13px', boxShadow: '0 2px 8px rgba(99,102,241,0.25)' }}>
                Save Notes
              </button>
            </div>

            {/* Quick Resources */}
            {courseMaterials.length > 0 && (
              <div style={{ padding: '20px 24px', borderBottom: '1px solid #f1f5f9' }}>
                <p style={{ margin: '0 0 12px', fontWeight: 700, fontSize: '14px', color: '#0f172a' }}>📚 Quick Resources</p>
                {courseMaterials.slice(0, 4).map(m => {
                  const url = m.fileUrl?.startsWith('/') ? `http://localhost:5000${m.fileUrl}` : m.fileUrl;
                  return (
                    <a key={m.id} href={url} target="_blank" rel="noopener noreferrer" className="resource-link"
                      style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 0', borderBottom: '1px solid #f8fafc', textDecoration: 'none', transition: 'all 0.15s' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <div style={{ width: '32px', height: '32px', borderRadius: '8px', background: '#eff6ff', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                          {m.type === 'Video' ? <Play size={14} color="#3b82f6" /> : <FileText size={14} color="#3b82f6" />}
                        </div>
                        <span style={{ fontSize: '13px', fontWeight: 600, color: '#374151', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: '160px' }}>{m.title}</span>
                      </div>
                      <ExternalLink size={13} color="#94a3b8" />
                    </a>
                  );
                })}
              </div>
            )}

            {/* AI Tutor CTA */}
            <div style={{ padding: '20px 24px' }}>
              <div onClick={() => navigate('/ai-assistant')}
                style={{ background: 'linear-gradient(135deg, #1e293b, #0f172a)', borderRadius: '14px', padding: '20px', cursor: 'pointer', border: '1px solid rgba(99,102,241,0.2)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '10px' }}>
                  <div style={{ width: '36px', height: '36px', borderRadius: '50%', background: 'linear-gradient(135deg, #6366f1, #8b5cf6)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Zap size={18} color="#fff" fill="white" />
                  </div>
                  <div>
                    <p style={{ margin: 0, fontWeight: 700, color: '#fff', fontSize: '13px' }}>AI Tutor</p>
                    <p style={{ margin: 0, fontSize: '11px', color: '#64748b' }}>Ask anything about this course</p>
                  </div>
                </div>
                <p style={{ margin: '0 0 12px', fontSize: '12px', color: '#94a3b8', lineHeight: 1.6 }}>Get instant explanations, summaries, and help with assignments.</p>
                <button style={{ width: '100%', padding: '9px', background: 'linear-gradient(135deg, #6366f1, #8b5cf6)', color: '#fff', border: 'none', borderRadius: '8px', fontWeight: 700, cursor: 'pointer', fontSize: '13px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}>
                  <MessageSquare size={14} /> Open AI Tutor
                </button>
              </div>
            </div>

          </aside>
        </div>
      </div>
    </div>
  );
};

export default CourseWorkspace;
