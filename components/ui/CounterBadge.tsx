// Code Contracts: COMPLETED
// @token-status: COMPLETED
import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { Badge, badgeVariants } from "@/components/ui/badge"
import { cn } from "@/lib/utils"

interface CounterBadgeProps extends React.HTMLAttributes<HTMLDivElement>,
  VariantProps<typeof badgeVariants> {
  label: React.ReactNode;
  count?: number;
}

export function CounterBadge({ className, variant = "outline", label, count, ...props }: CounterBadgeProps) {
  return (
    <Badge
      variant={variant}
      className={cn(
        "inline-flex items-center gap-1.5",
        className
      )}
      {...props}
    >
      <span className="font-normal">{label}</span>
      {typeof count === "number" && (
        <span className="font-semibold">{count}</span>
      )}
    </Badge>
  )
} 