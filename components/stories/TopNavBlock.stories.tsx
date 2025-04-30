import { TopNavBlock } from "../ui/TopNavBlock";
import type { Meta, StoryObj } from "@storybook/react";

const meta: Meta<typeof TopNavBlock> = {
  title: "Blocks/TopNavBlock",
  component: TopNavBlock,
};
export default meta;

type Story = StoryObj<typeof TopNavBlock>;

export const Default: Story = {
  render: () => <TopNavBlock />,
}; 