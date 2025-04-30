import { useState } from "react";
import { TestFormBlock } from "../ui/TestFormBlock";
import type { Meta, StoryObj } from "@storybook/react";

const meta: Meta<typeof TestFormBlock> = {
  title: "Blocks/TestFormBlock",
  component: TestFormBlock,
};
export default meta;

type Story = StoryObj<typeof TestFormBlock>;

export const Default: Story = {
  render: () => {
    const [testName, setTestName] = useState("");
    const [testGroup, setTestGroup] = useState<string | undefined>(undefined);
    const [account, setAccount] = useState<string | undefined>(undefined);
    return (
      <TestFormBlock
        testName={testName}
        onTestNameChange={setTestName}
        testGroup={testGroup}
        onTestGroupChange={setTestGroup}
        account={account}
        onAccountChange={setAccount}
      />
    );
  },
}; 