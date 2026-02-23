import { useState, useEffect } from 'react';
import Sidebar from '../components/Sidebar';
import ComplaintCard from '../components/ComplaintCard';
import api from '../api/axios';
import toast from 'react-hot-toast';
import { Search, Filter, X, Loader2, Trash2, Save } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Card, CardContent } from '@/components/ui/card';

const STATUSES = ['All', 'Pending', 'In Progress', 'Resolved', 'Rejected'];
const CATEGORIES = ['All', 'Electricity', 'Water', 'WiFi', 'Cleanliness', 'Maintenance', 'Security', 'Mess/Food', 'Other'];

export default function AdminComplaints() {
    const [complaints, setComplaints] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [statusFilter, setStatusFilter] = useState('All');
    const [catFilter, setCatFilter] = useState('All');
    const [selected, setSelected] = useState(null);
    const [updating, setUpdating] = useState(false);
    const [deleting, setDeleting] = useState(false);
    const [form, setForm] = useState({ status: '', assignedTo: '', adminNotes: '', priority: '' });

    useEffect(() => {
        api.get('/complaints').then(({ data }) => setComplaints(data.complaints || [])).finally(() => setLoading(false));
    }, []);

    const openModal = (c) => {
        setSelected(c);
        setForm({ status: c.status, assignedTo: c.assignedTo || '', adminNotes: c.adminNotes || '', priority: c.priority });
    };
    const closeModal = () => { setSelected(null); };

    const handleUpdate = async () => {
        setUpdating(true);
        try {
            const { data } = await api.patch(`/complaints/${selected._id}`, form);
            setComplaints(prev => prev.map(c => c._id === selected._id ? data.complaint : c));
            toast.success('Complaint updated!');
            closeModal();
        } catch { toast.error('Update failed'); } finally { setUpdating(false); }
    };

    const handleDelete = async () => {
        if (!window.confirm('Delete this complaint?')) return;
        setDeleting(true);
        try {
            await api.delete(`/complaints/${selected._id}`);
            setComplaints(prev => prev.filter(c => c._id !== selected._id));
            toast.success('Complaint deleted');
            closeModal();
        } catch { toast.error('Delete failed'); } finally { setDeleting(false); }
    };

    const filtered = complaints.filter(c => {
        const matchSearch = !search || c.title.toLowerCase().includes(search.toLowerCase()) || c.student?.name?.toLowerCase().includes(search.toLowerCase());
        const matchStatus = statusFilter === 'All' || c.status === statusFilter;
        const matchCat = catFilter === 'All' || c.category === catFilter;
        return matchSearch && matchStatus && matchCat;
    });

    return (
        <div className="flex min-h-screen bg-background">
            <Sidebar />
            <main className="flex-1 lg:ml-64 min-w-0 pt-16 lg:pt-0">
                <div className="p-6 max-w-6xl mx-auto">
                    <div className="mb-6">
                        <h1 className="text-2xl font-bold">All Complaints</h1>
                        <p className="text-muted-foreground text-sm mt-1">
                            Showing {filtered.length} of {complaints.length} complaints
                        </p>
                    </div>

                    {/* Search + Filters */}
                    <Card className="mb-6">
                        <CardContent className="p-4">
                            <div className="flex flex-col sm:flex-row gap-3">
                                <div className="relative flex-1">
                                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                    <Input placeholder="Search by title or student name..." className="pl-10" value={search} onChange={e => setSearch(e.target.value)} />
                                </div>
                                <Select value={statusFilter} onValueChange={setStatusFilter}>
                                    <SelectTrigger className="w-full sm:w-44">
                                        <SelectValue placeholder="Status" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {STATUSES.map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}
                                    </SelectContent>
                                </Select>
                                <Select value={catFilter} onValueChange={setCatFilter}>
                                    <SelectTrigger className="w-full sm:w-44">
                                        <SelectValue placeholder="Category" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {CATEGORIES.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}
                                    </SelectContent>
                                </Select>
                                {(search || statusFilter !== 'All' || catFilter !== 'All') && (
                                    <Button variant="ghost" size="icon" onClick={() => { setSearch(''); setStatusFilter('All'); setCatFilter('All'); }}>
                                        <X className="h-4 w-4" />
                                    </Button>
                                )}
                            </div>
                        </CardContent>
                    </Card>

                    {/* Complaints grid */}
                    {loading ? (
                        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                            {[1, 2, 3, 4, 5, 6].map(i => <div key={i} className="h-40 rounded-xl bg-card animate-pulse border border-border/50" />)}
                        </div>
                    ) : filtered.length === 0 ? (
                        <div className="text-center py-20">
                            <Search className="w-12 h-12 text-muted-foreground/30 mx-auto mb-3" />
                            <p className="text-muted-foreground">No complaints match your filters</p>
                        </div>
                    ) : (
                        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                            {filtered.map(c => (
                                <ComplaintCard key={c._id} complaint={c} isAdmin onManage={openModal} />
                            ))}
                        </div>
                    )}
                </div>
            </main>

            {/* Manage Modal */}
            <Dialog open={!!selected} onOpenChange={(open) => { if (!open) closeModal(); }}>
                <DialogContent className="max-w-lg">
                    <DialogHeader>
                        <DialogTitle>Manage Complaint</DialogTitle>
                    </DialogHeader>
                    {selected && (
                        <div className="space-y-4 py-2">
                            <div>
                                <p className="font-semibold text-foreground">{selected.title}</p>
                                <p className="text-sm text-muted-foreground mt-1">{selected.description}</p>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-1.5">
                                    <Label>Status</Label>
                                    <Select value={form.status} onValueChange={v => setForm(f => ({ ...f, status: v }))}>
                                        <SelectTrigger><SelectValue /></SelectTrigger>
                                        <SelectContent>
                                            {['Pending', 'In Progress', 'Resolved', 'Rejected'].map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div className="space-y-1.5">
                                    <Label>Priority</Label>
                                    <Select value={form.priority} onValueChange={v => setForm(f => ({ ...f, priority: v }))}>
                                        <SelectTrigger><SelectValue /></SelectTrigger>
                                        <SelectContent>
                                            {['Low', 'Medium', 'High'].map(p => <SelectItem key={p} value={p}>{p}</SelectItem>)}
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>

                            <div className="space-y-1.5">
                                <Label>Assign To</Label>
                                <Input placeholder="Staff member name" value={form.assignedTo} onChange={e => setForm(f => ({ ...f, assignedTo: e.target.value }))} />
                            </div>

                            <div className="space-y-1.5">
                                <Label>Admin Notes</Label>
                                <Textarea placeholder="Add notes or update for the student..." value={form.adminNotes} onChange={e => setForm(f => ({ ...f, adminNotes: e.target.value }))} />
                            </div>
                        </div>
                    )}
                    <DialogFooter className="gap-2">
                        <Button variant="destructive" onClick={handleDelete} disabled={deleting} className="mr-auto">
                            {deleting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" />}
                            Delete
                        </Button>
                        <Button variant="outline" onClick={closeModal}>Cancel</Button>
                        <Button onClick={handleUpdate} disabled={updating}>
                            {updating ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                            Save Changes
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
}
