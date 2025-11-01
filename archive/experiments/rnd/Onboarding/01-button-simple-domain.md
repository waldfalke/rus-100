# Cookbook: Button Component (Simple Domain)

**Cynefin:** Simple  
**Complexity:** Low  
**Precision:** High - exact specification possible

---

## Contract

```yaml
id: CONTRACT-BUTTON-001
title: Button Component
type: component
description: Interactive button with multiple variants and sizes
cynefin_domain: simple

props:
  required:
    - name: children
      type: React.ReactNode
      description: Button text or content
    - name: onClick
      type: () => void
      description: Click handler function
  
  optional:
    - name: variant
      type: "'primary' | 'secondary' | 'outline'"
      default: primary
      description: Visual style variant
    - name: size
      type: "'sm' | 'md' | 'lg'"
      default: md
      description: Button size
    - name: disabled
      type: boolean
      default: false
      description: Disabled state
    - name: className
      type: string
      description: Additional CSS classes

variants:
  - name: primary
    description: Main call-to-action
    props:
      variant: primary
  - name: secondary
    description: Secondary actions
    props:
      variant: secondary
  - name: outline
    description: Tertiary actions
    props:
      variant: outline

states:
  - default
  - hover
  - focus
  - active
  - disabled

invariants:
  - "Button must use design tokens for all colors and spacing"
  - "Button must be keyboard accessible"
  - "Disabled button must not trigger onClick"
  - "Button must have minimum touch target of 44x44px"

constraints:
  performance:
    - "No layout shift on hover/focus"
  accessibility:
    - "WCAG AA contrast ratio (4.5:1 for text)"
    - "Keyboard focusable and activatable"
    - "Screen reader accessible"
  browser_support:
    - "Chrome 90+"
    - "Firefox 88+"
    - "Safari 14+"

dependencies:
  tokens:
    - color.primary
    - color.secondary
    - color.text
    - spacing.2
    - spacing.3
    - spacing.4
    - radius.md
    - animation.duration.base

scope:
  mutable:
    - components/Button/*
    - stories/Button.stories.tsx
  invariant:
    - design-tokens/*.json
    - app/globals.css
    - components/* (other components)

anti_patterns:
  - pattern: "Hardcoding colors like #3B82F6"
    reason: "Breaks token system, creates inconsistency"
    alternative: "Use bg-primary or CSS var(--color-primary)"
  
  - pattern: "Using <div onClick>"
    reason: "Not keyboard accessible, wrong semantics"
    alternative: "Use <button> element"
  
  - pattern: "Inline styles for spacing"
    reason: "Doesn't follow spacing scale"
    alternative: "Use Tailwind spacing classes (px-4, py-2)"

acceptance_criteria:
  - criterion: "All variants render with correct colors"
    validation: visual
  - criterion: "All sizes have correct padding and font-size"
    validation: visual
  - criterion: "Disabled state prevents onClick execution"
    validation: unit-test
  - criterion: "Button is keyboard accessible (Tab + Enter)"
    validation: integration-test
  - criterion: "No hardcoded colors or spacing values"
    validation: automated
  - criterion: "TypeScript types match contract"
    validation: automated
```

---

## Implementation

### Button.types.ts

```typescript
export interface ButtonProps {
  children: React.ReactNode;
  onClick: () => void;
  variant?: 'primary' | 'secondary' | 'outline';
  size?: 'sm' | 'md' | 'lg';
  disabled?: boolean;
  className?: string;
}
```

### Button.tsx

```typescript
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';
import type { ButtonProps } from './Button.types';

const buttonVariants = cva(
  // Base styles (always applied)
  'inline-flex items-center justify-center rounded-md font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50',
  {
    variants: {
      variant: {
        primary: 'bg-primary text-white hover:bg-primary/90',
        secondary: 'bg-secondary text-white hover:bg-secondary/90',
        outline: 'border border-primary text-primary hover:bg-primary hover:text-white',
      },
      size: {
        sm: 'h-9 px-3 text-sm',
        md: 'h-10 px-4 py-2',
        lg: 'h-11 px-8 text-lg',
      },
    },
    defaultVariants: {
      variant: 'primary',
      size: 'md',
    },
  }
);

export function Button({
  children,
  onClick,
  variant = 'primary',
  size = 'md',
  disabled = false,
  className,
}: ButtonProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className={cn(buttonVariants({ variant, size }), className)}
    >
      {children}
    </button>
  );
}
```

