import { SelectableExamText } from "../ui/selectable-exam-text";
import type { Meta, StoryObj } from "@storybook/react";

const meta: Meta<typeof SelectableExamText> = {
  title: "Blocks/ExamTextBlock",
  component: SelectableExamText,
};
export default meta;

type Story = StoryObj<typeof SelectableExamText>;

export const Default: Story = {
  render: () => <SelectableExamText />,
}; 