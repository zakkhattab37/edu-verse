import { useEffect, useRef, useState } from 'react';
import { Star, Video, Users, CheckCircle, Camera, Loader } from 'lucide-react';
import useInstructorStore from '../store/instructorStore';
import useDashboardStore from '../store/dashboardStore';
import { useNavigate } from 'react-router-dom';

const InstructorProfessionalProfile = () => {
  const navigate = useNavigate();
  const { dashboardData, isLoading, fetchInstructorDashboard } = useInstructorStore();
  const { uploadAvatar } = useDashboardStore();
  
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef(null);

  useEffect(() => {
    if (!dashboardData) {
      fetchInstructorDashboard();
    }
  }, [fetchInstructorDashboard, dashboardData]);

  if (isLoading || !dashboardData) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '60vh', gap: '16px', color: '#6b7280' }}>
        <Loader size={40} style={{ animation: 'spin 1s linear infinite', color: '#6366f1' }} />
        <p style={{ fontSize: '16px' }}>Loading profile...</p>
      </div>
    );
  }

  const { user, courses, totalStudents } = dashboardData;

  const handleAvatarChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    const url = await uploadAvatar(file);
    if (url) {
       // Refresh dashboard data to get the new avatar in instructorStore
       await fetchInstructorDashboard();
    }
    setUploading(false);
  };

  const getInitials = (name) => {
    return name ? name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase() : 'IN';
  };

  // Safe fallback for published courses
  const publishedCourses = courses || [];

  return (
    <div className="container" style={{ padding: '64px 24px', maxWidth: '1000px', margin: '0 auto' }}>
      <button onClick={() => navigate('/dashboard')} className="btn btn-secondary" style={{ marginBottom: '24px', padding: '10px 20px', background: '#fff', border: '1px solid #e2e8f0', borderRadius: '8px', cursor: 'pointer', fontWeight: 600 }}>&larr; Back to Dashboard</button>
      
      <div className="glass-panel" style={{ display: 'flex', gap: '40px', padding: '40px', marginBottom: '40px', background: '#fff', borderRadius: '16px', boxShadow: '0 4px 20px rgba(0,0,0,0.05)' }}>
         {/* Avatar Section */}
         <div 
           style={{ 
             width: '160px', height: '160px', borderRadius: '16px', 
             background: user?.avatar ? `url(${user.avatar}) center/cover` : 'linear-gradient(135deg, #6366f1, #8b5cf6)', 
             display: 'flex', alignItems: 'center', justifyContent: 'center', 
             fontSize: '48px', fontWeight: 'bold', color: '#fff',
             position: 'relative', cursor: 'pointer', overflow: 'hidden'
           }}
           onClick={() => fileInputRef.current?.click()}
         >
           {!user?.avatar && !uploading && getInitials(user?.name)}
           
           <div style={{
             position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.5)',
             display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
             opacity: uploading ? 1 : 0, transition: 'opacity 0.2s', gap: '8px'
           }}
           onMouseOver={e => { if(!uploading) e.currentTarget.style.opacity = '1'; }}
           onMouseOut={e => { if(!uploading) e.currentTarget.style.opacity = '0'; }}
           >
             {uploading ? (
                <Loader size={32} style={{ animation: 'spin 1s linear infinite' }} />
             ) : (
               <>
                 <Camera size={32} />
                 <span style={{ fontSize: '14px', fontWeight: 600 }}>Change Photo</span>
               </>
             )}
           </div>
           
           <input 
             type="file" 
             ref={fileInputRef} 
             style={{ display: 'none' }} 
             accept="image/*" 
             onChange={handleAvatarChange} 
           />
         </div>
         
         {/* Info Section */}
         <div style={{ flex: 1 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
               <h1 style={{ fontSize: '36px', margin: 0, fontWeight: 800, color: '#111827' }}>{user?.name}</h1>
               <CheckCircle color="#10b981" size={24} />
            </div>
            <p style={{ fontSize: '18px', color: '#6b7280', marginBottom: '24px' }}>
              {user?.category ? `Professor of ${user.category}` : 'Instructor'}
            </p>
            
            <div style={{ display: 'flex', gap: '32px', padding: '24px', background: '#f8fafc', borderRadius: '12px' }}>
               <div>
                  <div style={{ fontSize: '14px', color: '#6b7280' }}>Total Students</div>
                  <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#111827' }}>{totalStudents?.toLocaleString() || 0}</div>
               </div>
               <div>
                  <div style={{ fontSize: '14px', color: '#6b7280' }}>Courses</div>
                  <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#111827' }}>{publishedCourses.length}</div>
               </div>
               <div>
                  <div style={{ fontSize: '14px', color: '#6b7280' }}>Instructor Rating</div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                     <span style={{ fontSize: '24px', fontWeight: 'bold', color: '#111827' }}>4.9</span>
                     <Star size={18} fill="#f59e0b" color="#f59e0b" />
                  </div>
               </div>
            </div>
         </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '24px' }}>
         <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            <div className="glass-panel" style={{ padding: '32px', background: '#fff', borderRadius: '16px', boxShadow: '0 1px 4px rgba(0,0,0,0.05)' }}>
               <h3 style={{ fontSize: '20px', marginBottom: '16px', color: '#111827', marginTop: 0 }}>About the Instructor</h3>
               <p style={{ color: '#4b5563', lineHeight: '1.6', whiteSpace: 'pre-line', margin: 0 }}>
                 {user?.bio || `${user?.name} is an instructor at EduVerse. They haven't added a bio yet.`}
               </p>
            </div>
            
            <h3 style={{ fontSize: '24px', marginTop: '16px', color: '#111827', marginBottom: 0 }}>Published Courses</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
               {publishedCourses.length === 0 ? (
                 <p style={{ color: '#6b7280', margin: 0 }}>No courses published yet.</p>
               ) : publishedCourses.map(course => (
                 <div key={course.id} className="glass-panel" style={{ display: 'flex', gap: '16px', padding: '16px', background: '#fff', borderRadius: '12px', boxShadow: '0 1px 4px rgba(0,0,0,0.05)' }}>
                    <div style={{ width: '160px', height: '100px', background: '#f1f5f9', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                       <Video size={32} color="#94a3b8" />
                    </div>
                    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                       <h4 style={{ fontSize: '18px', margin: '0 0 8px 0', color: '#111827' }}>{course.title}</h4>
                       <div style={{ display: 'flex', alignItems: 'center', gap: '16px', color: '#6b7280', fontSize: '14px' }}>
                         <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}><Users size={14} /> Enrolled</span>
                         <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}><Star size={14} color="#f59e0b" /> 4.8</span>
                       </div>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center' }}>
                       <button onClick={() => navigate(`/course-workspace/${course.id}`)} style={{ padding: '8px 20px', background: '#eff6ff', color: '#3b82f6', border: 'none', borderRadius: '8px', fontWeight: 600, cursor: 'pointer' }}>View Course</button>
                    </div>
                 </div>
               ))}
            </div>
         </div>

         <div>
            <div className="glass-panel" style={{ padding: '32px', background: '#fff', borderRadius: '16px', boxShadow: '0 1px 4px rgba(0,0,0,0.05)' }}>
               <h3 style={{ fontSize: '20px', marginBottom: '16px', color: '#111827', marginTop: 0 }}>Areas of Expertise</h3>
               <ul style={{ color: '#4b5563', paddingLeft: '20px', display: 'flex', flexDirection: 'column', gap: '8px', margin: 0 }}>
                 {user?.category ? (
                   <>
                     <li>{user.category}</li>
                     <li>Online Education</li>
                     <li>Curriculum Design</li>
                   </>
                 ) : (
                   <li>General Education</li>
                 )}
               </ul>
            </div>
         </div>
      </div>
    </div>
  );
};

export default InstructorProfessionalProfile;
