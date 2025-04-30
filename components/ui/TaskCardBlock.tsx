import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dice3 } from "lucide-react";
import { TaskCategorySelector } from "@/components/ui/task-category-selector";
import { CounterControlBlock } from "@/components/ui/CounterControlBlock";

export interface TaskCardBlockProps {
  item: {
    id: string;
    title: string;
    description: string;
    url?: string;
  };
  onSolveClick?: (id: string) => void;
  onCategoriesChange?: (id: string, categories: string[]) => void;
  categories?: string[];
  itemStats?: Record<string, number>;
  difficultyTiers: { id: string; label: string }[];
  difficultyDropdown?: React.ReactNode;
  categoryDropdown?: React.ReactNode;
  layout?: "auto" | "vertical" | "horizontal";
  controlsClassName?: string;
  difficulties?: string[];
  onDifficultyChange?: (difficultyId: string) => void;
  currentCount?: number;
  maxCount?: number;
  onIncrement?: () => void;
  onDecrement?: () => void;
}

export const TaskCardBlock: React.FC<TaskCardBlockProps> = ({
  item,
  onSolveClick,
  categories = [],
  onCategoriesChange,
  itemStats,
  difficultyTiers,
  difficultyDropdown,
  categoryDropdown,
  layout = "auto",
  controlsClassName = "",
  difficulties,
  onDifficultyChange,
  currentCount = 0,
  maxCount = 10,
  onIncrement,
  onDecrement,
}) => {
  // Извлекаем номер задания из заголовка
  const taskNumber = item.title.match(/№\s*(\d+)/)?.[1];

  // Определяем, есть ли дропдауны для отображения
  const hasDropdowns = categoryDropdown || difficultyDropdown;
  const hasControls = (onIncrement && onDecrement) || onSolveClick;

  return (
    <Card className="border border-gray-200 mb-2">
      <CardContent className="p-3 sm:p-4">
        {/* Основной контейнер с прогрессивными брейкпоинтами */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-2 lg:gap-3">
          {/* Название задания - отдельный блок */}
          <div className="text-sm text-gray-800 flex-shrink-0 mb-2 lg:mb-0 lg:mr-3 min-w-0">{item.title}</div>

          {/* Контейнер для всех контроллов с компактным расположением */}
          <div className={`flex flex-col sm:flex-row items-start sm:items-center gap-2 w-full lg:w-auto lg:ml-auto ${!hasDropdowns && 'sm:justify-end'} ${controlsClassName}`}>
            {/* Контейнер для дропдаунов - горизонтальный на планшетах, но может переноситься */}
            {hasDropdowns && (
              <div className="flex flex-col sm:flex-row flex-wrap gap-2 w-full sm:w-auto sm:flex-grow">
                {/* Категории */}
                {categoryDropdown && (
                  <div className="w-full sm:w-auto flex-shrink-0 min-w-[140px] max-w-full">
                    {categoryDropdown}
                  </div>
                )}

                {/* Сложность */}
                {difficultyDropdown && (
                  <div className="w-full sm:w-auto flex-shrink-0 min-w-[140px] max-w-full">
                    {difficultyDropdown}
                  </div>
                )}
              </div>
            )}

            {/* Счетчик с уменьшенным отступом для более плотного расположения */}
            {hasControls && (
              <div className={`flex flex-row items-center gap-2 sm:ml-auto ${hasDropdowns ? 'mt-2 sm:mt-0' : ''}`}>
                {/* Счетчик с кнопками */}
                {onDecrement && onIncrement && (
                  <CounterControlBlock
                    value={currentCount}
                    min={0}
                    max={maxCount}
                    onDecrement={onDecrement}
                    onIncrement={onIncrement}
                  />
                )}

                {/* Кнопка решения */}
                {onSolveClick && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onSolveClick(item.id)}
                  >
                    Решить
                  </Button>
                )}
              </div>
            )}
          </div>
        </div>
      </CardContent>
      
      {/* Глобальные стили для обеспечения плавного перехода между разными размерами экрана */}
      <style jsx global>{`
        /* Правило для предотвращения переполнения текста в бейджах */
        .selection-dropdown-badge span {
          display: inline-block;
        }
      `}</style>
    </Card>
  );
}; 