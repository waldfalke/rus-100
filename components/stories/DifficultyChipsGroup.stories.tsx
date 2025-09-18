import { DifficultyChipsGroup, DifficultyTier } from "../ui/DifficultyChipsGroup";
import type { Meta, StoryObj } from "@storybook/react";
import React, { useState } from "react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

const difficultyTiers: DifficultyTier[] = [
  { id: "easiest", label: "самые лёгкие" },
  { id: "easy", label: "лёгкие" },
  { id: "medium", label: "средние" },
  { id: "hard", label: "сложные" },
  { id: "hardest", label: "самые сложные" },
];

const mockStats = {
  easiest: 4,
  easy: 9,
  medium: 57,
  hard: 44,
  hardest: 0,
};

const meta: Meta<typeof DifficultyChipsGroup> = {
  title: "Blocks/DifficultyChipsGroup",
  component: DifficultyChipsGroup,
};
export default meta;

/**
 * Группа чипсов для выбора уровня сложности.
 *
 * - Позволяет выбрать один из вариантов сложности.
 * - Управление выбором через value и onChange.
 */

type Story = StoryObj<typeof DifficultyChipsGroup>;

export const CustomCounter: Story = {
  render: () => {
    const [value, setValue] = useState<string[]>(["medium"]);
    return (
      <DifficultyChipsGroup
        value={value}
        onChange={setValue}
        stats={mockStats}
        tiers={difficultyTiers}
        renderCount={(count, selected) => (
          <span
            className={cn(
              "ml-2 text-sm font-normal",
              selected ? "text-primary-foreground" : "text-muted-foreground"
            )}
          >
            {count}
          </span>
        )}
        anyLabel="любая сложность"
      />
    );
  },
};

export const SiteStyle: Story = {
  render: () => {
    const [value, setValue] = useState<string[]>(["any"]);
    return (
      <DifficultyChipsGroup
        value={value}
        onChange={setValue}
        stats={mockStats}
        tiers={difficultyTiers}
        renderCount={(count, selected) => (
          <span
            className={cn(
              "ml-1 text-sm font-normal",
              selected ? "text-primary-foreground" : "text-muted-foreground"
            )}
          >
            ({count})
          </span>
        )}
        anyLabel="любая сложность"
      />
    );
  },
};

export const DropdownChips: Story = {
  render: () => {
    const [open, setOpen] = useState(false);
    const allTierIds = difficultyTiers.map((t) => t.id);
    const [value, setValue] = useState<string[]>(["any"]);

    // Логика выбора сложности
    const handleChange = (id: string) => {
      if (id === "any") {
        setValue(["any"]);
        return;
      }
      let newValue = value.includes(id)
        ? value.filter((v) => v !== id)
        : [...value.filter((v) => v !== "any"), id];
      // Если ничего не выбрано — снова any
      if (newValue.length === 0) newValue = ["any"];
      // Если выбраны все — это any
      if (newValue.length === allTierIds.length) newValue = ["any"];
      setValue(newValue);
    };

    const selectedLabel =
      value.length === 1 && value[0] === "any"
        ? "любая сложность"
        : value
            .map(
              (v) =>
                v === "easiest"
                  ? "самые лёгкие"
                  : v === "easy"
                  ? "лёгкие"
                  : v === "medium"
                  ? "средние"
                  : v === "hard"
                  ? "сложные"
                  : v === "hardest"
                  ? "самые сложные"
                  : v
            )
            .join(", ");
    
    // SVG шеврона
    const Chevron = ({ open }: { open: boolean }) => (
      <svg
        width="16"
        height="16"
        viewBox="0 0 16 16"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className={cn(
          "ml-1.5 transition-transform duration-200",
          open ? "rotate-180" : "rotate-0"
        )}
      >
        <path
          d="M4.5 6L8 9.5L11.5 6"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    );
    
    // Кнопка закрытия для мобильных устройств
    const MobileCloseButton = () => (
      <button
        onClick={() => setOpen(false)}
        className="w-full mt-2.5 py-2 bg-muted rounded-lg text-sm font-normal text-muted-foreground hover:bg-muted/80 transition-colors mobile-only"
      >
        Закрыть
      </button>
    );
    
    return (
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Badge
            variant="outline"
            className="cursor-pointer py-1 px-3 flex items-center gap-1.5 hover:bg-accent transition-colors difficulty-dropdown-badge"
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
            }}
          >
            <span className="text-xs font-normal" style={{ overflow: "hidden", textOverflow: "ellipsis" }}>
              {selectedLabel}
            </span>
            <Chevron open={open} />
          </Badge>
        </PopoverTrigger>
        <PopoverContent
          className="w-auto p-2 difficulty-popover-content"
          style={{
            minWidth: 220,
            maxWidth: 320,
            display: "flex",
            flexWrap: "wrap",
            gap: 8,
            alignItems: "stretch",
          }}
        >
          <div className="sb-difficulty-chips-group" style={{ width: "100%", display: "flex", flexWrap: "wrap", gap: 8 }}>
            {/* Любая сложность */}
            <Badge
              key="any"
              variant={value.length === 1 && value[0] === "any" ? "default" : "outline"}
              className={cn(
                "cursor-pointer transition-colors text-xs px-2 py-0.5 flex items-center gap-1 font-normal",
                value.length === 1 && value[0] === "any"
                  ? "bg-primary hover:bg-primary/80 text-primary-foreground border-transparent"
                  : "border-border text-foreground hover:bg-accent"
              )}
              onClick={() => handleChange("any")}
            >
              любая сложность
            </Badge>
            {difficultyTiers.map((tier) => (
              <Badge
                key={tier.id}
                variant={
                  value.includes(tier.id) && value[0] !== "any"
                    ? "default"
                    : "outline"
                }
                className={cn(
                  "cursor-pointer transition-colors text-xs px-2 py-0.5 flex items-center gap-1 font-normal",
                  value.includes(tier.id) && value[0] !== "any"
                    ? "bg-primary hover:bg-primary/80 text-primary-foreground border-transparent"
                    : "border-border text-foreground hover:bg-accent"
                )}
                onClick={() => handleChange(tier.id)}
              >
                {tier.label}
              </Badge>
            ))}
          </div>
          <div className="desktop-close-hint text-muted-foreground font-normal" style={{ marginTop: 10, fontSize: 13, textAlign: "center" }}>
            ESC или клик вне меню для закрытия
          </div>
          <div className="mobile-close-btn" style={{ display: "none" }}>
            <MobileCloseButton />
          </div>
          <style>{`
            @media (max-width: 600px) {
              .mobile-close-btn { display: block !important; }
              .desktop-close-hint { display: none !important; }
              .difficulty-dropdown-badge {
                width: auto !important;
                max-width: 95vw !important;
                margin: 0 !important;
              }
              .difficulty-popover-content {
                max-width: 95vw !important;
                min-width: 0 !important;
              }
            }
            
            /* Глобальный override для font-weight */
            .difficulty-dropdown-badge *,
            .difficulty-popover-content * {
              font-weight: 400 !important;
            }
          `}</style>
        </PopoverContent>
      </Popover>
    );
  },
}; 