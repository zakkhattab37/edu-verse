import { create } from 'zustand';
import axios from 'axios';

const useAuthStore = create((set) => ({
  user: JSON.parse(localStorage.getItem('user')) || null,
  token: localStorage.getItem('token') || null,
  isLoading: false,
  error: null,

  login: async (email, password) => {
    set({ isLoading: true, error: null });
    try {
      const response = await axios.post('http://localhost:5000/api/auth/login', { email, password });
      const { user, token } = response.data;
      localStorage.setItem('user', JSON.stringify(user));
      localStorage.setItem('token', token);
      set({ user, token, isLoading: false });
    } catch (err) {
      set({ error: err.response?.data?.message || 'Login failed', isLoading: false });
      throw err;
    }
  },

  // Extended register: accepts full student profile fields
  register: async (name, email, password, role, extras = {}) => {
    set({ isLoading: true, error: null });
    try {
      await axios.post('http://localhost:5000/api/auth/register', {
        name,
        email,
        password,
        role,
        ...extras  // studentId, category, academicYear, phone
      });
      set({ isLoading: false });
    } catch (err) {
      set({ error: err.response?.data?.message || 'Registration failed', isLoading: false });
      throw err;
    }
  },

  logout: () => {
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    set({ user: null, token: null });
  }
}));

// Listen for external updates to the user object (e.g. from dashboardStore avatar changes)
if (typeof window !== 'undefined') {
  window.addEventListener('auth:user-updated', (e) => {
    useAuthStore.setState({ user: e.detail });
  });
}

export default useAuthStore;
