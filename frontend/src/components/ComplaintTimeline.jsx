import { CheckCircle2, Clock, Wrench, Send } from 'lucide-react';
import { cn } from '@/lib/utils';

const STEPS = [
    { label: 'Submitted', status: 'Pending', icon: Send, color: 'text-blue-400', glow: 'shadow-blue-500/50' },
    { label: 'Assigned', status: 'Assigned', icon: Clock, color: 'text-amber-400', glow: 'shadow-amber-500/50' },
    { label: 'In Progress', status: 'In Progress', icon: Wrench, color: 'text-purple-400', glow: 'shadow-purple-500/50' },
    { label: 'Resolved', status: 'Resolved', icon: CheckCircle2, color: 'text-emerald-400', glow: 'shadow-emerald-500/50' },
];

const STATUS_ORDER = ['Pending', 'Assigned', 'In Progress', 'Resolved'];

export default function ComplaintTimeline({ status }) {
    const currentIdx = STATUS_ORDER.indexOf(status);

    return (
        <div className="py-4 px-2">
            <div className="flex items-start justify-between relative">
                {/* Connecting line - base (inactive) */}
                <div className="absolute top-5 left-0 right-0 h-[2px] bg-slate-200 dark:bg-white/10 mx-8" />
                {/* Connecting line - progress fill */}
                <div
                    className="absolute top-5 left-0 h-[2px] bg-gradient-to-r from-blue-500 to-blue-400/50 mx-8 transition-all duration-1000 ease-out"
                    style={{ width: `calc(${(currentIdx / 3) * 100}% - 64px * ${currentIdx / 3})` }}
                />

                {STEPS.map((step, i) => {
                    const Icon = step.icon;
                    const isDone = i <= currentIdx;
                    const isActive = i === currentIdx;

                    return (
                        <div key={step.label} className="flex flex-col items-center gap-2 flex-1 relative">
                            <div className={cn(
                                'w-10 h-10 rounded-full flex items-center justify-center border-2 transition-all duration-500 z-10',
                                isDone
                                    ? `border-transparent bg-blue-500/20 ${isActive ? `shadow-lg ${step.glow} scale-110 border-blue-400/50 ring-2 ring-blue-500/30 ring-offset-2 ring-offset-transparent` : 'border-blue-200 dark:border-white/10'}`
                                    : 'border-slate-300 dark:border-white/10 bg-slate-100 dark:bg-white/5'
                            )}>
                                <Icon className={cn('w-4 h-4 transition-colors duration-500', isDone ? step.color : 'text-slate-400 dark:text-white/20')} />
                            </div>
                            {isActive && (
                                <div className="absolute top-0 w-10 h-10 rounded-full animate-ping bg-blue-500/20" />
                            )}
                            <p className={cn('text-[10px] sm:text-xs font-medium text-center transition-colors duration-500 leading-tight', isDone ? 'text-foreground' : 'text-muted-foreground/40')}>
                                {step.label}
                            </p>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
