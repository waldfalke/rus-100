import type { Meta, StoryObj } from "@storybook/react";
import { SelectionDropdown, SelectionOption } from "@/components/ui/SelectionDropdown";
import { useState } from "react";

const meta = {
  title: "UI/SelectionDropdown",
  component: SelectionDropdown,
  tags: ["autodocs"],
} satisfies Meta<typeof SelectionDropdown>;

export default meta;
type Story = StoryObj<typeof meta>;

// Тестовые данные
const categories: SelectionOption[] = [
  { id: "algorithms", label: "Алгоритмы" },
  { id: "data-structures", label: "Структуры данных" },
  { id: "dynamic-programming", label: "Динамическое программирование" },
  { id: "graphs", label: "Графы" },
  { id: "math", label: "Математика" },
  { id: "strings", label: "Строки" },
];

const difficulties: SelectionOption[] = [
  { id: "easy", label: "Легкая", count: 10 },
  { id: "medium", label: "Средняя", count: 15 },
  { id: "hard", label: "Сложная", count: 5 },
];

// Интерактивные истории с состоянием
const InteractiveCategoryDropdown = () => {
  const [selected, setSelected] = useState<string[]>(["algorithms", "graphs"]);
  return (
    <div style={{ padding: 20, maxWidth: "100%" }}>
      <SelectionDropdown
        options={categories}
        selected={selected}
        onChange={setSelected}
        label="Категории"
        allLabel="все категории"
      />
      <div style={{ marginTop: 20, fontSize: 14, color: "#666" }}>
        Выбрано: {selected.join(", ")}
      </div>
    </div>
  );
};

const InteractiveDifficultyDropdown = () => {
  const [selected, setSelected] = useState<string[]>(["easy", "medium"]);
  return (
    <div style={{ padding: 20, maxWidth: "100%" }}>
      <SelectionDropdown
        options={difficulties}
        selected={selected}
        onChange={setSelected}
        label="Сложность"
        allLabel="любая сложность"
        totalCount={30}
      />
      <div style={{ marginTop: 20, fontSize: 14, color: "#666" }}>
        Выбрано: {selected.join(", ")}
      </div>
    </div>
  );
};

// Истории для категорий
export const Categories: Story = {
  render: () => <InteractiveCategoryDropdown />,
  args: {
    options: categories,
    selected: ["algorithms", "graphs"],
    onChange: () => {},
    label: "Категории",
    allLabel: "все категории",
  },
};

export const CategoriesPreselected: Story = {
  args: {
    options: categories,
    selected: ["algorithms", "data-structures"],
    onChange: () => {},
    label: "Категории",
    allLabel: "все категории",
  },
};

export const CategoriesAll: Story = {
  args: {
    options: categories,
    selected: ["any"],
    onChange: () => {},
    label: "Категории",
    allLabel: "все категории",
  },
};

// Истории для сложности
export const Difficulty: Story = {
  render: () => <InteractiveDifficultyDropdown />,
  args: {
    options: difficulties,
    selected: ["easy", "medium"],
    onChange: () => {},
    label: "Сложность",
    allLabel: "любая сложность",
    totalCount: 30,
  },
};

export const DifficultyPreselected: Story = {
  args: {
    options: difficulties,
    selected: ["easy", "medium"],
    onChange: () => {},
    label: "Сложность",
    allLabel: "любая сложность",
    totalCount: 30,
  },
};

export const DifficultyAll: Story = {
  args: {
    options: difficulties,
    selected: ["any"],
    onChange: () => {},
    label: "Сложность",
    allLabel: "любая сложность",
    totalCount: 30,
  },
};

// Мобильная версия
export const Mobile: Story = {
  parameters: {
    viewport: {
      defaultViewport: "mobile1",
    },
  },
  args: {
    options: difficulties,
    selected: ["medium"],
    onChange: () => {},
    label: "Сложность",
    allLabel: "любая сложность",
    totalCount: 30,
  },
}; 