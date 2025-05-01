"use client"

import * as React from "react"
import * as SwitchPrimitives from "@radix-ui/react-switch"

import { cn } from "@/lib/utils"

const Switch = React.forwardRef<
  React.ElementRef<typeof SwitchPrimitives.Root>,
  React.ComponentPropsWithoutRef<typeof SwitchPrimitives.Root>
>(({ className, ...props }, ref) => (
  <SwitchPrimitives.Root
    className={cn(
      "peer inline-flex shrink-0 cursor-pointer items-center border-transparent transition-[var(--component-switch-root-transition)] focus-visible:outline-none disabled:cursor-not-allowed",
      "h-[var(--component-switch-root-height)] w-[var(--component-switch-root-width)]",
      "rounded-[var(--component-switch-root-border-radius)] border-[var(--component-switch-root-border-width)] border-[var(--component-switch-root-border-color)]",
      "focus-visible:ring-[var(--component-switch-root-focus-ring-width)] focus-visible:ring-[var(--component-switch-root-focus-ring-color)] focus-visible:ring-offset-[var(--component-switch-root-focus-ring-offset)] focus-visible:ring-offset-background",
      "disabled:opacity-[var(--component-switch-root-disabled-opacity)]",
      "data-[state=checked]:bg-[var(--component-switch-root-checked-background-color)]",
      "data-[state=unchecked]:bg-[var(--component-switch-root-unchecked-background-color)]",
      className
    )}
    {...props}
    ref={ref}
  >
    <SwitchPrimitives.Thumb
      className={cn(
        "pointer-events-none block ring-0 transition-[var(--component-switch-thumb-transition)]",
        "h-[var(--component-switch-thumb-height)] w-[var(--component-switch-thumb-width)]",
        "rounded-[var(--component-switch-thumb-border-radius)] bg-[var(--component-switch-thumb-background-color)] shadow-[var(--component-switch-thumb-box-shadow)]",
        "data-[state=checked]:translate-x-[var(--component-switch-thumb-checked-translate-x)]",
        "data-[state=unchecked]:translate-x-[var(--component-switch-thumb-unchecked-translate-x)]"
      )}
    />
  </SwitchPrimitives.Root>
))
Switch.displayName = SwitchPrimitives.Root.displayName

export { Switch }
