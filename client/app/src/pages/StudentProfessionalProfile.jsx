import { useEffect, useRef, useState } from 'react';
import { Award, Briefcase, MapPin, Mail, Globe, ExternalLink, Camera, Loader, Edit2, Save, X, Plus } from 'lucide-react';
import useDashboardStore from '../store/dashboardStore';
import { useNavigate } from 'react-router-dom';
import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';

const StudentProfessionalProfile = () => {
  const navigate = useNavigate();
  const { userSettings, enrollments, isLoading, fetchDashboardData, uploadAvatar, uploadCover, updateSettings } = useDashboardStore();
  
  const [uploading, setUploading] = useState(false);
  const [uploadingCover, setUploadingCover] = useState(false);
  
  // Edit state
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState({
    name: '',
    category: '',
    academicYear: '',
    bio: '',
    skills: [],
    certifications: []
  });
  const [skillInput, setSkillInput] = useState('');
  const [certInput, setCertInput] = useState('');

  const fileInputRef = useRef(null);
  const coverInputRef = useRef(null);
  const profileRef = useRef(null);

  useEffect(() => {
    if (!userSettings) {
      fetchDashboardData();
    } else {
      setEditForm({
        name: userSettings.name || '',
        category: userSettings.category || '',
        academicYear: userSettings.academicYear || '',
        bio: userSettings.bio || '',
        skills: userSettings.skills || ['Problem Solving', 'Critical Thinking', 'Teamwork', 'Communication', 'Time Management', 'Adaptability'],
        certifications: userSettings.certifications || []
      });
    }
  }, [fetchDashboardData, userSettings]);

  if (isLoading || !userSettings) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '60vh', gap: '16px', color: '#6b7280' }}>
        <Loader size={40} style={{ animation: 'spin 1s linear infinite', color: '#6366f1' }} />
        <p style={{ fontSize: '16px' }}>Loading profile...</p>
      </div>
    );
  }

  const handleAvatarChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    const url = await uploadAvatar(file);
    if (url) {
       await fetchDashboardData();
    }
    setUploading(false);
  };

  const handleCoverChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploadingCover(true);
    const url = await uploadCover(file);
    if (url) {
       await fetchDashboardData();
    }
    setUploadingCover(false);
  };

  const getInitials = (name) => {
    return name ? name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase() : 'ST';
  };

  const safeEnrollments = enrollments || [];
  
  // Use fully completed courses as "Verified Certificates"
  const completedCourses = safeEnrollments.filter(e => e.progress === 100);
  // If none completed, just show current courses
  const displayedCourses = completedCourses.length > 0 ? completedCourses : safeEnrollments;

  const handleSave = async () => {
    await updateSettings({
      name: editForm.name,
      category: editForm.category,
      academicYear: editForm.academicYear,
      bio: editForm.bio,
      skills: editForm.skills,
      certifications: editForm.certifications
    });
    setIsEditing(false);
  };

  const handleAddSkill = () => {
    if (skillInput.trim() && !editForm.skills.includes(skillInput.trim())) {
      setEditForm({ ...editForm, skills: [...editForm.skills, skillInput.trim()] });
      setSkillInput('');
    }
  };

  const handleRemoveSkill = (skillToRemove) => {
    setEditForm({ ...editForm, skills: editForm.skills.filter(s => s !== skillToRemove) });
  };

  const handleAddCert = () => {
    if (certInput.trim() && !editForm.certifications.includes(certInput.trim())) {
      setEditForm({ ...editForm, certifications: [...editForm.certifications, certInput.trim()] });
      setCertInput('');
    }
  };

  const handleRemoveCert = (certToRemove) => {
    setEditForm({ ...editForm, certifications: editForm.certifications.filter(c => c !== certToRemove) });
  };

  const handleDownloadResume = async () => {
    if (!profileRef.current) return;
    try {
      // Hide buttons during PDF capture
      const buttonsToHide = profileRef.current.querySelectorAll('.hide-on-print');
      buttonsToHide.forEach(btn => btn.style.display = 'none');
      
      const canvas = await html2canvas(profileRef.current, { scale: 2, useCORS: true, backgroundColor: '#f8fafc' });
      const imgData = canvas.toDataURL('image/png');
      
      buttonsToHide.forEach(btn => btn.style.display = '');

      const pdf = new jsPDF('p', 'mm', 'a4');
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
      
      pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
      pdf.save(`${userSettings.name.replace(/\s+/g, '_')}_Resume.pdf`);
    } catch (error) {
      console.error("Failed to generate PDF", error);
    }
  };

  return (
    <div className="container" style={{ padding: '64px 24px', maxWidth: '1000px', margin: '0 auto' }}>
      <button onClick={() => navigate('/dashboard')} className="btn btn-secondary hide-on-print" style={{ marginBottom: '24px', padding: '10px 20px', background: '#fff', border: '1px solid #e2e8f0', borderRadius: '8px', cursor: 'pointer', fontWeight: 600 }}>&larr; Back to Dashboard</button>
      
      {/* Header Profile Section */}
      <div ref={profileRef} style={{ background: '#f8fafc', padding: '20px', borderRadius: '16px', margin: '-20px' }}>
      <div className="glass-panel" style={{ position: 'relative', marginBottom: '40px', background: '#fff', borderRadius: '16px', boxShadow: '0 4px 20px rgba(0,0,0,0.05)' }}>
         {/* Interactive Cover */}
         <div 
            style={{ 
              height: '200px', 
              background: userSettings.cover ? `url(${userSettings.cover}) center/cover` : 'linear-gradient(135deg, #6366f1, #8b5cf6)', 
              borderRadius: '16px 16px 0 0',
              position: 'relative',
              cursor: 'pointer',
              overflow: 'hidden'
            }}
            onClick={() => coverInputRef.current?.click()}
         >
            <div style={{
              position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.4)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              opacity: uploadingCover ? 1 : 0, transition: 'opacity 0.2s', gap: '8px', color: '#fff'
            }}
            onMouseOver={e => { if(!uploadingCover) e.currentTarget.style.opacity = '1'; }}
            onMouseOut={e => { if(!uploadingCover) e.currentTarget.style.opacity = '0'; }}
            >
              {uploadingCover ? (
                <Loader size={32} style={{ animation: 'spin 1s linear infinite' }} />
              ) : (
                <>
                  <Camera size={32} />
                  <span style={{ fontSize: '16px', fontWeight: 600 }}>Update Cover Photo</span>
                </>
              )}
            </div>
            <input 
              type="file" 
              ref={coverInputRef} 
              style={{ display: 'none' }} 
              accept="image/*" 
              onChange={handleCoverChange} 
            />
         </div>
         
         <div style={{ padding: '0 40px 40px 40px', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', flexWrap: 'wrap', gap: '20px' }}>
            <div style={{ display: 'flex', gap: '24px', marginTop: '-60px' }}>
               
               {/* Interactive Avatar */}
               <div 
                 style={{ 
                   width: '140px', height: '140px', borderRadius: '50%', 
                   background: userSettings.avatar ? `url(${userSettings.avatar}) center/cover` : '#f1f5f9', 
                   border: '4px solid #fff', display: 'flex', alignItems: 'center', justifyContent: 'center', 
                   fontSize: '48px', fontWeight: 'bold', color: '#6366f1',
                   position: 'relative', cursor: 'pointer', overflow: 'hidden', flexShrink: 0
                 }}
                 onClick={() => fileInputRef.current?.click()}
               >
                 {!userSettings.avatar && !uploading && getInitials(userSettings.name)}
                 
                 <div style={{
                   position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.5)',
                   display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
                   opacity: uploading ? 1 : 0, transition: 'opacity 0.2s', gap: '4px', color: '#fff'
                 }}
                 onMouseOver={e => { if(!uploading) e.currentTarget.style.opacity = '1'; }}
                 onMouseOut={e => { if(!uploading) e.currentTarget.style.opacity = '0'; }}
                 >
                   {uploading ? (
                      <Loader size={28} style={{ animation: 'spin 1s linear infinite' }} />
                   ) : (
                     <>
                       <Camera size={28} />
                       <span style={{ fontSize: '12px', fontWeight: 600 }}>Update</span>
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
               
               <div style={{ paddingTop: '72px' }}>
                 {isEditing ? (
                   <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '16px' }}>
                     <input 
                       value={editForm.name} 
                       onChange={e => setEditForm({...editForm, name: e.target.value})}
                       style={{ fontSize: '24px', fontWeight: 'bold', padding: '4px 8px', borderRadius: '4px', border: '1px solid #cbd5e1' }}
                       placeholder="Full Name"
                     />
                     <div style={{ display: 'flex', gap: '8px' }}>
                       <input 
                         value={editForm.category} 
                         onChange={e => setEditForm({...editForm, category: e.target.value})}
                         style={{ fontSize: '14px', padding: '4px 8px', borderRadius: '4px', border: '1px solid #cbd5e1' }}
                         placeholder="Major / Category"
                       />
                       <select 
                         value={editForm.academicYear} 
                         onChange={e => setEditForm({...editForm, academicYear: e.target.value})}
                         style={{ fontSize: '14px', padding: '4px 8px', borderRadius: '4px', border: '1px solid #cbd5e1' }}
                       >
                         <option value="">Select Year</option>
                         <option value="First">First Year</option>
                         <option value="Second">Second Year</option>
                         <option value="Third">Third Year</option>
                         <option value="Fourth">Fourth Year</option>
                       </select>
                     </div>
                   </div>
                 ) : (
                   <>
                     <h1 style={{ fontSize: '32px', margin: '0 0 4px', color: '#111827', fontWeight: 800 }}>{userSettings.name}</h1>
                     <p style={{ fontSize: '18px', color: '#6b7280', margin: '0 0 8px' }}>
                       {userSettings.category ? `${userSettings.category} Undergraduate` : 'Student at EduVerse'}
                       {userSettings.academicYear && ` • ${userSettings.academicYear} Year`}
                     </p>
                   </>
                 )}
                 <div style={{ display: 'flex', gap: '16px', color: '#9ca3af', fontSize: '14px' }}>
                   <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}><MapPin size={14} /> EduVerse Platform</span>
                   <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}><Mail size={14} /> {userSettings.email}</span>
                 </div>
               </div>
            </div>
            <div style={{ display: 'flex', gap: '8px' }}>
               {isEditing ? (
                 <>
                   <button onClick={handleSave} className="btn btn-primary" style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 20px', background: '#10b981', color: '#fff', border: 'none', borderRadius: '8px', fontWeight: 600, cursor: 'pointer' }}>
                     <Save size={18} /> Save
                   </button>
                   <button onClick={() => setIsEditing(false)} className="btn btn-secondary" style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 20px', background: '#f1f5f9', color: '#475569', border: 'none', borderRadius: '8px', fontWeight: 600, cursor: 'pointer' }}>
                     <X size={18} /> Cancel
                   </button>
                 </>
               ) : (
                 <>
                   <button onClick={() => setIsEditing(true)} className="btn btn-secondary hide-on-print" style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 14px', background: '#fff', border: '1px solid #e2e8f0', borderRadius: '8px', cursor: 'pointer', color: '#64748b' }}>
                     <Edit2 size={18} /> Edit Profile
                   </button>
                   <button onClick={handleDownloadResume} className="btn btn-primary hide-on-print" style={{ padding: '10px 20px', background: '#6366f1', color: '#fff', border: 'none', borderRadius: '8px', fontWeight: 600, cursor: 'pointer' }}>Download Resume</button>
                 </>
               )}
            </div>
         </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '24px' }}>
         {/* Left Column */}
         <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            <div className="glass-panel" style={{ padding: '32px', background: '#fff', borderRadius: '16px', boxShadow: '0 1px 4px rgba(0,0,0,0.05)' }}>
               <h3 style={{ fontSize: '20px', margin: '0 0 16px', color: '#111827' }}>About Me</h3>
               {isEditing ? (
                 <textarea
                   value={editForm.bio}
                   onChange={e => setEditForm({...editForm, bio: e.target.value})}
                   style={{ width: '100%', minHeight: '120px', padding: '12px', borderRadius: '8px', border: '1px solid #cbd5e1', resize: 'vertical', fontSize: '15px' }}
                   placeholder="Write something about yourself..."
                 />
               ) : (
                 <p style={{ color: '#4b5563', lineHeight: '1.6', margin: 0, whiteSpace: 'pre-line' }}>
                   {userSettings.bio || `Passionate student enrolled at EduVerse. Focused on applying academic theories to real-world challenges and expanding my knowledge base.`}
                 </p>
               )}
            </div>

            <div className="glass-panel" style={{ padding: '32px', background: '#fff', borderRadius: '16px', boxShadow: '0 1px 4px rgba(0,0,0,0.05)' }}>
               <h3 style={{ fontSize: '20px', margin: '0 0 24px', color: '#111827' }}>
                 {completedCourses.length > 0 ? 'Verified Certificates' : 'Current Courses'}
               </h3>
               <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                  {displayedCourses.length === 0 ? (
                    <p style={{ color: '#6b7280', margin: 0 }}>No course history available yet.</p>
                  ) : displayedCourses.map(enr => (
                    <div key={enr.id} style={{ display: 'flex', gap: '16px', padding: '16px', background: '#f8fafc', borderRadius: '12px' }}>
                       <div style={{ padding: '16px', background: 'rgba(16, 185, 129, 0.1)', color: '#10b981', borderRadius: '8px', display: 'flex', alignItems: 'center' }}>
                         <Award size={32} />
                       </div>
                       <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                          <h4 style={{ fontSize: '16px', margin: '0 0 4px', color: '#111827' }}>{enr.course?.title || 'Unknown Course'}</h4>
                          <p style={{ color: '#6b7280', fontSize: '14px', margin: '0 0 8px' }}>
                            {completedCourses.length > 0 ? 'Issued by EduVerse' : `In Progress • ${enr.progress}% Completed`}
                          </p>
                          <span style={{ fontSize: '14px', display: 'flex', alignItems: 'center', gap: '4px', color: '#3b82f6', cursor: 'pointer', fontWeight: 500 }}>
                            {completedCourses.length > 0 ? 'Verify Credential' : 'View Course'} <ExternalLink size={14} />
                          </span>
                       </div>
                    </div>
                  ))}
               </div>
            </div>
         </div>

         {/* Right Column */}
         <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            <div className="glass-panel" style={{ padding: '32px', background: '#fff', borderRadius: '16px', boxShadow: '0 1px 4px rgba(0,0,0,0.05)' }}>
               <h3 style={{ fontSize: '20px', margin: '0 0 16px', color: '#111827' }}>Skills</h3>
               <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                  {editForm.skills.map(skill => (
                    <span key={skill} style={{ padding: '6px 12px', background: '#f1f5f9', color: '#475569', borderRadius: '100px', fontSize: '14px', fontWeight: 500, display: 'flex', alignItems: 'center', gap: '6px' }}>
                      {skill}
                      {isEditing && (
                        <button onClick={() => handleRemoveSkill(skill)} style={{ background: 'none', border: 'none', padding: 0, cursor: 'pointer', color: '#ef4444', display: 'flex' }}>
                          <X size={14} />
                        </button>
                      )}
                    </span>
                  ))}
               </div>
               {isEditing && (
                 <div style={{ display: 'flex', gap: '8px', marginTop: '16px' }}>
                   <input 
                     value={skillInput}
                     onChange={e => setSkillInput(e.target.value)}
                     onKeyDown={e => e.key === 'Enter' && handleAddSkill()}
                     style={{ flex: 1, padding: '8px 12px', borderRadius: '6px', border: '1px solid #cbd5e1' }}
                     placeholder="Add a skill"
                   />
                   <button onClick={handleAddSkill} style={{ background: '#3b82f6', color: '#fff', border: 'none', padding: '8px 12px', borderRadius: '6px', cursor: 'pointer' }}>
                     <Plus size={20} />
                   </button>
                 </div>
               )}
            </div>

            <div className="glass-panel" style={{ padding: '32px', background: '#fff', borderRadius: '16px', boxShadow: '0 1px 4px rgba(0,0,0,0.05)' }}>
               <h3 style={{ fontSize: '20px', margin: '0 0 16px', color: '#111827' }}>Education</h3>
               <div style={{ display: 'flex', gap: '16px', marginBottom: '20px' }}>
                 <div style={{ background: '#f8fafc', padding: '12px', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                   <Briefcase size={24} color="#94a3b8" />
                 </div>
                 <div>
                    <h4 style={{ fontSize: '16px', margin: '0 0 2px', color: '#111827' }}>
                      B.S. {userSettings.category || 'General Studies'}
                    </h4>
                    <p style={{ color: '#4b5563', fontSize: '14px', margin: '0 0 4px' }}>EduVerse Academy</p>
                    <p style={{ color: '#9ca3af', fontSize: '12px', margin: 0 }}>{userSettings.academicYear ? `${userSettings.academicYear} Year` : 'Current Student'}</p>
                 </div>
               </div>
               
               {userSettings.gpa !== undefined && userSettings.gpa !== null && (
                 <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: 'linear-gradient(to right, #eff6ff, #f8fafc)', padding: '16px 20px', borderRadius: '12px', borderLeft: '4px solid #3b82f6' }}>
                    <div>
                      <h4 style={{ fontSize: '14px', margin: '0 0 4px', color: '#4b5563', fontWeight: 600 }}>Cumulative GPA</h4>
                      <p style={{ fontSize: '12px', color: '#9ca3af', margin: 0 }}>Based on graded courses</p>
                    </div>
                    <div style={{ fontSize: '24px', fontWeight: 800, color: '#1d4ed8' }}>
                      {userSettings.gpa.toFixed(1)} <span style={{ fontSize: '14px', color: '#9ca3af', fontWeight: 500 }}>/ 4.0</span>
                    </div>
                 </div>
               )}
            </div>

            <div className="glass-panel" style={{ padding: '32px', background: '#fff', borderRadius: '16px', boxShadow: '0 1px 4px rgba(0,0,0,0.05)' }}>
               <h3 style={{ fontSize: '20px', margin: '0 0 16px', color: '#111827' }}>Certifications</h3>
               <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  {editForm.certifications.length === 0 && !isEditing ? (
                    <p style={{ color: '#6b7280', margin: 0 }}>No external certifications added yet.</p>
                  ) : editForm.certifications.map(cert => (
                    <div key={cert} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 16px', background: '#f8fafc', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <Award size={20} color="#6366f1" />
                        <span style={{ fontSize: '15px', fontWeight: 500, color: '#334155' }}>{cert}</span>
                      </div>
                      {isEditing && (
                        <button onClick={() => handleRemoveCert(cert)} style={{ background: 'none', border: 'none', padding: 0, cursor: 'pointer', color: '#ef4444', display: 'flex' }}>
                          <X size={16} />
                        </button>
                      )}
                    </div>
                  ))}
               </div>
               {isEditing && (
                 <div style={{ display: 'flex', gap: '8px', marginTop: '16px' }}>
                   <input 
                     value={certInput}
                     onChange={e => setCertInput(e.target.value)}
                     onKeyDown={e => e.key === 'Enter' && handleAddCert()}
                     style={{ flex: 1, padding: '10px 14px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '14px' }}
                     placeholder="e.g. AWS Certified Developer"
                   />
                   <button onClick={handleAddCert} style={{ background: '#3b82f6', color: '#fff', border: 'none', padding: '10px 16px', borderRadius: '8px', cursor: 'pointer', fontWeight: 600 }}>
                     Add
                   </button>
                 </div>
               )}
            </div>
         </div>
      </div>
      </div>
    </div>
  );
};

export default StudentProfessionalProfile;
