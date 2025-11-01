# Onboarding Exercise for New AI Agents

**Purpose:** Learn methodology through hands-on practice.

**📍 Navigation:** See [`../RND-INDEX.md`](../RND-INDEX.md) for complete ecosystem map

**Prerequisite:** Read [`../distilled-methodology/README.md`](../distilled-methodology/README.md) and [`../distilled-methodology/rules/00-universal.md`](../distilled-methodology/rules/00-universal.md)

---

## Exercise Overview

You will create a simple Card component following Contract-Driven methodology from scratch.

**Goal:** Understand the full workflow, not create a perfect component.

**Time estimate:** 15-20 minutes of focused work.

---

## Exercise: Create Card Component

### Requirements

Create a Card component with:
- Title and description content
- Optional image
- Optional footer with actions
- Two variants: default and highlighted
- Hover state

### Step 1: Assess Complexity (2 min)

**Your task:** Determine Cynefin domain.

**Questions:**
1. Is the solution known? (Cards are standard UI pattern)
2. Are requirements clear and stable?
3. Will it work identically everywhere?

**Answer:** [Write your answer here before continuing]

<details>
<summary>Show correct answer</summary>

**Domain:** Clear (Simple)

**Why:**
- Card is established pattern
- Requirements are clear
- Solution is known and repeatable
- No device variance or unknowns

**Implication:** Contract should be precise and detailed.
</details>

---

### Step 2: Write Contract (5 min)

**Your task:** Create `CONTRACT-CARD-001.yml`

**Use template:** Copy from `templates/CONTRACT-COMPONENT.yml`

