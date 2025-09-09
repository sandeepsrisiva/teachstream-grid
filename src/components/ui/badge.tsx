import * as React from "react"
import { cn } from "@/lib/utils"

interface BadgeProps {
  className?: string
  variant?: "default" | "secondary" | "destructive" | "outline"
  children?: React.ReactNode
}

function Badge({ className, variant = "default", children }: BadgeProps) {
  const variantClasses = {
    default: "border-transparent bg-primary text-primary-foreground hover:bg-primary/80",
    secondary: "border-transparent bg-secondary text-secondary-foreground hover:bg-secondary/80", 
    destructive: "border-transparent bg-destructive text-destructive-foreground hover:bg-destructive/80",
    outline: "text-foreground"
  }
  
  return (
    <div 
      className={cn(
        "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
        variantClasses[variant],
        className
      )}
    >
      {children}
    </div>
  )
}

export { Badge }