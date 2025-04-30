import { Separator } from "../ui/separator";
import type { Meta, StoryObj } from "@storybook/react";

const meta: Meta<typeof Separator> = {
  title: "UI/Separator",
  component: Separator,
  tags: ["autodocs"],
};
export default meta;

type Story = StoryObj<typeof Separator>;

export const Horizontal: Story = {
  render: () => (
    <div>
      <div>Section 1</div>
      <Separator className="my-4" />
      <div>Section 2</div>
    </div>
  ),
};

export const Vertical: Story = {
  render: () => (
    <div style={{ display: 'flex', alignItems: 'center', height: 40 }}>
      <span>Left</span>
      <Separator orientation="vertical" className="mx-4 h-6" />
      <span>Right</span>
    </div>
  ),
}; 