import { useState, useEffect } from 'react';
import Sidebar from '../components/Sidebar';
import api from '../api/axios';
import { TrendingUp, AlertCircle, CheckCircle2, Loader, Clock, Tag, Users, LayoutDashboard, PieChart as PieChartIcon, BarChart2 } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { SkeletonStatCard, SkeletonChart } from '../components/SkeletonCard';
import CategoryPieChart from '../components/charts/CategoryPieChart';
import WeeklyBarChart from '../components/charts/WeeklyBarChart';

function StatCard({ label, value, icon: Icon, color, bg, sub, delay }) {
    return (
        <Card className="group glass-card border-blue-900/30 hover:border-blue-500/40 card-hover animate-slide-up" style={{ animationDelay: `${delay}s` }}>
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
    const [analytics, setAnalytics] = useState(null);
    const [loading, setLoading] = useState(true);
    const [weeklyData, setWeeklyData] = useState([]);

    useEffect(() => {
        api.get('/admin/analytics').then(({ data }) => {
            setAnalytics(data.analytics);
            setWeeklyData(buildWeeklyData(data.analytics?.recentComplaints || []));
        }).catch(err => console.error('Analytics error:', err))
            .finally(() => setLoading(false));
    }, []);

    if (loading) return (
        <div className="flex min-h-screen bg-background relative">
            <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
                <div className="absolute top-[-10%] right-[-5%] w-[500px] h-[500px] bg-blue-900/10 rounded-full blur-[120px] animate-float" />
            </div>
            <Sidebar />
            <main className="flex-1 lg:ml-64 p-4 sm:p-6 md:p-8 pt-20 lg:pt-8 w-full z-10">
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
        <div className="flex min-h-screen bg-background relative selection:bg-blue-500/30">
            <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
                <div className="absolute top-[-10%] right-[-5%] w-[500px] h-[500px] bg-blue-900/10 rounded-full blur-[120px] animate-float" />
                <div className="absolute bottom-[-10%] left-[-5%] w-[400px] h-[400px] bg-cyan-900/8 rounded-full blur-[120px] animate-float" style={{ animationDelay: '2s' }} />
            </div>

            <Sidebar />
            <main className="flex-1 lg:ml-64 min-w-0 pt-16 lg:pt-0 relative z-10">
                <div className="p-4 sm:p-6 md:p-8 max-w-7xl mx-auto">
                    {/* Header */}
                    <div className="mb-8 animate-slide-up">
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-xs font-medium text-blue-400 mb-3 animate-fade-in">
                            <LayoutDashboard className="w-3.5 h-3.5" /> Command Center
                        </div>
                        <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-foreground">System Overview</h1>
                        <p className="text-muted-foreground text-sm sm:text-base mt-2">Comprehensive analytics of all campus complaint activity</p>
                    </div>

                    {/* Stats grid */}
                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-5 mb-8">
                        <StatCard label="Total Complaints" value={total} icon={Users} color="text-blue-400" bg="bg-blue-500/10" sub="All time record" delay={0.1} />
                        <StatCard label="Pending Review" value={pending} icon={AlertCircle} color="text-amber-400" bg="bg-amber-500/10" sub="Awaiting action" delay={0.2} />
                        <StatCard label="In Progress" value={inProgress} icon={Loader} color="text-cyan-400" bg="bg-cyan-500/10" sub="Currently handled" delay={0.3} />
                        <StatCard label="Resolved" value={resolved} icon={CheckCircle2} color="text-emerald-400" bg="bg-emerald-500/10" sub={`${resolutionRate}% resolution rate`} delay={0.4} />
                    </div>

                    {/* Charts Row */}
                    <div className="grid lg:grid-cols-2 gap-4 sm:gap-6 mb-6">
                        {/* Pie Chart */}
                        <Card className="glass-card border-blue-900/30 animate-slide-up" style={{ animationDelay: '0.45s' }}>
                            <CardHeader className="pb-2">
                                <CardTitle className="text-base font-semibold flex items-center gap-2">
                                    <PieChartIcon className="w-4.5 h-4.5 text-blue-400" /> Category Distribution
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <CategoryPieChart data={analytics?.topCategories || []} />
                            </CardContent>
                        </Card>

                        {/* Bar Chart */}
                        <Card className="glass-card border-blue-900/30 animate-slide-up" style={{ animationDelay: '0.5s' }}>
                            <CardHeader className="pb-2">
                                <CardTitle className="text-base font-semibold flex items-center gap-2">
                                    <BarChart2 className="w-4.5 h-4.5 text-blue-400" /> Weekly Activity
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
                        <Card className="glass-card border-blue-900/30 animate-slide-up" style={{ animationDelay: '0.55s' }}>
                            <CardHeader className="pb-4">
                                <CardTitle className="text-base font-semibold flex items-center gap-2">
                                    <TrendingUp className="w-4.5 h-4.5 text-blue-400" /> Resolution Efficiency
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-5">
                                <div className="p-4 rounded-xl bg-blue-500/5 border border-blue-500/15">
                                    <div className="flex justify-between text-sm mb-3">
                                        <span className="font-medium text-foreground">Resolved Successfully</span>
                                        <span className="font-bold text-emerald-400">{resolutionRate}%</span>
                                    </div>
                                    <Progress value={resolutionRate} className="h-3 bg-secondary" indicatorClassName="bg-gradient-to-r from-blue-500 to-emerald-500" />
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    {[
                                        { label: 'Pending', val: total > 0 ? Math.round((pending / total) * 100) : 0, color: 'bg-amber-500' },
                                        { label: 'In Progress', val: total > 0 ? Math.round((inProgress / total) * 100) : 0, color: 'bg-cyan-500' },
                                    ].map(r => (
                                        <div key={r.label} className="p-3 rounded-xl bg-secondary/20 border border-border/30">
                                            <div className="flex justify-between text-xs mb-2">
                                                <span className="font-medium text-muted-foreground">{r.label}</span>
                                                <span className="font-bold text-foreground">{r.val}%</span>
                                            </div>
                                            <div className="h-2 rounded-full bg-secondary overflow-hidden">
                                                <div className={`h-full ${r.color} rounded-full transition-all duration-1000 ease-out`} style={{ width: `${r.val}%` }} />
                                            </div>
                                        </div>
                                    ))}
                                </div>
                                <div className="pt-4 border-t border-border/50 flex items-center justify-between text-sm">
                                    <div className="flex items-center gap-2 text-muted-foreground font-medium">
                                        <Clock className="w-4 h-4 text-blue-400" /> Avg Resolution Time
                                    </div>
                                    <span className="font-bold text-foreground px-2.5 py-1 rounded-md glass-card border border-blue-500/15">{avgDays} days</span>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Top Categories */}
                        <Card className="glass-card border-blue-900/30 animate-slide-up" style={{ animationDelay: '0.6s' }}>
                            <CardHeader className="pb-4">
                                <CardTitle className="text-base font-semibold flex items-center gap-2">
                                    <Tag className="w-4.5 h-4.5 text-blue-400" /> Most Frequent Issues
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                {(analytics?.topCategories || []).slice(0, 5).map((cat, i) => {
                                    const max = analytics?.topCategories?.[0]?.count || 1;
                                    const pct = Math.round((cat.count / max) * 100);
                                    const colors = ['from-blue-500 to-cyan-400', 'from-blue-600 to-blue-400', 'from-cyan-500 to-blue-300', 'from-blue-400 to-indigo-400', 'from-indigo-500 to-blue-400'];
                                    return (
                                        <div key={cat._id} className="group flex flex-col gap-1.5 rounded-lg p-1 hover:bg-white/5 transition-colors">
                                            <div className="flex justify-between text-sm px-1">
                                                <span className="text-foreground font-medium flex items-center gap-2">
                                                    <span className="w-1.5 h-1.5 rounded-full bg-blue-500/70" />
                                                    {cat._id}
                                                </span>
                                                <span className="font-bold text-muted-foreground tabular-nums">{cat.count}</span>
                                            </div>
                                            <div className="h-2 rounded-full bg-secondary/50 overflow-hidden">
                                                <div className={`h-full bg-gradient-to-r ${colors[i % colors.length]} rounded-full transition-all duration-1000 ease-out`} style={{ width: `${pct}%` }} />
                                            </div>
                                        </div>
                                    );
                                })}
                                {(analytics?.topCategories || []).length === 0 && (
                                    <div className="h-40 flex flex-col items-center justify-center text-center">
                                        <Tag className="w-8 h-8 text-muted-foreground/30 mb-2" />
                                        <p className="text-sm font-medium text-muted-foreground">No category data yet</p>
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                    </div>

                    {/* Recent Complaints */}
                    <Card className="glass-card border-blue-900/30 animate-slide-up" style={{ animationDelay: '0.65s' }}>
                        <CardHeader className="pb-3">
                            <CardTitle className="text-base font-semibold">Latest Submissions</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-2">
                                {(analytics?.recentComplaints || []).map((c) => (
                                    <div key={c._id} className="group flex sm:items-center flex-col sm:flex-row gap-3 sm:gap-4 p-3.5 rounded-xl hover:bg-blue-500/5 border border-transparent hover:border-blue-900/50 transition-all duration-200">
                                        <div className="flex-1 min-w-0 pr-4">
                                            <p className="text-sm font-semibold text-foreground truncate group-hover:text-blue-300 transition-colors">{c.title}</p>
                                            <p className="text-xs font-medium text-muted-foreground mt-1 flex items-center gap-1.5">
                                                <span className="text-foreground/80">{c.student?.name}</span>
                                                <span className="w-1 h-1 rounded-full bg-muted-foreground/40" />
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
                                        <AlertCircle className="w-10 h-10 text-muted-foreground/30 mb-3" />
                                        <p className="text-sm font-medium text-muted-foreground">No recent complaints found</p>
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
