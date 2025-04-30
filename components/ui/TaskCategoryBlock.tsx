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
      className="flex items-center justify-between bg-gray-50 p-2 sm:p-3 rounded-lg cursor-pointer"
      onClick={onToggle}
    >
      <h3 className="font-medium text-gray-800">{category.category}</h3>
      {expanded ? (
        <ChevronUp className="w-5 h-5 text-gray-500" />
      ) : (
        <ChevronDown className="w-5 h-5 text-gray-500" />
      )}
    </div>
    {expanded && (
      <div className="mt-2 sm:mt-3 space-y-2 sm:space-y-3">
        {category.items?.map((item) => renderItem(item))}
      </div>
    )}
  </div>
); 