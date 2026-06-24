import { create } from 'zustand';
import axios from 'axios';
import useAuthStore from './authStore';

const API_URL = 'http://localhost:5000/api/courses';

const useCourseStore = create((set, get) => ({
  courses: [],
  enrollments: [],
  currentCourse: null,
  isLoading: false,
  error: null,

  // Helper to get auth headers
  getAuthHeaders: () => {
    const token = useAuthStore.getState().token;
    return { headers: { Authorization: `Bearer ${token}` } };
  },

  // Fetch all courses (for Admin/Instructor views)
  fetchCourses: async () => {
    set({ isLoading: true, error: null });
    try {
      const res = await axios.get(API_URL);
      set({ courses: res.data, isLoading: false });
    } catch (err) {
      set({ error: err.response?.data?.message || 'Failed to fetch courses', isLoading: false });
    }
  },

  // Fetch a single course by ID
  fetchCourseById: async (id) => {
    set({ isLoading: true, error: null, currentCourse: null });
    try {
      const res = await axios.get(`${API_URL}/${id}`);
      set({ currentCourse: res.data, isLoading: false });
    } catch (err) {
      set({ error: err.response?.data?.message || 'Failed to fetch course details', isLoading: false });
    }
  },

  // Fetch student enrollments
  fetchEnrollments: async () => {
    set({ isLoading: true, error: null });
    try {
      const res = await axios.get(`${API_URL}/student/enrollments`, get().getAuthHeaders());
      set({ enrollments: res.data, isLoading: false });
    } catch (err) {
      set({ error: err.response?.data?.message || 'Failed to fetch enrollments', isLoading: false });
    }
  },

  // Create a new course (Instructor/Admin)
  createCourse: async (courseData) => {
    set({ isLoading: true, error: null });
    try {
      const res = await axios.post(API_URL, courseData, get().getAuthHeaders());
      set(state => ({ courses: [...state.courses, res.data], isLoading: false }));
      return res.data;
    } catch (err) {
      set({ error: err.response?.data?.message || 'Failed to create course', isLoading: false });
      throw err;
    }
  },

  // Enroll in a course (Student)
  enrollInCourse: async (courseId) => {
    set({ isLoading: true, error: null });
    try {
      const res = await axios.post(`${API_URL}/${courseId}/enroll`, {}, get().getAuthHeaders());
      // Refresh enrollments after successful enrollment
      await get().fetchEnrollments();
      return res.data;
    } catch (err) {
      set({ error: err.response?.data?.message || 'Failed to enroll', isLoading: false });
      throw err;
    }
  }
}));

export default useCourseStore;
