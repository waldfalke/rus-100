import React, { useState } from "react";
import { TaskCategoryAccordion } from "../ui/TaskCategoryAccordion";
import type { Meta, StoryObj } from "@storybook/react";

const mockCategory = {
  category: "Работа с текстом",
  items: [
    { id: "1", title: "№1. Средства связи предложений в тексте" },
    { id: "2", title: "№2. Определение темы и главной мысли текста" },
  ],
};

const meta: Meta<typeof TaskCategoryAccordion> = {
  title: "Blocks/TaskCategoryAccordion",
  component: TaskCategoryAccordion,
};

export default meta;

type Story = StoryObj<typeof TaskCategoryAccordion>;

export const Default: Story = {
  render: () => {
    const [isOpen, setIsOpen] = useState(true);
    
    return (
      <TaskCategoryAccordion
        title={mockCategory.category}
        isOpen={isOpen}
        onToggle={() => setIsOpen(prev => !prev)}
      >
        <div className="space-y-2 sm:space-y-3">
          {mockCategory.items.map((item) => (
            <div key={item.id} className="bg-white rounded shadow p-3 text-sm text-gray-800">
              {item.title}
            </div>
          ))}
        </div>
      </TaskCategoryAccordion>
    );
  },
}; 