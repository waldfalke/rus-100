import * as React from "react"

import { cn } from "@/lib/utils"

const Input = React.forwardRef<HTMLInputElement, React.ComponentProps<"input">>(
  ({ className, type, ...props }, ref) => {
    return (
      <input
        type={type}
        className={cn(
          "flex w-full rounded-[var(--component-input-default-border-radius)] border border-[var(--component-input-default-border-color)] bg-[var(--component-input-default-background-color)] px-[var(--component-input-default-padding-x)] py-[var(--component-input-default-padding-y)]",
          "text-[var(--component-input-default-font-size)] ring-offset-background",
          "file:border-0 file:bg-transparent file:text-[var(--component-input-file-font-size)] file:font-[var(--component-input-file-font-weight)] file:text-[var(--component-input-file-text-color)]",
          "placeholder:text-[var(--component-input-placeholder-text-color)]",
          "focus-visible:outline-none focus-visible:ring-[var(--component-input-focus-ring-width)] focus-visible:ring-[var(--component-input-focus-ring-color)] focus-visible:ring-offset-[var(--component-input-focus-ring-offset)]",
          "disabled:cursor-not-allowed disabled:opacity-[var(--component-input-disabled-opacity)]",
          "h-[var(--component-input-sizes-default-height)]", // Default size
          "md:text-[var(--component-input-sizes-md-font-size)]", // MD size specific font size
          className
        )}
        ref={ref}
        {...props}
      />
    )
  }
)
Input.displayName = "Input"

export { Input }
