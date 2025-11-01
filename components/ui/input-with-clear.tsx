"use client"

import * as React from "react"
import { X } from "lucide-react"

import { cn } from "@/lib/utils"
import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput,
} from "@/components/ui/input-group"

export interface InputWithClearProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "onChange"> {
  value?: string
  onChange?: (value: string) => void
  onClear?: () => void
  showClear?: boolean
  clearButtonClassName?: string
}

const InputWithClear = React.forwardRef<HTMLInputElement, InputWithClearProps>(
  ({ className, value, onChange, onClear, showClear = true, clearButtonClassName, ...props }, ref) => {
    const [internalValue, setInternalValue] = React.useState(value || "")
    
    // Use controlled value if provided, otherwise use internal state
    const currentValue = value !== undefined ? value : internalValue
    
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const newValue = e.target.value
      if (value === undefined) {
        setInternalValue(newValue)
      }
      onChange?.(newValue)
    }
    
    const handleClear = () => {
      if (value === undefined) {
        setInternalValue("")
      }
      onChange?.("")
      onClear?.()
    }
    
    const shouldShowClear = showClear && currentValue.length > 0
    
    return (
      <InputGroup className={className}>
        <InputGroupInput
          {...props}
          ref={ref}
          value={currentValue}
          onChange={handleChange}
        />
        {shouldShowClear && (
          <InputGroupAddon align="inline-end">
            <InputGroupButton
              onClick={handleClear}
              size="icon-xs"
              className={cn(
                "text-muted-foreground hover:text-foreground focus:outline-none focus:ring-0 focus-visible:ring-0", 
                clearButtonClassName
              )}
              aria-label="Clear input"
            >
              <X className="h-3 w-3" />
            </InputGroupButton>
          </InputGroupAddon>
        )}
      </InputGroup>
    )
  }
)

InputWithClear.displayName = "InputWithClear"

export { InputWithClear }