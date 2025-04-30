import { TaskCardBlock } from "../ui/TaskCardBlock";
import type { Meta, StoryObj } from "@storybook/react";
import React, { useState } from "react";
import { Popover, PopoverTrigger, PopoverContent } from "../ui/popover";
import { Badge } from "../ui/badge";
import { SelectionDropdown } from "@/components/ui/SelectionDropdown";

const meta: Meta<typeof TaskCardBlock> = {
  title: "Blocks/TaskCardBlockB",
  component: TaskCardBlock,
};
export default meta;

type Story = StoryObj<typeof TaskCardBlock>;

const mockItem = {
  id: "1",
  title: "Задание №1",
  description: "Описание задания",
};
const mockCategory = "Синтаксис";
const mockCategories = ["Синтаксис", "Орфография", "Пунктуация"];
const mockItemStats: Record<string, number> = {
  easy: 10,
  medium: 15,
  hard: 5,
};
const mockDifficultyTiers = [
  { id: "easy", label: "Легкая" },
  { id: "medium", label: "Средняя" },
  { id: "hard", label: "Сложная" },
];

// Добавляем маппинг заданий к их категориям (такой же как в app/page.tsx)
const taskCategoriesMap: Record<string, string[]> = {
  "1": ["предлоги", "союзы", "частицы", "местоимения", "наречия", "вводные слова"],
  "6": ["исключить", "заменить"],
  "21": ["запятая", "тире", "двоеточие"],
  "25": ["синонимы", "антонимы", "фразеологизмы", "слово"],
};

export const FullCard_B: Story = {
  render: () => {
    const categories = [
      "Орфография",
      "Пунктуация",
      "Лексика",
      "Морфология",
    ];
    const [currentCount, setCurrentCount] = useState(0);
    const [selectedDifficulties, setSelectedDifficulties] = useState<string[]>(["any"]);
    const [catSelected, setCatSelected] = useState<string[]>([...categories]);
    const allTierIds = mockDifficultyTiers.map((t) => t.id);
    
    // Логика выбора сложности
    const handleDiffChange = (id: string) => {
      if (id === "any") {
        setSelectedDifficulties(["any"]);
        return;
      }
      let newValue = selectedDifficulties.includes(id)
        ? selectedDifficulties.filter((v) => v !== id)
        : [...selectedDifficulties.filter((v) => v !== "any"), id];
      if (newValue.length === 0) newValue = ["any"];
      if (newValue.length === allTierIds.length) newValue = ["any"];
      setSelectedDifficulties(newValue);
    };
    
    // Логика выбора категорий
    const handleCatChange = (cat: string) => {
      let newSelected;
      if (catSelected.includes(cat)) {
        newSelected = catSelected.filter((c) => c !== cat);
      } else {
        newSelected = [...catSelected, cat];
      }
      if (newSelected.length === 0) newSelected = [...categories];
      if (newSelected.length === categories.length) newSelected = [...categories];
      setCatSelected(newSelected);
    };
    
    // Dropdown для сложности с счетчиками
    const difficultyDropdown = (
      <SelectionDropdown
        options={mockDifficultyTiers.map(tier => ({
          id: tier.id,
          label: tier.label,
          count: mockItemStats[tier.id]
        }))}
        selected={selectedDifficulties}
        onChange={setSelectedDifficulties}
        label="Сложность"
        allLabel="любая сложность"
        totalCount={Object.values(mockItemStats).reduce((sum, count) => sum + count, 0)}
      />
    );
    
    // Dropdown для категорий
    const categoryDropdown = (
      <SelectionDropdown
        options={mockCategories.map(cat => ({
          id: cat,
          label: cat
        }))}
        selected={catSelected}
        onChange={setCatSelected}
        label="Категории"
        allLabel="все категории"
      />
    );
    
    return (
      <div style={{ width: "100%" }}>
      <TaskCardBlock
          item={{ ...mockItem, title: "№1. Средства связи предложений в тексте", description: "Выберите категорию средств связи" }}
        currentCount={currentCount}
        maxCount={20}
        onDecrement={() => setCurrentCount((c) => Math.max(0, c - 1))}
        onIncrement={() => setCurrentCount((c) => Math.min(20, c + 1))}
          difficulties={selectedDifficulties}
        onDifficultyChange={handleDiffChange}
        categories={catSelected}
          onCategoriesChange={(_, categories) => setCatSelected(categories)}
        itemStats={mockItemStats}
        difficultyTiers={mockDifficultyTiers}
        difficultyDropdown={difficultyDropdown}
        categoryDropdown={categoryDropdown}
      />
        <style>{`
          @media (max-width: 600px) {
            .task-card-block-controls {
              flex-direction: column !important;
              align-items: flex-start !important;
              gap: 10px !important;
            }
            .dropdown-badge, .category-dropdown-badge, .difficulty-dropdown-badge {
              width: auto !important;
              max-width: 95vw !important;
              margin: 0 !important;
            }
            .popover-close-btn {
              width: 100% !important;
              padding: 12px 0 !important;
              margin-top: 12px !important;
              border-radius: 8px !important;
              background: #f3f3f3 !important;
              font-size: 16px !important;
              font-weight: 500 !important;
              border: none !important;
              text-align: center !important;
              cursor: pointer !important;
              color: #222 !important;
              box-shadow: none !important;
              display: block !important;
            }
          }
        `}</style>
      </div>
    );
  },
};

