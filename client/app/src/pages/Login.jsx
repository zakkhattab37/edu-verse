import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import useAuthStore from '../store/authStore';
import { BookOpen, GraduationCap, User, Settings, IdCard, Phone, ChevronDown } from 'lucide-react';
import './Login.css';

const CATEGORIES = [
  'Computer Science', 'Data Science', 'Mathematics', 'Design',
  'Business', 'Languages', 'Engineering', 'Arts'
];
const YEARS = ['First', 'Second', 'Third', 'Fourth'];

const Login = () => {
  const [isRegister, setIsRegister] = useState(false);
  const [role, setRole] = useState('Student');

  // Common fields
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  // Student-specific fields
  const [studentId, setStudentId] = useState('');
  const [category, setCategory] = useState('');
  const [academicYear, setAcademicYear] = useState('');
  const [phone, setPhone] = useState('');

  const [agreed, setAgreed] = useState(false);

  const { login, register, isLoading, error: storeError } = useAuthStore();
  const [localError, setLocalError] = useState('');
  const navigate = useNavigate();

  const isStudent = role === 'Student';

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLocalError('');

    if (isRegister) {
      if (password !== confirmPassword) {
        setLocalError('Passwords do not match');
        return;
      }
      if (isStudent && !studentId.trim()) {
        setLocalError('Student ID / Record number is required');
        return;
      }
      try {
        const extras = isStudent
          ? { studentId, category, academicYear, phone }
          : {};
        await register(fullName, email, password, role, extras);
        await login(email, password);
        navigate('/welcome');
      } catch (err) {
        // Error surfaced via storeError
      }
    } else {
      try {
        await login(email, password);
        navigate('/welcome');
      } catch (err) {
        // Error surfaced via storeError
      }
    }
  };

  const switchMode = (toRegister) => {
    setIsRegister(toRegister);
    setLocalError('');
    setStudentId(''); setCategory(''); setAcademicYear(''); setPhone('');
    setFullName(''); setEmail(''); setPassword(''); setConfirmPassword('');
  };

  return (
    <div className="login-container">
      <div className="login-background" />
      <div className="login-overlay" />

      <div className="auth-card" style={{ maxWidth: isRegister && isStudent ? '520px' : '460px' }}>

        {/* Header */}
        <div className="auth-header">
          <div className="auth-logo-container">
            <BookOpen size={28} color="#3182ce" />
            <span className="auth-logo-text">EDUVERSE</span>
          </div>
          <h2 className="auth-subtitle">AI-Powered LMS</h2>
        </div>

        {/* Toggle */}
        <div className="auth-toggle">
          <button onClick={() => switchMode(false)} className={`auth-toggle-btn ${!isRegister ? 'active' : ''}`}>
            Log In
          </button>
          <button onClick={() => switchMode(true)} className={`auth-toggle-btn ${isRegister ? 'active' : ''}`}>
            Register
          </button>
        </div>

        {(storeError || localError) && (
          <div className="error-message">{storeError || localError}</div>
        )}

        <form onSubmit={handleSubmit} className="auth-form">

          {/* ── Register Only ── */}
          {isRegister && (
            <>
              {/* Role Selection */}
              <div className="role-selection">
                <p className="role-label">Select Your Role</p>
                <div className="role-cards">
                  {[
                    { role: 'Student',    icon: <GraduationCap size={22} />, desc: 'Access courses & materials' },
                    { role: 'Instructor', icon: <User size={22} />,          desc: 'Manage classes & content'  },
                    { role: 'Admin',      icon: <Settings size={22} />,      desc: 'System management'         },
                  ].map(r => (
                    <div key={r.role} onClick={() => setRole(r.role)} className={`role-card ${role === r.role ? 'active' : ''}`}>
                      <span className="role-icon">{r.icon}</span>
                      <span className="role-title">{r.role}</span>
                      <span className="role-desc">{r.desc}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Full Name */}
              <input
                type="text"
                placeholder="Full Name"
                className="form-input"
                value={fullName}
                onChange={e => setFullName(e.target.value)}
                required
              />

              {/* ── Student-only extended fields ── */}
              {isStudent && (
                <>
                  {/* Student ID */}
                  <div style={{ position: 'relative' }}>
                    <IdCard size={16} style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: '#9ca3af', pointerEvents: 'none' }} />
                    <input
                      type="text"
                      placeholder="Student ID / Record Number *"
                      className="form-input"
                      style={{ paddingLeft: '40px' }}
                      value={studentId}
                      onChange={e => setStudentId(e.target.value)}
                      required
                    />
                  </div>

                  {/* Phone */}
                  <div style={{ position: 'relative' }}>
                    <Phone size={16} style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: '#9ca3af', pointerEvents: 'none' }} />
                    <input
                      type="tel"
                      placeholder="Phone Number"
                      className="form-input"
                      style={{ paddingLeft: '40px' }}
                      value={phone}
                      onChange={e => setPhone(e.target.value)}
                    />
                  </div>

                  {/* Category + Year row */}
                  <div className="form-row">
                    <div style={{ position: 'relative', flex: 1 }}>
                      <select
                        className="form-input"
                        value={category}
                        onChange={e => setCategory(e.target.value)}
                        style={{ appearance: 'none', paddingRight: '36px', color: category ? '#111827' : '#9ca3af' }}
                      >
                        <option value="">Select a category...</option>
                        {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                      </select>
                      <ChevronDown size={15} style={{ position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)', color: '#9ca3af', pointerEvents: 'none' }} />
                    </div>

                    <div style={{ position: 'relative', flex: 1 }}>
                      <select
                        className="form-input"
                        value={academicYear}
                        onChange={e => setAcademicYear(e.target.value)}
                        style={{ appearance: 'none', paddingRight: '36px', color: academicYear ? '#111827' : '#9ca3af' }}
                      >
                        <option value="">Academic Year...</option>
                        {YEARS.map(y => <option key={y} value={y}>{y} Year</option>)}
                      </select>
                      <ChevronDown size={15} style={{ position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)', color: '#9ca3af', pointerEvents: 'none' }} />
                    </div>
                  </div>
                </>
              )}
            </>
          )}

          {/* ── Common fields ── */}
          <input
            type="email"
            placeholder={isRegister ? 'Gmail / Institutional Email' : 'Email Address'}
            className="form-input"
            value={email}
            onChange={e => setEmail(e.target.value)}
            required
          />

          <div className="form-row">
            <input
              type="password"
              placeholder="Password"
              className="form-input"
              value={password}
              onChange={e => setPassword(e.target.value)}
              required
            />
            {isRegister && (
              <input
                type="password"
                placeholder="Confirm Password"
                className="form-input"
                value={confirmPassword}
                onChange={e => setConfirmPassword(e.target.value)}
                required
              />
            )}
          </div>

          {/* Terms */}
          {isRegister && (
            <div className="terms-container">
              <input type="checkbox" id="terms" checked={agreed} onChange={e => setAgreed(e.target.checked)} required className="terms-checkbox" />
              <label htmlFor="terms" className="terms-label">I agree to the Terms of Service &amp; Privacy Policy</label>
            </div>
          )}

          <button
            type="submit"
            className="submit-btn"
            disabled={isLoading || (isRegister && !agreed)}
          >
            {isLoading ? 'Processing...' : (isRegister ? 'Create Account' : 'Log In')}
          </button>
        </form>

        <div className="auth-footer">
          {isRegister ? (
            <>Already have an account? <span className="auth-link" onClick={() => switchMode(false)}>Log In</span></>
          ) : (
            <>Don't have an account? <span className="auth-link" onClick={() => switchMode(true)}>Register</span></>
          )}
        </div>
      </div>
    </div>
  );
};

export default Login;
