import { cn } from '@/lib/utils';

function SkeletonPulse({ className }) {
    return (
        <div className={cn('relative overflow-hidden rounded-lg bg-slate-200/60 dark:bg-white/5', className)}>
            <div className="absolute inset-0 -translate-x-full animate-shimmer bg-gradient-to-r from-transparent via-slate-100/50 dark:via-white/5 to-transparent" />
        </div>
    );
}

export function SkeletonCard({ lines = 3, showImage = false }) {
    return (
        <div className="glass-card rounded-2xl p-5 space-y-4 border border-slate-200 dark:border-white/5">
            <div className="flex items-start justify-between gap-3">
                <div className="flex-1 space-y-2">
                    <SkeletonPulse className="h-4 w-3/4" />
                    <SkeletonPulse className="h-3 w-1/2" />
                </div>
                <SkeletonPulse className="h-6 w-20 rounded-full" />
            </div>
            {showImage && <SkeletonPulse className="h-32 w-full rounded-xl" />}
            <div className="space-y-2">
                {Array.from({ length: lines }).map((_, i) => (
                    <SkeletonPulse key={i} className={cn('h-3', i === lines - 1 ? 'w-2/3' : 'w-full')} />
                ))}
            </div>
            <div className="flex gap-2">
                <SkeletonPulse className="h-6 w-16 rounded-full" />
                <SkeletonPulse className="h-6 w-20 rounded-full" />
                <SkeletonPulse className="h-6 w-14 rounded-full ml-auto" />
            </div>
        </div>
    );
}

export function SkeletonStatCard() {
    return (
        <div className="glass-card rounded-2xl p-5 space-y-3 border border-slate-200 dark:border-white/5">
            <div className="flex items-center justify-between">
                <SkeletonPulse className="h-3 w-2/3" />
                <SkeletonPulse className="h-10 w-10 rounded-xl" />
            </div>
            <SkeletonPulse className="h-8 w-16" />
            <SkeletonPulse className="h-3 w-1/2" />
        </div>
    );
}

export function SkeletonChart() {
    return (
        <div className="glass-card rounded-2xl p-5 border border-slate-200 dark:border-white/5 space-y-4">
            <SkeletonPulse className="h-4 w-1/3" />
            <SkeletonPulse className="h-48 w-full rounded-xl" />
        </div>
    );
}
