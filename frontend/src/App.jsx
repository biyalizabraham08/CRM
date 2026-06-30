import { BrowserRouter as Router, Routes, Route, Outlet } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';

import AuthLayout from './layouts/AuthLayout';
import MainLayout from './layouts/MainLayout';

import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';
import DashboardPage from './pages/DashboardPage';
import LeadListPage from './pages/LeadListPage';
import LeadFormPage from './pages/LeadFormPage';
import LeadDetailsPage from './pages/LeadDetailsPage';
import EmployeeListPage from './pages/EmployeeListPage';
import FollowupListPage from './pages/FollowupListPage';

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<LandingPage />} />
          
          <Route element={<AuthLayout />}>
            <Route path="/login" element={<LoginPage />} />
          </Route>

          {/* Protected Routes */}
          <Route element={<ProtectedRoute><MainLayout /></ProtectedRoute>}>
            <Route path="/dashboard" element={<DashboardPage />} />
            <Route path="/leads" element={<LeadListPage />} />
            <Route path="/leads/:id" element={<LeadDetailsPage />} />
            <Route path="/followups" element={<FollowupListPage />} />

            <Route element={<ProtectedRoute adminOnly={true}><Outlet /></ProtectedRoute>}>
              <Route path="/leads/new" element={<LeadFormPage />} />
              <Route path="/leads/:id/edit" element={<LeadFormPage />} />
              <Route path="/employees" element={<EmployeeListPage />} />
            </Route>
          </Route>
        </Routes>
      </Router>
      <ToastContainer position="top-right" autoClose={3000} />
    </AuthProvider>
  );
}

export default App;
