import { create } from 'zustand';
import axios from 'axios';

const API_URL = 'http://localhost:5000/api/dashboard';

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
        headers: {
          Authorization: `Bearer ${token}`
        }
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
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      // Update local state with the new settings
      const currentUserSettings = get().userSettings || {};
      set({
        userSettings: {
          ...currentUserSettings,
          name: response.data.name,
          bio: response.data.bio,
          avatar: response.data.avatar,
          preferences: response.data.preferences
        }
      });
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

      // Update local state with the new avatar URL
      const currentUserSettings = get().userSettings || {};
      set({
        userSettings: {
          ...currentUserSettings,
          avatar: response.data.avatarUrl
        }
      });
      return response.data.avatarUrl;
    } catch (err) {
      console.error('Error uploading avatar:', err);
      return null;
    }
  }
}));

export default useDashboardStore;
