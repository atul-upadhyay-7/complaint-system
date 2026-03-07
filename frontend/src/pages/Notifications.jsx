import { useEffect } from 'react';
import { useSocket } from '../context/SocketContext';
import { formatDistanceToNow } from 'date-fns';
import { Bell, CheckCircle2, Loader2, AlertCircle, Clock } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { useTheme } from '../context/ThemeContext';

const notifIcon = {
    created: <AlertCircle className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />,
    status: <Loader2 className="w-5 h-5 text-blue-500 shrink-0 mt-0.5" />,
    resolved: <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0 mt-0.5" />,
};

export default function Notifications() {
    const { notifications, clearNotifications } = useSocket();
    const { theme } = useTheme();
    const isLight = theme === 'light';

    useEffect(() => {
        clearNotifications();
    }, [clearNotifications]);

    return (
        <div className="max-w-4xl mx-auto space-y-6 animate-fade-in pb-12">
            <div>
                <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">Notifications</h1>
                <p className="text-slate-500 dark:text-slate-400">View all your recent alerts and updates here.</p>
            </div>

            <Card className={`border-0 shadow-lg ${isLight ? 'bg-white/80' : 'bg-white/5'} backdrop-blur-md`}>
                <CardContent className="p-0">
                    {notifications.length === 0 ? (
                        <div className="flex flex-col items-center justify-center py-24 text-center">
                            <Bell className="w-16 h-16 text-slate-300 dark:text-slate-600 mb-4" />
                            <h3 className="text-xl font-medium text-slate-600 dark:text-slate-300">No notifications yet</h3>
                            <p className="text-sm text-slate-500 dark:text-slate-500 mt-2">You're all caught up! New updates will appear here.</p>
                        </div>
                    ) : (
                        <div className="divide-y divide-slate-100 dark:divide-white/5">
                            {notifications.map((n, i) => (
                                <div key={i} className="flex items-start gap-4 p-5 hover:bg-slate-50 dark:hover:bg-white/5 transition-colors">
                                    <div className="p-2 rounded-full bg-slate-100 dark:bg-[#0a1628]">
                                        {notifIcon[n.type] || <Bell className="w-5 h-5 text-slate-400" />}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className="text-sm font-medium text-slate-800 dark:text-slate-200 leading-relaxed">{n.message}</p>
                                        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1.5 flex items-center gap-1.5">
                                            <Clock className="w-3.5 h-3.5" />
                                            {formatDistanceToNow(new Date(n.time), { addSuffix: true })}
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}
