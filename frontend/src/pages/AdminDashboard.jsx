import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useSocket } from '../context/SocketContext';
import Sidebar from '../components/Sidebar';
import api from '../api/axios';
import { TrendingUp, AlertCircle, CheckCircle2, Loader, Clock, Tag, Users, LayoutDashboard, PieChart as PieChartIcon, BarChart2, ShieldCheck, Sparkles } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { SkeletonStatCard, SkeletonChart } from '../components/SkeletonCard';
import CategoryPieChart from '../components/charts/CategoryPieChart';
import WeeklyBarChart from '../components/charts/WeeklyBarChart';

function StatCard({ label, value, icon: Icon, color, bg, sub, delay }) {
    return (
        <Card className="group glass-card border-slate-200 dark:border-blue-900/30 hover:border-blue-500/40 card-hover animate-slide-up" style={{ animationDelay: `${delay}s` }}>
            <CardContent className="p-5">
                <div className="flex items-center justify-between mb-3">
                    <p className="text-sm text-muted-foreground font-medium">{label}</p>
                    <div className={cn('w-10 h-10 rounded-xl flex items-center justify-center transition-transform group-hover:scale-110 shadow-sm', bg)}>
                        <Icon className={cn('w-5 h-5', color)} />
                    </div>
                </div>
                <p className="text-3xl font-bold text-foreground drop-shadow-sm">{value}</p>
                {sub && <p className="text-xs text-muted-foreground mt-1.5 font-medium">{sub}</p>}
            </CardContent>
        </Card>
    );
}

// Build weekly bar chart data from recent complaints
function buildWeeklyData(complaints = []) {
    const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const today = new Date();
    const result = Array.from({ length: 7 }, (_, i) => {
        const d = new Date(today);
        d.setDate(today.getDate() - (6 - i));
        return { day: days[d.getDay()], Resolved: 0, Pending: 0, _date: d.toDateString() };
    });

    complaints.forEach(c => {
        const created = new Date(c.createdAt).toDateString();
        const entry = result.find(r => r._date === created);
        if (entry) {
            if (c.status === 'Resolved') entry.Resolved++;
            else if (c.status === 'Pending' || c.status === 'In Progress') entry.Pending++;
        }
    });
    return result.map(({ day, Resolved, Pending }) => ({ day, Resolved, Pending }));
}