export const Interactive: Story = {
  render: () => {
    const [selectedDifficulties, setSelectedDifficulties] = useState<string[]>(["any"]);
    const [selectedCategories, setSelectedCategories] = useState<string[]>([...mockCategories]);

    return (
      <TaskCardBlock
        item={mockItem}
        categories={selectedCategories}
        onCategoriesChange={(_, categories) => setSelectedCategories(categories)}
        itemStats={mockItemStats}
        difficultyTiers={mockDifficultyTiers}
        difficultyDropdown={
          <SelectionDropdown
            options={mockDifficultyTiers.map(tier => ({
              id: tier.id,
              label: tier.label,
              count: mockItemStats[tier.id]
            }))}
            selected={selectedDifficulties}
            onChange={setSelectedDifficulties}
            label="Сложность"
            allLabel="любая сложность"
            totalCount={Object.values(mockItemStats).reduce((sum, count) => sum + count, 0)}
          />
        }
        categoryDropdown={
          <SelectionDropdown
            options={mockCategories.map(cat => ({
              id: cat,
              label: cat
            }))}
            selected={selectedCategories}
            onChange={setSelectedCategories}
            label="Категории"
            allLabel="все категории"
          />
        }
      />
    );
  }
};

export const TaskTypes: Story = {
  render: () => {
    // Инициализируем состояния с выбором всех категорий для каждого задания
    const [selectedCategories1, setSelectedCategories1] = useState<string[]>(["any"]);
    const [selectedCategories6, setSelectedCategories6] = useState<string[]>(["any"]);
    const [selectedCategories21, setSelectedCategories21] = useState<string[]>(["any"]);
    const [selectedCategories25, setSelectedCategories25] = useState<string[]>(["any"]);
    
    // Состояния для сложности
    const [selectedDifficulties1, setSelectedDifficulties1] = useState<string[]>(["any"]);
    const [selectedDifficulties6, setSelectedDifficulties6] = useState<string[]>(["any"]);
    const [selectedDifficulties21, setSelectedDifficulties21] = useState<string[]>(["any"]);
    const [selectedDifficulties25, setSelectedDifficulties25] = useState<string[]>(["any"]);
    
    return (
      <div className="space-y-4">
        {/* Задание №1 */}
        <TaskCardBlock
          item={{ 
            id: "1", 
            title: "№1. Средства связи предложений в тексте",
            description: "Выберите категорию средств связи"
          }}
          categories={selectedCategories1}
          onCategoriesChange={(_, categories) => setSelectedCategories1(categories)}
          itemStats={mockItemStats}
          difficultyTiers={mockDifficultyTiers}
          difficulties={selectedDifficulties1}
          categoryDropdown={
            <SelectionDropdown
              options={taskCategoriesMap["1"].map(cat => ({
                id: cat,
                label: cat
              }))}
              selected={selectedCategories1}
              onChange={setSelectedCategories1}
              label="Категории"
              allLabel="все категории"
            />
          }
          difficultyDropdown={
            <SelectionDropdown
              options={mockDifficultyTiers.map(tier => ({
                id: tier.id,
                label: tier.label,
                count: mockItemStats[tier.id]
              }))}
              selected={selectedDifficulties1}
              onChange={setSelectedDifficulties1}
              label="Сложность"
              allLabel="любая сложность"
              totalCount={Object.values(mockItemStats).reduce((sum, count) => sum + count, 0)}
            />
          }
        />

        {/* Задание №6 */}
        <TaskCardBlock
          item={{ 
            id: "6", 
            title: "№6. Лексические нормы",
            description: "Выберите тип задания"
          }}
          categories={selectedCategories6}
          onCategoriesChange={(_, categories) => setSelectedCategories6(categories)}
          itemStats={mockItemStats}
          difficultyTiers={mockDifficultyTiers}
          difficulties={selectedDifficulties6}
          categoryDropdown={
            <SelectionDropdown
              options={taskCategoriesMap["6"].map(cat => ({
                id: cat,
                label: cat
              }))}
              selected={selectedCategories6}
              onChange={setSelectedCategories6}
              label="Категории"
              allLabel="все категории"
            />
          }
          difficultyDropdown={
            <SelectionDropdown
              options={mockDifficultyTiers.map(tier => ({
                id: tier.id,
                label: tier.label,
                count: mockItemStats[tier.id]
              }))}
              selected={selectedDifficulties6}
              onChange={setSelectedDifficulties6}
              label="Сложность"
              allLabel="любая сложность"
              totalCount={Object.values(mockItemStats).reduce((sum, count) => sum + count, 0)}
            />
          }
        />

        {/* Задание №21 */}
        <TaskCardBlock
          item={{ 
            id: "21", 
            title: "№21. Пунктуационный анализ",
            description: "Выберите тип пунктуационного знака"
          }}
          categories={selectedCategories21}
          onCategoriesChange={(_, categories) => setSelectedCategories21(categories)}
          itemStats={mockItemStats}
          difficultyTiers={mockDifficultyTiers}
          difficulties={selectedDifficulties21}
          categoryDropdown={
            <SelectionDropdown
              options={taskCategoriesMap["21"].map(cat => ({
                id: cat,
                label: cat
              }))}
              selected={selectedCategories21}
              onChange={setSelectedCategories21}
              label="Категории"
              allLabel="все категории"
            />
          }
          difficultyDropdown={
            <SelectionDropdown
              options={mockDifficultyTiers.map(tier => ({
                id: tier.id,
                label: tier.label,
                count: mockItemStats[tier.id]
              }))}
              selected={selectedDifficulties21}
              onChange={setSelectedDifficulties21}
              label="Сложность"
              allLabel="любая сложность"
              totalCount={Object.values(mockItemStats).reduce((sum, count) => sum + count, 0)}
            />
          }
        />

        {/* Задание №25 */}
        <TaskCardBlock
          item={{ 
            id: "25", 
            title: "№25. Средства связи предложений в тексте",
            description: "Выберите тип средства связи"
          }}
          categories={selectedCategories25}
          onCategoriesChange={(_, categories) => setSelectedCategories25(categories)}
          itemStats={mockItemStats}
          difficultyTiers={mockDifficultyTiers}
          difficulties={selectedDifficulties25}
          categoryDropdown={
            <SelectionDropdown
              options={taskCategoriesMap["25"].map(cat => ({
                id: cat,
                label: cat
              }))}
              selected={selectedCategories25}
              onChange={setSelectedCategories25}
              label="Категории"
              allLabel="все категории"
            />
          }
          difficultyDropdown={
            <SelectionDropdown
              options={mockDifficultyTiers.map(tier => ({
                id: tier.id,
                label: tier.label,
                count: mockItemStats[tier.id]
              }))}
              selected={selectedDifficulties25}
              onChange={setSelectedDifficulties25}
              label="Сложность"
              allLabel="любая сложность"
              totalCount={Object.values(mockItemStats).reduce((sum, count) => sum + count, 0)}
            />
          }
        />
      </div>
    );
  }
}; 