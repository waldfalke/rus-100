import { TaskCategorySelector } from "../ui/task-category-selector";
import type { Meta, StoryObj } from "@storybook/react";
import React, { useState } from "react";
import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover";
import { Badge } from "@/components/ui/badge";

const mockCategories = [
  "Синтаксис",
  "Орфография",
  "Пунктуация",
  "Лексика",
  "Морфология",
];

const meta: Meta<typeof TaskCategorySelector> = {
  title: "Blocks/TaskCategorySelector",
  component: TaskCategorySelector,
};
export default meta;

type Story = StoryObj<typeof TaskCategorySelector>;

export const Default: Story = {
  render: () => {
    const [selected, setSelected] = useState<string[]>([mockCategories[0]]);
    return (
      <div style={{ minWidth: 90, maxWidth: 220 }}>
        <TaskCategorySelector
          taskNumber={"1"}
          selectedCategories={selected}
          onCategoriesChange={setSelected}
        />
      </div>
    );
  },
};

export const DropdownChips: Story = {
  render: () => {
    // Категории для taskNumber 1 (без 'Синтаксис')
    const categories = [
      "Предлоги",
      "Союзы",
      "Частицы",
      "Местоимения",
      "Наречия",
      "Вводные слова",
    ];
    const [selected, setSelected] = useState<string[]>([...categories]);
    // Логика выбора: если выбраны все — это 'Все категории', если снимаем все — снова все
    const handleChange = (cat: string) => {
      let newSelected;
      if (selected.includes(cat)) {
        newSelected = selected.filter((c) => c !== cat);
      } else {
        newSelected = [...selected, cat];
      }
      // Если ничего не выбрано — снова все
      if (newSelected.length === 0) newSelected = [...categories];
      // Если выбраны все кроме одного — это тоже 'Все категории'
      if (newSelected.length === categories.length) newSelected = [...categories];
      setSelected(newSelected);
    };
    // Формат отображения выбранных
    const selectedLabel =
      selected.length === categories.length
        ? "Все категории"
        : selected.length === 1
        ? selected[0]
        : selected.length === 2
        ? `${selected[0]} и ${selected[1]}`
        : `${selected.slice(0, -1).join(", ")} и ${selected[selected.length - 1]}`;
    // SVG шеврона
    const Chevron = ({ open }: { open: boolean }) => (
      <svg
        width="16"
        height="16"
        viewBox="0 0 16 16"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        style={{
          marginLeft: 6,
          transition: "transform 0.2s",
          transform: open ? "rotate(180deg)" : "rotate(0deg)",
        }}
      >
        <path
          d="M4.5 6L8 9.5L11.5 6"
          stroke="#888"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    );
    // Кнопка закрытия для мобильных
    const MobileCloseButton = ({ setOpen }: { setOpen: (v: boolean) => void }) => (
      <button
        onClick={() => setOpen(false)}
        style={{
          display: "block",
          width: "100%",
          marginTop: 10,
          padding: "8px 0",
          background: "#f3f3f3",
          border: "none",
          borderRadius: 6,
          color: "#333",
          fontSize: 14,
          fontWeight: 500,
          cursor: "pointer",
        }}
        className="mobile-only"
      >
        Закрыть
      </button>
    );
    const [open, setOpen] = useState(false);
    return (
      <div style={{ maxWidth: 340 }}>
        <Popover open={open} onOpenChange={setOpen}>
          <PopoverTrigger asChild>
            <Badge
              variant="outline"
              className="cursor-pointer py-1 px-3 flex items-center gap-1.5 hover:bg-gray-100 transition-colors dropdown-badge"
              style={{
                minWidth: 0,
                width: "fit-content",
                maxWidth: "none",
                paddingRight: 10,
                paddingLeft: 14,
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                whiteSpace: "nowrap",
                fontWeight: 400,
              }}
            >
              <span className="text-xs" style={{ overflow: "hidden", textOverflow: "ellipsis", fontWeight: 400 }}>
                {selectedLabel}
              </span>
              <Chevron open={open} />
            </Badge>
          </PopoverTrigger>
          <PopoverContent
            className="w-auto p-2 z-50"
            style={{
              minWidth: 220,
              maxWidth: 320,
              display: "flex",
              flexWrap: "wrap",
              gap: 8,
              flexDirection: "column",
              alignItems: "stretch",
            }}
          >
            <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
              {/* Все категории */}
              <Badge
                key="all"
                variant={selected.length === categories.length ? "default" : "outline"}
                className={`cursor-pointer transition-colors text-xs px-2 py-0.5 flex items-center gap-1 ${
                  selected.length === categories.length
                    ? "bg-teal-600 hover:bg-teal-700 text-white border-teal-600"
                    : "border-gray-300 text-gray-700 hover:bg-gray-100"
                }`}
                style={{ fontWeight: 400 }}
                onClick={() => setSelected([...categories])}
              >
                Все категории
              </Badge>
              {categories.map((cat) => (
                <Badge
                  key={cat}
                  variant={selected.includes(cat) && selected.length !== categories.length ? "default" : "outline"}
                  className={`cursor-pointer transition-colors text-xs px-2 py-0.5 flex items-center gap-1 ${
                    selected.includes(cat) && selected.length !== categories.length
                      ? "bg-teal-600 hover:bg-teal-700 text-white border-teal-600"
                      : "border-gray-300 text-gray-700 hover:bg-gray-100"
                  }`}
                  style={{ fontWeight: 400 }}
                  onClick={() => {
                    if (selected.length === categories.length) {
                      setSelected([cat]);
                    } else {
                      handleChange(cat);
                    }
                  }}
                >
                  {cat}
                </Badge>
              ))}
            </div>
            <div className="desktop-close-hint" style={{ marginTop: 10, color: "#888", fontSize: 13, textAlign: "center" }}>
              ESC или клик вне меню для закрытия
            </div>
            <div className="mobile-close-btn" style={{ display: "none" }}>
              <MobileCloseButton setOpen={setOpen} />
            </div>
            <style>{`
              @media (max-width: 600px) {
                .mobile-close-btn { display: block !important; }
                .desktop-close-hint { display: none !important; }
                .dropdown-badge {
                  width: calc(100vw - 32px) !important;
                  margin: 0 16px !important;
                  max-width: 100vw !important;
                }
              }
              .dropdown-badge, .dropdown-badge * {
                font-weight: 400 !important;
              }
            `}</style>
          </PopoverContent>
        </Popover>
      </div>
    );
  },
};