# Migration Guide: Legacy to Contracts

**Purpose:** Transform existing codebase to Contract-Driven methodology.

**Critical:** This is incremental transformation, not big-bang rewrite.

---

## Migration Strategy

### Three Phases

```
Phase 1: Document (Extract contracts from existing code)
         ↓
Phase 2: Validate (Ensure contracts match reality)
         ↓
Phase 3: Refactor (Improve code to match ideal contracts)
```

**Duration:** Weeks to months, depending on codebase size.

**Approach:** One component at a time, not all at once.

---

## Phase 1: Document Current State

**Goal:** Extract contracts that describe existing code as-is.

**Not:** Ideal state, but actual current state.

### Step 1.1: Inventory Components

```bash
# Find all components
find ./components -name "*.tsx" -o -name "*.jsx"

# Create inventory list
components/
├── Button/
├── Card/
├── Input/
├── Modal/
└── ...
```

**Prioritize:**
1. Most-used components (high impact)
2. Most-changed components (high risk)
3. Simplest components (quick wins)

### Step 1.2: Extract Contracts

**For each component:**

1. **Use extraction workflow:** `workflows/extract-contract.md`

2. **Document as-is:**
   ```yaml
   # Current reality, not ideal
   id: CONTRACT-BUTTON-001
   status: extracted-from-legacy
   
   issues:
     - "Uses hardcoded colors"
     - "Inconsistent prop names"
     - "Missing accessibility"
   ```

3. **Mark anti-patterns:**
   ```yaml
   anti_patterns:
     - pattern: "Hardcoded #3B82F6"
       status: existing
       fix_planned: true
   ```

**Output:** Contract file for each component documenting current state.

### Step 1.3: Validate Extraction

**For each contract:**

1. **Does contract match code?**
   ```bash
   # Test existing behavior
   npm test Button
   
   # Manual check
   npm run storybook
   ```

2. **Do all usages work?**
   ```bash
   # Find usage sites
   grep -r "<Button" ./app
   
   # Test each page
   ```

3. **Update contract if mismatches found**

**Goal:** Contract is accurate snapshot of current reality.

---

## Phase 2: Establish Validation

**Goal:** Automated checks to prevent regression and new anti-patterns.

### Step 2.1: Schema Validation

**Setup:**
```json
// package.json
{
  "scripts": {
    "validate:contracts": "node scripts/validate-contracts.js",
    "validate:tokens": "node scripts/validate-tokens.js"
  }
}
```

**Scripts:**
```javascript
// scripts/validate-contracts.js
const Ajv = require('ajv');
const glob = require('glob');
const fs = require('fs');
const yaml = require('js-yaml');

const ajv = new Ajv();
const schema = require('../schemas/contract.schema.json');

const contracts = glob.sync('contracts/*.yml');

contracts.forEach(file => {
  const contract = yaml.load(fs.readFileSync(file));
  const valid = ajv.validate(schema, contract);
  
  if (!valid) {
    console.error(`❌ ${file}:`, ajv.errors);
    process.exit(1);
  }
});

console.log('✅ All contracts valid');
```

### Step 2.2: Lint Rules

**Setup ESLint rules:**
```javascript
// .eslintrc.js
module.exports = {
  rules: {
    // No hardcoded colors
    'no-restricted-syntax': [
      'error',
      {
        selector: 'Literal[value=/#[0-9A-Fa-f]{6}/]',
        message: 'Use design tokens instead of hardcoded colors',
      },
    ],
    
    // No inline px values in className
    'no-restricted-syntax': [
      'error',
      {
        selector: 'JSXAttribute[name.name="className"] Literal[value=/\\[\\d+px\\]/]',
        message: 'Use spacing tokens instead of arbitrary px values',
      },
    ],
  },
};
```

### Step 2.3: CI/CD Integration

```yaml
# .github/workflows/validate.yml
name: Validate Contracts

on: [push, pull_request]

jobs:
  validate:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
      - run: npm ci
      - run: npm run validate:contracts
      - run: npm run validate:tokens
      - run: npm run lint
      - run: npm test
```

**Result:** Automatic validation on every commit.

---

## Phase 3: Incremental Refactoring

**Goal:** Improve components to match ideal contracts, one at a time.

### Step 3.1: Prioritize Improvements

**Rank by:**
1. **Impact:** High-use components first
2. **Risk:** Low-risk changes first
3. **Effort:** Quick wins first

**Example priority:**
```
1. Button - High use, low risk, easy fix
2. Card - High use, medium risk, medium effort
3. Modal - Medium use, high risk, hard
```

### Step 3.2: Create Improvement Plan

**For each component:**

```yaml
# Improvement plan
component: Button
current_issues:
  - Hardcoded colors (5 instances)
  - Inconsistent prop names (onClick vs onPress)
  - Missing accessibility (no aria-label)
  - Non-semantic HTML (div instead of button)

improvements:
  - id: IMP-1
    description: Replace hardcoded colors with tokens
    effort: small
    risk: low
    pr: #123
  
  - id: IMP-2
    description: Standardize prop names
    effort: medium
    risk: medium  # Breaking change
    pr: #124
  
  - id: IMP-3
    description: Add accessibility
    effort: small
    risk: low
    pr: #125
```

### Step 3.3: Implement One Improvement at a Time

**Process per improvement:**

1. **Create branch**
   ```bash
   git checkout -b fix/button-tokens
   ```

2. **Make targeted change**
   ```tsx
   // Before
   style={{ backgroundColor: '#3B82F6' }}
   
   // After
   className="bg-primary"
   ```

