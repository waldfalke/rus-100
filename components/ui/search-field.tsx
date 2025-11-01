import * as React from "react"
import { Search } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

export interface SearchFieldProps extends React.InputHTMLAttributes<HTMLInputElement> {
  onSearch?: (value: string) => void
  searchButtonText?: string
  containerClassName?: string
}

const SearchField = React.forwardRef<HTMLInputElement, SearchFieldProps>(
  ({ className, onSearch, searchButtonText = "Искать", containerClassName, ...props }, ref) => {
    const [value, setValue] = React.useState(props.value || "")

    const handleSearch = () => {
      onSearch?.(String(value))
    }

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key === "Enter") {
        e.preventDefault()
        handleSearch()
      }
      props.onKeyDown?.(e)
    }

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      setValue(e.target.value)
      props.onChange?.(e)
    }

    return (
      <div className={cn("relative flex items-center w-full", containerClassName)}>
        <Input
          ref={ref}
          className={cn("pr-20 w-full", className)}
          value={value}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
          {...props}
        />
        <Button
          type="button"
          variant="ghost"
          size="sm"
          className="absolute right-1 h-7 px-2 text-xs"
          onClick={handleSearch}
        >
          <Search className="h-3 w-3 mr-1" />
          {searchButtonText}
        </Button>
      </div>
    )
  }
)

SearchField.displayName = "SearchField"

export { SearchField }