import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const badgeVariants = cva(
  "inline-flex items-center rounded-[var(--component-badge-default-border-radius)] border-[var(--component-badge-default-border-width)] text-[var(--component-badge-default-font-size)] font-[var(--component-badge-default-font-weight)] px-[var(--component-badge-default-padding-x)] py-[var(--component-badge-default-padding-y)] transition-colors focus:outline-none focus:ring-[var(--component-badge-default-focus-ring-width)] focus:ring-[var(--component-badge-default-focus-ring-color)] focus:ring-offset-[var(--component-badge-default-focus-ring-offset)]",
  {
    variants: {
      variant: {
        default:
          "border-[var(--component-badge-default-border-color)] bg-[var(--component-badge-default-background-color)] text-[var(--component-badge-default-text-color)] hover:bg-[var(--component-badge-default-hover-background-color)]",
        secondary:
          "border-[var(--component-badge-secondary-border-color)] bg-[var(--component-badge-secondary-background-color)] text-[var(--component-badge-secondary-text-color)] hover:bg-[var(--component-badge-secondary-hover-background-color)]",
        destructive:
          "border-[var(--component-badge-destructive-border-color)] bg-[var(--component-badge-destructive-background-color)] text-[var(--component-badge-destructive-text-color)] hover:bg-[var(--component-badge-destructive-hover-background-color)]",
        outline: 
          "border-[var(--component-badge-outline-border-color)] bg-[var(--component-badge-outline-background-color)] text-[var(--component-badge-outline-text-color)]",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return (
    <div className={cn(badgeVariants({ variant }), className)} {...props} />
  )
}

export { Badge, badgeVariants }
