import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';
import { Eye, EyeOff, Loader2, GraduationCap, Lock, Mail, ShieldCheck, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';

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
        <div className="min-h-screen grid lg:grid-cols-2 bg-background relative overflow-hidden">
            {/* Left Panel - Hero Image/Graphic (Hidden on Mobile) */}
            <div className="hidden lg:flex relative flex-col justify-between p-12 bg-secondary/30 border-r border-border/50 overflow-hidden">
                {/* Background orbs for Left Panel */}
                <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
                    <div className="absolute top-[10%] left-[20%] w-[500px] h-[500px] bg-purple-600/20 rounded-full blur-[100px] animate-float" />
                    <div className="absolute bottom-[10%] right-[10%] w-[400px] h-[400px] bg-indigo-600/20 rounded-full blur-[100px] animate-float" style={{ animationDelay: '2s' }} />
                </div>

                <div className="relative z-10 flex items-center gap-3 animate-slide-in-right">
                    <div className="w-12 h-12 rounded-2xl glass-purple flex items-center justify-center">
                        <GraduationCap className="w-6 h-6 text-purple-400" />
                    </div>
                    <span className="text-2xl font-bold text-gradient">CampusDesk</span>
                </div>

                <div className="relative z-10 animate-slide-up" style={{ animationDelay: '0.2s' }}>
                    <h1 className="text-5xl font-bold tracking-tight mb-6">
                        Seamlessly resolve campus issues.
                    </h1>
                    <p className="text-lg text-muted-foreground max-w-md leading-relaxed">
                        A unified platform bridging the gap between students and administration. Track, manage, and resolve complaints with unparalleled efficiency.
                    </p>

                    <div className="mt-12 flex items-center gap-4 text-sm font-medium text-foreground/80">
                        <div className="flex items-center gap-2">
                            <Sparkles className="w-4 h-4 text-purple-400" /> Trusted by students
                        </div>
                    </div>
                </div>
            </div>

            {/* Right Panel - Login Form */}
            <div className="flex items-center justify-center p-6 relative">
                {/* Mobile Background Orbs */}
                <div className="absolute inset-0 overflow-hidden pointer-events-none lg:hidden">
                    <div className="absolute -top-40 -left-40 w-96 h-96 bg-purple-600/20 rounded-full blur-[100px] animate-float" />
                    <div className="absolute -bottom-40 -right-40 w-96 h-96 bg-purple-800/15 rounded-full blur-[100px] animate-float" style={{ animationDelay: '1.5s' }} />
                </div>

                <div className="w-full max-w-[420px] relative z-10 animate-slide-up">
                    {/* Mobile Brand Header */}
                    <div className="text-center mb-8 lg:hidden">
                        <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl glass-purple mb-4 animate-float">
                            <GraduationCap className="w-7 h-7 text-purple-400" />
                        </div>
                        <h1 className="text-3xl font-bold text-gradient mb-1">CampusDesk</h1>
                        <p className="text-muted-foreground text-sm">Complaint Management Portal</p>
                    </div>

                    <Card className="border-border/50 shadow-glass animate-fade-in" style={{ animationDelay: '0.1s' }}>
                        <CardHeader className="pb-4 text-center lg:text-left">
                            <CardTitle className="text-2xl font-semibold tracking-tight">Sign In</CardTitle>
                            <CardDescription className="text-base">Enter your campus credentials to continue</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <form onSubmit={handleSubmit} className="space-y-4">
                                <div className="space-y-2 animate-slide-up" style={{ animationDelay: '0.2s' }}>
                                    <Label htmlFor="email">Email Address</Label>
                                    <div className="relative group">
                                        <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground group-focus-within:text-purple-400 transition-colors" />
                                        <Input
                                            id="email"
                                            type="email"
                                            placeholder="you@campus.edu"
                                            className="pl-10 h-12 transition-all duration-300 focus-visible:ring-purple-500/50 focus-visible:border-purple-500/50"
                                            value={form.email}
                                            onChange={e => setForm({ ...form, email: e.target.value })}
                                            required
                                        />
                                    </div>
                                </div>

                                <div className="space-y-2 animate-slide-up" style={{ animationDelay: '0.3s' }}>
                                    <Label htmlFor="password">Password</Label>
                                    <div className="relative group">
                                        <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground group-focus-within:text-purple-400 transition-colors" />
                                        <Input
                                            id="password"
                                            type={showPass ? 'text' : 'password'}
                                            placeholder="••••••••"
                                            className="pl-10 pr-10 h-12 transition-all duration-300 focus-visible:ring-purple-500/50 focus-visible:border-purple-500/50"
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

                                <Button type="submit" className="w-full h-12 mt-2 font-medium text-base shadow-purple-glow hover:shadow-purple-glow/150 transition-all duration-300 animate-slide-up" style={{ animationDelay: '0.4s' }} disabled={loading}>
                                    {loading ? <><Loader2 className="w-5 h-5 animate-spin mr-2" /> Signing in...</> : 'Sign In'}
                                </Button>
                            </form>

                            {/* Demo credentials */}
                            <div className="mt-6 p-4 rounded-xl bg-secondary/30 border border-border/50 backdrop-blur-sm animate-slide-up" style={{ animationDelay: '0.5s' }}>
                                <p className="text-xs text-muted-foreground font-medium mb-3 text-center tracking-wider">DEMO ACCOUNTS</p>
                                <div className="flex gap-2">
                                    <button onClick={() => fillDemo('student')}
                                        className="flex-1 flex items-center justify-center gap-2 rounded-lg py-2.5 px-3 text-sm font-medium border border-border hover:border-purple-600/50 hover:bg-purple-600/10 text-muted-foreground hover:text-purple-300 transition-all duration-300 hover:-translate-y-0.5">
                                        <GraduationCap className="w-4 h-4" /> Student
                                    </button>
                                    <button onClick={() => fillDemo('admin')}
                                        className="flex-1 flex items-center justify-center gap-2 rounded-lg py-2.5 px-3 text-sm font-medium border border-border hover:border-purple-600/50 hover:bg-purple-600/10 text-muted-foreground hover:text-purple-300 transition-all duration-300 hover:-translate-y-0.5">
                                        <ShieldCheck className="w-4 h-4" /> Admin
                                    </button>
                                </div>
                            </div>

                            <p className="text-center text-sm text-muted-foreground mt-6 animate-slide-up" style={{ animationDelay: '0.6s' }}>
                                No account?{' '}
                                <Link to="/register" className="text-purple-400 hover:text-purple-300 font-medium transition-colors hover:underline underline-offset-4">
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
