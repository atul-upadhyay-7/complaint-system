import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
    Sparkles,
    Zap,
    Shield,
    Users,
    ArrowRight,
    MessageSquare,
    BarChart3,
    Cpu,
    Bell,
    Globe
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { useAuth } from '../context/AuthContext';

export default function LandingPage() {
    const navigate = useNavigate();
    const { user } = useAuth();

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.2
            }
        }
    };

    const itemVariants = {
        hidden: { y: 20, opacity: 0 },
        visible: {
            y: 0,
            opacity: 1
        }
    };

    const features = [
        { icon: Cpu, title: "8-Pillar AI Engine", desc: "Local NLP engine handling categorization, priority, sentiment, and technical protocols.", color: "text-blue-500", bg: "bg-blue-500/10" },
        { icon: Zap, title: "Real-Time Sync", desc: "Powered by Socket.io for instant notifications and live AI prediction panels.", color: "text-amber-500", bg: "bg-amber-500/10" },
        { icon: Shield, title: "Secure Guard", desc: "Enterprise-grade JWT auth, RBAC, and rate limiting for maximum security.", color: "text-emerald-500", bg: "bg-emerald-500/10" },
        { icon: MessageSquare, title: "Smart Feedback", desc: "AI Sentiment analysis ensures urgent needs are heard and handled with care.", color: "text-rose-500", bg: "bg-rose-500/10" },
        { icon: BarChart3, title: "Admin Analytics", desc: "Comprehensive data visualization of campus trends and staff performance.", color: "text-violet-500", bg: "bg-violet-500/10" },
        { icon: Globe, title: "Zero API Cost", desc: "All AI features run 100% locally on your infrastructure. No external dependencies.", color: "text-sky-500", bg: "bg-sky-500/10" },
    ];

    return (
        <div className="min-h-screen bg-[#020617] text-slate-100 overflow-x-hidden selection:bg-blue-500/30">
            {/* Background Effects */}
            <div className="fixed inset-0 pointer-events-none">
                <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-600/10 blur-[120px] rounded-full animate-pulse" />
                <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-violet-600/10 blur-[120px] rounded-full animate-pulse" style={{ animationDelay: '2s' }} />
                <div className="absolute top-[20%] right-[10%] w-[15%] h-[15%] bg-amber-500/10 blur-[100px] rounded-full" />
                <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 pointer-events-none" />
            </div>

            {/* Nav */}
            <nav className="relative z-50 flex items-center justify-between px-6 py-4 max-w-7xl mx-auto backdrop-blur-md border-b border-white/5">
                <div className="flex items-center gap-2">
                    <div className="w-10 h-10 rounded-xl grad-blue flex items-center justify-center shadow-[0_0_20px_rgba(59,130,246,0.5)]">
                        <Sparkles className="w-6 h-6 text-white" />
                    </div>
                    <span className="text-xl font-bold tracking-tight text-white uppercase italic">UniIssueHub</span>
                </div>
                <div className="flex items-center gap-4">
                    {user ? (
                        <Button variant="ghost" className="text-white hover:bg-white/10" onClick={() => navigate('/dashboard')}>
                            Go to Dashboard
                        </Button>
                    ) : (
                        <>
                            <Button variant="ghost" className="text-white hover:bg-white/10 hidden md:flex" onClick={() => navigate('/login')}>
                                Sign In
                            </Button>
                            <Button className="grad-blue text-white border-none shadow-lg shadow-blue-500/20" onClick={() => navigate('/register')}>
                                Create Account
                            </Button>
                        </>
                    )}
                </div>
            </nav>

            {/* Hero Section */}
            <header className="relative z-10 pt-20 pb-16 px-6 max-w-7xl mx-auto text-center">


                <motion.h1
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.2 }}
                    className="text-5xl md:text-7xl font-black mb-6 leading-tight"
                >
                    Campus Intelligence. <br />
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-violet-400 to-amber-400">
                        Human Resolution.
                    </span>
                </motion.h1>

                <motion.p
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.3 }}
                    className="text-lg text-slate-400 max-w-2xl mx-auto mb-10 leading-relaxed"
                >
                    UniIssueHub revolutionizes campus life with a custom local AI engine.
                    From instant categorization to AI-driven repair protocols, we digitize every step of the resolution journey.
                </motion.p>

                <motion.div
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.4 }}
                    className="flex flex-col sm:flex-row items-center justify-center gap-4"
                >
                    <Button size="lg" className="h-14 px-8 text-lg font-bold grad-blue min-w-[200px]" onClick={() => navigate('/register')}>
                        Get Started <ArrowRight className="ml-2 w-5 h-5" />
                    </Button>
                    <Button size="lg" variant="outline" className="h-14 px-8 text-lg font-bold border-white/10 hover:bg-white/5 bg-transparent text-white" onClick={() => navigate('/login')}>
                        Admin Demo
                    </Button>
                </motion.div>

                {/* Dashboard Preview */}
                <motion.div
                    initial={{ y: 100, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.6, type: 'spring', stiffness: 50 }}
                    className="mt-20 relative px-4"
                >
                    <div className="max-w-5xl mx-auto rounded-3xl p-1 bg-gradient-to-tr from-blue-500/50 via-violet-500/50 to-amber-500/50 shadow-[0_0_80px_rgba(59,130,246,0.15)]">
                        <div className="bg-[#0f172a] rounded-[22px] overflow-hidden border border-white/5 aspect-video flex items-center justify-center relative group">
                            <div className="absolute top-4 left-1/2 -translate-x-1/2 z-20">
                                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-[0.2em] bg-slate-900/50 backdrop-blur-md px-3 py-1 rounded-full border border-white/5">Dashboard Preview</span>
                            </div>
                            <img
                                src="/dashboard_mockup_landing.png"
                                className="w-full h-full object-cover opacity-50 grayscale group-hover:grayscale-0 group-hover:scale-105 transition-all duration-700"
                                alt=""
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-[#020617] via-transparent to-transparent" />
                            <div className="absolute inset-0 flex flex-col items-center justify-center p-12 text-center">
                                <div className="w-16 h-16 rounded-full bg-white/10 backdrop-blur-xl flex items-center justify-center mb-4 border border-white/20">
                                    <Zap className="w-8 h-8 text-amber-500" />
                                </div>
                                <h3 className="text-2xl font-bold text-white mb-2">Experience Zero Latency</h3>
                                <p className="text-slate-400 text-sm max-w-sm">Built on 8-Pillar Local AI and Real-time WebSockets.</p>
                            </div>
                        </div>
                    </div>
                </motion.div>
            </header>

            {/* Features Section */}
            <section className="relative z-10 py-32 px-6 max-w-7xl mx-auto">
                <div className="text-center mb-20">
                    <h2 className="text-3xl md:text-5xl font-black mb-4">Elite AI Ecosystem</h2>
                    <p className="text-slate-500 uppercase tracking-widest font-bold text-sm">Powered by locally-trained NLP models</p>
                </div>

                <div className="grid md:grid-cols-3 gap-6">
                    {features.map((f, i) => (
                        <motion.div
                            key={f.title}
                            initial="hidden"
                            whileInView="visible"
                            viewport={{ once: true }}
                            variants={itemVariants}
                            className="p-8 rounded-3xl bg-white/5 border border-white/10 hover:border-blue-500/50 transition-all hover:bg-white/[0.07] group"
                        >
                            <div className={cn("w-12 h-12 rounded-xl mb-6 flex items-center justify-center", f.bg)}>
                                <f.icon className={cn("w-6 h-6", f.color)} />
                            </div>
                            <h4 className="text-xl font-bold mb-3 text-white group-hover:text-blue-400 transition-colors">{f.title}</h4>
                            <p className="text-slate-400 text-sm leading-relaxed">{f.desc}</p>
                        </motion.div>
                    ))}
                </div>
            </section>

            {/* Roles Section */}
            <section className="relative z-10 py-24 px-6 bg-white/[0.02] border-y border-white/5">
                <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center gap-16">
                    <div className="flex-1">
                        <h2 className="text-4xl font-black mb-8 leading-tight">A Central Hub for <br /><span className="text-blue-400">All Stakeholders.</span></h2>
                        <div className="space-y-6">
                            {[
                                { role: "Students", feature: "Live AI Prediction Panel", icon: Users },
                                { role: "Staff", feature: "AI Repair Protocols", icon: Zap },
                                { role: "Admins", feature: "Global Sentiment Insights", icon: BarChart3 }
                            ].map((r) => (
                                <div key={r.role} className="flex items-center gap-4 p-4 rounded-2xl bg-white/5 border border-white/10">
                                    <div className="w-10 h-10 rounded-xl bg-blue-500/20 flex items-center justify-center shrink-0">
                                        <r.icon className="w-5 h-5 text-blue-400" />
                                    </div>
                                    <div>
                                        <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">{r.role}</p>
                                        <p className="text-sm font-bold text-white leading-none mt-1">{r.feature}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                    <div className="flex-1 grid grid-cols-2 gap-4">
                        <div className="space-y-4 pt-12">
                            <div className="aspect-square rounded-3xl bg-blue-500/20 border border-blue-500/20 flex items-center justify-center">
                                <Cpu className="w-12 h-12 text-blue-500 opacity-20" />
                            </div>
                            <div className="aspect-square rounded-3xl bg-violet-500/20 border border-violet-500/20 flex items-center justify-center">
                                <Sparkles className="w-12 h-12 text-violet-500 opacity-20" />
                            </div>
                        </div>
                        <div className="space-y-4">
                            <div className="aspect-square rounded-3xl bg-amber-500/20 border border-amber-500/20 flex items-center justify-center">
                                <Globe className="w-12 h-12 text-amber-500 opacity-20" />
                            </div>
                            <div className="aspect-square rounded-3xl bg-emerald-500/20 border border-emerald-500/20 flex items-center justify-center">
                                <Shield className="w-12 h-12 text-emerald-500 opacity-20" />
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Footer */}
            <footer className="relative z-10 py-16 px-6 text-center border-t border-white/5">
                <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-8">
                    <div className="flex items-center gap-2">
                        <Sparkles className="w-6 h-6 text-blue-500" />
                        <span className="text-lg font-black tracking-tighter uppercase italic">UniIssueHub</span>
                    </div>
                    <p className="text-slate-500 text-xs">© 2026 EliteCoder Hackathon Entry. All Rights Reserved.</p>
                    <div className="flex gap-6">
                        <a href="#" className="text-slate-400 hover:text-white transition-colors"><Zap className="w-5 h-5" /></a>
                        <a href="#" className="text-slate-400 hover:text-white transition-colors"><Globe className="w-5 h-5" /></a>
                    </div>
                </div>
            </footer>
        </div>
    );
}
