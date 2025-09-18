// Code Contracts: PENDING_VALIDATION
// @token-status: COMPLETED (Implicit via Tailwind/Radix)
"use client"

import * as React from "react"
import * as TabsPrimitive from "@radix-ui/react-tabs"

import { cn } from "@/lib/utils"

/**
 * @component Tabs
 * @description Root container for a set of tabs. Based on Radix UI Tabs Primitive.
 * Controls the state of the tabs.
 * @see https://www.radix-ui.com/primitives/docs/components/tabs#root
 * @see project-docs/contracts/TestGenerator-UX-TabPanel-Contract.md
 * @see project-docs/contracts/TestGenerator-UX-Tabs-Contract.md
 * @status IN PROGRESS - Implementing embedded contracts.
 * @property {string} [defaultValue] - The value of the tab that should be active initially.
 * @property {string} [value] - The controlled value of the currently active tab.
 * @property {(value: string) => void} [onValueChange] - Event handler called when the active tab changes.
 * @property {'horizontal' | 'vertical'} [orientation] - The orientation of the tabs.
 * @property {'automatic' | 'manual'} [activationMode] - Determines how tabs are activated.
 */
const Tabs = TabsPrimitive.Root

/**
 * @component TabsList
 * @description Contains the trigger buttons for the tabs. Based on Radix UI Tabs Primitive.
 * Should contain multiple `TabsTrigger` components.
 * @see https://www.radix-ui.com/primitives/docs/components/tabs#list
 * @status IN PROGRESS - Implementing embedded contracts.
 * @property {boolean} [loop] - When `true`, keyboard navigation will loop from last tab to first, and vice versa.
 */
const TabsList = React.forwardRef<
  React.ElementRef<typeof TabsPrimitive.List>,
  React.ComponentPropsWithoutRef<typeof TabsPrimitive.List>
>(({ className, ...props }, ref) => (
  <TabsPrimitive.List
    ref={ref}
    className={cn(
      // Base visual container with consistent outline - height adapts to content
      "inline-flex items-center justify-center rounded-lg border border-border bg-background text-muted-foreground p-1.5 gap-1",
      className
    )}
    {...props}
  />
))
TabsList.displayName = TabsPrimitive.List.displayName

/**
 * @component TabsTrigger
 * @description The button that activates its associated content panel when clicked or activated by keyboard. Based on Radix UI Tabs Primitive.
 * Must be rendered within a `TabsList`.
 * @see https://www.radix-ui.com/primitives/docs/components/tabs#trigger
 * @status IN PROGRESS - Implementing embedded contracts.
 * @property {string} value - A unique value that associates the trigger with a content panel.
 * @property {boolean} [disabled] - Prevents user interaction with the trigger.
 */
const TabsTrigger = React.forwardRef<
  React.ElementRef<typeof TabsPrimitive.Trigger>,
  React.ComponentPropsWithoutRef<typeof TabsPrimitive.Trigger>
>(({ className, ...props }, ref) => {
  return (
    <TabsPrimitive.Trigger
      ref={ref}
      className={cn(
        "inline-flex items-center justify-center whitespace-nowrap rounded-full px-4 py-1.5 text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
        "data-[state=active]:bg-tabs-active data-[state=active]:text-tabs-active-text",
        className
      )}
      {...props}
    />
  )
})
TabsTrigger.displayName = TabsPrimitive.Trigger.displayName

/**
 * @component TabsContent
 * @description Contains the content associated with a specific tab trigger. Based on Radix UI Tabs Primitive.
 * Must be rendered within the `Tabs` root component. Only the content associated with the active trigger is displayed.
 * @see https://www.radix-ui.com/primitives/docs/components/tabs#content
 * @status IN PROGRESS - Implementing embedded contracts.
 * @property {string} value - A unique value that associates the content panel with a trigger.
 */
const TabsContent = React.forwardRef<
  React.ElementRef<typeof TabsPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof TabsPrimitive.Content>
>(({ className, ...props }, ref) => (
  <TabsPrimitive.Content
    ref={ref}
    className={cn(
      "mt-2 ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
      className
    )}
    {...props}
  />
))
TabsContent.displayName = TabsPrimitive.Content.displayName

export { Tabs, TabsList, TabsTrigger, TabsContent }
