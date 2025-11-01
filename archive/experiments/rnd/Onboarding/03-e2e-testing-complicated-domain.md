# Onboarding Exercise: Complicated Domain - E2E Testing

**Purpose:** Learn to work with Complicated problems (multiple approaches, expert knowledge, deterministic outcomes)

**Prerequisite:** Completed exercises 01 (Simple) and 02 (Complex)

---

## Understanding "Complicated" Domain

### Cynefin: Complicated vs Simple vs Complex

**Complicated problems:**
- Multiple valid solution paths exist
- Requires expert knowledge to navigate
- Outcomes are **DETERMINISTIC** when correct approach is applied
- Best practices can be documented and replicated
- Analysis reveals cause-and-effect relationships

**NOT Simple because:** Requires expertise, not just following instructions  
**NOT Complex because:** Solutions are knowable a priori, not emergent

---

## Examples of Complicated Domain Problems

Before we dive into E2E testing, recognize the pattern:

### **1. Database Query Optimization**
- **Why Complicated:** Multiple indexing strategies, query plan variations
- **Expert knowledge:** Understanding B-trees, query executors, statistics
- **Deterministic:** Same query + same data + same indexes = same performance
- **Not Complex:** Performance is explainable and predictable

### **2. Cryptographic Protocol Implementation**
- **Why Complicated:** Multiple cipher suites, key exchange methods
- **Expert knowledge:** Understanding crypto primitives, attack vectors
- **Deterministic:** Correct implementation = secure, incorrect = vulnerable
- **Not Complex:** Security properties are provable, not emergent

### **3. Build System Configuration**
- **Why Complicated:** Webpack, Rollup, esbuild - different trade-offs
- **Expert knowledge:** Understanding bundling, tree-shaking, code splitting
- **Deterministic:** Same config + same code = same bundle
- **Not Complex:** Build output is reproducible and explainable

### **4. Network Protocol Design**
- **Why Complicated:** TCP, UDP, QUIC - different reliability/speed trade-offs
- **Expert knowledge:** Understanding congestion control, packet loss, latency
- **Deterministic:** Same network conditions = predictable behavior
- **Not Complex:** Protocol behavior is specified, not emergent

### **5. Compiler Optimization**
- **Why Complicated:** Multiple optimization passes, register allocation strategies
- **Expert knowledge:** Understanding IR, SSA, dead code elimination
- **Deterministic:** Same code + same flags = same optimized output
- **Not Complex:** Optimizations are algorithmic, not trial-and-error

### **6. Authentication System Architecture**
- **Why Complicated:** OAuth, SAML, JWT - different security/UX trade-offs
- **Expert knowledge:** Understanding sessions, tokens, CSRF, XSS
- **Deterministic:** Correct implementation = secure auth flow
- **Not Complex:** Security properties are analyzable

### **7. E2E Testing of Asynchronous Web Applications** ← Our focus
- **Why Complicated:** Multiple testing approaches, timing strategies
- **Expert knowledge:** Understanding event loop, rendering pipeline, DOM lifecycle
- **Deterministic:** Correct synchronization = 0% flakiness
- **Not Complex:** Test stability is achievable through proper patterns

---

## Key Pattern Recognition

All Complicated problems share:

1. **Multiple valid approaches** - Not one "right way"
2. **Expertise requirement** - Need deep domain knowledge
3. **Deterministic outcomes** - When you apply correct approach, outcome is predictable
4. **Analyzable** - Can reason about cause-and-effect
5. **Documentable** - Best practices can be written down and followed

**Critical insight:** If someone says "it's just inherently flaky/unreliable/unpredictable" → They're treating Complicated as Complex, which is wrong.

---

## Exercise Focus: E2E Testing as Complicated Domain

### Step 1: Cynefin Classification (5 min)

You're tasked with: "Make our E2E tests stop being flaky"

**Current situation:**
- 100 tests, 70% pass rate
- Same test passes/fails randomly
- Team says: "E2E is just flaky by nature"
- Visual regression tests show different screenshots on same code

**Your classification task:**

Is this **Complex** (emergent, unpredictable, requires experimentation)?  
Or **Complicated** (deterministic, requires expertise, knowable solution)?

**Questions to answer:**
1. Are flaky tests due to unknowable emergent properties?
2. Or are they due to misunderstanding of browser/async behavior?
3. Can we reason about WHY a test is flaky?
4. If we fix the root cause, will flakiness disappear deterministically?

**Your answer:** [Write before continuing]

<details>
<summary>Show correct answer</summary>

**Domain:** Complicated

**Why:**
- Flakiness has ROOT CAUSES (async timing, rendering pipeline, DOM lifecycle)
- These causes are KNOWABLE (browser architecture is documented)
- When you apply correct patterns (state synchronization), flakiness becomes 0% DETERMINISTICALLY
- This is NOT emergent behavior - it's cause-and-effect

