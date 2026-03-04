import { useState, useEffect } from 'react';
import Sidebar from '../components/Sidebar';
import api from '../api/axios';
import { TrendingUp, AlertCircle, CheckCircle2, Loader, Clock, Tag, Users, LayoutDashboard } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

function StatCard({ label, value, icon: Icon, color, bg, sub, delay }) {
    return (
        <Card className="group hover:border-purple-500/40 bg-card/60 backdrop-blur-sm border-border/40 transition-all duration-300 hover:-translate-y-1 hover:shadow-purple-glow animate-slide-up" style={{ animationDelay: `${delay}s` }}>
            <CardContent className="p-5">
                <div className="flex items-center justify-between mb-3">
                    <p className="text-sm text-muted-foreground font-medium">{label}</p>
                    <div className={cn('w-10 h-10 rounded-xl flex items-center justify-center transition-transform group-hover:scale-110 shadow-sm', bg)}>
                        <Icon className={cn('w-4.5 h-4.5', color)} />
                    </div>
                </div>
                <p className="text-3xl font-bold text-foreground drop-shadow-sm">{value}</p>
                {sub && <p className="text-xs text-muted-foreground mt-1.5 font-medium">{sub}</p>}
            </CardContent>
        </Card>
    );
}

export default function AdminDashboard() {
    const [analytics, setAnalytics] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        api.get('/complaints/analytics').then(({ data }) => setAnalytics(data)).finally(() => setLoading(false));
    }, []);

    if (loading) return (
        <div className="flex min-h-screen bg-background relative selection:bg-purple-500/30">
            {/* Global Background Orbs */}
            <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
                <div className="absolute top-[-10%] right-[-5%] w-[500px] h-[500px] bg-purple-900/10 rounded-full blur-[120px] animate-float" />
            </div>
            <Sidebar />
            <main className="flex-1 lg:ml-64 p-4 sm:p-6 md:p-8 pt-20 lg:pt-8 w-full z-10">
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                    {[1, 2, 3, 4].map(i => <div key={i} className="h-32 rounded-xl bg-card/50 animate-pulse border border-border/40" />)}
                </div>
                <div className="grid lg:grid-cols-2 gap-4">
                    {[1, 2].map(i => <div key={i} className="h-72 rounded-xl bg-card/50 animate-pulse border border-border/40" />)}
                </div>
            </main>
        </div>
    );

    const total = analytics?.statusCounts?.reduce((a, c) => a + c.count, 0) || 0;
    const getCount = (status) => analytics?.statusCounts?.find(s => s._id === status)?.count || 0;
    const pending = getCount('Pending');
    const inProgress = getCount('In Progress');
    const resolved = getCount('Resolved');
    const resolutionRate = total > 0 ? Math.round((resolved / total) * 100) : 0;
    const avgDays = analytics?.avgResolutionDays != null ? Number(analytics.avgResolutionDays).toFixed(1) : 'N/A';

    return (
        <div className="flex min-h-screen bg-background relative selection:bg-purple-500/30">
            {/* Global Background Orbs */}
            <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
                <div className="absolute top-[-10%] right-[-5%] w-[500px] h-[500px] bg-purple-900/10 rounded-full blur-[120px] animate-float" />
                <div className="absolute bottom-[-10%] left-[-5%] w-[400px] h-[400px] bg-indigo-900/10 rounded-full blur-[120px] animate-float" style={{ animationDelay: '2s' }} />
            </div>

            <Sidebar />
            <main className="flex-1 lg:ml-64 min-w-0 pt-16 lg:pt-0 relative z-10">
                <div className="p-4 sm:p-6 md:p-8 max-w-7xl mx-auto z-10">
                    <div className="mb-8 animate-slide-up">
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-secondary/50 border border-border/50 text-xs font-medium text-muted-foreground mb-3 animate-fade-in shadow-sm">
                            <LayoutDashboard className="w-3.5 h-3.5 text-purple-400" /> Command Center
                        </div>
                        <h1 className="text-3xl sm:text-4xl font-bold tracking-tight">System Overview</h1>
                        <p className="text-muted-foreground text-sm sm:text-base mt-2">Comprehensive analytics of all campus complaint activity</p>
                    </div>

                    {/* Stats grid */}
                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-5 mb-8">
                        <StatCard label="Total Complaints" value={total} icon={Users} color="text-purple-400" bg="bg-purple-500/10 shadow-purple-500/20" sub="All time record" delay={0.1} />
                        <StatCard label="Pending Review" value={pending} icon={AlertCircle} color="text-amber-400" bg="bg-amber-500/10 shadow-amber-500/20" sub="Awaiting initial action" delay={0.2} />
                        <StatCard label="In Progress" value={inProgress} icon={Loader} color="text-blue-400" bg="bg-blue-500/10 shadow-blue-500/20" sub="Currently being handled" delay={0.3} />
                        <StatCard label="Successfully Resolved" value={resolved} icon={CheckCircle2} color="text-emerald-400" bg="bg-emerald-500/10 shadow-emerald-500/20" sub={`${resolutionRate}% overall resolution rate`} delay={0.4} />
                    </div>

                    <div className="grid lg:grid-cols-2 gap-4 sm:gap-6 mb-6">
                        {/* Resolution Rate Card */}
                        <Card className="border-border/40 shadow-sm bg-card/60 backdrop-blur-sm animate-slide-up" style={{ animationDelay: '0.5s' }}>
                            <CardHeader className="pb-4">
                                <CardTitle className="text-base font-semibold flex items-center gap-2">
                                    <TrendingUp className="w-4.5 h-4.5 text-purple-400" /> Resolution Efficiency
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-5">
                                <div className="p-4 rounded-xl bg-secondary/30 border border-border/40">
                                    <div className="flex justify-between text-sm mb-3">
                                        <span className="font-medium text-foreground">Resolved Successfully</span>
                                        <span className="font-bold text-emerald-400">{resolutionRate}%</span>
                                    </div>
                                    <Progress value={resolutionRate} className="h-3 bg-secondary" indicatorClassName="bg-emerald-500" />
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    {[
                                        { label: 'Pending', val: total > 0 ? Math.round((pending / total) * 100) : 0, color: 'bg-amber-500' },
                                        { label: 'In Progress', val: total > 0 ? Math.round((inProgress / total) * 100) : 0, color: 'bg-blue-500' },
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
                                        <Clock className="w-4 h-4 text-purple-400" /> Average Resolution Time
                                    </div>
                                    <span className="font-bold text-foreground px-2.5 py-1 rounded-md bg-secondary/50 border border-border/50">{avgDays} days</span>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Top Categories Card */}
                        <Card className="border-border/40 shadow-sm bg-card/60 backdrop-blur-sm animate-slide-up" style={{ animationDelay: '0.6s' }}>
                            <CardHeader className="pb-4">
                                <CardTitle className="text-base font-semibold flex items-center gap-2">
                                    <Tag className="w-4.5 h-4.5 text-purple-400" /> Most Frequent Issues
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                {(analytics?.categoryCounts || []).slice(0, 5).map((cat, i) => {
                                    const max = analytics?.categoryCounts?.[0]?.count || 1;
                                    const pct = Math.round((cat.count / max) * 100);
                                    return (
                                        <div key={cat._id} className="group flex flex-col gap-1.5 rounded-lg p-1 hover:bg-secondary/30 transition-colors">
                                            <div className="flex justify-between text-sm px-1">
                                                <span className="text-foreground font-medium flex items-center gap-2">
                                                    <span className="w-1.5 h-1.5 rounded-full bg-purple-500/70" />
                                                    {cat._id}
                                                </span>
                                                <span className="font-bold text-muted-foreground tabular-nums">{cat.count}</span>
                                            </div>
                                            <div className="h-2 rounded-full bg-secondary/50 overflow-hidden">
                                                <div className="h-full bg-gradient-to-r from-purple-600 to-indigo-500 rounded-full transition-all duration-1000 ease-out group-hover:from-purple-500 group-hover:to-indigo-400" style={{ width: `${pct}%` }} />
                                            </div>
                                        </div>
                                    );
                                })}
                                {(analytics?.categoryCounts || []).length === 0 && (
                                    <div className="h-40 flex flex-col items-center justify-center text-center">
                                        <Tag className="w-8 h-8 text-muted-foreground/30 mb-2" />
                                        <p className="text-sm font-medium text-muted-foreground">No category data available yet</p>
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                    </div>

                    {/* Recent Complaints Table */}
                    <Card className="border-border/40 shadow-sm bg-card/60 backdrop-blur-sm animate-slide-up" style={{ animationDelay: '0.7s' }}>
                        <CardHeader className="pb-3 flex flex-row items-center justify-between">
                            <CardTitle className="text-base font-semibold">Latest Submissions</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-2">
                                {(analytics?.recentComplaints || []).map((c, i) => (
                                    <div key={c._id} className="group flex sm:items-center flex-col sm:flex-row gap-3 sm:gap-4 p-3.5 rounded-xl hover:bg-secondary/50 border border-transparent hover:border-border/50 transition-all duration-200">
                                        <div className="flex-1 min-w-0 pr-4">
                                            <p className="text-sm font-semibold text-foreground truncate group-hover:text-purple-300 transition-colors">{c.title}</p>
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
