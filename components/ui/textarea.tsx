import * as React from "react"

import { cn } from "@/lib/utils"

const Textarea = React.forwardRef<
  HTMLTextAreaElement,
  React.ComponentProps<"textarea">
>(({ className, ...props }, ref) => {
  return (
    <textarea
      className={cn(
        "flex w-full min-h-[var(--component-textarea-min-height)]",
        "rounded-[var(--component-textarea-border-radius)] border border-[var(--component-textarea-border-color)] border-[var(--component-textarea-border-width)]",
        "bg-[var(--component-textarea-background-color)] px-[var(--component-textarea-padding-x)] py-[var(--component-textarea-padding-y)]",
        "text-[var(--component-textarea-font-size)] ring-offset-background",
        "placeholder:text-[var(--component-textarea-placeholder-text-color)]",
        "focus-visible:outline-none focus-visible:ring-[var(--component-textarea-focus-ring-width)] focus-visible:ring-[var(--component-textarea-focus-ring-color)] focus-visible:ring-offset-[var(--component-textarea-focus-ring-offset)]",
        "disabled:cursor-not-allowed disabled:opacity-[var(--component-textarea-disabled-opacity)]",
        "md:text-[var(--component-textarea-sizes-md-font-size)]", // MD specific font size
        className
      )}
      ref={ref}
      {...props}
    />
  )
})
Textarea.displayName = "Textarea"

export { Textarea }
