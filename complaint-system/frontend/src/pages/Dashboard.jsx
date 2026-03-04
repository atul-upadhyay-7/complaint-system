import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../api/axios';
import Sidebar from '../components/Sidebar';
import ComplaintCard from '../components/ComplaintCard';
import { Plus, Clock, CheckCircle2, Loader, Folder, ShieldCheck } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

export default function Dashboard() {
    const { user, logout } = useAuth();
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

    const handleLogout = () => { logout(); navigate('/login'); };

    const stats = {
        total: complaints.length,
        pending: complaints.filter(c => c.status === 'Pending').length,
        inProgress: complaints.filter(c => c.status === 'In Progress').length,
    };

    return (
        <div className="flex min-h-screen bg-[#070710] text-[#f1f0ff]">
            <Sidebar />
            <main className="flex-1 lg:ml-[280px] min-w-0 pt-20 lg:pt-0 relative">

                {/* Desktop Topbar */}
                <div className="hidden lg:flex items-center justify-end px-8 py-5">
                    <button onClick={handleLogout} className="flex items-center gap-2 px-4 py-2.5 rounded-lg border border-[#1e1e2d] text-sm font-medium text-slate-300 hover:bg-[#121124] hover:text-white transition-colors">
                        <ShieldCheck className="w-4 h-4" /> Secure Logout
                    </button>
                </div>

                <div className="p-6 md:p-10 max-w-7xl mx-auto">
                    {/* Greeting Section */}
                    <div className="mb-14 animate-fade-in">
                        <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-3">
                            Good Evening, <span className="text-indigo-400">{user?.name?.split(' ')[0] || 'User'}</span> <span className="inline-block origin-bottom-right rotate-[-10deg]">👋</span>
                        </h1>
                        <p className="text-slate-400 text-sm md:text-base font-medium mb-8">
                            Roll No: {user?.rollNumber || '2021CS042'} <span className="mx-2 opacity-50">•</span> Hostel: {user?.hostel || 'Block A'}
                        </p>

                        <Button asChild className="h-11 px-5 rounded-lg bg-indigo-600/20 hover:bg-indigo-600/30 text-indigo-300 border border-indigo-500/30 shadow-[0_0_20px_rgba(99,102,241,0.15)] transition-all">
                            <Link to="/submit"><Plus className="w-4 h-4 mr-2" /> New Complaint</Link>
                        </Button>
                    </div>

                    {/* Stats */}
                    <div className="mb-10 animate-fade-in" style={{ animationDelay: '0.1s' }}>
                        <h2 className="text-2xl font-bold text-white mb-6">Complaint Statistics</h2>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 md:gap-8">
                            {/* Total Box */}
                            <Card className="bg-[#121124] border-[#1e1e2d] overflow-hidden relative group">
                                <div className="absolute right-0 bottom-0 w-40 h-40 bg-indigo-500/10 rounded-tl-full blur-2xl group-hover:bg-indigo-500/15 transition-all" />
                                <div className="absolute right-0 bottom-0 w-full h-full opacity-10 pattern-dots group-hover:opacity-20 transition-all pointer-events-none" />
                                <CardContent className="p-7 relative z-10">
                                    <div className="flex items-center gap-4 mb-8">
                                        <div className="w-10 h-10 rounded-xl bg-indigo-500/15 flex items-center justify-center border border-indigo-500/20">
                                            <Folder className="w-5 h-5 text-indigo-400" />
                                        </div>
                                        <h3 className="text-lg font-semibold text-slate-200">Total</h3>
                                    </div>
                                    <p className="text-5xl font-bold text-white tracking-tight">{stats.total}</p>
                                </CardContent>
                            </Card>

                            {/* Pending Box */}
                            <Card className="bg-[#121124] border-[#1e1e2d] overflow-hidden relative group">
                                <div className="absolute right-0 bottom-0 w-40 h-40 bg-orange-500/10 rounded-tl-full blur-2xl group-hover:bg-orange-500/15 transition-all" />
                                <div className="absolute right-0 bottom-0 w-full h-full opacity-10 pattern-dots group-hover:opacity-20 transition-all pointer-events-none" />
                                <CardContent className="p-7 relative z-10">
                                    <div className="flex items-center gap-4 mb-8">
                                        <div className="w-10 h-10 rounded-xl bg-orange-500/15 flex items-center justify-center border border-orange-500/20">
                                            <Clock className="w-5 h-5 text-orange-400" />
                                        </div>
                                        <h3 className="text-lg font-semibold text-slate-200">Pending</h3>
                                    </div>
                                    <p className="text-5xl font-bold text-white tracking-tight">{stats.pending}</p>
                                </CardContent>
                            </Card>

                            {/* In Progress Box */}
                            <Card className="bg-[#121124] border-[#1e1e2d] overflow-hidden relative group">
                                <div className="absolute right-0 bottom-0 w-40 h-40 bg-blue-500/10 rounded-tl-full blur-2xl group-hover:bg-blue-500/15 transition-all" />
                                <div className="absolute right-0 bottom-0 w-full h-full opacity-10 pattern-dots group-hover:opacity-20 transition-all pointer-events-none" />
                                <CardContent className="p-7 relative z-10">
                                    <div className="flex items-center gap-4 mb-8">
                                        <div className="w-10 h-10 rounded-xl bg-blue-500/15 flex items-center justify-center border border-blue-500/20">
                                            <Loader className="w-5 h-5 text-blue-400" />
                                        </div>
                                        <h3 className="text-lg font-semibold text-slate-200">In Progress</h3>
                                    </div>
                                    <p className="text-5xl font-bold text-white tracking-tight">{stats.inProgress}</p>
                                </CardContent>
                            </Card>
                        </div>
                    </div>

                    {/* Check if there are recent complaints */}
                    <div className="animate-fade-in" style={{ animationDelay: '0.2s' }}>
                        {loading ? (
                            <div className="grid gap-4 sm:grid-cols-2 mt-10">
                                {[1, 2].map(i => <div key={i} className="h-40 rounded-xl bg-[#121124] animate-pulse border border-[#1e1e2d]" />)}
                            </div>
                        ) : complaints.length > 0 && (
                            <div className="mt-14">
                                <div className="flex items-center justify-between mb-6">
                                    <h2 className="text-xl font-bold text-white">Recent Activity</h2>
                                    <Button asChild variant="ghost" className="text-indigo-400 hover:text-indigo-300 hover:bg-[#121124]">
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
