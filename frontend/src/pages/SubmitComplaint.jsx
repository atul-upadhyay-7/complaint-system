import { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import api from '../api/axios';
import toast from 'react-hot-toast';
import { Send, Loader2, ArrowLeft, FileText, Tag, AlertTriangle, MapPin, Sparkles, Upload, X, Image, Brain, Zap } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { cn } from '@/lib/utils';

const CATEGORIES = ['Electricity', 'Water', 'Internet', 'Cleanliness', 'Maintenance', 'Security', 'Food', 'Other'];
const PRIORITIES = ['Low', 'Medium', 'High'];

export default function SubmitComplaint() {
    const [form, setForm] = useState({ title: '', description: '', category: '', location: '' });
    const [loading, setLoading] = useState(false);
    const [aiResult, setAiResult] = useState(null); // stores { priority, aiCategory } after submit
    const [imagePreview, setImagePreview] = useState(null);
    const [imageBase64, setImageBase64] = useState(null);
    const [isDragging, setIsDragging] = useState(false);
    const fileInputRef = useRef(null);
    const navigate = useNavigate();

    const set = (k) => (v) => setForm(f => ({ ...f, [k]: v }));
    const setE = (k) => (e) => setForm(f => ({ ...f, [k]: e.target.value }));

    const handleImageFile = (file) => {
        if (!file) return;
        if (!file.type.startsWith('image/')) return toast.error('Please select a valid image file');
        if (file.size > 5 * 1024 * 1024) return toast.error('Image must be under 5MB');

        const reader = new FileReader();
        reader.onload = (e) => {
            setImagePreview(e.target.result);
            setImageBase64(e.target.result);
        };
        reader.readAsDataURL(file);
    };

    const handleFileChange = (e) => handleImageFile(e.target.files[0]);
    const handleDrop = (e) => {
        e.preventDefault();
        setIsDragging(false);
        handleImageFile(e.dataTransfer.files[0]);
    };

    const removeImage = () => { setImagePreview(null); setImageBase64(null); if (fileInputRef.current) fileInputRef.current.value = ''; };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!form.category) return toast.error('Please select a category');
        setLoading(true);
        try {
            const payload = { ...form };
            if (imageBase64) payload.attachments = [imageBase64];
            const res = await api.post('/complaints', payload);
            const detected = res.data?.complaint;
            const priorityLabel = detected?.priority || 'Medium';
            const categoryLabel = detected?.aiCategory || form.category;
            setAiResult({ priority: priorityLabel, aiCategory: categoryLabel });

            const priorityColors = { High: '🔴', Medium: '🟡', Low: '🟢', Critical: '🚨' };
            toast.success(
                `✅ Submitted! AI detected priority: ${priorityColors[priorityLabel] || ''} ${priorityLabel}`,
                { duration: 4000 }
            );
            setTimeout(() => navigate('/my-complaints'), 1800);
        } catch (err) {
            toast.error(err.response?.data?.message || 'Failed to submit complaint');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex min-h-screen bg-slate-50 dark:bg-background relative selection:bg-blue-500/30 transition-colors duration-300">


            <Sidebar />
            <main className="flex-1 lg:ml-64 min-w-0 pt-16 lg:pt-0 relative z-10">
                <div className="p-4 sm:p-6 md:p-8 max-w-3xl mx-auto">
                    <div className="mb-8 animate-slide-up">
                        <button onClick={() => navigate(-1)} className="group flex items-center gap-2 text-sm text-slate-500 dark:text-muted-foreground hover:text-slate-900 dark:hover:text-foreground transition-colors mb-6 w-fit h-8 px-3 -ml-3 rounded-lg hover:bg-slate-200 dark:hover:bg-secondary/50">
                            <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" /> Back
                        </button>
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-100 dark:bg-blue-500/10 border border-blue-200 dark:border-blue-500/20 text-xs font-medium text-blue-600 dark:text-blue-400 mb-3 animate-fade-in">
                            <Sparkles className="w-3.5 h-3.5" /> AI-Powered Submission
                        </div>
                        <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-slate-900 dark:text-foreground">Submit a Complaint</h1>
                        <p className="text-slate-600 dark:text-muted-foreground text-sm sm:text-base mt-2">Describe your issue — our AI engine will automatically detect the <strong>priority level</strong> and <strong>category</strong>.</p>
                    </div>

                    <Card className="glass-card border-slate-200 dark:border-blue-900/30 shadow-[0_8px_32px_rgba(59,130,246,0.08)] animate-slide-up" style={{ animationDelay: '0.1s' }}>
                        <CardContent className="p-6 sm:p-8">
                            <form onSubmit={handleSubmit} className="space-y-6">
                                {/* Title */}
                                <div className="space-y-2 animate-slide-up" style={{ animationDelay: '0.2s' }}>
                                    <Label className="text-base">Complaint Title <span className="text-red-500 dark:text-red-400">*</span></Label>
                                    <div className="relative group">
                                        <FileText className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 dark:text-muted-foreground group-focus-within:text-blue-500 dark:group-focus-within:text-blue-400 transition-colors" />
                                        <Input placeholder="Brief description of the issue" className="pl-10 h-12 transition-all duration-300 focus-visible:ring-blue-500/50 focus-visible:border-blue-500/50 bg-white dark:bg-secondary/30" value={form.title} onChange={setE('title')} required />
                                    </div>
                                </div>

                                {/* Category + Location */}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-slide-up" style={{ animationDelay: '0.3s' }}>
                                    <div className="space-y-2">
                                        <Label className="text-base">Category <span className="text-red-500 dark:text-red-400">*</span></Label>
                                        <Select onValueChange={set('category')} value={form.category}>
                                            <SelectTrigger className="h-12 bg-white dark:bg-secondary/30 transition-all duration-300 focus:ring-blue-500/50">
                                                <div className="flex items-center gap-2.5">
                                                    <Tag className="w-4 h-4 text-slate-400 dark:text-muted-foreground" />
                                                    <SelectValue placeholder="Select category" />
                                                </div>
                                            </SelectTrigger>
                                            <SelectContent className="max-h-[300px]">
                                                {CATEGORIES.map(c => <SelectItem key={c} value={c} className="py-2.5 cursor-pointer">{c}</SelectItem>)}
                                            </SelectContent>
                                        </Select>
                                    </div>
                                    <div className="space-y-2">
                                        <Label className="text-base">Location <span className="text-slate-500 dark:text-muted-foreground text-xs font-normal ml-1">(Optional)</span></Label>
                                        <div className="relative group">
                                            <MapPin className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 dark:text-muted-foreground group-focus-within:text-blue-500 dark:group-focus-within:text-blue-400 transition-colors" />
                                            <Input placeholder="e.g. Block A - Room 203" className="pl-10 h-12 transition-all duration-300 focus-visible:ring-blue-500/50 focus-visible:border-blue-500/50 bg-white dark:bg-secondary/30" value={form.location} onChange={setE('location')} />
                                        </div>
                                    </div>
                                </div>

                                {/* AI Priority Notice — replaces manual selector */}
                                <div className="space-y-3 animate-slide-up" style={{ animationDelay: '0.4s' }}>
                                    <Label className="text-base flex items-center gap-2">
                                        <Brain className="w-4 h-4 text-violet-500" />
                                        Priority Level
                                        <span className="text-violet-500 dark:text-violet-400 text-xs font-medium ml-1">AI Auto-detected</span>
                                    </Label>
                                    <div className="flex items-start gap-3 p-4 rounded-xl border animate-fade-in"
                                        style={{ background: 'linear-gradient(135deg, rgba(139,92,246,0.08), rgba(59,130,246,0.05))', border: '1.5px solid rgba(139,92,246,0.25)' }}>
                                        <div className="w-9 h-9 rounded-xl bg-violet-100 dark:bg-violet-500/15 flex items-center justify-center flex-shrink-0">
                                            <Zap className="w-4 h-4 text-violet-500" />
                                        </div>
                                        <div>
                                            <p className="text-sm font-semibold text-slate-800 dark:text-foreground">Automatic AI Prioritization</p>
                                            <p className="text-xs text-slate-500 dark:text-muted-foreground mt-0.5 leading-relaxed">
                                                Our NLP engine analyzes your title &amp; description and assigns <span className="text-violet-500 font-semibold">High / Medium / Low / Critical</span> priority automatically — no manual selection needed.
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                {/* Description */}
                                <div className="space-y-2 animate-slide-up" style={{ animationDelay: '0.5s' }}>
                                    <Label className="text-base">Detailed Description <span className="text-red-500 dark:text-red-400">*</span></Label>
                                    <Textarea
                                        placeholder="Describe the problem in detail — when it started, how severe it is, anything you've already tried..."
                                        className="min-h-[140px] p-4 text-base transition-all duration-300 focus-visible:ring-blue-500/50 focus-visible:border-blue-500/50 bg-white dark:bg-secondary/30 resize-y"
                                        value={form.description} onChange={setE('description')} required
                                    />
                                    <p className="text-xs font-medium text-slate-500 dark:text-muted-foreground text-right tracking-wide">{form.description.length} CHARACTERS</p>
                                </div>

                                {/* Image Upload */}
                                <div className="space-y-3 animate-slide-up" style={{ animationDelay: '0.55s' }}>
                                    <Label className="text-base flex items-center gap-2">
                                        <Image className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                                        Attach Photo
                                        <span className="text-slate-500 dark:text-muted-foreground text-xs font-normal">(Optional — max 5MB)</span>
                                    </Label>

                                    {imagePreview ? (
                                        <div className="relative rounded-xl overflow-hidden border border-slate-300 dark:border-blue-500/25 group">
                                            <img src={imagePreview} alt="Preview" className="w-full h-48 object-cover" />
                                            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                                <button type="button" onClick={removeImage}
                                                    className="flex items-center gap-2 px-4 py-2 rounded-xl bg-red-500/90 text-white text-sm font-medium hover:bg-red-600 transition-colors">
                                                    <X className="w-4 h-4" /> Remove Photo
                                                </button>
                                            </div>
                                            <div className="absolute bottom-2 left-2 bg-white dark:glass-card px-2 py-1 rounded-lg text-xs text-blue-600 dark:text-blue-300 border border-blue-200 dark:border-blue-500/20">
                                                ✓ Photo attached
                                            </div>
                                        </div>
                                    ) : (
                                        <div
                                            onClick={() => fileInputRef.current?.click()}
                                            onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
                                            onDragLeave={() => setIsDragging(false)}
                                            onDrop={handleDrop}
                                            className={cn(
                                                'border-2 border-dashed rounded-xl p-8 flex flex-col items-center justify-center gap-3 cursor-pointer transition-all duration-300',
                                                isDragging
                                                    ? 'border-blue-400 bg-blue-50 dark:bg-blue-500/10 scale-[1.01]'
                                                    : 'border-slate-300 dark:border-blue-900/40 bg-slate-50 dark:bg-secondary/20 hover:border-blue-400 dark:hover:border-blue-500/40 hover:bg-blue-50 dark:hover:bg-blue-500/5'
                                            )}
                                        >
                                            <div className="w-12 h-12 rounded-xl bg-blue-100 dark:bg-blue-500/10 flex items-center justify-center">
                                                <Upload className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                                            </div>
                                            <div className="text-center">
                                                <p className="text-sm font-medium text-slate-800 dark:text-foreground/80">Click to upload or drag & drop</p>
                                                <p className="text-xs text-slate-500 dark:text-muted-foreground mt-1">PNG, JPG, WEBP up to 5MB</p>
                                            </div>
                                        </div>
                                    )}
                                    <input ref={fileInputRef} type="file" accept="image/*" onChange={handleFileChange} className="hidden" />
                                </div>

                                {/* Actions */}
                                <div className="flex flex-col-reverse sm:flex-row gap-3 pt-4 animate-slide-up" style={{ animationDelay: '0.6s' }}>
                                    <Button type="button" variant="outline" onClick={() => navigate(-1)} className="sm:flex-1 h-12 text-base font-medium border-slate-300 dark:border-border/60 hover:bg-slate-100 dark:hover:bg-secondary/80 transition-colors">Cancel</Button>
                                    <Button type="submit" className="sm:flex-[2] h-12 text-base font-semibold glow-blue-sm hover:glow-blue transition-all duration-300 hover:-translate-y-0.5 bg-blue-600 hover:bg-blue-500 text-white" disabled={loading}>
                                        {loading ? <><Loader2 className="w-5 h-5 animate-spin mr-2" /> Submitting...</> : <><Send className="w-4 h-4 mr-2 -ml-1 text-white" /> Submit Complaint</>}
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
