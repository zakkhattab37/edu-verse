import { create } from 'zustand';
import axios from 'axios';

const API_URL = 'http://localhost:5000/api/dashboard';

// Helper: sync any user field changes into authStore + localStorage
const syncUserToAuth = (updates) => {
  try {
    const stored = JSON.parse(localStorage.getItem('user') || 'null');
    if (!stored) return;
    const merged = { ...stored, ...updates };
    localStorage.setItem('user', JSON.stringify(merged));
    // Directly mutate the authStore state without importing the module
    // (avoids circular dependency) — we trigger through a custom DOM event
    window.dispatchEvent(new CustomEvent('auth:user-updated', { detail: merged }));
  } catch (e) {
    console.warn('syncUserToAuth failed:', e);
  }
};

const useDashboardStore = create((set, get) => ({
  userSettings: null,
  enrollments: [],
  assignments: [],
  grades: [],
  activities: [],
  isLoading: false,
  error: null,

  fetchDashboardData: async () => {
    set({ isLoading: true, error: null });
    try {
      const token = localStorage.getItem('token');
      if (!token) throw new Error('No token found');

      const response = await axios.get(`${API_URL}/student`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      set({
        userSettings: response.data.user,
        enrollments: response.data.enrollments,
        assignments: response.data.assignments,
        grades: response.data.grades,
        activities: response.data.activities,
        isLoading: false
      });
    } catch (err) {
      console.error('Error fetching dashboard data:', err);
      set({ error: err.response?.data?.msg || err.message, isLoading: false });
    }
  },

  updateSettings: async (settingsData) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) throw new Error('No token found');

      const response = await axios.put(`${API_URL}/settings`, settingsData, {
        headers: { Authorization: `Bearer ${token}` }
      });

      const updates = {
        name: response.data.name,
        bio: response.data.bio,
        avatar: response.data.avatar,
        preferences: response.data.preferences
      };

      // Update dashboardStore state
      const currentUserSettings = get().userSettings || {};
      set({ userSettings: { ...currentUserSettings, ...updates } });

      // ✅ Sync to authStore + localStorage so all navbars/headers update
      syncUserToAuth(updates);

      return true;
    } catch (err) {
      console.error('Error updating settings:', err);
      return false;
    }
  },

  uploadAvatar: async (file) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) throw new Error('No token found');

      const formData = new FormData();
      formData.append('avatar', file);

      const response = await axios.post(`${API_URL}/upload-avatar`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data'
        }
      });

      const avatarUrl = response.data.avatarUrl;

      // Update dashboardStore state
      const currentUserSettings = get().userSettings || {};
      set({ userSettings: { ...currentUserSettings, avatar: avatarUrl } });

      // ✅ Sync avatar to authStore + localStorage immediately
      syncUserToAuth({ avatar: avatarUrl });

      return avatarUrl;
    } catch (err) {
      console.error('Error uploading avatar:', err);
      return null;
    }
  }
}));

export default useDashboardStore;
