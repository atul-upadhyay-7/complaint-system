import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AnimatePresence } from 'framer-motion';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import { SocketProvider } from './context/SocketContext';
import CommandBar from './components/CommandBar';
import AnimatedPage from './components/AnimatedPage';

import Login from './pages/Login';
import Register from './pages/Register';
import LandingPage from './pages/LandingPage';
import Dashboard from './pages/Dashboard';
import SubmitComplaint from './pages/SubmitComplaint';
import MyComplaints from './pages/MyComplaints';
import AdminDashboard from './pages/AdminDashboard';
import AdminComplaints from './pages/AdminComplaints';
import TechnicianDashboard from './pages/TechnicianDashboard';
import WardenDashboard from './pages/WardenDashboard';
import ForgotPassword from './pages/ForgotPassword';
import ResetPassword from './pages/ResetPassword';
import Notifications from './pages/Notifications';

const getHome = (role) => {
    if (role === 'admin') return '/admin';
    if (role === 'warden') return '/warden';
    if (role === 'technician') return '/technician';
    return '/dashboard';
};

function RequireAuth({ children }) {
    const { user, loading } = useAuth();
    if (loading) return (
        <div className="min-h-screen bg-background flex items-center justify-center">
            <div className="flex flex-col items-center gap-4">
                <div className="w-12 h-12 rounded-full border-2 border-blue-500 border-t-transparent animate-spin" />
                <p className="text-sm text-muted-foreground animate-pulse">Loading...</p>
            </div>
        </div>
    );
    return user ? children : <Navigate to="/login" replace />;
}

function RequireRole({ children, roles }) {
    const { user, loading } = useAuth();
    if (loading) return null;
    if (!user) return <Navigate to="/login" replace />;
    if (!roles.includes(user.role)) return <Navigate to={getHome(user.role)} replace />;
    return children;
}

function GuestOnly({ children }) {
    const { user, loading } = useAuth();
    if (loading) return null;
    if (user) return <Navigate to={getHome(user.role)} replace />;
    return children;
}

function AppRoutes() {
    const location = useLocation();
    return (
        <AnimatePresence mode="wait">
            <Routes location={location} key={location.pathname}>
                <Route path="/" element={<GuestOnly><AnimatedPage><LandingPage /></AnimatedPage></GuestOnly>} />
                <Route path="/login" element={<GuestOnly><AnimatedPage><Login /></AnimatedPage></GuestOnly>} />
                <Route path="/register" element={<GuestOnly><AnimatedPage><Register /></AnimatedPage></GuestOnly>} />
                <Route path="/forgot-password" element={<GuestOnly><AnimatedPage><ForgotPassword /></AnimatedPage></GuestOnly>} />
                <Route path="/reset-password/:token" element={<GuestOnly><AnimatedPage><ResetPassword /></AnimatedPage></GuestOnly>} />

                {/* Shared Authenticated Routes */}
                <Route path="/notifications" element={<RequireAuth><AnimatedPage><Notifications /></AnimatedPage></RequireAuth>} />

                {/* Student routes */}
                <Route path="/dashboard" element={<RequireRole roles={['student']}><AnimatedPage><Dashboard /></AnimatedPage></RequireRole>} />
                <Route path="/submit" element={<RequireRole roles={['student']}><AnimatedPage><SubmitComplaint /></AnimatedPage></RequireRole>} />
                <Route path="/my-complaints" element={<RequireRole roles={['student']}><AnimatedPage><MyComplaints /></AnimatedPage></RequireRole>} />

                {/* Admin routes */}
                <Route path="/admin" element={<RequireRole roles={['admin']}><AnimatedPage><AdminDashboard /></AnimatedPage></RequireRole>} />
                <Route path="/admin/dashboard" element={<RequireRole roles={['admin']}><AnimatedPage><AdminDashboard /></AnimatedPage></RequireRole>} />
                <Route path="/admin/complaints" element={<RequireRole roles={['admin']}><AnimatedPage><AdminComplaints /></AnimatedPage></RequireRole>} />

                {/* Technician routes */}
                <Route path="/technician" element={<RequireRole roles={['technician']}><AnimatedPage><TechnicianDashboard /></AnimatedPage></RequireRole>} />

                {/* Warden routes */}
                <Route path="/warden" element={<RequireRole roles={['warden']}><AnimatedPage><WardenDashboard /></AnimatedPage></RequireRole>} />
                <Route path="/warden/complaints" element={<RequireRole roles={['warden']}><WardenDashboard /></RequireRole>} />

                <Route path="*" element={<Navigate to="/login" replace />} />
            </Routes>
        </AnimatePresence>
    );
}

export default function App() {
    return (
        <BrowserRouter>
            <ThemeProvider>
                <AuthProvider>
                    <SocketProvider>
                        <Toaster
                            position="top-right"
                            toastOptions={{
                                style: {
                                    background: 'rgba(10,20,40,0.85)',
                                    color: '#e2e8f0',
                                    border: '1px solid rgba(59,130,246,0.2)',
                                    backdropFilter: 'blur(16px)',
                                },
                                success: { iconTheme: { primary: '#3b82f6', secondary: '#fff' } },
                                error: { iconTheme: { primary: '#ef4444', secondary: '#fff' } },
                            }}
                        />
                        <CommandBar />
                        <AppRoutes />
                    </SocketProvider>
                </AuthProvider>
            </ThemeProvider>
        </BrowserRouter>
    );
}
