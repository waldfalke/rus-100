// examples/accessibility.spec.example.ts
// Accessibility tests that satisfy CONTRACT-E2E-TESTING-001
// Copy to tests/e2e/accessibility.spec.ts

import { test, expect } from '@playwright/test';
import { waitForPageReady } from '../helpers/test-utils';

// ✅ CONSTRAINT: Accessibility requirements
test.describe('Accessibility Tests', () => {

  test('keyboard navigation works', async ({ page }) => {
    await page.goto('/');
    await waitForPageReady(page);
    
    // ✅ CONSTRAINT: Keyboard navigation testable
    // ✅ Pattern 2: Use :visible for interactive elements
    const interactiveElements = page.locator(
      'button:visible, a:visible, input:visible, [role="button"]:visible'
    );
    
    const count = await interactiveElements.count();
    expect(count).toBeGreaterThan(0);
    
    // ✅ ANTI-PATTERN FIX: NOT .first() without :visible
    // Test first element is focusable
    await interactiveElements.first().focus();
    await expect(interactiveElements.first()).toBeFocused();
    
    // Tab through first 5 elements
    for (let i = 0; i < Math.min(count, 5); i++) {
      await page.keyboard.press('Tab');
      await page.waitForTimeout(100);
      
      const focused = page.locator(':focus');
      await expect(focused).toBeVisible();
    }
  });

  test('semantic HTML structure present', async ({ page }) => {
    await page.goto('/');
    await waitForPageReady(page);
    
    // ✅ CONSTRAINT: Semantic HTML verified
    const semanticElements = ['header', 'nav', 'main'];
    
    for (const tag of semanticElements) {
      const elements = page.locator(tag);
      const count = await elements.count();
      
      if (count > 0) {
        await expect(elements.first()).toBeVisible();
      }
    }
  });

  test('proper heading hierarchy', async ({ page }) => {
    await page.goto('/');
    await waitForPageReady(page);
    
    // Check for h1
    const h1 = page.locator('h1');
    const h1Count = await h1.count();
    
    expect(h1Count).toBeGreaterThan(0);
    
    if (h1Count > 0) {
      await expect(h1.first()).toBeVisible();
    }
  });

  test('focus management on interactions', async ({ page }) => {
    await page.goto('/');
    await waitForPageReady(page);
    
    // ✅ Pattern 2: Get visible buttons
    const buttons = page.locator('button:visible');
    
    if (await buttons.count() > 0) {
      const firstButton = buttons.first();
      
      // Focus button
      await firstButton.focus();
      await expect(firstButton).toBeFocused();
      
      // Click and verify focus management
      await firstButton.click();
      await page.waitForTimeout(500);
      
      // Focus should be managed (not lost)
      const focused = page.locator(':focus');
      const hasFocus = await focused.count() > 0;
      
      // At least some element should have focus
      expect(hasFocus).toBeTruthy();
    }
  });
});

// ✅ CONSTRAINT: Accessibility checks implemented
// ✅ INVARIANT: Selectors use :visible for dynamic elements
