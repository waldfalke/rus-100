# Workflow: Testing Strategy Focused on Maintainability and Refactorability

**Purpose:** Make tests useful, cheap to maintain, and resilient to refactors, while catching UI regressions that “green tests” often miss.

---

## Testing Principles

- **Contract-first tests.** Tests verify the behavior defined in the contract files under `contracts/`, not incidental implementation.
- **Refactor-resilient.** Prefer black-box tests (public API, user-visible behavior). Minimize coupling to structure, DOM shape, exact class names.
- **Cost-aware.** Every test must have an owner and a maintenance budget. Delete or downgrade flaky/high-cost tests unless they catch high-severity bugs.
- **Fast feedback.** Keep unit/contract tests fast (<1s per suite). Run them on save/CI.
- **UI truth.** Visual and story-based checks are mandatory for components to avoid “green tests, broken UI”.

---

## Test Pyramid (with contract anchoring)

1. Unit & Contract Tests (70–80%)
   - Scope: pure logic, component props/variants aligned to `CONTRACT-*.yml`.
   - Tools: Vitest/Jest + Testing Library.
   - Artifact link: `traceability-matrix.csv` (Task → Contract → Test files).
2. Integration/Story Tests (15–20%)
   - Scope: component behavior across variants, accessibility, stories.
   - Tools: Storybook + @storybook/test-runner or Vitest + Testing Library.
3. Visual Regression (5–10%)
   - Scope: pixel/DOM-diff on critical stories/states.
   - Tools: Chromatic/Storycap/Playwright screenshot compare.

Note: E2E flows only for truly critical paths; guard cost aggressively.

---

## What to Test vs What to Avoid

- Test (stable):
  - Public API (props, emitted events, contracts’ acceptance criteria)
  - Variant logic (CVA), accessibility roles/names, keyboard navigation
  - Token-driven styles via CSS vars presence (not exact classes)
- Avoid (brittle/expensive):
  - Exact DOM trees/class names unless part of the contract
  - Full-layout screenshots for every component state (keep to critical)
  - Private internals and implementation details

---

## Maintainability Rules (Enforced)

- Each test file MUST reference a contract or task ID at top:
  - Example header comment: `@contract CONTRACT-BUTTON-001` or `@task CMP-002`
- Tests MUST express acceptance criteria in Given/When/Then style.
- If a test breaks due to refactor without contract change → fix the test to be less coupled or delete it.
- Any test exceeding maintenance budget twice in a sprint → open a task to redesign or remove.

---

## Definition of Done (Testing)

- Component/task is DONE only if:
  - **Contract acceptance criteria** have matching tests
  - **A11y checks** pass (axe, roles, names)
  - **Critical stories** exist and are covered by interaction tests
  - **Visual snapshots** exist for critical states (happy path + 1 edge)
  - Added to `traceability-matrix.csv`

---

## Test Types and Examples

### 1) Contract Tests (Behavioral)

- Verify contract props, variants, invariants.
- Example (Vitest + Testing Library):
```ts
import { render, screen } from '@testing-library/react'
import { Button } from '@/components/ui/button'

// @contract CONTRACT-BUTTON-001
// Given/When/Then:
// Given a primary variant, When rendered, Then it exposes role=button and token-based styles

it('renders primary variant and is accessible', () => {
  render(<Button variant="primary">Click</Button>)
  const btn = screen.getByRole('button', { name: 'Click' })
  expect(btn).toBeInTheDocument()
  // Prefer token var presence over exact class name
  const style = getComputedStyle(btn)
  expect(style.getPropertyValue('--color-primary')).not.toEqual('')
})
```

### 2) Story Interaction Tests (Storybook Test Runner)

- Exercise stories to ensure they work as users expect.
- Example:
```ts
// Button.stories.tsx must export `Primary`
import { test, expect } from '@playwright/test'
import { composeStories } from '@storybook/react'
import * as stories from './Button.stories'

const { Primary } = composeStories(stories)

test('primary story renders and is clickable', async ({ page }) => {
  await page.goto('/iframe.html?id=components-button--primary')
  const button = page.getByRole('button')
  await expect(button).toBeVisible()
})
```

### 3) Visual Regression (Critical Only)

- Define “critical stories” per component and snapshot only them.
- Example (Chromatic) config: only `*.critical.stories.tsx` included.

---

## A11y Gate

- Run axe (or @storybook/addon-a11y) on stories.
- Fail CI if critical a11y violations found.

---

## Test Cost Management

- Add a simple cost annotation to tests and tasks:
  - `@cost: low|medium|high`
  - `@flaky: true|false`
- In `traceability-matrix.csv` add a `Notes` or `MaintenanceCost` column.
- Weekly review: remove or redesign tests marked `high` without demonstrated catch rate.

---

## Traceability Hooks

- Every test file top block includes `@contract` or `@task`.
- CI job checks that each `DONE` task in `traceability-matrix.csv` lists at least one test file (or explicit justification `NoTests: reason`).

---

## Templates

- Use `templates/TEST-PLAN.md` for new features/components:
  - Risks, user scenarios, acceptance criteria → mapped to test cases
  - Visual coverage list (critical states)
  - A11y requirements

---

## CI Recommendations

- Matrix:
  - `pnpm lint && pnpm typecheck`
  - `pnpm test:unit` (Vitest, watch in dev)
  - `pnpm test:stories` (Storybook test-runner)
  - `pnpm test:visual` (Chromatic/Playwright), only on PRs to main and only changed critical stories
- Block merge if contract tests fail or a11y gate fails.

---

## Anti-Patterns and Fixes

- ❌ Green tests, broken UI → ✅ Add story interaction + visual checks for critical stories
- ❌ Tests assert Tailwind class strings → ✅ Assert roles, text, token CSS vars presence
- ❌ Snapshot everything → ✅ Snapshot only critical stories/states
- ❌ Brittle DOM queries → ✅ Prefer role/name/label queries
- ❌ Flaky E2E everywhere → ✅ Targeted integration, keep E2E for critical flows only