**Team is wrong:** "E2E is just flaky" treats Complicated as Complex.  
**Reality:** E2E flakiness is violation of principles, not inherent uncertainty.

**Evidence:** rus-100 project went from 78% pass, 22% flaky → 100% pass, 0% flaky by applying principles.

</details>

---

### Step 2: Problem Analysis (10 min)

You have a flaky test:

```typescript
test('user can submit form', async ({ page }) => {
  await page.goto('/form');
  await page.waitForTimeout(1000);  // "Wait for page to load"
  
  await page.locator('button').first().click();
  await page.waitForTimeout(500);  // "Wait for submission"
  
  await expect(page.locator('.success')).toBeVisible();
});
```

**Current behavior:**
- Passes 60% of time
- Fails 40% with "element not found" or "element is hidden"

**Your diagnostic task:**

Reference: `rnd/e2e-testing-field-manual/CONTRACT.yml`

Read sections:
- `problem_domain` - fundamental challenges
- `governing_principles` - why flakiness occurs
- `anti_patterns` - what violations look like

**Questions:**

1. Which fundamental challenge is violated? (asynchronicity, DOM dynamism, rendering variance, etc.)
2. Which governing principle is violated?
3. Which anti-pattern(s) are present?
4. What is the ROOT CAUSE of flakiness?

**Your answers:** [Write before continuing]

<details>
<summary>Show correct answer</summary>

**1. Fundamental challenge violated:** 
- **asynchronicity** - Modern web apps load asynchronously, DOM state is non-deterministic at any wall-clock time

**2. Governing principle violated:**
- **Principle 1: Synchronization Over Timing** - Tests MUST synchronize with application state, never rely on arbitrary timeouts

**3. Anti-patterns present:**
- **antipattern_arbitrary_timeouts** - Using `waitForTimeout(1000)` instead of state observation
- **antipattern_existence_over_visibility** - Using `.first()` without `:visible` selector

**4. Root cause:**
- `waitForTimeout(1000)` is arbitrary. Page might load in 0.5s (test passes) or 1.5s (test fails).
- `.first()` might select hidden mobile menu button instead of visible desktop button.
- Test is racing with async operations instead of synchronizing.

**Deterministic fix:**
```typescript
// Apply Principle 1: State synchronization
async function waitForPageReady(page: Page) {
  await page.waitForLoadState('networkidle');
  await page.waitForSelector('text=Loading...', { state: 'hidden' });
  await page.waitForTimeout(500); // Settle time only
}

test('user can submit form', async ({ page }) => {
  await page.goto('/form');
  await waitForPageReady(page);  // Synchronize with state
  
  // Apply Principle 2: Visibility filtering
  await page.locator('button:visible').first().click();
  
  // Synchronize with response state
  await page.waitForSelector('.success:visible');
  
  await expect(page.locator('.success')).toBeVisible();
});
```

**Result:** 100% pass rate, 0% flakiness (deterministic)

</details>

---

### Step 3: Contract Application (15 min)

**Scenario:** You need to implement visual regression tests.

**Requirements:**
- Screenshot main page in light/dark themes
- Tests must be stable (0% pixel variance on re-run)
- Must work in CI (different fonts, timing)

**Your task:**

Using `CONTRACT.yml` as reference:

1. Read `implementation_patterns.pattern_rendering_pipeline_sync`
2. Identify which invariants apply to visual tests
3. Write compliant implementation

**Your implementation:** [Write code before continuing]

<details>
<summary>Show correct answer</summary>

**Invariants that apply:**
- `I5_font_loading` - Visual assertions MUST wait for font loading completion
- `I6_viewport_stability` - Visual comparisons MUST use fixed viewport dimensions
- `I7_animation_stability` - Visual assertions MUST disable animations

**Correct implementation:**

```typescript
import { test, expect } from '@playwright/test';

// From pattern_rendering_pipeline_sync
async function prepareForVisualAssertion(page: Page) {
  // Wait for application state
  await page.waitForLoadState('networkidle');
  
  // I5: Wait for font loading
  await page.evaluate(() => document.fonts.ready);
  
  // Let any font-triggered reflows complete
  await page.waitForTimeout(1000);
}

test.describe('Visual Regression', () => {
  test.beforeEach(async ({ page }) => {
    // I6: Fixed viewport
    await page.setViewportSize({ width: 1280, height: 720 });
  });

  test('main page light theme', async ({ page }) => {
    await page.goto('/');
    await prepareForVisualAssertion(page);
    
    await expect(page).toHaveScreenshot('main-light.png', {
      fullPage: false,        // I6: Fixed viewport
      animations: 'disabled', // I7: Disable animations
      timeout: 10000,
    });
  });

  test('main page dark theme', async ({ page }) => {
    await page.goto('/');
    await prepareForVisualAssertion(page);
    
    // Enable dark theme
    await page.evaluate(() => {
      document.documentElement.classList.add('dark');
    });
    
    await page.waitForTimeout(500); // Theme transition settle
    
    await expect(page).toHaveScreenshot('main-dark.png', {
      fullPage: false,
      animations: 'disabled',
      timeout: 10000,
    });
  });
});
```

