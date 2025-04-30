import type { Meta, StoryObj } from "@storybook/react";

const RADII = [
  { name: "radius", value: "var(--radius)" },
];
const SPACING = [
  { name: "xs (4px)", value: 4 },
  { name: "sm (8px)", value: 8 },
  { name: "md (16px)", value: 16 },
  { name: "lg (24px)", value: 24 },
  { name: "xl (32px)", value: 32 },
];

const meta: Meta = {
  title: "Tokens/Spacing",
};
export default meta;

type Story = StoryObj;

export const Radii: Story = {
  render: () => (
    <div style={{ display: "flex", gap: 32 }}>
      {RADII.map((r) => (
        <div key={r.name} style={{ textAlign: "center" }}>
          <div style={{ width: 48, height: 48, background: "#eee", borderRadius: `var(--radius)`, border: "1px solid #ccc" }} />
          <div className="text-xs">{r.name}</div>
        </div>
      ))}
    </div>
  ),
};

export const SpacingBlocks: Story = {
  render: () => (
    <div style={{ display: "flex", alignItems: "flex-end", gap: 16 }}>
      {SPACING.map((s) => (
        <div key={s.name} style={{ width: s.value, height: s.value, background: "#ddd", border: "1px solid #bbb" }} title={s.name} />
      ))}
    </div>
  ),
}; 