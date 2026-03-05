import { formatDistanceToNow } from 'date-fns';
import { Clock, MapPin, ArrowUp, AlertCircle, CheckCircle2, Loader, Tag, Image, ChevronDown, ChevronUp } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { useState } from 'react';
import ComplaintTimeline from './ComplaintTimeline';

const statusConfig = {
    'Pending': { variant: 'pending', icon: AlertCircle, label: 'Pending' },
    'Assigned': { variant: 'progress', icon: Loader, label: 'Assigned' },
    'In Progress': { variant: 'progress', icon: Loader, label: 'In Progress' },
    'Resolved': { variant: 'resolved', icon: CheckCircle2, label: 'Resolved' },
    'Rejected': { variant: 'rejected', icon: AlertCircle, label: 'Rejected' },
};

const priorityConfig = {
    'Low': { color: 'text-slate-400', bg: 'bg-slate-500/10' },
    'Medium': { color: 'text-amber-400', bg: 'bg-amber-500/10' },
    'High': { color: 'text-red-400', bg: 'bg-red-500/10' },
    'Critical': { color: 'text-rose-300', bg: 'bg-rose-500/15' },
};

export default function ComplaintCard({ complaint, isAdmin = false, onManage }) {
    const [expanded, setExpanded] = useState(false);
    const status = statusConfig[complaint.status] || statusConfig['Pending'];
    const priority = priorityConfig[complaint.priority] || priorityConfig['Medium'];
    const StatusIcon = status.icon;
    const timeAgo = formatDistanceToNow(new Date(complaint.createdAt), { addSuffix: true });
    const hasImage = complaint.attachments && complaint.attachments.length > 0;

    return (
        <Card className={cn(
            'group border border-blue-900/30 glass-card card-hover transition-all duration-300 overflow-hidden relative',
            'hover:border-blue-500/40'
        )}>
            {/* Blue glow on hover overlay */}
            <div className="absolute inset-0 bg-gradient-to-tr from-blue-500/0 via-blue-500/0 to-blue-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none rounded-[inherit]" />

            <CardContent className="p-5 sm:p-6">
                {/* Header */}
                <div className="flex items-start justify-between gap-3 mb-3">
                    <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-foreground text-sm sm:text-base leading-snug truncate group-hover:text-blue-300 transition-colors">
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

                {/* Complaint photo thumbnail */}
                {hasImage && (
                    <div className="mb-3 rounded-xl overflow-hidden border border-blue-500/15 relative group/img">
                        <img
                            src={complaint.attachments[0]}
                            alt="Complaint attachment"
                            className="w-full h-36 object-cover transition-transform duration-500 group-hover/img:scale-105"
                            onError={(e) => { e.target.style.display = 'none'; }}
                        />
                        <div className="absolute bottom-2 right-2 glass-card px-2 py-1 rounded-lg flex items-center gap-1 text-[10px] text-blue-300 border border-blue-500/20">
                            <Image className="w-3 h-3" />
                            Photo attached
                        </div>
                    </div>
                )}

                {/* Description */}
                <p className="text-sm text-muted-foreground line-clamp-2 sm:line-clamp-3 mb-4 leading-relaxed">
                    {complaint.description}
                </p>

                {/* Tags row */}
                <div className="flex items-center flex-wrap gap-2">
                    <span className={cn('flex items-center gap-1.5 text-xs px-2.5 py-1 rounded-full font-medium', priority.bg, priority.color)}>
                        <ArrowUp className="w-3.5 h-3.5" />
                        {complaint.priority}
                    </span>
                    <span className="flex items-center gap-1.5 text-xs font-medium text-foreground/80 bg-secondary px-2.5 py-1 rounded-full border border-border/50">
                        <Tag className="w-3.5 h-3.5 text-muted-foreground" />
                        {complaint.category}
                    </span>
                    {complaint.location && (
                        <span className="flex items-center gap-1.5 text-xs text-muted-foreground bg-secondary/30 px-2 py-1 rounded-md">
                            <MapPin className="w-3.5 h-3.5" />
                            <span className="truncate max-w-[100px]">{complaint.location}</span>
                        </span>
                    )}
                    <span className="flex items-center gap-1.5 text-xs font-medium text-muted-foreground ml-auto glass-card px-2 py-1 rounded-md border border-blue-500/10 shrink-0">
                        <Clock className="w-3.5 h-3.5" /> {timeAgo}
                    </span>
                </div>

                {/* Progress Timeline toggle (student view) */}
                {!isAdmin && (
                    <button
                        onClick={() => setExpanded(e => !e)}
                        className="mt-4 w-full flex items-center justify-between text-xs text-muted-foreground hover:text-blue-400 transition-colors py-1"
                    >
                        <span className="font-medium">Progress Timeline</span>
                        {expanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                    </button>
                )}
                {!isAdmin && expanded && (
                    <div className="mt-1 pt-3 border-t border-blue-900/30 animate-fade-in">
                        <ComplaintTimeline status={complaint.status} />
                    </div>
                )}

                {/* Admin manage section */}
                {isAdmin && (
                    <div className="mt-4 pt-4 border-t border-blue-900/30 flex flex-col sm:flex-row sm:items-center justify-between gap-3 -mx-5 -mb-5 px-5 pb-5 bg-blue-950/10 rounded-b-[inherit]">
                        <div className="text-xs font-medium text-muted-foreground flex items-center gap-1.5">
                            {complaint.assignedTo
                                ? <><span>Assigned to</span><span className="text-blue-400 bg-blue-500/10 px-2 py-0.5 rounded-md border border-blue-500/20">{complaint.assignedToName || complaint.assignedTo}</span></>
                                : <span className="text-amber-500/90 flex items-center gap-1"><AlertCircle className="w-3.5 h-3.5" /> Unassigned</span>
                            }
                        </div>
                        <Button size="sm" variant="outline" onClick={() => onManage?.(complaint)}
                            className="h-8 text-xs font-semibold sm:w-auto w-full border-blue-600/30 text-blue-400 hover:bg-blue-600/10 hover:border-blue-600/50 hover:text-blue-300 transition-all shadow-sm">
                            Manage Complaint
                        </Button>
                    </div>
                )}
            </CardContent>
        </Card>
    );
}
