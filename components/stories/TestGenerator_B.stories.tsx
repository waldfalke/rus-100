import TestGenerator from "../../app/page";
import type { Meta, StoryObj } from "@storybook/react";
import { tasksData, egeFormatData, exercisesData } from "@/data/test-content";
import { TaskCardBlock } from "../ui/TaskCardBlock";
import React, { useState } from "react";
import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover";
import { Badge } from "@/components/ui/badge";
import { Dice3 } from "lucide-react";

const meta: Meta<typeof TestGenerator> = {
  title: "Pages/TestGenerator_B",
  component: TestGenerator,
  parameters: {
    layout: "fullscreen",
  },
};
export default meta;

type Story = StoryObj<typeof TestGenerator>;

// Типы для renderItemRow
type TestItem = { id: string | number; count?: number; maxCount?: number; [key: string]: any };
type TestCategory = { category: string; items: TestItem[] };
type EGECategory = { title: string; items: TestItem[] };
type TabType = "tasks" | "ege" | "exercises";

// Мок-данные для демонстрации
const mockItemStats: Record<string, any> = {
  "tasks-1": { easiest: 2, easy: 5, medium: 10, hard: 6, hardest: 1 },
  "tasks-2": { easiest: 3, easy: 4, medium: 8, hard: 3, hardest: 2 },
  "tasks-3": { easiest: 1, easy: 2, medium: 5, hard: 7, hardest: 3 },
  "ege-101": { easiest: 2, easy: 3, medium: 5, hard: 4, hardest: 1 },
};

const mockDifficultyTiers = [
  { id: "easiest", label: "Самые лёгкие" },
  { id: "easy", label: "Лёгкие" },
  { id: "medium", label: "Средние" },
  { id: "hard", label: "Сложные" },
  { id: "hardest", label: "Самые сложные" },
];

export const Default: Story = {
  render: () => <TestGenerator />,
}; 

// Note: Example implementation removed to fix syntax error 