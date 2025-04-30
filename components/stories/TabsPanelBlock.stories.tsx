import { TabsPanelBlock } from "../ui/TabsPanelBlock";
import type { Meta, StoryObj } from "@storybook/react";

const meta: Meta<typeof TabsPanelBlock> = {
  title: "Blocks/TabsPanelBlock",
  component: TabsPanelBlock,
};
export default meta;

type Story = StoryObj<typeof TabsPanelBlock>;

export const Default: Story = {
  render: () => <TabsPanelBlock />,
}; 