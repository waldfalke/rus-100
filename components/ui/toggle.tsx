"use client"

import * as React from "react"
import * as TogglePrimitive from "@radix-ui/react-toggle"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const toggleVariants = cva(
  "inline-flex items-center justify-center rounded-[var(--component-toggle-default-border-radius)] text-[var(--component-toggle-default-font-size)] font-[var(--component-toggle-default-font-weight)] ring-offset-background transition-colors disabled:pointer-events-none disabled:opacity-[var(--component-toggle-default-disabled-opacity)] gap-[var(--component-toggle-default-gap)] [&_svg]:pointer-events-none [&_svg]:size-[var(--component-toggle-icon-size)] [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        default: "bg-[var(--component-toggle-default-background-color)] text-[var(--component-toggle-default-text-color)] hover:bg-[var(--component-toggle-default-hover-background-color)] hover:text-[var(--component-toggle-default-hover-text-color)] focus-visible:outline-none focus-visible:ring-[var(--component-toggle-default-focus-ring-width)] focus-visible:ring-[var(--component-toggle-default-focus-ring-color)] focus-visible:ring-offset-[var(--component-toggle-default-focus-ring-offset)] data-[state=on]:bg-[var(--component-toggle-default-on-background-color)] data-[state=on]:text-[var(--component-toggle-default-on-text-color)]",
        outline:
          "bg-[var(--component-toggle-outline-background-color)] border border-[var(--component-toggle-outline-border-color)] border-[var(--component-toggle-outline-border-width)] hover:bg-[var(--component-toggle-outline-hover-background-color)] hover:text-[var(--component-toggle-outline-hover-text-color)] focus-visible:outline-none focus-visible:ring-[var(--component-toggle-default-focus-ring-width)] focus-visible:ring-[var(--component-toggle-default-focus-ring-color)] focus-visible:ring-offset-[var(--component-toggle-default-focus-ring-offset)] data-[state=on]:bg-[var(--component-toggle-default-on-background-color)] data-[state=on]:text-[var(--component-toggle-default-on-text-color)]",
      },
      size: {
        default: "h-[var(--component-toggle-sizes-default-height)] min-w-[var(--component-toggle-sizes-default-min-width)] px-[var(--component-toggle-sizes-default-padding-x)] py-[var(--component-toggle-default-padding-y)]",
        sm: "h-[var(--component-toggle-sizes-sm-height)] min-w-[var(--component-toggle-sizes-sm-min-width)] px-[var(--component-toggle-sizes-sm-padding-x)] py-[var(--component-toggle-default-padding-y)]",
        lg: "h-[var(--component-toggle-sizes-lg-height)] min-w-[var(--component-toggle-sizes-lg-min-width)] px-[var(--component-toggle-sizes-lg-padding-x)] py-[var(--component-toggle-default-padding-y)]",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

const Toggle = React.forwardRef<
  React.ElementRef<typeof TogglePrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof TogglePrimitive.Root> &
    VariantProps<typeof toggleVariants>
>(({ className, variant, size, ...props }, ref) => (
  <TogglePrimitive.Root
    ref={ref}
    className={cn(toggleVariants({ variant, size, className }))}
    {...props}
  />
))

Toggle.displayName = TogglePrimitive.Root.displayName

export { Toggle, toggleVariants }
