import { useState, useRef, useEffect } from 'react';
import { Bell, CheckCircle2, Loader2, AlertCircle, Clock } from 'lucide-react';
import { useSocket } from '../context/SocketContext';
import { formatDistanceToNow } from 'date-fns';
import { cn } from '@/lib/utils';

const notifIcon = {
    created: <AlertCircle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />,
    status: <Loader2 className="w-4 h-4 text-blue-400 shrink-0 mt-0.5" />,
    resolved: <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />,
};

export default function NotificationBell() {
    const { notifications, unreadCount, clearNotifications } = useSocket();
    const [open, setOpen] = useState(false);
    const ref = useRef(null);

    useEffect(() => {
        const handler = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false); };
        document.addEventListener('mousedown', handler);
        return () => document.removeEventListener('mousedown', handler);
    }, []);

    const handleOpen = () => { setOpen(o => !o); clearNotifications(); };

    return (
        <div className="relative" ref={ref}>
            <button
                onClick={handleOpen}
                className="relative w-9 h-9 flex items-center justify-center rounded-xl hover:bg-white/5 transition-colors"
            >
                <Bell className="w-5 h-5 text-slate-300" />
                {unreadCount > 0 && (
                    <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center shadow-lg animate-bounce-subtle">
                        {unreadCount > 9 ? '9+' : unreadCount}
                    </span>
                )}
            </button>

            {open && (
                <div className="absolute left-full top-0 ml-3 w-80 glass-card border border-blue-500/20 rounded-2xl shadow-2xl shadow-blue-900/30 z-50 overflow-hidden animate-fade-in">
                    <div className="flex items-center justify-between px-4 py-3 border-b border-white/5">
                        <span className="text-sm font-semibold text-foreground">Notifications</span>
                        <span className="text-xs text-muted-foreground">{notifications.length} total</span>
                    </div>
                    <div className="max-h-72 overflow-y-auto">
                        {notifications.length === 0 ? (
                            <div className="flex flex-col items-center justify-center py-10 text-center">
                                <Bell className="w-8 h-8 text-muted-foreground/30 mb-2" />
                                <p className="text-sm text-muted-foreground">No notifications yet</p>
                            </div>
                        ) : (
                            notifications.map((n, i) => (
                                <div key={i} className={cn('flex items-start gap-3 px-4 py-3 hover:bg-white/5 transition-colors', i !== notifications.length - 1 && 'border-b border-white/5')}>
                                    {notifIcon[n.type]}
                                    <div className="flex-1 min-w-0">
                                        <p className="text-xs text-foreground/90 leading-relaxed">{n.message}</p>
                                        <p className="text-[10px] text-muted-foreground mt-1 flex items-center gap-1">
                                            <Clock className="w-3 h-3" />
                                            {formatDistanceToNow(new Date(n.time), { addSuffix: true })}
                                        </p>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}
