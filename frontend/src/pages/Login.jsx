import { useState, useEffect, useRef } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import toast from 'react-hot-toast';
import { Eye, EyeOff, Loader2, GraduationCap, Lock, Mail, ShieldCheck, Sparkles, Wrench, UserCheck, Sun, Moon, Zap, Clock, CheckCircle, TrendingUp, Bell, Users } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';

// Animated counter hook
function useCountUp(target, duration = 1800, start = false) {
    const [count, setCount] = useState(0);
    useEffect(() => {
        if (!start) return;
        let startTime = null;
        const step = (timestamp) => {
            if (!startTime) startTime = timestamp;
            const progress = Math.min((timestamp - startTime) / duration, 1);
            // Ease-out cubic
            const eased = 1 - Math.pow(1 - progress, 3);
            setCount(Math.floor(eased * target));
            if (progress < 1) requestAnimationFrame(step);
        };
        requestAnimationFrame(step);
    }, [start, target, duration]);
    return count;
}

// Floating particle dot
function Particle({ style }) {
    return <div className="absolute rounded-full animate-float" style={style} />;
}

// Activity feed items
const ACTIVITIES = [
    { icon: '✅', text: 'WiFi issue in Block C resolved', time: '2m ago', color: '#10b981' },
    { icon: '🔔', text: 'New complaint: Broken light in hallway', time: '5m ago', color: '#3b82f6' },
    { icon: '🛠️', text: 'Suresh Kumar assigned to plumbing task', time: '8m ago', color: '#f59e0b' },
    { icon: '📧', text: 'Email sent to Anshika for status update', time: '12m ago', color: '#8b5cf6' },
    { icon: '✅', text: 'Water supply issue marked resolved', time: '15m ago', color: '#10b981' },
    { icon: '🔔', text: 'Electricity failure in Room 204', time: '18m ago', color: '#ef4444' },
];

function LiveActivityTicker() {
    const [index, setIndex] = useState(0);
    const [visible, setVisible] = useState(true);

    useEffect(() => {
        const interval = setInterval(() => {
            setVisible(false);
            setTimeout(() => {
                setIndex(i => (i + 1) % ACTIVITIES.length);
                setVisible(true);
            }, 400);
        }, 2500);
        return () => clearInterval(interval);
    }, []);

    const item = ACTIVITIES[index];
    return (
        <div className="flex items-center gap-3 px-4 py-3 rounded-xl border border-white/10 bg-white/5 backdrop-blur-sm">
            <div className="w-2 h-2 rounded-full animate-pulse flex-shrink-0" style={{ background: item.color, boxShadow: `0 0 8px ${item.color}` }} />
            <div style={{ transition: 'opacity 0.4s', opacity: visible ? 1 : 0 }} className="flex-1 min-w-0">
                <p className="text-xs text-slate-300 truncate">{item.icon} {item.text}</p>
                <p className="text-[10px] text-slate-500 mt-0.5">{item.time}</p>
            </div>
        </div>
    );
}

