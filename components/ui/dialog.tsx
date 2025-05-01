"use client"

import * as React from "react"
import * as DialogPrimitive from "@radix-ui/react-dialog"
import { X } from "lucide-react"

import { cn } from "@/lib/utils"

const Dialog = DialogPrimitive.Root

const DialogTrigger = DialogPrimitive.Trigger

const DialogPortal = DialogPrimitive.Portal

const DialogClose = DialogPrimitive.Close

const DialogOverlay = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Overlay>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Overlay>
>(({ className, ...props }, ref) => (
  <DialogPrimitive.Overlay
    ref={ref}
    className={cn(
      "fixed inset-0 z-[var(--component-dialog-overlay-z-index)] bg-[var(--component-dialog-overlay-background-color)]",
      "data-[state=open]:animate-in data-[state=closed]:animate-out",
      "data-[state=closed]:var(--component-dialog-overlay-animation-out)",
      "data-[state=open]:var(--component-dialog-overlay-animation-in)",
      className
    )}
    {...props}
  />
))
DialogOverlay.displayName = DialogPrimitive.Overlay.displayName

const DialogContent = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Content>
>(({ className, children, ...props }, ref) => (
  <DialogPortal>
    <DialogOverlay />
    <DialogPrimitive.Content
      ref={ref}
      className={cn(
        "fixed left-[50%] top-[50%] z-[var(--component-dialog-content-z-index)] grid w-full max-w-[var(--component-dialog-content-max-width)] translate-x-[-50%] translate-y-[-50%] gap-[var(--component-dialog-content-gap)]",
        "border border-[var(--component-dialog-content-border-color)] border-[var(--component-dialog-content-border-width)]",
        "bg-[var(--component-dialog-content-background-color)] p-[var(--component-dialog-content-padding)] shadow-[var(--component-dialog-content-box-shadow)]",
        "duration-[var(--component-dialog-content-animation-duration)]",
        "data-[state=open]:animate-in data-[state=closed]:animate-out",
        "data-[state=closed]:var(--component-dialog-content-animation-out-fade-out) data-[state=open]:var(--component-dialog-content-animation-in-fade-in)",
        "data-[state=closed]:var(--component-dialog-content-animation-out-zoom-out) data-[state=open]:var(--component-dialog-content-animation-in-zoom-in)",
        "data-[state=closed]:var(--component-dialog-content-animation-out-slide-out-to-left) data-[state=closed]:var(--component-dialog-content-animation-out-slide-out-to-top)",
        "data-[state=open]:var(--component-dialog-content-animation-in-slide-in-from-left) data-[state=open]:var(--component-dialog-content-animation-in-slide-in-from-top)",
        "sm:rounded-[var(--component-dialog-content-border-radius)]",
        className
      )}
      {...props}
    >
      {children}
      <DialogPrimitive.Close 
        className={cn(
          "absolute right-4 top-4 rounded-[var(--component-dialog-close-button-border-radius)] opacity-[var(--component-dialog-close-button-opacity)] ring-offset-background transition-opacity",
          "hover:opacity-[var(--component-dialog-close-button-hover-opacity)]",
          "focus:outline-none focus:ring-[var(--component-dialog-close-button-focus-ring-width)] focus:ring-[var(--component-dialog-close-button-focus-ring-color)] focus:ring-offset-[var(--component-dialog-close-button-focus-ring-offset)]",
          "disabled:pointer-events-none",
          "data-[state=open]:bg-[var(--component-dialog-close-button-open-state-background-color)] data-[state=open]:text-[var(--component-dialog-close-button-open-state-text-color)]"
        )}
      >
        <X className="h-[var(--component-dialog-close-button-size)] w-[var(--component-dialog-close-button-size)]" />
        <span className="sr-only">Close</span>
      </DialogPrimitive.Close>
    </DialogPrimitive.Content>
  </DialogPortal>
))
DialogContent.displayName = DialogPrimitive.Content.displayName

const DialogHeader = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) => (
  <div
    className={cn(
      "flex flex-col space-y-[var(--component-dialog-header-spacing)] text-center sm:text-[var(--component-dialog-header-text-align)]",
      className
    )}
    {...props}
  />
)
DialogHeader.displayName = "DialogHeader"

const DialogFooter = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) => (
  <div
    className={cn(
      "flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-[var(--component-dialog-footer-spacing)]",
      className
    )}
    {...props}
  />
)
DialogFooter.displayName = "DialogFooter"

const DialogTitle = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Title>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Title>
>(({ className, ...props }, ref) => (
  <DialogPrimitive.Title
    ref={ref}
    className={cn(
      "text-[var(--component-dialog-title-font-size)] font-[var(--component-dialog-title-font-weight)] leading-[var(--component-dialog-title-line-height)] tracking-[var(--component-dialog-title-letter-spacing)]",
      className
    )}
    {...props}
  />
))
DialogTitle.displayName = DialogPrimitive.Title.displayName

const DialogDescription = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Description>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Description>
>(({ className, ...props }, ref) => (
  <DialogPrimitive.Description
    ref={ref}
    className={cn("text-[var(--component-dialog-description-font-size)] text-[var(--component-dialog-description-text-color)]", className)}
    {...props}
  />
))
DialogDescription.displayName = DialogPrimitive.Description.displayName

export {
  Dialog,
  DialogPortal,
  DialogOverlay,
  DialogClose,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogFooter,
  DialogTitle,
  DialogDescription,
}
