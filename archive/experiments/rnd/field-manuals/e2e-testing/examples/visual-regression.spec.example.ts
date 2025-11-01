// examples/visual-regression.spec.example.ts
// Visual regression tests that satisfy CONTRACT-E2E-TESTING-001
// Copy to tests/e2e/visual-regression.spec.ts

import { test, expect } from '@playwright/test';
import { prepareForScreenshot, waitForPageReady } from '../helpers/test-utils';

// ✅ AC-008: Visual baselines present
test.describe('Visual Regression', () => {
  
  test.beforeEach(async ({ page }) => {
    // ✅ Required prop: consistent viewport
    await page.setViewportSize({ width: 1280, height: 720 });
  });

  test('main page visual baseline', async ({ page }) => {
    await page.goto('/');
    
    // ✅ Pattern 3: CRITICAL - prepare for screenshot
    await prepareForScreenshot(page);
    
    // ✅ INVARIANT: Visual tests MUST use fullPage: false
    await expect(page).toHaveScreenshot('main-page.png', {
      fullPage: false,  // ✅ CRITICAL: Viewport only for stability
      animations: 'disabled',
      caret: 'hide',
      timeout: 10000,
    });
  });

  test('light theme visual baseline', async ({ page }) => {
    await page.goto('/');
    await prepareForScreenshot(page);
    
    // Ensure light theme
    await page.evaluate(() => {
      document.documentElement.classList.remove('dark');
    });
    
    await page.waitForTimeout(500);
    
    // ✅ AC-008: Theme variant baseline
    await expect(page).toHaveScreenshot('theme-light.png', {
      fullPage: false,
      animations: 'disabled',
      timeout: 10000,
    });
  });

  test('dark theme visual baseline', async ({ page }) => {
    await page.goto('/');
    await prepareForScreenshot(page);
    
    // Enable dark theme
    await page.evaluate(() => {
      document.documentElement.classList.add('dark');
    });
    
    await page.waitForTimeout(500);
    
    // ✅ AC-008: Theme variant baseline
    await expect(page).toHaveScreenshot('theme-dark.png', {
      fullPage: false,
      animations: 'disabled',
      timeout: 10000,
    });
  });
});

// ✅ ANTI-PATTERN AVOIDED: No fullPage: true (causes height instability)
// ✅ PATTERN APPLIED: document.fonts.ready + settle time
// ✅ INVARIANT SATISFIED: Visual tests wait for fonts
