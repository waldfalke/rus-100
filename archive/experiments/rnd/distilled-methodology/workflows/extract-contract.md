# Workflow: Extract Contract from Legacy Code

**Purpose:** Reverse-engineer contract from existing component implementation.

**Use when:** Migrating legacy codebase to Contract-Driven methodology.

---

## Step 1: Inventory Component

**Gather information:**

1. **Find all usages:**
   ```bash
   grep -r "import.*ComponentName" .
   grep -r "<ComponentName" .
   ```

2. **List files:**
   - Component implementation
   - Type definitions
   - Styles (CSS/SCSS/styled-components)
   - Tests (if any)
   - Documentation (if any)

3. **Check git history:**
   ```bash
   git log --follow -- path/to/Component.tsx
   ```
   Look for bug fixes, feature additions, breaking changes.

**Output:** Complete picture of component as it exists.

---

## Step 2: Analyze Props Interface

**Extract from TypeScript types:**

```typescript
// Existing component
interface ButtonProps {
  label: string;
  onClick: () => void;
  variant?: 'primary' | 'secondary';
  disabled?: boolean;
  className?: string;
}
```

**Document:**
- Required props (no `?`)
- Optional props (with `?`)
- Default values (check implementation)
- Actual types used

**Red flags:**
- `any` types → need refinement
- Missing types → infer from usage
- Inconsistent usage across files → multiple "truths"

---

## Step 3: Identify Variants and States

**Look for:**

1. **Variants (style variations):**
   ```tsx
   // In code
   {variant === 'primary' && 'bg-blue-600'}
   {variant === 'secondary' && 'bg-gray-600'}
   ```

2. **States (interaction states):**
   ```tsx
   // In code
   hover:bg-blue-700
   disabled:opacity-50
   focus:ring-2
   ```

3. **Conditional rendering:**
   ```tsx
   {loading && <Spinner />}
   {error && <ErrorIcon />}
   ```

**Document all discovered variants and states.**

---

## Step 4: Extract Invariants

**Invariants = what's always true (or should be):**

**Look for:**
- Validation logic
- Guard clauses
- Error handling
- Constraints

**Example findings:**
```typescript
// Code shows invariants
if (!onClick) throw new Error('onClick required');
if (disabled) return null; // disabled = no render?
if (children.length > 100) console.warn('too long');
```

**Invariants:**
- onClick must be provided
- Disabled prevents rendering (is this intended?)
- Children should be < 100 chars (performance concern?)

**Verify each:** Is this intentional or bug?

---

## Step 5: Find Token Violations

**Scan for hardcoded values:**

```bash
# Colors
grep -r "#[0-9A-Fa-f]\{6\}" components/ComponentName/

# Spacing (px values)
grep -r "[0-9]\+px" components/ComponentName/

# Magic numbers
grep -r "className.*\[[0-9]" components/ComponentName/
```

**Document:**
- What values are hardcoded
- Should they be tokens?
- What tokens would replace them?

**Example:**
```tsx
// Found
<div style={{ padding: '16px', backgroundColor: '#3B82F6' }}>

// Should be
<div className="p-4 bg-primary">
```

---

## Step 6: Determine Blast Radius

**What does this component affect?**

1. **Direct dependencies:**
   - Other components it imports
   - Utilities it uses
   - Tokens/styles it references

2. **Dependents:**
   - What components use this one
   - What pages include it

3. **Side effects:**
   - Global state changes
   - API calls
   - Local storage access

**Blast radius = all files that would break if this component changed.**

**Scope:**
- **Mutable:** Component's own files
- **Invariant:** Everything else

---

## Step 7: Identify Anti-Patterns

**Review code for common mistakes:**

1. **Hardcoded values** (already found in Step 5)

2. **Improper semantics:**
   ```tsx
   // ❌
   <div onClick={handleClick}>Button</div>
   
   // ✅ Should be
   <button onClick={handleClick}>Button</button>
   ```

3. **Missing accessibility:**
   ```tsx
   // ❌ No ARIA
   <button onClick={handleClick} />
   
   // ✅ Should have
   <button onClick={handleClick} aria-label="Close" />
   ```

4. **Tight coupling:**
   ```tsx
   // ❌ Imports specific page component
   import { UserProfile } from '@/pages/UserProfile';
   ```