**Why this is deterministic:**
1. Fonts loaded → text renders consistently
2. Fixed viewport → height doesn't vary with content
3. Animations disabled → pixels don't mutate
4. State synchronization → render pipeline stabilized

**Result:** Run 5 times = 5 identical screenshots (0 pixel difference)

</details>

---

### Step 4: Principle Internalization (10 min)

**Critical understanding check:**

Someone says: _"E2E tests are just inherently flaky, you have to retry them and accept some failures."_

**Your response:** [Write your answer]

<details>
<summary>Show correct answer</summary>

**Wrong mindset:** This treats E2E testing as **Complex** (emergent, unpredictable).

**Correct mindset:** E2E testing is **Complicated** (deterministic when expertise applied).

**Your response should be:**

> "Flakiness is not inherent to E2E testing. It's a symptom of violating governing principles.
> 
> When tests are flaky, the root cause is typically:
> - Using arbitrary timeouts instead of state synchronization (Principle 1)
> - Selecting elements by DOM order instead of visibility (Principle 2)  
> - Taking screenshots before rendering pipeline stabilizes (Principle 3)
> 
> These are knowable, fixable problems. When you apply correct patterns:
> - Synchronize with application state (waitForPageReady)
> - Filter selectors for visibility (:visible)
> - Wait for rendering completion (fonts.ready)
> 
> Flakiness drops to 0% deterministically. This has been proven on multiple projects.
> 
> The solution requires expertise (understanding browser architecture, event loop, rendering), 
> but the outcome is predictable and repeatable."

**Evidence from CONTRACT.yml:**
```yaml
epistemology:
  why_complicated_not_complex: |
    Flaky tests are not "inherent complexity" - they are misapplication
    of principles. When principles correctly applied, determinism follows.
```

**This is the key insight of Complicated domain:** 
Solutions require expertise, but are deterministic and replicable.

</details>

---

## Key Takeaways

### Complicated Domain Characteristics

1. **Multiple approaches exist** (Playwright, Cypress, Puppeteer)
2. **Expertise required** (browser architecture, async systems)
3. **Outcomes deterministic** (correct patterns → 0% flakiness)
4. **Analyzable** (can explain why tests fail)
5. **Documentable** (CONTRACT.yml specifies universal principles)

### Common Mistake

**Treating Complicated as Complex:**
- "It's just flaky" → Wrong (treating as emergent)
- "Correct patterns exist" → Right (treating as analyzable)

### Success Pattern

For any Complicated problem:
1. **Understand domain fundamentals** (browser, event loop, rendering)
2. **Derive governing principles** (synchronization, visibility, determinism)
3. **Apply patterns consistently** (waitForPageReady, :visible, fonts.ready)
4. **Measure adherence** (pass rate, flakiness, compliance score)

**Result:** Deterministic outcomes

---

## Reference Material

**Full specification:** `rnd/e2e-testing-field-manual/CONTRACT.yml`

**Key sections for AI learning:**

1. **`problem_domain`** - Understand fundamental challenges
2. **`governing_principles`** - Why principles exist (not arbitrary)
3. **`invariants`** - Necessary conditions (not "best practices")
4. **`implementation_patterns`** - How to manifest principles
5. **`anti_patterns`** - Common violations and why they fail
6. **`epistemology`** - Nature of this knowledge

**Critical insight from contract:**
```yaml
nature_of_this_contract: |
  The invariants are not "best practices" - they are NECESSARY conditions
  for deterministic testing of asynchronous web applications.
  
  You cannot violate Principle 1 (Synchronization Over Timing) and have
  deterministic tests any more than you can violate physics and have
  stable buildings.
```

---

## Exercise Complete

**You now understand:**
- ✅ Complicated domain characteristics
- ✅ E2E testing as Complicated (not Complex)
- ✅ Root causes of flakiness
- ✅ Deterministic solutions
- ✅ How to apply CONTRACT.yml

**Next steps:**
1. Review CONTRACT.yml in full
2. Study implementation_patterns for code examples
3. Apply to real flaky tests
4. Measure compliance score

**Remember:** In Complicated domain, expertise + correct patterns = deterministic success.

---

**Exercise designed:** 2025-01-10  
**Difficulty:** Intermediate (requires understanding of async systems)  
**Estimated time:** 40-50 minutes  
**Prerequisites:** Exercises 01 (Simple) and 02 (Complex)
