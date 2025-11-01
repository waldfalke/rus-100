// Code Contracts: PENDING
// @token-status: COMPLETED (Uses all token variables: bg-background, border-border, text-foreground, text-muted-foreground)
import React from "react";
import { ChevronDown, ChevronUp } from "lucide-react";

interface TaskCategoryBlockProps {
  category: { category: string; items: any[] };
  expanded: boolean;
  onToggle: () => void;
  renderItem: (item: any) => React.ReactNode;
}

export const TaskCategoryBlock: React.FC<TaskCategoryBlockProps> = ({
  category,
  expanded,
  onToggle,
  renderItem,
}) => (
  <div className="mb-6">
    <div
      className="flex items-center justify-between bg-background border border-border p-2 sm:p-3 rounded-lg cursor-pointer"
      onClick={onToggle}
    >
      <h3 className="font-source-serif-pro font-medium text-foreground">{category.category}</h3>
      {expanded ? (
        <ChevronUp className="w-5 h-5 text-muted-foreground" />
      ) : (
        <ChevronDown className="w-5 h-5 text-muted-foreground" />
      )}
    </div>
    {expanded && (
      <div className="mt-2 sm:mt-3 space-y-2 sm:space-y-3">
        {category.items?.map((item, index) => <div key={index}>{renderItem(item)}</div>)}
      </div>
    )}
  </div>
); 