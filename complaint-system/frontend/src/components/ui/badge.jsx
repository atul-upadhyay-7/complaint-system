import * as React from "react"
import { cva } from "class-variance-authority"
import { cn } from "@/lib/utils"

const badgeVariants = cva(
    "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
    {
        variants: {
            variant: {
                default: "border-transparent bg-purple-600/20 text-purple-300 border-purple-600/30",
                secondary: "border-transparent bg-secondary text-secondary-foreground",
                destructive: "border-transparent bg-red-500/10 text-red-400 border-red-500/25",
                outline: "text-foreground border-border",
                pending: "bg-amber-500/10 text-amber-400 border-amber-500/25",
                progress: "bg-blue-500/10 text-blue-400 border-blue-500/25",
                resolved: "bg-emerald-500/10 text-emerald-400 border-emerald-500/25",
                rejected: "bg-red-500/10 text-red-400 border-red-500/25",
            },
        },
        defaultVariants: { variant: "default" },
    }
)

function Badge({ className, variant, ...props }) {
    return <div className={cn(badgeVariants({ variant }), className)} {...props} />
}

export { Badge, badgeVariants }
