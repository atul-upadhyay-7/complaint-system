import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';
import api from '../api/axios';
import toast from 'react-hot-toast';
import { Mail, Loader2, GraduationCap, ArrowLeft, Send } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';

export default function ForgotPassword() {
    const [email, setEmail] = useState('');
    const [loading, setLoading] = useState(false);
    const { theme } = useTheme();
    const navigate = useNavigate();
    const isLight = theme === 'light';

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const { data } = await api.post('/auth/forgot-password', { email });
            toast.success(data.message);

            // Demo Hackathon redirect fallback
            if (data.demoToken) {
                setTimeout(() => {
                    toast('Redirecting to reset page (Demo)...', { icon: '🤖' });
                    navigate(`/reset-password/${data.demoToken}`);
                }, 1500);
            } else {
                toast.success('Awesome! Please check your email inbox (and spam folder) for the reset link.', { duration: 5000 });
                setEmail('');
            }
        } catch (err) {
            toast.error(err.response?.data?.message || 'Something went wrong');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center p-6 relative overflow-hidden" style={{ background: isLight ? '#f0f7ff' : '#030e1c' }}>
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute -top-40 -left-40 w-96 h-96 bg-blue-600/15 rounded-full blur-[100px] animate-float" />
                <div className="absolute top-[20%] right-[10%] w-[350px] h-[350px] bg-cyan-600/10 rounded-full blur-[100px] animate-float" style={{ animationDelay: '1.5s' }} />
            </div>

            <div className="w-full max-w-[420px] relative z-10">
                <div className="text-center mb-8 animate-fade-in">
                    <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-blue-500/15 border border-blue-500/30 mb-4 animate-float" style={{ boxShadow: '0 0 20px rgba(59,130,246,0.3)' }}>
                        <GraduationCap className="w-7 h-7 text-blue-400" />
                    </div>
                </div>

                <Card className={`animate-slide-up ${isLight ? 'border-blue-200 shadow-lg' : 'border-blue-900/40'}`} style={{ background: isLight ? 'rgba(255,255,255,0.9)' : 'rgba(8, 20, 40, 0.7)', backdropFilter: 'blur(20px)' }}>
                    <CardHeader className="text-center pb-4">
                        <CardTitle className={`text-2xl font-semibold tracking-tight ${isLight ? 'text-slate-800' : 'text-white'}`}>Account Recovery</CardTitle>
                        <CardDescription className={`text-base mt-2 ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>Enter your email to receive a password reset link.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleSubmit} className="space-y-5">
                            <div className="space-y-2">
                                <Label className={isLight ? 'text-slate-700' : 'text-slate-300'}>Registered Email</Label>
                                <div className="relative group">
                                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500 group-focus-within:text-blue-400 transition-colors" />
                                    <Input
                                        type="email"
                                        placeholder="you@campus.edu"
                                        className={`pl-10 h-12 transition-all focus-visible:ring-blue-500/50 focus-visible:border-blue-500/50 ${isLight ? 'bg-slate-50 border-slate-200 text-slate-800 placeholder:text-slate-400' : 'bg-white/5 border-white/10 text-white placeholder:text-slate-500'}`}
                                        value={email}
                                        onChange={e => setEmail(e.target.value)}
                                        required
                                    />
                                </div>
                            </div>

                            <Button
                                type="submit"
                                className="w-full h-12 mt-4 font-semibold text-base transition-all duration-300 animate-slide-up hover:-translate-y-0.5 text-white"
                                style={{ background: 'linear-gradient(135deg, #2563eb, #1d4ed8)', boxShadow: '0 0 20px rgba(59,130,246,0.3)' }}
                                disabled={loading}
                            >
                                {loading ? <><Loader2 className="w-5 h-5 animate-spin mr-2" /> Sending Link...</> : <><Send className="w-4 h-4 mr-2" /> Send Recovery Link</>}
                            </Button>

                            <Button
                                type="button"
                                variant="ghost"
                                className={`w-full h-11 mt-2 text-sm ${isLight ? 'text-slate-600 hover:text-blue-600' : 'text-slate-400 hover:text-white hover:bg-white/5'}`}
                                onClick={() => navigate('/login')}
                            >
                                <ArrowLeft className="w-4 h-4 mr-2" /> Back to Login
                            </Button>
                        </form>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
