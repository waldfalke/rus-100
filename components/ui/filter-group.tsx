"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Checkbox } from "@/components/ui/checkbox";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { DateRangePopover } from "@/components/ui/date-range-popover";
import { ChevronDown } from "lucide-react";
import type { Density, FilterGroupSpec, FilterControlSpec } from "@/components/ui/action-panel";

const densityClasses: Record<Density, { container: string; control: string; icon: string }> = {
  compact: { container: "gap-2", control: "h-9 px-3", icon: "h-4 w-4" },
  cozy: { container: "gap-3", control: "h-10 px-3", icon: "h-5 w-5" },
};

function renderControl(ctrl: FilterControlSpec, d: ReturnType<typeof getDensity>) {
  switch (ctrl.type) {
    case "chip":
      return (
        <Button
          variant={ctrl.selected ? "default" : "outline"}
          className={d.control}
          onClick={() => ctrl.onToggle(!ctrl.selected)}
        >
          {ctrl.label}
        </Button>
      );
    case "select":
      return (
        <Select value={ctrl.value} onValueChange={ctrl.onChange}>
          <SelectTrigger className={cn("w-[180px]", d.control)}>
            <SelectValue placeholder={ctrl.label} />
          </SelectTrigger>
          <SelectContent>
            {ctrl.options.map((opt) => (
              <SelectItem key={opt.value} value={opt.value}>
                {opt.label}
              </SelectItem>
            ))}
            {ctrl.footer && (
              <>
                <div className="h-px bg-border my-1" />
                {ctrl.footer}
              </>
            )}
          </SelectContent>
        </Select>
      );
    case "toggle":
      return (
        <div className={cn("inline-flex items-center gap-2", d.control)}>
          <Switch checked={ctrl.checked} onCheckedChange={ctrl.onChange} />
          <span className="text-sm">{ctrl.label}</span>
        </div>
      );
    case "menu":
      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className={d.control}>
              {ctrl.label}
              <ChevronDown className={cn(d.icon, "ml-2")} />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            {ctrl.items.map((item) => {
              const Icon = item.icon;
              return (
                <DropdownMenuItem key={item.id} onClick={item.onClick}>
                  {Icon && <Icon className={cn(d.icon, "mr-2")} />}
                  {item.label}
                </DropdownMenuItem>
              );
            })}
          </DropdownMenuContent>
        </DropdownMenu>
      );
    case "multiselect": {
      const isAllSelected = ctrl.values.length === 0;
      const displayLabel = isAllSelected
        ? 'Все'
        : ctrl.values.length === 1
          ? ctrl.options.find(o => o.value === ctrl.values[0])?.label || ctrl.label
          : `${ctrl.values.length} выбрано`;

      return (
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="outline" className={d.control}>
              {displayLabel}
              <ChevronDown className={cn(d.icon, "ml-2")} />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-[200px] p-2" align="start">
            <div className="space-y-1">
              <div
                className="flex items-center gap-2 px-2 py-1.5 hover:bg-muted rounded cursor-pointer"
                onClick={() => ctrl.onChange([])}
              >
                <Checkbox checked={isAllSelected} />
                <span className="text-sm">Все</span>
              </div>
              <div className="h-px bg-border my-1" />
              {ctrl.options.map((opt) => {
                const isChecked = ctrl.values.includes(opt.value);
                return (
                  <div
                    key={opt.value}
                    className="flex items-center gap-2 px-2 py-1.5 hover:bg-muted rounded cursor-pointer"
                    onClick={() => {
                      if (isChecked) {
                        ctrl.onChange(ctrl.values.filter(v => v !== opt.value));
                      } else {
                        ctrl.onChange([...ctrl.values, opt.value]);
                      }
                    }}
                  >
                    <Checkbox checked={isChecked} />
                    <span className="text-sm">{opt.label}</span>
                  </div>
                );
              })}
              {ctrl.footer && (
                <>
                  <div className="h-px bg-border my-1" />
                  {ctrl.footer}
                </>
              )}
            </div>
          </PopoverContent>
        </Popover>
      );
    }
    default:
      return null;
  }
}

function getDensity(density: Density) {
  return densityClasses[density];
}

export const FilterGroup: React.FC<{ groups: FilterGroupSpec[]; density?: Density }> = ({ groups, density = "compact" }) => {
  const d = getDensity(density);
  if (!groups || groups.length === 0) return null;
  return (
    <div className={cn("flex flex-wrap items-center", d.container)}>
      {groups.map((g) => (
        <div key={g.id} className={cn("flex flex-wrap items-center", d.container)}>
          {g.label ? <span className="text-sm text-muted-foreground mr-1">{g.label}</span> : null}
          {g.controls.map((ctrl) => (
            <React.Fragment key={ctrl.id}>
              {renderControl(ctrl, d)}
            </React.Fragment>
          ))}
        </div>
      ))}
    </div>
  );
};

FilterGroup.displayName = "FilterGroup";