import { useState } from 'react';
import { NavLink, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
    LayoutDashboard, PlusCircle, FileText, ShieldCheck, ClipboardList,
    LogOut, GraduationCap, Menu, X, ChevronRight
} from 'lucide-react';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { cn } from '@/lib/utils';

const studentLinks = [
    { to: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
    { to: '/submit', icon: PlusCircle, label: 'Submit Complaint' },
    { to: '/my-complaints', icon: FileText, label: 'My Complaints' },
];
const adminLinks = [
    { to: '/admin', icon: LayoutDashboard, label: 'Dashboard' },
    { to: '/admin/complaints', icon: ClipboardList, label: 'All Complaints' },
];

function NavItem({ to, icon: Icon, label, onClick }) {
    return (
        <NavLink to={to} onClick={onClick} end={to === '/admin' || to === '/dashboard'}
            className={({ isActive }) => cn(
                'flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200',
                isActive
                    ? 'bg-purple-600/15 text-purple-300 border border-purple-600/25'
                    : 'text-muted-foreground hover:text-foreground hover:bg-secondary'
            )}>
            {({ isActive }) => (
                <>
                    <Icon className={cn('w-4 h-4', isActive ? 'text-purple-400' : '')} />
                    <span>{label}</span>
                    {isActive && <ChevronRight className="w-3.5 h-3.5 ml-auto text-purple-400/60" />}
                </>
            )}
        </NavLink>
    );
}

export default function Sidebar() {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const [mobileOpen, setMobileOpen] = useState(false);

    const links = user?.role === 'admin' ? adminLinks : studentLinks;
    const initials = user?.name?.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2) || 'U';

    const handleLogout = () => { logout(); navigate('/login'); };

    const SidebarContent = ({ onLinkClick }) => (
        <div className="flex flex-col h-full">
            {/* Logo */}
            <div className="flex items-center gap-3 px-2 py-6">
                <div className="w-9 h-9 rounded-xl glass-purple flex items-center justify-center">
                    <GraduationCap className="w-5 h-5 text-purple-400" />
                </div>
                <div>
                    <h1 className="text-base font-bold text-gradient leading-none">CampusDesk</h1>
                    <p className="text-[10px] text-muted-foreground mt-0.5">Complaint Portal</p>
                </div>
            </div>

            <Separator className="mb-4" />

            {/* User info */}
            <div className="flex items-center gap-3 px-2 py-3 mb-4 rounded-xl glass">
                <Avatar className="w-9 h-9">
                    <AvatarFallback>{initials}</AvatarFallback>
                </Avatar>
                <div className="min-w-0 flex-1">
                    <p className="text-sm font-semibold text-foreground truncate">{user?.name}</p>
                    <div className="flex items-center gap-1 mt-0.5">
                        {user?.role === 'admin'
                            ? <ShieldCheck className="w-3 h-3 text-purple-400" />
                            : <GraduationCap className="w-3 h-3 text-purple-400" />
                        }
                        <span className="text-xs text-muted-foreground capitalize">{user?.role}</span>
                    </div>
                </div>
            </div>

            {/* Navigation links */}
            <nav className="flex-1 space-y-1">
                <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider px-3 mb-2">
                    {user?.role === 'admin' ? 'Administration' : 'Navigation'}
                </p>
                {links.map(l => <NavItem key={l.to} {...l} onClick={onLinkClick} />)}
            </nav>

            {/* Logout */}
            <div className="pt-4">
                <Separator className="mb-4" />
                <button onClick={handleLogout}
                    className="flex items-center gap-3 w-full px-3 py-2.5 rounded-xl text-sm font-medium text-muted-foreground hover:text-red-400 hover:bg-red-500/10 transition-all duration-200">
                    <LogOut className="w-4 h-4" />
                    <span>Logout</span>
                </button>
            </div>
        </div>
    );

    return (
        <>
            {/* Desktop sidebar */}
            <aside className="hidden lg:flex w-64 min-h-screen flex-col border-r border-border/50 bg-card/50 backdrop-blur-sm p-4 fixed top-0 left-0 z-30">
                <SidebarContent onLinkClick={undefined} />
            </aside>

            {/* Mobile topbar */}
            <div className="lg:hidden fixed top-0 left-0 right-0 z-40 flex items-center justify-between px-4 py-3 border-b border-border/50 bg-card/80 backdrop-blur-md">
                <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-xl glass-purple flex items-center justify-center">
                        <GraduationCap className="w-4 h-4 text-purple-400" />
                    </div>
                    <span className="text-sm font-bold text-gradient">CampusDesk</span>
                </div>
                <button onClick={() => setMobileOpen(!mobileOpen)} className="p-2 rounded-lg hover:bg-secondary transition-colors">
                    {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
                </button>
            </div>

            {/* Mobile drawer */}
            {mobileOpen && (
                <div className="lg:hidden fixed inset-0 z-40">
                    <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setMobileOpen(false)} />
                    <aside className="absolute left-0 top-0 h-full w-72 bg-card border-r border-border p-4 flex flex-col">
                        <SidebarContent onLinkClick={() => setMobileOpen(false)} />
                    </aside>
                </div>
            )}
        </>
    );
}
