import { createContext, useContext, useEffect, useRef, useState } from 'react';
import { io } from 'socket.io-client';
import toast from 'react-hot-toast';
import { Bell, CheckCircle2, AlertTriangle, Loader2 } from 'lucide-react';
import { useAuth } from './AuthContext';

const SocketContext = createContext(null);

const BACKEND_URL = import.meta.env.VITE_API_URL?.replace('/api', '') || 'http://localhost:5000';

export const SocketProvider = ({ children }) => {
    const { user } = useAuth();
    const socketRef = useRef(null);
    const [notifications, setNotifications] = useState([]);
    const [unreadCount, setUnreadCount] = useState(0);

    useEffect(() => {
        if (!user) {
            socketRef.current?.disconnect();
            socketRef.current = null;
            return;
        }

        const socket = io(BACKEND_URL, { transports: ['websocket', 'polling'] });
        socketRef.current = socket;

        socket.on('connect', () => {
            socket.emit('join:user', user._id);
        });

        const addNotification = (notif) => {
            setNotifications(prev => [notif, ...prev].slice(0, 20));
            setUnreadCount(c => c + 1);
        };

        socket.on('complaint:created', (data) => {
            if (user.role === 'admin' || user.role === 'warden') {
                toast.custom((t) => (
                    <div className={`glass-card flex items-start gap-3 px-4 py-3 rounded-xl border border-blue-500/30 shadow-lg animate-slide-up ${t.visible ? 'opacity-100' : 'opacity-0'}`}>
                        <Bell className="w-5 h-5 text-blue-400 mt-0.5 shrink-0" />
                        <div>
                            <p className="text-sm font-semibold text-foreground">New Complaint</p>
                            <p className="text-xs text-muted-foreground mt-0.5">{data.studentName} submitted: {data.title}</p>
                        </div>
                    </div>
                ), { duration: 5000 });
                addNotification({ type: 'created', message: `New complaint from ${data.studentName}: "${data.title}"`, time: new Date() });
            }
        });

        socket.on('complaint:statusChanged', (data) => {
            if (user.role === 'student') {
                const icon = data.newStatus === 'Resolved' ? '✅' : data.newStatus === 'In Progress' ? '⚙️' : '📋';
                toast.custom((t) => (
                    <div className={`glass-card flex items-start gap-3 px-4 py-3 rounded-xl border border-blue-500/30 shadow-lg ${t.visible ? 'opacity-100' : 'opacity-0'}`}>
                        <Loader2 className="w-5 h-5 text-blue-400 mt-0.5 shrink-0" />
                        <div>
                            <p className="text-sm font-semibold text-foreground">Status Updated {icon}</p>
                            <p className="text-xs text-muted-foreground mt-0.5">"{data.title}" → {data.newStatus}</p>
                        </div>
                    </div>
                ), { duration: 5000 });
                addNotification({ type: 'status', message: `"${data.title}" status → ${data.newStatus}`, time: new Date() });
            }
        });

        socket.on('complaint:resolved', (data) => {
            if (user.role === 'student') {
                toast.custom((t) => (
                    <div className={`glass-card flex items-start gap-3 px-4 py-3 rounded-xl border border-emerald-500/30 shadow-lg ${t.visible ? 'opacity-100' : 'opacity-0'}`}>
                        <CheckCircle2 className="w-5 h-5 text-emerald-400 mt-0.5 shrink-0" />
                        <div>
                            <p className="text-sm font-semibold text-emerald-300">Complaint Resolved! 🎉</p>
                            <p className="text-xs text-muted-foreground mt-0.5">"{data.title}" was resolved in {data.resolutionTimeHours}h</p>
                        </div>
                    </div>
                ), { duration: 7000 });
                addNotification({ type: 'resolved', message: `"${data.title}" resolved in ${data.resolutionTimeHours}h 🎉`, time: new Date() });
            }
        });

        return () => socket.disconnect();
    }, [user]);

    const clearNotifications = () => {
        setUnreadCount(0);
    };

    return (
        <SocketContext.Provider value={{ notifications, unreadCount, clearNotifications }}>
            {children}
        </SocketContext.Provider>
    );
};

export const useSocket = () => {
    const ctx = useContext(SocketContext);
    if (!ctx) throw new Error('useSocket must be used within SocketProvider');
    return ctx;
};
