import { Page, Locator } from '@playwright/test';

/**
 * Base page class with common functionality
 */
export class BasePage {
  readonly page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  /**
   * Wait for page to be fully loaded
   */
  async waitForPageLoad(): Promise<void> {
    await this.page.waitForLoadState('networkidle');
  }

  /**
   * Get page title
   */
  async getTitle(): Promise<string> {
    return await this.page.title();
  }

  /**
   * Check if element is visible
   */
  async isElementVisible(selector: string): Promise<boolean> {
    const element = this.page.locator(selector);
    return await element.isVisible();
  }

  /**
   * Get element text content
   */
  async getElementText(selector: string): Promise<string | null> {
    const element = this.page.locator(selector);
    return await element.textContent();
  }

  /**
   * Click element with optional timeout
   */
  async clickElement(selector: string, timeout = 5000): Promise<void> {
    await this.page.click(selector, { timeout });
  }

  /**
   * Type text into element
   */
  async typeText(selector: string, text: string): Promise<void> {
    await this.page.fill(selector, text);
  }

  /**
   * Take screenshot
   */
  async takeScreenshot(name: string): Promise<void> {
    await this.page.screenshot({ path: `test-results/screenshots/${name}.png` });
  }
}

/**
 * Home page specific functionality
 */
export class HomePage extends BasePage {
  /**
   * Navigate to home page
   */
  async goto(): Promise<void> {
    await this.page.goto('/');
    await this.waitForPageLoad();
  }

  /**
   * Get main content area
   */
  getMainContent(): Locator {
    return this.page.locator('main, [role="main"], .main-content').first();
  }

  /**
   * Get theme toggle button
   */
  getThemeToggle(): Locator {
    return this.page.locator('[data-testid="theme-toggle"], .theme-toggle, button:has([data-lucide="sun"], [data-lucide="moon"])').first();
  }

  /**
   * Toggle theme
   */
  async toggleTheme(): Promise<void> {
    const themeToggle = this.getThemeToggle();
    if (await themeToggle.isVisible()) {
      await themeToggle.click();
    }
  }

  /**
   * Get current theme
   */
  async getCurrentTheme(): Promise<'light' | 'dark'> {
    const isDark = await this.page.evaluate(() => {
      return document.documentElement.classList.contains('dark');
    });
    return isDark ? 'dark' : 'light';
  }
}

/**
 * Design tokens page functionality
 */
export class TokensPage extends BasePage {
  /**
   * Navigate to tokens page (if exists)
   */
  async goto(): Promise<void> {
    await this.page.goto('/');
    await this.waitForPageLoad();
  }

  /**
   * Get token container
   */
  getTokenContainer(): Locator {
    return this.page.locator('[data-testid="design-tokens"], .design-tokens, .token-display').first();
  }

  /**
   * Get color swatches
   */
  getColorSwatches(): Locator {
    return this.page.locator('.color-swatch, [style*="background-color"]');
  }

  /**
   * Get typography samples
   */
  getTypographySamples(): Locator {
    return this.page.locator('.typography-sample, .font-sample');
  }

  /**
   * Check if tokens are displayed
   */
  async areTokensDisplayed(): Promise<boolean> {
    const container = this.getTokenContainer();
    return await container.isVisible();
  }
}

/**
 * Test generator page functionality (if exists)
 */
export class TestGeneratorPage extends BasePage {
  /**
   * Navigate to test generator (if exists)
   */
  async goto(): Promise<void> {
    await this.page.goto('/');
    await this.waitForPageLoad();
  }

  /**
   * Get task cards
   */
  getTaskCards(): Locator {
    return this.page.locator('.task-card, [data-testid="task-card"]');
  }

  /**
   * Get increment button for specific task
   */
  getIncrementButton(taskIndex: number): Locator {
    return this.page.locator(`.task-card, [data-testid="task-card"]`).nth(taskIndex).locator('button:has([data-lucide="plus"], [data-lucide="chevron-up"])');
  }

  /**
   * Get decrement button for specific task
   */
  getDecrementButton(taskIndex: number): Locator {
    return this.page.locator(`.task-card, [data-testid="task-card"]`).nth(taskIndex).locator('button:has([data-lucide="minus"], [data-lucide="chevron-down"])');
  }

  /**
   * Get count display for specific task
   */
  getCountDisplay(taskIndex: number): Locator {
    return this.page.locator(`.task-card, [data-testid="task-card"]`).nth(taskIndex).locator('.count, [data-testid="count"]');
  }

  /**
   * Increment task count
   */
  async incrementTask(taskIndex: number): Promise<void> {
    const button = this.getIncrementButton(taskIndex);
    if (await button.isVisible() && await button.isEnabled()) {
      await button.click();
    }
  }

  /**
   * Decrement task count
   */
  async decrementTask(taskIndex: number): Promise<void> {
    const button = this.getDecrementButton(taskIndex);
    if (await button.isVisible() && await button.isEnabled()) {
      await button.click();
    }
  }

  /**
   * Get current count for task
   */
  async getTaskCount(taskIndex: number): Promise<number> {
    const countElement = this.getCountDisplay(taskIndex);
    if (await countElement.isVisible()) {
      const text = await countElement.textContent();
      return parseInt(text || '0', 10);
    }
    return 0;
  }
}
