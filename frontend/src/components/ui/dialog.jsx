import * as React from "react"
import * as DialogPrimitive from "@radix-ui/react-dialog"
import { X } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import { cn } from "@/lib/utils"

const OpenContext = React.createContext(false)

// Controlled/uncontrolled wrapper so DialogContent can animate its exit with AnimatePresence.
const Dialog = ({ open, defaultOpen, onOpenChange, children, ...props }) => {
    const [internal, setInternal] = React.useState(defaultOpen ?? false)
    const controlled = open !== undefined
    const current = controlled ? open : internal
    const handleChange = (v) => { if (!controlled) setInternal(v); onOpenChange?.(v) }
    return (
        <OpenContext.Provider value={current}>
            <DialogPrimitive.Root open={current} onOpenChange={handleChange} {...props}>{children}</DialogPrimitive.Root>
        </OpenContext.Provider>
    )
}
const DialogTrigger = DialogPrimitive.Trigger
const DialogPortal = DialogPrimitive.Portal
const DialogClose = DialogPrimitive.Close

const DialogOverlay = React.forwardRef(({ className, ...props }, ref) => (
    <DialogPrimitive.Overlay ref={ref} forceMount asChild {...props}>
        <motion.div
            className={cn("fixed inset-0 z-50 bg-black/70 backdrop-blur-sm", className)}
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            transition={{ duration: 0.18 }}
        />
    </DialogPrimitive.Overlay>
))
DialogOverlay.displayName = DialogPrimitive.Overlay.displayName

const DialogContent = React.forwardRef(({ className, children, ...props }, ref) => {
    const open = React.useContext(OpenContext)
    return (
        <AnimatePresence>
            {open && (
                <DialogPortal forceMount>
                    <DialogOverlay />
                    <DialogPrimitive.Content ref={ref} forceMount asChild {...props}>
                        <motion.div
                            className={cn(
                                "fixed inset-0 m-auto h-fit z-50 grid w-[calc(100%-2rem)] max-h-[calc(100dvh-2rem)] overflow-y-auto max-w-lg gap-4 border border-border bg-card p-6 shadow-glass rounded-2xl",
                                className
                            )}
                            initial={{ opacity: 0, scale: 0.96, y: 10 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.97, y: 6 }}
                            transition={{ duration: 0.2, ease: [0.22, 1, 0.36, 1] }}
                        >
                            {children}
                            <DialogPrimitive.Close className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none">
                                <X className="h-4 w-4" />
                                <span className="sr-only">Close</span>
                            </DialogPrimitive.Close>
                        </motion.div>
                    </DialogPrimitive.Content>
                </DialogPortal>
            )}
        </AnimatePresence>
    )
})
DialogContent.displayName = DialogPrimitive.Content.displayName

const DialogHeader = ({ className, ...props }) => (
    <div className={cn("flex flex-col space-y-1.5", className)} {...props} />
)
DialogHeader.displayName = "DialogHeader"

const DialogFooter = ({ className, ...props }) => (
    <div className={cn("flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2", className)} {...props} />
)
DialogFooter.displayName = "DialogFooter"

const DialogTitle = React.forwardRef(({ className, ...props }, ref) => (
    <DialogPrimitive.Title ref={ref} className={cn("text-lg font-bold leading-none tracking-tight", className)} {...props} />
))
DialogTitle.displayName = DialogPrimitive.Title.displayName

const DialogDescription = React.forwardRef(({ className, ...props }, ref) => (
    <DialogPrimitive.Description ref={ref} className={cn("text-sm text-muted-foreground", className)} {...props} />
))
DialogDescription.displayName = DialogPrimitive.Description.displayName

export { Dialog, DialogPortal, DialogOverlay, DialogClose, DialogTrigger, DialogContent, DialogHeader, DialogFooter, DialogTitle, DialogDescription }