### Button.stories.tsx

```typescript
import type { Meta, StoryObj } from '@storybook/react';
import { Button } from './Button';

const meta: Meta<typeof Button> = {
  title: 'Components/Button',
  component: Button,
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: 'select',
      options: ['primary', 'secondary', 'outline'],
    },
    size: {
      control: 'select',
      options: ['sm', 'md', 'lg'],
    },
  },
};

export default meta;
type Story = StoryObj<typeof Button>;

// Variants
export const Primary: Story = {
  args: {
    children: 'Primary Button',
    variant: 'primary',
    onClick: () => console.log('clicked'),
  },
};

export const Secondary: Story = {
  args: {
    children: 'Secondary Button',
    variant: 'secondary',
    onClick: () => console.log('clicked'),
  },
};

export const Outline: Story = {
  args: {
    children: 'Outline Button',
    variant: 'outline',
    onClick: () => console.log('clicked'),
  },
};

// Sizes
export const Small: Story = {
  args: {
    children: 'Small Button',
    size: 'sm',
    onClick: () => console.log('clicked'),
  },
};

export const Large: Story = {
  args: {
    children: 'Large Button',
    size: 'lg',
    onClick: () => console.log('clicked'),
  },
};

// States
export const Disabled: Story = {
  args: {
    children: 'Disabled Button',
    disabled: true,
    onClick: () => console.log('should not log'),
  },
};

// All variants in one view
export const AllVariants: Story = {
  render: () => (
    <div className="flex flex-col gap-4">
      <div className="flex gap-2">
        <Button variant="primary" onClick={() => {}}>Primary</Button>
        <Button variant="secondary" onClick={() => {}}>Secondary</Button>
        <Button variant="outline" onClick={() => {}}>Outline</Button>
      </div>
      <div className="flex gap-2">
        <Button size="sm" onClick={() => {}}>Small</Button>
        <Button size="md" onClick={() => {}}>Medium</Button>
        <Button size="lg" onClick={() => {}}>Large</Button>
      </div>
      <div className="flex gap-2">
        <Button disabled onClick={() => {}}>Disabled</Button>
      </div>
    </div>
  ),
};
```

---

## Key Learnings

### Why Simple Domain

1. **Solution is known:** Button patterns are established
2. **No ambiguity:** Variants, sizes, states are clear
3. **Repeatable:** Same pattern works for all button needs
4. **Testable:** All scenarios can be enumerated

### Contract Precision

Because this is Simple domain:
- Exact variants specified (primary, secondary, outline)
- Exact sizes specified (sm, md, lg)
- Exact states specified (default, hover, focus, active, disabled)
- No "figure it out as you go" - everything predetermined

### Token Usage

All styling uses tokens:
- `bg-primary` → CSS var `--color-primary`
- `px-4` → `1rem` from spacing scale
- `rounded-md` → `0.375rem` from radius scale

No hardcoded values in implementation.

### Blast Radius

Changes confined to:
- `components/Button/*`
- `stories/Button.stories.tsx`

Cannot touch:
- Other components
- Global styles
- Token definitions

### Validation

Automated:
- TypeScript catches prop misuse
- Lint rules catch hardcoded values
- Unit tests verify disabled state

Visual:
- Storybook shows all variants
- Manual QA verifies appearance

---

## Anti-Pattern Example

**❌ Wrong:**
```typescript
// Hardcoded colors
<button style={{ backgroundColor: '#3B82F6', color: 'white' }}>
  Click me
</button>

// Non-semantic HTML
<div onClick={handleClick} className="looks-like-button">
  Click me
</div>

// Magic numbers
<button className="px-[17px] py-[9px]">
  Click me
</button>
```

**✅ Correct:**
```typescript
// Uses tokens via Tailwind classes
<button className="bg-primary text-white px-4 py-2 rounded-md">
  Click me
</button>

// Or via component
<Button variant="primary" onClick={handleClick}>
  Click me
</Button>
```

---

## Testing Checklist

- [ ] All variants visible in Storybook
- [ ] All sizes render correctly
- [ ] Disabled state prevents onClick
- [ ] Keyboard accessible (Tab, Enter, Space)
- [ ] Focus ring visible
- [ ] No hardcoded values (run lint)
- [ ] TypeScript types correct
- [ ] WCAG AA contrast passed

---

**Next:** See `02-scanner-complex-domain.md` for contrast with Complex domain component.
