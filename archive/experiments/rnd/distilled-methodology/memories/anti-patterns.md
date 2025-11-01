# Anti-Patterns

**Purpose:** Document what NOT to do, based on real failures.

**Format:** Pattern → Why wrong → Correct alternative

---

## Contract Anti-Patterns

### 1. Code-First, Contract-Later

**Pattern:** Write component, then document it as contract.

**Why wrong:** Contract becomes documentation, not source of truth. No guidance during implementation.

**Correct:** Contract first, then implement from contract.

---

### 2. Over-Specification in Complex Domain

**Pattern:**
```yaml
# Complex domain component
props:
  optional:
    - name: focusDistance
      type: number
      default: 0.20  # ← Magic number
      validation: "between 0.1 and 0.3"
```

**Why wrong:** Assumes solution is known. In Complex domain, optimal values are emergent.

**Correct:**
```yaml
# Complex domain component
invariants:
  - "Focus must work on 95% of devices"
  - "Component adapts to device capabilities"
# No hardcoded values in contract
```

---

### 3. Under-Specification in Simple Domain

**Pattern:**
```yaml
# Simple domain component
props:
  optional:
    - name: variant
      type: string  # ← Too vague
```

**Why wrong:** Simple domain solutions are known. Be precise.

**Correct:**
```yaml
props:
  optional:
    - name: variant
      type: "'primary' | 'secondary' | 'outline'"
      default: primary
```

---

### 4. Mixing Concerns in Contract

**Pattern:**
```yaml
# CONTRACT-BUTTON-001.yml
props:
  - name: onClick
  - name: apiEndpoint  # ← Wrong layer
  - name: userId       # ← Business logic
```

**Why wrong:** Button shouldn't know about API or users. Breaks separation of concerns.

**Correct:** Button handles UI, parent handles business logic.

---

### 5. Implicit Dependencies

**Pattern:**
```yaml
# Contract doesn't list dependencies
description: "Uses primary color and medium spacing"
# But doesn't specify which tokens
```

**Why wrong:** Dependencies not explicit. Contract incomplete.

**Correct:**
```yaml
dependencies:
  tokens:
    - color.primary
    - spacing.md
```

---

## Implementation Anti-Patterns

### 6. Hardcoded Values

**Pattern:**
```tsx
<button 
  style={{ 
    backgroundColor: '#3B82F6',
    padding: '8px 16px',
    borderRadius: '6px'
  }}
>
```

**Why wrong:** Breaks token system. Values will drift across components.

**Correct:**
```tsx
<button className="bg-primary px-4 py-2 rounded-md">
```

---

### 7. Non-Semantic HTML

**Pattern:**
```tsx
<div onClick={handleClick} className="button-like">
  Click me
</div>
```

**Why wrong:** Not keyboard accessible, wrong semantics, screen readers confused.

**Correct:**
```tsx
<button onClick={handleClick}>
  Click me
</button>
```

---

### 8. Margin in Component

**Pattern:**
```tsx
// Inside Button component
<button className="mb-4">
  {children}
</button>
```

**Why wrong:** Assumes usage context. Breaks reusability.

**Correct:** Parent controls layout:
```tsx
// In parent
<div className="space-y-4">
  <Button />
  <Button />
</div>
```

---

### 9. Tight Coupling

**Pattern:**
```tsx
// Button.tsx
import { UserContext } from '@/contexts/UserContext';

export function Button() {
  const user = useContext(UserContext);  // ← Tight coupling
  // ...
}
```

**Why wrong:** Button can't be used without UserContext. Not reusable.

**Correct:** Props down:
```tsx
export function Button({ userName }: { userName?: string }) {
  // userName passed from parent
}
```

---

### 10. Blast Radius Violations

**Pattern:**
```tsx
// In Button.tsx
import './global-styles.css';  // ← Modifies globals!
```

**Why wrong:** Button changes affect all components.

**Correct:** Scope styles to component:
```tsx
// Button module CSS or Tailwind classes
```

---

## Token Anti-Patterns

### 11. Flat Token Structure

**Pattern:**
```json
{
  "primaryBlue": "#3B82F6",
  "buttonBackground": "#3B82F6",
  "linkColor": "#3B82F6"
}
```

**Why wrong:** Duplication, no semantic meaning, can't theme.

**Correct:**
```json
{
  "base": {
    "blue": { "600": "#3B82F6" }
  },
  "semantic": {
    "primary": "{base.blue.600}"
  },
  "component": {
    "button": { "bg": "{semantic.primary}" },
    "link": { "color": "{semantic.primary}" }
  }
}
```

---

### 12. Color Names as Values

**Pattern:**
```json
{
  "buttonColor": "blue"
}
```

**Why wrong:** "blue" is ambiguous. Which blue? How blue?

**Correct:**
```json
{
  "button": {
    "background": "#3B82F6"
  }
}
```

---

### 13. Tokens in Wrong Layer

**Pattern:**
```json
// In base tokens
{
  "buttonPrimaryBackground": "#3B82F6"
}
```

**Why wrong:** Component-specific token in base layer.

