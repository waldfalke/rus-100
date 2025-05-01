"use client"

import * as React from "react"
import * as AlertDialogPrimitive from "@radix-ui/react-alert-dialog"

import { cn } from "@/lib/utils"
import { buttonVariants } from "@/components/ui/button"

const AlertDialog = AlertDialogPrimitive.Root

const AlertDialogTrigger = AlertDialogPrimitive.Trigger

const AlertDialogPortal = AlertDialogPrimitive.Portal

const AlertDialogOverlay = React.forwardRef<
  React.ElementRef<typeof AlertDialogPrimitive.Overlay>,
  React.ComponentPropsWithoutRef<typeof AlertDialogPrimitive.Overlay>
>(({ className, ...props }, ref) => (
  <AlertDialogPrimitive.Overlay
    className={cn(
      "fixed inset-0 z-[var(--component-dialog-overlay-z-index)] bg-[var(--component-dialog-overlay-background-color)]",
      "data-[state=open]:animate-in data-[state=closed]:animate-out",
      "data-[state=closed]:var(--component-dialog-overlay-animation-out)",
      "data-[state=open]:var(--component-dialog-overlay-animation-in)",
      className
    )}
    {...props}
    ref={ref}
  />
))
AlertDialogOverlay.displayName = AlertDialogPrimitive.Overlay.displayName

const AlertDialogContent = React.forwardRef<
  React.ElementRef<typeof AlertDialogPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof AlertDialogPrimitive.Content>
>(({ className, ...props }, ref) => (
  <AlertDialogPortal>
    <AlertDialogOverlay />
    <AlertDialogPrimitive.Content
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
    />
  </AlertDialogPortal>
))
AlertDialogContent.displayName = AlertDialogPrimitive.Content.displayName

const AlertDialogHeader = ({
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
AlertDialogHeader.displayName = "AlertDialogHeader"

const AlertDialogFooter = ({
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
AlertDialogFooter.displayName = "AlertDialogFooter"

const AlertDialogTitle = React.forwardRef<
  React.ElementRef<typeof AlertDialogPrimitive.Title>,
  React.ComponentPropsWithoutRef<typeof AlertDialogPrimitive.Title>
>(({ className, ...props }, ref) => (
  <AlertDialogPrimitive.Title
    ref={ref}
    className={cn("text-[var(--component-dialog-title-font-size)] font-[var(--component-dialog-title-font-weight)]", className)}
    {...props}
  />
))
AlertDialogTitle.displayName = AlertDialogPrimitive.Title.displayName

const AlertDialogDescription = React.forwardRef<
  React.ElementRef<typeof AlertDialogPrimitive.Description>,
  React.ComponentPropsWithoutRef<typeof AlertDialogPrimitive.Description>
>(({ className, ...props }, ref) => (
  <AlertDialogPrimitive.Description
    ref={ref}
    className={cn("text-[var(--component-dialog-description-font-size)] text-[var(--component-dialog-description-text-color)]", className)}
    {...props}
  />
))
AlertDialogDescription.displayName =
  AlertDialogPrimitive.Description.displayName

const AlertDialogAction = React.forwardRef<
  React.ElementRef<typeof AlertDialogPrimitive.Action>,
  React.ComponentPropsWithoutRef<typeof AlertDialogPrimitive.Action>
>(({ className, ...props }, ref) => (
  <AlertDialogPrimitive.Action
    ref={ref}
    className={cn(buttonVariants(), className)}
    {...props}
  />
))
AlertDialogAction.displayName = AlertDialogPrimitive.Action.displayName

const AlertDialogCancel = React.forwardRef<
  React.ElementRef<typeof AlertDialogPrimitive.Cancel>,
  React.ComponentPropsWithoutRef<typeof AlertDialogPrimitive.Cancel>
>(({ className, ...props }, ref) => (
  <AlertDialogPrimitive.Cancel
    ref={ref}
    className={cn(
      buttonVariants({ variant: "outline" }),
      "mt-[var(--component-alert-dialog-cancel-button-margin-top)] sm:mt-[var(--component-alert-dialog-cancel-button-sm-margin-top)]",
      className
    )}
    {...props}
  />
))
AlertDialogCancel.displayName = AlertDialogPrimitive.Cancel.displayName

export {
  AlertDialog,
  AlertDialogPortal,
  AlertDialogOverlay,
  AlertDialogTrigger,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogFooter,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogAction,
  AlertDialogCancel,
}
