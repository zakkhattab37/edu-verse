import { useNavigate } from 'react-router-dom';
import useAuthStore from '../store/authStore';
import { motion } from 'framer-motion';
import { ArrowRight, BookOpen, GraduationCap, Sparkles } from 'lucide-react';

const StudentWelcome = () => {
  const navigate = useNavigate();
  const { user } = useAuthStore();

  return (
    <div style={{ minHeight: '100vh', background: '#0F172A', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', position: 'relative', overflow: 'hidden', fontFamily: 'Inter, sans-serif' }}>
      
      {/* Background decoration */}
      <div style={{ position: 'absolute', width: '600px', height: '600px', background: 'radial-gradient(circle, rgba(37,99,235,0.2) 0%, rgba(15,23,42,0) 70%)', top: '-20%', left: '-10%', filter: 'blur(40px)' }} />
      <div style={{ position: 'absolute', width: '500px', height: '500px', background: 'radial-gradient(circle, rgba(139,92,246,0.15) 0%, rgba(15,23,42,0) 70%)', bottom: '-10%', right: '-10%', filter: 'blur(40px)' }} />

      <motion.div 
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        style={{ position: 'relative', zIndex: 10, display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', maxWidth: '600px', padding: '0 24px' }}
      >
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.5, type: "spring" }}
          style={{ width: '80px', height: '80px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '24px', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '32px', boxShadow: '0 10px 30px rgba(0,0,0,0.5)' }}
        >
          <GraduationCap size={40} color="#3B82F6" />
        </motion.div>

        <h1 style={{ fontSize: '48px', fontWeight: 700, color: '#FFFFFF', marginBottom: '16px', letterSpacing: '-1px', lineHeight: '1.2' }}>
          Welcome back, <br/>
          <span style={{ background: 'linear-gradient(135deg, #60A5FA 0%, #A78BFA 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
            {user?.name || 'Student'}!
          </span>
        </h1>
        
        <p style={{ fontSize: '18px', color: '#94A3B8', marginBottom: '48px', lineHeight: '1.6' }}>
          Ready to continue your learning journey? You have 2 assignments due soon and you're on a 45-day learning streak. Let's keep the momentum going!
        </p>

        <motion.button
          whileHover={{ scale: 1.05, boxShadow: '0 0 20px rgba(59,130,246,0.4)' }}
          whileTap={{ scale: 0.95 }}
          onClick={() => navigate('/dashboard')}
          style={{ background: 'linear-gradient(135deg, #2563EB 0%, #1D4ED8 100%)', color: '#FFFFFF', border: 'none', padding: '16px 32px', borderRadius: '100px', fontSize: '16px', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '12px', cursor: 'pointer', boxShadow: '0 10px 25px rgba(37,99,235,0.3)', transition: 'all 0.2s' }}
        >
          Go to Dashboard <ArrowRight size={20} />
        </motion.button>
      </motion.div>

      {/* Decorative floating elements */}
      <motion.div 
        animate={{ y: [0, -15, 0], rotate: [0, 5, 0] }} 
        transition={{ repeat: Infinity, duration: 5, ease: "easeInOut" }}
        style={{ position: 'absolute', top: '20%', right: '20%', background: 'rgba(255,255,255,0.03)', padding: '16px', borderRadius: '16px', border: '1px solid rgba(255,255,255,0.05)', backdropFilter: 'blur(10px)' }}
      >
        <BookOpen size={24} color="#60A5FA" />
      </motion.div>

      <motion.div 
        animate={{ y: [0, 20, 0], rotate: [0, -10, 0] }} 
        transition={{ repeat: Infinity, duration: 6, ease: "easeInOut", delay: 1 }}
        style={{ position: 'absolute', bottom: '25%', left: '15%', background: 'rgba(255,255,255,0.03)', padding: '16px', borderRadius: '16px', border: '1px solid rgba(255,255,255,0.05)', backdropFilter: 'blur(10px)' }}
      >
        <Sparkles size={24} color="#A78BFA" />
      </motion.div>

    </div>
  );
};

export default StudentWelcome;
