// Code Contracts: PENDING
// @token-status: COMPLETED (Implicit via Tailwind)
"use client"

import * as React from "react"
import * as SeparatorPrimitive from "@radix-ui/react-separator"

import { cn } from "@/lib/utils"

const Separator = React.forwardRef<
  React.ElementRef<typeof SeparatorPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof SeparatorPrimitive.Root>
>(
  (
    { className, orientation = "horizontal", decorative = true, ...props },
    ref
  ) => (
    <SeparatorPrimitive.Root
      ref={ref}
      decorative={decorative}
      orientation={orientation}
      className={cn(
        "shrink-0 bg-[var(--component-separator-color)]",
        orientation === "horizontal" 
          ? "h-[var(--component-separator-horizontal-height)] w-[var(--component-separator-horizontal-width)]" 
          : "h-[var(--component-separator-vertical-height)] w-[var(--component-separator-vertical-width)]",
        className
      )}
      {...props}
    />
  )
)
Separator.displayName = SeparatorPrimitive.Root.displayName

export { Separator }
