import { Award, Briefcase, MapPin, Mail, Globe, ExternalLink } from 'lucide-react';

const StudentProfessionalProfile = () => {
  return (
    <div className="container" style={{ padding: '64px 24px', maxWidth: '1000px' }}>
      
      {/* Header Profile Section */}
      <div className="glass-panel" style={{ position: 'relative', marginBottom: '40px' }}>
         <div style={{ height: '160px', background: 'var(--accent-gradient)', borderRadius: '16px 16px 0 0' }}></div>
         <div style={{ padding: '0 40px 40px 40px', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
            <div style={{ display: 'flex', gap: '24px', marginTop: '-60px' }}>
               <div style={{ width: '140px', height: '140px', borderRadius: '50%', background: 'var(--bg-secondary)', border: '4px solid var(--bg-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '48px', fontWeight: 'bold' }}>
                 AL
               </div>
               <div style={{ paddingTop: '72px' }}>
                 <h1 style={{ fontSize: '32px', marginBottom: '4px' }}>Alice Liddell</h1>
                 <p style={{ fontSize: '18px', color: 'var(--text-secondary)', marginBottom: '8px' }}>Computer Science Undergraduate • Data Science Enthusiast</p>
                 <div className="flex gap-4" style={{ color: 'var(--text-muted)', fontSize: '14px' }}>
                   <span className="flex items-center gap-1"><MapPin size={14} /> Cairo University</span>
                   <span className="flex items-center gap-1"><Mail size={14} /> Contact</span>
                 </div>
               </div>
            </div>
            <div className="flex gap-2">
               <button className="btn btn-secondary" style={{ padding: '10px' }}><Globe size={20} /></button>
               <button className="btn btn-primary">Download Resume</button>
            </div>
         </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '24px' }}>
         {/* Left Column */}
         <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            <div className="glass-panel" style={{ padding: '32px' }}>
               <h3 style={{ fontSize: '20px', marginBottom: '16px' }}>About Me</h3>
               <p style={{ color: 'var(--text-secondary)', lineHeight: '1.6' }}>
                 Passionate Computer Science student with a focus on machine learning and data architecture. 
                 Consistently seeking to apply academic theories to real-world software engineering challenges.
                 Top 5% of class in algorithm design and discrete mathematics.
               </p>
            </div>

            <div className="glass-panel" style={{ padding: '32px' }}>
               <h3 style={{ fontSize: '20px', marginBottom: '24px' }}>Verified Certificates</h3>
               <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                  {[1, 2].map(i => (
                    <div key={i} style={{ display: 'flex', gap: '16px', padding: '16px', background: 'var(--bg-secondary)', borderRadius: '12px' }}>
                       <div style={{ padding: '16px', background: 'rgba(16, 185, 129, 0.1)', color: 'var(--success)', borderRadius: '8px' }}>
                         <Award size={32} />
                       </div>
                       <div style={{ flex: 1 }}>
                          <h4 style={{ fontSize: '16px', marginBottom: '4px' }}>Advanced Machine Learning with Python</h4>
                          <p style={{ color: 'var(--text-secondary)', fontSize: '14px', marginBottom: '8px' }}>Issued by EDUVERSE • Dec 2025</p>
                          <a href="#" style={{ fontSize: '14px', display: 'flex', alignItems: 'center', gap: '4px' }}>Verify Credential <ExternalLink size={14} /></a>
                       </div>
                    </div>
                  ))}
               </div>
            </div>
         </div>

         {/* Right Column */}
         <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            <div className="glass-panel" style={{ padding: '32px' }}>
               <h3 style={{ fontSize: '20px', marginBottom: '16px' }}>Skills</h3>
               <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                  {['Python', 'TensorFlow', 'React', 'Node.js', 'PostgreSQL', 'C++'].map(skill => (
                    <span key={skill} style={{ padding: '6px 12px', background: 'var(--bg-secondary)', borderRadius: '100px', fontSize: '14px' }}>{skill}</span>
                  ))}
               </div>
            </div>

            <div className="glass-panel" style={{ padding: '32px' }}>
               <h3 style={{ fontSize: '20px', marginBottom: '16px' }}>Education</h3>
               <div style={{ display: 'flex', gap: '16px' }}>
                 <Briefcase size={24} color="var(--text-muted)" />
                 <div>
                    <h4 style={{ fontSize: '16px' }}>B.S. Computer Science</h4>
                    <p style={{ color: 'var(--text-secondary)', fontSize: '14px' }}>Cairo University</p>
                    <p style={{ color: 'var(--text-muted)', fontSize: '12px', marginTop: '4px' }}>2023 - 2027</p>
                 </div>
               </div>
            </div>
         </div>
      </div>
    </div>
  );
};

export default StudentProfessionalProfile;
