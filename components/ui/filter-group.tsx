"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import type { Density, FilterGroupSpec, FilterControlSpec } from "@/components/ui/action-panel";

const densityClasses: Record<Density, { container: string; control: string; icon: string }> = {
  compact: { container: "gap-2", control: "h-9", icon: "h-4 w-4" },
  cozy: { container: "gap-3", control: "h-10", icon: "h-5 w-5" },
};

function renderControl(ctrl: FilterControlSpec, d: ReturnType<typeof getDensity>) {
  switch (ctrl.type) {
    case "chip":
      return (
        <Button
          key={ctrl.id}
          size="sm"
          variant={ctrl.selected ? "default" : "outline"}
          className={d.control}
          onClick={() => ctrl.onToggle(!ctrl.selected)}
        >
          {ctrl.label}
        </Button>
      );
    case "select":
      return (
        <Select key={ctrl.id} value={ctrl.value} onValueChange={ctrl.onChange}>
          <SelectTrigger className={cn("w-[180px]", d.control)}>
            <SelectValue placeholder={ctrl.label} />
          </SelectTrigger>
          <SelectContent>
            {ctrl.options.map((opt) => (
              <SelectItem key={opt.value} value={opt.value}>
                {opt.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      );
    case "toggle":
      return (
        <div key={ctrl.id} className={cn("inline-flex items-center gap-2", d.control)}>
          <Switch checked={ctrl.checked} onCheckedChange={ctrl.onChange} />
          <span className="text-sm">{ctrl.label}</span>
        </div>
      );
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
          {g.controls.map((ctrl) => renderControl(ctrl, d))}
        </div>
      ))}
    </div>
  );
};

FilterGroup.displayName = "FilterGroup";