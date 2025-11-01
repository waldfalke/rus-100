# 📦 Contract Examples - E2E Testing Implementation

**Contract:** `CONTRACT-E2E-TESTING-001.yml`  
**Purpose:** Ready-to-copy example files that satisfy the contract  
**Status:** Production-validated on rus-100 project

---

## 📚 **Available Examples**

### **1. Configuration Files**

#### `playwright-e2e.config.example.ts`
- ✅ Satisfies **AC-001**: Separated E2E configuration
- ✅ Implements all required props (baseURL, testDir, testMatch)
- ✅ Follows invariant: `reuseExistingServer: true`
- **Copy to:** `playwright-e2e.config.ts` in project root

#### `package.json.example`
- ✅ Satisfies **AC-003**: NPM scripts configured
- ✅ All required commands present
- **Merge into:** your existing `package.json`

---

### **2. Helper Library**

#### `test-utils.example.ts`
- ✅ Satisfies **AC-002**: Helper library present
- ✅ Implements **Pattern 1-4**: All core patterns
- ✅ Functions:
  - `waitForPageReady()` - Loading state management
  - `prepareForScreenshot()` - Visual stability
  - `getVisibleElements()` - Resilient selectors
  - `clickSafely()` - Error handling
- **Copy to:** `tests/helpers/test-utils.ts`

---

### **3. Test Files**

#### `smoke.spec.example.ts`
- ✅ Satisfies **AC-007**: Critical flows tested
- ✅ Tests: Page load, navigation, interactions
- ✅ Shows proper use of `waitForPageReady()`
- **Copy to:** `tests/e2e/smoke.spec.ts`

#### `visual-regression.spec.example.ts`
- ✅ Satisfies **AC-008**: Visual baselines present
- ✅ Implements **Pattern 3**: Visual stability
- ✅ Tests: Main page, light theme, dark theme
- ✅ Follows invariant: `fullPage: false`
- **Copy to:** `tests/e2e/visual-regression.spec.ts`

#### `responsive.spec.example.ts`
- ✅ Satisfies **AC-009**: Responsive tests
- ✅ Tests 4 breakpoints (mobile, tablet, desktop)
- ✅ Visual baselines per breakpoint
- **Copy to:** `tests/e2e/responsive.spec.ts`

#### `accessibility.spec.example.ts`
- ✅ Satisfies **CONSTRAINT**: Accessibility requirements
- ✅ Tests: Keyboard navigation, semantic HTML, headings
- **Copy to:** `tests/e2e/accessibility.spec.ts`

---

### **4. CI/CD**

#### `.github-workflows-e2e.yml.example`
- ✅ Satisfies **AC-012**: CI pipeline configured
- ✅ GitHub Actions workflow
- ✅ Includes artifact upload
- **Copy to:** `.github/workflows/e2e-tests.yml`

---

### **5. Reference**

#### `project-structure.example.txt`
- ✅ Complete project structure
- ✅ Shows file organization
- ✅ File count validation
- **Use as:** Reference guide

---

## 🚀 **Quick Start (15 minutes)**

### **Step 1: Install Playwright (2 min)**
```bash
npm install -D @playwright/test
npx playwright install chromium
```

### **Step 2: Copy Config (3 min)**
```bash
# Copy and customize
cp examples/playwright-e2e.config.example.ts playwright-e2e.config.ts

# Edit baseURL to match your dev server
# Edit loadingText in waitForPageReady() if needed
```

### **Step 3: Copy Helpers (2 min)**
```bash
mkdir -p tests/helpers
cp examples/test-utils.example.ts tests/helpers/test-utils.ts
```

### **Step 4: Add Scripts (2 min)**
```bash
# Merge package.json.example scripts into your package.json
# Or copy-paste the scripts section
```

### **Step 5: Copy First Test (3 min)**
```bash
mkdir -p tests/e2e
cp examples/smoke.spec.example.ts tests/e2e/smoke.spec.ts
```

### **Step 6: Run! (1 min)**
```bash
npm run test:e2e
```

✅ **You should see tests running!**

---

## 📋 **Customization Checklist**

When copying examples, customize these values:

### **In `playwright-e2e.config.ts`:**
- [ ] `baseURL` - Your app URL (e.g., `http://localhost:3000`)
- [ ] `webServer.command` - Your dev server command (e.g., `npm run dev`)
- [ ] `webServer.url` - Match baseURL
- [ ] `viewport` - Default size for your app (optional)

### **In `test-utils.ts`:**
- [ ] `loadingText` parameter - Your loading indicator text (e.g., `"Loading..."`, `"Загрузка..."`)
- [ ] Timeouts - Adjust if your app is slower

### **In test files:**
- [ ] Selectors - Update to match your component structure
- [ ] Assertions - Customize based on your app behavior
- [ ] Test names - Make descriptive for your features

---

## ✅ **Validation**

After copying examples, verify contract compliance:

### **AC-001: Configuration Separation**
```bash
# Should list tests
npx playwright test --config=playwright-e2e.config.ts --list
```

