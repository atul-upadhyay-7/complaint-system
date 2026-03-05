import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../api/axios';
import Sidebar from '../components/Sidebar';
import { ShieldCheck, Users, ClipboardList, CheckCircle2, Loader2, AlertTriangle, UserCheck, Sparkles } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import toast from 'react-hot-toast';

const STATUS_COLORS = {
    'Pending': 'bg-yellow-500/15 text-yellow-400 border-yellow-500/25',
    'Assigned': 'bg-blue-500/15 text-blue-400 border-blue-500/25',
    'In Progress': 'bg-indigo-500/15 text-indigo-400 border-indigo-500/25',
    'Resolved': 'bg-green-500/15 text-green-400 border-green-500/25',
    'Rejected': 'bg-red-500/15 text-red-400 border-red-500/25',
};

const PRIORITY_COLORS = {
    'Critical': 'bg-red-500/15 text-red-400',
    'High': 'bg-orange-500/15 text-orange-400',
    'Medium': 'bg-yellow-500/15 text-yellow-400',
    'Low': 'bg-green-500/15 text-green-400',
};

export default function WardenDashboard() {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const [complaints, setComplaints] = useState([]);
    const [staff, setStaff] = useState([]);
    const [analytics, setAnalytics] = useState(null);
    const [loading, setLoading] = useState(true);
    const [assigning, setAssigning] = useState(null);
    const [selectedAssignee, setSelectedAssignee] = useState({});

    const fetchData = async () => {
        setLoading(true);
        try {
            const [cData, sData, aData] = await Promise.all([
                api.get('/admin/complaints?limit=50'),
                api.get('/admin/staff'),
                api.get('/admin/analytics'),
            ]);
            setComplaints(cData.data.complaints || []);
            setStaff(sData.data.staff || []);
            setAnalytics(aData.data.analytics);
        } catch { toast.error('Failed to load data'); } finally { setLoading(false); }
    };

    useEffect(() => { fetchData(); }, []);

    const assignComplaint = async (complaintId) => {
        const staffId = selectedAssignee[complaintId];
        if (!staffId) return toast.error('Please select a staff member');
        const staffMember = staff.find(s => s._id === staffId);
        setAssigning(complaintId);
        try {
            await api.put(`/admin/assign/${complaintId}`, { assignedTo: staffId, assignedToName: staffMember?.name });
            toast.success(`Assigned to ${staffMember?.name}`);
            fetchData();
        } catch { toast.error('Assignment failed'); } finally { setAssigning(null); }
    };

    const updateStatus = async (id, status, adminNotes = '') => {
        try {
            await api.put(`/admin/status/${id}`, { status, adminNotes });
            toast.success(`Status updated to "${status}"`);
            fetchData();
        } catch { toast.error('Failed to update status'); }
    };

    return (
        <div className="flex min-h-screen bg-[#070710] text-[#f1f0ff]">
            <Sidebar />
            <main className="flex-1 lg:ml-[280px] min-w-0 pt-20 lg:pt-0">
                {/* Topbar */}
                <div className="hidden lg:flex items-center justify-end px-8 py-5">
                    <button onClick={() => { logout(); navigate('/login'); }}
                        className="flex items-center gap-2 px-4 py-2.5 rounded-lg border border-[#1e1e2d] text-sm font-medium text-slate-300 hover:bg-[#121124] hover:text-white transition-colors">
                        <ShieldCheck className="w-4 h-4" /> Secure Logout
                    </button>
                </div>

                <div className="p-6 md:p-10 max-w-7xl mx-auto">
                    {/* Header */}
                    <div className="mb-10 animate-fade-in">
                        <div className="flex items-center gap-3 mb-2">
                            <div className="w-10 h-10 rounded-xl bg-emerald-500/15 flex items-center justify-center border border-emerald-500/20">
                                <UserCheck className="w-5 h-5 text-emerald-400" />
                            </div>
                            <h1 className="text-3xl md:text-4xl font-bold tracking-tight">
                                Warden <span className="text-emerald-400">Control Panel</span>
                            </h1>
                        </div>
                        <p className="text-slate-400 text-sm">
                            Welcome, <span className="text-white font-medium">{user?.name}</span> · {user?.hostel || user?.department || 'Hostel Administration'}
                        </p>
                    </div>

                    {/* Analytics Stats */}
                    {analytics && (
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10 animate-fade-in" style={{ animationDelay: '0.1s' }}>
                            {[
                                { label: 'Total', value: analytics.total, color: 'purple', icon: ClipboardList },
                                { label: 'Pending', value: analytics.pending, color: 'yellow', icon: AlertTriangle },
                                { label: 'In Progress', value: analytics.inProgress, color: 'blue', icon: Loader2 },
                                { label: 'Resolved', value: analytics.resolved, color: 'green', icon: CheckCircle2 },
                            ].map(({ label, value, color, icon: Icon }) => (
                                <Card key={label} className="bg-[#121124] border-[#1e1e2d] overflow-hidden relative">
                                    <div className={`absolute right-0 bottom-0 w-24 h-24 bg-${color}-500/10 rounded-tl-full blur-2xl`} />
                                    <CardContent className="p-5 relative z-10">
                                        <Icon className={`w-4 h-4 text-${color}-400 mb-3`} />
                                        <p className="text-3xl font-bold text-white">{value}</p>
                                        <p className="text-slate-400 text-xs mt-1">{label}</p>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                    )}

                    {/* Complaints Management */}
                    <div className="animate-fade-in" style={{ animationDelay: '0.2s' }}>
                        <div className="flex items-center justify-between mb-5">
                            <h2 className="text-xl font-bold text-white">All Hostel Complaints</h2>
                            <span className="text-sm text-slate-400">{complaints.length} complaints</span>
                        </div>

                        {loading ? (
                            <div className="flex items-center justify-center h-40">
                                <Loader2 className="w-8 h-8 animate-spin text-emerald-400" />
                            </div>
                        ) : (
                            <div className="space-y-3">
                                {complaints.map(c => (
                                    <div key={c._id} className="bg-[#121124] border border-[#1e1e2d] rounded-xl p-5 hover:border-emerald-500/20 transition-all">
                                        <div className="flex items-start justify-between gap-4 flex-wrap mb-3">
                                            <div className="flex-1 min-w-0">
                                                <div className="flex items-center gap-2 mb-1 flex-wrap">
                                                    <span className={`px-2 py-0.5 rounded-md text-xs font-medium border ${STATUS_COLORS[c.status] || ''}`}>{c.status}</span>
                                                    <span className={`px-2 py-0.5 rounded-md text-xs font-medium ${PRIORITY_COLORS[c.priority] || ''}`}>{c.priority}</span>
                                                    <span className="text-xs text-slate-500 mr-2">{c.category}</span>
                                                    {c.aiCategory && (
                                                        <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider bg-purple-500/10 text-purple-400 border border-purple-500/20">
                                                            <Sparkles className="w-3 h-3" /> AI: {c.aiCategory}
                                                        </span>
                                                    )}
                                                </div>
                                                <h3 className="text-base font-semibold text-white">{c.title}</h3>
                                                <p className="text-slate-400 text-xs mt-1">
                                                    By: <span className="text-slate-300">{c.student?.name}</span>
                                                    {c.student?.hostel && <> · {c.student.hostel}</>}
                                                    {c.location && <> · 📍 {c.location}</>}
                                                </p>
                                                {c.assignedToName && (
                                                    <p className="text-xs text-blue-400 mt-1">👷 Assigned to: {c.assignedToName}</p>
                                                )}
                                            </div>
                                            {/* Status Actions */}
                                            <div className="flex gap-2 shrink-0 flex-wrap">
                                                {c.status === 'Pending' && (
                                                    <button onClick={() => updateStatus(c._id, 'In Progress')}
                                                        className="px-3 py-1.5 text-xs rounded-lg bg-blue-500/15 text-blue-300 border border-blue-500/25 hover:bg-blue-500/25 transition-all">
                                                        Start Review
                                                    </button>
                                                )}
                                                {c.status !== 'Resolved' && c.status !== 'Rejected' && (
                                                    <button onClick={() => updateStatus(c._id, 'Resolved')}
                                                        className="px-3 py-1.5 text-xs rounded-lg bg-green-500/15 text-green-300 border border-green-500/25 hover:bg-green-500/25 transition-all">
                                                        Resolve
                                                    </button>
                                                )}
                                                {c.status !== 'Rejected' && c.status !== 'Resolved' && (
                                                    <button onClick={() => updateStatus(c._id, 'Rejected', 'Rejected by warden')}
                                                        className="px-3 py-1.5 text-xs rounded-lg bg-red-500/15 text-red-300 border border-red-500/25 hover:bg-red-500/25 transition-all">
                                                        Reject
                                                    </button>
                                                )}
                                            </div>
                                        </div>

                                        {/* Assign to Technician */}
                                        {c.status !== 'Resolved' && c.status !== 'Rejected' && staff.length > 0 && (
                                            <div className="flex items-center gap-2 mt-2 pt-3 border-t border-[#1e1e2d] flex-wrap">
                                                <Users className="w-4 h-4 text-slate-500 shrink-0" />
                                                <select
                                                    value={selectedAssignee[c._id] || ''}
                                                    onChange={e => setSelectedAssignee(prev => ({ ...prev, [c._id]: e.target.value }))}
                                                    className="flex-1 min-w-0 bg-[#0d0d16] border border-[#1e1e2d] rounded-lg px-3 py-1.5 text-sm text-slate-300 focus:outline-none focus:border-emerald-500/40 transition-colors">
                                                    <option value="">Assign to staff...</option>
                                                    {staff.map(s => (
                                                        <option key={s._id} value={s._id}>{s.name} ({s.role}) </option>
                                                    ))}
                                                </select>
                                                <button onClick={() => assignComplaint(c._id)}
                                                    disabled={assigning === c._id}
                                                    className="px-3 py-1.5 text-xs rounded-lg bg-emerald-500/15 text-emerald-300 border border-emerald-500/25 hover:bg-emerald-500/25 transition-all shrink-0 disabled:opacity-50">
                                                    {assigning === c._id ? <Loader2 className="w-3 h-3 animate-spin" /> : 'Assign'}
                                                </button>
                                            </div>
                                        )}
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
