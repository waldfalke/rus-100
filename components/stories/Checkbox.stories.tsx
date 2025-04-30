import { Checkbox } from "../ui/checkbox";
import type { Meta, StoryObj } from "@storybook/react";

const meta: Meta<typeof Checkbox> = {
  title: "UI/Checkbox",
  component: Checkbox,
  tags: ["autodocs"],
};
export default meta;

type Story = StoryObj<typeof Checkbox>;

export const Default: Story = {
  args: {
    checked: false,
  },
};

export const Checked: Story = {
  args: {
    checked: true,
  },
};

export const Disabled: Story = {
  args: {
    disabled: true,
  },
};

export const WithLabel: Story = {
  render: () => (
    <label style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
      <Checkbox />
      Согласен с условиями
    </label>
  ),
};

export const Error: Story = {
  render: () => (
    <div>
      <Checkbox />
      <span className="text-xs text-red-500" style={{ marginLeft: 8 }}>Ошибка: выберите опцию</span>
    </div>
  ),
}; 