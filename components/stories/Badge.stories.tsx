import { Badge } from "../ui/badge";
import type { Meta, StoryObj } from "@storybook/react";

const meta: Meta<typeof Badge> = {
  title: "UI/Badge",
  component: Badge,
  tags: ["autodocs"],
};
export default meta;

type Story = StoryObj<typeof Badge>;

export const Default: Story = {
  args: {
    children: "Default Badge",
  },
};

export const Secondary: Story = {
  args: {
    children: "Secondary Badge",
    variant: "secondary",
  },
};

export const Outline: Story = {
  args: {
    children: "Outline Badge",
    variant: "outline",
  },
};

export const WithIcon: Story = {
  args: {
    children: (
      <>
        <svg width="12" height="12" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" style={{ marginRight: 4 }}><circle cx="12" cy="12" r="10"/></svg>
        Badge с иконкой
      </>
    ),
  },
};

export const CustomColor: Story = {
  args: {
    children: "Custom Color",
    style: { backgroundColor: '#ff9800', color: '#fff' },
  },
}; 