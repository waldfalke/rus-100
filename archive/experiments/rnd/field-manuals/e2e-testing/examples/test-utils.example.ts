// examples/test-utils.example.ts
// Helper library that satisfies CONTRACT-E2E-TESTING-001
// Copy to tests/helpers/test-utils.ts

import { Page, Locator } from '@playwright/test';

/**
 * ✅ Pattern 1: Loading State Management
 * INVARIANT: Every test MUST call this before assertions
 * 
 * Waits for page to be fully loaded and settled.
 * Handles async content loading and prevents flaky tests.
 * 
 * @param page - Playwright page object
 * @param loadingText - Text of loading indicator (customize for your app)
 */
export async function waitForPageReady(
  page: Page, 
  loadingText: string = 'Loading...'  // ✅ Required prop: loadingIndicatorText
) {
  // Wait for network to be idle
  await page.waitForLoadState('networkidle');
  
  // ✅ CRITICAL: Wait for loading indicator to disappear
  await page.waitForSelector(`text=${loadingText}`, { 
    state: 'hidden', 
    timeout: 10000 
  }).catch(() => {
    // Loading might not appear - that's fine
    // ✅ Pattern 4: Graceful failure handling
  });
  
  // Give page time to settle (constraint: 500-1000ms max)
  await page.waitForTimeout(500);
}

/**
 * ✅ Pattern 3: Visual Regression Stability
 * Prepares page for deterministic screenshots
 * 
 * @param page - Playwright page object
 */
export async function prepareForScreenshot(page: Page) {
  await waitForPageReady(page);
  
  // ✅ INVARIANT: Visual tests MUST wait for fonts
  await page.evaluate(() => document.fonts.ready);
  
  // ✅ CONSTRAINT: Settle time ≤1000ms
  await page.waitForTimeout(1000);
}

/**
 * ✅ Pattern 2: Resilient Selector Strategy
 * Gets only visible elements (prevents "element is hidden" errors)
 * 
 * @param page - Playwright page object
 * @param selector - CSS selector
 * @returns Locator for visible elements only
 */
export function getVisibleElements(
  page: Page, 
  selector: string
): Locator {
  // ✅ INVARIANT: Dynamic selectors MUST use :visible
  return page.locator(`${selector}:visible`);
}

/**
 * ✅ Pattern 4: Graceful Failure Handling
 * Click element safely, handling obscured elements
 * 
 * @param element - Locator to click
 */
export async function clickSafely(element: Locator) {
  // ✅ INVARIANT: Non-critical operations MUST have .catch()
  await element.click({ force: true }).catch(async (error) => {
    console.log(`Force click failed: ${error.message}`);
    
    // Fallback: scroll into view and retry
    await element.scrollIntoViewIfNeeded();
    await element.click();
  });
}

/**
 * Wait for element and ensure visibility
 * 
 * @param page - Playwright page object
 * @param selector - CSS selector
 * @param options - Wait options
 * @returns Visible element locator
 */
export async function waitForElement(
  page: Page,
  selector: string,
  options: { timeout?: number } = {}
) {
  const element = page.locator(selector);
  await element.waitFor({ 
    state: 'visible', 
    timeout: options.timeout || 5000 
  });
  return element;
}

/**
 * Take screenshot with error handling
 * ✅ ANTI-PATTERN FIX: Screenshots shouldn't fail tests
 * 
 * @param page - Playwright page object
 * @param path - Screenshot path
 * @param options - Screenshot options
 */
export async function takeScreenshot(
  page: Page,
  path: string,
  options: any = {}
) {
  // ✅ Pattern 4: Non-critical operations have .catch()
  await page.screenshot({ path, ...options }).catch((error) => {
    console.log(`Screenshot failed: ${error.message}`);
  });
}

/**
 * Set viewport size for responsive testing
 * ✅ CONSTRAINT: Responsive breakpoints tested
 * 
 * @param page - Playwright page object
 * @param breakpoint - Breakpoint name or custom size
 */
export async function setBreakpoint(
  page: Page,
  breakpoint: 'mobile' | 'tablet' | 'desktop' | { width: number, height: number }
) {
  const breakpoints = {
    mobile: { width: 375, height: 667 },
    tablet: { width: 768, height: 1024 },
    desktop: { width: 1920, height: 1080 },
  };
  
  const size = typeof breakpoint === 'string' 
    ? breakpoints[breakpoint] 
    : breakpoint;
  
  await page.setViewportSize(size);
}

// ✅ INVARIANT: Helpers MUST be reusable across tests
// All functions exported and documented with JSDoc
