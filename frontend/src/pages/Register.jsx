import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';
import { Eye, EyeOff, Loader2, GraduationCap, ShieldCheck, User, Mail, Lock, Hash, Building2, Sparkles, UserPlus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';

export default function Register() {
    const [form, setForm] = useState({ name: '', email: '', password: '', confirm: '', role: 'student', rollNumber: '', hostel: '' });
    const [showPass, setShowPass] = useState(false);
    const [showConfirm, setShowConfirm] = useState(false);
    const [loading, setLoading] = useState(false);
    const { register } = useAuth();
    const navigate = useNavigate();

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
        <div className="min-h-screen grid lg:grid-cols-2 bg-background relative overflow-hidden">
            {/* Left Hero Panel */}
            <div className="hidden lg:flex relative flex-col justify-between p-12 overflow-hidden" style={{ background: 'linear-gradient(135deg, #020b18 0%, #040f1e 60%, #050d1c 100%)' }}>
                {/* Animated orbs */}
                <div className="absolute inset-0 overflow-hidden pointer-events-none">
                    <div className="absolute top-[15%] left-[10%] w-[450px] h-[450px] bg-blue-600/15 rounded-full blur-[110px] animate-float" />
                    <div className="absolute bottom-[10%] right-[5%] w-[350px] h-[350px] bg-cyan-600/12 rounded-full blur-[100px] animate-float" style={{ animationDelay: '2s' }} />
                    <div className="absolute top-[60%] left-[40%] w-[200px] h-[200px] bg-blue-500/8 rounded-full blur-[80px] animate-float" style={{ animationDelay: '1s' }} />
                </div>
                {/* Grid pattern */}
                <div className="absolute inset-0 opacity-5" style={{ backgroundImage: 'linear-gradient(rgba(59,130,246,0.4) 1px, transparent 1px), linear-gradient(90deg, rgba(59,130,246,0.4) 1px, transparent 1px)', backgroundSize: '60px 60px' }} />

                {/* Logo */}
                <div className="relative z-10 flex items-center gap-3 animate-fade-in">
                    <div className="w-12 h-12 rounded-2xl bg-blue-500/15 border border-blue-500/30 flex items-center justify-center" style={{ boxShadow: '0 0 20px rgba(59,130,246,0.3)' }}>
                        <GraduationCap className="w-6 h-6 text-blue-400" />
                    </div>
                    <span className="text-2xl font-bold text-white">Campus<span className="text-blue-400">Desk</span></span>
                </div>

                {/* Hero Text */}
                <div className="relative z-10 animate-slide-up" style={{ animationDelay: '0.2s' }}>
                    <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/20 text-xs text-blue-300 font-medium mb-6">
                        <Sparkles className="w-3.5 h-3.5" /> Join thousands of students already on the platform
                    </div>
                    <h1 className="text-5xl font-bold tracking-tight mb-6 text-white leading-tight">
                        Your campus,<br />
                        <span style={{ background: 'linear-gradient(135deg, #3b82f6, #06b6d4)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                            resolved faster.
                        </span>
                    </h1>
                    <p className="text-lg text-slate-400 max-w-md leading-relaxed">
                        Create your account and start submitting complaints, tracking resolutions, and staying informed — all in one place.
                    </p>
                    {/* Feature Pills */}
                    <div className="mt-10 flex flex-wrap gap-3">
                        {['🎓 Student Portal', '🔔 Real-time Alerts', '📋 Track Issues', '🔒 Secure & Private'].map(f => (
                            <span key={f} className="px-3 py-1.5 rounded-full text-xs font-medium bg-white/5 border border-white/10 text-slate-300">{f}</span>
                        ))}
                    </div>
                </div>

                {/* Bottom quote */}
                <div className="relative z-10 animate-fade-in" style={{ animationDelay: '0.4s' }}>
                    <div className="p-4 rounded-2xl border border-blue-900/30" style={{ background: 'rgba(59,130,246,0.05)' }}>
                        <p className="text-slate-400 text-sm italic">"CampusDesk transformed how we handle complaints. Issues that took weeks now get resolved in days."</p>
                        <p className="text-blue-400 text-xs font-medium mt-2">— Hostel Warden, Block C</p>
                    </div>
                </div>
            </div>

            {/* Right Sign Up Panel */}
            <div className="flex items-center justify-center p-6 relative" style={{ background: '#030e1c' }}>
                {/* Mobile orbs */}
                <div className="absolute inset-0 overflow-hidden pointer-events-none lg:hidden">
                    <div className="absolute -top-40 -left-40 w-96 h-96 bg-blue-600/15 rounded-full blur-[100px] animate-float" />
                    <div className="absolute -bottom-40 -right-40 w-96 h-96 bg-cyan-600/10 rounded-full blur-[100px] animate-float" style={{ animationDelay: '1.5s' }} />
                </div>

                <div className="w-full max-w-[440px] relative z-10 py-8">
                    {/* Mobile Brand */}
                    <div className="text-center mb-8 lg:hidden animate-fade-in">
                        <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-blue-500/15 border border-blue-500/30 mb-4 animate-float" style={{ boxShadow: '0 0 20px rgba(59,130,246,0.3)' }}>
                            <GraduationCap className="w-7 h-7 text-blue-400" />
                        </div>
                        <h1 className="text-3xl font-bold text-white mb-1">Campus<span className="text-blue-400">Desk</span></h1>
                        <p className="text-slate-400 text-sm">Complaint Management Portal</p>
                    </div>

                    <Card className="border-blue-900/40 animate-fade-in" style={{ background: 'rgba(8, 20, 40, 0.7)', backdropFilter: 'blur(20px)', animationDelay: '0.1s' }}>
                        <CardHeader className="pb-4">
                            <div className="flex items-center gap-3 mb-1">
                                <div className="w-8 h-8 rounded-xl bg-blue-500/15 border border-blue-500/30 flex items-center justify-center">
                                    <UserPlus className="w-4 h-4 text-blue-400" />
                                </div>
                                <CardTitle className="text-2xl font-semibold tracking-tight text-white">Create Account</CardTitle>
                            </div>
                            <CardDescription className="text-base text-slate-400">Join CampusDesk — fill in your details below</CardDescription>
                        </CardHeader>
                        <CardContent>
                            {/* Role selector */}
                            <div className="grid grid-cols-2 gap-2 mb-5 p-1 rounded-xl border border-blue-900/30 animate-slide-up" style={{ background: 'rgba(59,130,246,0.05)', animationDelay: '0.15s' }}>
                                {[
                                    { role: 'student', icon: GraduationCap, label: 'Student' },
                                    { role: 'admin', icon: ShieldCheck, label: 'Admin' },
                                ].map(({ role, icon: Icon, label }) => (
                                    <button
                                        key={role}
                                        type="button"
                                        onClick={() => setForm({ ...form, role })}
                                        className={`flex items-center justify-center gap-2 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 ${form.role === role
                                                ? 'text-white shadow-sm'
                                                : 'text-slate-400 hover:text-blue-300 hover:bg-blue-500/10'
                                            }`}
                                        style={form.role === role ? { background: 'linear-gradient(135deg, #2563eb, #1d4ed8)', boxShadow: '0 0 15px rgba(59,130,246,0.3)' } : {}}
                                    >
                                        <Icon className="w-4 h-4" /> {label}
                                    </button>
                                ))}
                            </div>

                            <form onSubmit={handleSubmit} className="space-y-4">
                                {/* Full Name */}
                                <div className="space-y-2 animate-slide-up" style={{ animationDelay: '0.2s' }}>
                                    <Label className="text-slate-300">Full Name</Label>
                                    <div className="relative group">
                                        <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500 group-focus-within:text-blue-400 transition-colors" />
                                        <Input
                                            placeholder="Your full name"
                                            className="pl-10 h-12 bg-white/5 border-white/10 text-white placeholder:text-slate-500 focus-visible:ring-blue-500/50 focus-visible:border-blue-500/50 transition-all"
                                            value={form.name}
                                            onChange={set('name')}
                                            required
                                        />
                                    </div>
                                </div>

                                {/* Email */}
                                <div className="space-y-2 animate-slide-up" style={{ animationDelay: '0.25s' }}>
                                    <Label className="text-slate-300">Email Address</Label>
                                    <div className="relative group">
                                        <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500 group-focus-within:text-blue-400 transition-colors" />
                                        <Input
                                            type="email"
                                            placeholder="you@campus.edu"
                                            className="pl-10 h-12 bg-white/5 border-white/10 text-white placeholder:text-slate-500 focus-visible:ring-blue-500/50 focus-visible:border-blue-500/50 transition-all"
                                            value={form.email}
                                            onChange={set('email')}
                                            required
                                        />
                                    </div>
                                </div>

                                {/* Student-only fields */}
                                {form.role === 'student' && (
                                    <div className="grid grid-cols-2 gap-3 animate-slide-up" style={{ animationDelay: '0.3s' }}>
                                        <div className="space-y-2">
                                            <Label className="text-slate-300">Roll No.</Label>
                                            <div className="relative group">
                                                <Hash className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500 group-focus-within:text-blue-400 transition-colors" />
                                                <Input
                                                    placeholder="2021CS001"
                                                    className="pl-10 h-12 bg-white/5 border-white/10 text-white placeholder:text-slate-500 focus-visible:ring-blue-500/50 focus-visible:border-blue-500/50 transition-all"
                                                    value={form.rollNumber}
                                                    onChange={set('rollNumber')}
                                                />
                                            </div>
                                        </div>
                                        <div className="space-y-2">
                                            <Label className="text-slate-300">Hostel</Label>
                                            <div className="relative group">
                                                <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500 group-focus-within:text-blue-400 transition-colors" />
                                                <Input
                                                    placeholder="Block A"
                                                    className="pl-10 h-12 bg-white/5 border-white/10 text-white placeholder:text-slate-500 focus-visible:ring-blue-500/50 focus-visible:border-blue-500/50 transition-all"
                                                    value={form.hostel}
                                                    onChange={set('hostel')}
                                                />
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {/* Password */}
                                <div className="space-y-2 animate-slide-up" style={{ animationDelay: '0.35s' }}>
                                    <Label className="text-slate-300">Password</Label>
                                    <div className="relative group">
                                        <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500 group-focus-within:text-blue-400 transition-colors" />
                                        <Input
                                            type={showPass ? 'text' : 'password'}
                                            placeholder="Min 6 characters"
                                            className="pl-10 pr-10 h-12 bg-white/5 border-white/10 text-white placeholder:text-slate-500 focus-visible:ring-blue-500/50 focus-visible:border-blue-500/50 transition-all"
                                            value={form.password}
                                            onChange={set('password')}
                                            required
                                            minLength={6}
                                        />
                                        <button type="button" onClick={() => setShowPass(!showPass)}
                                            className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-white transition-colors">
                                            {showPass ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                                        </button>
                                    </div>
                                </div>

                                {/* Confirm Password */}
                                <div className="space-y-2 animate-slide-up" style={{ animationDelay: '0.4s' }}>
                                    <Label className="text-slate-300">Confirm Password</Label>
                                    <div className="relative group">
                                        <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500 group-focus-within:text-blue-400 transition-colors" />
                                        <Input
                                            type={showConfirm ? 'text' : 'password'}
                                            placeholder="Repeat your password"
                                            className="pl-10 pr-10 h-12 bg-white/5 border-white/10 text-white placeholder:text-slate-500 focus-visible:ring-blue-500/50 focus-visible:border-blue-500/50 transition-all"
                                            value={form.confirm}
                                            onChange={set('confirm')}
                                            required
                                        />
                                        <button type="button" onClick={() => setShowConfirm(!showConfirm)}
                                            className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-white transition-colors">
                                            {showConfirm ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                                        </button>
                                    </div>
                                </div>

                                {/* Password match indicator */}
                                {form.password && form.confirm && (
                                    <div className={`flex items-center gap-2 text-xs px-3 py-2 rounded-lg border animate-fade-in ${form.password === form.confirm
                                            ? 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20'
                                            : 'text-red-400 bg-red-500/10 border-red-500/20'
                                        }`}>
                                        <span>{form.password === form.confirm ? '✓ Passwords match' : '✗ Passwords do not match'}</span>
                                    </div>
                                )}

                                {/* Submit */}
                                <Button
                                    type="submit"
                                    className="w-full h-12 mt-2 font-semibold text-base transition-all duration-300 animate-slide-up hover:-translate-y-0.5 text-white"
                                    style={{ background: 'linear-gradient(135deg, #2563eb, #1d4ed8)', boxShadow: '0 0 20px rgba(59,130,246,0.3)', animationDelay: '0.45s' }}
                                    disabled={loading}
                                >
                                    {loading ? <><Loader2 className="w-5 h-5 animate-spin mr-2" /> Creating account...</> : 'Create Account →'}
                                </Button>
                            </form>

                            <p className="text-center text-sm text-slate-500 mt-6 animate-slide-up" style={{ animationDelay: '0.5s' }}>
                                Already have an account?{' '}
                                <Link to="/login" className="text-blue-400 hover:text-blue-300 font-medium transition-colors hover:underline underline-offset-4">
                                    Sign in
                                </Link>
                            </p>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}
