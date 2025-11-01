"use client"

import * as React from "react"
import * as ToastPrimitives from "@radix-ui/react-toast"
import { cva, type VariantProps } from "class-variance-authority"
import { X } from "lucide-react"

import { cn } from "@/lib/utils"

// Code Contracts: PENDING
// @token-status: COMPLETED (Fully tokenized using --component-toast-* CSS variables)

const ToastProvider = ToastPrimitives.Provider

const ToastViewport = React.forwardRef<
  React.ElementRef<typeof ToastPrimitives.Viewport>,
  React.ComponentPropsWithoutRef<typeof ToastPrimitives.Viewport>
>(({ className, ...props }, ref) => (
  <ToastPrimitives.Viewport
    ref={ref}
    className={cn(
      "fixed top-0 z-[var(--component-toast-viewport-z-index)] flex max-h-screen w-full flex-col-reverse p-[var(--component-toast-viewport-padding)] sm:bottom-0 sm:right-0 sm:top-auto sm:flex-col md:max-w-[var(--component-toast-viewport-max-width)]",
      className
    )}
    {...props}
  />
))
ToastViewport.displayName = ToastPrimitives.Viewport.displayName

const toastVariants = cva(
  // Base classes
  "group pointer-events-auto relative flex w-full items-center justify-between overflow-[var(--component-toast-root-overflow)] rounded-[var(--component-toast-root-border-radius)] border-[var(--component-toast-root-border-width)] p-[var(--component-toast-root-padding)] pr-[var(--component-toast-root-padding-right)] shadow-[var(--component-toast-root-box-shadow)] transition-[var(--component-toast-root-transition)] space-x-[var(--component-toast-root-space)] " +
  // Swipe and animation classes (consider mapping if needed)
  "data-[swipe=cancel]:translate-x-0 data-[swipe=end]:translate-x-[var(--radix-toast-swipe-end-x)] data-[swipe=move]:translate-x-[var(--radix-toast-swipe-move-x)] data-[swipe=move]:transition-none data-[state=open]:animate-in data-[state=closed]:animate-out data-[swipe=end]:animate-out " +
  // Animation tokens applied
  "data-[state=closed]:var(--component-toast-root-animation-out) data-[state=open]:var(--component-toast-root-animation-in)",
  {
    variants: {
      variant: {
        default: 
          "border-[var(--component-toast-root-default-border-color)] bg-[var(--component-toast-root-default-background-color)] text-[var(--component-toast-root-default-text-color)]",
        destructive:
          "destructive group border-[var(--component-toast-root-destructive-border-color)] bg-[var(--component-toast-root-destructive-background-color)] text-[var(--component-toast-root-destructive-text-color)]",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

const Toast = React.forwardRef<
  React.ElementRef<typeof ToastPrimitives.Root>,
  React.ComponentPropsWithoutRef<typeof ToastPrimitives.Root> &
    VariantProps<typeof toastVariants>
>(({ className, variant, ...props }, ref) => {
  return (
    <ToastPrimitives.Root
      ref={ref}
      className={cn(toastVariants({ variant }), className)}
      {...props}
    />
  )
})
Toast.displayName = ToastPrimitives.Root.displayName

const ToastAction = React.forwardRef<
  React.ElementRef<typeof ToastPrimitives.Action>,
  React.ComponentPropsWithoutRef<typeof ToastPrimitives.Action>
>(({ className, ...props }, ref) => (
  <ToastPrimitives.Action
    ref={ref}
    className={cn(
      "inline-flex shrink-0 items-center justify-center rounded-[var(--component-toast-action-border-radius)] border-[var(--component-toast-action-border-width)] bg-[var(--component-toast-action-background-color)] px-[var(--component-toast-action-padding-x)] text-[var(--component-toast-action-font-size)] font-[var(--component-toast-action-font-weight)] ring-offset-background transition-[var(--component-toast-action-transition)]",
      "h-[var(--component-toast-action-height)]",
      "hover:bg-[var(--component-toast-action-hover-background-color)]",
      "focus:outline-none focus:ring-[var(--component-toast-action-focus-ring-width)] focus:ring-[var(--component-toast-action-focus-ring-color)] focus:ring-offset-[var(--component-toast-action-focus-ring-offset)]",
      "disabled:pointer-events-none disabled:opacity-[var(--component-toast-action-disabled-opacity)]",
      // Destructive variant styles applied via group
      "group-[.destructive]:border-[var(--component-toast-action-destructive-border-color)]",
      "group-[.destructive]:hover:border-[var(--component-toast-action-destructive-hover-border-color)] group-[.destructive]:hover:bg-[var(--component-toast-action-destructive-hover-background-color)] group-[.destructive]:hover:text-[var(--component-toast-action-destructive-hover-text-color)]",
      "group-[.destructive]:focus:ring-[var(--component-toast-action-destructive-focus-ring-color)]",
      className
    )}
    {...props}
  />
))
ToastAction.displayName = ToastPrimitives.Action.displayName

const ToastClose = React.forwardRef<
  React.ElementRef<typeof ToastPrimitives.Close>,
  React.ComponentPropsWithoutRef<typeof ToastPrimitives.Close>
>(({ className, ...props }, ref) => (
  <ToastPrimitives.Close
    ref={ref}
    className={cn(
      "absolute rounded-[var(--component-toast-close-border-radius)] p-[var(--component-toast-close-padding)] opacity-[var(--component-toast-close-opacity)] transition-[var(--component-toast-close-transition)]",
      "right-[var(--component-toast-close-right)] top-[var(--component-toast-close-top)]",
      "text-[var(--component-toast-close-text-color)] hover:text-[var(--component-toast-close-hover-text-color)]",
      "focus:opacity-[var(--component-toast-close-focus-opacity)] focus:outline-none focus:ring-[var(--component-toast-close-focus-ring-width)]",
      "group-hover:opacity-[var(--component-toast-close-group-hover-opacity)]",
      // Destructive variant styles applied via group
      "group-[.destructive]:text-[var(--component-toast-close-destructive-text-color)]",
      "group-[.destructive]:hover:text-[var(--component-toast-close-destructive-hover-text-color)]", 
      "group-[.destructive]:focus:ring-[var(--component-toast-close-destructive-focus-ring-color)] group-[.destructive]:focus:ring-offset-[var(--component-toast-close-destructive-focus-ring-offset-color)]",
      className
    )}
    toast-close=""
    {...props}
  >
    <X className="h-[var(--component-toast-close-icon-size)] w-[var(--component-toast-close-icon-size)]" />
  </ToastPrimitives.Close>
))
ToastClose.displayName = ToastPrimitives.Close.displayName

const ToastTitle = React.forwardRef<
  React.ElementRef<typeof ToastPrimitives.Title>,
  React.ComponentPropsWithoutRef<typeof ToastPrimitives.Title>
>(({ className, ...props }, ref) => (
  <ToastPrimitives.Title
    ref={ref}
    className={cn(
      "font-source-serif-pro",
      "text-[var(--component-toast-title-font-size)] font-[var(--component-toast-title-font-weight)]", 
      className
    )}
    {...props}
  />
))
ToastTitle.displayName = ToastPrimitives.Title.displayName

const ToastDescription = React.forwardRef<
  React.ElementRef<typeof ToastPrimitives.Description>,
  React.ComponentPropsWithoutRef<typeof ToastPrimitives.Description>
>(({ className, ...props }, ref) => (
  <ToastPrimitives.Description
    ref={ref}
    className={cn("text-[var(--component-toast-description-font-size)] opacity-[var(--component-toast-description-opacity)]", className)}
    {...props}
  />
))
ToastDescription.displayName = ToastPrimitives.Description.displayName

type ToastProps = React.ComponentPropsWithoutRef<typeof Toast>

type ToastActionElement = React.ReactElement<typeof ToastAction>

export {
  type ToastProps,
  type ToastActionElement,
  ToastProvider,
  ToastViewport,
  Toast,
  ToastTitle,
  ToastDescription,
  ToastClose,
  ToastAction,
}
