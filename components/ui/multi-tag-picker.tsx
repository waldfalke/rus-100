"use client";

import React, { useState } from "react";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command";
import { cn } from "@/lib/utils";
import { Check, ChevronsUpDown, X } from "lucide-react";

export type Option = { value: string; label: string };

export function MultiTagPicker({
  label,
  options,
  value,
  onChange,
  placeholder = "Выберите...",
  showChips = true,
  triggerClassName,
}: {
  label?: string;
  options: Option[];
  value: string[];
  onChange: (val: string[]) => void;
  placeholder?: string;
  showChips?: boolean;
  triggerClassName?: string;
}) {
  const [open, setOpen] = useState(false);
  const selected = new Set(value);

  const toggle = (v: string) => {
    const next = new Set(selected);
    if (next.has(v)) next.delete(v);
    else next.add(v);
    onChange(Array.from(next));
  };

  const remove = (v: string) => {
    const next = value.filter((x) => x !== v);
    onChange(next);
  };

  return (
    <div className="space-y-2">
      {label ? <Label>{label}</Label> : null}
      {showChips && (
        <div className="flex flex-wrap gap-2">
          {value.length === 0 && (
            <span className="text-sm text-muted-foreground">Нет выбранных значений</span>
          )}
          {value.map((v) => {
            const opt = options.find((o) => o.value === v);
            return (
              <Badge key={v} variant="secondary" className="flex items-center gap-1">
                {opt?.label ?? v}
                <button
                  aria-label="Убрать"
                  className="ml-1 inline-flex"
                  onClick={() => remove(v)}
                >
                  <X className="h-3 w-3" />
                </button>
              </Badge>
            );
          })}
        </div>
      )}
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={open}
            className={cn("justify-between", showChips ? "w-full" : "w-auto", triggerClassName)}
          >
            {placeholder}
            <ChevronsUpDown className="ml-2 h-4 w-4 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="p-0 w-[var(--radix-popover-trigger-width)] min-w-[280px]">
          <Command>
            <CommandInput placeholder="Поиск..." />
            <CommandEmpty>Ничего не найдено.</CommandEmpty>
            <CommandList>
              <CommandGroup>
                {options.map((opt) => (
                  <CommandItem key={opt.value} onSelect={() => toggle(opt.value)}>
                    <Check
                      className={cn(
                        "mr-2 h-4 w-4",
                        selected.has(opt.value) ? "opacity-100" : "opacity-0"
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
    </div>
  );
}