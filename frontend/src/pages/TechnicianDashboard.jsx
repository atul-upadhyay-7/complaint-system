import { useState, useEffect } from 'react';
import CountUp from '@/components/reactbits/CountUp';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useSocket } from '../context/SocketContext';
import api from '../api/axios';
import Sidebar from '../components/Sidebar';
import { Wrench, Clock, CheckCircle2, Loader2, ShieldCheck, BarChart2, ListChecks, Sparkles, Lightbulb, ClipboardList } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import toast from 'react-hot-toast';

const STATUS_COLORS = {
    'Pending': 'bg-amber-100 text-amber-700 border-amber-200 dark:bg-yellow-500/15 dark:text-yellow-400 dark:border-yellow-500/25',
    'Assigned': 'bg-blue-100 text-blue-700 border-blue-200 dark:bg-blue-500/15 dark:text-blue-400 dark:border-blue-500/25',
    'In Progress': 'bg-indigo-100 text-indigo-700 border-indigo-200 dark:bg-indigo-500/15 dark:text-indigo-400 dark:border-indigo-500/25',
    'Resolved': 'bg-emerald-100 text-emerald-700 border-emerald-200 dark:bg-green-500/15 dark:text-green-400 dark:border-green-500/25',
    'Rejected': 'bg-red-100 text-red-700 border-red-200 dark:bg-red-500/15 dark:text-red-400 dark:border-red-500/25',
};

const PRIORITY_COLORS = {
    'Critical': 'bg-red-100 text-red-700 dark:bg-red-500/15 dark:text-red-400',
    'High': 'bg-orange-100 text-orange-700 dark:bg-orange-500/15 dark:text-orange-400',
    'Medium': 'bg-amber-100 text-amber-700 dark:bg-yellow-500/15 dark:text-yellow-400',
    'Low': 'bg-emerald-100 text-emerald-700 dark:bg-green-500/15 dark:text-green-400',
};

const REPAIR_SUGGESTIONS = {
    'Electricity': 'Check main breaker, test for short circuits, and inspect wiring integrity.',
    'Water': 'Inspect pipe joints for leaks, check valve functionality, and verify pressure.',
    'Cleanliness': 'Focus on high-touch surfaces, check drainage blockage, and verify chemical stock.',
    'Maintenance': 'Inspect for structural wear, verify lubrication points, and check fastener tightness.',
    'Internet': 'Reboot localized router, check port activity, and scan for signal interference.',
    'Security': 'Verify camera feed connectivity, check door latch alignment, and inspect lighting.',
    'Food': 'Review storage temperature, check batch timestamps, and verify ingredient source.',
    'Other': 'Perform generic inspection and consult specific department protocols.'
};

