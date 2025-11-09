"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { ChevronDown } from "lucide-react";
import { SourceSwitcher } from "./source-switcher";
import { FilterGroup } from "./filter-group";

export type Density = "compact" | "cozy";

export type SourceSwitcherSpec = {
  enabled?: boolean;
  value?: "all" | "platform" | "mine";
  onChange?: (value: "all" | "platform" | "mine") => void;
};

export type SearchSpec = {
  placeholder?: string;
  query: string;
  onQueryChange: (next: string) => void;
  debounceMs?: number;
};

export type SelectAllSpec = {
  label?: string;
  checked: boolean;
  onToggle: (checked: boolean) => void;
};

export type SecondaryActionSpec = {
  id: string;
  label: string;
  icon?: React.ComponentType<{ className?: string }>;
  onClick: () => void;
  disabled?: boolean;
};

export type PrimaryActionSpec = {
  label: string;
  icon?: React.ComponentType<{ className?: string }>;
  onClick?: () => void;
  items?: { id: string; label: string; icon?: React.ComponentType<{ className?: string }>; onClick: () => void }[];
  loading?: boolean;
  disabled?: boolean;
};

export type FilterControlSpec =
  | { type: "chip"; id: string; label: string; selected: boolean; onToggle: (selected: boolean) => void }
  | { type: "select"; id: string; label: string; value: string; options: { label: string; value: string }[]; onChange: (value: string) => void; footer?: React.ReactNode }
  | { type: "toggle"; id: string; label: string; checked: boolean; onChange: (checked: boolean) => void }
  | { type: "menu"; id: string; label: string; items: { id: string; label: string; icon?: React.ComponentType<{ className?: string }>; onClick: () => void }[] }
  | { type: "multiselect"; id: string; label: string; values: string[]; options: { label: string; value: string }[]; onChange: (values: string[]) => void; footer?: React.ReactNode };

export type FilterGroupSpec = {
  id: string;
  label?: string;
  controls: FilterControlSpec[];
};

export interface ActionPanelProps {
  filterGroups: FilterGroupSpec[];
  primaryAction?: PrimaryActionSpec | null;
  sourceSwitcher?: SourceSwitcherSpec | null;
  search?: SearchSpec | null;
  selectAll?: SelectAllSpec | null;
  secondaryActions?: SecondaryActionSpec[] | null;
  density?: Density;
  className?: string;
}

const densityClasses: Record<Density, { container: string; control: string; icon: string }> = {
  compact: {
    container: "gap-2",
    control: "h-9 px-3",
    icon: "h-4 w-4",
  },
  cozy: {
    container: "gap-3",
    control: "h-10 px-3",
    icon: "h-5 w-5",
  },
};

function useDebouncedValue<T>(value: T, delay = 300) {
  const [debounced, setDebounced] = React.useState(value);
  React.useEffect(() => {
    const t = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(t);
  }, [value, delay]);
  return debounced;
}