**Fill these sections:**
- id, title, type, description
- cynefin_domain: simple
- props (required and optional)
- variants (default, highlighted)
- states (default, hover)
- dependencies.tokens (what tokens you'll use)
- scope (mutable and invariant)
- acceptance_criteria (minimum 3 criteria)

**Try it yourself before looking at solution.**

<details>
<summary>Show example solution</summary>

```yaml
id: CONTRACT-CARD-001
title: Card Component
type: component
description: Container for related content with optional image and actions
cynefin_domain: simple

props:
  required:
    - name: title
      type: string
      description: Card title
    - name: description
      type: string
      description: Card description content
  
  optional:
    - name: image
      type: string
      description: Image URL
    - name: footer
      type: React.ReactNode
      description: Footer content (usually actions)
    - name: variant
      type: "'default' | 'highlighted'"
      default: default
      description: Visual variant
    - name: className
      type: string
      description: Additional CSS classes

variants:
  - name: default
    description: Standard card appearance
    props:
      variant: default
  
  - name: highlighted
    description: Emphasized card (e.g., featured content)
    props:
      variant: highlighted

states:
  - default
  - hover

invariants:
  - "Card must use design tokens for colors and spacing"
  - "Image must be optional"
  - "Card must have semantic HTML structure"

dependencies:
  tokens:
    - color.background
    - color.border
    - spacing.4
    - spacing.6
    - radius.lg
    - shadow.md

scope:
  mutable:
    - components/Card/*
    - stories/Card.stories.tsx
  invariant:
    - design-tokens/*.json
    - components/* (other components)
    - app/globals.css

acceptance_criteria:
  - criterion: "Both variants render correctly"
    validation: visual
  - criterion: "Card uses only design tokens (no hardcoded values)"
    validation: automated
  - criterion: "Card is accessible (semantic HTML, proper contrast)"
    validation: automated
```
</details>

---

### Step 3: Identify Tokens (2 min)

**Your task:** List exact tokens Card will use.

**Hint:** Check `templates/design-tokens.json` for available tokens.

**List:**
- Background color: ?
- Border color: ?
- Spacing: ?
- Border radius: ?
- Shadow: ?
- Highlighted background: ?

<details>
<summary>Show example tokens</summary>

From `design-tokens.json`:
- Background: `color.semantic.background` (white)
- Border: `color.base.gray.200`
- Spacing: `spacing.4` (1rem), `spacing.6` (1.5rem)
- Radius: `radius.lg` (0.5rem)
- Shadow: `shadow.md`
- Highlighted: `color.base.blue.50` (light blue background)
</details>

---

### Step 4: Implement Component (5 min)

**Your task:** Create `Card.tsx` following contract.

**Remember:**
- Use Tailwind classes (represent tokens)
- No hardcoded values
- Handle all variants and states
- Semantic HTML

**Key classes:**
```tsx
// Base
"bg-background border border-gray-200 rounded-lg p-6 shadow-md"

// Hover
"hover:shadow-lg transition-shadow"

// Highlighted variant
variant === 'highlighted' && "bg-blue-50 border-primary"
```

<details>
<summary>Show example implementation</summary>

```typescript
// Card.types.ts
export interface CardProps {
  title: string;
  description: string;
  image?: string;
  footer?: React.ReactNode;
  variant?: 'default' | 'highlighted';
  className?: string;
}

// Card.tsx
import { cn } from '@/lib/utils';
import type { CardProps } from './Card.types';

export function Card({
  title,
  description,
  image,
  footer,
  variant = 'default',
  className,
}: CardProps) {
  return (
    <article
      className={cn(
        // Base styles
        'bg-background border border-gray-200 rounded-lg shadow-md transition-shadow hover:shadow-lg',
        // Variant
        variant === 'highlighted' && 'bg-blue-50 border-primary',
        className
      )}
    >
      {image && (
        <img
          src={image}
          alt=""
          className="w-full h-48 object-cover rounded-t-lg"
        />
      )}
      
      <div className="p-6">
        <h3 className="text-xl font-semibold mb-2">{title}</h3>
        <p className="text-gray-600">{description}</p>
      </div>
      
      {footer && (
        <div className="px-6 pb-6 pt-0">
          {footer}
        </div>
      )}
    </article>
  );
}
```
</details>

---

### Step 5: Self-Validation (3 min)

**Your task:** Check your implementation against contract.

**Checklist:**
- [ ] All required props implemented?
- [ ] Optional props handled?
- [ ] Both variants working?
- [ ] Hover state present?
- [ ] Using only tokens (no #3B82F6 or 16px)?
- [ ] Semantic HTML (<article>)?
- [ ] Proper accessibility (image alt, heading structure)?
- [ ] Only modified files in mutable scope?

**Score yourself:** How many checks passed?

---

### Step 6: Identify Mistakes (2 min)

**Your task:** Review for anti-patterns.

**Check for:**
1. Hardcoded colors?
2. Inline px values?
3. Non-semantic HTML (<div> instead of <article>)?
4. Missing alt text?
5. No variant handling?
6. Modified files outside scope?

**Common mistakes in this exercise:**
- Using `<div>` instead of `<article>`
- Hardcoding shadow: `box-shadow: 0 4px 6px rgba(0,0,0,0.1)`
- Missing image alt text
- Not handling optional footer

---

## Learning Checkpoint

### Key Concepts Applied

**1. Contract-First:**
Did you write contract before code? ✓

**2. Cynefin Classification:**
Did you identify as Simple domain? ✓

**3. Token Usage:**
Did you use tokens, not hardcoded values? ✓

**4. Blast Radius:**
Did you only modify files in mutable scope? ✓

**5. Semantic HTML:**
Did you use proper elements? ✓

### What You Learned

- [ ] How to assess Cynefin domain
- [ ] How to write a contract
- [ ] How to identify token dependencies
- [ ] How to implement from contract
- [ ] How to self-validate
- [ ] How to spot anti-patterns

---

## Next Steps

### If you passed all checks:
✅ You understand the basics!

**Continue to:** Real project work or advanced exercises.

### If you missed some checks:
⚠️ Review the sections you missed.

**Re-read:**
- Missed Cynefin? → `rules/01-cynefin.md`
- Hardcoded values? → `memories/anti-patterns.md` (#6)
- Contract wrong? → Review `templates/CONTRACT-COMPONENT.yml`

**Then:** Retry the exercise.

---

## Advanced Exercise (Optional)

**Challenge:** Make Card component support dark theme.

**New requirements:**
- Respect user's theme preference
- Use semantic tokens (not base colors)
- Add theme-aware tokens to contract

**What changes:**
1. Contract: Add theme tokens
2. Tokens: Create semantic layer
3. Implementation: Use semantic tokens
4. Test: Verify both themes

**Try it:** This moves from Simple to Complicated domain (theming adds complexity).

---

## Reflection Questions

**Answer these to solidify learning:**

1. Why is Card in Simple domain?
2. What would make it Complex? (Give example scenario)
3. Why use tokens instead of hardcoded values?
4. What is blast radius for Card component?
5. How would you test this component?

**Write answers, then discuss with team or review documentation.**

---

## Common Confusion Points

### "Can I add extra props?"

**Answer:** Only if in contract. Contract is source of truth.

**If need more props:** Update contract first, then implement.

### "What if I don't know which token?"

**Answer:** Check `design-tokens.json` for available tokens.

**If token missing:** Create token first, then use it.

### "Can I make it prettier?"

**Answer:** Define "prettier" in contract first.

**Subjective changes need contract specification.**

### "What about edge cases?"

**Simple domain:** Edge cases should be rare. If many appear → reconsider domain.

**Document them:** Add to contract as you discover.

---

## Graduation

**You've completed onboarding when:**
- [ ] Completed this exercise
- [ ] Passed self-validation
- [ ] Understood key concepts
- [ ] Can explain to others

**Welcome to Contract-Driven Development! 🎉**

**Your first real task:** Apply this process to actual project component.

---

**Support:** If stuck, review:
- `README.md` - Overview
- `rules/00-universal.md` - Core principles
- `cookbook/01-button-simple-domain.md` - Similar example
- `workflows/create-component.md` - Detailed process
