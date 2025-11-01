"use client";

import React from "react";
import { InputWithClear } from "@/components/ui/input-with-clear";
import { Button } from "@/components/ui/button";
import { FolderPlus } from "lucide-react";

interface GroupFiltersProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  onSearch?: (value: string) => void;
  onCreateGroup?: () => void;
  className?: string;
}

export function GroupFilters({ 
  searchQuery, 
  onSearchChange, 
  onSearch,
  onCreateGroup, 
  className 
}: GroupFiltersProps) {
  return (
    <div className={`mb-8 ${className || ""}`}>
      <div className="flex items-center gap-4 w-full">
        <InputWithClear
          placeholder="Поиск групп..."
          value={searchQuery}
          onChange={onSearchChange}
          showClear={searchQuery.length > 0}
          className="flex-1 min-w-0"
        />
        {onCreateGroup && (
          <Button
            variant="outline"
            size="icon"
            onClick={onCreateGroup}
            className="shrink-0"
          >
            <FolderPlus className="h-4 w-4" />
          </Button>
        )}
      </div>
    </div>
  );
}