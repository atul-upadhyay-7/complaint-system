import { useState, useEffect } from 'react';
import Sidebar from '../components/Sidebar';
import ComplaintCard from '../components/ComplaintCard';
import api from '../api/axios';
import { AlertCircle, CheckCircle2, Clock, Loader, ListFilter, LayoutDashboard } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils';

const FILTERS = ['All', 'Pending', 'In Progress', 'Resolved', 'Rejected'];

const statConfig = [
    { label: 'Pending', key: 'Pending', icon: AlertCircle, color: 'text-amber-400', bg: 'bg-amber-500/10' },
    { label: 'In Progress', key: 'In Progress', icon: Loader, color: 'text-blue-400', bg: 'bg-blue-500/10' },
    { label: 'Resolved', key: 'Resolved', icon: CheckCircle2, color: 'text-emerald-400', bg: 'bg-emerald-500/10' },
];

export default function MyComplaints() {
    const [complaints, setComplaints] = useState([]);
    const [filter, setFilter] = useState('All');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        api.get('/complaints').then(({ data }) => setComplaints(data.complaints || [])).finally(() => setLoading(false));
    }, []);

    const counts = Object.fromEntries(statConfig.map(s => [s.key, complaints.filter(c => c.status === s.key).length]));
    const filtered = filter === 'All' ? complaints : complaints.filter(c => c.status === filter);

    return (
        <div className="flex min-h-screen bg-background relative selection:bg-purple-500/30">
            {/* Global Background Orbs */}
            <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
                <div className="absolute top-[40%] left-[-10%] w-[500px] h-[500px] bg-purple-900/10 rounded-full blur-[120px] animate-float" style={{ animationDelay: '1s' }} />
            </div>

            <Sidebar />
            <main className="flex-1 lg:ml-64 min-w-0 pt-16 lg:pt-0 relative z-10">
                <div className="p-4 sm:p-6 md:p-8 max-w-5xl mx-auto z-10">
                    <div className="mb-8 animate-slide-up">
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-secondary/50 border border-border/50 text-xs font-medium text-muted-foreground mb-3 animate-fade-in shadow-sm">
                            <LayoutDashboard className="w-3.5 h-3.5 text-purple-400" /> Your History
                        </div>
                        <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-foreground">My Complaints</h1>
                        <p className="text-muted-foreground text-sm sm:text-base mt-2">Track, manage, and view the status of all your submitted issues.</p>
                    </div>

                    {/* Mini stat cards */}
                    <div className="grid grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 mb-8">
                        {statConfig.map((s, i) => {
                            const Icon = s.icon;
                            return (
                                <Card key={s.key} className="cursor-pointer group hover:border-purple-500/40 bg-card/60 backdrop-blur-sm border-border/40 transition-all duration-300 hover:-translate-y-1 hover:shadow-purple-glow animate-slide-up" style={{ animationDelay: `${0.1 + (i * 0.1)}s` }} onClick={() => setFilter(filter === s.key ? 'All' : s.key)}>
                                    <CardContent className="p-4 sm:p-5 flex items-center gap-3 sm:gap-4">
                                        <div className={cn('w-10 h-10 sm:w-12 sm:h-12 rounded-xl flex items-center justify-center shrink-0 transition-transform group-hover:scale-110', s.bg)}>
                                            <Icon className={cn('w-5 h-5 sm:w-6 sm:h-6', s.color)} />
                                        </div>
                                        <div>
                                            <p className="text-2xl sm:text-3xl font-bold text-foreground drop-shadow-sm">{counts[s.key] ?? 0}</p>
                                            <p className="text-xs sm:text-sm font-medium text-muted-foreground">{s.label}</p>
                                        </div>
                                    </CardContent>
                                </Card>
                            );
                        })}
                    </div>

                    {/* Filter tabs */}
                    <div className="flex overflow-x-auto pb-2 scrollbar-hide mb-6 animate-slide-up" style={{ animationDelay: '0.4s' }}>
                        <div className="flex items-center gap-1 p-1 bg-secondary/50 backdrop-blur-sm border border-border/50 rounded-xl w-fit min-w-max">
                            <ListFilter className="w-4 h-4 text-muted-foreground mx-2 shrink-0" />
                            {FILTERS.map(f => (
                                <button key={f} onClick={() => setFilter(f)}
                                    className={cn('px-3 sm:px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 whitespace-nowrap',
                                        filter === f ? 'bg-background shadow-card text-foreground border border-border/50' : 'text-muted-foreground hover:text-foreground hover:bg-secondary/50')}>
                                    {f}
                                    {f !== 'All' && <span className={cn("ml-2 text-xs px-1.5 py-0.5 rounded-md bg-secondary border border-border/50 opacity-80", filter === f && "bg-secondary text-foreground hidden sm:inline-block")}>
                                        {complaints.filter(c => c.status === f).length}
                                    </span>}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Complaints */}
                    <div className="animate-slide-up" style={{ animationDelay: '0.5s' }}>
                        {loading ? (
                            <div className="grid gap-4 sm:grid-cols-2">
                                {[1, 2, 3, 4].map(i => <div key={i} className="h-44 rounded-2xl bg-card/40 animate-pulse border border-border/30" />)}
                            </div>
                        ) : filtered.length === 0 ? (
                            <div className="text-center py-20 sm:py-28 px-4 rounded-3xl border border-dashed border-border/50 bg-secondary/20 backdrop-blur-sm">
                                <div className="w-20 h-20 rounded-3xl glass-purple flex items-center justify-center mx-auto mb-6 animate-float">
                                    <AlertCircle className="w-10 h-10 text-purple-400/80" />
                                </div>
                                <h3 className="text-lg sm:text-xl font-semibold text-foreground mb-2">No complaints found</h3>
                                <p className="text-muted-foreground text-sm sm:text-base max-w-sm mx-auto">
                                    {filter !== 'All' ? `You don't have any complaints marked as "${filter}".` : "You haven't submitted any complaints yet."}
                                </p>
                            </div>
                        ) : (
                            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
                                {filtered.map((c, i) => (
                                    <div key={c._id} className="animate-slide-up" style={{ animationDelay: `${0.1 + (i * 0.05)}s` }}>
                                        <ComplaintCard complaint={c} />
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </main>
        </div>
    );
}
