# ⚡ E2E Testing Quick Start Guide

**Setup time:** 15 minutes  
**First test:** 5 minutes  
**Full suite:** 1 hour

---

## 🚀 **15-Minute Setup**

### Step 1: Install (2 min)
```bash
npm install -D @playwright/test
npx playwright install chromium
```

### Step 2: Create Config (3 min)
Create `playwright-e2e.config.ts`:
```typescript
import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: 'tests/e2e',
  testMatch: '**/*.spec.ts',
  use: {
    baseURL: 'http://localhost:3000',
    screenshot: 'only-on-failure',
  },
  projects: [
    { name: 'chromium', use: { ...devices['Desktop Chrome'] } },
  ],
  webServer: {
    command: 'npm run dev',
    url: 'http://localhost:3000',
    reuseExistingServer: true,
  },
});
```

### Step 3: Add Scripts (2 min)
In `package.json`:
```json
{
  "scripts": {
    "test:e2e": "playwright test --config=playwright-e2e.config.ts",
    "test:e2e:ui": "playwright test --config=playwright-e2e.config.ts --ui"
  }
}
```

### Step 4: Create Helper (3 min)
Create `tests/helpers/test-utils.ts`:
```typescript
import { Page } from '@playwright/test';

export async function waitForPageReady(page: Page) {
  await page.waitForLoadState('networkidle');
  await page.waitForSelector('text=Loading...', { 
    state: 'hidden', 
    timeout: 10000 
  }).catch(() => {});
  await page.waitForTimeout(500);
}
```

### Step 5: First Test (5 min)
Create `tests/e2e/smoke.spec.ts`:
```typescript
import { test, expect } from '@playwright/test';
import { waitForPageReady } from '../helpers/test-utils';

test('homepage loads', async ({ page }) => {
  await page.goto('/');
  await waitForPageReady(page);
  
  await expect(page.locator('h1')).toBeVisible();
});
```

### Step 6: Run! (1 min)
```bash
npm run test:e2e
```

✅ **Done! Your first E2E test is running.**

---

## 🎯 **Next Steps**

### Add More Tests (30 min)
```typescript
test('navigation works', async ({ page }) => {
  await page.goto('/');
  await waitForPageReady(page);
  
  await page.click('a:text("About")');
  await waitForPageReady(page);
  
  await expect(page).toHaveURL('/about');
});

test('button interaction', async ({ page }) => {
  await page.goto('/');
  await waitForPageReady(page);
  
  const button = page.locator('button:visible').first();
  await button.click();
  
  await expect(page.locator('.result')).toBeVisible();
});
```

### Add Visual Tests (20 min)
```typescript
test('visual baseline', async ({ page }) => {
  await page.goto('/');
  await waitForPageReady(page);
  await page.evaluate(() => document.fonts.ready);
  await page.waitForTimeout(1000);
  
  await expect(page).toHaveScreenshot('homepage.png', {
    fullPage: false,
    animations: 'disabled',
  });
});
```

### Add Responsive Tests (20 min)
```typescript
const breakpoints = [
  { name: 'mobile', width: 375, height: 667 },
  { name: 'desktop', width: 1920, height: 1080 },
];

breakpoints.forEach(({ name, width, height }) => {
  test(`works on ${name}`, async ({ page }) => {
    await page.setViewportSize({ width, height });
    await page.goto('/');
    await waitForPageReady(page);
    
    await expect(page.locator('nav:visible')).toBeVisible();
  });
});
```

---

## 📋 **Checklist**

- [ ] Playwright installed
- [ ] Config file created
- [ ] Scripts added to package.json
- [ ] Helper functions created
- [ ] First test written
- [ ] Tests run successfully
- [ ] Visual tests added (optional)
- [ ] Responsive tests added (optional)
- [ ] CI/CD configured (optional)

---

## 🆘 **Quick Troubleshooting**

### "No tests found"
→ Check `testMatch` pattern in config

### "Port already in use"
→ Stop other dev servers or change port

### "Element not found"
→ Add `waitForPageReady(page)` before assertions

### "Screenshot doesn't match"
→ Wait for fonts: `await page.evaluate(() => document.fonts.ready)`

### "Element is hidden"
→ Use `:visible` selector: `page.locator('button:visible')`

---

## 🎓 **Pro Tips**

1. **Always use `waitForPageReady()`** before assertions
2. **Use `:visible`** for dynamic elements
3. **Set `fullPage: false`** for stable visual tests
4. **Add `data-testid`** for important elements
5. **Run tests in UI mode** for debugging: `npm run test:e2e:ui`

---

**Time to first green test:** 15 minutes ✅  
**Time to full test suite:** 1 hour ✅