### **AC-002: Helper Library**
```bash
# Should exist
ls tests/helpers/test-utils.ts
```

### **AC-003: NPM Scripts**
```bash
# Should work
npm run test:e2e --help
```

### **AC-004-006: Test Quality**
```bash
# Should pass ≥95%, complete in ≤2 min
npm run test:e2e
```

### **AC-007: Critical Flows**
```bash
# Should have ≥3 tests
grep -c "test(" tests/e2e/*.spec.ts
```

### **AC-008: Visual Baselines**
```bash
# Generate baselines
npm run test:visual:update

# Should exist
ls tests/e2e/*.spec.ts-snapshots/*.png
```

---

## 🎯 **Coverage Mapping**

Examples map to contract requirements:

| Example File | Satisfies | What It Demonstrates |
|--------------|-----------|---------------------|
| `playwright-e2e.config.example.ts` | AC-001, Props | Config separation |
| `test-utils.example.ts` | AC-002, Pattern 1-4 | Helper library |
| `package.json.example` | AC-003 | NPM scripts |
| `smoke.spec.example.ts` | AC-007, AC-004-006 | Critical flows |
| `visual-regression.spec.example.ts` | AC-008, Pattern 3 | Visual baselines |
| `responsive.spec.example.ts` | AC-009 | Responsive tests |
| `accessibility.spec.example.ts` | CONSTRAINT | A11y requirements |
| `.github-workflows-e2e.yml.example` | AC-012 | CI/CD |

---

## 🔍 **Contract Validation**

Each example file includes comments marking contract compliance:

```typescript
// ✅ AC-XXX: Acceptance criteria satisfied
// ✅ INVARIANT: Invariant followed
// ✅ PATTERN X: Pattern implemented
// ✅ CONSTRAINT: Constraint met
// ✅ ANTI-PATTERN FIX: Anti-pattern avoided
```

Search for these markers to understand compliance.

---

## 📊 **Anti-Pattern Detection**

Examples show how to **avoid** common mistakes:

### ❌ **Anti-Pattern 1: Single Config**
```typescript
// BAD (not in examples)
export default defineBddConfig({ ... });
```
✅ **Fixed:** Separate `playwright-e2e.config.ts`

### ❌ **Anti-Pattern 2: No Loading Wait**
```typescript
// BAD (not in examples)
await page.goto('/');
await expect(page.locator('h1')).toBeVisible(); // ❌ Flaky!
```
✅ **Fixed:** `await waitForPageReady(page);`

### ❌ **Anti-Pattern 3: .first() Without :visible**
```typescript
// BAD (not in examples)
const button = page.locator('button').first(); // ❌ Might be hidden!
```
✅ **Fixed:** `page.locator('button:visible').first()`

### ❌ **Anti-Pattern 4: fullPage: true**
```typescript
// BAD (not in examples)
await expect(page).toHaveScreenshot({ fullPage: true }); // ❌ Unstable!
```
✅ **Fixed:** `{ fullPage: false }`

---

## 🎓 **Learning Path**

### **Day 1: Setup (15 min)**
1. Copy config
2. Copy helpers
3. Add scripts
4. Copy smoke test
5. Run tests

### **Day 2: Visual (30 min)**
1. Copy visual regression test
2. Generate baselines
3. Verify stability

### **Day 3: Responsive (30 min)**
1. Copy responsive test
2. Add breakpoints
3. Generate baselines

### **Day 4: CI/CD (15 min)**
1. Copy workflow
2. Push to GitHub
3. Verify pipeline

---

## 🆘 **Troubleshooting**

### **"No tests found"**
→ Check `testMatch` in config: `'**/*.spec.ts'`

### **"Module not found: test-utils"**
→ Check path: `'../helpers/test-utils'` (relative to test file)

### **"waitForPageReady is not a function"**
→ Import: `import { waitForPageReady } from '../helpers/test-utils';`

### **"Visual test fails with pixel diff"**
→ Regenerate: `npm run test:visual:update`

### **"Element is hidden"**
→ Use: `page.locator('button:visible')`

---

## 📝 **Next Steps**

After copying examples:

1. **Customize** selectors and assertions
2. **Add** more tests for your features
3. **Run** tests regularly: `npm run test:e2e`
4. **Monitor** pass rate and flakiness
5. **Update** baselines when UI changes: `npm run test:visual:update`
6. **Document** your test patterns

---

## 🎉 **Success Criteria**

You've successfully implemented the contract when:

- ✅ Tests run: `npm run test:e2e` works
- ✅ Pass rate: ≥95% (target: 100%)
- ✅ Flakiness: ≤5% (target: 0%)
- ✅ Speed: ≤2 minutes
- ✅ Coverage: Critical flows tested
- ✅ Visual: ≥3 baselines
- ✅ CI/CD: Pipeline configured

---

**Contract:** CONTRACT-E2E-TESTING-001  
**Examples validated:** rus-100 project (41/41 tests, 0% flakiness)  
**Ready to use:** ✅ Copy and customize
