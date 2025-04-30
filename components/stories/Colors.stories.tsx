import type { Meta, StoryObj } from "@storybook/react";

const COLORS = [
  "background", "foreground", "card", "card-foreground", "popover", "popover-foreground",
  "primary", "primary-foreground", "secondary", "secondary-foreground", "muted", "muted-foreground",
  "accent", "accent-foreground", "destructive", "destructive-foreground", "border", "input", "ring",
  "chart-1", "chart-2", "chart-3", "chart-4", "chart-5",
  "sidebar-background", "sidebar-foreground", "sidebar-primary", "sidebar-primary-foreground",
  "sidebar-accent", "sidebar-accent-foreground", "sidebar-border", "sidebar-ring"
];

const meta: Meta = {
  title: "Tokens/Colors",
};
export default meta;

type Story = StoryObj;

export const AllColors: Story = {
  render: () => (
    <div style={{ display: "flex", flexWrap: "wrap", gap: 16 }}>
      {COLORS.map((token) => (
        <div key={token} style={{ width: 120, marginBottom: 16 }}>
          <div style={{
            width: 48,
            height: 48,
            borderRadius: 8,
            background: `hsl(var(--${token}))`,
            border: "1px solid #ccc",
            marginBottom: 8,
          }} />
          <div className="text-xs">{token}</div>
        </div>
      ))}
    </div>
  ),
}; 