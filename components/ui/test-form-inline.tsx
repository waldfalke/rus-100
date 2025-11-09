"use client";

/**
 * TestFormInline - Centralized test creation form organism
 *
 * Minimalist form pattern: no cards/labels, placeholders only, uniform h-9 height,
 * flex-wrap layout with gap-2, responsive buttons (icon-only on mobile, full text
 * on desktop from sm: breakpoint).
 *
 * This organism centralizes the form pattern to prevent code duplication and AI confusion.
 * Single source of truth for test creation forms across all pages.
 *
 * @contract contracts/CONTRACT-ACTION-PANEL.yml
 * @see app/action-panel-demo/page.tsx - Demo usage
 * @see app/create-test/page.tsx - Production usage
 */

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { SearchableSelect, Option } from "@/components/ui/searchable-select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { FolderPlus } from "lucide-react";

export interface TestFormData {
  testName: string;
  account?: string;
  testGroup?: string;
}

export interface TestFormInlineProps {
  value: TestFormData;
  onChange: (value: TestFormData) => void;
  accountOptions: Option[];
  testGroupOptions: Option[];
  onCreateGroup?: (groupName: string) => void;
  className?: string;
}

export function TestFormInline({
  value,
  onChange,
  accountOptions,
  testGroupOptions,
  onCreateGroup,
  className,
}: TestFormInlineProps) {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [newGroupName, setNewGroupName] = useState("");

  const handleCreateGroup = () => {
    if (newGroupName.trim()) {
      if (onCreateGroup) {
        onCreateGroup(newGroupName);
      } else {
        // Fallback if no handler provided
        alert(`Создана группа: ${newGroupName}`);
      }
      setNewGroupName("");
      setIsDialogOpen(false);
    }
  };

  return (
    <>
      <div className={`flex flex-wrap items-center gap-2 ${className || ""}`}>
        <Input
          value={value.testName}
          onChange={(e) => onChange({ ...value, testName: e.target.value })}
          placeholder="Название теста *"
          className="h-9 w-full sm:w-auto sm:min-w-[360px]"
        />

        <Select
          value={value.account}
          onValueChange={(account) => onChange({ ...value, account })}
        >
          <SelectTrigger className="h-9 w-auto min-w-[180px]">
            <SelectValue placeholder="Аккаунт" />
          </SelectTrigger>
          <SelectContent>
            {accountOptions.map((opt) => (
              <SelectItem key={opt.value} value={opt.value}>
                {opt.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <SearchableSelect
          options={testGroupOptions}
          value={value.testGroup}
          onChange={(testGroup) => onChange({ ...value, testGroup })}
          placeholder="Группа тестов"
          triggerClassName="h-9 w-auto min-w-[180px]"
        />

        {/* Mobile: icon only */}
        <Button
          variant="outline"
          size="icon"
          className="h-9 w-9 flex-shrink-0 sm:hidden sm:ml-auto"
          onClick={() => setIsDialogOpen(true)}
        >
          <FolderPlus className="h-4 w-4" />
        </Button>

        {/* Desktop: icon + text */}
        <Button
          variant="outline"
          className="h-9 hidden sm:inline-flex sm:ml-auto"
          onClick={() => setIsDialogOpen(true)}
        >
          <FolderPlus className="h-4 w-4 mr-2" />
          Добавить группу тестов
        </Button>
      </div>

      {/* Dialog for creating new test group */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Создать группу тестов</DialogTitle>
            <DialogDescription>
              Введите название новой группы тестов
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <Input
              value={newGroupName}
              onChange={(e) => setNewGroupName(e.target.value)}
              placeholder="Название группы *"
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  handleCreateGroup();
                }
              }}
            />
          </div>
          <DialogFooter>
            <Button variant="ghost" onClick={() => setIsDialogOpen(false)}>
              Отмена
            </Button>
            <Button onClick={handleCreateGroup}>Создать</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}

TestFormInline.displayName = "TestFormInline";
