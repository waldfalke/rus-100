import { Tooltip, TooltipTrigger, TooltipContent, TooltipProvider } from "../ui/tooltip";
import type { Meta, StoryObj } from "@storybook/react";

const meta: Meta<typeof Tooltip> = {
  title: "UI/Tooltip",
  component: Tooltip,
  tags: ["autodocs"],
};
export default meta;

type Story = StoryObj<typeof Tooltip>;

export const Default: Story = {
  render: () => (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger>
          <button>Hover me</button>
        </TooltipTrigger>
        <TooltipContent>
          Tooltip content
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  ),
};

export const LongText: Story = {
  render: () => (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger>
          <button>Наведи для длинного текста</button>
        </TooltipTrigger>
        <TooltipContent>
          Это очень длинный текст тултипа, который демонстрирует перенос строк и адаптацию размера.
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  ),
};

export const CustomPosition: Story = {
  render: () => (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger>
          <button>Наведи для тултипа справа</button>
        </TooltipTrigger>
        <TooltipContent side="right">
          Tooltip справа
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  ),
}; 