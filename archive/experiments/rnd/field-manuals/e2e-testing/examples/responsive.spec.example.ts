// examples/responsive.spec.example.ts
// Responsive design tests that satisfy CONTRACT-E2E-TESTING-001
// Copy to tests/e2e/responsive.spec.ts

import { test, expect } from '@playwright/test';
import { waitForPageReady, prepareForScreenshot } from '../helpers/test-utils';

// ✅ AC-009: Responsive tests (≥3 breakpoints)
// ✅ CONSTRAINT: Responsive breakpoints tested
const breakpoints = [
  { name: 'mobile-small', width: 320, height: 568 },
  { name: 'mobile', width: 375, height: 667 },
  { name: 'tablet', width: 768, height: 1024 },
  { name: 'desktop', width: 1920, height: 1080 },
];

test.describe('Responsive Design', () => {
  
  // ✅ AC-009: Test multiple viewport sizes
  breakpoints.forEach(({ name, width, height }) => {
    test(`should work on ${name} (${width}x${height})`, async ({ page }) => {
      await page.setViewportSize({ width, height });
      await page.goto('/');
      
      // ✅ INVARIANT: Must wait for loading state
      await waitForPageReady(page);
      
      // Check key elements are visible
      const nav = page.locator('nav:visible');
      await expect(nav).toBeVisible();
      
      // ✅ Pattern 2: Use :visible for dynamic elements
      const interactiveElements = page.locator('button:visible, a:visible');
      expect(await interactiveElements.count()).toBeGreaterThan(0);
    });
  });

  // ✅ AC-008: Visual baselines for breakpoints
  breakpoints.forEach(({ name, width, height }) => {
    test(`visual baseline for ${name}`, async ({ page }) => {
      await page.setViewportSize({ width, height });
      await page.goto('/');
      
      // ✅ Pattern 3: Prepare for screenshot
      await prepareForScreenshot(page);
      
      // ✅ INVARIANT: fullPage: false for stability
      await expect(page).toHaveScreenshot(`breakpoint-${name}.png`, {
        fullPage: false,
        animations: 'disabled',
        caret: 'hide',
        timeout: 10000,
      });
    });
  });

  // ✅ EVIDENCE: Responsive behavior analysis
  test('responsive behavior analysis', async ({ page }) => {
    console.log('=== RESPONSIVE BEHAVIOR ANALYSIS ===');
    
    for (const { name, width, height } of breakpoints) {
      await page.setViewportSize({ width, height });
      await page.goto('/');
      await waitForPageReady(page);
      
      const interactiveCount = await page.locator('button:visible, a:visible').count();
      const navVisible = await page.locator('nav:visible').count() > 0;
      
      console.log(`${name} (${width}x${height}): ${interactiveCount} interactive elements, nav visible: ${navVisible}`);
      
      expect(interactiveCount).toBeGreaterThan(0);
    }
    
    console.log('=== ANALYSIS COMPLETE ===');
  });
});

// ✅ CONSTRAINT: Responsive tests across ≥4 breakpoints
// ✅ AC-009: Multiple viewport sizes tested
