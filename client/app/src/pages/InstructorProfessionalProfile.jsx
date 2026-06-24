import { Star, Video, Users, CheckCircle } from 'lucide-react';

const InstructorProfessionalProfile = () => {
  return (
    <div className="container" style={{ padding: '64px 24px', maxWidth: '1000px' }}>
      <div className="glass-panel" style={{ display: 'flex', gap: '40px', padding: '40px', marginBottom: '40px' }}>
         <div style={{ width: '160px', height: '160px', borderRadius: '16px', background: 'var(--accent-gradient)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '64px', fontWeight: 'bold' }}>
           DR
         </div>
         <div style={{ flex: 1 }}>
            <div className="flex items-center gap-2" style={{ marginBottom: '8px' }}>
               <h1 style={{ fontSize: '36px' }}>Dr. Bob</h1>
               <CheckCircle color="var(--success)" size={24} />
            </div>
            <p style={{ fontSize: '18px', color: 'var(--text-secondary)', marginBottom: '24px' }}>Professor of Computer Science & AI Researcher</p>
            
            <div className="flex gap-8" style={{ padding: '24px', background: 'var(--bg-secondary)', borderRadius: '12px' }}>
               <div>
                  <div style={{ fontSize: '14px', color: 'var(--text-muted)' }}>Total Students</div>
                  <div style={{ fontSize: '24px', fontWeight: 'bold' }}>14,230</div>
               </div>
               <div>
                  <div style={{ fontSize: '14px', color: 'var(--text-muted)' }}>Courses</div>
                  <div style={{ fontSize: '24px', fontWeight: 'bold' }}>12</div>
               </div>
               <div>
                  <div style={{ fontSize: '14px', color: 'var(--text-muted)' }}>Instructor Rating</div>
                  <div className="flex items-center gap-2">
                     <span style={{ fontSize: '24px', fontWeight: 'bold' }}>4.9</span>
                     <Star size={18} fill="var(--warning)" color="var(--warning)" />
                  </div>
               </div>
            </div>
         </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '24px' }}>
         <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            <div className="glass-panel" style={{ padding: '32px' }}>
               <h3 style={{ fontSize: '20px', marginBottom: '16px' }}>About the Instructor</h3>
               <p style={{ color: 'var(--text-secondary)', lineHeight: '1.6' }}>
                 Dr. Bob is a renowned academic in the field of Artificial Intelligence with over 15 years of teaching experience. 
                 He holds a Ph.D. from MIT and has published over 40 papers in top-tier journals. His teaching methodology focuses 
                 on breaking down complex mathematical concepts into intuitive, digestible modules.
               </p>
            </div>
            
            <h3 style={{ fontSize: '24px', marginTop: '16px' }}>Published Courses</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
               {[1, 2, 3].map(i => (
                 <div key={i} className="glass-panel flex gap-4" style={{ padding: '16px' }}>
                    <div style={{ width: '160px', height: '100px', background: 'var(--bg-secondary)', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                       <Video size={32} color="var(--text-muted)" />
                    </div>
                    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                       <h4 style={{ fontSize: '18px', marginBottom: '8px' }}>Neural Networks Fundamentals</h4>
                       <div className="flex items-center gap-4" style={{ color: 'var(--text-secondary)', fontSize: '14px' }}>
                         <span className="flex items-center gap-1"><Users size={14} /> 4,500 students</span>
                         <span className="flex items-center gap-1"><Star size={14} color="var(--warning)" /> 4.8</span>
                       </div>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center' }}>
                       <button className="btn btn-secondary">Enroll</button>
                    </div>
                 </div>
               ))}
            </div>
         </div>

         <div>
            <div className="glass-panel" style={{ padding: '32px' }}>
               <h3 style={{ fontSize: '20px', marginBottom: '16px' }}>Research Areas</h3>
               <ul style={{ color: 'var(--text-secondary)', paddingLeft: '20px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                 <li>Deep Learning Architectures</li>
                 <li>Computer Vision</li>
                 <li>Algorithmic Bias Mitigation</li>
                 <li>Robotics Control Systems</li>
               </ul>
            </div>
         </div>
      </div>
    </div>
  );
};

export default InstructorProfessionalProfile;
