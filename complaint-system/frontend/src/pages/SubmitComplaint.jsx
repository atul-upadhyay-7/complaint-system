import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import api from '../api/axios';
import toast from 'react-hot-toast';
import { Send, Loader2, ArrowLeft, FileText, Tag, AlertTriangle, MapPin } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

const CATEGORIES = ['Electricity', 'Water', 'WiFi', 'Cleanliness', 'Maintenance', 'Security', 'Mess/Food', 'Other'];
const PRIORITIES = ['Low', 'Medium', 'High'];

export default function SubmitComplaint() {
    const [form, setForm] = useState({ title: '', description: '', category: '', priority: 'Medium', location: '' });
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const set = (k) => (v) => setForm(f => ({ ...f, [k]: v }));
    const setE = (k) => (e) => setForm(f => ({ ...f, [k]: e.target.value }));

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!form.category) return toast.error('Please select a category');
        setLoading(true);
        try {
            await api.post('/complaints', form);
            toast.success('Complaint submitted successfully! 🎉');
            navigate('/my-complaints');
        } catch (err) {
            toast.error(err.response?.data?.message || 'Failed to submit complaint');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex min-h-screen bg-background">
            <Sidebar />
            <main className="flex-1 lg:ml-64 min-w-0 pt-16 lg:pt-0">
                <div className="p-6 max-w-2xl mx-auto">
                    <div className="mb-8">
                        <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors mb-4">
                            <ArrowLeft className="w-4 h-4" /> Back
                        </button>
                        <h1 className="text-2xl font-bold">Submit a Complaint</h1>
                        <p className="text-muted-foreground text-sm mt-1">Describe your issue and we'll get it resolved</p>
                    </div>

                    <Card className="border-border/50">
                        <CardContent className="p-6">
                            <form onSubmit={handleSubmit} className="space-y-5">
                                <div className="space-y-1.5">
                                    <Label>Complaint Title <span className="text-red-400">*</span></Label>
                                    <div className="relative">
                                        <FileText className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                        <Input
                                            placeholder="Brief description of the issue"
                                            className="pl-10"
                                            value={form.title}
                                            onChange={setE('title')}
                                            required
                                        />
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    <div className="space-y-1.5">
                                        <Label>Category <span className="text-red-400">*</span></Label>
                                        <Select onValueChange={set('category')} value={form.category}>
                                            <SelectTrigger>
                                                <div className="flex items-center gap-2">
                                                    <Tag className="w-4 h-4 text-muted-foreground" />
                                                    <SelectValue placeholder="Select category" />
                                                </div>
                                            </SelectTrigger>
                                            <SelectContent>
                                                {CATEGORIES.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}
                                            </SelectContent>
                                        </Select>
                                    </div>

                                    <div className="space-y-1.5">
                                        <Label>Priority</Label>
                                        <div className="grid grid-cols-3 gap-2">
                                            {PRIORITIES.map(p => (
                                                <button key={p} type="button" onClick={() => setForm(f => ({ ...f, priority: p }))}
                                                    className={`py-2 rounded-lg text-xs font-medium border transition-all duration-200 ${form.priority === p
                                                            ? p === 'High' ? 'bg-red-500/20 border-red-500/50 text-red-300'
                                                                : p === 'Medium' ? 'bg-amber-500/20 border-amber-500/50 text-amber-300'
                                                                    : 'bg-slate-500/20 border-slate-500/50 text-slate-300'
                                                            : 'border-border text-muted-foreground hover:border-border/80'
                                                        }`}>
                                                    {p}
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                </div>

                                <div className="space-y-1.5">
                                    <Label>Location <span className="text-muted-foreground text-xs">(optional)</span></Label>
                                    <div className="relative">
                                        <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                        <Input
                                            placeholder="e.g. Block A - Room 203"
                                            className="pl-10"
                                            value={form.location}
                                            onChange={setE('location')}
                                        />
                                    </div>
                                </div>

                                <div className="space-y-1.5">
                                    <Label>Description <span className="text-red-400">*</span></Label>
                                    <Textarea
                                        placeholder="Describe the problem in detail — when it started, how severe it is, anything you've already tried..."
                                        className="min-h-[140px]"
                                        value={form.description}
                                        onChange={setE('description')}
                                        required
                                    />
                                    <p className="text-xs text-muted-foreground text-right">{form.description.length} characters</p>
                                </div>

                                {form.priority === 'High' && (
                                    <div className="flex items-start gap-3 p-3 rounded-xl bg-red-500/8 border border-red-500/20">
                                        <AlertTriangle className="w-4 h-4 text-red-400 mt-0.5 shrink-0" />
                                        <p className="text-xs text-red-300">High priority complaints are escalated immediately and reviewed within 24 hours.</p>
                                    </div>
                                )}

                                <div className="flex gap-3 pt-2">
                                    <Button type="button" variant="outline" onClick={() => navigate(-1)} className="flex-1">Cancel</Button>
                                    <Button type="submit" className="flex-1" disabled={loading}>
                                        {loading ? <><Loader2 className="w-4 h-4 animate-spin" /> Submitting...</> : <><Send className="w-4 h-4" /> Submit Complaint</>}
                                    </Button>
                                </div>
                            </form>
                        </CardContent>
                    </Card>
                </div>
            </main>
        </div>
    );
}
