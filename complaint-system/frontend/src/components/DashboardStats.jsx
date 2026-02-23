import { TrendingDown, Clock, CheckCircle2, AlertCircle, Loader2 } from 'lucide-react';

const stats = [
    {
        key: 'total',
        label: 'Total Complaints',
        icon: AlertCircle,
        color: 'text-purple-400',
        bg: 'bg-purple-600/10 border border-purple-600/20',
    },
    {
        key: 'pending',
        label: 'Pending',
        icon: AlertCircle,
        color: 'text-yellow-400',
        bg: 'bg-yellow-500/10 border border-yellow-500/20',
    },
    {
        key: 'inProgress',
        label: 'In Progress',
        icon: Loader2,
        color: 'text-blue-400',
        bg: 'bg-blue-500/10 border border-blue-500/20',
    },
    {
        key: 'resolved',
        label: 'Resolved',
        icon: CheckCircle2,
        color: 'text-green-400',
        bg: 'bg-green-500/10 border border-green-500/20',
    },
];

export default function DashboardStats({ analytics, loading }) {
    if (loading) {
        return (
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                {[...Array(4)].map((_, i) => (
                    <div key={i} className="stat-card animate-pulse">
                        <div className="w-11 h-11 rounded-xl bg-border-dark" />
                        <div className="flex-1 space-y-2">
                            <div className="h-3 bg-border-dark rounded w-20" />
                            <div className="h-6 bg-border-dark rounded w-12" />
                        </div>
                    </div>
                ))}
            </div>
        );
    }

    return (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {stats.map(({ key, label, icon: Icon, color, bg }) => (
                <div key={key} className="stat-card hover:border-purple-600/30 transition-colors">
                    <div className={`w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0 ${bg}`}>
                        <Icon className={`w-5 h-5 ${color}`} />
                    </div>
                    <div>
                        <p className="text-text-muted text-xs">{label}</p>
                        <p className={`text-2xl font-bold mt-0.5 ${color}`}>
                            {analytics?.[key] ?? 0}
                        </p>
                    </div>
                </div>
            ))}

            {analytics?.avgResolutionTimeHours !== undefined && (
                <div className="stat-card col-span-2 lg:col-span-4 hover:border-purple-600/30 transition-colors">
                    <div className="w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0 bg-purple-600/10 border border-purple-600/20">
                        <Clock className="w-5 h-5 text-purple-400" />
                    </div>
                    <div>
                        <p className="text-text-muted text-xs">Avg. Resolution Time</p>
                        <p className="text-2xl font-bold text-purple-400 mt-0.5">
                            {analytics.avgResolutionTimeHours}h
                        </p>
                    </div>
                    {analytics.topCategories?.length > 0 && (
                        <div className="ml-auto flex flex-wrap gap-2">
                            <p className="w-full text-xs text-text-muted mb-1">Top Categories</p>
                            {analytics.topCategories.slice(0, 3).map((cat) => (
                                <span key={cat._id} className="px-2 py-1 bg-purple-600/10 border border-purple-600/20 rounded-lg text-xs text-purple-400">
                                    {cat._id} ({cat.count})
                                </span>
                            ))}
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}
