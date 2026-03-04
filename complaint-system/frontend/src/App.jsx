import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider, useAuth } from './context/AuthContext';

import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import SubmitComplaint from './pages/SubmitComplaint';
import MyComplaints from './pages/MyComplaints';
import AdminDashboard from './pages/AdminDashboard';
import AdminComplaints from './pages/AdminComplaints';
import TechnicianDashboard from './pages/TechnicianDashboard';
import WardenDashboard from './pages/WardenDashboard';

// Helper to get home path for a role
const getHome = (role) => {
    if (role === 'admin') return '/admin';
    if (role === 'warden') return '/warden';
    if (role === 'technician') return '/technician';
    return '/dashboard';
};

// Require login
function RequireAuth({ children }) {
    const { user, loading } = useAuth();
    if (loading) return (
        <div className="min-h-screen bg-bg-dark flex items-center justify-center">
            <div className="w-10 h-10 border-2 border-purple-600 border-t-transparent rounded-full animate-spin" />
        </div>
    );
    return user ? children : <Navigate to="/login" replace />;
}

// Require specific roles
function RequireRole({ children, roles }) {
    const { user, loading } = useAuth();
    if (loading) return null;
    if (!user) return <Navigate to="/login" replace />;
    if (!roles.includes(user.role)) return <Navigate to={getHome(user.role)} replace />;
    return children;
}

// Redirect logged-in users away from guest pages
function GuestOnly({ children }) {
    const { user, loading } = useAuth();
    if (loading) return null;
    if (user) return <Navigate to={getHome(user.role)} replace />;
    return children;
}

function AppRoutes() {
    return (
        <Routes>
            <Route path="/" element={<Navigate to="/login" replace />} />
            <Route path="/login" element={<GuestOnly><Login /></GuestOnly>} />
            <Route path="/register" element={<GuestOnly><Register /></GuestOnly>} />

            {/* Student routes */}
            <Route path="/dashboard" element={<RequireRole roles={['student']}><Dashboard /></RequireRole>} />
            <Route path="/submit" element={<RequireRole roles={['student']}><SubmitComplaint /></RequireRole>} />
            <Route path="/my-complaints" element={<RequireRole roles={['student']}><MyComplaints /></RequireRole>} />

            {/* Admin routes */}
            <Route path="/admin" element={<RequireRole roles={['admin']}><AdminDashboard /></RequireRole>} />
            <Route path="/admin/dashboard" element={<RequireRole roles={['admin']}><AdminDashboard /></RequireRole>} />
            <Route path="/admin/complaints" element={<RequireRole roles={['admin']}><AdminComplaints /></RequireRole>} />

            {/* Technician routes */}
            <Route path="/technician" element={<RequireRole roles={['technician']}><TechnicianDashboard /></RequireRole>} />

            {/* Warden routes */}
            <Route path="/warden" element={<RequireRole roles={['warden']}><WardenDashboard /></RequireRole>} />
            <Route path="/warden/complaints" element={<RequireRole roles={['warden']}><WardenDashboard /></RequireRole>} />

            {/* Fallback */}
            <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
    );
}

export default function App() {
    return (
        <BrowserRouter>
            <AuthProvider>
                <Toaster
                    position="top-right"
                    toastOptions={{
                        style: {
                            background: '#1e1b2e',
                            color: '#e2e0f0',
                            border: '1px solid #2d2a40',
                        },
                        success: { iconTheme: { primary: '#a855f7', secondary: '#fff' } },
                        error: { iconTheme: { primary: '#ef4444', secondary: '#fff' } },
                    }}
                />
                <AppRoutes />
            </AuthProvider>
        </BrowserRouter>
    );
}
