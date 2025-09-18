import type { Meta, StoryObj } from '@storybook/react';
import Page from '../../app/account/page'; 
import { TopNavBlock } from '@/components/ui/TopNavBlock'; 
import { Toaster } from '@/components/ui/sonner';

// Определяем Meta 
const meta: Meta<typeof Page> = {
  title: 'Pages/Account',
  component: Page,
  parameters: {
    layout: 'fullscreen',
  },
  tags: ['autodocs'],
  decorators: [
    (Story) => (
      <div className="min-h-screen flex flex-col bg-gray-100">
        <Story />
        <Toaster />
      </div>
    ),
  ],
};

export default meta;

// Определяем тип Story
type Story = StoryObj<typeof Page>;

// Базовая история для страницы аккаунта
export const Default: Story = {
  name: "Account Page",
}; 