**Correct:**
```json
// Base layer
{
  "blue": { "600": "#3B82F6" }
}

// Component layer
{
  "button": {
    "primary": { "bg": "{blue.600}" }
  }
}
```

---

## Task Management Anti-Patterns

### 14. Linear Task List

**Pattern:**
```
Tasks:
1. Implement auth
2. Build dashboard
3. Add profile page
4. Create settings
```

**Why wrong:** Hides dependencies. May work on blocked task.

**Correct:** Graph with dependencies:
```
Auth (blocks: Dashboard, Profile, Settings)
├─→ Dashboard
├─→ Profile
└─→ Settings
```

---

### 15. Time-Based Estimates

**Pattern:**
"This will take 3 days"

**Why wrong:** AI speed varies wildly. Time is unknowable.

**Correct:** 
- Cynefin domain: Complex
- Context usage: High
- Dependencies: 3 tasks
- Uncertainty: Significant

---

### 16. All Tasks Same Priority

**Pattern:**
```
[ ] Task A
[ ] Task B  
[ ] Task C
```

**Why wrong:** No guidance on what to do first.

**Correct:**
```
[P1 - Blocker] Task A (unlocks 5 tasks)
[P2 - Important] Task B (critical path)
[P3 - Nice-to-have] Task C
```

---

## Testing Anti-Patterns

### 17. No Contract Validation

**Pattern:** Manual review of generated components.

**Why wrong:** Human review doesn't scale. Inconsistencies accumulate.

**Correct:** Automated validation:
```bash
npm run validate:contracts
npm run lint
npm run test
```

---

### 18. Untestable Acceptance Criteria

**Pattern:**
```yaml
acceptance_criteria:
  - criterion: "Looks good"
  - criterion: "Works well"
```

**Why wrong:** Subjective, not verifiable.

**Correct:**
```yaml
acceptance_criteria:
  - criterion: "WCAG AA contrast ratio"
    validation: automated
  - criterion: "All variants visible in Storybook"
    validation: visual
```

---

### 19. Testing Implementation, Not Contract

**Pattern:**
```typescript
// Test
expect(button.classList).toContain('px-4');
```

**Why wrong:** Tests implementation detail, not contract requirement.

**Correct:**
```typescript
// Test contract requirement
expect(button).toHaveAccessibleName('Submit');
expect(button).toBeEnabled();
```

---

## Process Anti-Patterns

### 20. Big Bang Refactor

**Pattern:** Rewrite entire component in one PR.

**Why wrong:** High risk, hard to review, breaks things.

**Correct:** Incremental migration:
1. Extract contract (PR #1)
2. Add TypeScript types (PR #2)
3. Replace hardcoded values (PR #3)
4. Fix accessibility (PR #4)

---

### 21. Skipping Contract Updates

**Pattern:** Implementation changes, contract stays the same.

**Why wrong:** Contract and reality diverge. Contract loses value.

**Correct:** Update contract when implementation changes (especially in Complex domain).

---

### 22. Ignoring Context Budget

**Pattern:** Keep adding to context until model crashes.

**Why wrong:** Quality degrades before crash. Produces bad output.

**Correct:** Checkpoint at 60-80%, reload essentials.

---

## Multi-Agent Anti-Patterns

### 23. Complex Orchestration

**Pattern:** Orchestrator coordinates 5 agents with handoffs.

**Why wrong:** Cannot pause/correct. Fails opaquely.

**Correct:** Simple parallelism - independent agents on separate tasks.

---

### 24. Shared Mutable State

**Pattern:** Multiple agents modify same contract simultaneously.

**Why wrong:** Race conditions, conflicts, corruption.

**Correct:** Each agent has isolated scope (blast radius).

---

## Documentation Anti-Patterns

### 25. "As Discussed" References

**Pattern:**
```yaml
description: "Follows the pattern we agreed on"
```

**Why wrong:** New AI instance has no memory of discussion.

**Correct:**
```yaml
description: "Uses primary color for background, white for text, rounded corners with md radius"
```

---

### 26. Implicit Assumptions

**Pattern:**
```yaml
props:
  - name: items
    type: array
```

**Why wrong:** Array of what? How many? Can be empty?

**Correct:**
```yaml
props:
  - name: items
    type: "Array<{id: string, label: string}>"
    validation: "minimum 1 item, maximum 100 items"
```

---

### 27. Stale Documentation

**Pattern:** README says one thing, code does another.

**Why wrong:** Misleading, wastes time.

**Correct:** Generate docs from contracts (single source of truth).

---

## When Anti-Patterns Happen

**Reality:** Anti-patterns will appear despite best efforts.

**Why:** 
- Pressure to deliver fast
- Incomplete understanding
- Legacy code influence
- Forgotten principles

**Solution:**
1. Regular audits (automated where possible)
2. Update this anti-patterns list
3. Add detection to validation
4. Refactor incrementally

**Don't:** Beat yourself up. Learn and improve.

---

**Update protocol:** When discovering new anti-pattern, add to this file with real example and correct alternative.
