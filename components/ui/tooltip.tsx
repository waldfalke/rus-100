"use client"

import * as React from "react"
import * as TooltipPrimitive from "@radix-ui/react-tooltip"

import { cn } from "@/lib/utils"

const TooltipProvider = TooltipPrimitive.Provider

const Tooltip = TooltipPrimitive.Root

const TooltipTrigger = TooltipPrimitive.Trigger

const TooltipContent = React.forwardRef<
  React.ElementRef<typeof TooltipPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof TooltipPrimitive.Content>
>(({ className, sideOffset = 4, ...props }, ref) => (
  <TooltipPrimitive.Content
    ref={ref}
    sideOffset={sideOffset}
    className={cn(
      "z-[var(--component-tooltip-content-z-index)] overflow-hidden",
      "rounded-[var(--component-tooltip-content-border-radius)]",
      "border border-[var(--component-tooltip-content-border-color)] border-[var(--component-tooltip-content-border-width)]",
      "bg-[var(--component-tooltip-content-background-color)]",
      "text-[var(--component-tooltip-content-text-color)]",
      "text-[var(--component-tooltip-content-font-size)]",
      "px-[var(--component-tooltip-content-padding-x)] py-[var(--component-tooltip-content-padding-y)]",
      "shadow-[var(--component-tooltip-content-box-shadow)]",
      "animate-in var(--component-tooltip-content-animation-in-fade-in) var(--component-tooltip-content-animation-in-zoom-in)",
      "data-[state=closed]:animate-out data-[state=closed]:var(--component-tooltip-content-animation-out-fade-out) data-[state=closed]:var(--component-tooltip-content-animation-out-zoom-out)",
      "data-[side=bottom]:var(--component-tooltip-content-animation-slide-bottom)",
      "data-[side=left]:var(--component-tooltip-content-animation-slide-left)",
      "data-[side=right]:var(--component-tooltip-content-animation-slide-right)",
      "data-[side=top]:var(--component-tooltip-content-animation-slide-top)",
      className
    )}
    {...props}
  />
))
TooltipContent.displayName = TooltipPrimitive.Content.displayName

export { Tooltip, TooltipTrigger, TooltipContent, TooltipProvider }