3. **Update contract**
   ```yaml
   # Remove from issues
   anti_patterns:
     - pattern: "Hardcoded colors"
       status: fixed  # ← Was 'existing'
   ```

4. **Test thoroughly**
   ```bash
   npm test Button
   npm run storybook
   # Manual test all Button usages
   ```

5. **Small PR**
   ```
   fix(Button): replace hardcoded colors with tokens
   
   - Replaced 5 instances of hardcoded #3B82F6
   - Now uses bg-primary token
   - Updated CONTRACT-BUTTON-001.yml
   - All tests passing
   
   Ref: IMP-1
   ```

6. **Merge and repeat**

**Key:** One improvement = one PR. Easy to review, low risk.

### Step 3.4: Handle Breaking Changes

**Some improvements break existing code:**

**Example:** Renaming props
```tsx
// Old
<Button click={() => {}} />

// New  
<Button onClick={() => {}} />
```

**Strategy:**

1. **Add new prop, keep old (deprecated)**
   ```tsx
   interface ButtonProps {
     onClick?: () => void;
     /** @deprecated Use onClick */
     click?: () => void;
   }
   
   function Button({ onClick, click }: ButtonProps) {
     const handleClick = onClick || click;  // Support both
   }
   ```

2. **Add deprecation warning**
   ```tsx
   if (click) {
     console.warn('Button: "click" prop is deprecated, use "onClick"');
   }
   ```

3. **Update contract**
   ```yaml
   props:
     required:
       - name: onClick
         type: () => void
     
     deprecated:
       - name: click
         type: () => void
         migration: "Rename to onClick"
         remove_in: "v2.0.0"
   ```

4. **Migrate usage sites gradually**

5. **Remove deprecated in major version**

**Result:** No breaking changes, smooth migration.

---

## Phase 4: New Components

**Once foundation established:**

### All New Components Follow Methodology

1. **Contract-first** (always)
2. **Use design tokens** (always)
3. **Validate against schema** (CI/CD)
4. **Document in Storybook**

**No exceptions:** New code follows new standards.

**Legacy code:** Gradually migrated as touched.

---

## Migration Metrics

**Track progress:**

```markdown
## Migration Progress

### Components
- Total: 45
- Extracted contracts: 45 (100%)
- Validated: 45 (100%)
- Refactored: 12 (27%)

### Token Usage
- Hardcoded colors: 23 instances (was 156)
- Token compliance: 85% (was 12%)

### Contract Compliance
- Schema valid: 100%
- Acceptance criteria met: 78%

### Anti-Patterns
- Fixed: 89
- Remaining: 34
- New prevented: 0 (CI/CD working!)
```

**Update weekly, celebrate progress.**

---

## Common Pitfalls

### ❌ Big Bang Rewrite

**Mistake:** Rewrite everything at once.

**Problem:** High risk, long time, conflicts.

**Solution:** Incremental migration, one component at a time.

### ❌ Idealized Contracts

**Mistake:** Write contracts for ideal state, not current state.

**Problem:** Contract doesn't match code, validation fails.

**Solution:** Extract as-is, improve incrementally.

### ❌ Breaking Everything

**Mistake:** Change APIs without deprecation period.

**Problem:** Breaks all usage sites simultaneously.

**Solution:** Gradual deprecation, support both old and new.

### ❌ Stopping Halfway

**Mistake:** Extract contracts, never refactor.

**Problem:** Contracts document mess, don't improve it.

**Solution:** Commit to Phase 3, schedule refactoring.

---

## Success Stories

### Example: Button Migration

**Week 1:**
- Extracted CONTRACT-BUTTON-001.yml
- Documented 15 usage sites
- Identified 8 anti-patterns

**Week 2:**
- Fixed hardcoded colors (PR #101)
- Added TypeScript types (PR #102)
- Setup validation (PR #103)

**Week 3:**
- Fixed accessibility (PR #104)
- Migrated to semantic HTML (PR #105)
- Updated Storybook (PR #106)

**Week 4:**
- Deprecated old props (PR #107)
- Updated docs (PR #108)
- Marked as complete ✓

**Result:** Button now exemplar, other teams copy pattern.

---

## Rollout Plan

### Month 1: Foundation
- Extract contracts for top 10 components
- Setup validation (schema, lint, CI/CD)
- Train team on methodology

### Month 2-3: Quick Wins
- Fix low-hanging fruit (tokens, types, a11y)
- Establish patterns
- Document learnings

### Month 4-6: Major Refactoring
- Fix complex issues
- Handle breaking changes
- Migrate usage sites

### Month 6+: New Standard
- All new components use methodology
- Legacy components migrated as touched
- Continuous improvement

---

## Team Onboarding

**For each team member:**

1. **Read methodology docs** (2-3 hours)
2. **Complete onboarding exercise** (30 min)
3. **Shadow experienced dev** (1 day)
4. **Migrate one component** (1 week)
5. **Review others' PRs** (ongoing)

**Result:** Team proficient in methodology.

---

## When Done

**Migration complete when:**
- [ ] All components have contracts
- [ ] Validation automated (CI/CD)
- [ ] Token compliance >90%
- [ ] No new anti-patterns introduced
- [ ] Team trained and bought-in
- [ ] Documentation complete

**Celebrate! 🎉**

**Then:** Continuous improvement, methodology evolves with project.

---

**Remember:** Migration is marathon, not sprint. Incremental progress beats perfect paralysis.
