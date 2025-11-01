# Workflow: Create Component

**Purpose:** Step-by-step procedure for creating a new component following Contract-Driven methodology.

---

## Step 1: Analyze Requirements

Assess Cynefin domain:
- Known solution? → Simple
- Expert can determine? → Complicated
- Emergent solution? → Complex
- Urgent firefighting? → Chaotic

Determine scope:
- What files will this affect?
- What dependencies?
- What must remain invariant?

---

## Step 2: Write Contract

Location: `contracts/CONTRACT-[NAME]-001.yml`

Use template: Copy `templates/CONTRACT-COMPONENT.yml`

For Simple/Complicated:
- Precise props with types
- All variants explicitly defined
- Detailed acceptance criteria

For Complex:
- Props as interfaces
- Invariants and constraints
- Anti-patterns
- Less prescription, more boundaries

Required fields:
- id, props, scope, acceptance_criteria

Validate with schema checker.

---

## Step 3: Identify Token Dependencies

Check if component needs:
- Colors, spacing, typography, shadows, radius

Add to contract dependencies section.

Rule: Never hardcode values that should be tokens.

---

## Step 4: Generate Component Structure

Create files:
```
components/[Name]/
├── [Name].tsx
├── [Name].types.ts
├── [Name].stories.tsx
├── index.ts
└── CONTRACT.yml
```

---

## Step 5: Implement Component

Guidelines:
1. Use tokens, never hardcode
2. Follow contract variants exactly
3. Handle all states from contract
4. Stay within blast radius
5. Ensure accessibility

---

## Step 6: Create Storybook Stories

Cover all contract scenarios:
- Each variant
- Each state
- Edge cases

All acceptance criteria must be demonstrable.

---

## Step 7: Validate Against Contract

Automated checks:
- Schema validation
- Lint
- Tests

Manual verification:
- All props implemented?
- All variants working?
- No hardcoded values?
- Only mutable files changed?

---

## Step 8: Update Exports and Registry

Add to barrel export and contract registry.

---

## Step 9: Checkpoint

Before marking complete verify all criteria met.

---

## Anti-Patterns

- Writing code before contract
- Hardcoding values
- Modifying files outside scope
- Skipping validation
- Over-specifying in Complex domain

---

## Context Management

If forgetting decisions or inventing facts:
Checkpoint, reset context, reload contract and current step.
