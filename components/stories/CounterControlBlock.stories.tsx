import { CounterControlBlock } from "../ui/CounterControlBlock";
import type { Meta, StoryObj } from "@storybook/react";
import React, { useState } from "react";

const meta: Meta<typeof CounterControlBlock> = {
  title: "Blocks/CounterControlBlock",
  component: CounterControlBlock,
};
export default meta;

/**
 * Контрол для увеличения/уменьшения значения (например, количества задач).
 *
 * - Кнопки "+" и "-" управляют значением в заданных пределах.
 * - Значение и ограничения задаются через пропсы.
 */

type Story = StoryObj<typeof CounterControlBlock>;

export const Default: Story = {
  render: () => {
    const [value, setValue] = useState(1);
    return (
      <CounterControlBlock
        value={value}
        min={0}
        max={10}
        onDecrement={() => setValue((v) => Math.max(0, v - 1))}
        onIncrement={() => setValue((v) => Math.min(10, v + 1))}
      />
    );
  },
}; 