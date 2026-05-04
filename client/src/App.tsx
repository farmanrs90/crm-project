import { Navigate, Routes, Route } from 'react-router-dom';
import { useEffect } from 'react';
import LoginForm from './pages/LoginForm';
import Dashboard from './pages/Dashboard';
import ProtectedRoute from './components/ProtectedRoute';
import Layout from './layout/Layout';
import LeadsPage from './pages/leads/LeadsPage';
import StudentsPage from './pages/students/StudentsPage';
import StudentDetailPage from './pages/students/StudentDetailPage';
import CoursesPage from './pages/courses/CoursesPage';
import CourseDetailPage from './pages/courses/CourseDetailPage';
import SettingsPage from './pages/settings/SettingsPage';
import GroupsPage from './pages/groups/GroupsPage';
import PaymentsPage from './pages/payments/PaymentsPage';
import PaymentPlansPage from './pages/paymentPlans/PaymentPlansPage';
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
          <Route path="/students/:id" element={<StudentDetailPage />} />
          <Route path="/courses" element={<CoursesPage />} />
          <Route path="/courses/:id" element={<CourseDetailPage />} />
          <Route path="/groups" element={<GroupsPage />} />
          <Route path="/payments" element={<PaymentsPage />} />
          <Route path="/payment-plans" element={<PaymentPlansPage />} />
          <Route path="/settings" element={<SettingsPage />} />
        </Route>
      </Route>

      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  );
}

export default App;