import type { Meta, StoryObj } from '@storybook/react';
import { DropdownVariantA } from '../ui/DropdownVariantA';

const meta: Meta<typeof DropdownVariantA> = {
  title: 'Components/Dropdown/VariantA',
  component: DropdownVariantA,
  parameters: {
    docs: {
      description: {
        component: 'Вариант A выпадающего меню. Простой select.'
      }
    }
  }
};
export default meta;

type Story = StoryObj<typeof DropdownVariantA>;

export const Default: Story = {
  args: {
    options: ['Option 1', 'Option 2', 'Option 3'],
    value: 'Option 1',
    onChange: () => {},
  },
}; 