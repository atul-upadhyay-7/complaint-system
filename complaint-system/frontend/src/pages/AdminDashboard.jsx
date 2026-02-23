import { useState, useEffect } from 'react';
import Sidebar from '../components/Sidebar';
import api from '../api/axios';
import { TrendingUp, AlertCircle, CheckCircle2, Loader, Clock, Tag, Users } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

function StatCard({ label, value, icon: Icon, color, bg, sub }) {
    return (
        <Card>
            <CardContent className="p-5">
                <div className="flex items-center justify-between mb-3">
                    <p className="text-sm text-muted-foreground font-medium">{label}</p>
                    <div className={cn('w-9 h-9 rounded-xl flex items-center justify-center', bg)}>
                        <Icon className={cn('w-4 h-4', color)} />
                    </div>
                </div>
                <p className="text-3xl font-bold text-foreground">{value}</p>
                {sub && <p className="text-xs text-muted-foreground mt-1">{sub}</p>}
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
        <div className="flex min-h-screen bg-background">
            <Sidebar />
            <main className="flex-1 lg:ml-64 p-6 pt-20 lg:pt-6">
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                    {[1, 2, 3, 4].map(i => <div key={i} className="h-28 rounded-xl bg-card animate-pulse border border-border/50" />)}
                </div>
                <div className="grid lg:grid-cols-2 gap-4">
                    {[1, 2].map(i => <div key={i} className="h-64 rounded-xl bg-card animate-pulse border border-border/50" />)}
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
        <div className="flex min-h-screen bg-background">
            <Sidebar />
            <main className="flex-1 lg:ml-64 min-w-0 pt-16 lg:pt-0">
                <div className="p-6 max-w-6xl mx-auto">
                    <div className="mb-8">
                        <h1 className="text-2xl font-bold">Admin Dashboard</h1>
                        <p className="text-muted-foreground text-sm mt-1">Overview of all campus complaint activity</p>
                    </div>

                    {/* Stats grid */}
                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                        <StatCard label="Total Complaints" value={total} icon={Users} color="text-purple-400" bg="bg-purple-500/10" sub="All time" />
                        <StatCard label="Pending" value={pending} icon={AlertCircle} color="text-amber-400" bg="bg-amber-500/10" sub="Awaiting action" />
                        <StatCard label="In Progress" value={inProgress} icon={Loader} color="text-blue-400" bg="bg-blue-500/10" sub="Being handled" />
                        <StatCard label="Resolved" value={resolved} icon={CheckCircle2} color="text-emerald-400" bg="bg-emerald-500/10" sub={`${resolutionRate}% resolution rate`} />
                    </div>

                    <div className="grid lg:grid-cols-2 gap-4 mb-4">
                        {/* Resolution Rate Card */}
                        <Card>
                            <CardHeader className="pb-2">
                                <CardTitle className="text-base flex items-center gap-2">
                                    <TrendingUp className="w-4 h-4 text-purple-400" /> Resolution Rate
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div>
                                    <div className="flex justify-between text-sm mb-2">
                                        <span className="text-muted-foreground">Resolved</span>
                                        <span className="font-semibold text-emerald-400">{resolutionRate}%</span>
                                    </div>
                                    <Progress value={resolutionRate} className="h-2.5" />
                                </div>
                                {[
                                    { label: 'Pending', val: total > 0 ? Math.round((pending / total) * 100) : 0, color: 'bg-amber-500' },
                                    { label: 'In Progress', val: total > 0 ? Math.round((inProgress / total) * 100) : 0, color: 'bg-blue-500' },
                                ].map(r => (
                                    <div key={r.label}>
                                        <div className="flex justify-between text-sm mb-2">
                                            <span className="text-muted-foreground">{r.label}</span>
                                            <span className="font-semibold">{r.val}%</span>
                                        </div>
                                        <div className="h-1.5 rounded-full bg-secondary overflow-hidden">
                                            <div className={`h-full ${r.color} rounded-full transition-all duration-500`} style={{ width: `${r.val}%` }} />
                                        </div>
                                    </div>
                                ))}
                                <div className="pt-2 border-t border-border/50 flex items-center gap-2 text-sm text-muted-foreground">
                                    <Clock className="w-4 h-4" />
                                    Avg resolution time: <span className="font-semibold text-foreground ml-1">{avgDays} days</span>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Top Categories Card */}
                        <Card>
                            <CardHeader className="pb-2">
                                <CardTitle className="text-base flex items-center gap-2">
                                    <Tag className="w-4 h-4 text-purple-400" /> Top Categories
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-3">
                                {(analytics?.categoryCounts || []).slice(0, 5).map((cat, i) => {
                                    const max = analytics?.categoryCounts?.[0]?.count || 1;
                                    const pct = Math.round((cat.count / max) * 100);
                                    return (
                                        <div key={cat._id}>
                                            <div className="flex justify-between text-sm mb-1">
                                                <span className="text-foreground font-medium">{cat._id}</span>
                                                <span className="text-muted-foreground">{cat.count}</span>
                                            </div>
                                            <div className="h-1.5 rounded-full bg-secondary overflow-hidden">
                                                <div className="h-full bg-purple-600 rounded-full transition-all duration-500" style={{ width: `${pct}%` }} />
                                            </div>
                                        </div>
                                    );
                                })}
                                {(analytics?.categoryCounts || []).length === 0 && (
                                    <p className="text-sm text-muted-foreground text-center py-4">No data yet</p>
                                )}
                            </CardContent>
                        </Card>
                    </div>

                    {/* Recent Complaints Table */}
                    <Card>
                        <CardHeader className="pb-3">
                            <CardTitle className="text-base">Recent Complaints</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-2">
                                {(analytics?.recentComplaints || []).map(c => (
                                    <div key={c._id} className="flex items-center gap-4 p-3 rounded-xl hover:bg-secondary/50 transition-colors">
                                        <div className="flex-1 min-w-0">
                                            <p className="text-sm font-medium text-foreground truncate">{c.title}</p>
                                            <p className="text-xs text-muted-foreground">{c.student?.name} · {c.category}</p>
                                        </div>
                                        <Badge variant={c.status === 'Resolved' ? 'resolved' : c.status === 'In Progress' ? 'progress' : 'pending'}>
                                            {c.status}
                                        </Badge>
                                    </div>
                                ))}
                                {(analytics?.recentComplaints || []).length === 0 && (
                                    <p className="text-sm text-muted-foreground text-center py-6">No recent complaints</p>
                                )}
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </main>
        </div>
    );
}
