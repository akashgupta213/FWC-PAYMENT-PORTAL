import { Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider }   from './context/AuthContext';
import { AssetsProvider } from './context/AssetsContext';
import ProtectedRoute  from './components/ProtectedRoute';
import AdminRoute      from './components/AdminRoute';
import Login           from './pages/Login';
import AdminLogin      from './pages/AdminLogin';
import Register        from './pages/Register';
import Payment         from './pages/Payment';
import Confirmation    from './pages/Confirmation';
import AdminDashboard  from './pages/AdminDashboard';
import AdminRegister from './pages/AdminRegister';
import PaymentHistory  from './pages/PaymentHistory';

export default function App() {
  return (
    <AuthProvider>
      <AssetsProvider>
        <Routes>
          <Route path="/"             element={<Navigate to="/login" replace />} />
          <Route path="/login"        element={<Login />} />
            <Route path="/admin/register" element={<AdminRegister />} />
          <Route path="/admin-login"  element={<AdminLogin />} />
          <Route path="/register"     element={<Register />} />
          <Route path="/payment"      element={<ProtectedRoute><Payment /></ProtectedRoute>} />
          <Route path="/confirmation" element={<ProtectedRoute><Confirmation /></ProtectedRoute>} />
          <Route path="/history"      element={<ProtectedRoute><PaymentHistory /></ProtectedRoute>} />
          <Route path="/admin"        element={<AdminRoute><AdminDashboard /></AdminRoute>} />
          <Route path="*"             element={<Navigate to="/login" replace />} />
        </Routes>
      </AssetsProvider>
    </AuthProvider>
  );
}