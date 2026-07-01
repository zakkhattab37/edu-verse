import { useState } from 'react';
import { CheckSquare, Star } from 'lucide-react';
import useInstructorStore from '../../store/instructorStore';

const InstructorGradingTab = ({ pendingTasks, onGraded }) => {
  const [grades, setGrades] = useState({});
  const [grading, setGrading] = useState({});
  const [graded, setGraded] = useState({});
  const [error, setError] = useState({});

  const { gradeSubmission } = useInstructorStore();

  const handleGrade = async (submissionId) => {
    const score = grades[submissionId];
    if (score === undefined || score === '') { setError(e => ({ ...e, [submissionId]: 'Enter a score' })); return; }
    const numeric = Number(score);
    if (isNaN(numeric) || numeric < 0 || numeric > 100) { setError(e => ({ ...e, [submissionId]: 'Score must be 0–100' })); return; }
    setGrading(g => ({ ...g, [submissionId]: true }));
    setError(e => ({ ...e, [submissionId]: '' }));
    try {
      await gradeSubmission(submissionId, numeric);
      setGraded(g => ({ ...g, [submissionId]: true }));
      if (onGraded) onGraded();
    } catch (err) {
      setError(e => ({ ...e, [submissionId]: typeof err === 'string' ? err : 'Failed to grade' }));
    } finally {
      setGrading(g => ({ ...g, [submissionId]: false }));
    }
  };

  const scoreColor = (score) => {
    if (score >= 90) return '#059669';
    if (score >= 70) return '#d97706';
    return '#dc2626';
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      <div>
        <h2 style={{ margin: 0, fontSize: '22px', fontWeight: 700, color: '#111827' }}>Grading Queue</h2>
        <p style={{ margin: '4px 0 0', color: '#6b7280', fontSize: '14px' }}>
          {(pendingTasks || []).filter(t => !graded[t.id]).length} submission{(pendingTasks || []).filter(t => !graded[t.id]).length !== 1 ? 's' : ''} need grading
        </p>
      </div>

      {!pendingTasks || pendingTasks.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '80px 20px', background: '#fff', borderRadius: '14px', border: '1px solid #e5e7eb' }}>
          <CheckSquare size={56} style={{ color: '#a7f3d0', marginBottom: '16px' }} />
          <h3 style={{ margin: '0 0 8px', color: '#059669', fontWeight: 700 }}>All Caught Up!</h3>
          <p style={{ color: '#6b7280', fontSize: '14px' }}>No pending submissions to grade right now.</p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          {pendingTasks.map(task => {
            const isDone = graded[task.id];
            return (
              <div key={task.id} style={{ background: isDone ? '#f0fdf4' : '#fff', border: `1px solid ${isDone ? '#a7f3d0' : '#e5e7eb'}`, borderRadius: '14px', padding: '20px 24px', display: 'flex', alignItems: 'center', gap: '20px', boxShadow: '0 1px 4px rgba(0,0,0,0.06)', transition: 'all 0.3s' }}>
                {/* Avatar */}
                <img src={`https://i.pravatar.cc/150?u=${task.id}`} alt={task.studentName} style={{ width: '46px', height: '46px', borderRadius: '50%', flexShrink: 0 }} />

                {/* Info */}
                <div style={{ flex: 1 }}>
                  <p style={{ margin: '0 0 2px', fontWeight: 700, fontSize: '15px', color: '#111827' }}>{task.studentName}</p>
                  <p style={{ margin: 0, fontSize: '13px', color: '#6b7280' }}>
                    <strong style={{ color: '#374151' }}>{task.assignmentTitle}</strong> · {task.courseTitle}
                  </p>
                  <p style={{ margin: '4px 0 0', fontSize: '12px', color: '#9ca3af' }}>
                    Submitted: {task.submittedAt ? new Date(task.submittedAt).toLocaleString() : 'N/A'}
                  </p>
                </div>

                {/* Grade Input */}
                {isDone ? (
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#059669', fontWeight: 700, fontSize: '15px' }}>
                    <CheckSquare size={22} />
                    <span style={{ color: scoreColor(Number(grades[task.id])) }}>{grades[task.id]}%</span>
                    <span>Graded!</span>
                  </div>
                ) : (
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '6px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <div style={{ position: 'relative' }}>
                        <Star size={14} style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)', color: '#9ca3af' }} />
                        <input
                          type="number"
                          min="0"
                          max="100"
                          placeholder="0–100"
                          value={grades[task.id] || ''}
                          onChange={e => setGrades(g => ({ ...g, [task.id]: e.target.value }))}
                          style={{ padding: '9px 12px 9px 30px', border: `1px solid ${error[task.id] ? '#fca5a5' : '#d1d5db'}`, borderRadius: '8px', fontSize: '14px', width: '100px', outline: 'none' }}
                        />
                      </div>
                      <span style={{ color: '#9ca3af', fontSize: '13px', fontWeight: 500 }}>/ 100</span>
                      <button
                        onClick={() => handleGrade(task.id)}
                        disabled={grading[task.id]}
                        style={{ padding: '9px 20px', background: '#6366f1', color: '#fff', border: 'none', borderRadius: '8px', fontSize: '14px', fontWeight: 600, cursor: 'pointer', opacity: grading[task.id] ? 0.7 : 1, whiteSpace: 'nowrap' }}
                      >
                        {grading[task.id] ? 'Grading...' : 'Grade Now'}
                      </button>
                    </div>
                    {error[task.id] && <p style={{ margin: 0, color: '#dc2626', fontSize: '12px' }}>{error[task.id]}</p>}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default InstructorGradingTab;
