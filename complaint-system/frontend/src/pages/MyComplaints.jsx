import { useState, useEffect } from 'react';
import Sidebar from '../components/Sidebar';
import ComplaintCard from '../components/ComplaintCard';
import api from '../api/axios';
import { AlertCircle, CheckCircle2, Clock, Loader, ListFilter } from 'lucide-react';
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
        <div className="flex min-h-screen bg-background">
            <Sidebar />
            <main className="flex-1 lg:ml-64 min-w-0 pt-16 lg:pt-0">
                <div className="p-6 max-w-5xl mx-auto">
                    <div className="mb-8">
                        <h1 className="text-2xl font-bold">My Complaints</h1>
                        <p className="text-muted-foreground text-sm mt-1">Track and manage all your submitted issues</p>
                    </div>

                    {/* Mini stat cards */}
                    <div className="grid grid-cols-3 gap-3 mb-6">
                        {statConfig.map(s => {
                            const Icon = s.icon;
                            return (
                                <Card key={s.key} className="cursor-pointer hover:border-border/80 transition-colors" onClick={() => setFilter(filter === s.key ? 'All' : s.key)}>
                                    <CardContent className="p-4 flex items-center gap-3">
                                        <div className={cn('w-9 h-9 rounded-xl flex items-center justify-center shrink-0', s.bg)}>
                                            <Icon className={cn('w-4 h-4', s.color)} />
                                        </div>
                                        <div>
                                            <p className="text-xl font-bold">{counts[s.key] ?? 0}</p>
                                            <p className="text-xs text-muted-foreground">{s.label}</p>
                                        </div>
                                    </CardContent>
                                </Card>
                            );
                        })}
                    </div>

                    {/* Filter tabs */}
                    <div className="flex items-center gap-1 p-1 bg-secondary rounded-xl w-fit mb-6">
                        <ListFilter className="w-4 h-4 text-muted-foreground ml-2" />
                        {FILTERS.map(f => (
                            <button key={f} onClick={() => setFilter(f)}
                                className={cn('px-3 py-1.5 rounded-lg text-sm font-medium transition-all duration-200',
                                    filter === f ? 'bg-card text-foreground shadow-sm' : 'text-muted-foreground hover:text-foreground')}>
                                {f}
                            </button>
                        ))}
                    </div>

                    {/* Complaints */}
                    {loading ? (
                        <div className="grid gap-4 sm:grid-cols-2">
                            {[1, 2, 3, 4].map(i => <div key={i} className="h-40 rounded-xl bg-card animate-pulse border border-border/50" />)}
                        </div>
                    ) : filtered.length === 0 ? (
                        <div className="text-center py-20">
                            <AlertCircle className="w-12 h-12 text-muted-foreground/30 mx-auto mb-3" />
                            <p className="text-muted-foreground">No {filter !== 'All' ? filter.toLowerCase() : ''} complaints found</p>
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
