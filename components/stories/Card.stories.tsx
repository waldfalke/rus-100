import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "../ui/card";
import type { Meta, StoryObj } from "@storybook/react";
import { tasksData } from "@/data/test-content";
import { Button } from "@/components/ui/button";

const meta: Meta<typeof Card> = {
  title: "UI/Card",
  component: Card,
  tags: ["autodocs"],
};
export default meta;

type Story = StoryObj<typeof Card>;

export const Default: Story = {
  render: () => (
    <Card>
      <CardHeader>
        <CardTitle>Card Title</CardTitle>
      </CardHeader>
      <CardContent>
        Card content goes here.
      </CardContent>
      <CardFooter>
        Card footer
      </CardFooter>
    </Card>
  ),
};

export const WithActions: Story = {
  render: () => (
    <Card>
      <CardHeader>
        <CardTitle>Card with Actions</CardTitle>
      </CardHeader>
      <CardContent>
        Card content goes here.
      </CardContent>
      <CardFooter>
        <Button variant="outline" style={{ marginRight: 8 }}>Cancel</Button>
        <Button>Save</Button>
      </CardFooter>
    </Card>
  ),
};

export const WithIcon: Story = {
  render: () => (
    <Card>
      <CardHeader>
        <CardTitle>
          <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" style={{ marginRight: 6, verticalAlign: 'middle' }}><circle cx="12" cy="12" r="10"/></svg>
          Card with Icon
        </CardTitle>
      </CardHeader>
      <CardContent>
        Card content goes here.
      </CardContent>
    </Card>
  ),
};

export const CategoryBlock = {
  render: () => (
    <div style={{ background: '#f8fafc', padding: 24, borderRadius: 16 }}>
      <h2 className="text-xl font-semibold mb-16">{tasksData[0].category}</h2>
      {tasksData[0].items.map((item) => (
        <Card key={item.id} style={{ marginBottom: 12 }}>
          <CardContent>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <span>{item.title}</span>
              <Button>+ Добавить</Button>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  ),
}; 