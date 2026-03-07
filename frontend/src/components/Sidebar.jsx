import { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import {
    LayoutDashboard, PlusCircle, FileText, ShieldCheck, ClipboardList,
    GraduationCap, Menu, X, ListChecks, Sun, Moon, Bell
} from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { cn } from '@/lib/utils';
import NotificationBell from './NotificationBell';

const linksByRole = {
    student: [
        { to: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
        { to: '/submit', icon: PlusCircle, label: 'Submit Complaint' },
        { to: '/my-complaints', icon: FileText, label: 'My Complaints' },
    ],
    admin: [
        { to: '/admin/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
        { to: '/admin/complaints', icon: ClipboardList, label: 'All Complaints' },
    ],
    technician: [
        { to: '/technician', icon: ListChecks, label: 'My Tasks' },
    ],
    warden: [
        { to: '/warden', icon: LayoutDashboard, label: 'Dashboard' },
        { to: '/warden/complaints', icon: ClipboardList, label: 'All Complaints' },
    ],
};

const accentByRole = {
    student: { active: 'bg-blue-500/10 text-blue-100', bar: 'bg-blue-500 shadow-[0_0_10px_#3b82f6]', icon: 'text-blue-400' },
    admin: { active: 'bg-blue-600/10 text-blue-100', bar: 'bg-blue-600 shadow-[0_0_10px_#2563eb]', icon: 'text-blue-400' },
    technician: { active: 'bg-cyan-500/10 text-cyan-100', bar: 'bg-cyan-500 shadow-[0_0_10px_#06b6d4]', icon: 'text-cyan-400' },
    warden: { active: 'bg-blue-400/10 text-blue-100', bar: 'bg-blue-400 shadow-[0_0_10px_#60a5fa]', icon: 'text-blue-400' },
};

export default function Sidebar() {
    const { user, logout } = useAuth();
    const { theme, toggleTheme } = useTheme();
    const navigate = useNavigate();
    const [mobileOpen, setMobileOpen] = useState(false);

    const links = linksByRole[user?.role] || linksByRole.student;
    const accent = accentByRole[user?.role] || accentByRole.student;
    const initials = user?.name?.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2) || 'U';
    const handleLogout = () => { logout(); navigate('/login'); };

    const SidebarContent = ({ onLinkClick }) => (
        <div className="flex flex-col h-full bg-[#060d1a]">
            {/* Logo + controls */}
            <div className="flex items-center justify-between px-5 py-5 pt-7">
                <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-xl bg-blue-500/15 flex items-center justify-center glow-blue-sm">
                        <GraduationCap className="w-5 h-5 text-blue-400" />
                    </div>
                    <h1 className="text-xl font-bold text-white tracking-tight">Campus<span className="text-blue-400">Desk</span></h1>
                </div>
                <div className="flex items-center gap-1">
                    <NotificationBell />
                    <button
                        onClick={toggleTheme}
                        className="w-9 h-9 flex items-center justify-center rounded-xl hover:bg-white/5 transition-colors"
                        title={theme === 'dark' ? 'Switch to Light' : 'Switch to Dark'}
                    >
                        {theme === 'dark'
                            ? <Sun className="w-4.5 h-4.5 text-amber-400" />
                            : <Moon className="w-4.5 h-4.5 text-blue-300" />
                        }
                    </button>
                </div>
            </div>

            {/* Profile */}
            <div className="flex flex-col items-center mt-2 mb-8 px-4">
                <div
                    className="rounded-full p-0.5 mb-3 shrink-0 overflow-hidden"
                    style={{ width: '88px', height: '88px', minWidth: '88px', background: 'linear-gradient(135deg, #3b82f6, #06b6d4)', boxShadow: '0 0 24px rgba(59,130,246,0.4)' }}>
                    <Avatar className="w-full h-full border-[3px] border-[#060d1a] bg-[#0d1a2e]" style={{ width: '100%', height: '100%', borderRadius: '50%' }}>
                        <AvatarImage src={`https://api.dicebear.com/7.x/notionists/svg?seed=${user?.name?.replace(' ', '') || 'User'}&backgroundColor=transparent&size=96`} className="object-cover w-full h-full" />
                        <AvatarFallback className="bg-[#0d1a2e] text-lg text-white">{initials}</AvatarFallback>
                    </Avatar>
                </div>
                <h2 className="text-lg font-bold text-white tracking-wide">{user?.name || 'User Name'}</h2>
                <div className="flex items-center gap-1.5 mt-1 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20">
                    <GraduationCap className="w-3.5 h-3.5 text-blue-400" />
                    <span className="text-xs font-medium text-blue-300 lowercase tracking-widest">{user?.role || 'student'}</span>
                </div>
            </div>

            {/* Navigation */}
            <nav className="flex-1 space-y-1 px-3">
                {links.map((l) => (
                    <NavLink key={l.to} to={l.to} onClick={onLinkClick}
                        end={l.to.endsWith('/dashboard') || l.to === '/dashboard' || l.to === '/technician' || l.to === '/warden'}
                        className={({ isActive }) => cn(
                            'group flex items-center gap-3.5 px-4 py-3 text-sm font-medium transition-all duration-300 relative rounded-xl',
                            isActive ? accent.active : 'text-slate-700 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-200/50 dark:hover:bg-white/5'
                        )}>
                        {({ isActive }) => (
                            <>
                                {isActive && <div className={`absolute left-0 top-2 bottom-2 w-[3px] rounded-full ${accent.bar}`} />}
                                <l.icon className={cn('w-5 h-5 transition-all duration-300 group-hover:scale-110', isActive ? accent.icon : 'text-slate-400')} />
                                <span>{l.label}</span>
                            </>
                        )}
                    </NavLink>
                ))}
            </nav>

            {/* Notifications + Logout */}
            <div className="p-4 mt-auto space-y-2">
                {/* Notifications button */}
                <button
                    className="flex items-center gap-3.5 w-full px-4 py-3 rounded-xl text-sm font-medium text-slate-700 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-300 hover:bg-blue-50 dark:hover:bg-blue-500/10 border border-slate-200 dark:border-transparent hover:border-blue-200 dark:hover:border-blue-500/20 transition-all duration-300"
                    onClick={() => {/* future: open notifications panel */ }}
                >
                    <div className="relative">
                        <Bell className="w-5 h-5" />
                        {/* Unread badge */}
                        <span className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-blue-500 border-2 border-slate-50 dark:border-[#060d1a]" />
                    </div>
                    <span>Notifications</span>
                </button>

                {/* Secure Logout */}
                <button onClick={onLinkClick ? () => { onLinkClick(); handleLogout(); } : handleLogout}
                    className="flex items-center justify-center gap-2 w-full px-4 py-3 rounded-xl text-sm font-medium text-slate-600 dark:text-slate-300 border border-slate-300 dark:border-slate-700/50 bg-white/50 dark:bg-[#0a1628]/60 hover:bg-red-50 dark:hover:bg-red-900/10 hover:border-red-300 dark:hover:border-red-500/30 hover:text-red-600 dark:hover:text-red-400 transition-all duration-300 shadow-sm">
                    <ShieldCheck className="w-4 h-4" />
                    <span>Secure Logout</span>
                </button>
            </div>
        </div>
    );

    return (
        <>
            <aside className="hidden lg:flex w-[280px] min-h-screen flex-col border-r border-blue-900/30 bg-[#060d1a] fixed top-0 left-0 z-30">
                <SidebarContent onLinkClick={undefined} />
            </aside>

            {/* Mobile top bar */}
            <div className="lg:hidden fixed top-0 left-0 right-0 z-40 flex items-center justify-between px-4 py-3 border-b border-blue-900/30 bg-[#060d1a]/90 backdrop-blur-lg">
                <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-lg bg-blue-500/15 flex items-center justify-center">
                        <GraduationCap className="w-4 h-4 text-blue-400" />
                    </div>
                    <span className="text-base font-bold text-white tracking-tight">Campus<span className="text-blue-400">Desk</span></span>
                </div>
                <div className="flex items-center gap-1">
                    <NotificationBell />
                    <button onClick={toggleTheme} className="p-2 rounded-lg text-slate-300 hover:bg-white/5 transition-colors">
                        {theme === 'dark' ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-blue-300" />}
                    </button>
                    <button onClick={() => setMobileOpen(!mobileOpen)} className="p-2 -mr-2 rounded-lg text-slate-300 hover:bg-white/5 transition-colors">
                        {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
                    </button>
                </div>
            </div>

            {mobileOpen && (
                <div className="lg:hidden fixed inset-0 z-40">
                    <div className="absolute inset-0 bg-[#060d1a]/80 backdrop-blur-sm animate-fade-in" onClick={() => setMobileOpen(false)} />
                    <aside className="absolute left-0 top-0 h-full w-[280px] bg-[#060d1a] border-r border-blue-900/30 flex flex-col shadow-2xl animate-fade-in">
                        <SidebarContent onLinkClick={() => setMobileOpen(false)} />
                    </aside>
                </div>
            )}
        </>
    );
}
