import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';
import { Eye, EyeOff, Loader2, GraduationCap, Lock, Mail, ShieldCheck } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

export default function Login() {
    const [form, setForm] = useState({ email: '', password: '' });
    const [showPass, setShowPass] = useState(false);
    const [loading, setLoading] = useState(false);
    const { login } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const user = await login(form.email, form.password);
            toast.success(`Welcome back, ${user.name}! 👋`);
            navigate(user.role === 'admin' ? '/admin' : '/dashboard');
        } catch (err) {
            toast.error(err.response?.data?.message || 'Invalid credentials');
        } finally {
            setLoading(false);
        }
    };

    const fillDemo = (role) => {
        if (role === 'admin') setForm({ email: 'admin@campus.edu', password: 'admin123' });
        else setForm({ email: 'student@campus.edu', password: 'student123' });
    };

    return (
        <div className="min-h-screen flex items-center justify-center relative overflow-hidden bg-background">
            {/* Background gradient orbs */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute -top-40 -left-40 w-96 h-96 bg-purple-600/20 rounded-full blur-3xl" />
                <div className="absolute -bottom-40 -right-40 w-96 h-96 bg-purple-800/15 rounded-full blur-3xl" />
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-purple-900/10 rounded-full blur-3xl" />
            </div>

            <div className="relative z-10 w-full max-w-md px-4 animate-fade-in">
                {/* Brand Header */}
                <div className="text-center mb-8">
                    <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl glass-purple mb-4">
                        <GraduationCap className="w-8 h-8 text-purple-400" />
                    </div>
                    <h1 className="text-3xl font-bold text-gradient mb-1">CampusDesk</h1>
                    <p className="text-muted-foreground text-sm">Complaint Management Portal</p>
                </div>

                <Card className="border-border/50 shadow-glass">
                    <CardHeader className="pb-4">
                        <CardTitle className="text-xl">Sign In</CardTitle>
                        <CardDescription>Enter your campus credentials to continue</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div className="space-y-1.5">
                                <Label htmlFor="email">Email Address</Label>
                                <div className="relative">
                                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                    <Input
                                        id="email"
                                        type="email"
                                        placeholder="you@campus.edu"
                                        className="pl-10"
                                        value={form.email}
                                        onChange={e => setForm({ ...form, email: e.target.value })}
                                        required
                                    />
                                </div>
                            </div>

                            <div className="space-y-1.5">
                                <Label htmlFor="password">Password</Label>
                                <div className="relative">
                                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                    <Input
                                        id="password"
                                        type={showPass ? 'text' : 'password'}
                                        placeholder="••••••••"
                                        className="pl-10 pr-10"
                                        value={form.password}
                                        onChange={e => setForm({ ...form, password: e.target.value })}
                                        required
                                    />
                                    <button type="button" onClick={() => setShowPass(!showPass)}
                                        className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors">
                                        {showPass ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                                    </button>
                                </div>
                            </div>

                            <Button type="submit" className="w-full h-11" disabled={loading}>
                                {loading ? <><Loader2 className="w-4 h-4 animate-spin" /> Signing in...</> : 'Sign In'}
                            </Button>
                        </form>

                        {/* Demo credentials */}
                        <div className="mt-5 p-4 rounded-xl bg-secondary/50 border border-border/50">
                            <p className="text-xs text-muted-foreground font-medium mb-3 text-center">DEMO ACCOUNTS</p>
                            <div className="flex gap-2">
                                <button onClick={() => fillDemo('student')}
                                    className="flex-1 flex items-center justify-center gap-2 rounded-lg py-2 px-3 text-xs border border-border hover:border-purple-600/50 hover:bg-purple-600/10 text-muted-foreground hover:text-purple-300 transition-all duration-200">
                                    <GraduationCap className="w-3.5 h-3.5" /> Student
                                </button>
                                <button onClick={() => fillDemo('admin')}
                                    className="flex-1 flex items-center justify-center gap-2 rounded-lg py-2 px-3 text-xs border border-border hover:border-purple-600/50 hover:bg-purple-600/10 text-muted-foreground hover:text-purple-300 transition-all duration-200">
                                    <ShieldCheck className="w-3.5 h-3.5" /> Admin
                                </button>
                            </div>
                        </div>

                        <p className="text-center text-sm text-muted-foreground mt-4">
                            No account?{' '}
                            <Link to="/register" className="text-purple-400 hover:text-purple-300 font-medium transition-colors">
                                Create one
                            </Link>
                        </p>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
