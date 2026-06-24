import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import useAuthStore from '../store/authStore';
import { BookOpen, GraduationCap, User, Settings } from 'lucide-react';
import './Login.css';

const Login = () => {
  const [isRegister, setIsRegister] = useState(true);
  const [role, setRole] = useState('Student');
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [agreed, setAgreed] = useState(false);
  
  const { login, register, isLoading, error: storeError } = useAuthStore();
  const [localError, setLocalError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLocalError('');
    
    if (isRegister) {
       if (password !== confirmPassword) {
         setLocalError('Passwords do not match');
         return;
       }
       try {
         await register(fullName, email, password, role);
         await login(email, password); 
         navigate('/dashboard');
       } catch (err) {
         // Error handled in store
       }
    } else {
       try {
         await login(email, password);
         navigate('/dashboard');
       } catch (err) {
         // Error handled in store
       }
    }
  };

  return (
    <div className="login-container">
      <div className="login-background"></div>
      <div className="login-overlay"></div>

      <div className="auth-card">
        
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
          <button 
            onClick={() => setIsRegister(false)}
            className={`auth-toggle-btn ${!isRegister ? 'active' : ''}`}
          >
            Log In
          </button>
          <button 
            onClick={() => setIsRegister(true)}
            className={`auth-toggle-btn ${isRegister ? 'active' : ''}`}
          >
            Register
          </button>
        </div>

        {(storeError || localError) && (
          <div className="error-message">
            {storeError || localError}
          </div>
        )}

        <form onSubmit={handleSubmit} className="auth-form">
          
          {isRegister && (
            <>
              <div className="role-selection">
                <p className="role-label">Select Your Role</p>
                <div className="role-cards">
                  <div 
                    onClick={() => setRole('Student')}
                    className={`role-card ${role === 'Student' ? 'active' : ''}`}
                  >
                    <GraduationCap size={24} className="role-icon" />
                    <span className="role-title">Student</span>
                    <span className="role-desc">Access courses & materials</span>
                  </div>
                  <div 
                    onClick={() => setRole('Instructor')}
                    className={`role-card ${role === 'Instructor' ? 'active' : ''}`}
                  >
                    <User size={24} className="role-icon" />
                    <span className="role-title">Instructor</span>
                    <span className="role-desc">Manage classes & content</span>
                  </div>
                  <div 
                    onClick={() => setRole('Admin')}
                    className={`role-card ${role === 'Admin' ? 'active' : ''}`}
                  >
                    <Settings size={24} className="role-icon" />
                    <span className="role-title">Admin</span>
                    <span className="role-desc">System management</span>
                  </div>
                </div>
              </div>

              <input 
                type="text" 
                placeholder="Full Name" 
                className="form-input"
                value={fullName} onChange={e => setFullName(e.target.value)} required={isRegister}
              />
            </>
          )}

          <input 
            type="email" 
            placeholder={isRegister ? "Institutional Email Address" : "Email Address"} 
            className="form-input"
            value={email} onChange={e => setEmail(e.target.value)} required
          />

          <div className="form-row">
             <input 
               type="password" 
               placeholder="Password" 
               className="form-input"
               value={password} onChange={e => setPassword(e.target.value)} required
             />
             {isRegister && (
               <input 
                 type="password" 
                 placeholder="Confirm Password" 
                 className="form-input"
                 value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)} required={isRegister}
               />
             )}
          </div>

          {isRegister && (
             <div className="terms-container">
                <input type="checkbox" id="terms" checked={agreed} onChange={e => setAgreed(e.target.checked)} required className="terms-checkbox" />
                <label htmlFor="terms" className="terms-label">I agree to the Terms of Service & Privacy Policy</label>
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
             <>Already have an account? <span className="auth-link" onClick={() => setIsRegister(false)}>Log In</span></>
           ) : (
             <>Don't have an account? <span className="auth-link" onClick={() => setIsRegister(true)}>Register</span></>
           )}
        </div>
      </div>
    </div>
  );
};

export default Login;
