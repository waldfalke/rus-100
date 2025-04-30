import type { Meta, StoryObj } from '@storybook/react';
import { ThemeProvider } from '../theme-provider';

const meta: Meta<typeof ThemeProvider> = {
  title: 'Components/ThemeProvider',
  component: ThemeProvider,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof ThemeProvider>;

export const Default: Story = {
  args: {
    children: <div>Theme Provider Content</div>,
  },
}; 