import { useState, useEffect } from 'react';
import Sidebar from '../components/Sidebar';
import ComplaintCard from '../components/ComplaintCard';
import { SkeletonCard } from '../components/SkeletonCard';
import api from '../api/axios';
import toast from 'react-hot-toast';
import { Search, Filter, X, Loader2, Trash2, Save, FileText, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Card, CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';
import { fadeUp, fadeIn, MCard, Stagger, Item } from '@/lib/motion';

const STATUSES = ['All', 'Pending', 'In Progress', 'Resolved', 'Rejected'];
const CATEGORIES = ['All', 'Electricity', 'Water', 'Internet', 'Cleanliness', 'Maintenance', 'Security', 'Food', 'Other'];

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
        setForm({ status: c.status, assignedToName: c.assignedToName || (c.assignedTo?.name || ''), adminNotes: c.adminNotes || '', priority: c.priority || 'Medium' });
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
        if (!window.confirm('Are you sure you want to permanently delete this complaint?')) return;
        setDeleting(true);
        try {
            await api.delete(`/complaints/${selected._id}`);
            setComplaints(prev => prev.filter(c => c._id !== selected._id));
            toast.success('Complaint deleted successfully');
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
        <div className="workspace flex min-h-screen bg-slate-50 dark:bg-background relative selection:bg-purple-500/30 transition-colors duration-300">


            <Sidebar />
            <main className="flex-1 lg:ml-[280px] min-w-0 pt-20 lg:pt-0 relative z-10">
                <div className="p-4 sm:p-6 md:p-8 max-w-7xl mx-auto z-10">
                    <motion.div className="mb-6" variants={fadeUp} initial="hidden" animate="show" custom={0}>
                        <motion.div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-200/50 dark:bg-secondary/50 border border-slate-300/50 dark:border-border/50 text-xs font-medium text-slate-600 dark:text-muted-foreground mb-3 shadow-sm" variants={fadeIn} initial="hidden" animate="show" custom={0}>
                            <FileText className="w-3.5 h-3.5 text-purple-600 dark:text-purple-400" /> Administrative View
                        </motion.div>
                        <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-slate-900 dark:text-foreground">All Complaints</h1>
                        <p className="text-slate-600 dark:text-muted-foreground text-sm sm:text-base mt-2">
                            Showing <span className="font-semibold text-slate-900 dark:text-foreground">{filtered.length}</span> of {complaints.length} complaints
                        </p>
                    </motion.div>

                    {/* Search + Filters */}
                    <MCard className="mb-8 border-slate-200 dark:border-border/50 shadow-glass bg-card/60 backdrop-blur-sm" variants={fadeUp} initial="hidden" animate="show" custom={0.1}>
                        <CardContent className="p-4 sm:p-5">
                            <div className="flex flex-col md:flex-row gap-4">
                                <div className="relative flex-1 group">
                                    <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground group-focus-within:text-purple-400 transition-colors" />
                                    <Input
                                        placeholder="Search by title or student name..."
                                        className="pl-10 h-11 bg-secondary/40 border-border/60 focus-visible:ring-purple-500/50 transition-all duration-300"
                                        value={search} onChange={e => setSearch(e.target.value)}
                                    />
                                </div>
                                <div className="flex flex-col sm:flex-row gap-4">
                                    <Select value={statusFilter} onValueChange={setStatusFilter}>
                                        <SelectTrigger className="w-full sm:w-[160px] h-11 bg-secondary/40 border-border/60">
                                            <div className="flex items-center gap-2"><Filter className="w-3.5 h-3.5 text-muted-foreground" /><SelectValue placeholder="Status" /></div>
                                        </SelectTrigger>
                                        <SelectContent>
                                            {STATUSES.map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}
                                        </SelectContent>
                                    </Select>
                                    <Select value={catFilter} onValueChange={setCatFilter}>
                                        <SelectTrigger className="w-full sm:w-[160px] h-11 bg-secondary/40 border-border/60">
                                            <div className="flex items-center gap-2"><Filter className="w-3.5 h-3.5 text-muted-foreground" /><SelectValue placeholder="Category" /></div>
                                        </SelectTrigger>
                                        <SelectContent>
                                            {CATEGORIES.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}
                                        </SelectContent>
                                    </Select>
                                    {(search || statusFilter !== 'All' || catFilter !== 'All') && (
                                        <Button variant="ghost" onClick={() => { setSearch(''); setStatusFilter('All'); setCatFilter('All'); }} className="h-11 px-3 text-muted-foreground hover:text-foreground hover:bg-secondary/80">
                                            <X className="h-4 w-4 mr-2" /> Clear Fields
                                        </Button>
                                    )}
                                </div>
                            </div>
                        </CardContent>
                    </MCard>

                    {/* Complaints grid */}
                    <motion.div className="" variants={fadeUp} initial="hidden" animate="show" custom={0.2}>
                        {loading ? (
                            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
                                {[1, 2, 3, 4, 5, 6].map(i => <SkeletonCard key={i} lines={3} showImage={false} />)}
                            </div>
                        ) : filtered.length === 0 ? (
                            <div className="text-center py-20 sm:py-32 px-4 rounded-3xl border border-dashed border-slate-300 dark:border-border/50 bg-white/50 dark:bg-secondary/20 backdrop-blur-sm">
                                <div className="w-20 h-20 rounded-3xl bg-slate-100 dark:glass flex items-center justify-center mx-auto mb-6 animate-float">
                                    <Search className="w-10 h-10 text-slate-400 dark:text-muted-foreground/60" />
                                </div>
                                <p className="text-xl font-semibold text-slate-900 dark:text-foreground mb-2">No complaints found</p>
                                <p className="text-slate-500 dark:text-muted-foreground max-w-sm mx-auto">Try adjusting your search criteria or modifying the selected filters.</p>
                            </div>
                        ) : (
                            <Stagger className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
                                {filtered.map((c) => (
                                    <Item key={c._id}>
                                        <ComplaintCard complaint={c} isAdmin onManage={openModal} />
                                    </Item>
                                ))}
                            </Stagger>
                        )}
                    </motion.div>
                </div>
            </main>

            {/* Manage Modal */}
            <Dialog open={!!selected} onOpenChange={(open) => { if (!open) closeModal(); }}>
                <DialogContent className="max-w-lg sm:max-w-[600px] border-slate-200 dark:border-border/60 bg-white dark:bg-background/95 backdrop-blur-xl shadow-2xl p-0 overflow-hidden">
                    <DialogHeader className="p-6 border-b border-slate-200 dark:border-border/50 bg-slate-50 dark:bg-secondary/20">
                        <DialogTitle className="text-xl font-bold flex items-center gap-2 text-slate-900 dark:text-foreground">
                            <FileText className="w-5 h-5 text-purple-600 dark:text-purple-400" /> Manage Complaint
                        </DialogTitle>
                    </DialogHeader>
                    {selected && (
                        <div className="p-6 space-y-6 max-h-[70vh] overflow-y-auto custom-scrollbar">
                            <div className="p-4 rounded-xl bg-slate-50 dark:bg-secondary/30 border border-slate-200 dark:border-border/50">
                                <div className="flex items-center gap-2 mb-2 flex-wrap">
                                    <h3 className="font-semibold text-slate-900 dark:text-foreground text-lg">{selected.title}</h3>
                                    {selected.aiCategory && (
                                        <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-widest bg-emerald-100 dark:bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-500/20 ml-auto">
                                            <Sparkles className="w-3 h-3" /> AI: {selected.aiCategory}
                                        </span>
                                    )}
                                </div>
                                <p className="text-sm text-slate-600 dark:text-muted-foreground leading-relaxed">{selected.description}</p>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                                <div className="space-y-2">
                                    <Label className="text-sm font-medium text-slate-900 dark:text-foreground">Status <span className="text-red-500 dark:text-red-400">*</span></Label>
                                    <Select value={form.status} onValueChange={v => setForm(f => ({ ...f, status: v }))}>
                                        <SelectTrigger className="h-11 bg-background/50 focus:ring-purple-500/50"><SelectValue /></SelectTrigger>
                                        <SelectContent>
                                            {['Pending', 'In Progress', 'Resolved', 'Rejected'].map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div className="space-y-2">
                                    <Label className="text-sm font-medium text-slate-900 dark:text-foreground">Priority Level</Label>
                                    <Select value={form.priority} onValueChange={v => setForm(f => ({ ...f, priority: v }))}>
                                        <SelectTrigger className="h-11 bg-white dark:bg-background/50 border-slate-200 dark:border-border focus:ring-purple-500/50"><SelectValue /></SelectTrigger>
                                        <SelectContent>
                                            {['Low', 'Medium', 'High'].map(p => <SelectItem key={p} value={p}>{p}</SelectItem>)}
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label className="text-sm font-medium text-slate-900 dark:text-foreground">Assign To (Name)</Label>
                                <Input
                                    className="h-11 bg-white dark:bg-background/50 border-slate-200 dark:border-border focus-visible:ring-purple-500/50"
                                    placeholder="e.g. Facilities Management Team"
                                    value={form.assignedToName} onChange={e => setForm(f => ({ ...f, assignedToName: e.target.value }))}
                                />
                            </div>

                            <div className="space-y-2">
                                <Label className="text-sm font-medium text-slate-900 dark:text-foreground">Admin Notes (Visible to Student)</Label>
                                <Textarea
                                    className="min-h-[100px] resize-y bg-white dark:bg-background/50 border-slate-200 dark:border-border focus-visible:ring-purple-500/50 p-3"
                                    placeholder="Provide feedback, updates, or resolution details to the student..."
                                    value={form.adminNotes} onChange={e => setForm(f => ({ ...f, adminNotes: e.target.value }))}
                                />
                            </div>
                        </div>
                    )}
                    <DialogFooter className="p-4 sm:p-6 border-t border-border/50 bg-secondary/10 flex flex-col sm:flex-row gap-3">
                        <Button variant="destructive" onClick={handleDelete} disabled={deleting} className="sm:mr-auto h-11 font-medium bg-red-500/10 text-red-400 hover:bg-red-500/20 hover:text-red-300 border border-transparent hover:border-red-500/30">
                            {deleting ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Trash2 className="w-4 h-4 mr-2" />} Delete Complaint
                        </Button>
                        <div className="flex gap-3 mt-3 sm:mt-0">
                            <Button variant="outline" onClick={closeModal} className="h-11 flex-1 sm:flex-none border-border/60 hover:bg-secondary/80">Cancel</Button>
                            <Button onClick={handleUpdate} disabled={updating} className="h-11 flex-1 sm:flex-none shadow-purple-glow hover:shadow-purple-glow/150 transition-all hover:-translate-y-0.5">
                                {updating ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Save className="w-4 h-4 mr-2" />} Save Changes
                            </Button>
                        </div>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
}
