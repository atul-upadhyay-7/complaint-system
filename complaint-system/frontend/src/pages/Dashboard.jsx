import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../api/axios';
import Sidebar from '../components/Sidebar';
import ComplaintCard from '../components/ComplaintCard';
import { PlusCircle, RefreshCw, Clock, CheckCircle2, AlertCircle, Loader, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils';

const FILTERS = ['All', 'Pending', 'In Progress', 'Resolved'];

const statConfig = [
    { label: 'Total', key: 'total', icon: Sparkles, color: 'text-purple-400', bg: 'bg-purple-500/10' },
    { label: 'Pending', key: 'pending', icon: AlertCircle, color: 'text-amber-400', bg: 'bg-amber-500/10' },
    { label: 'In Progress', key: 'inProgress', icon: Loader, color: 'text-blue-400', bg: 'bg-blue-500/10' },
    { label: 'Resolved', key: 'resolved', icon: CheckCircle2, color: 'text-emerald-400', bg: 'bg-emerald-500/10' },
];

function getGreeting() {
    const h = new Date().getHours();
    if (h < 12) return 'Good Morning';
    if (h < 17) return 'Good Afternoon';
    return 'Good Evening';
}

export default function Dashboard() {
    const { user } = useAuth();
    const [complaints, setComplaints] = useState([]);
    const [filter, setFilter] = useState('All');
    const [loading, setLoading] = useState(true);

    const fetchComplaints = async () => {
        setLoading(true);
        try {
            const { data } = await api.get('/complaints');
            setComplaints(data.complaints || []);
        } catch { /* ignore */ } finally { setLoading(false); }
    };

    useEffect(() => { fetchComplaints(); }, []);

    const stats = {
        total: complaints.length,
        pending: complaints.filter(c => c.status === 'Pending').length,
        inProgress: complaints.filter(c => c.status === 'In Progress').length,
        resolved: complaints.filter(c => c.status === 'Resolved').length,
    };

    const filtered = filter === 'All' ? complaints : complaints.filter(c => c.status === filter);

    return (
        <div className="flex min-h-screen bg-background">
            <Sidebar />
            <main className="flex-1 lg:ml-64 min-w-0 pt-16 lg:pt-0">
                <div className="p-6 max-w-5xl mx-auto">
                    {/* Header */}
                    <div className="flex items-start justify-between mb-8">
                        <div>
                            <h1 className="text-2xl font-bold">
                                {getGreeting()},{' '}
                                <span className="text-gradient">{user?.name?.split(' ')[0]}</span>
                                {' '}👋
                            </h1>
                            <p className="text-muted-foreground text-sm mt-1">
                                {user?.rollNumber && `Roll No: ${user.rollNumber} · `}
                                {user?.hostel && `Hostel: ${user.hostel}`}
                            </p>
                        </div>
                        <div className="flex items-center gap-2">
                            <Button variant="ghost" size="icon" onClick={fetchComplaints} disabled={loading} className="h-9 w-9">
                                <RefreshCw className={cn('w-4 h-4', loading && 'animate-spin')} />
                            </Button>
                            <Button asChild size="sm">
                                <Link to="/submit"><PlusCircle className="w-4 h-4" /> New Complaint</Link>
                            </Button>
                        </div>
                    </div>

                    {/* Stats */}
                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-8">
                        {statConfig.map(s => {
                            const Icon = s.icon;
                            return (
                                <Card key={s.key} className="hover:border-border/80 transition-colors">
                                    <CardContent className="p-4 flex items-center gap-3">
                                        <div className={cn('w-10 h-10 rounded-xl flex items-center justify-center shrink-0', s.bg)}>
                                            <Icon className={cn('w-5 h-5', s.color)} />
                                        </div>
                                        <div>
                                            <p className="text-2xl font-bold text-foreground">{stats[s.key]}</p>
                                            <p className="text-xs text-muted-foreground">{s.label}</p>
                                        </div>
                                    </CardContent>
                                </Card>
                            );
                        })}
                    </div>

                    {/* Filter tabs */}
                    <div className="flex gap-1 p-1 bg-secondary rounded-xl w-fit mb-6">
                        {FILTERS.map(f => (
                            <button key={f} onClick={() => setFilter(f)}
                                className={cn('px-4 py-1.5 rounded-lg text-sm font-medium transition-all duration-200',
                                    filter === f ? 'bg-card text-foreground shadow-sm' : 'text-muted-foreground hover:text-foreground')}>
                                {f}
                                {f !== 'All' && <span className="ml-1.5 text-xs opacity-60">
                                    {complaints.filter(c => c.status === f).length}
                                </span>}
                            </button>
                        ))}
                    </div>

                    {/* Complaints list */}
                    {loading ? (
                        <div className="grid gap-4 sm:grid-cols-2">
                            {[1, 2, 3, 4].map(i => <div key={i} className="h-40 rounded-xl bg-card animate-pulse border border-border/50" />)}
                        </div>
                    ) : filtered.length === 0 ? (
                        <div className="text-center py-20">
                            <div className="w-16 h-16 rounded-2xl glass-purple flex items-center justify-center mx-auto mb-4">
                                <AlertCircle className="w-8 h-8 text-purple-400/60" />
                            </div>
                            <p className="text-muted-foreground font-medium">No complaints found</p>
                            <p className="text-muted-foreground text-sm mt-1">
                                {filter !== 'All' ? `No ${filter.toLowerCase()} complaints` : 'Submit your first complaint'}
                            </p>
                            {filter === 'All' && (
                                <Button asChild className="mt-4" size="sm">
                                    <Link to="/submit"><PlusCircle className="w-4 h-4" /> Submit Complaint</Link>
                                </Button>
                            )}
                        </div>
                    ) : (
                        <div className="grid gap-4 sm:grid-cols-2">
                            {filtered.map(c => <ComplaintCard key={c._id} complaint={c} />)}
                        </div>
                    )}
                </div>
            </main>
        </div>
    );
}
