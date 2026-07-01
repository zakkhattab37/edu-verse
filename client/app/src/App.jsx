import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import useAuthStore from './store/authStore';
import Landing from './pages/Landing';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import InstructorDashboard from './pages/InstructorDashboard';
import AdminDashboard from './pages/AdminDashboard';
import CourseCreationWizard from './pages/CourseCreationWizard';
import CourseWorkspace from './pages/CourseWorkspace';
import SubjectPortalOverview from './pages/SubjectPortalOverview';
import CourseDownloadsPage from './pages/CourseDownloadsPage';
import StudentAnalyticsDashboard from './pages/StudentAnalyticsDashboard';
import StudentProfessionalProfile from './pages/StudentProfessionalProfile';
import InstructorProfessionalProfile from './pages/InstructorProfessionalProfile';
import QuizInterface from './pages/QuizInterface';
import AiLearningAssistant from './pages/AiLearningAssistant';
import AiStudyWorkspace1 from './pages/AiStudyWorkspace1';
import AiStudyWorkspace2 from './pages/AiStudyWorkspace2';
import StudentWelcome from './pages/StudentWelcome';
import StudentHome from './pages/StudentHome';
import NotFoundPage from './pages/NotFoundPage';

function App() {
  const { user } = useAuthStore();

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/login" element={!user ? <Login /> : <Navigate to="/welcome" />} />
        
        {/* Welcome Routing based on Role */}
        <Route path="/welcome" element={
            !user ? <Navigate to="/login" /> : 
            user.role === 'Admin' ? <Navigate to="/admin" /> :
            user.role === 'Instructor' ? <Navigate to="/instructor" /> :
            <Navigate to="/home" />
        } />

        {/* Student Home Page */}
        <Route path="/home" element={
            !user ? <Navigate to="/login" /> :
            user.role !== 'Student' ? <Navigate to="/dashboard" /> :
            <StudentHome />
        } />

        {/* Dynamic Dashboard Routing based on Role */}
        <Route path="/dashboard" element={
            !user ? <Navigate to="/login" /> : 
            user.role === 'Admin' ? <Navigate to="/admin" /> :
            user.role === 'Instructor' ? <Navigate to="/instructor" /> :
            <Dashboard />
        } />
        
        <Route path="/instructor" element={user?.role === 'Instructor' || user?.role === 'Admin' ? <InstructorDashboard /> : <Navigate to="/dashboard" />} />
        <Route path="/admin" element={user?.role === 'Admin' ? <AdminDashboard /> : <Navigate to="/dashboard" />} />
        
        {/* General Application Routes */}
        <Route path="/course-creation" element={<CourseCreationWizard />} />
        <Route path="/course-workspace" element={<CourseWorkspace />} />
        <Route path="/course-workspace/:id" element={<CourseWorkspace />} />
        <Route path="/subject-portal" element={<SubjectPortalOverview />} />
        <Route path="/course-downloads" element={<CourseDownloadsPage />} />
        <Route path="/student-analytics" element={<StudentAnalyticsDashboard />} />
        <Route path="/student-profile" element={<StudentProfessionalProfile />} />
        <Route path="/instructor-profile" element={<InstructorProfessionalProfile />} />
        
        {/* Additional Features */}
        <Route path="/quiz" element={<QuizInterface />} />
        <Route path="/ai-assistant" element={<AiLearningAssistant />} />
        <Route path="/ai-workspace-1" element={<AiStudyWorkspace1 />} />
        <Route path="/ai-workspace-2" element={<AiStudyWorkspace2 />} />
        
        {/* Catch-all 404 Route */}
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </Router>
  );
}

export default App;
