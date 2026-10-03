import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import toast from 'react-hot-toast';
import { Eye, EyeOff, Loader2, GraduationCap, Lock, Mail, ShieldCheck, Sparkles, Wrench, UserCheck, Sun, Moon, Zap, Clock, CheckCircle, TrendingUp, Bell, Users } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';

const FEATURE_CARDS = [
    { icon: Zap, title: 'Real-time Updates', desc: 'Instant status push via WebSockets', color: '#f59e0b' },
    { icon: Bell, title: 'Email Alerts', desc: 'Auto-notifications on every change', color: '#3b82f6' },
    { icon: Sparkles, title: 'AI Categorization', desc: 'Smart complaint auto-tagging', color: '#8b5cf6' },
    { icon: Users, title: 'Role-based Access', desc: 'Student, Warden, Tech, Admin', color: '#10b981' },
];

export default function Login() {
    const [form, setForm] = useState({ email: '', password: '' });
    const [showPass, setShowPass] = useState(false);
    const [loading, setLoading] = useState(false);
    const { login } = useAuth();
    const { theme, toggleTheme } = useTheme();
    const navigate = useNavigate();
    const isLight = theme === 'light';

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const user = await login(form.email, form.password);
            toast.success(`Welcome back, ${user.name}! 👋`);
            if (user.role === 'admin') navigate('/admin');
            else if (user.role === 'warden') navigate('/warden');
            else if (user.role === 'technician') navigate('/technician');
            else navigate('/dashboard');
        } catch (err) {
            toast.error(err.response?.data?.message || 'Invalid credentials');
        } finally {
            setLoading(false);
        }
    };

    const fillDemo = (role) => {
        const creds = {
            admin: { email: 'admin@campus.edu', password: 'admin123' },
            student: { email: 'student@campus.edu', password: 'student123' },
            technician: { email: 'tech@campus.edu', password: 'tech123' },
            warden: { email: 'warden@campus.edu', password: 'warden123' },
        };
        setForm(creds[role] || creds.student);
    };

    return (
        <div className="auth-page min-h-screen grid lg:grid-cols-2 bg-background relative overflow-hidden" data-theme={theme}>
            {/* ── LEFT HERO PANEL ── */}
            <div className="hidden lg:flex relative flex-col justify-between p-12 overflow-hidden" style={{ background: isLight ? 'linear-gradient(135deg, #e0eeff 0%, #f0f5ff 40%, #eef2ff 70%, #e8f5ff 100%)' : 'linear-gradient(135deg, #020b18 0%, #040f1e 60%, #050d1c 100%)' }}>

                {/* Background orbs */}
                <div className="absolute inset-0 overflow-hidden pointer-events-none">
                    <div className="absolute top-[5%] left-[-5%] w-[500px] h-[500px] rounded-full blur-[120px] animate-float" style={{ background: isLight ? 'rgba(59,130,246,0.18)' : 'rgba(37,99,235,0.18)' }} />
                    <div className="absolute bottom-[-5%] right-[-5%] w-[400px] h-[400px] rounded-full blur-[110px] animate-float" style={{ background: isLight ? 'rgba(139,92,246,0.14)' : 'rgba(139,92,246,0.14)', animationDelay: '2s' }} />
                    <div className="absolute top-[40%] left-[40%] w-[300px] h-[300px] rounded-full blur-[100px] animate-float" style={{ background: isLight ? 'rgba(6,182,212,0.12)' : 'rgba(6,182,212,0.10)', animationDelay: '3s' }} />
                </div>

                {/* Grid pattern - more visible in light mode */}
                <div className="absolute inset-0" style={{ backgroundImage: `linear-gradient(rgba(59,130,246,${isLight ? '0.07' : '0.04'}) 1px, transparent 1px), linear-gradient(90deg, rgba(59,130,246,${isLight ? '0.07' : '0.04'}) 1px, transparent 1px)`, backgroundSize: '60px 60px' }} />

                {/* Logo */}
                <div className="relative z-10 flex items-center justify-between animate-fade-in">
                    <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-2xl bg-blue-500/15 border border-blue-500/30 flex items-center justify-center" style={{ boxShadow: '0 0 20px rgba(59,130,246,0.35)' }}>
                            <GraduationCap className="w-6 h-6 text-blue-400" />
                        </div>
                        <span className={`text-2xl font-bold ${isLight ? 'text-slate-800' : 'text-white'}`}>Uniissuehub</span>
                    </div>
                    {/* Hackathon badge */}
                    <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold" style={isLight ? { background: 'linear-gradient(135deg, #7c3aed, #4f46e5)', color: 'white', boxShadow: '0 2px 12px rgba(124,58,237,0.35)' } : { background: 'linear-gradient(135deg, rgba(139,92,246,0.2), rgba(59,130,246,0.2))', border: '1px solid rgba(139,92,246,0.3)', color: '#a78bfa' }}>
                        <Sparkles className="w-3 h-3" /> Campus workspace
                    </div>
                </div>

                {/* Hero Text + Content */}
                <div className="relative z-10 animate-slide-up" style={{ animationDelay: '0.2s' }}>
                    <div className="mb-6">
                        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold mb-5" style={isLight ? { background: 'linear-gradient(135deg, #dcfce7, #d1fae5)', border: '1.5px solid #6ee7b7', color: '#065f46' } : { background: 'rgba(16,185,129,0.15)', border: '1px solid rgba(16,185,129,0.3)', color: '#34d399' }}>
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse inline-block" />
                            A shared space for campus issues
                        </div>
                        <h1 className={`text-5xl font-bold tracking-tight mb-5 leading-tight ${isLight ? 'text-slate-800' : 'text-white'}`}>
                            Resolve campus<br />
                            <span style={{ background: 'linear-gradient(135deg, #3b82f6, #06b6d4, #8b5cf6)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                                issues together.
                            </span>
                        </h1>
                        <p className={`text-base max-w-md leading-relaxed ${isLight ? 'text-slate-600' : 'text-slate-400'}`}>
                            A unified platform bridging the gap between students and administration. Track, manage, and resolve complaints with <strong className="text-blue-400">real-time notifications</strong>.
                        </p>
                    </div>

                    {/* Live Stats */}


                    {/* Feature Cards Grid */}
                    <div className="grid grid-cols-2 gap-3">
                        {FEATURE_CARDS.map(({ icon: Icon, title, desc, color }) => (
                            <div key={title}
                                className="flex items-start gap-3 p-3.5 rounded-xl transition-all duration-300 group hover:scale-[1.02] cursor-default"
                                style={isLight ? {
                                    background: 'white',
                                    border: `1.5px solid ${color}30`,
                                    boxShadow: `0 2px 12px ${color}15, 0 1px 3px rgba(0,0,0,0.05)`,
                                } : {
                                    background: `linear-gradient(135deg, ${color}10, rgba(255,255,255,0.03))`,
                                    border: `1px solid ${color}25`,
                                    boxShadow: `0 2px 10px ${color}10`,
                                }}>
                                <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5" style={{ background: `${color}20`, border: `1.5px solid ${color}40` }}>
                                    <Icon className="w-4 h-4" style={{ color }} />
                                </div>
                                <div>
                                    <p className={`text-xs font-bold ${isLight ? 'text-slate-800' : 'text-white'}`}>{title}</p>
                                    <p className={`text-[11px] mt-0.5 leading-snug ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>{desc}</p>
                                </div>
                            </div>
                        ))}
                    </div>


                </div>
            </div>

            {/* ── RIGHT LOGIN PANEL ── */}
            <div className="flex items-center justify-center p-6 relative" style={{ background: isLight ? '#f0f7ff' : '#030e1c' }}>
                {/* Theme toggle */}
                <button onClick={toggleTheme}
                    className={`absolute top-5 right-5 z-20 w-10 h-10 flex items-center justify-center rounded-xl border transition-all duration-300 hover:scale-105 ${isLight ? 'bg-white border-blue-200 text-amber-500 hover:bg-blue-50 shadow-sm' : 'bg-white/5 border-white/10 text-amber-400 hover:bg-white/10'}`}
                    title={isLight ? 'Switch to Dark Mode' : 'Switch to Light Mode'}>
                    {isLight ? <Moon className="w-4 h-4 text-slate-700" /> : <Sun className="w-4 h-4 text-amber-400" />}
                </button>

                {/* Mobile orbs */}
                <div className="absolute inset-0 overflow-hidden pointer-events-none lg:hidden">
                    <div className="absolute -top-40 -left-40 w-96 h-96 bg-blue-600/15 rounded-full blur-[100px] animate-float" />
                    <div className="absolute -bottom-40 -right-40 w-96 h-96 bg-cyan-600/10 rounded-full blur-[100px] animate-float" style={{ animationDelay: '1.5s' }} />
                </div>

                <div className="w-full max-w-[420px] relative z-10">
                    {/* Mobile Brand */}
                    <div className="text-center mb-8 lg:hidden animate-fade-in">
                        <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-blue-500/15 border border-blue-500/30 mb-4 animate-float" style={{ boxShadow: '0 0 20px rgba(59,130,246,0.3)' }}>
                            <GraduationCap className="w-7 h-7 text-blue-400" />
                        </div>
                        <h1 className={`text-3xl font-bold mb-1 ${isLight ? 'text-slate-800' : 'text-white'}`}>Uniissuehub</h1>
                        <p className={`text-sm ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>Complaint Management Portal</p>
                    </div>

                    <Card className={`animate-fade-in ${isLight ? 'border-blue-200 shadow-lg' : 'border-blue-900/40'}`} style={{ background: isLight ? 'rgba(255,255,255,0.9)' : 'rgba(8, 20, 40, 0.7)', backdropFilter: 'blur(20px)', animationDelay: '0.1s' }}>
                        <CardHeader className="pb-4 text-center lg:text-left">
                            <CardTitle className={`text-2xl font-semibold tracking-tight ${isLight ? 'text-slate-800' : 'text-white'}`}>Sign In</CardTitle>
                            <CardDescription className={`text-base ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>Enter your campus credentials to continue</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <form onSubmit={handleSubmit} className="space-y-4">
                                <div className="space-y-2 animate-slide-up" style={{ animationDelay: '0.2s' }}>
                                    <Label className={isLight ? 'text-slate-700' : 'text-slate-300'}>Email Address</Label>
                                    <div className="relative group">
                                        <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500 group-focus-within:text-blue-400 transition-colors" />
                                        <Input type="email" placeholder="you@campus.edu"
                                            className={`pl-10 h-12 transition-all focus-visible:ring-blue-500/50 focus-visible:border-blue-500/50 ${isLight ? 'bg-slate-50 border-slate-200 text-slate-800 placeholder:text-slate-400' : 'bg-white/5 border-white/10 text-white placeholder:text-slate-500'}`}
                                            value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} required />
                                    </div>
                                </div>

                                <div className="space-y-2 animate-slide-up" style={{ animationDelay: '0.3s' }}>
                                    <Label className={isLight ? 'text-slate-700' : 'text-slate-300'}>Password</Label>
                                    <div className="relative group">
                                        <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500 group-focus-within:text-blue-400 transition-colors" />
                                        <Input type={showPass ? 'text' : 'password'} placeholder="••••••••"
                                            className={`pl-10 pr-10 h-12 transition-all focus-visible:ring-blue-500/50 focus-visible:border-blue-500/50 ${isLight ? 'bg-slate-50 border-slate-200 text-slate-800 placeholder:text-slate-400' : 'bg-white/5 border-white/10 text-white placeholder:text-slate-500'}`}
                                            value={form.password} onChange={e => setForm({ ...form, password: e.target.value })} required />
                                        <button type="button" onClick={() => setShowPass(!showPass)}
                                            className={`absolute right-3 top-1/2 -translate-y-1/2 transition-colors ${isLight ? 'text-slate-400 hover:text-slate-700' : 'text-slate-500 hover:text-white'}`}>
                                            {showPass ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                                        </button>
                                    </div>
                                    <div className="flex justify-end mt-1">
                                        <Link to="/forgot-password" className={`text-xs font-medium hover:underline transition-colors ${isLight ? 'text-blue-600' : 'text-blue-400'}`}>
                                            Forgot your password?
                                        </Link>
                                    </div>
                                </div>

                                <Button type="submit"
                                    className="w-full h-12 mt-2 font-semibold text-base transition-all duration-300 animate-slide-up hover:-translate-y-0.5 text-white"
                                    style={{ background: 'linear-gradient(135deg, #2563eb, #1d4ed8)', boxShadow: '0 0 20px rgba(59,130,246,0.3)', animationDelay: '0.4s' }}
                                    disabled={loading}>
                                    {loading ? <><Loader2 className="w-5 h-5 animate-spin mr-2" /> Signing in...</> : 'Sign In →'}
                                </Button>
                            </form>

                            {/* Demo credentials */}
                            <div className={`mt-6 p-4 rounded-xl border animate-slide-up ${isLight ? 'border-blue-200 bg-blue-50/50' : 'border-blue-900/40'}`} style={{ background: isLight ? undefined : 'rgba(59,130,246,0.05)', animationDelay: '0.5s' }}>
                                <p className={`text-xs font-medium mb-3 text-center tracking-widest uppercase ${isLight ? 'text-slate-400' : 'text-slate-500'}`}>Demo Accounts</p>
                                <div className="grid grid-cols-2 gap-2">
                                    {[
                                        { role: 'student', icon: GraduationCap, label: 'Student' },
                                        { role: 'admin', icon: ShieldCheck, label: 'Admin' },
                                        { role: 'technician', icon: Wrench, label: 'Technician' },
                                        { role: 'warden', icon: UserCheck, label: 'Warden' },
                                    ].map(({ role, icon: Icon, label }) => (
                                        <button key={role} onClick={() => fillDemo(role)}
                                            className={`flex items-center justify-center gap-2 rounded-lg py-2.5 px-3 text-sm font-medium border transition-all duration-300 hover:-translate-y-0.5 ${isLight ? 'border-slate-200 text-slate-500 hover:border-blue-400 hover:bg-blue-50 hover:text-blue-600' : 'border-white/10 text-slate-400 hover:border-blue-500/40 hover:bg-blue-500/10 hover:text-blue-300'}`}>
                                            <Icon className="w-4 h-4" /> {label}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <p className={`text-center text-sm mt-6 animate-slide-up ${isLight ? 'text-slate-500' : 'text-slate-500'}`} style={{ animationDelay: '0.6s' }}>
                                No account?{' '}
                                <Link to="/register" className="text-blue-500 hover:text-blue-400 font-medium transition-colors hover:underline underline-offset-4">
                                    Create one
                                </Link>
                            </p>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}
