import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import './index.css';

// User pages
import HomePage from './pages/user/HomePage';
import BranchesPage from './pages/user/BranchesPage';
import PitchesPage from './pages/user/PitchesPage';
import BookingPage from './pages/user/BookingPage';
import MyBookingsPage from './pages/user/MyBookingsPage';
import LoginPage from './pages/user/LoginPage';
import RegisterPage from './pages/user/RegisterPage';

// Admin pages
import AdminDashboard from './pages/admin/AdminDashboard';
import BranchManage from './pages/admin/BranchManage';
import PitchManage from './pages/admin/PitchManage';
import ScheduleManage from './pages/admin/ScheduleManage';
import ServiceManage from './pages/admin/ServiceManage';
import PromotionManage from './pages/admin/PromotionManage';
import BookingManage from './pages/admin/BookingManage';

// Guards
import ProtectedRoute from './components/ProtectedRoute';

export default function App() {
  return (
    <BrowserRouter>
      <Toaster
        position="top-right"
        toastOptions={{
          style: {
            background: 'var(--bg-card)',
            color: 'var(--text-primary)',
            border: '1px solid var(--border-strong)',
            borderRadius: '12px',
            fontSize: '0.88rem',
          },
          success: { iconTheme: { primary: '#16a34a', secondary: '#fff' } },
        }}
      />
      <Routes>
        {/* Public user routes */}
        <Route path="/" element={<HomePage />} />
        <Route path="/branches" element={<BranchesPage />} />
        <Route path="/pitches" element={<PitchesPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />

        {/* Protected user routes */}
        <Route path="/booking/:pitchId" element={<ProtectedRoute><BookingPage /></ProtectedRoute>} />
        <Route path="/my-bookings" element={<ProtectedRoute><MyBookingsPage /></ProtectedRoute>} />

        {/* Admin routes */}
        <Route path="/admin" element={<ProtectedRoute adminOnly><AdminDashboard /></ProtectedRoute>} />
        <Route path="/admin/branches" element={<ProtectedRoute adminOnly><BranchManage /></ProtectedRoute>} />
        <Route path="/admin/pitches" element={<ProtectedRoute adminOnly><PitchManage /></ProtectedRoute>} />
        <Route path="/admin/schedules" element={<ProtectedRoute adminOnly><ScheduleManage /></ProtectedRoute>} />
        <Route path="/admin/services" element={<ProtectedRoute adminOnly><ServiceManage /></ProtectedRoute>} />
        <Route path="/admin/promotions" element={<ProtectedRoute adminOnly><PromotionManage /></ProtectedRoute>} />
        <Route path="/admin/bookings" element={<ProtectedRoute adminOnly><BookingManage /></ProtectedRoute>} />

        {/* Fallback */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