export default function TechnicianDashboard() {
    const { user, logout } = useAuth();
    const { notifications } = useSocket();
    const navigate = useNavigate();
    const [complaints, setComplaints] = useState([]);
    const [loading, setLoading] = useState(true);
    const [updating, setUpdating] = useState(null);

    const fetchMyTasks = async () => {
        setLoading(true);
        try {
            // Technicians see complaints assigned to them via admin endpoint
            const { data } = await api.get('/complaints?limit=50');
            setComplaints(data.complaints || []);
        } catch { toast.error('Failed to load tasks'); } finally { setLoading(false); }
    };

    useEffect(() => { fetchMyTasks(); }, []);

    // Auto-refresh when new notifications arrive (assigned tasks)
    useEffect(() => {
        if (notifications.length > 0) fetchMyTasks();
    }, [notifications]);

    const updateStatus = async (id, status) => {
        setUpdating(id);
        try {
            await api.patch(`/complaints/${id}`, { status });
            toast.success(`Status updated to "${status}"`);
            fetchMyTasks();
        } catch { toast.error('Failed to update status'); } finally { setUpdating(null); }
    };

    const stats = {
        total: complaints.length,
        inProgress: complaints.filter(c => c.status === 'In Progress' || c.status === 'Assigned').length,
        resolved: complaints.filter(c => c.status === 'Resolved').length,
    };

    return (
        <div className="workspace flex min-h-screen bg-slate-50 text-slate-900 dark:bg-[#07140c] dark:text-[#e4f6e6] transition-colors duration-300">
            <Sidebar />
            <main className="flex-1 lg:ml-[280px] min-w-0 pt-20 lg:pt-0">
                {/* Topbar */}
                <div className="hidden lg:flex items-center justify-end px-8 py-5">
                    <button onClick={(e) => { e.preventDefault(); logout(); navigate('/login'); }}
                        className="flex items-center gap-2 px-4 py-2.5 rounded-lg border border-slate-200 text-sm font-medium text-slate-600 hover:bg-slate-100 dark:border-[#1d3a28] dark:text-slate-300 dark:hover:bg-[#0c1f14] hover:text-slate-900 dark:hover:text-white transition-colors">
                        <ShieldCheck className="w-4 h-4" /> Secure Logout
                    </button>
                </div>

                <div className="p-6 md:p-10 max-w-7xl mx-auto">
                    {/* Header */}
                    <div className="mb-10 animate-fade-in">
                        <div className="flex items-center gap-3 mb-2">
                            <div className="w-10 h-10 rounded-xl bg-blue-100 dark:bg-blue-500/15 flex items-center justify-center border border-blue-200 dark:border-blue-500/20">
                                <Wrench className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                            </div>
                            <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-slate-900 dark:text-white">
                                Technician <span className="text-blue-600 dark:text-blue-400">Workbench</span>
                            </h1>
                        </div>
                        <p className="text-slate-600 dark:text-slate-400 text-sm ml-13">
                            Welcome, <span className="text-slate-900 dark:text-white font-medium">{user?.name}</span> · {user?.department || 'Maintenance'}
                        </p>
                    </div>

                    {/* Stats */}
                    <div className="grid grid-cols-3 gap-5 mb-10 animate-fade-in" style={{ animationDelay: '0.1s' }}>
                        {[
                            { label: 'My Tasks', value: stats.total, icon: ListChecks, color: 'blue' },
                            { label: 'In Progress', value: stats.inProgress, icon: Clock, color: 'indigo' },
                            { label: 'Resolved', value: stats.resolved, icon: CheckCircle2, color: 'green' },
                        ].map(({ label, value, icon: Icon, color }) => (
                            <Card key={label} className={`bg-white dark:bg-[#0c1f14] border-slate-200 dark:border-[#1d3a28] overflow-hidden relative group`}>
                                <div className={`absolute right-0 bottom-0 w-32 h-32 bg-${color}-100 dark:bg-${color}-500/10 rounded-tl-full blur-2xl`} />
                                <CardContent className="p-6 relative z-10">
                                    <div className={`w-9 h-9 rounded-xl bg-${color}-100 dark:bg-${color}-500/15 flex items-center justify-center border border-${color}-200 dark:border-${color}-500/20 mb-4`}>
                                        <Icon className={`w-5 h-5 text-${color}-600 dark:text-${color}-400`} />
                                    </div>
                                    <p className="text-4xl font-bold text-slate-900 dark:text-white mb-1"><CountUp to={Number(value) || 0} duration={1.2} /></p>
                                    <p className="text-slate-500 dark:text-slate-400 text-sm">{label}</p>
                                </CardContent>
                            </Card>
                        ))}
                    </div>

                    {/* Task List */}
                    <div className="animate-fade-in" style={{ animationDelay: '0.2s' }}>
                        <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-5">Assigned Complaints</h2>
                        {loading ? (
                            <div className="flex items-center justify-center h-40">
                                <Loader2 className="w-8 h-8 animate-spin text-blue-600 dark:text-blue-400" />
                            </div>
                        ) : complaints.length === 0 ? (
                            <div className="flex flex-col items-center justify-center h-40 text-slate-500 dark:text-slate-400">
                                <ListChecks className="w-12 h-12 mb-3 opacity-30" />
                                <p>No tasks assigned yet</p>
                            </div>
                        ) : (
                            <div className="space-y-3">
                                {complaints.map(c => (
                                    <div key={c._id} className="bg-white dark:bg-[#0c1f14] border border-slate-200 dark:border-[#1d3a28] rounded-xl p-5 hover:border-blue-300 dark:hover:border-blue-500/30 transition-all group">
                                        <div className="flex items-start justify-between gap-4 flex-wrap">
                                            <div className="flex-1 min-w-0">
                                                <div className="flex items-center gap-2 mb-1 flex-wrap">
                                                    <span className={`px-2 py-0.5 rounded-md text-xs font-medium border ${STATUS_COLORS[c.status] || ''}`}>{c.status}</span>
                                                    <span className={`px-2 py-0.5 rounded-md text-xs font-medium ${PRIORITY_COLORS[c.priority] || ''}`}>{c.priority}</span>
                                                    <span className="text-xs text-slate-500">{c.category}</span>
                                                </div>
                                                <h3 className="text-base font-semibold text-slate-900 dark:text-white truncate">{c.title}</h3>
                                                <p className="text-slate-500 dark:text-slate-400 text-sm line-clamp-2 mt-1">{c.description}</p>
                                                <p className="text-slate-400 dark:text-slate-500 text-xs mt-2">
                                                    Reported by: <span className="text-slate-700 dark:text-slate-300">{c.student?.name}</span>
                                                    {c.location && <> · 📍 {c.location}</>}
                                                </p>

                                                {/* AI Insight Row */}
                                                {(c.aiPriority || c.aiSentiment || c.aiEstimatedTime) && (
                                                    <div className="flex items-center flex-wrap gap-2 mt-3 pt-3 border-t border-slate-100 dark:border-white/5">
                                                        <span className="flex items-center gap-1 text-[10px] font-bold text-violet-500 bg-violet-100 dark:bg-violet-500/10 px-1.5 py-0.5 rounded shadow-sm shrink-0">
                                                            <Sparkles className="w-3 h-3" /> AI INSIGHT
                                                        </span>
                                                        {c.aiSentiment && (
                                                            <span className="text-[11px] font-bold text-rose-500 bg-rose-500/10 px-2 py-0.5 rounded-md border border-rose-500/20">
                                                                {c.aiSentiment === 'Urgent' ? '🔥' : c.aiSentiment === 'Frustrated' ? '😤' : '😐'} {c.aiSentiment}
                                                            </span>
                                                        )}
                                                        {c.aiEstimatedTime && (
                                                            <span className="text-[11px] font-bold text-blue-500 bg-blue-500/10 px-2.5 py-0.5 rounded-md border border-blue-500/20 flex items-center gap-1 shadow-sm">
                                                                <ClipboardList className="w-3 h-3" /> ETA: {c.aiEstimatedTime}
                                                            </span>
                                                        )}
                                                    </div>
                                                )}

                                                {/* AI Repair Protocol */}
                                                <div className="mt-4 p-4 rounded-xl bg-blue-500/5 dark:bg-blue-500/10 border border-blue-500/20 flex items-start gap-4">
                                                    <div className="w-9 h-9 rounded-full bg-blue-500/20 flex items-center justify-center shrink-0">
                                                        <Lightbulb className="w-5 h-5 text-blue-500" />
                                                    </div>
                                                    <div>
                                                        <p className="text-[10px] font-black text-blue-600 dark:text-blue-400 uppercase tracking-widest mb-1">AI Repair Protocol</p>
                                                        <p className="text-sm font-medium text-blue-700 dark:text-blue-300 leading-relaxed italic">
                                                            "{REPAIR_SUGGESTIONS[c.category] || REPAIR_SUGGESTIONS['Other']}"
                                                        </p>
                                                    </div>
                                                </div>
                                            </div>
                                            {/* Action Buttons */}
                                            <div className="flex gap-2 shrink-0">
                                                {c.status !== 'In Progress' && c.status !== 'Resolved' && (
                                                    <button
                                                        onClick={() => updateStatus(c._id, 'In Progress')}
                                                        disabled={updating === c._id}
                                                        className="px-3 py-1.5 text-xs rounded-lg bg-indigo-100 dark:bg-indigo-500/15 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-500/25 hover:bg-indigo-200 dark:hover:bg-indigo-500/25 transition-all disabled:opacity-50">
                                                        {updating === c._id ? <Loader2 className="w-3 h-3 animate-spin" /> : 'Mark In Progress'}
                                                    </button>
                                                )}
                                                {c.status !== 'Resolved' && (
                                                    <button
                                                        onClick={() => updateStatus(c._id, 'Resolved')}
                                                        disabled={updating === c._id}
                                                        className="px-3 py-1.5 text-xs rounded-lg bg-green-100 dark:bg-green-500/15 text-green-700 dark:text-green-300 border border-green-200 dark:border-green-500/25 hover:bg-green-200 dark:hover:bg-green-500/25 transition-all disabled:opacity-50">
                                                        {updating === c._id ? <Loader2 className="w-3 h-3 animate-spin" /> : 'Mark Resolved'}
                                                    </button>
                                                )}
                                            </div>
                                        </div>
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
