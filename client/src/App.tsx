import { Navigate, Routes, Route } from 'react-router-dom';
import { useEffect } from 'react';
import LoginForm from './pages/LoginForm';
import Dashboard from './pages/Dashboard';
import ProtectedRoute from './components/ProtectedRoute';
import Layout from './layout/Layout';
import LeadsPage from './pages/leads/LeadsPage';
import StudentsPage from './pages/students/StudentsPage';
import CoursesPage from './pages/courses/CoursesPage';
import SettingsPage from './pages/settings/SettingsPage';
import { useAuthStore } from './store/authStore';

function App() {
  const { token, getCurrentUser } = useAuthStore();

  useEffect(() => {
    if (token) {
      getCurrentUser().catch(() => {
        // Token invalid or expired
      });
    }
  }, [token, getCurrentUser]);

  return (
    <Routes>
      <Route path="/" element={<Navigate to="/dashboard" replace />} />
      <Route path="/login" element={<LoginForm />} />

      <Route element={<ProtectedRoute />}>
        <Route element={<Layout />}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/leads" element={<LeadsPage />} />
          <Route path="/students" element={<StudentsPage />} />
          <Route path="/courses" element={<CoursesPage />} />
          <Route path="/settings" element={<SettingsPage />} />
        </Route>
      </Route>

      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  );
}

export default App;