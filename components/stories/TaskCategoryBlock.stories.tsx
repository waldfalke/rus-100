import React, { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Dice3, ChevronDown, ChevronUp } from "lucide-react";
import { TaskCategorySelector } from "../ui/task-category-selector";

type TestItem = {
  id: string;
  title: string;
  count?: number;
  maxCount?: number;
};

type TestCategory = {
  category: string;
  items: TestItem[];
};

type TaskDifficultyStats = { [key: string]: number };

const mockCategory: TestCategory = {
  category: "Работа с текстом",
  items: [
    { id: "1", title: "№1. Средства связи предложений в тексте", count: 0, maxCount: 5 },
    { id: "2", title: "№2. Определение темы и главной мысли текста", count: 2, maxCount: 5 },
  ],
};

const mockItemStats: { [key: string]: TaskDifficultyStats } = {
  "1": { easiest: 2, easy: 1, medium: 1, hard: 0, hardest: 0 },
  "2": { easiest: 0, easy: 2, medium: 2, hard: 1, hardest: 0 },
};

const difficultyTiers = [
  { id: "easiest", label: "Самые лёгкие" },
  { id: "easy", label: "Лёгкие" },
  { id: "medium", label: "Средние" },
  { id: "hard", label: "Сложные" },
  { id: "hardest", label: "Самые сложные" },
];

