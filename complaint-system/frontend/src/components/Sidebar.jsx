import { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
    LayoutDashboard, PlusCircle, FileText, ShieldCheck, ClipboardList,
    GraduationCap, Menu, X, Wrench, UserCheck, ListChecks
} from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { cn } from '@/lib/utils';

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
    student: { active: 'bg-[#1e1b3a] text-purple-100', bar: 'bg-purple-500 shadow-[0_0_10px_#9333ea]', icon: 'text-indigo-400' },
    admin: { active: 'bg-[#1b1e3a] text-indigo-100', bar: 'bg-indigo-500 shadow-[0_0_10px_#6366f1]', icon: 'text-indigo-400' },
    technician: { active: 'bg-[#0f1e2e] text-blue-100', bar: 'bg-blue-500 shadow-[0_0_10px_#3b82f6]', icon: 'text-blue-400' },
    warden: { active: 'bg-[#0f2a1e] text-emerald-100', bar: 'bg-emerald-500 shadow-[0_0_10px_#10b981]', icon: 'text-emerald-400' },
};

export default function Sidebar() {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const [mobileOpen, setMobileOpen] = useState(false);

    const links = linksByRole[user?.role] || linksByRole.student;
    const accent = accentByRole[user?.role] || accentByRole.student;
    const initials = user?.name?.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2) || 'U';

    const handleLogout = () => { logout(); navigate('/login'); };

    const SidebarContent = ({ onLinkClick }) => (
        <div className="flex flex-col h-full bg-[#0d0d16]">
            {/* Logo */}
            <div className="flex items-center gap-3 px-6 py-6 pt-8">
                <div className="w-9 h-9 rounded-xl bg-purple-600/20 flex items-center justify-center">
                    <GraduationCap className="w-5 h-5 text-purple-400" />
                </div>
                <h1 className="text-xl font-bold text-white tracking-tight">Campus<span className="text-purple-400">Desk</span></h1>
            </div>

            {/* Profile */}
            <div className="flex flex-col items-center mt-2 mb-8 px-4">
                <div style={{ width: '96px', height: '96px', minWidth: '96px' }} className="rounded-full bg-gradient-to-tr from-purple-600 p-0.5 mb-4 shadow-[0_0_20px_rgba(147,51,234,0.3)] shrink-0 overflow-hidden">
                    <Avatar className="w-full h-full border-[3px] border-[#0d0d16] bg-[#1a1a2e]">
                        <AvatarImage src={`https://api.dicebear.com/7.x/notionists/svg?seed=${user?.name?.replace(' ', '') || 'User'}&backgroundColor=transparent&size=96`} className="object-cover w-full h-full" />
                        <AvatarFallback className="bg-[#1a1a2e] text-lg text-white">{initials}</AvatarFallback>
                    </Avatar>
                </div>
                <h2 className="text-xl font-bold text-white tracking-wide">{user?.name || 'User Name'}</h2>
                <div className="flex items-center gap-1.5 mt-1.5 text-muted-foreground">
                    <GraduationCap className="w-4 h-4" />
                    <span className="text-sm font-medium lowercase tracking-widest opacity-80">{user?.role || 'student'}</span>
                </div>
            </div>

            {/* Navigation links */}
            <nav className="flex-1 space-y-2">
                {links.map((l) => (
                    <NavLink key={l.to} to={l.to} onClick={onLinkClick} end={l.to.endsWith('/dashboard') || l.to === '/dashboard' || l.to === '/technician' || l.to === '/warden'}
                        className={({ isActive }) => cn(
                            'group flex items-center gap-3.5 px-6 py-3.5 text-sm font-medium transition-all duration-300 relative',
                            isActive
                                ? accent.active
                                : 'text-slate-400 hover:text-white hover:bg-white/5'
                        )}>
                        {({ isActive }) => (
                            <>
                                {isActive && <div className={`absolute left-0 top-0 bottom-0 w-[4px] rounded-r-md ${accent.bar}`} />}
                                <l.icon className={cn('w-5 h-5 transition-transform duration-300 group-hover:scale-110 ml-2', isActive ? accent.icon : 'text-slate-400')} />
                                <span>{l.label}</span>
                            </>
                        )}
                    </NavLink>
                ))}
            </nav>

            {/* Logout gap */}
            <div className="p-5 mt-auto">
                <button onClick={handleLogout}
                    className="flex items-center justify-center gap-2 w-full px-4 py-3 rounded-xl text-sm font-medium text-slate-300 border border-slate-700/50 bg-[#121124] hover:bg-slate-800/80 hover:text-white transition-all">
                    <ShieldCheck className="w-4 h-4" />
                    <span>Secure Logout</span>
                </button>
            </div>
        </div>
    );

    return (
        <>
            <aside className="hidden lg:flex w-[280px] min-h-screen flex-col border-r border-[#1e1e2d] bg-[#0d0d16] fixed top-0 left-0 z-30">
                <SidebarContent onLinkClick={undefined} />
            </aside>

            <div className="lg:hidden fixed top-0 left-0 right-0 z-40 flex items-center justify-between px-4 py-3 border-b border-[#1e1e2d] bg-[#0d0d16]/90 backdrop-blur-lg">
                <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-lg bg-purple-600/20 flex items-center justify-center">
                        <GraduationCap className="w-4 h-4 text-purple-400" />
                    </div>
                    <span className="text-base font-bold text-white tracking-tight">Campus<span className="text-purple-400">Desk</span></span>
                </div>
                <button onClick={() => setMobileOpen(!mobileOpen)} className="p-2 -mr-2 rounded-lg text-slate-300 hover:bg-white/5 transition-colors">
                    {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
                </button>
            </div>

            {mobileOpen && (
                <div className="lg:hidden fixed inset-0 z-40">
                    <div className="absolute inset-0 bg-[#0d0d16]/80 backdrop-blur-sm animate-fade-in" onClick={() => setMobileOpen(false)} />
                    <aside className="absolute left-0 top-0 h-full w-[280px] bg-[#0d0d16] border-r border-[#1e1e2d] flex flex-col shadow-2xl animate-slide-in-right">
                        <SidebarContent onLinkClick={() => setMobileOpen(false)} />
                    </aside>
                </div>
            )}
        </>
    );
}
