import type { Meta, StoryObj } from '@storybook/react';
import { MyChip } from '../ui/MyChip';

const meta: Meta<typeof MyChip> = {
  title: 'Components/MyChip',
  component: MyChip,
  parameters: {
    docs: {
      description: {
        component: 'Чипс для выбора сложности задания. Поддерживает одиночный и множественный выбор.'
      }
    }
  }
};
export default meta;

type Story = StoryObj<typeof MyChip>;

export const Default: Story = {
  args: {
    label: 'Сложность 1',
    selected: false,
  },
};

export const Selected: Story = {
  args: {
    label: 'Сложность 2',
    selected: true,
  },
}; 