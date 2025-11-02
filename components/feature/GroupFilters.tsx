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
      <div className="flex items-center gap-4 w-full flex-wrap md:flex-nowrap">
        {/* Поиск */}
        <InputWithClear
          placeholder="Поиск групп..."
          value={searchQuery}
          onChange={onSearchChange}
          showClear={searchQuery.length > 0}
          className="flex-1 min-w-0"
        />

        {/* Switch "Показать архивные" */}
        {onShowArchivedChange && (
          <div className="flex items-center gap-2 shrink-0 px-3 py-2 border border-border rounded-md bg-background">
            <Switch
              id="show-archived"
              checked={showArchived}
              onCheckedChange={onShowArchivedChange}
              className="scale-90 data-[state=unchecked]:bg-muted"
            />
            <Label
              htmlFor="show-archived"
              className="text-sm font-normal text-muted-foreground cursor-pointer whitespace-nowrap"
            >
              Показать архивные
            </Label>
          </div>
        )}

        {/* Кнопка создать */}
        {onCreateGroup && (
          <Button
            variant="outline"
            size="icon"
            onClick={onCreateGroup}
            className="shrink-0"
            title="Создать группу"
          >
            <FolderPlus className="h-4 w-4" />
          </Button>
        )}
      </div>
    </div>
  );
}