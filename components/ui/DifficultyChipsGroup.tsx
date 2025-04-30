import React from "react";
import { Badge } from "@/components/ui/badge";
import { Dice3 } from "lucide-react";

export interface DifficultyTier {
  id: string;
  label: string;
}

export interface DifficultyChipsGroupProps {
  value: string[];
  onChange: (value: string[]) => void;
  stats: { [key: string]: number };
  tiers: DifficultyTier[];
  renderCount?: (count: number, selected: boolean) => React.ReactNode;
  anyLabel?: string;
}

export const DifficultyChipsGroup: React.FC<DifficultyChipsGroupProps> = ({
  value,
  onChange,
  stats,
  tiers,
  renderCount,
  anyLabel = "любая сложность",
}) => {
  const handleClick = (tierId: string) => {
    if (tierId === "any") {
      onChange(["any"]);
      return;
    }
    if (value.includes(tierId)) {
      const newValue = value.filter((v) => v !== tierId);
      onChange(newValue.length === 0 ? ["any"] : newValue);
    } else {
      onChange([...value.filter((v) => v !== "any"), tierId]);
    }
  };
  return (
    <div className="flex flex-wrap gap-1.5 items-center">
      <Badge
        key="any"
        variant={value.includes("any") ? "default" : "outline"}
        onClick={() => handleClick("any")}
        className={`cursor-pointer transition-colors text-xs px-2 py-0.5 flex items-center gap-1 ${
          value.includes("any")
            ? "bg-teal-600 hover:bg-teal-700 text-white border-teal-600"
            : "border-gray-300 text-gray-700 hover:bg-gray-100"
        }`}
        role="radio"
        aria-checked={value.includes("any")}
        tabIndex={0}
      >
        {anyLabel}
        {renderCount
          ? renderCount(Object.values(stats).reduce((sum, count) => sum + count, 0), value.includes("any"))
          : <span className="ml-2 text-gray-400">{Object.values(stats).reduce((sum, count) => sum + count, 0)}</span>}
      </Badge>
      {tiers.map((tier) => {
        const count = stats[tier.id] || 0;
        const isDisabled = count === 0;
        const isSelected = value.includes(tier.id);
        return (
          <Badge
            key={tier.id}
            variant={isSelected && !isDisabled ? "default" : "outline"}
            onClick={() => !isDisabled && handleClick(tier.id)}
            className={`cursor-pointer transition-colors text-xs px-2 py-0.5 ${
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
            {tier.label}
            {renderCount
              ? renderCount(count, isSelected && !isDisabled)
              : <span className="ml-2 text-gray-400">{count}</span>}
          </Badge>
        );
      })}
    </div>
  );
}; 