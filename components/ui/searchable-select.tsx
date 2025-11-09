"use client";

/**
 * SearchableSelect - Single-select dropdown with Command palette search
 *
 * @contract contracts/CONTRACT-ACTION-PANEL.yml
 * @see TestFormInline - Uses this component for test group selection
 */

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command";
import { cn } from "@/lib/utils";
import { Check, ChevronDown } from "lucide-react";

export type Option = { value: string; label: string };

export function SearchableSelect({
  options,
  value,
  onChange,
  placeholder = "Выберите...",
  triggerClassName,
  emptyText = "Ничего не найдено.",
}: {
  options: Option[];
  value?: string;
  onChange: (val: string | undefined) => void;
  placeholder?: string;
  triggerClassName?: string;
  emptyText?: string;
}) {
  const [open, setOpen] = useState(false);
  const selectedOption = options.find((opt) => opt.value === value);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className={cn("justify-between", triggerClassName)}
        >
          {selectedOption?.label || placeholder}
          <ChevronDown className="ml-2 h-4 w-4 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="p-0 w-[var(--radix-popover-trigger-width)] min-w-[280px]">
        <Command>
          <CommandInput placeholder="Поиск..." />
          <CommandEmpty>{emptyText}</CommandEmpty>
          <CommandList>
            <CommandGroup>
              {options.map((opt) => (
                <CommandItem
                  key={opt.value}
                  onSelect={() => {
                    onChange(opt.value === value ? undefined : opt.value);
                    setOpen(false);
                  }}
                >
                  <Check
                    className={cn(
                      "mr-2 h-4 w-4",
                      value === opt.value ? "opacity-100" : "opacity-0"
                    )}
                  />
                  {opt.label}
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
