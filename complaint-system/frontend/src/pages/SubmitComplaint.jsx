import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import api from '../api/axios';
import toast from 'react-hot-toast';
import { Send, Loader2, ArrowLeft, FileText, Tag, AlertTriangle, MapPin, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent } from '@/components/ui/card';
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
        <div className="flex min-h-screen bg-background relative selection:bg-purple-500/30">
            {/* Global Background Orbs */}
            <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
                <div className="absolute top-[20%] right-[-10%] w-[500px] h-[500px] bg-purple-900/10 rounded-full blur-[120px] animate-float" />
            </div>

            <Sidebar />
            <main className="flex-1 lg:ml-64 min-w-0 pt-16 lg:pt-0 relative z-10">
                <div className="p-4 sm:p-6 md:p-8 max-w-3xl mx-auto z-10">
                    <div className="mb-8 animate-slide-up">
                        <button onClick={() => navigate(-1)} className="group flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors mb-6 w-fit h-8 px-3 -ml-3 rounded-lg hover:bg-secondary/50">
                            <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" /> Back to Dashboard
                        </button>
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-secondary/50 border border-border/50 text-xs font-medium text-muted-foreground mb-3 animate-fade-in shadow-sm">
                            <Sparkles className="w-3.5 h-3.5 text-purple-400" /> Need Help?
                        </div>
                        <h1 className="text-3xl sm:text-4xl font-bold tracking-tight">Submit a Complaint</h1>
                        <p className="text-muted-foreground text-sm sm:text-base mt-2">Describe your issue in detail and our team will get it resolved as soon as possible.</p>
                    </div>

                    <Card className="border-border/50 shadow-glass bg-card/50 backdrop-blur-sm animate-slide-up" style={{ animationDelay: '0.1s' }}>
                        <CardContent className="p-6 sm:p-8">
                            <form onSubmit={handleSubmit} className="space-y-6">
                                <div className="space-y-2 animate-slide-up" style={{ animationDelay: '0.2s' }}>
                                    <Label className="text-base">Complaint Title <span className="text-red-400">*</span></Label>
                                    <div className="relative group">
                                        <FileText className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground group-focus-within:text-purple-400 transition-colors" />
                                        <Input
                                            placeholder="Brief description of the issue"
                                            className="pl-10 h-12 transition-all duration-300 focus-visible:ring-purple-500/50 focus-visible:border-purple-500/50 bg-secondary/30"
                                            value={form.title}
                                            onChange={setE('title')}
                                            required
                                        />
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-slide-up" style={{ animationDelay: '0.3s' }}>
                                    <div className="space-y-2">
                                        <Label className="text-base">Category <span className="text-red-400">*</span></Label>
                                        <Select onValueChange={set('category')} value={form.category}>
                                            <SelectTrigger className="h-12 bg-secondary/30 transition-all duration-300 focus:ring-purple-500/50">
                                                <div className="flex items-center gap-2.5">
                                                    <Tag className="w-4 h-4 text-muted-foreground" />
                                                    <SelectValue placeholder="Select relevant category" />
                                                </div>
                                            </SelectTrigger>
                                            <SelectContent className="max-h-[300px]">
                                                {CATEGORIES.map(c => <SelectItem key={c} value={c} className="py-2.5 cursor-pointer">{c}</SelectItem>)}
                                            </SelectContent>
                                        </Select>
                                    </div>

                                    <div className="space-y-2">
                                        <Label className="text-base">Location <span className="text-muted-foreground text-xs font-normal ml-1">(Optional)</span></Label>
                                        <div className="relative group">
                                            <MapPin className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground group-focus-within:text-purple-400 transition-colors" />
                                            <Input
                                                placeholder="e.g. Block A - Room 203"
                                                className="pl-10 h-12 transition-all duration-300 focus-visible:ring-purple-500/50 focus-visible:border-purple-500/50 bg-secondary/30"
                                                value={form.location}
                                                onChange={setE('location')}
                                            />
                                        </div>
                                    </div>
                                </div>

                                <div className="space-y-3 animate-slide-up" style={{ animationDelay: '0.4s' }}>
                                    <Label className="text-base">Priority Level</Label>
                                    <div className="grid grid-cols-3 gap-3">
                                        {PRIORITIES.map(p => (
                                            <button key={p} type="button" onClick={() => setForm(f => ({ ...f, priority: p }))}
                                                className={`h-12 rounded-xl text-sm font-semibold border transition-all duration-300 hover:-translate-y-0.5 ${form.priority === p
                                                    ? p === 'High' ? 'bg-red-500/20 border-red-500/50 text-red-300 shadow-sm shadow-red-500/10'
                                                        : p === 'Medium' ? 'bg-amber-500/20 border-amber-500/50 text-amber-300 shadow-sm shadow-amber-500/10'
                                                            : 'bg-slate-500/20 border-slate-500/50 text-slate-300 shadow-sm shadow-slate-500/10'
                                                    : 'border-border/60 bg-secondary/20 text-muted-foreground hover:border-border hover:bg-secondary/40'
                                                    }`}>
                                                {p}
                                            </button>
                                        ))}
                                    </div>
                                    {form.priority === 'High' && (
                                        <div className="flex items-start gap-3 p-3 mt-3 rounded-xl bg-red-500/10 border border-red-500/20 animate-fade-in">
                                            <AlertTriangle className="w-4 h-4 text-red-400 mt-0.5 shrink-0" />
                                            <p className="text-xs sm:text-sm text-red-300 leading-relaxed font-medium">High priority complaints are escalated immediately. Please use this only for urgent issues.</p>
                                        </div>
                                    )}
                                </div>

                                <div className="space-y-2 animate-slide-up" style={{ animationDelay: '0.5s' }}>
                                    <Label className="text-base">Detailed Description <span className="text-red-400">*</span></Label>
                                    <Textarea
                                        placeholder="Describe the problem in detail — when it started, how severe it is, anything you've already tried..."
                                        className="min-h-[160px] p-4 text-base transition-all duration-300 focus-visible:ring-purple-500/50 focus-visible:border-purple-500/50 bg-secondary/30 resize-y"
                                        value={form.description}
                                        onChange={setE('description')}
                                        required
                                    />
                                    <p className="text-xs font-medium text-muted-foreground text-right tracking-wide">{form.description.length} CHARACTERS</p>
                                </div>

                                <div className="flex flex-col-reverse sm:flex-row gap-3 pt-4 animate-slide-up" style={{ animationDelay: '0.6s' }}>
                                    <Button type="button" variant="outline" onClick={() => navigate(-1)} className="sm:flex-1 h-12 text-base font-medium border-border/60 hover:bg-secondary/80 transition-colors">
                                        Cancel
                                    </Button>
                                    <Button type="submit" className="sm:flex-[2] h-12 text-base font-semibold shadow-purple-glow hover:shadow-purple-glow/150 transition-all duration-300 hover:-translate-y-0.5" disabled={loading}>
                                        {loading ? <><Loader2 className="w-5 h-5 animate-spin mr-2" /> Submitting...</> : <><Send className="w-4 h-4 mr-2 -ml-1 hover:animate-pulse" /> Submit Complaint</>}
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
