import { Switch } from "../ui/switch";
import type { Meta, StoryObj } from "@storybook/react";

const meta: Meta<typeof Switch> = {
  title: "UI/Switch",
  component: Switch,
  tags: ["autodocs"],
};
export default meta;

type Story = StoryObj<typeof Switch>;

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
      <Switch />
      Включить уведомления
    </label>
  ),
};

export const Error: Story = {
  render: () => (
    <div>
      <Switch />
      <span className="text-xs text-red-500" style={{ marginLeft: 8 }}>Ошибка: выберите опцию</span>
    </div>
  ),
}; 