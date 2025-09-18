import { BreadcrumbsBlock } from "../ui/BreadcrumbsBlock";
import type { Meta, StoryObj } from "@storybook/react";

const meta: Meta<typeof BreadcrumbsBlock> = {
  title: "Blocks/BreadcrumbsBlock",
  component: BreadcrumbsBlock,
};
export default meta;

type Story = StoryObj<typeof BreadcrumbsBlock>;

export const Default: Story = {
  render: () => <BreadcrumbsBlock items={[
    { label: "Главная", href: "/" },
    { label: "Текущая страница" }
  ]} />,
}; 