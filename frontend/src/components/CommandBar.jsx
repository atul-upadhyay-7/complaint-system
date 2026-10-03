import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import {
    Command,
    Search,
    LayoutDashboard,
    PlusCircle,
    List,
    Moon,
    Sun,
    LogOut,
    Bell,
    Settings,
    Shield,
    Sparkles
} from 'lucide-react';
import {
    Dialog,
    DialogContent,
} from '@/components/ui/dialog';
import { cn } from '@/lib/utils';

export default function CommandBar() {
    const [open, setOpen] = useState(false);
    const [search, setSearch] = useState('');
    const { user, logout } = useAuth();
    const { theme, toggleTheme } = useTheme();
    const navigate = useNavigate();

    useEffect(() => {
        const down = (e) => {
            if (e.key === 'k' && (e.metaKey || e.ctrlKey)) {
                e.preventDefault();
                setOpen((open) => !open);
            }
        };
        document.addEventListener('keydown', down);
        return () => document.removeEventListener('keydown', down);
    }, []);

    const runCommand = (command) => {
        setOpen(false);
        command();
    };

    const actions = [
        {
            group: 'General',
            items: [
                {
                    icon: LayoutDashboard,
                    label: 'Dashboard',
                    shortcut: 'G D',
                    onSelect: () => navigate(user?.role === 'admin' ? '/admin' : user?.role === 'warden' ? '/warden' : user?.role === 'technician' ? '/technician' : '/dashboard')
                },
                {
                    icon: Bell,
                    label: 'Notifications',
                    shortcut: 'G N',
                    onSelect: () => navigate('/notifications')
                },
            ]
        },
        {
            group: 'Complaints',
            show: user?.role === 'student',
            items: [
                {
                    icon: PlusCircle,
                    label: 'New Complaint',
                    shortcut: 'C N',
                    onSelect: () => navigate('/submit')
                },
                {
                    icon: List,
                    label: 'My Complaints',
                    shortcut: 'C L',
                    onSelect: () => navigate('/my-complaints')
                },
            ]
        },
        {
            group: 'Admin',
            show: user?.role === 'admin' || user?.role === 'warden',
            items: [
                {
                    icon: Shield,
                    label: 'All Complaints',
                    onSelect: () => navigate(user?.role === 'admin' ? '/admin/complaints' : '/warden')
                }
            ]
        },
        {
            group: 'Preferences',
            items: [
                {
                    icon: theme === 'dark' ? Sun : Moon,
                    label: `Switch to ${theme === 'dark' ? 'Light' : 'Dark'} Mode`,
                    shortcut: 'T T',
                    onSelect: () => toggleTheme()
                },
                {
                    icon: LogOut,
                    label: 'Logout',
                    shortcut: '⇧ ⌘ L',
                    onSelect: () => {
                        logout();
                        navigate('/login');
                    }
                },
            ]
        }
    ];

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogContent className="max-w-2xl p-0 overflow-hidden bg-slate-50/80 dark:bg-[#0c1f14]/95 backdrop-blur-2xl border-slate-200 dark:border-white/10 shadow-[0_0_50px_-12px_rgba(0,0,0,0.5)]">
                <div className="flex items-center border-b border-slate-200 dark:border-white/5 px-4 h-14">
                    <Search className="w-5 h-5 text-muted-foreground mr-3" />
                    <input
                        autoFocus
                        placeholder="Search commands or insights... (e.g. 'Dashboard')"
                        className="flex-1 bg-transparent border-none outline-none text-slate-900 dark:text-slate-100 placeholder:text-slate-500"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                    <div className="flex items-center gap-1.5 px-1.5 py-0.5 rounded border border-slate-200 dark:border-white/10 bg-slate-200/50 dark:bg-white/5">
                        <span className="text-[10px] font-bold text-muted-foreground">ESC</span>
                    </div>
                </div>

                <div className="max-h-[400px] overflow-y-auto p-2 scrollbar-none">
                    {actions.map((group, idx) => (
                        (!group.show === false || group.show === undefined) && (
                            <div key={group.group} className={cn(idx > 0 && "mt-4")}>
                                <p className="px-3 py-1 text-[10px] font-bold text-slate-500 uppercase tracking-widest">{group.group}</p>
                                <div className="space-y-1 mt-1">
                                    {group.items
                                        .filter(item => item.label.toLowerCase().includes(search.toLowerCase()))
                                        .map(item => (
                                            <button
                                                key={item.label}
                                                onClick={() => runCommand(item.onSelect)}
                                                className="w-full flex items-center justify-between px-3 py-2.5 rounded-xl hover:bg-blue-500/10 dark:hover:bg-blue-500/15 group transition-all"
                                            >
                                                <div className="flex items-center gap-3">
                                                    <div className="w-8 h-8 rounded-lg bg-slate-200/50 dark:bg-white/5 flex items-center justify-center group-hover:bg-blue-500/20 group-hover:text-blue-500 transition-colors">
                                                        <item.icon className="w-4 h-4" />
                                                    </div>
                                                    <span className="text-sm font-medium text-slate-700 dark:text-slate-300 group-hover:text-slate-900 dark:group-hover:text-white">{item.label}</span>
                                                </div>
                                                {item.shortcut && (
                                                    <span className="text-[10px] text-slate-400 font-mono tracking-tighter opacity-0 group-hover:opacity-100 transition-opacity">
                                                        {item.shortcut}
                                                    </span>
                                                )}
                                            </button>
                                        ))}
                                </div>
                            </div>
                        )
                    ))}

                    <div className="mt-6 mb-2 mx-2 p-4 rounded-xl grad-blue border border-blue-500/20 flex items-center gap-4 animate-pulse">
                        <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center text-white">
                            <Sparkles className="w-5 h-5" />
                        </div>
                        <div>
                            <p className="text-xs font-bold text-white uppercase tracking-widest">AI Command Insight</p>
                            <p className="text-[10px] text-white/70 italic">"Try searching for 'Light Mode' or 'New Complaint'"</p>
                        </div>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
}
