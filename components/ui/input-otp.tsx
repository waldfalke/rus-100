"use client"

import * as React from "react"
import { OTPInput, OTPInputContext } from "input-otp"
import { Dot } from "lucide-react"

import { cn } from "@/lib/utils"

const InputOTP = React.forwardRef<
  React.ElementRef<typeof OTPInput>,
  React.ComponentPropsWithoutRef<typeof OTPInput>
>(({ className, containerClassName, ...props }, ref) => (
  <OTPInput
    ref={ref}
    containerClassName={cn(
      "flex items-center has-[:disabled]:opacity-[var(--component-input-otp-container-disabled-opacity)]",
      "gap-[var(--component-input-otp-container-gap)]",
      containerClassName
    )}
    className={cn("disabled:cursor-not-allowed", className)}
    {...props}
  />
))
InputOTP.displayName = "InputOTP"

const InputOTPGroup = React.forwardRef<
  React.ElementRef<"div">,
  React.ComponentPropsWithoutRef<"div">
>(({ className, ...props }, ref) => (
  <div ref={ref} className={cn("flex items-center", className)} {...props} />
))
InputOTPGroup.displayName = "InputOTPGroup"

const InputOTPSlot = React.forwardRef<
  React.ElementRef<"div">,
  React.ComponentPropsWithoutRef<"div"> & { index: number }
>(({ index, className, ...props }, ref) => {
  const inputOTPContext = React.useContext(OTPInputContext)
  const { char, hasFakeCaret, isActive } = inputOTPContext.slots[index]

  return (
    <div
      ref={ref}
      className={cn(
        "relative flex items-center justify-center border-y border-r border-[var(--component-input-otp-slot-border-color)] text-[var(--component-input-otp-slot-font-size)] transition-[var(--component-input-otp-slot-transition)]",
        "h-[var(--component-input-otp-slot-height)] w-[var(--component-input-otp-slot-width)]",
        "border-[var(--component-input-otp-slot-border-width)]",
        "first:rounded-l-[var(--component-input-otp-slot-border-radius-first)] first:border-l",
        "last:rounded-r-[var(--component-input-otp-slot-border-radius-last)]",
        isActive && 
          "z-[var(--component-input-otp-slot-active-z-index)] ring-[var(--component-input-otp-slot-active-ring-width)] ring-[var(--component-input-otp-slot-active-ring-color)] ring-offset-[var(--component-input-otp-slot-active-ring-offset)] ring-offset-background",
        className
      )}
      {...props}
    >
      {char}
      {hasFakeCaret && (
        <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
          <div 
            className={cn(
              "animate-[var(--component-input-otp-slot-caret-animation-name)] bg-[var(--component-input-otp-slot-caret-background-color)] duration-[var(--component-input-otp-slot-caret-animation-duration)]",
              "h-[var(--component-input-otp-slot-caret-height)] w-[var(--component-input-otp-slot-caret-width)]"
            )}
          />
        </div>
      )}
    </div>
  )
})
InputOTPSlot.displayName = "InputOTPSlot"

const InputOTPSeparator = React.forwardRef<
  React.ElementRef<"div">,
  React.ComponentPropsWithoutRef<"div">
>(({ ...props }, ref) => (
  <div ref={ref} role="separator" {...props} className="text-[var(--component-input-otp-separator-color)]">
    <Dot />
  </div>
))
InputOTPSeparator.displayName = "InputOTPSeparator"

export { InputOTP, InputOTPGroup, InputOTPSlot, InputOTPSeparator }
