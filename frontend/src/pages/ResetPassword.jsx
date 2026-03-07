import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';
import { useAuth } from '../context/AuthContext';
import api from '../api/axios';
import toast from 'react-hot-toast';
import { Lock, Eye, EyeOff, Loader2, GraduationCap, ShieldCheck } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';

export default function ResetPassword() {
    const [password, setPassword] = useState('');
    const [confirm, setConfirm] = useState('');
    const [showPass, setShowPass] = useState(false);
    const [loading, setLoading] = useState(false);
    const { token } = useParams();
    const { theme } = useTheme();
    const { login } = useAuth(); // or just use navigate
    const navigate = useNavigate();
    const isLight = theme === 'light';

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (password !== confirm) {
            return toast.error('Passwords do not match');
        }

        setLoading(true);
        try {
            const { data } = await api.post(`/auth/reset-password/${token}`, { password });
            toast.success(data.message);
            // Optionally auto login, or just redirect
            setTimeout(() => {
                navigate('/login');
            }, 1000);
        } catch (err) {
            toast.error(err.response?.data?.message || 'Token invalid or expired');
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
                        <CardTitle className={`text-2xl font-semibold tracking-tight ${isLight ? 'text-slate-800' : 'text-white'}`}>Create New Password</CardTitle>
                        <CardDescription className={`text-base mt-2 ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>Secure your account with a fresh password.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div className="space-y-2">
                                <Label className={isLight ? 'text-slate-700' : 'text-slate-300'}>New Password</Label>
                                <div className="relative group">
                                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500 group-focus-within:text-blue-400 transition-colors" />
                                    <Input
                                        type={showPass ? 'text' : 'password'}
                                        placeholder="Min. 6 characters"
                                        className={`pl-10 h-12 transition-all focus-visible:ring-blue-500/50 focus-visible:border-blue-500/50 ${isLight ? 'bg-slate-50 border-slate-200 text-slate-800 placeholder:text-slate-400' : 'bg-white/5 border-white/10 text-white placeholder:text-slate-500'}`}
                                        value={password}
                                        onChange={e => setPassword(e.target.value)}
                                        required
                                    />
                                    <button type="button" onClick={() => setShowPass(!showPass)}
                                        className={`absolute right-3 top-1/2 -translate-y-1/2 transition-colors ${isLight ? 'text-slate-400 hover:text-slate-700' : 'text-slate-500 hover:text-white'}`}>
                                        {showPass ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                                    </button>
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label className={isLight ? 'text-slate-700' : 'text-slate-300'}>Confirm Password</Label>
                                <div className="relative group">
                                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500 group-focus-within:text-blue-400 transition-colors" />
                                    <Input
                                        type={showPass ? 'text' : 'password'}
                                        placeholder="Repeat your password"
                                        className={`pl-10 h-12 transition-all focus-visible:ring-blue-500/50 focus-visible:border-blue-500/50 ${isLight ? 'bg-slate-50 border-slate-200 text-slate-800 placeholder:text-slate-400' : 'bg-white/5 border-white/10 text-white placeholder:text-slate-500'}`}
                                        value={confirm}
                                        onChange={e => setConfirm(e.target.value)}
                                        required
                                    />
                                </div>
                            </div>

                            <Button
                                type="submit"
                                className="w-full h-12 mt-6 font-semibold text-base transition-all duration-300 animate-slide-up hover:-translate-y-0.5 text-white"
                                style={{ background: 'linear-gradient(135deg, #2563eb, #1d4ed8)', boxShadow: '0 0 20px rgba(59,130,246,0.3)' }}
                                disabled={loading}
                            >
                                {loading ? <><Loader2 className="w-5 h-5 animate-spin mr-2" /> Saving...</> : 'Reset Password'}
                            </Button>
                        </form>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
