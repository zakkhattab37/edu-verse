import { create } from 'zustand';
import axios from 'axios';
import useAuthStore from './authStore';

const API = 'http://localhost:5000/api/admin';

const getHeaders = () => {
  const token = useAuthStore.getState().token;
  return { headers: { Authorization: `Bearer ${token}` } };
};

const useAdminStore = create((set, get) => ({
  // ── State ──
  overview: null,
  users: [],
  userTotal: 0,
  userPages: 1,
  courses: [],
  isLoading: false,
  actionLoading: false,
  error: null,

  // ── Overview ──
  fetchOverview: async () => {
    set({ isLoading: true, error: null });
    try {
      const res = await axios.get(`${API}/overview`, getHeaders());
      set({ overview: res.data, isLoading: false });
    } catch (err) {
      set({ error: err.response?.data?.message || 'Failed to load overview', isLoading: false });
    }
  },

  // ── Users ──
  fetchUsers: async (params = {}) => {
    set({ isLoading: true, error: null });
    try {
      const res = await axios.get(`${API}/users`, { ...getHeaders(), params });
      set({ users: res.data.users, userTotal: res.data.total, userPages: res.data.pages, isLoading: false });
    } catch (err) {
      set({ error: err.response?.data?.message || 'Failed to load users', isLoading: false });
    }
  },

  createUser: async (data) => {
    set({ actionLoading: true, error: null });
    try {
      const res = await axios.post(`${API}/users`, data, getHeaders());
      set(s => ({ users: [res.data, ...s.users], actionLoading: false }));
      return res.data;
    } catch (err) {
      set({ actionLoading: false });
      throw err.response?.data?.message || 'Failed to create user';
    }
  },

  updateUser: async (id, data) => {
    set({ actionLoading: true, error: null });
    try {
      const res = await axios.put(`${API}/users/${id}`, data, getHeaders());
      set(s => ({ users: s.users.map(u => u.id === id ? res.data : u), actionLoading: false }));
      return res.data;
    } catch (err) {
      set({ actionLoading: false });
      throw err.response?.data?.message || 'Failed to update user';
    }
  },

  deleteUser: async (id) => {
    set({ actionLoading: true, error: null });
    try {
      await axios.delete(`${API}/users/${id}`, getHeaders());
      set(s => ({ users: s.users.filter(u => u.id !== id), actionLoading: false }));
    } catch (err) {
      set({ actionLoading: false });
      throw err.response?.data?.message || 'Failed to delete user';
    }
  },

  // ── Courses ──
  fetchCourses: async (params = {}) => {
    set({ isLoading: true, error: null });
    try {
      const res = await axios.get(`${API}/courses`, { ...getHeaders(), params });
      set({ courses: res.data.courses, isLoading: false });
    } catch (err) {
      set({ error: err.response?.data?.message || 'Failed to load courses', isLoading: false });
    }
  },

  createCourse: async (data) => {
    set({ actionLoading: true, error: null });
    try {
      const res = await axios.post(`${API}/courses`, data, getHeaders());
      set(s => ({ courses: [res.data, ...s.courses], actionLoading: false }));
      return res.data;
    } catch (err) {
      set({ actionLoading: false });
      throw err.response?.data?.message || 'Failed to create course';
    }
  },

  updateCourse: async (id, data) => {
    set({ actionLoading: true, error: null });
    try {
      const res = await axios.put(`${API}/courses/${id}`, data, getHeaders());
      set(s => ({ courses: s.courses.map(c => c.id === id ? { ...c, ...res.data } : c), actionLoading: false }));
      return res.data;
    } catch (err) {
      set({ actionLoading: false });
      throw err.response?.data?.message || 'Failed to update course';
    }
  },

  deleteCourse: async (id) => {
    set({ actionLoading: true, error: null });
    try {
      await axios.delete(`${API}/courses/${id}`, getHeaders());
      set(s => ({ courses: s.courses.filter(c => c.id !== id), actionLoading: false }));
    } catch (err) {
      set({ actionLoading: false });
      throw err.response?.data?.message || 'Failed to delete course';
    }
  }
}));

export default useAdminStore;
