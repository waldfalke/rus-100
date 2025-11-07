"use client";

import React from "react";
import { InputWithClear } from "@/components/ui/input-with-clear";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { FolderPlus } from "lucide-react";

interface GroupFiltersProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  onSearch?: (value: string) => void;
  showArchived?: boolean;
  onShowArchivedChange?: (checked: boolean) => void;
  onCreateGroup?: () => void;
  className?: string;
}

export function GroupFilters({
  searchQuery,
  onSearchChange,
  onSearch,
  showArchived = false,
  onShowArchivedChange,
  onCreateGroup,
  className
}: GroupFiltersProps) {
  return (
    <div className={`mb-8 ${className || ""}`}>
      <div className="flex w-full flex-col gap-3 md:flex-row md:items-center">
        {/* Поиск */}
        <div className="w-full md:flex-1 min-w-0">
          <InputWithClear
            placeholder="Поиск групп..."
            value={searchQuery}
            onChange={onSearchChange}
            showClear={searchQuery.length > 0}
            className="w-full md:flex-1"
          />
        </div>

        {/* Вторая строка на мобильных: свитч слева, кнопка занимает остаток ширины */}
        <div className="flex w-full items-center gap-[var(--component-groupfilters-row-gap)] md:w-auto md:flex-none">
          {/* Switch "Показать архивные" */}
          {onShowArchivedChange && (
            <div className="inline-flex items-center h-10 gap-2 shrink-0 px-3 border border-border rounded-md bg-background">
              <Switch
                id="show-archived"
                checked={showArchived}
                onCheckedChange={onShowArchivedChange}
                className="data-[state=unchecked]:bg-muted"
              />
              <Label
                htmlFor="show-archived"
                className="text-sm font-normal text-muted-foreground cursor-pointer whitespace-nowrap"
              >
                Показать архивные
              </Label>
            </div>
          )}

          {/* Кнопка создать: занимает остаток ширины на мобильных, фиксированная на md+/lg */}
          {onCreateGroup && (
            <Button
              variant="outline"
              onClick={onCreateGroup}
              className="shrink-0 flex-1 basis-0 md:flex-none h-10 md:min-w-[var(--component-button-min-width-md)] max-w-[var(--component-button-max-w-mobile)] md:w-[var(--component-button-width-md)] lg:w-[var(--component-button-width-lg)] md:max-w-none"
              title="Создать группу"
              aria-label="Создать группу"
            >
              <FolderPlus className="h-4 w-4" />
              <span className="truncate">Создать группу</span>
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}