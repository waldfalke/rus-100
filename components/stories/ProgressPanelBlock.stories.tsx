import { ProgressPanelBlock } from "../ui/ProgressPanelBlock";
import type { Meta, StoryObj } from "@storybook/react";

const meta: Meta<typeof ProgressPanelBlock> = {
  title: "Blocks/ProgressPanelBlock",
  component: ProgressPanelBlock,
};
export default meta;

type Story = StoryObj<typeof ProgressPanelBlock>;

export const Default: Story = {
  args: {
    totalSelected: 12,
    totalLimit: 50,
    progress: 24,
    buttonText: "Создать тест",
    onCreate: () => alert("Тест создан!"),
  },
}; 