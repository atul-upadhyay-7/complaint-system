import { ShieldAlert, Eye } from 'lucide-react';

// Shows the AI safety net's flags for a complaint. Staff only see why a complaint
// was flagged (tooltip); students never see these.
export default function AiReviewBadges({ complaint }) {
    if (!complaint?.aiSafetyFlag && !complaint?.aiNeedsReview) return null;
    const reasons = (complaint.aiReviewReasons || []).join('; ');
    return (
        <>
            {complaint.aiSafetyFlag && (
                <span
                    title={reasons || 'Safety rule matched'}
                    className="inline-flex items-center gap-1 text-[11px] font-semibold px-2 py-0.5 rounded-md text-rose-700 dark:text-rose-300 bg-rose-100 dark:bg-rose-500/10 border border-rose-200 dark:border-rose-500/20"
                >
                    <ShieldAlert className="w-3 h-3" aria-hidden="true" /> Safety
                </span>
            )}
            {complaint.aiNeedsReview && !complaint.aiSafetyFlag && (
                <span
                    title={reasons || 'Triage needs a human check'}
                    className="inline-flex items-center gap-1 text-[11px] font-semibold px-2 py-0.5 rounded-md text-amber-700 dark:text-amber-300 bg-amber-100 dark:bg-amber-500/10 border border-amber-200 dark:border-amber-500/20"
                >
                    <Eye className="w-3 h-3" aria-hidden="true" /> Needs review
                </span>
            )}
        </>
    );
}
