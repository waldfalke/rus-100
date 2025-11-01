import { test, expect } from '@playwright/test';

test.describe('Theme Components Visual Tests', () => {
  test.beforeEach(async ({ page }) => {
    // Navigate to the demo page
    await page.goto('/demo');
    
    // Wait for theme to load
    await page.waitForSelector('[data-testid="theme-provider"]');
    
    // Ensure consistent state
    await page.evaluate(() => {
      // Disable animations for consistent screenshots
      const style = document.createElement('style');
      style.textContent = `
        *, *::before, *::after {
          animation-duration: 0s !important;
          animation-delay: 0s !important;
          transition-duration: 0s !important;
          transition-delay: 0s !important;
        }
      `;
      document.head.appendChild(style);
    });
  });

  test('Theme Example - Light Mode', async ({ page }) => {
    // Set light mode
    await page.click('[data-testid="theme-mode-light"]');
    await page.waitForTimeout(100); // Allow theme to apply
    
    // Take screenshot of the entire theme example
    await expect(page.locator('[data-testid="theme-example"]')).toHaveScreenshot('theme-example-light.png');
  });

  test('Theme Example - Dark Mode', async ({ page }) => {
    // Set dark mode
    await page.click('[data-testid="theme-mode-dark"]');
    await page.waitForTimeout(100);
    
    await expect(page.locator('[data-testid="theme-example"]')).toHaveScreenshot('theme-example-dark.png');
  });

  test('Theme Example - High Contrast', async ({ page }) => {
    // Enable high contrast
    await page.click('[data-testid="theme-contrast-high"]');
    await page.waitForTimeout(100);
    
    await expect(page.locator('[data-testid="theme-example"]')).toHaveScreenshot('theme-example-high-contrast.png');
  });

  test('Theme Buttons - All Variants', async ({ page }) => {
    const buttonContainer = page.locator('[data-testid="theme-buttons"]');
    
    // Test primary button
    await expect(buttonContainer.locator('[data-variant="primary"]')).toHaveScreenshot('button-primary.png');
    
    // Test secondary button
    await expect(buttonContainer.locator('[data-variant="secondary"]')).toHaveScreenshot('button-secondary.png');
    
    // Test danger button
    await expect(buttonContainer.locator('[data-variant="danger"]')).toHaveScreenshot('button-danger.png');
  });

  test('Theme Cards - Interactive States', async ({ page }) => {
    const cardContainer = page.locator('[data-testid="theme-cards"]');
    const firstCard = cardContainer.locator('.theme-card').first();
    
    // Default state
    await expect(firstCard).toHaveScreenshot('card-default.png');
    
    // Hover state
    await firstCard.hover();
    await expect(firstCard).toHaveScreenshot('card-hover.png');
    
    // Focus state
    await firstCard.focus();
    await expect(firstCard).toHaveScreenshot('card-focus.png');
  });

  test('Typography Scale', async ({ page }) => {
    const typographyContainer = page.locator('[data-testid="typography-scale"]');
    
    await expect(typographyContainer).toHaveScreenshot('typography-scale.png');
  });

  test('Color Palette Display', async ({ page }) => {
    const colorPalette = page.locator('[data-testid="color-palette"]');
    
    await expect(colorPalette).toHaveScreenshot('color-palette.png');
  });

  test('Context Demo - Platform Adaptations', async ({ page }) => {
    // Navigate to context demo
    await page.goto('/demo/context');
    await page.waitForSelector('[data-testid="context-demo"]');
    
    // Test iOS adaptation
    await page.selectOption('[data-testid="platform-selector"]', 'ios');
    await page.waitForTimeout(100);
    await expect(page.locator('[data-testid="context-demo"]')).toHaveScreenshot('context-demo-ios.png');
    
    // Test Android adaptation
    await page.selectOption('[data-testid="platform-selector"]', 'android');
    await page.waitForTimeout(100);
    await expect(page.locator('[data-testid="context-demo"]')).toHaveScreenshot('context-demo-android.png');
    
    // Test Web adaptation
    await page.selectOption('[data-testid="platform-selector"]', 'web');
    await page.waitForTimeout(100);
    await expect(page.locator('[data-testid="context-demo"]')).toHaveScreenshot('context-demo-web.png');
  });

  test('Accessibility Features', async ({ page }) => {
    // Test reduced motion
    await page.emulateMedia({ reducedMotion: 'reduce' });
    await page.reload();
    await page.waitForSelector('[data-testid="theme-example"]');
    
    await expect(page.locator('[data-testid="theme-example"]')).toHaveScreenshot('theme-reduced-motion.png');
    
    // Test high contrast mode
    await page.emulateMedia({ colorScheme: 'dark', reducedMotion: null });
    await page.addInitScript(() => {
      Object.defineProperty(window, 'matchMedia', {
        writable: true,
        value: jest.fn().mockImplementation(query => ({
          matches: query.includes('prefers-contrast: high'),
          media: query,
          onchange: null,
          addListener: jest.fn(),
          removeListener: jest.fn(),
          addEventListener: jest.fn(),
          removeEventListener: jest.fn(),
          dispatchEvent: jest.fn(),
        })),
      });
    });
    await page.reload();
    await page.waitForSelector('[data-testid="theme-example"]');
    
    await expect(page.locator('[data-testid="theme-example"]')).toHaveScreenshot('theme-high-contrast-system.png');
  });

  test('Responsive Design - Mobile', async ({ page }) => {
    // Set mobile viewport
    await page.setViewportSize({ width: 375, height: 667 });
    
    await expect(page.locator('[data-testid="theme-example"]')).toHaveScreenshot('theme-example-mobile.png');
  });

  test('Responsive Design - Tablet', async ({ page }) => {
    // Set tablet viewport
    await page.setViewportSize({ width: 768, height: 1024 });
    
    await expect(page.locator('[data-testid="theme-example"]')).toHaveScreenshot('theme-example-tablet.png');
  });

  test('Token Resolution Display', async ({ page }) => {
    // Navigate to token display page
    await page.goto('/demo/tokens');
    await page.waitForSelector('[data-testid="token-display"]');
    
    // Test color tokens
    await expect(page.locator('[data-testid="color-tokens"]')).toHaveScreenshot('color-tokens-display.png');
    
    // Test spacing tokens
    await expect(page.locator('[data-testid="spacing-tokens"]')).toHaveScreenshot('spacing-tokens-display.png');
    
    // Test typography tokens
    await expect(page.locator('[data-testid="typography-tokens"]')).toHaveScreenshot('typography-tokens-display.png');
  });

  test('Theme Switching Animation', async ({ page }) => {
    // Enable animations for this test
    await page.evaluate(() => {
      const styles = document.querySelectorAll('style');
      styles.forEach(style => {
        if (style.textContent?.includes('animation-duration: 0s')) {
          style.remove();
        }
      });
    });
    
    // Take screenshot before switch
    await expect(page.locator('[data-testid="theme-example"]')).toHaveScreenshot('theme-before-switch.png');
    
    // Switch theme
    await page.click('[data-testid="theme-mode-dark"]');
    
    // Wait for animation to complete
    await page.waitForTimeout(300);
    
    // Take screenshot after switch
    await expect(page.locator('[data-testid="theme-example"]')).toHaveScreenshot('theme-after-switch.png');
  });
});