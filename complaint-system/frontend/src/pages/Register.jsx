import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';
import { Eye, EyeOff, Loader2, GraduationCap, ShieldCheck, User, Mail, Lock, Hash, Building2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';

export default function Register() {
    const [form, setForm] = useState({ name: '', email: '', password: '', confirm: '', role: 'student', rollNumber: '', hostel: '' });
    const [showPass, setShowPass] = useState(false);
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
        <div className="min-h-screen flex items-center justify-center relative overflow-hidden bg-background py-12">
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute -top-40 -right-40 w-96 h-96 bg-purple-600/20 rounded-full blur-3xl" />
                <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-purple-800/15 rounded-full blur-3xl" />
            </div>

            <div className="relative z-10 w-full max-w-md px-4 animate-fade-in">
                <div className="text-center mb-8">
                    <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl glass-purple mb-4">
                        <GraduationCap className="w-8 h-8 text-purple-400" />
                    </div>
                    <h1 className="text-3xl font-bold text-gradient mb-1">UniIssuehub</h1>
                    <p className="text-muted-foreground text-sm">Create your account</p>
                </div>

                <Card className="border-border/50 shadow-glass">
                    <CardHeader className="pb-4">
                        <CardTitle className="text-xl">Sign Up</CardTitle>
                        <CardDescription>Fill in your details to get started</CardDescription>
                    </CardHeader>
                    <CardContent>
                        {/* Role selector */}
                        <div className="grid grid-cols-2 gap-2 mb-5 p-1 bg-secondary rounded-xl">
                            {['student', 'admin'].map(r => (
                                <button key={r} type="button" onClick={() => setForm({ ...form, role: r })}
                                    className={`flex items-center justify-center gap-2 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${form.role === r ? 'bg-purple-600 text-white shadow-sm' : 'text-muted-foreground hover:text-foreground'}`}>
                                    {r === 'student' ? <GraduationCap className="w-4 h-4" /> : <ShieldCheck className="w-4 h-4" />}
                                    {r.charAt(0).toUpperCase() + r.slice(1)}
                                </button>
                            ))}
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-3.5">
                            <div className="space-y-1.5">
                                <Label>Full Name</Label>
                                <div className="relative">
                                    <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                    <Input placeholder="Your full name" className="pl-10" value={form.name} onChange={set('name')} required />
                                </div>
                            </div>

                            <div className="space-y-1.5">
                                <Label>Email Address</Label>
                                <div className="relative">
                                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                    <Input type="email" placeholder="you@campus.edu" className="pl-10" value={form.email} onChange={set('email')} required />
                                </div>
                            </div>

                            {form.role === 'student' && (
                                <div className="grid grid-cols-2 gap-3">
                                    <div className="space-y-1.5">
                                        <Label>Roll No.</Label>
                                        <div className="relative">
                                            <Hash className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                            <Input placeholder="2021CS001" className="pl-10" value={form.rollNumber} onChange={set('rollNumber')} />
                                        </div>
                                    </div>
                                    <div className="space-y-1.5">
                                        <Label>Hostel</Label>
                                        <div className="relative">
                                            <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                            <Input placeholder="Block A" className="pl-10" value={form.hostel} onChange={set('hostel')} />
                                        </div>
                                    </div>
                                </div>
                            )}

                            <div className="space-y-1.5">
                                <Label>Password</Label>
                                <div className="relative">
                                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                    <Input type={showPass ? 'text' : 'password'} placeholder="Min 6 characters" className="pl-10 pr-10" value={form.password} onChange={set('password')} required minLength={6} />
                                    <button type="button" onClick={() => setShowPass(!showPass)} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors">
                                        {showPass ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                                    </button>
                                </div>
                            </div>

                            <div className="space-y-1.5">
                                <Label>Confirm Password</Label>
                                <div className="relative">
                                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                    <Input type="password" placeholder="Repeat your password" className="pl-10" value={form.confirm} onChange={set('confirm')} required />
                                </div>
                            </div>

                            <Button type="submit" className="w-full h-11 mt-2" disabled={loading}>
                                {loading ? <><Loader2 className="w-4 h-4 animate-spin" /> Creating account...</> : 'Create Account'}
                            </Button>
                        </form>

                        <p className="text-center text-sm text-muted-foreground mt-4">
                            Already have an account?{' '}
                            <Link to="/login" className="text-purple-400 hover:text-purple-300 font-medium transition-colors">Sign in</Link>
                        </p>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