export const ActionPanel: React.FC<ActionPanelProps> = ({
  filterGroups,
  primaryAction,
  sourceSwitcher = null,
  search = null,
  selectAll = null,
  secondaryActions = [],
  density = "compact",
  className,
}) => {
  const d = densityClasses[density];

  const [searchLocal, setSearchLocal] = React.useState(search?.query ?? "");
  const debouncedQuery = useDebouncedValue(searchLocal, search?.debounceMs ?? 300);
  React.useEffect(() => {
    if (search && debouncedQuery !== search.query) {
      search.onQueryChange(debouncedQuery);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedQuery]);

  return (
    <div className={cn("flex flex-row flex-wrap items-center sm:justify-between", d.container, className)}>
      {/* Left: source switcher, select-all, search, filters */}
      <div className={cn("flex flex-wrap items-center", d.container)}>
        {sourceSwitcher?.enabled !== false && sourceSwitcher && (
          <SourceSwitcher value={sourceSwitcher.value} onChange={sourceSwitcher.onChange} density={density} />
        )}

        {selectAll && (
          <div className={cn("inline-flex items-center gap-2 shrink-0", d.control)}>
            <Checkbox
              id="action-panel-select-all"
              checked={selectAll.checked}
              onCheckedChange={(checked) => selectAll.onToggle(checked === true)}
            />
            <Label htmlFor="action-panel-select-all" className="cursor-pointer text-sm">
              {selectAll.label ?? "Выбрать всех"}
            </Label>
          </div>
        )}

        {search && (
          <Input
            value={searchLocal}
            onChange={(e) => setSearchLocal(e.target.value)}
            placeholder={search.placeholder ?? "Поиск"}
            className={cn("w-[200px]", d.control)}
          />
        )}

        {filterGroups && filterGroups.length > 0 && (
          <FilterGroup groups={filterGroups} density={density} />
        )}
      </div>

      {/* Right: secondary actions (mobile icon-only), primary action */}
      <div className={cn("flex items-center ml-auto", d.container)}>
        {secondaryActions && secondaryActions.length > 0 && (
          <TooltipProvider>
            <div className={cn("flex items-center gap-1")}>
              {secondaryActions.map((act) => {
                const Icon = act.icon;
                return (
                  <React.Fragment key={act.id}>
                    {/* Mobile: icon-only ghost */}
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button
                          size="icon"
                          variant="ghost"
                          className="sm:hidden"
                          aria-label={act.label}
                          onClick={act.onClick}
                          disabled={act.disabled}
                        >
                          {Icon ? <Icon className={d.icon} /> : <span className="sr-only">{act.label}</span>}
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>{act.label}</TooltipContent>
                    </Tooltip>

                    {/* Desktop/Tablet: outline with text */}
                    <Button
                      variant="outline"
                      className={cn(d.control, "hidden sm:inline-flex")}
                      onClick={act.onClick}
                      disabled={act.disabled}
                    >
                      {Icon ? <Icon className={cn(d.icon, "mr-2")} /> : null}
                      {act.label}
                    </Button>
                  </React.Fragment>
                );
              })}
            </div>
          </TooltipProvider>
        )}

        {/* Primary action */}
        {primaryAction && (
          primaryAction.items ? (
            /* Dropdown menu with responsive variants */
            primaryAction.icon ? (
              <>
                {/* Mobile: icon-only dropdown */}
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      size="icon"
                      variant="outline"
                      disabled={primaryAction.disabled}
                      className="sm:hidden"
                      aria-label={primaryAction.label}
                    >
                      <primaryAction.icon className={d.icon} />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    {primaryAction.items.map((item) => {
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
                {/* Desktop: full button with text */}
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="outline"
                      disabled={primaryAction.disabled}
                      className={cn(d.control, "hidden sm:inline-flex")}
                    >
                      <primaryAction.icon className={cn(d.icon, "mr-2")} />
                      {primaryAction.label}
                      <ChevronDown className={cn(d.icon, "ml-2")} />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    {primaryAction.items.map((item) => {
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
              </>
            ) : (
              /* No icon: same on mobile and desktop */
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="outline"
                    disabled={primaryAction.disabled}
                    className={d.control}
                  >
                    {primaryAction.label}
                    <ChevronDown className={cn(d.icon, "ml-2")} />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  {primaryAction.items.map((item) => {
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
            )
          ) : primaryAction.icon ? (
            <>
              {/* Mobile: icon-only outline */}
              <Button
                size="icon"
                variant="outline"
                onClick={primaryAction.onClick}
                disabled={primaryAction.disabled}
                className="sm:hidden"
                aria-label={primaryAction.label}
              >
                <primaryAction.icon className={d.icon} />
              </Button>
              {/* Desktop: full button with text */}
              <Button
                variant="outline"
                onClick={primaryAction.onClick}
                disabled={primaryAction.disabled}
                className={cn(d.control, "hidden sm:inline-flex")}
              >
                <primaryAction.icon className={cn(d.icon, "mr-2")} />
                {primaryAction.label}
              </Button>
            </>
          ) : (
            /* No icon: same on mobile and desktop */
            <Button
              variant="outline"
              onClick={primaryAction.onClick}
              disabled={primaryAction.disabled}
              className={d.control}
            >
              {primaryAction.label}
            </Button>
          )
        )}
      </div>
    </div>
  );
};

ActionPanel.displayName = "ActionPanel";