import { formatDistanceToNow } from 'date-fns';
import { Clock, MapPin, ArrowUp, AlertCircle, CheckCircle2, Loader, Tag } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

const statusConfig = {
    'Pending': { variant: 'pending', icon: AlertCircle, label: 'Pending' },
    'In Progress': { variant: 'progress', icon: Loader, label: 'In Progress' },
    'Resolved': { variant: 'resolved', icon: CheckCircle2, label: 'Resolved' },
    'Rejected': { variant: 'rejected', icon: AlertCircle, label: 'Rejected' },
};

const priorityConfig = {
    'Low': { color: 'text-slate-400', bg: 'bg-slate-500/10' },
    'Medium': { color: 'text-amber-400', bg: 'bg-amber-500/10' },
    'High': { color: 'text-red-400', bg: 'bg-red-500/10' },
};

export default function ComplaintCard({ complaint, isAdmin = false, onManage }) {
    const status = statusConfig[complaint.status] || statusConfig['Pending'];
    const priority = priorityConfig[complaint.priority] || priorityConfig['Medium'];
    const StatusIcon = status.icon;
    const timeAgo = formatDistanceToNow(new Date(complaint.createdAt), { addSuffix: true });

    return (
        <Card className="group border-border/40 hover:border-purple-500/50 hover:shadow-purple-glow bg-card/60 backdrop-blur-sm transition-all duration-300 hover:-translate-y-1.5 overflow-hidden relative">
            <div className="absolute inset-0 bg-gradient-to-tr from-purple-500/0 via-purple-500/0 to-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
            <CardContent className="p-5 sm:p-6">
                <div className="flex items-start justify-between gap-3 mb-4">
                    <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-foreground text-sm sm:text-base leading-snug truncate group-hover:text-purple-300 transition-colors">
                            {complaint.title}
                        </h3>
                        {isAdmin && complaint.student && (
                            <p className="text-xs sm:text-sm text-muted-foreground mt-1">
                                <span className="text-foreground/80 font-medium">{complaint.student.name}</span>
                                {complaint.student.rollNumber && <span className="opacity-70"> · {complaint.student.rollNumber}</span>}
                            </p>
                        )}
                    </div>
                    <Badge variant={status.variant} className="flex items-center gap-1.5 shrink-0 px-2.5 py-1 shadow-sm transition-transform group-hover:scale-105">
                        <StatusIcon className="w-3.5 h-3.5" />
                        {status.label}
                    </Badge>
                </div>

                <p className="text-sm text-muted-foreground line-clamp-2 sm:line-clamp-3 mb-5 leading-relaxed">
                    {complaint.description}
                </p>

                <div className="flex items-center flex-wrap gap-2.5">
                    <span className={cn('flex items-center gap-1.5 text-xs px-2.5 py-1 rounded-full font-medium shadow-sm transition-colors group-hover:bg-opacity-20', priority.bg, priority.color)}>
                        <ArrowUp className="w-3.5 h-3.5" />
                        {complaint.priority}
                    </span>
                    <span className="flex items-center gap-1.5 text-xs font-medium text-foreground/80 bg-secondary px-2.5 py-1 rounded-full border border-border/50">
                        <Tag className="w-3.5 h-3.5 text-muted-foreground" />
                        {complaint.category}
                    </span>
                    {complaint.location && (
                        <span className="flex items-center gap-1.5 text-xs text-muted-foreground bg-secondary/30 px-2 py-1 rounded-md">
                            <MapPin className="w-3.5 h-3.5" /> <span className="truncate max-w-[120px]">{complaint.location}</span>
                        </span>
                    )}
                    <span className="flex items-center gap-1.5 text-xs font-medium text-muted-foreground ml-auto bg-card px-2 py-1 rounded-md border border-border/40 shrink-0">
                        <Clock className="w-3.5 h-3.5" /> {timeAgo}
                    </span>
                </div>

                {isAdmin && (
                    <div className="mt-5 pt-4 border-t border-border/50 flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-secondary/10 -mx-5 -mb-5 px-5 pb-5 rounded-b-xl">
                        <div className="text-xs font-medium text-muted-foreground flex items-center gap-1.5">
                            {complaint.assignedTo
                                ? <>Assigned to <span className="text-purple-400 bg-purple-500/10 px-2 py-0.5 rounded-md border border-purple-500/20">{complaint.assignedTo}</span></>
                                : <span className="text-amber-500/90 flex items-center gap-1"><AlertCircle className="w-3.5 h-3.5" /> Unassigned</span>
                            }
                        </div>
                        <Button size="sm" variant="outline" onClick={() => onManage?.(complaint)}
                            className="h-8 text-xs font-semibold sm:w-auto w-full border-purple-600/30 text-purple-400 hover:bg-purple-600/10 hover:border-purple-600/50 hover:text-purple-300 transition-all shadow-sm">
                            Manage Complaint
                        </Button>
                    </div>
                )}
            </CardContent>
        </Card>
    );
}