export default function AdminDashboard() {
    const { logout } = useAuth();
    const navigate = useNavigate();
    const [analytics, setAnalytics] = useState(null);
    const [loading, setLoading] = useState(true);
    const [weeklyData, setWeeklyData] = useState([]);

    const { notifications } = useSocket();

    const fetchAnalytics = () => {
        api.get('/admin/analytics').then(({ data }) => {
            setAnalytics(data.analytics);
            setWeeklyData(buildWeeklyData(data.analytics?.recentComplaints || []));
        }).catch(err => console.error('Analytics error:', err))
            .finally(() => setLoading(false));
    };

    useEffect(() => { fetchAnalytics(); }, []);

    useEffect(() => {
        if (notifications.length > 0) fetchAnalytics();
    }, [notifications]);

    if (loading) return (
        <div className="workspace flex min-h-screen bg-slate-50 dark:bg-background relative transition-colors duration-300">

            <Sidebar />
            <main className="flex-1 lg:ml-[280px] p-4 sm:p-6 md:p-8 pt-20 lg:pt-8 w-full z-10">
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                    {[1, 2, 3, 4].map(i => <SkeletonStatCard key={i} />)}
                </div>
                <div className="grid lg:grid-cols-2 gap-4 mb-4">
                    {[1, 2].map(i => <SkeletonChart key={i} />)}
                </div>
                <div className="grid lg:grid-cols-2 gap-4">
                    {[1, 2].map(i => <SkeletonChart key={i} />)}
                </div>
            </main>
        </div>
    );

    const total = analytics?.total || 0;
    const pending = analytics?.pending || 0;
    const inProgress = analytics?.inProgress || 0;
    const resolved = analytics?.resolved || 0;
    const resolutionRate = total > 0 ? Math.round((resolved / total) * 100) : 0;
    const avgDays = analytics?.avgResolutionTimeHours != null ? (Number(analytics.avgResolutionTimeHours) / 24).toFixed(1) : 'N/A';

    return (
        <div className="workspace flex min-h-screen bg-slate-50 dark:bg-background relative selection:bg-blue-500/30 transition-colors duration-300">


            <Sidebar />
            <main className="flex-1 lg:ml-[280px] min-w-0 pt-20 lg:pt-0 relative z-10">
                <div className="p-4 sm:p-6 md:p-8 max-w-7xl mx-auto">
                    {/* Topbar */}
                    <div className="hidden lg:flex items-center justify-end px-8 py-5">
                        <button onClick={(e) => { e.preventDefault(); logout(); navigate('/login'); }}
                            className="flex items-center gap-2 px-4 py-2.5 rounded-lg border border-slate-200 text-sm font-medium text-slate-600 hover:bg-slate-100 dark:border-[#1e1e2d] dark:text-slate-300 dark:hover:bg-[#121124] hover:text-slate-900 dark:hover:text-white transition-colors">
                            <ShieldCheck className="w-4 h-4" /> Secure Logout
                        </button>
                    </div>        {/* Header */}
                    <div className="mb-8 animate-slide-up">
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-100 dark:bg-blue-500/10 border border-blue-200 dark:border-blue-500/20 text-xs font-medium text-blue-600 dark:text-blue-400 mb-3 animate-fade-in">
                            <LayoutDashboard className="w-3.5 h-3.5" /> Command Center
                        </div>
                        <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-slate-900 dark:text-foreground">System Overview</h1>
                        <p className="text-slate-500 dark:text-muted-foreground text-sm sm:text-base mt-2">Comprehensive analytics of all campus complaint activity</p>
                    </div>

                    {/* Stats grid */}
                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-5 mb-8">
                        <StatCard label="Total Complaints" value={total} icon={Users} color="text-blue-600 dark:text-blue-400" bg="bg-blue-100 dark:bg-blue-500/10" sub="All time record" delay={0.1} />
                        <StatCard label="Pending Review" value={pending} icon={AlertCircle} color="text-amber-600 dark:text-amber-400" bg="bg-amber-100 dark:bg-amber-500/10" sub="Awaiting action" delay={0.2} />
                        <StatCard label="In Progress" value={inProgress} icon={Loader} color="text-cyan-600 dark:text-cyan-400" bg="bg-cyan-100 dark:bg-cyan-500/10" sub="Currently handled" delay={0.3} />
                        <StatCard label="Resolved" value={resolved} icon={CheckCircle2} color="text-emerald-600 dark:text-emerald-400" bg="bg-emerald-100 dark:bg-emerald-500/10" sub={`${resolutionRate}% resolution rate`} delay={0.4} />
                    </div>

                    <div className="grid lg:grid-cols-2 gap-4 sm:gap-6 mb-6">
                        {/* Pie Chart */}
                        <Card className="glass-card border-slate-200 dark:border-blue-900/30 animate-slide-up" style={{ animationDelay: '0.45s' }}>
                            <CardHeader className="pb-2">
                                <CardTitle className="text-base font-semibold flex items-center gap-2">
                                    <PieChartIcon className="w-4.5 h-4.5 text-blue-600 dark:text-blue-400" /> Category Distribution
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <CategoryPieChart data={analytics?.topCategories || []} />
                            </CardContent>
                        </Card>

                        {/* Bar Chart */}
                        <Card className="glass-card border-slate-200 dark:border-blue-900/30 animate-slide-up" style={{ animationDelay: '0.5s' }}>
                            <CardHeader className="pb-2">
                                <CardTitle className="text-base font-semibold flex items-center gap-2">
                                    <BarChart2 className="w-4.5 h-4.5 text-blue-600 dark:text-blue-400" /> Weekly Activity
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <WeeklyBarChart data={weeklyData} />
                            </CardContent>
                        </Card>
                    </div>

                    {/* Resolution + Categories Row */}
                    <div className="grid lg:grid-cols-2 gap-4 sm:gap-6 mb-6">
                        {/* Resolution Rate */}
                        <Card className="glass-card border-slate-200 dark:border-blue-900/30 animate-slide-up" style={{ animationDelay: '0.55s' }}>
                            <CardHeader className="pb-4">
                                <CardTitle className="text-base font-semibold flex items-center gap-2">
                                    <TrendingUp className="w-4.5 h-4.5 text-blue-600 dark:text-blue-400" /> Resolution Efficiency
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-5">
                                <div className="p-4 rounded-xl bg-blue-50 dark:bg-blue-500/5 border border-blue-200 dark:border-blue-500/15">
                                    <div className="flex justify-between text-sm mb-3">
                                        <span className="font-medium text-slate-900 dark:text-foreground">Resolved Successfully</span>
                                        <span className="font-bold text-emerald-600 dark:text-emerald-400">{resolutionRate}%</span>
                                    </div>
                                    <Progress value={resolutionRate} className="h-3 bg-slate-200 dark:bg-secondary" indicatorClassName="bg-gradient-to-r from-blue-500 to-emerald-500" />
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    {[
                                        { label: 'Pending', val: total > 0 ? Math.round((pending / total) * 100) : 0, color: 'bg-amber-500' },
                                        { label: 'In Progress', val: total > 0 ? Math.round((inProgress / total) * 100) : 0, color: 'bg-cyan-500' },
                                    ].map(r => (
                                        <div key={r.label} className="p-3 rounded-xl bg-slate-100 dark:bg-secondary/20 border border-slate-200 dark:border-border/30">
                                            <div className="flex justify-between text-xs mb-2">
                                                <span className="font-medium text-slate-600 dark:text-muted-foreground">{r.label}</span>
                                                <span className="font-bold text-slate-900 dark:text-foreground">{r.val}%</span>
                                            </div>
                                            <div className="h-2 rounded-full bg-slate-200 dark:bg-secondary overflow-hidden">
                                                <div className={`h-full ${r.color} rounded-full transition-all duration-1000 ease-out`} style={{ width: `${r.val}%` }} />
                                            </div>
                                        </div>
                                    ))}
                                </div>
                                <div className="pt-4 border-t border-slate-200 dark:border-border/50 flex items-center justify-between text-sm">
                                    <div className="flex items-center gap-2 text-slate-600 dark:text-muted-foreground font-medium">
                                        <Clock className="w-4 h-4 text-blue-600 dark:text-blue-400" /> Avg Resolution Time
                                    </div>
                                    <span className="font-bold text-slate-900 dark:text-foreground px-2.5 py-1 rounded-md bg-white dark:glass-card border border-blue-200 dark:border-blue-500/15">{avgDays} days</span>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Top Categories */}
                        <Card className="glass-card border-slate-200 dark:border-blue-900/30 animate-slide-up" style={{ animationDelay: '0.6s' }}>
                            <CardHeader className="pb-4">
                                <CardTitle className="text-base font-semibold flex items-center gap-2">
                                    <Tag className="w-4.5 h-4.5 text-blue-600 dark:text-blue-400" /> Most Frequent Issues
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                {(analytics?.topCategories || []).slice(0, 5).map((cat, i) => {
                                    const max = analytics?.topCategories?.[0]?.count || 1;
                                    const pct = Math.round((cat.count / max) * 100);
                                    const colors = ['from-blue-500 to-cyan-400', 'from-blue-600 to-blue-400', 'from-cyan-500 to-blue-300', 'from-blue-400 to-indigo-400', 'from-indigo-500 to-blue-400'];
                                    return (
                                        <div key={cat._id} className="group flex flex-col gap-1.5 rounded-lg p-1 hover:bg-slate-100 dark:hover:bg-white/5 transition-colors">
                                            <div className="flex justify-between text-sm px-1">
                                                <span className="text-slate-900 dark:text-foreground font-medium flex items-center gap-2">
                                                    <span className="w-1.5 h-1.5 rounded-full bg-blue-500/70" />
                                                    {cat._id}
                                                </span>
                                                <span className="font-bold text-slate-500 dark:text-muted-foreground tabular-nums">{cat.count}</span>
                                            </div>
                                            <div className="h-2 rounded-full bg-slate-200 dark:bg-secondary/50 overflow-hidden">
                                                <div className={`h-full bg-gradient-to-r ${colors[i % colors.length]} rounded-full transition-all duration-1000 ease-out`} style={{ width: `${pct}%` }} />
                                            </div>
                                        </div>
                                    );
                                })}
                                {(analytics?.topCategories || []).length === 0 && (
                                    <div className="h-40 flex flex-col items-center justify-center text-center">
                                        <Tag className="w-8 h-8 text-slate-400 dark:text-muted-foreground/30 mb-2" />
                                        <p className="text-sm font-medium text-slate-500 dark:text-muted-foreground">No category data yet</p>
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                    </div>

                    {/* AI Insights - Sentiment Breakdown */}
                    <Card className="glass-card border-violet-200 dark:border-violet-900/30 mb-6 animate-slide-up shadow-[0_8px_32px_rgba(139,92,246,0.08)]" style={{ animationDelay: '0.62s' }}>
                        <CardHeader className="pb-4 border-b border-violet-100 dark:border-violet-900/20">
                            <CardTitle className="text-base font-bold flex items-center gap-2 text-violet-700 dark:text-violet-400">
                                <Sparkles className="w-5 h-5" /> AI Sentiment Analysis
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="pt-6">
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                {[
                                    { label: '🔥 Urgent', key: 'Urgent', color: 'text-rose-600', bg: 'bg-rose-100 dark:bg-rose-500/10', border: 'border-rose-200 dark:border-rose-500/20' },
                                    { label: '😤 Frustrated', key: 'Frustrated', color: 'text-orange-600', bg: 'bg-orange-100 dark:bg-orange-500/10', border: 'border-orange-200 dark:border-orange-500/20' },
                                    { label: '😐 Neutral', key: 'Neutral', color: 'text-slate-600', bg: 'bg-slate-100 dark:bg-slate-500/10', border: 'border-slate-200 dark:border-slate-500/20' },
                                    { label: '😊 Polite', key: 'Polite', color: 'text-emerald-600', bg: 'bg-emerald-100 dark:bg-emerald-500/10', border: 'border-emerald-200 dark:border-emerald-500/20' },
                                ].map(s => {
                                    const count = (analytics?.aiSentimentCounts || []).find(s2 => s2._id === s.key)?.count || 0;
                                    const totalSentiment = (analytics?.aiSentimentCounts || []).reduce((acc, curr) => acc + curr.count, 0) || 1;
                                    const pct = Math.round((count / totalSentiment) * 100);
                                    return (
                                        <div key={s.key} className={cn('p-4 rounded-2xl border transition-all hover:scale-[1.02]', s.bg, s.border)}>
                                            <p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground mb-1">{s.key}</p>
                                            <div className="flex items-end justify-between">
                                                <h4 className={cn('text-2xl font-black tabular-nums', s.color)}>{count}</h4>
                                                <span className="text-xs font-bold opacity-60">{pct}%</span>
                                            </div>
                                            <div className="w-full h-1.5 bg-black/5 dark:bg-white/5 rounded-full mt-3 overflow-hidden">
                                                <div className={cn('h-full bg-current rounded-full transition-all duration-1000', s.color)} style={{ width: `${pct}%` }} />
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </CardContent>
                    </Card>

                    {/* Recent Complaints */}
                    <Card className="glass-card border-slate-200 dark:border-blue-900/30 animate-slide-up" style={{ animationDelay: '0.65s' }}>
                        <CardHeader className="pb-3">
                            <CardTitle className="text-base font-semibold">Latest Submissions</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-2">
                                {(analytics?.recentComplaints || []).map((c) => (
                                    <div key={c._id} className="group flex sm:items-center flex-col sm:flex-row gap-3 sm:gap-4 p-3.5 rounded-xl hover:bg-slate-100 dark:hover:bg-blue-500/5 border border-transparent hover:border-slate-300 dark:hover:border-blue-900/50 transition-all duration-200">
                                        <div className="flex-1 min-w-0 pr-4">
                                            <p className="text-sm font-semibold text-slate-900 dark:text-foreground truncate group-hover:text-blue-600 dark:group-hover:text-blue-300 transition-colors">{c.title}</p>
                                            <p className="text-xs font-medium text-slate-500 dark:text-muted-foreground mt-1 flex items-center gap-1.5">
                                                <span className="text-slate-700 dark:text-foreground/80">{c.student?.name}</span>
                                                <span className="w-1 h-1 rounded-full bg-slate-400 dark:bg-muted-foreground/40" />
                                                <span className="flex items-center gap-1"><Tag className="w-3 h-3" />{c.category}</span>
                                            </p>
                                        </div>
                                        <Badge variant={c.status === 'Resolved' ? 'resolved' : c.status === 'In Progress' ? 'progress' : 'pending'} className="w-fit shadow-sm">
                                            {c.status}
                                        </Badge>
                                    </div>
                                ))}
                                {(analytics?.recentComplaints || []).length === 0 && (
                                    <div className="py-10 flex flex-col items-center justify-center text-center">
                                        <AlertCircle className="w-10 h-10 text-slate-400 dark:text-muted-foreground/30 mb-3" />
                                        <p className="text-sm font-medium text-slate-500 dark:text-muted-foreground">No recent complaints found</p>
                                    </div>
                                )}
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </main>
        </div>
    );
}
