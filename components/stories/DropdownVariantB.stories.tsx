import type { Meta, StoryObj } from '@storybook/react';
import { DropdownVariantB } from '../ui/DropdownVariantB';

const meta: Meta<typeof DropdownVariantB> = {
  title: 'Components/Dropdown/VariantB',
  component: DropdownVariantB,
  parameters: {
    docs: {
      description: {
        component: 'Вариант B выпадающего меню. Кастомная реализация с кнопками.'
      }
    }
  }
};
export default meta;

type Story = StoryObj<typeof DropdownVariantB>;

export const Default: Story = {
  args: {
    options: ['Option 1', 'Option 2', 'Option 3'],
    value: 'Option 1',
    onChange: () => {},
  },
}; 