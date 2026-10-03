import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import toast from 'react-hot-toast';
import { Eye, EyeOff, Loader2, GraduationCap, ShieldCheck, User, Mail, Lock, Hash, Building2, UserPlus, Sun, Moon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { motion } from 'framer-motion';
import { fadeUp, fadeIn, MCard } from '@/lib/motion';

export default function Register() {
    const [form, setForm] = useState({ name: '', email: '', password: '', confirm: '', role: 'student', rollNumber: '', hostel: '' });
    const [showPass, setShowPass] = useState(false);
    const [showConfirm, setShowConfirm] = useState(false);
    const [loading, setLoading] = useState(false);
    const { register } = useAuth();
    const { theme, toggleTheme } = useTheme();
    const navigate = useNavigate();
    const isLight = theme === 'light';

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (form.password !== form.confirm) return toast.error('Passwords do not match');
        setLoading(true);
        try {
            await register({ name: form.name, email: form.email, password: form.password, role: form.role, rollNumber: form.rollNumber, hostel: form.hostel });
            toast.success('Account created! Welcome 🎉');
            navigate(form.role === 'admin' ? '/admin' : '/dashboard');
        } catch (err) {
            toast.error(err.response?.data?.message || 'Registration failed');
        } finally {
            setLoading(false);
        }
    };

    const set = (k) => (e) => setForm({ ...form, [k]: e.target.value });

    return (
        <div className="auth-page min-h-screen grid lg:grid-cols-2 bg-background relative overflow-hidden" data-theme={theme}>
            {/* Left Hero Panel */}
            <div className="hidden lg:flex relative flex-col justify-between p-12 overflow-hidden"
                style={{ background: isLight ? 'linear-gradient(135deg, #e4f6e6 0%, #f4faf4 60%, #e4f6e6 100%)' : 'linear-gradient(135deg, #07140c 0%, #0a1a10 60%, #0a1a10 100%)' }}>
                {/* Animated orbs */}
                <div className="absolute inset-0 overflow-hidden pointer-events-none">
                    <div className="absolute top-[15%] left-[10%] w-[450px] h-[450px] rounded-full blur-[110px] animate-float"
                        style={{ background: isLight ? 'rgba(48,154,92,0.12)' : 'rgba(29,116,71,0.15)' }} />
                    <div className="absolute bottom-[10%] right-[5%] w-[350px] h-[350px] rounded-full blur-[100px] animate-float"
                        style={{ background: isLight ? 'rgba(118,199,140,0.08)' : 'rgba(118,199,140,0.12)', animationDelay: '2s' }} />
                    <div className="absolute top-[60%] left-[40%] w-[200px] h-[200px] rounded-full blur-[80px] animate-float"
                        style={{ background: isLight ? 'rgba(48,154,92,0.06)' : 'rgba(48,154,92,0.08)', animationDelay: '1s' }} />
                </div>
                {/* Grid pattern */}
                <div className="absolute inset-0 opacity-5" style={{ backgroundImage: 'linear-gradient(rgba(48,154,92,0.4) 1px, transparent 1px), linear-gradient(90deg, rgba(48,154,92,0.4) 1px, transparent 1px)', backgroundSize: '60px 60px' }} />

                {/* Logo */}
                <motion.div className="relative z-10 flex items-center gap-3" variants={fadeIn} initial="hidden" animate="show" custom={0}>
                    <div className="w-12 h-12 rounded-2xl bg-blue-500/15 border border-blue-500/30 flex items-center justify-center" style={{ boxShadow: '0 0 20px rgba(48,154,92,0.3)' }}>
                        <GraduationCap className="w-6 h-6 text-blue-400" />
                    </div>
                    <span className={`text-2xl font-bold ${isLight ? 'text-slate-800' : 'text-white'}`}>Uniissuehub</span>
                </motion.div>

                {/* Hero Text */}
                <motion.div className="relative z-10" variants={fadeUp} initial="hidden" animate="show" custom={0.2}>
                    <h1 className={`text-5xl font-bold tracking-tight mb-6 leading-tight ${isLight ? 'text-slate-800' : 'text-white'}`}>
                        Your campus,<br />
                        <span style={{ background: 'linear-gradient(135deg, #309a5c, #76c78c)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                            resolved faster.
                        </span>
                    </h1>
                    <p className={`text-lg max-w-md leading-relaxed ${isLight ? 'text-slate-600' : 'text-slate-400'}`}>
                        Create your account and start submitting complaints, tracking resolutions, and staying informed — all in one place.
                    </p>
                    {/* Feature Pills */}
                    <div className="mt-10 flex flex-wrap gap-3">
                        {['🎓 Student Portal', '🔔 Real-time Alerts', '📋 Track Issues', '🔒 Secure & Private'].map(f => (
                            <span key={f} className={`px-3 py-1.5 rounded-full text-xs font-medium border ${isLight ? 'bg-blue-50 border-blue-200 text-slate-600' : 'bg-white/5 border-white/10 text-slate-300'}`}>{f}</span>
                        ))}
                    </div>
                </motion.div>

            </div>

            {/* Right Sign Up Panel */}
            <div className="flex items-center justify-center p-6 relative" style={{ background: isLight ? '#f4faf4' : '#07140c' }}>

                {/* Theme toggle - top right */}
                <button
                    onClick={toggleTheme}
                    className={`absolute top-5 right-5 z-20 w-10 h-10 flex items-center justify-center rounded-xl border transition-all duration-300 hover:scale-105 ${isLight ? 'bg-white border-blue-200 hover:bg-blue-50 shadow-sm' : 'bg-white/5 border-white/10 hover:bg-white/10'}`}
                    title={isLight ? 'Switch to Dark Mode' : 'Switch to Light Mode'}
                >
                    {isLight ? <Moon className="w-4 h-4 text-slate-700" /> : <Sun className="w-4 h-4 text-amber-400" />}
                </button>

                {/* Mobile orbs */}
                <div className="absolute inset-0 overflow-hidden pointer-events-none lg:hidden">
                    <div className="absolute -top-40 -left-40 w-96 h-96 bg-blue-600/15 rounded-full blur-[100px] animate-float" />
                    <div className="absolute -bottom-40 -right-40 w-96 h-96 bg-cyan-600/10 rounded-full blur-[100px] animate-float" style={{ animationDelay: '1.5s' }} />
                </div>

                <div className="w-full max-w-[440px] relative z-10 py-8">
                    {/* Mobile Brand */}
                    <motion.div className="text-center mb-8 lg:hidden" variants={fadeIn} initial="hidden" animate="show" custom={0}>
                        <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-blue-500/15 border border-blue-500/30 mb-4 animate-float" style={{ boxShadow: '0 0 20px rgba(48,154,92,0.3)' }}>
                            <GraduationCap className="w-7 h-7 text-blue-400" />
                        </div>
                        <h1 className={`text-3xl font-bold mb-1 ${isLight ? 'text-slate-800' : 'text-white'}`}>Uniissuehub</h1>
                        <p className={`text-sm ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>Complaint Management Portal</p>
                    </motion.div>

                    <MCard className={` ${isLight ? 'border-blue-200 shadow-lg' : 'border-blue-900/40'}`}
                        style={{ background: isLight ? 'rgba(255,255,255,0.95)' : 'rgba(12, 31, 20, 0.7)', backdropFilter: 'blur(20px)' }} variants={fadeIn} initial="hidden" animate="show" custom={0.1}>
                        <CardHeader className="pb-4">
                            <div className="flex items-center gap-3 mb-1">
                                <div className="w-8 h-8 rounded-xl bg-blue-500/15 border border-blue-500/30 flex items-center justify-center">
                                    <UserPlus className="w-4 h-4 text-blue-400" />
                                </div>
                                <CardTitle className={`text-2xl font-semibold tracking-tight ${isLight ? 'text-slate-800' : 'text-white'}`}>Create Account</CardTitle>
                            </div>
                            <CardDescription className={`text-base ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>Join Uniissuehub — fill in your details below</CardDescription>
                        </CardHeader>
                        <CardContent>
                            {/* Role selector */}
                            <motion.div className={`grid grid-cols-2 gap-2 mb-5 p-1 rounded-xl border ${isLight ? 'border-blue-200 bg-blue-50/50' : 'border-blue-900/30'}`}
                                style={{ background: isLight ? undefined : 'rgba(48,154,92,0.05)' }} variants={fadeUp} initial="hidden" animate="show" custom={0.15}>
                                {[
                                    { role: 'student', icon: GraduationCap, label: 'Student' },
                                    { role: 'admin', icon: ShieldCheck, label: 'Admin' },
                                ].map(({ role, icon: Icon, label }) => (
                                    <motion.button whileTap={{ scale: 0.95 }}
                                        key={role}
                                        type="button"
                                        onClick={() => setForm({ ...form, role })}
                                        className={`flex items-center justify-center gap-2 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 ${form.role === role
                                            ? 'text-white shadow-sm'
                                            : isLight
                                                ? 'text-slate-500 hover:text-blue-600 hover:bg-blue-100'
                                                : 'text-slate-400 hover:text-blue-300 hover:bg-blue-500/10'
                                            }`}
                                        style={form.role === role ? { background: 'linear-gradient(135deg, #1d7447, #125335)', boxShadow: '0 0 15px rgba(48,154,92,0.3)' } : {}}
                                    >
                                        <Icon className="w-4 h-4" /> {label}
                                    </motion.button>
                                ))}
                            </motion.div>

                            <form onSubmit={handleSubmit} className="space-y-4" autoComplete="off">
                                {/* Full Name */}
                                <motion.div className="space-y-2" variants={fadeUp} initial="hidden" animate="show" custom={0.2}>
                                    <Label className={isLight ? 'text-slate-700' : 'text-slate-300'}>Full Name</Label>
                                    <div className="relative group">
                                        <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500 group-focus-within:text-blue-400 transition-colors" />
                                        <Input
                                            placeholder="Your full name"
                                            className={`pl-10 h-12 transition-all focus-visible:ring-blue-500/50 focus-visible:border-blue-500/50 ${isLight ? 'bg-slate-50 border-slate-200 text-slate-800 placeholder:text-slate-400' : 'bg-white/5 border-white/10 text-white placeholder:text-slate-500'}`}
                                            value={form.name}
                                            onChange={set('name')}
                                            required
                                            autoComplete="none"
                                        />
                                    </div>
                                </motion.div>

                                {/* Email */}
                                <motion.div className="space-y-2" variants={fadeUp} initial="hidden" animate="show" custom={0.25}>
                                    <Label className={isLight ? 'text-slate-700' : 'text-slate-300'}>Email Address</Label>
                                    <div className="relative group">
                                        <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500 group-focus-within:text-blue-400 transition-colors" />
                                        <Input
                                            type="email"
                                            placeholder="you@campus.edu"
                                            className={`pl-10 h-12 transition-all focus-visible:ring-blue-500/50 focus-visible:border-blue-500/50 ${isLight ? 'bg-slate-50 border-slate-200 text-slate-800 placeholder:text-slate-400' : 'bg-white/5 border-white/10 text-white placeholder:text-slate-500'}`}
                                            value={form.email}
                                            onChange={set('email')}
                                            required
                                            autoComplete="none"
                                        />
                                    </div>
                                </motion.div>

                                {/* Student-only fields */}
                                {form.role === 'student' && (
                                    <motion.div className="grid grid-cols-2 gap-3" variants={fadeUp} initial="hidden" animate="show" custom={0.3}>
                                        <div className="space-y-2">
                                            <Label className={isLight ? 'text-slate-700' : 'text-slate-300'}>Roll No.</Label>
                                            <div className="relative group">
                                                <Hash className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500 group-focus-within:text-blue-400 transition-colors" />
                                                <Input
                                                    placeholder="2021CS001"
                                                    className={`pl-10 h-12 transition-all focus-visible:ring-blue-500/50 focus-visible:border-blue-500/50 ${isLight ? 'bg-slate-50 border-slate-200 text-slate-800 placeholder:text-slate-400' : 'bg-white/5 border-white/10 text-white placeholder:text-slate-500'}`}
                                                    value={form.rollNumber}
                                                    onChange={set('rollNumber')}
                                                    autoComplete="none"
                                                />
                                            </div>
                                        </div>
                                        <div className="space-y-2">
                                            <Label className={isLight ? 'text-slate-700' : 'text-slate-300'}>Hostel</Label>
                                            <div className="relative group">
                                                <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500 group-focus-within:text-blue-400 transition-colors" />
                                                <Input
                                                    placeholder="Block A"
                                                    className={`pl-10 h-12 transition-all focus-visible:ring-blue-500/50 focus-visible:border-blue-500/50 ${isLight ? 'bg-slate-50 border-slate-200 text-slate-800 placeholder:text-slate-400' : 'bg-white/5 border-white/10 text-white placeholder:text-slate-500'}`}
                                                    value={form.hostel}
                                                    onChange={set('hostel')}
                                                    autoComplete="none"
                                                />
                                            </div>
                                        </div>
                                    </motion.div>
                                )}

                                {/* Password */}
                                <motion.div className="space-y-2" variants={fadeUp} initial="hidden" animate="show" custom={0.35}>
                                    <Label className={isLight ? 'text-slate-700' : 'text-slate-300'}>Password</Label>
                                    <div className="relative group">
                                        <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500 group-focus-within:text-blue-400 transition-colors" />
                                        <Input
                                            type={showPass ? 'text' : 'password'}
                                            placeholder="Min 6 characters"
                                            className={`pl-10 pr-10 h-12 transition-all focus-visible:ring-blue-500/50 focus-visible:border-blue-500/50 ${isLight ? 'bg-slate-50 border-slate-200 text-slate-800 placeholder:text-slate-400' : 'bg-white/5 border-white/10 text-white placeholder:text-slate-500'}`}
                                            value={form.password}
                                            onChange={set('password')}
                                            required
                                            minLength={6}
                                            autoComplete="new-password"
                                        />
                                        <button type="button" onClick={() => setShowPass(!showPass)}
                                            className={`absolute right-3 top-1/2 -translate-y-1/2 transition-colors ${isLight ? 'text-slate-400 hover:text-slate-700' : 'text-slate-500 hover:text-white'}`}>
                                            {showPass ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                                        </button>
                                    </div>
                                </motion.div>

                                {/* Confirm Password */}
                                <motion.div className="space-y-2" variants={fadeUp} initial="hidden" animate="show" custom={0.4}>
                                    <Label className={isLight ? 'text-slate-700' : 'text-slate-300'}>Confirm Password</Label>
                                    <div className="relative group">
                                        <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500 group-focus-within:text-blue-400 transition-colors" />
                                        <Input
                                            type={showConfirm ? 'text' : 'password'}
                                            placeholder="Repeat your password"
                                            className={`pl-10 pr-10 h-12 transition-all focus-visible:ring-blue-500/50 focus-visible:border-blue-500/50 ${isLight ? 'bg-slate-50 border-slate-200 text-slate-800 placeholder:text-slate-400' : 'bg-white/5 border-white/10 text-white placeholder:text-slate-500'}`}
                                            value={form.confirm}
                                            onChange={set('confirm')}
                                            required
                                            autoComplete="new-password"
                                        />
                                        <button type="button" onClick={() => setShowConfirm(!showConfirm)}
                                            className={`absolute right-3 top-1/2 -translate-y-1/2 transition-colors ${isLight ? 'text-slate-400 hover:text-slate-700' : 'text-slate-500 hover:text-white'}`}>
                                            {showConfirm ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                                        </button>
                                    </div>
                                </motion.div>

                                {/* Password match indicator */}
                                {form.password && form.confirm && (
                                    <motion.div className={`flex items-center gap-2 text-xs px-3 py-2 rounded-lg border ${form.password === form.confirm
                                        ? 'text-emerald-600 bg-emerald-50 border-emerald-200'
                                        : 'text-red-500 bg-red-50 border-red-200'
                                        }`} variants={fadeIn} initial="hidden" animate="show" custom={0}>
                                        <span>{form.password === form.confirm ? '✓ Passwords match' : '✗ Passwords do not match'}</span>
                                    </motion.div>
                                )}

                                {/* Submit */}
                                <Button
                                    type="submit"
                                    className="w-full h-12 mt-2 font-semibold text-base transition-all duration-300 animate-slide-up hover:-translate-y-0.5 text-white"
                                    style={{ background: 'linear-gradient(135deg, #1d7447, #125335)', boxShadow: '0 0 20px rgba(48,154,92,0.3)', animationDelay: '0.45s' }}
                                    disabled={loading}
                                >
                                    {loading ? <><Loader2 className="w-5 h-5 animate-spin mr-2" /> Creating account...</> : 'Create Account →'}
                                </Button>
                            </form>

                            <p className={`text-center text-sm mt-6 animate-slide-up ${isLight ? 'text-slate-500' : 'text-slate-500'}`} style={{ animationDelay: '0.5s' }}>
                                Already have an account?{' '}
                                <Link to="/login" className="text-blue-500 hover:text-blue-400 font-medium transition-colors hover:underline underline-offset-4">
                                    Sign in
                                </Link>
                            </p>
                        </CardContent>
                    </MCard>
                </div>
            </div>
        </div>
    );
}
