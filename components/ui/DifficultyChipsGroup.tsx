// Code Contracts: PENDING
// @token-status: NA (Legacy/Unused?)
import React from "react";
import { Badge } from "@/components/ui/badge";
import { Dice3 } from "lucide-react";
import { cn } from "@/lib/utils";

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
        className={cn(
          "cursor-pointer transition-colors text-xs px-2 py-0.5 flex items-center gap-1 font-normal",
          value.includes("any")
            ? "bg-primary hover:bg-primary/80 text-primary-foreground border-transparent"
            : "border-border text-foreground hover:bg-accent"
        )}
        role="radio"
        aria-checked={value.includes("any")}
        tabIndex={0}
      >
        <span className="font-normal">{anyLabel}</span>
        {renderCount
          ? renderCount(Object.values(stats).reduce((sum, count) => sum + count, 0), value.includes("any"))
          : <span className="ml-2 text-muted-foreground">{Object.values(stats).reduce((sum, count) => sum + count, 0)}</span>}
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
            className={cn(
              "cursor-pointer transition-colors text-xs px-2 py-0.5 font-normal",
              isDisabled
                ? "cursor-not-allowed opacity-50 bg-muted text-muted-foreground border-border"
                : isSelected
                ? "bg-primary hover:bg-primary/80 text-primary-foreground border-transparent"
                : "border-border text-foreground hover:bg-accent"
            )}
            aria-disabled={isDisabled}
            role="radio"
            aria-checked={isSelected && !isDisabled}
            tabIndex={isDisabled ? -1 : 0}
          >
            <span className="font-normal">{tier.label}</span>
            {renderCount
              ? renderCount(count, isSelected && !isDisabled)
              : <span className="ml-2 text-muted-foreground">{count}</span>}
          </Badge>
        );
      })}
    </div>
  );
}; 