export default {
  title: "Blocks/TaskCategoryBlock",
  render: () => {
    // --- Состояния, как на сайте ---
    const [expanded, setExpanded] = useState(true);
    const [itemDifficulties, setItemDifficulties] = useState<{ [key: string]: string[] }>({});
    const [itemCategories, setItemCategories] = useState<{ [key: string]: string[] }>({});
    const [counts, setCounts] = useState<{ [key: string]: number }>({ "1": 0, "2": 2 });

    // --- Логика, как на сайте ---
    const handleItemDifficultyChange = (itemId: string, difficultyId: string) => {
      setItemDifficulties(prev => {
        const currentDifficulties = prev[itemId] || [];
        if (difficultyId === 'any') {
          return { ...prev, [itemId]: ['any'] };
        }
        let newDifficulties: string[];
        if (currentDifficulties.includes(difficultyId)) {
          newDifficulties = currentDifficulties.filter(d => d !== difficultyId);
          if (newDifficulties.length === 0) newDifficulties = ['any'];
        } else {
          newDifficulties = currentDifficulties.filter(d => d !== 'any').concat(difficultyId);
        }
        return { ...prev, [itemId]: newDifficulties };
      });
    };
    const handleCategoriesChange = (itemId: string, categories: string[]) => {
      setItemCategories(prev => ({ ...prev, [itemId]: categories }));
    };
    const handleCountChange = (itemId: string, increment: number) => {
      setCounts(prev => {
        const oldCount = prev[itemId] || 0;
        const maxCount = mockCategory.items.find(i => i.id === itemId)?.maxCount || 10;
        const newCount = Math.max(0, Math.min(maxCount, oldCount + increment));
        return { ...prev, [itemId]: newCount };
      });
    };

    // --- JSX карточки задания (копия с сайта) ---
    const renderItemRow = (item: TestItem) => {
      const currentCount = counts[item.id] || 0;
      const maxCount = item.maxCount || 10;
      const itemStats = mockItemStats[item.id];
      const taskNumber = item.title.match(/№\s*(\d+)/)?.[1];
      return (
        <Card key={item.id} className="border border-gray-200 mb-2">
          <CardContent className="p-3 sm:p-4">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
              <div className="flex items-center gap-2 flex-grow pr-4">
                <span className="text-sm text-gray-800">{item.title}</span>
                {taskNumber && (
                  <TaskCategorySelector
                    taskNumber={taskNumber}
                    selectedCategories={itemCategories[item.id] || []}
                    onCategoriesChange={(categories) => handleCategoriesChange(item.id, categories)}
                  />
                )}
              </div>
              <div className="flex flex-wrap items-center gap-x-4 gap-y-2 w-full sm:w-auto justify-end">
                <div className="flex flex-wrap gap-1.5 items-center">
                  {itemStats ? (
                    <>
                      <Badge
                        key={`${item.id}-any`}
                        variant={(!itemDifficulties[item.id] || itemDifficulties[item.id]?.includes('any')) ? "default" : "outline"}
                        onClick={() => handleItemDifficultyChange(item.id, 'any')}
                        className={`cursor-pointer transition-colors text-sm px-2 py-0.5 flex items-center gap-1 ${
                          !itemDifficulties[item.id] || itemDifficulties[item.id]?.includes('any')
                            ? "bg-teal-600 hover:bg-teal-700 text-white border-teal-600"
                            : "border-gray-300 text-gray-700 hover:bg-gray-100"
                        }`}
                        role="radio"
                        aria-checked={!itemDifficulties[item.id] || itemDifficulties[item.id]?.includes('any')}
                        tabIndex={0}
                      >
                        <Dice3 className="w-3 h-3" />
                        Любая (<span className="text-sm">{Object.values(itemStats).reduce((sum, count) => sum + count, 0)})</span>
                      </Badge>
                      {difficultyTiers.map(tier => {
                        const countForItemTier = itemStats[tier.id] || 0;
                        const isDisabled = countForItemTier === 0;
                        const isSelected = itemDifficulties[item.id]?.includes(tier.id);
                        return (
                          <Badge
                            key={`${item.id}-${tier.id}`}
                            variant={isSelected && !isDisabled ? "default" : "outline"}
                            onClick={() => !isDisabled && handleItemDifficultyChange(item.id, tier.id)}
                            className={`cursor-pointer transition-colors text-sm px-2 py-0.5 ${
                              isDisabled
                                ? "cursor-not-allowed opacity-50 bg-gray-100 text-gray-400 border-gray-200"
                                : isSelected
                                ? "bg-teal-600 hover:bg-teal-700 text-white border-teal-600"
                                : "border-gray-300 text-gray-700 hover:bg-gray-100"
                            }`}
                            aria-disabled={isDisabled}
                            role="radio"
                            aria-checked={isSelected && !isDisabled}
                            tabIndex={isDisabled ? -1 : 0}
                          >
                            {tier.label} (<span className="text-sm">{countForItemTier})</span>
                          </Badge>
                        );
                      })}
                    </>
                  ) : (
                    <span className="text-xs text-gray-400 italic">Нет данных о сложности</span>
                  )}
                </div>
                <Separator orientation="vertical" className="h-6 hidden sm:block" />
                <div className="flex items-center space-x-1.5 flex-shrink-0">
                  <Button
                    variant="outline"
                    size="icon"
                    className="h-6 w-6"
                    onClick={() => handleCountChange(item.id, -1)}
                    disabled={currentCount <= 0}
                  >
                    -
                  </Button>
                  <span className="text-sm font-medium w-8 text-center tabular-nums">{currentCount}</span>
                  <Button
                    variant="outline"
                    size="icon"
                    className="h-6 w-6"
                    onClick={() => handleCountChange(item.id, 1)}
                    disabled={currentCount >= maxCount}
                  >
                    +
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      );
    };

    // --- JSX категории (копия с сайта) ---
    return (
      <div className="mb-6">
        <div
          className="flex items-center justify-between bg-gray-50 p-2 sm:p-3 rounded-lg cursor-pointer"
          onClick={() => setExpanded((v) => !v)}
        >
          <h3 className="font-medium text-gray-800">{mockCategory.category}</h3>
          {expanded ? (
            <ChevronUp className="w-5 h-5 text-gray-500" />
          ) : (
            <ChevronDown className="w-5 h-5 text-gray-500" />
          )}
        </div>
        {expanded && (
          <div className="mt-2 sm:mt-3 space-y-2 sm:space-y-3">
            {mockCategory.items.map(renderItemRow)}
          </div>
        )}
        <div className="desktop-close-hint text-xs" style={{ marginTop: 10, color: "#888", textAlign: "center" }}>ESC или клик вне меню для закрытия</div>
      </div>
    );
  },
}; 