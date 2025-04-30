import { RadioGroup, RadioGroupItem } from "../ui/radio-group";
import type { Meta, StoryObj } from "@storybook/react";

const meta: Meta<typeof RadioGroup> = {
  title: "UI/RadioGroup",
  component: RadioGroup,
  tags: ["autodocs"],
};
export default meta;

type Story = StoryObj<typeof RadioGroup>;

export const Default: Story = {
  render: () => (
    <RadioGroup defaultValue="1">
      <RadioGroupItem value="1" /> Option 1
      <RadioGroupItem value="2" /> Option 2
      <RadioGroupItem value="3" /> Option 3
    </RadioGroup>
  ),
};

export const Disabled: Story = {
  render: () => (
    <RadioGroup defaultValue="1" disabled>
      <RadioGroupItem value="1" /> Option 1
      <RadioGroupItem value="2" /> Option 2
      <RadioGroupItem value="3" /> Option 3
    </RadioGroup>
  ),
};

export const WithLabel: Story = {
  render: () => (
    <div>
      <label style={{ display: 'block', marginBottom: 8 }}>Выберите вариант:</label>
      <RadioGroup defaultValue="2">
        <RadioGroupItem value="1" /> Вариант 1
        <RadioGroupItem value="2" /> Вариант 2
        <RadioGroupItem value="3" /> Вариант 3
      </RadioGroup>
    </div>
  ),
};

export const Error: Story = {
  render: () => (
    <div>
      <RadioGroup defaultValue="1">
        <RadioGroupItem value="1" /> Вариант 1
        <RadioGroupItem value="2" /> Вариант 2
      </RadioGroup>
      <span className="text-xs text-red-500" style={{ marginLeft: 8 }}>Ошибка: выберите вариант</span>
    </div>
  ),
}; 