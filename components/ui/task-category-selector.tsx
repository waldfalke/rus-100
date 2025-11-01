// Code Contracts: PENDING
// @token-status: COMPLETED
import React, { useState, useEffect } from "react";
import { ChevronDown, ChevronUp, X } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";

// Определяем категории для каждого номера задания
const TASK_CATEGORIES: { [key: string]: string[] } = {
  "1": ["Предлоги", "Союзы", "Частицы", "Местоимения", "Наречия", "Вводные слова"],
  "6": ["Исключить", "Заменить"],
  "21": ["Запятая", "Тире", "Двоеточие"],
  "25": ["Синонимы", "Антонимы", "Фразеологизмы", "Слово"]
};

interface TaskCategorySelectorProps {
  taskNumber: string;
  selectedCategories: string[];
  onCategoriesChange: (categories: string[]) => void;
}

export function TaskCategorySelector({ 
  taskNumber, 
  selectedCategories, 
  onCategoriesChange 
}: TaskCategorySelectorProps) {
  const [isOpen, setIsOpen] = useState(false);
  const categories = TASK_CATEGORIES[taskNumber] || [];

  // Если для данного номера задания нет категорий, не рендерим компонент
  if (!categories.length) return null;

  // Форматирование текста выбранных категорий
  const formatSelectedText = (selected: string[]): string => {
    if (selected.length === 0) return "Все категории";
    if (selected.length === 1) return selected[0];
    if (selected.length === 2) return `${selected[0]} и ${selected[1]}`;
    
    const lastItem = selected[selected.length - 1];
    const otherItems = selected.slice(0, -1).join(", ");
    return `${otherItems} и ${lastItem}`;
  };

  // Обработчик выбора категории
  const handleCategoryToggle = (category: string) => {
    const newSelected = selectedCategories.includes(category)
      ? selectedCategories.filter(c => c !== category)
      : [...selectedCategories, category];
    
    onCategoriesChange(newSelected.length === 0 ? [...categories] : newSelected);
  };

  // Определяем, является ли устройство мобильным
  const isMobile = typeof window !== 'undefined' && window.matchMedia('(max-width: 768px)').matches;

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <Badge
          variant="outline"
          className="cursor-pointer py-1 px-3 flex items-center gap-1.5 hover:bg-accent transition-colors"
        >
          <span className="text-xs">
            {formatSelectedText(selectedCategories.length === 0 ? categories : selectedCategories)}
          </span>
          {isOpen ? (
            <ChevronUp className="h-3 w-3 flex-shrink-0" />
          ) : (
            <ChevronDown className="h-3 w-3 flex-shrink-0" />
          )}
        </Badge>
      </PopoverTrigger>
      <PopoverContent 
        className="w-auto p-2 sm:min-w-[200px] z-50" 
        onOpenAutoFocus={(e) => e.preventDefault()}
        onCloseAutoFocus={(e) => e.preventDefault()}
      >
        <div className="space-y-2">
          {/* Заголовок на мобильных устройствах */}
          {isMobile && (
            <div className="flex items-center justify-between pb-2 border-b border-border">
              <span className="font-source-serif-pro text-sm font-medium">Выберите категории</span>
              <button
                onClick={() => setIsOpen(false)}
                className="p-1 hover:bg-accent rounded-full"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          )}
          
          {/* Подсказка */}
          <div className="text-xs text-muted-foreground mb-2">
            {isMobile ? 
              "Нажмите на категории для выбора" :
              "ESC или клик вне меню для закрытия"
            }
          </div>

          {/* Категории */}
          <div className="flex flex-col gap-1">
            {categories.map((category) => (
              <Badge
                key={category}
                variant={selectedCategories.includes(category) ? "default" : "outline"}
                className={`cursor-pointer transition-colors text-xs px-2 py-1.5 ${
                  selectedCategories.includes(category)
                    ? "bg-primary hover:bg-primary/80 text-primary-foreground border-transparent"
                    : "border-border text-foreground hover:bg-accent"
                } ${isMobile ? "py-2" : ""}`}
                onClick={() => handleCategoryToggle(category)}
              >
                {category}
              </Badge>
            ))}
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
}