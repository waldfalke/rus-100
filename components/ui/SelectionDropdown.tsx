// Code Contracts: COMPLETED
// @token-status: COMPLETED (Using Tailwind tokens & component styles)
import React, { useState, useEffect } from "react";
import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover";
import { Badge } from "@/components/ui/badge";
import { CounterBadge } from "@/components/ui/CounterBadge";
import { cn } from "@/lib/utils";

export interface SelectionOption {
  id: string;
  label: string;
  count?: number;
}

interface SelectionDropdownProps {
  options: SelectionOption[];
  selected: string[];
  onChange: (selected: string[]) => void;
  label?: string;
  totalCount?: number;
  allLabel?: string;
  className?: string;
}

export const SelectionDropdown: React.FC<SelectionDropdownProps> = ({
  options,
  selected,
  onChange,
  label = "Выбрать",
  totalCount,
  allLabel = "все",
  className = "",
}) => {
  const [open, setOpen] = useState(false);

  const handleSelect = (id: string) => {
    if (id === "any") {
      onChange(["any"]);
      return;
    }
    let newValue = selected.includes(id)
      ? selected.filter((v) => v !== id)
      : [...selected.filter((v) => v !== "any"), id];
    if (newValue.length === 0 || newValue.length === options.length) newValue = ["any"];
    onChange(newValue);
  };

  const getLabel = () => {
    if (selected.length === 1 && selected[0] === "any") return allLabel;
    const labels = selected
      .map((v) => options.find((o) => o.id === v)?.label.toLowerCase() || v.toLowerCase());
    if (labels.length === 1) return labels[0];
    if (labels.length === 2) return `${labels[0]} и ${labels[1]}`;
    if (labels.length > 2) return `${labels[0]}, ${labels[1]} +${labels.length - 2}`;
    return label;
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Badge
          variant="outline"
          className={cn(
            "selection-dropdown-badge cursor-pointer py-1 px-2.5 flex items-center gap-1 hover:bg-accent transition-colors",
            "w-auto max-w-full flex items-center justify-between overflow-visible",
            className
          )}
        >
          <span className="text-[14px] pr-1 font-normal">{getLabel()}</span>
          <svg 
            width="14" 
            height="14" 
            viewBox="0 0 16 16" 
            fill="none" 
            xmlns="http://www.w3.org/2000/svg" 
            className={cn(
              "flex-shrink-0 transition-transform duration-200",
              open ? "rotate-180" : "rotate-0"
            )}
          >
            <path d="M4.5 6L8 9.5L11.5 6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </Badge>
      </PopoverTrigger>
      <PopoverContent 
        className={cn(
          "selection-dropdown-content w-auto p-2 z-50",
          "min-w-[200px] max-w-[320px] w-auto"
        )}
      >
        <div className="flex flex-wrap gap-1.5">
          <CounterBadge
            key="any"
            variant={selected.length === 1 && selected[0] === "any" ? "default" : "outline"}
            className={cn(
              "cursor-pointer transition-colors text-[14px] px-2 py-0.5",
              selected.length === 1 && selected[0] === "any"
                ? "bg-primary hover:bg-primary/80 text-primary-foreground border-transparent"
                : "border-border text-foreground hover:bg-accent"
            )}
            onClick={() => handleSelect("any")}
            label={allLabel}
            count={typeof totalCount === "number" ? totalCount : undefined}
          />
          {options.map((option) => (
            <CounterBadge
              key={option.id}
              variant={selected.includes(option.id) && selected[0] !== "any" ? "default" : "outline"}
              className={cn(
                "cursor-pointer transition-colors text-[14px] px-2 py-0.5",
                selected.includes(option.id) && selected[0] !== "any"
                  ? "bg-primary hover:bg-primary/80 text-primary-foreground border-transparent"
                  : "border-border text-foreground hover:bg-accent"
              )}
              onClick={() => handleSelect(option.id)}
              label={option.label.toLowerCase()}
              count={typeof option.count === "number" ? option.count : undefined}
            />
          ))}
        </div>
        <div className="desktop-close-hint mt-2 text-xs text-muted-foreground text-left">
          ESC или клик вне меню для закрытия
        </div>
        <button 
          onClick={() => setOpen(false)} 
          className="mobile-close-btn hidden w-full mt-2 py-1.5 bg-muted rounded-lg text-sm font-medium text-muted-foreground hover:bg-muted/80 transition-colors"
        >
          Закрыть
        </button>
      </PopoverContent>
      <style jsx global>{`
        /* Мобильные устройства */
        @media (max-width: 639px) {
          .selection-dropdown-badge {
            width: 100% !important;
            max-width: 100% !important;
          }
          
          .selection-dropdown-content {
            width: calc(100vw - 32px) !important;
            min-width: 0 !important;
            max-width: none !important;
            margin: 0 16px !important;
          }

          .mobile-close-btn {
            display: block !important;
          }

          .desktop-close-hint {
            display: none !important;
          }
        }
        
        /* Фикс для нижней панели на планшетах */
        @media (min-width: 640px) and (max-width: 1023px) {
          .fixed.bottom-0 .text-lg {
            font-size: 1rem !important;
          }
        }
      `}</style>
    </Popover>
  );
}; 