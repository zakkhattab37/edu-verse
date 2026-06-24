import { User, Bell, Save, Camera } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect, useRef } from 'react';
import useDashboardStore from '../../store/dashboardStore';

const SettingsTab = () => {
  const { userSettings, updateSettings, uploadAvatar } = useDashboardStore();
  const fileInputRef = useRef(null);
  
  const [formData, setFormData] = useState({
    name: '',
    bio: '',
    avatar: '',
    preferences: { email: true, sms: false, publicProfile: true }
  });
  const [isSaving, setIsSaving] = useState(false);
  const [showAlert, setShowAlert] = useState(false);

  useEffect(() => {
    if (userSettings) {
      setFormData({
        name: userSettings.name || '',
        bio: userSettings.bio || '',
        avatar: userSettings.avatar || '',
        preferences: userSettings.preferences || { email: true, sms: false, publicProfile: true }
      });
    }
  }, [userSettings]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    if (type === 'checkbox') {
      setFormData(prev => ({
        ...prev,
        preferences: {
          ...prev.preferences,
          [name]: checked
        }
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const handleImageChange = async (e) => {
    const file = e.target.files[0];
    if (file) {
      // Create local preview immediately
      const previewUrl = URL.createObjectURL(file);
      setFormData(prev => ({
        ...prev,
        avatar: previewUrl
      }));
      
      // Upload to backend
      const newAvatarUrl = await uploadAvatar(file);
      if (newAvatarUrl) {
        setFormData(prev => ({
          ...prev,
          avatar: newAvatarUrl
        }));
      }
    }
  };

  const handleSave = async () => {
    setIsSaving(true);
    const success = await updateSettings(formData);
    setIsSaving(false);
    
    if (success) {
      setShowAlert(true);
      setTimeout(() => setShowAlert(false), 5000); // Auto-dismiss after 5s
    }
  };

  return (
    <>
      <AnimatePresence>
        {showAlert && (
          <motion.div
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -50 }}
            style={{ position: 'fixed', top: '24px', right: '24px', zIndex: 50 }}
          >
            <div role="alert" style={{ width: '400px', borderRadius: '8px', border: '1px solid #d6d3d1', backgroundColor: '#f5f5f4', padding: '24px', boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                <span style={{ flexShrink: 0, borderRadius: '9999px', backgroundColor: '#34d399', padding: '8px', color: '#fff', display: 'flex' }}>
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" style={{ height: '16px', width: '16px' }}>
                    <path fillRule="evenodd" d="M18 3a1 1 0 00-1.447-.894L8.763 6H5a3 3 0 000 6h.28l1.771 5.316A1 1 0 008 18h1a1 1 0 001-1v-4.382l6.553 3.276A1 1 0 0018 15V3z" clipRule="evenodd" />
                  </svg>
                </span>
                <p style={{ fontWeight: 500, fontSize: '18px', color: '#059669', margin: 0 }}>Settings Saved!</p>
              </div>
              <p style={{ marginTop: '16px', color: '#4b5563', fontSize: '14px', margin: '16px 0 0 0', lineHeight: '1.5' }}>
                Your profile information and preferences have been successfully updated.
              </p>
              <div style={{ marginTop: '24px', display: 'flex', gap: '16px' }}>
                <button onClick={() => setShowAlert(false)} style={{ display: 'inline-block', width: '100%', borderRadius: '8px', backgroundColor: '#d6d3d1', padding: '12px 20px', textAlign: 'center', fontSize: '14px', fontWeight: 600, color: '#1f2937', border: 'none', cursor: 'pointer', transition: 'background 0.2s' }} onMouseOver={e => e.currentTarget.style.backgroundColor = '#a8a29e'} onMouseOut={e => e.currentTarget.style.backgroundColor = '#d6d3d1'}>
                  Dismiss
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        transition={{ duration: 0.5 }}
        style={{ display: 'flex', flexDirection: 'column', gap: '32px', maxWidth: '800px' }}
      >
        <div>
          <h2 style={{ fontSize: '24px', fontWeight: 700, color: '#111827', marginBottom: '8px' }}>Settings</h2>
          <p style={{ color: '#6B7280' }}>Manage your account preferences and profile details.</p>
        </div>

        <div style={{ background: '#FFFFFF', borderRadius: '16px', border: '1px solid #E5E7EB', boxShadow: '0 1px 3px rgba(0,0,0,0.05)', overflow: 'hidden' }}>
          
          {/* Profile Settings */}
          <div style={{ padding: '32px', borderBottom: '1px solid #E5E7EB' }}>
             <h3 style={{ fontSize: '18px', fontWeight: 600, color: '#111827', marginBottom: '24px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <User size={20} color="var(--accent-primary)" /> Profile Information
             </h3>
             <div style={{ display: 'flex', gap: '32px', alignItems: 'flex-start' }}>
                
                {/* Avatar Upload */}
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '12px' }}>
                  <div style={{ position: 'relative', width: '100px', height: '100px' }}>
                    <img 
                      src={formData.avatar || "https://i.pravatar.cc/150?u=4"} 
                      alt="User" 
                      style={{ width: '100%', height: '100%', borderRadius: '50%', border: '2px solid #F3F4F6', objectFit: 'cover' }} 
                    />
                    <button 
                      onClick={() => fileInputRef.current?.click()}
                      style={{ position: 'absolute', bottom: 0, right: 0, background: 'var(--accent-primary)', color: '#FFFFFF', border: '2px solid #FFFFFF', borderRadius: '50%', width: '32px', height: '32px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', padding: 0 }}
                    >
                      <Camera size={16} />
                    </button>
                    <input 
                      type="file" 
                      accept="image/*" 
                      ref={fileInputRef} 
                      onChange={handleImageChange} 
                      style={{ display: 'none' }} 
                    />
                  </div>
                  <span style={{ fontSize: '12px', color: '#6B7280' }}>Max size 2MB</span>
                </div>

                <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '16px' }}>
                   <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                      <div>
                         <label style={{ display: 'block', fontSize: '13px', fontWeight: 500, color: '#4B5563', marginBottom: '6px' }}>Full Name</label>
                         <input type="text" name="name" value={formData.name} onChange={handleChange} style={{ width: '100%', padding: '10px 12px', border: '1px solid #E5E7EB', borderRadius: '8px', outline: 'none' }} />
                      </div>
                      <div>
                         <label style={{ display: 'block', fontSize: '13px', fontWeight: 500, color: '#4B5563', marginBottom: '6px' }}>Email Address</label>
                         <input type="email" value={userSettings?.email || ''} disabled style={{ width: '100%', padding: '10px 12px', border: '1px solid #E5E7EB', borderRadius: '8px', background: '#F9FAFB', color: '#9CA3AF', outline: 'none' }} />
                      </div>
                   </div>
                   <div>
                      <label style={{ display: 'block', fontSize: '13px', fontWeight: 500, color: '#4B5563', marginBottom: '6px' }}>Bio</label>
                      <textarea rows="3" name="bio" value={formData.bio} onChange={handleChange} placeholder="Tell us about yourself..." style={{ width: '100%', padding: '10px 12px', border: '1px solid #E5E7EB', borderRadius: '8px', outline: 'none', resize: 'vertical' }}></textarea>
                   </div>
                </div>
             </div>
          </div>

          {/* Notifications & Preferences */}
          <div style={{ padding: '32px' }}>
             <h3 style={{ fontSize: '18px', fontWeight: 600, color: '#111827', marginBottom: '24px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Bell size={20} color="var(--accent-primary)" /> Notifications & Preferences
             </h3>
             <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                   <div>
                      <div style={{ fontSize: '15px', fontWeight: 500, color: '#111827' }}>Email Notifications</div>
                      <div style={{ fontSize: '13px', color: '#6B7280' }}>Receive daily summaries and deadline reminders.</div>
                   </div>
                   <input type="checkbox" name="email" checked={formData.preferences.email} onChange={handleChange} style={{ width: '18px', height: '18px', accentColor: 'var(--accent-primary)' }} />
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                   <div>
                      <div style={{ fontSize: '15px', fontWeight: 500, color: '#111827' }}>SMS Alerts</div>
                      <div style={{ fontSize: '13px', color: '#6B7280' }}>Get text messages for urgent announcements.</div>
                   </div>
                   <input type="checkbox" name="sms" checked={formData.preferences.sms} onChange={handleChange} style={{ width: '18px', height: '18px', accentColor: 'var(--accent-primary)' }} />
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                   <div>
                      <div style={{ fontSize: '15px', fontWeight: 500, color: '#111827' }}>Public Profile</div>
                      <div style={{ fontSize: '13px', color: '#6B7280' }}>Allow other students to see your professional profile.</div>
                   </div>
                   <input type="checkbox" name="publicProfile" checked={formData.preferences.publicProfile} onChange={handleChange} style={{ width: '18px', height: '18px', accentColor: 'var(--accent-primary)' }} />
                </div>
             </div>

             <div style={{ marginTop: '32px', display: 'flex', justifyContent: 'flex-end' }}>
                <button 
                  onClick={handleSave}
                  disabled={isSaving}
                  style={{ display: 'flex', alignItems: 'center', gap: '8px', background: 'var(--accent-primary)', color: '#FFFFFF', border: 'none', padding: '10px 24px', borderRadius: '8px', fontWeight: 600, cursor: isSaving ? 'not-allowed' : 'pointer', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)', opacity: isSaving ? 0.7 : 1 }}
                >
                   <Save size={18} /> {isSaving ? 'Saving...' : 'Save Changes'}
                </button>
             </div>
          </div>

        </div>
      </motion.div>
    </>
  );
};

export default SettingsTab;
