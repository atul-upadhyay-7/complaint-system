import * as React from "react"
import { cva } from "class-variance-authority"
import { cn } from "@/lib/utils"

const badgeVariants = cva(
    "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
    {
        variants: {
            variant: {
                default: "border-transparent bg-slate-100 text-slate-900 dark:bg-purple-600/20 dark:text-purple-300 dark:border-purple-600/30",
                secondary: "border-transparent bg-slate-100 text-slate-800 dark:bg-secondary dark:text-secondary-foreground",
                destructive: "border-transparent bg-red-100 text-red-700 dark:bg-red-500/10 dark:text-red-400 dark:border-red-500/25",
                outline: "text-foreground border-border",
                pending: "bg-amber-100 text-amber-700 border-amber-200 dark:bg-amber-500/10 dark:text-amber-400 dark:border-amber-500/25",
                progress: "bg-blue-100 text-blue-700 border-blue-200 dark:bg-blue-500/10 dark:text-blue-400 dark:border-blue-500/25",
                resolved: "bg-emerald-100 text-emerald-700 border-emerald-200 dark:bg-emerald-500/10 dark:text-emerald-400 dark:border-emerald-500/25",
                rejected: "bg-red-100 text-red-700 border-red-200 dark:bg-red-500/10 dark:text-red-400 dark:border-red-500/25",
            },
        },
        defaultVariants: { variant: "default" },
    }
)

function Badge({ className, variant, ...props }) {
    return <div className={cn(badgeVariants({ variant }), className)} {...props} />
}

export { Badge, badgeVariants }
