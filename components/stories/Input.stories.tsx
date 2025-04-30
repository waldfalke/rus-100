import { Input } from "../ui/input";
import type { Meta, StoryObj } from "@storybook/react";

const meta: Meta<typeof Input> = {
  title: "UI/Input",
  component: Input,
  tags: ["autodocs"],
};
export default meta;

type Story = StoryObj<typeof Input>;

export const Default: Story = {
  args: {
    value: "",
    placeholder: "Type here...",
  },
};

export const Disabled: Story = {
  args: {
    value: "",
    placeholder: "Disabled input",
    disabled: true,
  },
};

export const WithValue: Story = {
  args: {
    value: "Hello, world!",
  },
};

export const WithLabel: Story = {
  render: () => (
    <label style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
      <span>Имя пользователя</span>
      <Input placeholder="Введите имя" />
    </label>
  ),
};

export const Error: Story = {
  render: () => (
    <div>
      <Input placeholder="Ошибка" />
      <span className="text-xs text-red-500" style={{ marginLeft: 4 }}>Ошибка: заполните поле</span>
    </div>
  ),
}; 