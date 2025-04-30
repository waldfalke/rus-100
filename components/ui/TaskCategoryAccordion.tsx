import React from "react";

interface TaskCategoryAccordionProps {
  title: string;
  children: React.ReactNode;
  isOpen: boolean;
  onToggle: () => void;
}

export const TaskCategoryAccordion: React.FC<TaskCategoryAccordionProps> = ({
  title,
  children,
  isOpen,
  onToggle,
}) => (
  <div className="border rounded mb-2">
    <button
      className="w-full flex justify-between items-center px-4 py-2 bg-gray-100 hover:bg-gray-200 focus:outline-none"
      onClick={onToggle}
      aria-expanded={isOpen}
    >
      <span>{title}</span>
      <span>{isOpen ? "▲" : "▼"}</span>
    </button>
    {isOpen && <div className="p-4">{children}</div>}
  </div>
); 