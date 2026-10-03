import { useState, useEffect } from 'react';
import CountUp from '@/components/reactbits/CountUp';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useSocket } from '../context/SocketContext';
import api from '../api/axios';
import Sidebar from '../components/Sidebar';
import ComplaintCard from '../components/ComplaintCard';
import { SkeletonCard } from '../components/SkeletonCard';
import { Plus, Clock, CheckCircle2, Loader, Folder, ShieldCheck } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

export default function Dashboard() {
    const { user, logout } = useAuth();
    const { notifications } = useSocket();
    const navigate = useNavigate();
    const [complaints, setComplaints] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchComplaints = async () => {
        setLoading(true);
        try {
            const { data } = await api.get('/complaints');
            setComplaints(data.complaints || []);
        } catch { /* ignore */ } finally { setLoading(false); }
    };

    useEffect(() => { fetchComplaints(); }, []);

    // Real-time synchronization: refresh when status changes are received
    useEffect(() => {
        if (notifications.length > 0) fetchComplaints();
    }, [notifications]);

    const handleLogout = () => { logout(); navigate('/login'); };

    const stats = {
        total: complaints.length,
        pending: complaints.filter(c => c.status === 'Pending').length,
        inProgress: complaints.filter(c => c.status === 'In Progress').length,
    };

    return (
        <div className="workspace flex min-h-screen bg-slate-100 dark:bg-[#07140c] text-slate-900 dark:text-[#e4f6e6] transition-colors duration-300">
            <Sidebar />
            <main className="flex-1 lg:ml-[280px] min-w-0 pt-20 lg:pt-0 relative">

                {/* Desktop Topbar */}
                <div className="hidden lg:flex items-center justify-end px-8 py-5">
                    <button onClick={(e) => { e.preventDefault(); logout(); navigate('/login'); }}
                        className="flex items-center gap-2 px-4 py-2.5 rounded-lg border border-slate-200 text-sm font-medium text-slate-600 hover:bg-slate-100 dark:border-[#1d3a28] dark:text-slate-300 dark:hover:bg-[#0c1f14] hover:text-slate-900 dark:hover:text-white transition-colors">
                        <ShieldCheck className="w-4 h-4" /> Secure Logout
                    </button>
                </div>

                <div className="p-4 sm:p-6 md:p-8 max-w-7xl mx-auto">
                    {/* Greeting Section */}
                    <div className="mb-8 animate-fade-in">
                        <h1 className="text-3xl md:text-4xl font-bold tracking-tight mb-3 text-slate-900 dark:text-white">
                            Welcome back, <span className="text-indigo-600 dark:text-indigo-400">{user?.name?.split(' ')[0] || 'User'}</span>
                        </h1>
                        <p className="text-slate-600 dark:text-slate-300 text-sm md:text-base font-medium mb-4">
                            Roll No: <span className="text-slate-800 dark:text-white">{user?.rollNumber || 'Not provided'}</span> <span className="mx-2 opacity-50 text-slate-400 dark:text-slate-500">•</span> Hostel: <span className="text-slate-800 dark:text-white">{user?.hostel || 'Not provided'}</span>
                        </p>

                        <Button asChild className="h-11 px-5 rounded-lg bg-indigo-100 dark:bg-indigo-600/20 hover:bg-indigo-200 dark:hover:bg-indigo-600/30 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-500/30 shadow-sm dark:shadow-[0_0_20px_rgba(29,116,71,0.15)] transition-all">
                            <Link to="/submit"><Plus className="w-4 h-4 mr-2" /> New Complaint</Link>
                        </Button>
                    </div>

                    {/* Stats */}
                    <div className="mb-10 animate-fade-in" style={{ animationDelay: '0.1s' }}>
                        <h2 className="text-2xl font-bold text-slate-800 dark:text-white mb-6">Complaint Statistics</h2>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 md:gap-8">
                            {/* Total Box */}
                            <Card className="bg-white dark:bg-[#0c1f14] border-slate-200 dark:border-[#1d3a28] shadow-sm overflow-hidden relative group">
                                <div className="absolute right-0 bottom-0 w-40 h-40 bg-indigo-50 dark:bg-indigo-500/10 rounded-tl-full blur-2xl group-hover:bg-indigo-100 dark:group-hover:bg-indigo-500/15 transition-all" />
                                <div className="absolute right-0 bottom-0 w-full h-full opacity-10 pattern-dots group-hover:opacity-20 transition-all pointer-events-none" />
                                <CardContent className="p-5 relative z-10">
                                    <div className="flex items-center gap-4 mb-4">
                                        <div className="w-10 h-10 rounded-xl bg-indigo-100 dark:bg-indigo-500/15 flex items-center justify-center border border-indigo-200/50 dark:border-indigo-500/20">
                                            <Folder className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
                                        </div>
                                        <h3 className="text-lg font-semibold text-slate-600 dark:text-slate-200">Total</h3>
                                    </div>
                                    <p className="text-4xl font-bold text-slate-900 dark:text-white tracking-tight"><CountUp to={stats.total || 0} duration={1.2} /></p>
                                </CardContent>
                            </Card>

                            {/* Pending Box */}
                            <Card className="bg-white dark:bg-[#0c1f14] border-slate-200 dark:border-[#1d3a28] shadow-sm overflow-hidden relative group">
                                <div className="absolute right-0 bottom-0 w-40 h-40 bg-orange-50 dark:bg-orange-500/10 rounded-tl-full blur-2xl group-hover:bg-orange-100 dark:group-hover:bg-orange-500/15 transition-all" />
                                <div className="absolute right-0 bottom-0 w-full h-full opacity-10 pattern-dots group-hover:opacity-20 transition-all pointer-events-none" />
                                <CardContent className="p-5 relative z-10">
                                    <div className="flex items-center gap-4 mb-4">
                                        <div className="w-10 h-10 rounded-xl bg-orange-100 dark:bg-orange-500/15 flex items-center justify-center border border-orange-200/50 dark:border-orange-500/20">
                                            <Clock className="w-5 h-5 text-orange-600 dark:text-orange-400" />
                                        </div>
                                        <h3 className="text-lg font-semibold text-slate-600 dark:text-slate-200">Pending</h3>
                                    </div>
                                    <p className="text-4xl font-bold text-slate-900 dark:text-white tracking-tight"><CountUp to={stats.pending || 0} duration={1.2} /></p>
                                </CardContent>
                            </Card>

                            {/* In Progress Box */}
                            <Card className="bg-white dark:bg-[#0c1f14] border-slate-200 dark:border-[#1d3a28] shadow-sm overflow-hidden relative group">
                                <div className="absolute right-0 bottom-0 w-40 h-40 bg-blue-50 dark:bg-blue-500/10 rounded-tl-full blur-2xl group-hover:bg-blue-100 dark:group-hover:bg-blue-500/15 transition-all" />
                                <div className="absolute right-0 bottom-0 w-full h-full opacity-10 pattern-dots group-hover:opacity-20 transition-all pointer-events-none" />
                                <CardContent className="p-5 relative z-10">
                                    <div className="flex items-center gap-4 mb-4">
                                        <div className="w-10 h-10 rounded-xl bg-blue-100 dark:bg-blue-500/15 flex items-center justify-center border border-blue-200/50 dark:border-blue-500/20">
                                            <Loader className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                                        </div>
                                        <h3 className="text-lg font-semibold text-slate-600 dark:text-slate-200">In Progress</h3>
                                    </div>
                                    <p className="text-4xl font-bold text-slate-900 dark:text-white tracking-tight"><CountUp to={stats.inProgress || 0} duration={1.2} /></p>
                                </CardContent>
                            </Card>
                        </div>
                    </div>

                    {/* Check if there are recent complaints */}
                    <div className="animate-fade-in" style={{ animationDelay: '0.2s' }}>
                        {loading ? (
                            <div className="grid gap-4 sm:grid-cols-2 mt-10">
                                {[1, 2].map(i => <SkeletonCard key={i} lines={2} showImage={false} />)}
                            </div>
                        ) : complaints.length > 0 && (
                            <div className="mt-14">
                                <div className="flex items-center justify-between mb-6">
                                    <h2 className="text-xl font-bold text-slate-900 dark:text-white">Recent Activity</h2>
                                    <Button asChild variant="ghost" className="text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300 hover:bg-slate-200 dark:hover:bg-[#0c1f14]">
                                        <Link to="/my-complaints">View All</Link>
                                    </Button>
                                </div>
                                <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
                                    {complaints.slice(0, 3).map(c => <ComplaintCard key={c._id} complaint={c} />)}
                                </div>
                            </div>
                        )}
                    </div>

                </div>
            </main>
        </div>
    );
}
