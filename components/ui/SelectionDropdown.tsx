import React, { useState } from "react";
import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover";
import { Badge } from "@/components/ui/badge";
import { Counter } from "@/components/ui/Counter";

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
          className={`selection-dropdown-badge cursor-pointer py-1 px-2.5 flex items-center gap-1 hover:bg-gray-100 transition-colors ${className}`}
          style={{ 
            width: "auto", 
            maxWidth: "100%", 
            display: "flex", 
            alignItems: "center", 
            justifyContent: "space-between", 
            overflow: "visible"
          }}
        >
          <span className="text-sm pr-1">{getLabel()}</span>
          <svg 
            width="14" 
            height="14" 
            viewBox="0 0 16 16" 
            fill="none" 
            xmlns="http://www.w3.org/2000/svg" 
            className="flex-shrink-0 transition-transform duration-200"
            style={{ transform: open ? "rotate(180deg)" : "rotate(0deg)" }}
          >
            <path d="M4.5 6L8 9.5L11.5 6" stroke="#888" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </Badge>
      </PopoverTrigger>
      <PopoverContent 
        className="selection-dropdown-content w-auto p-2 z-50" 
        style={{ 
          minWidth: 200,
          maxWidth: 320,
          width: "auto"
        }}
      >
        <div className="flex flex-wrap gap-1.5">
          <Badge
            key="any"
            variant={selected.length === 1 && selected[0] === "any" ? "default" : "outline"}
            className={`cursor-pointer transition-colors text-sm px-2 py-0.5 flex items-center gap-1 ${
              selected.length === 1 && selected[0] === "any"
                ? "bg-teal-600 hover:bg-teal-700 text-white border-teal-600"
                : "border-gray-300 text-gray-700 hover:bg-gray-100"
            }`}
            onClick={() => handleSelect("any")}
          >
            <span>{allLabel}</span>
            {typeof totalCount === "number" && (
              <span className="text-sm font-medium">{totalCount}</span>
            )}
          </Badge>
          {options.map((option) => (
            <Badge
              key={option.id}
              variant={selected.includes(option.id) && selected[0] !== "any" ? "default" : "outline"}
              className={`cursor-pointer transition-colors text-sm px-2 py-0.5 flex items-center gap-1 ${
                selected.includes(option.id) && selected[0] !== "any"
                  ? "bg-teal-600 hover:bg-teal-700 text-white border-teal-600"
                  : "border-gray-300 text-gray-700 hover:bg-gray-100"
              }`}
              onClick={() => handleSelect(option.id)}
            >
              <span>{option.label.toLowerCase()}</span>
              {typeof option.count === "number" && (
                <span className="text-sm font-medium">{option.count}</span>
              )}
            </Badge>
          ))}
        </div>
        <div className="desktop-close-hint mt-2 text-xs text-gray-500 text-left">
          ESC или клик вне меню для закрытия
        </div>
        <button 
          onClick={() => setOpen(false)} 
          className="mobile-close-btn hidden w-full mt-2 py-1.5 bg-gray-100 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-200 transition-colors"
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