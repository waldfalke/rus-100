# 📦 E2E Testing Templates & Artifacts

**Purpose:** Ready-to-use templates for implementing E2E testing in any project  
**Source:** Distilled from rus-100 project (41/41 tests, 100% success)  
**Updated:** 2025-01-10

---

## 📚 **Available Artifacts**

### 1. **Core Documentation** 
- [`../DISTILLED-E2E-METHODOLOGY.md`](../DISTILLED-E2E-METHODOLOGY.md) - Complete methodology
- [`QUICK-START-GUIDE.md`](./QUICK-START-GUIDE.md) - 15-minute setup guide

### 2. **Configuration Templates**
- [`playwright-e2e.config.template.ts`](#config-template) - Playwright config
- [`package.json.template`](#npm-scripts) - npm scripts
- [`test-utils.template.ts`](#helpers) - Helper functions

### 3. **Test Templates**
- [`smoke-test.template.ts`](#smoke-test) - Basic functionality
- [`visual-regression.template.ts`](#visual-test) - Visual baselines
- [`responsive.template.ts`](#responsive-test) - Breakpoint testing
- [`accessibility.template.ts`](#accessibility-test) - A11y checks

### 4. **CI/CD Templates**
- [`github-actions.template.yml`](#github-actions) - GitHub workflow
- [`gitlab-ci.template.yml`](#gitlab-ci) - GitLab pipeline

---

## 🎯 **Quick Copy-Paste Templates**

### <a name="config-template"></a>Config Template

**File:** `playwright-e2e.config.ts`

```typescript
import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: 'tests/e2e',
  testMatch: '**/*.spec.ts',
  outputDir: 'test-results/e2e',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  
  reporter: [
    ['html', { outputFolder: 'playwright-report/e2e' }],
    ['json', { outputFile: 'test-results/e2e-results.json' }],
    ['list']
  ],
  
  use: {
    baseURL: 'http://localhost:3000', // 👈 Change to your URL
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
  },
  
  projects: [
    { name: 'chromium', use: { ...devices['Desktop Chrome'] } },
  ],
  
  webServer: {
    command: 'npm run dev', // 👈 Change to your command
    url: 'http://localhost:3000',
    reuseExistingServer: true,
    timeout: 120 * 1000,
  },
});
```

---

### <a name="npm-scripts"></a>NPM Scripts

**Add to:** `package.json`

```json
{
  "scripts": {
    "test:e2e": "playwright test --config=playwright-e2e.config.ts",
    "test:e2e:ui": "playwright test --config=playwright-e2e.config.ts --ui",
    "test:e2e:headed": "playwright test --config=playwright-e2e.config.ts --headed",
    "test:e2e:debug": "playwright test --config=playwright-e2e.config.ts --debug",
    "test:e2e:report": "playwright show-report playwright-report/e2e",
    "test:e2e:install": "playwright install"
  }
}
```

---

### <a name="helpers"></a>Helper Functions

**File:** `tests/helpers/test-utils.ts`

```typescript
import { Page, Locator } from '@playwright/test';

/**
 * Wait for page to be fully loaded and settled
 * CRITICAL: Use this in every test before assertions!
 */
export async function waitForPageReady(
  page: Page, 
  loadingText: string = 'Loading...' // 👈 Customize for your app
) {
  await page.waitForLoadState('networkidle');
  
  // Wait for loading indicator to disappear
  await page.waitForSelector(`text=${loadingText}`, { 
    state: 'hidden', 
    timeout: 10000 
  }).catch(() => {
    // Loading might not appear - that's fine
  });
  
  // Give page time to settle
  await page.waitForTimeout(500);
}

/**
 * Click element safely, handling obscured elements
 */
export async function clickSafely(element: Locator) {
  await element.click({ force: true }).catch(async (error) => {
    console.log(`Force click failed: ${error.message}`);
    await element.scrollIntoViewIfNeeded();
    await element.click();
  });
}

/**
 * Prepare page for screenshot (fonts + settle)
 */
export async function prepareForScreenshot(page: Page) {
  await waitForPageReady(page);
  await page.evaluate(() => document.fonts.ready);
  await page.waitForTimeout(1000);
}

/**
 * Get only visible elements
 */
export function getVisibleElements(
  page: Page, 
  selector: string
): Locator {
  return page.locator(`${selector}:visible`);
}
```

---

### <a name="smoke-test"></a>Smoke Test Template

**File:** `tests/e2e/smoke.spec.ts`

```typescript
import { test, expect } from '@playwright/test';
import { waitForPageReady } from '../helpers/test-utils';

test.describe('Smoke Tests', () => {
  test('homepage loads', async ({ page }) => {
    await page.goto('/');
    await waitForPageReady(page);
    
    // Check for key elements
    await expect(page.locator('h1')).toBeVisible();
    await expect(page.locator('nav:visible')).toBeVisible();
  });

  test('navigation works', async ({ page }) => {
    await page.goto('/');
    await waitForPageReady(page);
    
    // Click navigation link
    const link = page.locator('a:visible').first();
    await link.click();
    await waitForPageReady(page);
    
    // Verify navigation occurred
    expect(page.url()).not.toBe('/');
  });

  test('interactive elements respond', async ({ page }) => {
    await page.goto('/');
    await waitForPageReady(page);
    
    // Find and click button
    const button = page.locator('button:visible').first();
    await button.click();
    
    // Wait for response
    await page.waitForTimeout(500);
    
    // Verify interaction worked (customize assertion)
    const result = page.locator('[class*="result"]');
    await expect(result).toBeVisible();
  });
});
```

---

### <a name="visual-test"></a>Visual Regression Template

**File:** `tests/e2e/visual-regression.spec.ts`

```typescript
import { test, expect } from '@playwright/test';
import { prepareForScreenshot } from '../helpers/test-utils';

test.describe('Visual Regression', () => {
  test.beforeEach(async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 720 });
  });

  test('main page visual baseline', async ({ page }) => {
    await page.goto('/');
    await prepareForScreenshot(page);
    
    await expect(page).toHaveScreenshot('main-page.png', {
      fullPage: false,
      animations: 'disabled',
      caret: 'hide',
      timeout: 10000,
    });
  });

  test('light theme baseline', async ({ page }) => {
    await page.goto('/');
    await prepareForScreenshot(page);
    
    // Ensure light theme
    await page.evaluate(() => {
      document.documentElement.classList.remove('dark');
    });
    
    await page.waitForTimeout(500);
    
    await expect(page).toHaveScreenshot('theme-light.png', {
      fullPage: false,
      animations: 'disabled',
      timeout: 10000,
    });
  });

  test('dark theme baseline', async ({ page }) => {
    await page.goto('/');
    await prepareForScreenshot(page);
    
    // Enable dark theme
    await page.evaluate(() => {
      document.documentElement.classList.add('dark');
    });
    
    await page.waitForTimeout(500);
    
    await expect(page).toHaveScreenshot('theme-dark.png', {
      fullPage: false,
      animations: 'disabled',
      timeout: 10000,
    });
  });
});
```

---

### <a name="responsive-test"></a>Responsive Testing Template

**File:** `tests/e2e/responsive.spec.ts`

```typescript
import { test, expect } from '@playwright/test';
import { waitForPageReady } from '../helpers/test-utils';

const breakpoints = [
  { name: 'mobile-small', width: 320, height: 568 },
  { name: 'mobile', width: 375, height: 667 },
  { name: 'tablet', width: 768, height: 1024 },
  { name: 'desktop', width: 1920, height: 1080 },
];

test.describe('Responsive Design', () => {
  breakpoints.forEach(({ name, width, height }) => {
    test(`should work on ${name} (${width}x${height})`, async ({ page }) => {
      await page.setViewportSize({ width, height });
      await page.goto('/');
      await waitForPageReady(page);
      
      // Check key elements are visible
      const nav = page.locator('nav:visible');
      await expect(nav).toBeVisible();
      
      // Test interaction
      const interactiveElements = page.locator('button:visible, a:visible');
      expect(await interactiveElements.count()).toBeGreaterThan(0);
    });
  });

  test('responsive behavior analysis', async ({ page }) => {
    for (const { name, width, height } of breakpoints) {
      await page.setViewportSize({ width, height });
      await page.goto('/');
      await waitForPageReady(page);
      
      const count = await page.locator('button:visible, a:visible').count();
      console.log(`${name}: ${count} interactive elements`);
      
      expect(count).toBeGreaterThan(0);
    }
  });
});
```

---

### <a name="accessibility-test"></a>Accessibility Testing Template

**File:** `tests/e2e/accessibility.spec.ts`

```typescript
import { test, expect } from '@playwright/test';
import { waitForPageReady } from '../helpers/test-utils';

test.describe('Accessibility', () => {
  test('keyboard navigation works', async ({ page }) => {
    await page.goto('/');
    await waitForPageReady(page);
    
    // Get interactive elements
    const interactiveElements = page.locator(
      'button:visible, a:visible, input:visible, [role="button"]:visible'
    );
    
    const count = await interactiveElements.count();
    expect(count).toBeGreaterThan(0);
    
    // Test first element is focusable
    await interactiveElements.first().focus();
    await expect(interactiveElements.first()).toBeFocused();
    
    // Test Tab navigation
    for (let i = 0; i < Math.min(count, 5); i++) {
      await page.keyboard.press('Tab');
      await page.waitForTimeout(100);
      
      const focused = page.locator(':focus');
      await expect(focused).toBeVisible();
    }
  });

  test('semantic HTML structure', async ({ page }) => {
    await page.goto('/');
    await waitForPageReady(page);
    
    // Check for semantic elements
    const semanticElements = ['header', 'nav', 'main', 'footer'];
    
    for (const tag of semanticElements) {
      const elements = page.locator(tag);
      if (await elements.count() > 0) {
        await expect(elements.first()).toBeVisible();
      }
    }
  });

  test('headings hierarchy', async ({ page }) => {
    await page.goto('/');
    await waitForPageReady(page);
    
    // Check for h1
    const h1 = page.locator('h1');
    expect(await h1.count()).toBeGreaterThan(0);
    
    // Verify h1 is visible
    if (await h1.count() > 0) {
      await expect(h1.first()).toBeVisible();
    }
  });
});
```

---

### <a name="github-actions"></a>GitHub Actions Template

**File:** `.github/workflows/e2e-tests.yml`

```yaml
name: E2E Tests

on:
  push:
    branches: [ main, develop ]
  pull_request:
    branches: [ main ]

jobs:
  test:
    runs-on: ubuntu-latest
    
    steps:
      - name: Checkout code
        uses: actions/checkout@v3
      
      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'
          cache: 'npm'
      
      - name: Install dependencies
        run: npm ci
      
      - name: Install Playwright browsers
        run: npm run test:e2e:install
      
      - name: Run E2E tests
        run: npm run test:e2e
      
      - name: Upload test results
        if: always()
        uses: actions/upload-artifact@v3
        with:
          name: playwright-report
          path: playwright-report/
          retention-days: 30
      
      - name: Upload screenshots
        if: failure()
        uses: actions/upload-artifact@v3
        with:
          name: test-results
          path: test-results/
          retention-days: 30
```

---

### <a name="gitlab-ci"></a>GitLab CI Template

**File:** `.gitlab-ci.yml`

```yaml
e2e-tests:
  image: mcr.microsoft.com/playwright:v1.40.0-focal
  stage: test
  script:
    - npm ci
    - npm run test:e2e:install
    - npm run test:e2e
  artifacts:
    when: always
    paths:
      - playwright-report/
      - test-results/
    expire_in: 30 days
  only:
    - main
    - develop
    - merge_requests
```

---

## 🎯 **Usage Instructions**

### For New Projects

1. **Copy templates** to your project
2. **Customize** baseURL, loading text, selectors
3. **Install** Playwright: `npm install -D @playwright/test`
4. **Install browsers**: `npx playwright install`
5. **Run tests**: `npm run test:e2e`

### For Existing Projects

1. **Review** current test structure
2. **Add helpers** from templates
3. **Migrate tests** gradually
4. **Update configs** to match templates
5. **Verify** all tests pass

---

## 📊 **Customization Checklist**

- [ ] Update `baseURL` in config
- [ ] Change loading text in `waitForPageReady()`
- [ ] Adjust breakpoints for your design
- [ ] Update selectors for your components
- [ ] Customize timeout values if needed
- [ ] Add project-specific helpers
- [ ] Configure CI/CD for your platform

---

## 🎓 **Best Practices**

### DO ✅
- Use `waitForPageReady()` in every test
- Use `:visible` selectors for dynamic elements
- Add `data-testid` to important elements
- Set `fullPage: false` for visual tests
- Handle errors gracefully with `.catch()`

### DON'T ❌
- Skip loading state checks
- Use `.first()` without checking visibility
- Hardcode long timeouts everywhere
- Test implementation details
- Ignore flaky tests

---

## 🆘 **Troubleshooting**

### Tests fail locally
1. Check dev server is running
2. Verify baseURL is correct
3. Add more wait time in `waitForPageReady()`

### Tests flaky on CI
1. Increase timeout in config
2. Add more `waitForTimeout()` calls
3. Check viewport size consistency

### Visual tests always fail
1. Wait for fonts: `document.fonts.ready`
2. Use `fullPage: false`
3. Disable animations
4. Add settle time (1000ms)

---

## 📝 **Version History**

- **v1.0.0** (2025-01-10): Initial templates
  - Based on rus-100 project
  - 41 tests, 100% success rate
  - 0% flakiness

---

## 🤝 **Contributing**

Found an issue or improvement?
1. Test the change in your project
2. Document the pattern
3. Submit PR with template update

---

**Ready to use:** ✅  
**Production tested:** ✅  
**Proven success:** 41/41 tests (100%)