function StatCard({ value, suffix, label, icon: Icon, delay, animate, color }) {
    const count = useCountUp(value, 1800, animate);
    return (
        <div
            className="flex flex-col items-center justify-center p-4 rounded-2xl border transition-all duration-500 animate-fade-in relative overflow-hidden group cursor-default"
            style={{
                animationDelay: `${delay}s`,
                background: 'rgba(255,255,255,0.04)',
                border: '1px solid rgba(255,255,255,0.08)',
                backdropFilter: 'blur(12px)',
            }}
        >
            <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-2xl" style={{ background: `radial-gradient(circle at center, ${color}15, transparent 70%)` }} />
            <Icon className="w-5 h-5 mb-2" style={{ color }} />
            <span className="text-3xl font-bold tabular-nums" style={{ background: `linear-gradient(135deg, ${color}, white)`, WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                {count}{suffix}
            </span>
            <span className="text-xs font-medium mt-1 text-center leading-tight text-slate-400">{label}</span>
        </div>
    );
}

function LiveStats() {
    const ref = useRef(null);
    const [visible, setVisible] = useState(false);
    useEffect(() => {
        const observer = new IntersectionObserver(([entry]) => { if (entry.isIntersecting) setVisible(true); }, { threshold: 0.2 });
        if (ref.current) observer.observe(ref.current);
        return () => observer.disconnect();
    }, []);

    const stats = [
        { value: 1240, suffix: '+', label: 'Resolved', icon: CheckCircle, delay: 0.3, color: '#10b981' },
        { value: 98, suffix: '%', label: 'Success Rate', icon: TrendingUp, delay: 0.45, color: '#3b82f6' },
        { value: 24, suffix: 'h', label: 'Avg Response', icon: Clock, delay: 0.6, color: '#f59e0b' },
    ];

    return (
        <div ref={ref} className="mt-8 mb-6">
            <div className="grid grid-cols-3 gap-3">
                {stats.map(s => <StatCard key={s.label} {...s} animate={visible} />)}
            </div>
        </div>
    );
}

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

    // Particles array
    const particles = [
        { width: 6, height: 6, top: '12%', left: '8%', background: 'rgba(59,130,246,0.6)', animationDelay: '0s', animationDuration: '4s' },
        { width: 4, height: 4, top: '22%', left: '78%', background: 'rgba(6,182,212,0.5)', animationDelay: '1s', animationDuration: '5s' },
        { width: 8, height: 8, top: '55%', left: '15%', background: 'rgba(139,92,246,0.5)', animationDelay: '2s', animationDuration: '6s' },
        { width: 5, height: 5, top: '75%', left: '70%', background: 'rgba(16,185,129,0.5)', animationDelay: '0.5s', animationDuration: '4.5s' },
        { width: 3, height: 3, top: '40%', left: '90%', background: 'rgba(245,158,11,0.6)', animationDelay: '1.5s', animationDuration: '5.5s' },
        { width: 7, height: 7, top: '88%', left: '30%', background: 'rgba(59,130,246,0.4)', animationDelay: '2.5s', animationDuration: '4s' },
    ];

    return (
        <div className="min-h-screen grid lg:grid-cols-2 bg-background relative overflow-hidden" data-theme={theme}>
            {/* ── LEFT HERO PANEL ── */}
            <div className="hidden lg:flex relative flex-col justify-between p-12 overflow-hidden" style={{ background: isLight ? 'linear-gradient(135deg, #dbeafe 0%, #eff6ff 60%, #e0f2fe 100%)' : 'linear-gradient(135deg, #020b18 0%, #040f1e 60%, #050d1c 100%)' }}>

                {/* Background orbs */}
                <div className="absolute inset-0 overflow-hidden pointer-events-none">
                    <div className="absolute top-[5%] left-[-5%] w-[500px] h-[500px] rounded-full blur-[120px] animate-float" style={{ background: isLight ? 'rgba(59,130,246,0.12)' : 'rgba(37,99,235,0.18)' }} />
                    <div className="absolute bottom-[-5%] right-[-5%] w-[400px] h-[400px] rounded-full blur-[110px] animate-float" style={{ background: isLight ? 'rgba(6,182,212,0.08)' : 'rgba(139,92,246,0.14)', animationDelay: '2s' }} />
                    <div className="absolute top-[40%] left-[40%] w-[300px] h-[300px] rounded-full blur-[100px] animate-float" style={{ background: isLight ? 'rgba(16,185,129,0.06)' : 'rgba(6,182,212,0.10)', animationDelay: '3s' }} />
                </div>

                {/* Grid pattern */}
                <div className="absolute inset-0 opacity-5" style={{ backgroundImage: 'linear-gradient(rgba(59,130,246,0.4) 1px, transparent 1px), linear-gradient(90deg, rgba(59,130,246,0.4) 1px, transparent 1px)', backgroundSize: '60px 60px' }} />

                {/* Floating particles */}
                {!isLight && particles.map((p, i) => (
                    <Particle key={i} style={{ ...p, position: 'absolute', borderRadius: '50%', animationDuration: p.animationDuration, animationDelay: p.animationDelay }} />
                ))}

                {/* Logo */}
                <div className="relative z-10 flex items-center justify-between animate-fade-in">
                    <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-2xl bg-blue-500/15 border border-blue-500/30 flex items-center justify-center" style={{ boxShadow: '0 0 20px rgba(59,130,246,0.35)' }}>
                            <GraduationCap className="w-6 h-6 text-blue-400" />
                        </div>
                        <span className={`text-2xl font-bold ${isLight ? 'text-slate-800' : 'text-white'}`}>UniIssue<span className="text-blue-500">Hub</span></span>
                    </div>
                    {/* Hackathon badge */}
                    <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold border" style={{ background: 'linear-gradient(135deg, rgba(139,92,246,0.2), rgba(59,130,246,0.2))', border: '1px solid rgba(139,92,246,0.3)', color: '#a78bfa' }}>
                        <Sparkles className="w-3 h-3" /> EliteCoder Hackathon
                    </div>
                </div>

                {/* Hero Text + Content */}
                <div className="relative z-10 animate-slide-up" style={{ animationDelay: '0.2s' }}>
                    <div className="mb-6">
                        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold mb-5" style={{ background: 'rgba(16,185,129,0.15)', border: '1px solid rgba(16,185,129,0.3)', color: '#34d399' }}>
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse inline-block" />
                            Live Platform · All Systems Operational
                        </div>
                        <h1 className={`text-5xl font-bold tracking-tight mb-5 leading-tight ${isLight ? 'text-slate-800' : 'text-white'}`}>
                            Resolve campus<br />
                            <span style={{ background: 'linear-gradient(135deg, #3b82f6, #06b6d4, #8b5cf6)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                                issues instantly.
                            </span>
                        </h1>
                        <p className={`text-base max-w-md leading-relaxed ${isLight ? 'text-slate-600' : 'text-slate-400'}`}>
                            A unified platform bridging the gap between students and administration. Track, manage, and resolve complaints with <strong className="text-blue-400">real-time notifications</strong>.
                        </p>
                    </div>

                    {/* Live Stats */}
                    <LiveStats />

                    {/* Feature Cards Grid */}
                    <div className="grid grid-cols-2 gap-3 mb-6">
                        {FEATURE_CARDS.map(({ icon: Icon, title, desc, color }) => (
                            <div key={title}
                                className={`flex items-start gap-3 p-3.5 rounded-xl border transition-all duration-300 group hover:scale-[1.02] cursor-default ${isLight ? 'bg-white/70 border-slate-200' : 'bg-white/4 border-white/8'}`}
                                style={{ backdropFilter: 'blur(8px)' }}>
                                <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5" style={{ background: `${color}20`, border: `1px solid ${color}35` }}>
                                    <Icon className="w-4 h-4" style={{ color }} />
                                </div>
                                <div>
                                    <p className={`text-xs font-bold ${isLight ? 'text-slate-700' : 'text-white'}`}>{title}</p>
                                    <p className="text-[11px] text-slate-500 mt-0.5 leading-snug">{desc}</p>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Live Activity Ticker */}
                    <div className={`rounded-xl overflow-hidden border ${isLight ? 'border-slate-200 bg-slate-50' : 'border-white/8 bg-white/3'}`}>
                        <div className={`px-4 py-2 border-b flex items-center gap-2 ${isLight ? 'border-slate-200' : 'border-white/8'}`}>
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                            <span className="text-[10px] font-semibold uppercase tracking-widest text-slate-500">Live Activity</span>
                        </div>
                        <div className="p-3">
                            <LiveActivityTicker />
                        </div>
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
                        <h1 className={`text-3xl font-bold mb-1 ${isLight ? 'text-slate-800' : 'text-white'}`}>UniIssue<span className="text-blue-500">Hub</span></h1>
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