5. **Margin in component** (should be parent's responsibility)

**Document:** Pattern + Why wrong + What to do instead

---

## Step 8: Assess Cynefin Domain

**Determine complexity:**

**Questions:**
- Is solution straightforward? → Simple
- Does it need expert knowledge? → Complicated
- Was it built through trial-and-error? → Complex
- Is it fragile/hacky? → Complex (or Chaotic)

**Evidence:**
- Lots of magic numbers → Complex
- Many edge case handlers → Complex
- Straightforward logic → Simple/Complicated
- Comments like "this somehow works" → Complex

**Classification guides contract precision.**

---

## Step 9: Write Contract

**Use discovered information:**

```yaml
id: CONTRACT-[NAME]-001
title: [Name] (extracted from legacy)
type: component
cynefin_domain: [determined in Step 8]

props:
  required: [from Step 2]
  optional: [from Step 2]

variants: [from Step 3]
states: [from Step 3]

invariants: [from Step 4]

dependencies:
  tokens: [should-be tokens from Step 5]
  components: [from Step 6]

scope:
  mutable: [from Step 6]
  invariant: [from Step 6]

anti_patterns: [from Step 7]

acceptance_criteria:
  - criterion: "Current behavior preserved"
    validation: integration-test
  - criterion: "All usages still work"
    validation: manual
```

**Important:** This contract documents *current state*, not ideal state.

---

## Step 10: Validate Contract

**Check against real usage:**

1. **Run existing tests** (if any)
2. **Manual testing** of all variants
3. **Check all usage sites** still work

**If contract doesn't match reality:**
- Contract is wrong → fix contract
- Implementation is inconsistent → document as finding

---

## Step 11: Create Migration Plan

**Don't refactor immediately.**

**Plan:**
1. Contract documents current state ✓
2. Identify gaps (hardcoded values, missing props, etc.)
3. Prioritize fixes (critical vs nice-to-have)
4. Incremental migration:
   - Replace hardcoded values with tokens
   - Add missing accessibility
   - Fix anti-patterns
   - Update contract to reflect improvements

**Each step = small PR, not big bang rewrite.**

---

## Step 12: Document Unknowns

**Mark uncertainties in contract:**

```yaml
unknowns:
  - "Why is maxLength=100? Performance or UX?"
  - "Is disabled=no-render intentional?"
  - "Who uses the 'legacy' variant?"

action_items:
  - "Verify maxLength requirement with team"
  - "Check if disabled behavior is correct"
  - "Remove 'legacy' variant if unused"
```

**Don't guess. Mark as unknown and investigate.**

---

## Common Pitfalls

### ❌ Assuming Intent

**Don't:**
- "This is probably a bug" → document as-is
- "They probably meant X" → document what's there
- "This should be Y" → note in action items

**Contract = reality, not ideals (at first).**

### ❌ Over-Cleaning

**Don't:**
- Fix all issues while extracting
- Refactor during contract creation
- Remove "weird" code without understanding

**Extract first, improve later.**

### ❌ Missing Usage Context

**Don't:**
- Only look at component code
- Ignore how it's actually used
- Skip git history

**Usage reveals actual contract.**

---

## Red Flags

**Signs component may be Complex domain:**
- Many edge cases handled
- Lots of magic numbers
- "This works but not sure why" comments
- Fragile (breaks easily)
- Device/browser-specific code

**Action:** Mark as Complex, write flexible contract.

---

## Success Criteria

- [ ] All props documented
- [ ] All variants identified
- [ ] All states listed
- [ ] Invariants extracted
- [ ] Blast radius defined
- [ ] Anti-patterns documented
- [ ] Cynefin domain assessed
- [ ] Existing tests pass
- [ ] All usage sites checked
- [ ] Unknowns marked for follow-up

---

## Example: Legacy Button Extraction

**Found in code:**
```tsx
// Button.tsx (legacy)
export function Button({ text, click, style, big, disabled }) {
  return (
    <div 
      onClick={disabled ? null : click}
      className={`btn ${style} ${big ? 'large' : ''}`}
      style={{ padding: big ? '16px 32px' : '8px 16px' }}
    >
      {text}
    </div>
  );
}
```

**Extracted contract:**
```yaml
id: CONTRACT-BUTTON-001
cynefin_domain: simple

props:
  required:
    - name: text
      type: string
    - name: click
      type: () => void
  optional:
    - name: style
      type: string  # ❌ Should be enum
    - name: big
      type: boolean
    - name: disabled
      type: boolean

anti_patterns:
  - pattern: "Using <div onClick>"
    reason: "Not keyboard accessible"
    alternative: "Use <button>"
  
  - pattern: "Inline style for padding"
    reason: "Hardcoded, should use tokens"
    alternative: "Use Tailwind classes"
  
  - pattern: "Prop named 'text'"
    reason: "Should be 'children'"
    alternative: "Standard React pattern"

action_items:
  - "Replace div with button"
  - "Convert to Tailwind classes"
  - "Rename text→children, click→onClick, style→variant"
  - "Add TypeScript types"
```

**Migration:** Incremental fixes, not rewrite.

---

**Next:** See `migration/refactor-plan.md` for improvement strategy.
