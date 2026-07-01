import { create } from 'zustand';
import axios from 'axios';
import useAuthStore from './authStore';

const API = 'http://localhost:5000/api';

const getHeaders = () => {
  const token = useAuthStore.getState().token;
  return { headers: { Authorization: `Bearer ${token}` } };
};

const useInstructorStore = create((set, get) => ({
  // --- State ---
  dashboardData: null,
  students: [],
  isLoading: false,
  studentsLoading: false,
  error: null,

  // --- Actions ---

  fetchInstructorDashboard: async () => {
    set({ isLoading: true, error: null });
    try {
      const res = await axios.get(`${API}/dashboard/instructor`, getHeaders());
      set({ dashboardData: res.data, isLoading: false });
    } catch (err) {
      set({ error: err.response?.data?.message || 'Failed to load dashboard', isLoading: false });
    }
  },

  fetchInstructorStudents: async () => {
    set({ studentsLoading: true, error: null });
    try {
      const res = await axios.get(`${API}/dashboard/instructor/students`, getHeaders());
      set({ students: res.data.students, studentsLoading: false });
    } catch (err) {
      set({ error: err.response?.data?.message || 'Failed to load students', studentsLoading: false });
    }
  },

  gradeSubmission: async (submissionId, score) => {
    try {
      const res = await axios.put(
        `${API}/submissions/${submissionId}/grade`,
        { score, status: 'graded' },
        getHeaders()
      );
      // Refresh dashboard to update pending tasks count
      await get().fetchInstructorDashboard();
      return res.data;
    } catch (err) {
      throw err.response?.data?.message || 'Failed to grade submission';
    }
  },

  sendMessage: async (studentId, title, message) => {
    try {
      const res = await axios.post(
        `${API}/dashboard/instructor/message/${studentId}`,
        { title, message },
        getHeaders()
      );
      return res.data;
    } catch (err) {
      throw err.response?.data?.message || 'Failed to send message';
    }
  },

  updateStudentCategory: async (studentId, courseId, category, courseRole) => {
    try {
      const res = await axios.put(
        `${API}/dashboard/instructor/students/${studentId}/category`,
        { courseId, category, courseRole },
        getHeaders()
      );
      // Update locally in students array
      set(state => ({
        students: state.students.map(s => {
          if (s.id !== studentId) return s;
          return {
            ...s,
            enrollments: s.enrollments.map(e =>
              e.courseId === courseId ? { ...e, category, courseRole } : e
            )
          };
        })
      }));
      return res.data;
    } catch (err) {
      throw err.response?.data?.message || 'Failed to update student category';
    }
  },

  createCourse: async (courseData) => {
    try {
      const res = await axios.post(`${API}/courses`, courseData, getHeaders());
      // Refresh dashboard
      await get().fetchInstructorDashboard();
      return res.data;
    } catch (err) {
      throw err.response?.data?.message || 'Failed to create course';
    }
  }
}));

export default useInstructorStore;
