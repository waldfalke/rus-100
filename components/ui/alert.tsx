import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const alertVariants = cva(
  "relative w-full rounded-[var(--component-alert-root-border-radius)] border-[var(--component-alert-root-border-width)] p-[var(--component-alert-root-padding)] [&>svg~*]:pl-[var(--component-alert-root-content-padding-left)] [&>svg+div]:translate-y-[-3px] [&>svg]:absolute [&>svg]:left-[var(--component-alert-root-icon-left)] [&>svg]:top-[var(--component-alert-root-icon-top)]",
  {
    variants: {
      variant: {
        default: 
          "bg-[var(--component-alert-root-default-background-color)] text-[var(--component-alert-root-default-text-color)] border-[var(--component-alert-root-default-border-color)] [&>svg]:text-[var(--component-alert-root-icon-color)]",
        destructive:
          "text-[var(--component-alert-root-destructive-text-color)] border-[var(--component-alert-root-destructive-border-color)] [&>svg]:text-[var(--component-alert-root-destructive-icon-color)]",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

const Alert = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & VariantProps<typeof alertVariants>
>(({ className, variant, ...props }, ref) => (
  <div
    ref={ref}
    role="alert"
    className={cn(alertVariants({ variant }), className)}
    {...props}
  />
))
Alert.displayName = "Alert"

const AlertTitle = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLHeadingElement>
>(({ className, ...props }, ref) => (
  <h5
    ref={ref}
    className={cn(
      "mb-[var(--component-alert-title-margin-bottom)] font-[var(--component-alert-title-font-weight)] leading-[var(--component-alert-title-line-height)] tracking-[var(--component-alert-title-letter-spacing)]",
       className
      )}
    {...props}
  />
))
AlertTitle.displayName = "AlertTitle"

const AlertDescription = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("text-[var(--component-alert-description-font-size)] [&_p]:leading-[var(--component-alert-description-line-height)]", className)}
    {...props}
  />
))
AlertDescription.displayName = "AlertDescription"

export { Alert, AlertTitle, AlertDescription }
