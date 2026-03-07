import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva } from "class-variance-authority"
import { cn } from "@/lib/utils"

const buttonVariants = cva(
    "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-lg text-sm font-semibold transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
    {
        variants: {
            variant: {
                default: "bg-purple-600 text-white hover:bg-purple-500 shadow-sm hover:shadow-purple-glow",
                destructive: "bg-destructive/10 text-red-600 dark:text-red-400 border border-destructive/20 dark:border-destructive/30 hover:bg-destructive/20",
                outline: "border border-slate-200 dark:border-border bg-transparent hover:bg-slate-100 dark:hover:bg-secondary text-slate-900 dark:text-foreground hover:text-slate-900 dark:hover:text-foreground",
                secondary: "bg-slate-100 dark:bg-secondary text-slate-900 dark:text-secondary-foreground hover:bg-slate-200 dark:hover:bg-secondary/80",
                ghost: "hover:bg-slate-100 dark:hover:bg-accent text-slate-700 dark:text-foreground hover:text-slate-900 dark:hover:text-accent-foreground",
                link: "text-purple-600 dark:text-purple-400 underline-offset-4 hover:underline",
            },
            size: {
                default: "h-10 px-5 py-2",
                sm: "h-8 rounded-md px-3 text-xs",
                lg: "h-12 rounded-xl px-8 text-base",
                icon: "h-10 w-10",
            },
        },
        defaultVariants: {
            variant: "default",
            size: "default",
        },
    }
)

const Button = React.forwardRef(({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button"
    return (
        <Comp className={cn(buttonVariants({ variant, size, className }))} ref={ref} {...props} />
    )
})
Button.displayName = "Button"

export { Button, buttonVariants }
