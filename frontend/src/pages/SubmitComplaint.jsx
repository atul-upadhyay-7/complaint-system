import { useState, useRef, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import api from '../api/axios';
import toast from 'react-hot-toast';
import { Send, Loader2, ArrowLeft, FileText, Tag, MapPin, Sparkles, Upload, X, Image, Brain, Zap, Clock, AlertTriangle, Shield, Copy } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { cn } from '@/lib/utils';

const CATEGORIES = ['Electricity', 'Water', 'Internet', 'Cleanliness', 'Maintenance', 'Security', 'Food', 'Other'];

// AI suggestion badge colors
const PRIORITY_BADGE = {
    Critical: { bg: 'bg-rose-100 dark:bg-rose-500/20', text: 'text-rose-700 dark:text-rose-300', border: 'border-rose-300 dark:border-rose-500/40', icon: '🚨' },
    High: { bg: 'bg-red-100 dark:bg-red-500/20', text: 'text-red-700 dark:text-red-300', border: 'border-red-300 dark:border-red-500/40', icon: '🔴' },
    Medium: { bg: 'bg-amber-100 dark:bg-amber-500/20', text: 'text-amber-700 dark:text-amber-300', border: 'border-amber-300 dark:border-amber-500/40', icon: '🟡' },
    Low: { bg: 'bg-emerald-100 dark:bg-emerald-500/20', text: 'text-emerald-700 dark:text-emerald-300', border: 'border-emerald-300 dark:border-emerald-500/40', icon: '🟢' },
};

const SENTIMENT_BADGE = {
    Urgent: { bg: 'bg-rose-100 dark:bg-rose-500/15', text: 'text-rose-600 dark:text-rose-400', label: '🔥 Urgent' },
    Frustrated: { bg: 'bg-orange-100 dark:bg-orange-500/15', text: 'text-orange-600 dark:text-orange-400', label: '😤 Frustrated' },
    Neutral: { bg: 'bg-slate-100 dark:bg-slate-500/15', text: 'text-slate-600 dark:text-slate-400', label: '😐 Neutral' },
    Polite: { bg: 'bg-emerald-100 dark:bg-emerald-500/15', text: 'text-emerald-600 dark:text-emerald-400', label: '😊 Polite' },
};

const CATEGORY_ICONS = {
    Electricity: '⚡', Water: '💧', Internet: '🌐', Cleanliness: '🧹',
    Maintenance: '🔧', Security: '🛡️', Food: '🍽️', Other: '📋',
};

export default function SubmitComplaint() {
    const [form, setForm] = useState({ title: '', description: '', category: '', location: '' });
    const [loading, setLoading] = useState(false);
    const [aiSuggestion, setAiSuggestion] = useState(null);
    const [aiLoading, setAiLoading] = useState(false);
    const [imagePreview, setImagePreview] = useState(null);
    const [imageBase64, setImageBase64] = useState(null);
    const [isDragging, setIsDragging] = useState(false);
    const fileInputRef = useRef(null);
    const debounceRef = useRef(null);
    const navigate = useNavigate();

    const set = (k) => (v) => setForm(f => ({ ...f, [k]: v }));
    const setE = (k) => (e) => setForm(f => ({ ...f, [k]: e.target.value }));

    // ─── Debounced AI suggestion ─────────────────────────────────────
    const fetchAiSuggestion = useCallback(async (title, description) => {
        if (!title && !description) { setAiSuggestion(null); return; }
        if ((title + description).trim().length < 10) return; // wait for meaningful input

        setAiLoading(true);
        try {
            const res = await api.post('/complaints/ai-suggest', { title, description });
            if (res.data?.success) {
                setAiSuggestion(res.data.ai);
                // Auto-fill category if user hasn't selected one
                if (!form.category && res.data.ai.category) {
                    setForm(f => ({ ...f, category: res.data.ai.category }));
                }
            }
        } catch (err) {
            // Silently fail — AI suggestions are optional
        } finally {
            setAiLoading(false);
        }
    }, [form.category]);

    useEffect(() => {
        if (debounceRef.current) clearTimeout(debounceRef.current);
        debounceRef.current = setTimeout(() => {
            fetchAiSuggestion(form.title, form.description);
        }, 800);
        return () => clearTimeout(debounceRef.current);
    }, [form.title, form.description, fetchAiSuggestion]);

    // ─── Image handling ──────────────────────────────────────────────
    const handleImageFile = (file) => {
        if (!file) return;
        if (!file.type.startsWith('image/')) return toast.error('Please select a valid image file');
        if (file.size > 5 * 1024 * 1024) return toast.error('Image must be under 5MB');
        const reader = new FileReader();
        reader.onload = (e) => { setImagePreview(e.target.result); setImageBase64(e.target.result); };
        reader.readAsDataURL(file);
    };
    const handleFileChange = (e) => handleImageFile(e.target.files[0]);
    const handleDrop = (e) => { e.preventDefault(); setIsDragging(false); handleImageFile(e.dataTransfer.files[0]); };
    const removeImage = () => { setImagePreview(null); setImageBase64(null); if (fileInputRef.current) fileInputRef.current.value = ''; };

    // ─── Submit ──────────────────────────────────────────────────────
    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!form.category) return toast.error('Please select a category');
        setLoading(true);
        try {
            const payload = { ...form };
            if (imageBase64) payload.attachments = [imageBase64];
            const res = await api.post('/complaints', payload);
            const c = res.data?.complaint;
            const pLabel = c?.priority || 'Medium';
            const pBadge = PRIORITY_BADGE[pLabel] || PRIORITY_BADGE.Medium;
            toast.success(
                `✅ Submitted! AI Priority: ${pBadge.icon} ${pLabel} | ETA: ${c?.aiEstimatedTime || 'N/A'}`,
                { duration: 5000 }
            );
            setTimeout(() => navigate('/my-complaints'), 2000);
        } catch (err) {
            toast.error(err.response?.data?.message || 'Failed to submit complaint');
        } finally {
            setLoading(false);
        }
    };

    const p = aiSuggestion ? PRIORITY_BADGE[aiSuggestion.priority] : null;
    const s = aiSuggestion ? SENTIMENT_BADGE[aiSuggestion.sentiment?.sentiment] : null;

    return (
        <div className="flex min-h-screen bg-slate-50 dark:bg-background relative selection:bg-blue-500/30 transition-colors duration-300">
            <Sidebar />
            <main className="flex-1 lg:ml-64 min-w-0 pt-16 lg:pt-0 relative z-10">
                <div className="p-4 sm:p-6 md:p-8 max-w-3xl mx-auto">
                    <div className="mb-8 animate-slide-up">
                        <button onClick={() => navigate(-1)} className="group flex items-center gap-2 text-sm text-slate-500 dark:text-muted-foreground hover:text-slate-900 dark:hover:text-foreground transition-colors mb-6 w-fit h-8 px-3 -ml-3 rounded-lg hover:bg-slate-200 dark:hover:bg-secondary/50">
                            <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" /> Back
                        </button>
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-violet-100 dark:bg-violet-500/10 border border-violet-200 dark:border-violet-500/20 text-xs font-medium text-violet-600 dark:text-violet-400 mb-3 animate-fade-in">
                            <Brain className="w-3.5 h-3.5" /> AI-Powered Submission
                        </div>
                        <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-slate-900 dark:text-foreground">Submit a Complaint</h1>
                        <p className="text-slate-600 dark:text-muted-foreground text-sm sm:text-base mt-2">Describe your issue — our AI engine will automatically detect <strong>category</strong>, <strong>priority</strong>, <strong>sentiment</strong>, and <strong>estimated resolution time</strong>.</p>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        {/* ── FORM (2/3) ── */}
                        <Card className="lg:col-span-2 glass-card border-slate-200 dark:border-blue-900/30 shadow-[0_8px_32px_rgba(59,130,246,0.08)] animate-slide-up" style={{ animationDelay: '0.1s' }}>
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
                                            <Label className="text-base flex items-center gap-2">
                                                Category <span className="text-red-500 dark:text-red-400">*</span>
                                                {aiSuggestion && form.category === aiSuggestion.category && (
                                                    <span className="text-[10px] font-semibold text-violet-500 bg-violet-100 dark:bg-violet-500/15 px-1.5 py-0.5 rounded-md">AI SELECTED</span>
                                                )}
                                            </Label>
                                            <Select onValueChange={set('category')} value={form.category}>
                                                <SelectTrigger className="h-12 bg-white dark:bg-secondary/30 transition-all duration-300 focus:ring-blue-500/50">
                                                    <div className="flex items-center gap-2.5">
                                                        <Tag className="w-4 h-4 text-slate-400 dark:text-muted-foreground" />
                                                        <SelectValue placeholder="Select category" />
                                                    </div>
                                                </SelectTrigger>
                                                <SelectContent className="max-h-[300px]">
                                                    {CATEGORIES.map(c => <SelectItem key={c} value={c} className="py-2.5 cursor-pointer">{CATEGORY_ICONS[c]} {c}</SelectItem>)}
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

                                    {/* Description */}
                                    <div className="space-y-2 animate-slide-up" style={{ animationDelay: '0.4s' }}>
                                        <Label className="text-base">Detailed Description <span className="text-red-500 dark:text-red-400">*</span></Label>
                                        <Textarea
                                            placeholder="Describe the problem in detail — when it started, how severe it is, anything you've already tried..."
                                            className="min-h-[140px] p-4 text-base transition-all duration-300 focus-visible:ring-blue-500/50 focus-visible:border-blue-500/50 bg-white dark:bg-secondary/30 resize-y"
                                            value={form.description} onChange={setE('description')} required
                                        />
                                        <p className="text-xs font-medium text-slate-500 dark:text-muted-foreground text-right tracking-wide">{form.description.length} CHARACTERS</p>
                                    </div>

                                    {/* Image Upload */}
                                    <div className="space-y-3 animate-slide-up" style={{ animationDelay: '0.45s' }}>
                                        <Label className="text-base flex items-center gap-2">
                                            <Image className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                                            Attach Photo
                                            <span className="text-slate-500 dark:text-muted-foreground text-xs font-normal">(Optional — max 5MB)</span>
                                        </Label>
                                        {imagePreview ? (
                                            <div className="relative rounded-xl overflow-hidden border border-slate-300 dark:border-blue-500/25 group">
                                                <img src={imagePreview} alt="Preview" className="w-full h-48 object-cover" />
                                                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                                    <button type="button" onClick={removeImage} className="flex items-center gap-2 px-4 py-2 rounded-xl bg-red-500/90 text-white text-sm font-medium hover:bg-red-600 transition-colors">
                                                        <X className="w-4 h-4" /> Remove Photo
                                                    </button>
                                                </div>
                                                <div className="absolute bottom-2 left-2 bg-white dark:glass-card px-2 py-1 rounded-lg text-xs text-blue-600 dark:text-blue-300 border border-blue-200 dark:border-blue-500/20">✓ Photo attached</div>
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
                                    <div className="flex flex-col-reverse sm:flex-row gap-3 pt-4 animate-slide-up" style={{ animationDelay: '0.5s' }}>
                                        <Button type="button" variant="outline" onClick={() => navigate(-1)} className="sm:flex-1 h-12 text-base font-medium border-slate-300 dark:border-border/60 hover:bg-slate-100 dark:hover:bg-secondary/80 transition-colors">Cancel</Button>
                                        <Button type="submit" className="sm:flex-[2] h-12 text-base font-semibold glow-blue-sm hover:glow-blue transition-all duration-300 hover:-translate-y-0.5 bg-blue-600 hover:bg-blue-500 text-white" disabled={loading}>
                                            {loading ? <><Loader2 className="w-5 h-5 animate-spin mr-2" /> Analyzing & Submitting...</> : <><Send className="w-4 h-4 mr-2 -ml-1 text-white" /> Submit Complaint</>}
                                        </Button>
                                    </div>
                                </form>
                            </CardContent>
                        </Card>

                        {/* ── AI INSIGHT PANEL (1/3) ── */}
                        <div className="space-y-4 animate-slide-up" style={{ animationDelay: '0.3s' }}>
                            <div className="flex items-center gap-2 mb-1">
                                <div className="w-7 h-7 rounded-lg bg-violet-100 dark:bg-violet-500/15 flex items-center justify-center">
                                    <Brain className="w-4 h-4 text-violet-500" />
                                </div>
                                <h3 className="text-sm font-bold text-slate-800 dark:text-foreground">AI Analysis</h3>
                                {aiLoading && <Loader2 className="w-3.5 h-3.5 animate-spin text-violet-500 ml-auto" />}
                            </div>

                            {!aiSuggestion ? (
                                <Card className="border-dashed border-2 border-slate-200 dark:border-white/10">
                                    <CardContent className="p-5 text-center">
                                        <div className="w-12 h-12 rounded-2xl bg-violet-100 dark:bg-violet-500/10 flex items-center justify-center mx-auto mb-3">
                                            <Sparkles className="w-6 h-6 text-violet-400" />
                                        </div>
                                        <p className="text-sm font-medium text-slate-600 dark:text-slate-400">Start typing your complaint</p>
                                        <p className="text-xs text-slate-400 dark:text-slate-500 mt-1">AI will analyze it in real-time</p>
                                    </CardContent>
                                </Card>
                            ) : (
                                <>
                                    {/* AI Category */}
                                    <Card className="border-slate-200 dark:border-blue-900/30 overflow-hidden">
                                        <CardContent className="p-4">
                                            <div className="flex items-center justify-between">
                                                <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Category</span>
                                                <span className="text-[10px] font-semibold text-violet-500 bg-violet-100 dark:bg-violet-500/15 px-1.5 py-0.5 rounded">AI</span>
                                            </div>
                                            <div className="flex items-center gap-2 mt-2">
                                                <span className="text-xl">{CATEGORY_ICONS[aiSuggestion.category] || '📋'}</span>
                                                <span className="text-base font-bold text-slate-800 dark:text-foreground">{aiSuggestion.category}</span>
                                            </div>
                                        </CardContent>
                                    </Card>

                                    {/* AI Priority */}
                                    {p && (
                                        <Card className={`border overflow-hidden ${p.border}`}>
                                            <CardContent className="p-4">
                                                <div className="flex items-center justify-between">
                                                    <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Priority</span>
                                                    <span className="text-[10px] font-semibold text-violet-500 bg-violet-100 dark:bg-violet-500/15 px-1.5 py-0.5 rounded">AI</span>
                                                </div>
                                                <div className="flex items-center gap-2 mt-2">
                                                    <span className="text-xl">{p.icon}</span>
                                                    <span className={`text-base font-bold ${p.text}`}>{aiSuggestion.priority}</span>
                                                </div>
                                            </CardContent>
                                        </Card>
                                    )}

                                    {/* AI Sentiment */}
                                    {s && (
                                        <Card className="border-slate-200 dark:border-blue-900/30 overflow-hidden">
                                            <CardContent className="p-4">
                                                <div className="flex items-center justify-between">
                                                    <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Sentiment</span>
                                                    <span className="text-[10px] font-semibold text-violet-500 bg-violet-100 dark:bg-violet-500/15 px-1.5 py-0.5 rounded">AI</span>
                                                </div>
                                                <div className="mt-2">
                                                    <span className={`inline-flex items-center gap-1 text-sm font-bold px-2.5 py-1 rounded-lg ${s.bg} ${s.text}`}>
                                                        {s.label}
                                                    </span>
                                                </div>
                                            </CardContent>
                                        </Card>
                                    )}

                                    {/* AI ETA */}
                                    <Card className="border-slate-200 dark:border-blue-900/30 overflow-hidden">
                                        <CardContent className="p-4">
                                            <div className="flex items-center justify-between">
                                                <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Est. Resolution</span>
                                                <span className="text-[10px] font-semibold text-violet-500 bg-violet-100 dark:bg-violet-500/15 px-1.5 py-0.5 rounded">AI</span>
                                            </div>
                                            <div className="flex items-center gap-2 mt-2">
                                                <Clock className="w-4 h-4 text-blue-500" />
                                                <span className="text-base font-bold text-slate-800 dark:text-foreground">{aiSuggestion.estimatedTime}</span>
                                            </div>
                                        </CardContent>
                                    </Card>

                                    {/* Duplicate Warning */}
                                    {aiSuggestion.duplicates?.isDuplicate && (
                                        <Card className="border-amber-300 dark:border-amber-500/30 bg-amber-50 dark:bg-amber-500/5 overflow-hidden">
                                            <CardContent className="p-4">
                                                <div className="flex items-start gap-2">
                                                    <AlertTriangle className="w-4 h-4 text-amber-500 mt-0.5 flex-shrink-0" />
                                                    <div>
                                                        <p className="text-xs font-bold text-amber-700 dark:text-amber-300">Similar complaint found!</p>
                                                        <p className="text-[11px] text-amber-600 dark:text-amber-400 mt-1 leading-relaxed">
                                                            {aiSuggestion.duplicates.similarComplaints[0]?.complaint?.title}
                                                            <span className="ml-1 font-semibold">({aiSuggestion.duplicates.highestScore}% match)</span>
                                                        </p>
                                                    </div>
                                                </div>
                                            </CardContent>
                                        </Card>
                                    )}
                                </>
                            )}
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}
