// Code Contracts: PENDING
// @token-status: COMPLETED
import React from "react";
import { Button } from "@/components/ui/button";

interface CounterControlBlockProps {
  value: number;
  min?: number;
  max?: number;
  onDecrement: () => void;
  onIncrement: () => void;
  className?: string;
}

export const CounterControlBlock: React.FC<CounterControlBlockProps> = ({
  value,
  min = 0,
  max = 10,
  onDecrement,
  onIncrement,
  className = "",
}) => (
  <div className={`flex items-center space-x-1.5 flex-shrink-0 ${className}`}>
    <Button
      variant="outline"
      size="icon"
      className="h-6 w-6 flex-shrink-0"
      onClick={onDecrement}
      disabled={value <= min}
    >
      -
    </Button>
    <span className="text-sm font-medium w-8 text-center tabular-nums select-none">{value}</span>
    <Button
      variant="outline"
      size="icon"
      className="h-6 w-6 flex-shrink-0"
      onClick={onIncrement}
      disabled={value >= max}
    >
      +
    </Button>
  </div>
); 