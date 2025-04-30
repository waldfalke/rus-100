import { Progress } from "../ui/progress";
import type { Meta, StoryObj } from "@storybook/react";

const meta: Meta<typeof Progress> = {
  title: "UI/Progress",
  component: Progress,
  tags: ["autodocs"],
};
export default meta;

type Story = StoryObj<typeof Progress>;

export const Default: Story = {
  args: {
    value: 50,
  },
};

export const WithLabel: Story = {
  render: () => (
    <div style={{ width: 300 }}>
      <span className="text-sm mb-2 block">Прогресс выполнения</span>
      <Progress value={75} />
    </div>
  ),
};

export const Complete: Story = {
  args: {
    value: 100,
  },
};

export const ProgressPanel = {
  render: () => (
    <div style={{ background: '#fff', border: '1px solid #e5e7eb', borderRadius: 12, padding: 24, display: 'flex', alignItems: 'center', gap: 24 }}>
      <div className="text-base font-medium">Выбрано заданий: <span className="text-emerald-600 font-bold">12 / 50</span></div>
      <div style={{ flex: 1 }}>
        <Progress value={24} />
      </div>
      <button className="bg-emerald-600 text-white border-none border-radius-8 px-12 py-2 font-bold text-base">Создать тест</button>
    </div>
  ),
}; 