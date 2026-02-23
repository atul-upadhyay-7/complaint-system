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
        <Card className="group hover:border-purple-600/30 hover:shadow-purple-glow transition-all duration-300">
            <CardContent className="p-5">
                <div className="flex items-start justify-between gap-3 mb-3">
                    <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-foreground text-sm leading-snug truncate group-hover:text-purple-300 transition-colors">
                            {complaint.title}
                        </h3>
                        {isAdmin && complaint.student && (
                            <p className="text-xs text-muted-foreground mt-0.5">
                                {complaint.student.name} {complaint.student.rollNumber && `· ${complaint.student.rollNumber}`}
                            </p>
                        )}
                    </div>
                    <Badge variant={status.variant} className="flex items-center gap-1 shrink-0">
                        <StatusIcon className="w-3 h-3" />
                        {status.label}
                    </Badge>
                </div>

                <p className="text-sm text-muted-foreground line-clamp-2 mb-4 leading-relaxed">
                    {complaint.description}
                </p>

                <div className="flex items-center flex-wrap gap-2">
                    <span className={cn('flex items-center gap-1 text-xs px-2 py-0.5 rounded-full font-medium', priority.bg, priority.color)}>
                        <ArrowUp className="w-3 h-3" />
                        {complaint.priority}
                    </span>
                    <span className="flex items-center gap-1 text-xs text-muted-foreground bg-secondary px-2 py-0.5 rounded-full">
                        <Tag className="w-3 h-3" />
                        {complaint.category}
                    </span>
                    {complaint.location && (
                        <span className="flex items-center gap-1 text-xs text-muted-foreground">
                            <MapPin className="w-3 h-3" /> {complaint.location}
                        </span>
                    )}
                    <span className="flex items-center gap-1 text-xs text-muted-foreground ml-auto">
                        <Clock className="w-3 h-3" /> {timeAgo}
                    </span>
                </div>

                {isAdmin && (
                    <div className="mt-4 pt-4 border-t border-border/50 flex items-center justify-between">
                        <div className="text-xs text-muted-foreground">
                            {complaint.assignedTo
                                ? <span>Assigned to <span className="text-purple-400">{complaint.assignedTo}</span></span>
                                : <span className="text-amber-500/70">Unassigned</span>
                            }
                        </div>
                        <Button size="sm" variant="outline" onClick={() => onManage?.(complaint)}
                            className="h-7 text-xs border-purple-600/30 text-purple-400 hover:bg-purple-600/10 hover:border-purple-600/50">
                            Manage
                        </Button>
                    </div>
                )}
            </CardContent>
        </Card>
    );
}
