import { test, expect } from '@playwright/test';
import { HomePage, TokensPage } from './pages/base-pages';

test.describe('Component Integration Tests', () => {
  let homePage: HomePage;
  let tokensPage: TokensPage;

  test.beforeEach(async ({ page }) => {
    homePage = new HomePage(page);
    tokensPage = new TokensPage(page);
    await homePage.goto();
  });

  test('should load all components without errors', async () => {
    // Check for common component containers
    const componentSelectors = [
      'button', // Button component
      '[role="button"]', // Interactive elements
      'nav', // Navigation
      'main', // Main content
      '[class*="card"]', // Card components
      '[class*="badge"]', // Badge components
    ];

    for (const selector of componentSelectors) {
      const elements = homePage.page.locator(selector);
      const count = await elements.count();

      if (count > 0) {
        // Check that at least one element is visible
        const visibleElements = elements.locator(':visible');
        const visibleCount = await visibleElements.count();
        expect(visibleCount).toBeGreaterThan(0);
      }
    }
  });

  test('should have proper component hierarchy', async () => {
    // Check that components are properly nested
    const mainContent = homePage.getMainContent();
    await expect(mainContent).toBeVisible();

    // Check for semantic HTML structure
    const semanticElements = ['header', 'nav', 'main', 'section', 'article'];
    for (const tag of semanticElements) {
      const elements = homePage.page.locator(tag);
      if (await elements.count() > 0) {
        await expect(elements.first()).toBeVisible();
      }
    }
  });

  test('should have accessible components', async () => {
    // Check for ARIA attributes on interactive elements (only visible ones)
    const interactiveElements = homePage.page.locator('button:visible, a:visible, input:visible, [role="button"]:visible');

    if (await interactiveElements.count() > 0) {
      // Check that interactive elements are keyboard accessible
      await interactiveElements.first().focus();
      await expect(interactiveElements.first()).toBeFocused();
    }

    // Check for proper labeling
    const buttons = homePage.page.locator('button');
    const buttonCount = await buttons.count();

    if (buttonCount > 0) {
      // At least some buttons should have accessible names
      const buttonsWithNames = await buttons.evaluateAll(elements =>
        elements.filter(el =>
          el.textContent?.trim() ||
          el.getAttribute('aria-label') ||
          el.getAttribute('aria-labelledby')
        )
      );

      // Most buttons should have accessible names
      expect(buttonsWithNames.length).toBeGreaterThan(buttonCount * 0.7);
    }
  });
});

test.describe('Design Token Integration', () => {
  test('should apply design tokens correctly', async ({ page }) => {
    await page.goto('/');

    // Check for CSS custom properties (design tokens)
    const hasTokens = await page.evaluate(() => {
      const styles = getComputedStyle(document.documentElement);
      const tokenProps = [
        '--color-background',
        '--color-foreground',
        '--color-primary',
        '--color-muted',
        '--font-sans',
        '--font-serif',
        '--spacing',
        '--radius'
      ];

      return tokenProps.some(prop => styles.getPropertyValue(prop) !== '');
    });

    if (hasTokens) {
      console.log('Design tokens detected in CSS');
    }

    // Check for Tailwind utility classes that use tokens
    const tailwindClasses = [
      'bg-background',
      'text-foreground',
      'border-border',
      'text-muted-foreground',
      'font-sans',
      'font-serif'
    ];

    for (const className of tailwindClasses) {
      const elements = page.locator(`.${className.replace(/[[\]().*+?^${}()|[\]\\]/g, '\\$&')}`);
      if (await elements.count() > 0) {
        await expect(elements.first()).toBeVisible();
      }
    }
  });

  test('should maintain token consistency across themes', async ({ page }) => {
    await page.goto('/');

    const themeToggle = page.locator('[data-testid="theme-toggle"], .theme-toggle').first();

    if (await themeToggle.isVisible()) {
      // Get initial theme
      const initialTheme = await page.evaluate(() => {
        return document.documentElement.classList.contains('dark') ? 'dark' : 'light';
      });

      // Toggle theme
      await themeToggle.click();

      // Check that theme changed
      const newTheme = await page.evaluate(() => {
        return document.documentElement.classList.contains('dark') ? 'dark' : 'light';
      });

      expect(newTheme).not.toBe(initialTheme);

      // Verify that design tokens still work in new theme
      const hasTokensAfterToggle = await page.evaluate(() => {
        const styles = getComputedStyle(document.documentElement);
        return styles.getPropertyValue('--color-background') !== '';
      });

      expect(hasTokensAfterToggle).toBe(true);

      // Toggle back
      await themeToggle.click();
      const finalTheme = await page.evaluate(() => {
        return document.documentElement.classList.contains('dark') ? 'dark' : 'light';
      });

      expect(finalTheme).toBe(initialTheme);
    }
  });
});

test.describe('Performance and Stability', () => {
  test('should not have console errors', async ({ page }) => {
    const errors: string[] = [];

    page.on('pageerror', (error) => {
      errors.push(error.message);
    });

    await page.goto('/');

    // Wait a bit for any async errors
    await page.waitForTimeout(2000);

    expect(errors).toHaveLength(0);
  });

  test('should handle rapid interactions', async ({ page }) => {
    await page.goto('/');

    // Rapidly click theme toggle if it exists
    const themeToggle = page.locator('[data-testid="theme-toggle"], .theme-toggle').first();

    if (await themeToggle.isVisible()) {
      // Rapid clicks should not break the component
      for (let i = 0; i < 5; i++) {
        await themeToggle.click();
        await page.waitForTimeout(100);
      }

      // Component should still be functional
      await expect(themeToggle).toBeVisible();
    }

    // Check for any layout shifts or broken elements
    await expect(page.locator('body')).toBeVisible();
  });

  test('should maintain layout stability', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    
    // Wait for loading state to disappear
    await page.waitForSelector('text=Загрузка данных...', { 
      state: 'hidden', 
      timeout: 10000 
    }).catch(() => {
      // Loading might not appear or already disappeared - that's fine
    });

    // Give page time to settle after loading
    await page.waitForTimeout(500);

    // Get initial layout metrics
    const initialMetrics = await page.evaluate(() => {
      return {
        scrollHeight: document.body.scrollHeight,
        scrollWidth: document.body.scrollWidth,
        viewportHeight: window.innerHeight,
        viewportWidth: window.innerWidth,
      };
    });

    // Wait for any dynamic content to load
    await page.waitForTimeout(1000);

    // Get final layout metrics
    const finalMetrics = await page.evaluate(() => {
      return {
        scrollHeight: document.body.scrollHeight,
        scrollWidth: document.body.scrollWidth,
        viewportHeight: window.innerHeight,
        viewportWidth: window.innerWidth,
      };
    });

    // Layout should not drastically change
    expect(Math.abs(initialMetrics.scrollHeight - finalMetrics.scrollHeight)).toBeLessThan(100);
    expect(Math.abs(initialMetrics.scrollWidth - finalMetrics.scrollWidth)).toBeLessThan(100);
  });
});
