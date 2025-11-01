/**
 * Elevation Visual Regression Tests
 * 
 * Visual testing for elevation tokens using Playwright to ensure
 * consistent shadow rendering across themes, platforms, and accessibility modes.
 */

import { test, expect, Page, BrowserContext } from '@playwright/test';

// ============================================================================
// TEST CONFIGURATION
// ============================================================================

const ELEVATION_LEVELS = [0, 1, 2, 3, 4, 5];
const ELEVATION_VARIANTS = ['subtle', 'moderate', 'prominent', 'dramatic'];
const COMPONENT_SIZES = ['xs', 'sm', 'md', 'lg', 'xl'];
const PLATFORMS = ['web', 'mobile', 'desktop'];
const THEME_MODES = ['light', 'dark'];

// Test viewport configurations
const VIEWPORTS = {
  desktop: { width: 1920, height: 1080 },
  tablet: { width: 768, height: 1024 },
  mobile: { width: 375, height: 667 }
};

// ============================================================================
// TEST UTILITIES
// ============================================================================

/**
 * Create a test page with elevation demo
 */
async function createElevationTestPage(page: Page, config: {
  theme?: 'light' | 'dark';
  accessibility?: {
    highContrast?: boolean;
    reducedMotion?: boolean;
    prefersReducedData?: boolean;
  };
  platform?: 'web' | 'mobile' | 'desktop';
}) {
  const { theme = 'light', accessibility = {}, platform = 'web' } = config;

  // Set up media query mocks for accessibility preferences
  if (accessibility.highContrast) {
    await page.addInitScript(() => {
      Object.defineProperty(window, 'matchMedia', {
        writable: true,
        value: (query: string) => ({
          matches: query.includes('prefers-contrast: high'),
          media: query,
          onchange: null,
          addListener: () => {},
          removeListener: () => {},
          addEventListener: () => {},
          removeEventListener: () => {},
          dispatchEvent: () => {},
        }),
      });
    });
  }

  if (accessibility.reducedMotion) {
    await page.addInitScript(() => {
      Object.defineProperty(window, 'matchMedia', {
        writable: true,
        value: (query: string) => ({
          matches: query.includes('prefers-reduced-motion: reduce'),
          media: query,
          onchange: null,
          addListener: () => {},
          removeListener: () => {},
          addEventListener: () => {},
          removeEventListener: () => {},
          dispatchEvent: () => {},
        }),
      });
    });
  }

  // Navigate to elevation demo page
  await page.goto('/demos/elevation');
  
  // Set theme mode
  if (theme === 'dark') {
    await page.click('[data-testid="theme-toggle-dark"]');
  }

  // Set platform
  await page.click(`[data-testid="platform-${platform}"]`);

  // Set accessibility preferences
  if (accessibility.highContrast) {
    await page.click('[data-testid="high-contrast-toggle"]');
  }
  
  if (accessibility.reducedMotion) {
    await page.click('[data-testid="reduced-motion-toggle"]');
  }

  if (accessibility.prefersReducedData) {
    await page.click('[data-testid="reduced-data-toggle"]');
  }

  // Wait for elevation system to initialize
  await page.waitForSelector('[data-testid="elevation-showcase"]');
}

/**
 * Take screenshot of elevation showcase
 */
async function screenshotElevationShowcase(page: Page, name: string) {
  const showcase = page.locator('[data-testid="elevation-showcase"]');
  await expect(showcase).toBeVisible();
  
  return await showcase.screenshot({
    path: `test-results/visual/elevation-${name}.png`,
    animations: 'disabled'
  });
}

/**
 * Compare shadow properties between elements
 */
async function compareShadowProperties(page: Page, selector1: string, selector2: string) {
  const shadow1 = await page.evaluate((sel) => {
    const element = document.querySelector(sel) as HTMLElement;
    return window.getComputedStyle(element).boxShadow;
  }, selector1);

  const shadow2 = await page.evaluate((sel) => {
    const element = document.querySelector(sel) as HTMLElement;
    return window.getComputedStyle(element).boxShadow;
  }, selector2);

  return { shadow1, shadow2 };
}

// ============================================================================
// VISUAL REGRESSION TESTS
// ============================================================================

test.describe('Elevation Visual Regression', () => {
  test.beforeEach(async ({ page }) => {
    // Set consistent viewport
    await page.setViewportSize(VIEWPORTS.desktop);
    
    // Disable animations for consistent screenshots
    await page.addStyleTag({
      content: `
        *, *::before, *::after {
          animation-duration: 0s !important;
          animation-delay: 0s !important;
          transition-duration: 0s !important;
          transition-delay: 0s !important;
        }
      `
    });
  });

  test.describe('Elevation Levels', () => {
    for (const theme of THEME_MODES) {
      test(`should render all elevation levels consistently in ${theme} theme`, async ({ page }) => {
        await createElevationTestPage(page, { theme });
        
        // Take screenshot of all elevation levels
        await screenshotElevationShowcase(page, `levels-${theme}`);
        
        // Verify each level is visually distinct
        for (let i = 0; i < ELEVATION_LEVELS.length - 1; i++) {
          const currentLevel = ELEVATION_LEVELS[i];
          const nextLevel = ELEVATION_LEVELS[i + 1];
          
          const { shadow1, shadow2 } = await compareShadowProperties(
            page,
            `[data-testid="elevation-level-${currentLevel}"]`,
            `[data-testid="elevation-level-${nextLevel}"]`
          );
          
          // Shadows should be different between levels
          expect(shadow1).not.toBe(shadow2);
        }
      });
    }

    test('should show progressive shadow intensity across levels', async ({ page }) => {
      await createElevationTestPage(page, { theme: 'light' });
      
      // Extract shadow blur values for each level
      const blurValues = await page.evaluate(() => {
        const levels = [0, 1, 2, 3, 4, 5];
        return levels.map(level => {
          const element = document.querySelector(`[data-testid="elevation-level-${level}"]`) as HTMLElement;
          const shadow = window.getComputedStyle(element).boxShadow;
          
          // Parse blur value from box-shadow (simplified)
          const match = shadow.match(/(\d+(?:\.\d+)?)px\s+(\d+(?:\.\d+)?)px\s+(\d+(?:\.\d+)?)px/);
          return match ? parseFloat(match[3]) : 0; // Third value is blur
        });
      });
      
      // Blur should generally increase with elevation level
      for (let i = 1; i < blurValues.length; i++) {
        expect(blurValues[i]).toBeGreaterThanOrEqual(blurValues[i - 1]);
      }
    });
  });

  test.describe('Elevation Variants', () => {
    for (const variant of ELEVATION_VARIANTS) {
      test(`should render ${variant} variant consistently`, async ({ page }) => {
        await createElevationTestPage(page, { theme: 'light' });
        
        // Select the variant
        await page.selectOption('[data-testid="variant-select"]', variant);
        await page.waitForTimeout(100); // Allow for re-render
        
        // Take screenshot
        await screenshotElevationShowcase(page, `variant-${variant}`);
        
        // Verify variant affects shadow appearance
        const shadowCSS = await page.evaluate(() => {
          const element = document.querySelector('[data-testid="elevation-level-2"]') as HTMLElement;
          return window.getComputedStyle(element).boxShadow;
        });
        
        expect(shadowCSS).toBeTruthy();
        expect(shadowCSS).not.toBe('none');
      });
    }

    test('should show different intensities between variants', async ({ page }) => {
      await createElevationTestPage(page, { theme: 'light' });
      
      const variantShadows: Record<string, string> = {};
      
      // Collect shadows for each variant
      for (const variant of ELEVATION_VARIANTS) {
        await page.selectOption('[data-testid="variant-select"]', variant);
        await page.waitForTimeout(100);
        
        variantShadows[variant] = await page.evaluate(() => {
          const element = document.querySelector('[data-testid="elevation-level-2"]') as HTMLElement;
          return window.getComputedStyle(element).boxShadow;
        });
      }
      
      // All variants should produce different shadows
      const shadowValues = Object.values(variantShadows);
      const uniqueShadows = new Set(shadowValues);
      expect(uniqueShadows.size).toBe(ELEVATION_VARIANTS.length);
    });
  });

  test.describe('Component Types', () => {
    const componentTypes = ['surface', 'card', 'modal', 'tooltip', 'dropdown', 'fab', 'snackbar'];
    
    test('should render component-specific elevations', async ({ page }) => {
      await createElevationTestPage(page, { theme: 'light' });
      
      // Switch to component types tab
      await page.click('[data-testid="tab-components"]');
      await page.waitForSelector('[data-testid="component-showcase"]');
      
      // Take screenshot of component showcase
      await screenshotElevationShowcase(page, 'component-types');
      
      // Verify each component type has appropriate elevation
      for (const componentType of componentTypes) {
        const element = page.locator(`[data-testid="component-${componentType}"]`);
        await expect(element).toBeVisible();
        
        const shadowCSS = await element.evaluate((el) => {
          return window.getComputedStyle(el).boxShadow;
        });
        
        expect(shadowCSS).toBeTruthy();
        expect(shadowCSS).not.toBe('none');
      }
    });
  });

  test.describe('Platform Variations', () => {
    for (const platform of PLATFORMS) {
      test(`should render consistently on ${platform} platform`, async ({ page }) => {
        await createElevationTestPage(page, { platform });
        
        // Take screenshot for platform
        await screenshotElevationShowcase(page, `platform-${platform}`);
        
        // Verify shadows are rendered
        const shadowCSS = await page.evaluate(() => {
          const element = document.querySelector('[data-testid="elevation-level-2"]') as HTMLElement;
          return window.getComputedStyle(element).boxShadow;
        });
        
        expect(shadowCSS).toBeTruthy();
        expect(shadowCSS).not.toBe('none');
      });
    }

    test('should show platform-specific shadow adjustments', async ({ page }) => {
      const platformShadows: Record<string, string> = {};
      
      // Collect shadows for each platform
      for (const platform of PLATFORMS) {
        await createElevationTestPage(page, { platform });
        
        platformShadows[platform] = await page.evaluate(() => {
          const element = document.querySelector('[data-testid="elevation-level-2"]') as HTMLElement;
          return window.getComputedStyle(element).boxShadow;
        });
      }
      
      // Platforms should have different shadow characteristics
      const shadowValues = Object.values(platformShadows);
      const uniqueShadows = new Set(shadowValues);
      expect(uniqueShadows.size).toBeGreaterThan(1);
    });
  });

  test.describe('Accessibility Modes', () => {
    test('should render correctly in high contrast mode', async ({ page }) => {
      await createElevationTestPage(page, {
        theme: 'light',
        accessibility: { highContrast: true }
      });
      
      // Take screenshot in high contrast mode
      await screenshotElevationShowcase(page, 'high-contrast');
      
      // Verify shadows are still visible but adjusted
      const shadowCSS = await page.evaluate(() => {
        const element = document.querySelector('[data-testid="elevation-level-3"]') as HTMLElement;
        return window.getComputedStyle(element).boxShadow;
      });
      
      expect(shadowCSS).toBeTruthy();
      expect(shadowCSS).not.toBe('none');
    });

    test('should adapt to reduced motion preferences', async ({ page }) => {
      await createElevationTestPage(page, {
        theme: 'light',
        accessibility: { reducedMotion: true }
      });
      
      // Take screenshot with reduced motion
      await screenshotElevationShowcase(page, 'reduced-motion');
      
      // Verify no animations are present
      const hasAnimations = await page.evaluate(() => {
        const elements = document.querySelectorAll('[data-testid^="elevation-level-"]');
        return Array.from(elements).some(el => {
          const style = window.getComputedStyle(el);
          return style.animationDuration !== '0s' || style.transitionDuration !== '0s';
        });
      });
      
      expect(hasAnimations).toBe(false);
    });

    test('should handle reduced data preferences', async ({ page }) => {
      await createElevationTestPage(page, {
        theme: 'light',
        accessibility: { prefersReducedData: true }
      });
      
      // Take screenshot with reduced data
      await screenshotElevationShowcase(page, 'reduced-data');
      
      // Verify shadows are simplified but still present
      const shadowCSS = await page.evaluate(() => {
        const element = document.querySelector('[data-testid="elevation-level-2"]') as HTMLElement;
        return window.getComputedStyle(element).boxShadow;
      });
      
      expect(shadowCSS).toBeTruthy();
    });
  });

  test.describe('Theme Integration', () => {
    test('should maintain visual hierarchy across themes', async ({ page }) => {
      const themes: Array<'light' | 'dark'> = ['light', 'dark'];
      
      for (const theme of themes) {
        await createElevationTestPage(page, { theme });
        
        // Take screenshot for theme
        await screenshotElevationShowcase(page, `theme-${theme}`);
        
        // Verify hierarchy is maintained
        const shadows = await page.evaluate(() => {
          const levels = [0, 1, 2, 3, 4, 5];
          return levels.map(level => {
            const element = document.querySelector(`[data-testid="elevation-level-${level}"]`) as HTMLElement;
            return window.getComputedStyle(element).boxShadow;
          });
        });
        
        // Each level should have a different shadow
        const uniqueShadows = new Set(shadows);
        expect(uniqueShadows.size).toBe(ELEVATION_LEVELS.length);
      }
    });

    test('should show appropriate shadow colors for each theme', async ({ page }) => {
      const lightShadow = await page.evaluate(async () => {
        // Simulate light theme
        document.documentElement.classList.remove('dark');
        const element = document.querySelector('[data-testid="elevation-level-2"]') as HTMLElement;
        return window.getComputedStyle(element).boxShadow;
      });

      const darkShadow = await page.evaluate(async () => {
        // Simulate dark theme
        document.documentElement.classList.add('dark');
        const element = document.querySelector('[data-testid="elevation-level-2"]') as HTMLElement;
        return window.getComputedStyle(element).boxShadow;
      });

      // Themes should produce different shadow colors
      expect(lightShadow).not.toBe(darkShadow);
    });
  });

  test.describe('Responsive Behavior', () => {
    Object.entries(VIEWPORTS).forEach(([device, viewport]) => {
      test(`should render correctly on ${device}`, async ({ page }) => {
        await page.setViewportSize(viewport);
        await createElevationTestPage(page, { theme: 'light' });
        
        // Take screenshot for device
        await screenshotElevationShowcase(page, `responsive-${device}`);
        
        // Verify layout is not broken
        const showcaseElement = page.locator('[data-testid="elevation-showcase"]');
        await expect(showcaseElement).toBeVisible();
        
        // Verify shadows are still rendered
        const shadowCSS = await page.evaluate(() => {
          const element = document.querySelector('[data-testid="elevation-level-2"]') as HTMLElement;
          return window.getComputedStyle(element).boxShadow;
        });
        
        expect(shadowCSS).toBeTruthy();
        expect(shadowCSS).not.toBe('none');
      });
    });
  });

  test.describe('Performance and Rendering', () => {
    test('should render shadows without performance issues', async ({ page }) => {
      await createElevationTestPage(page, { theme: 'light' });
      
      // Measure rendering performance
      const performanceMetrics = await page.evaluate(() => {
        const start = performance.now();
        
        // Force a repaint by changing styles
        const elements = document.querySelectorAll('[data-testid^="elevation-level-"]');
        elements.forEach(el => {
          (el as HTMLElement).style.transform = 'translateZ(0)';
        });
        
        // Force layout recalculation
        elements.forEach(el => {
          el.getBoundingClientRect();
        });
        
        const end = performance.now();
        return end - start;
      });
      
      // Rendering should be fast (less than 100ms)
      expect(performanceMetrics).toBeLessThan(100);
    });

    test('should not cause layout shifts', async ({ page }) => {
      await createElevationTestPage(page, { theme: 'light' });
      
      // Measure Cumulative Layout Shift
      const cls = await page.evaluate(() => {
        return new Promise((resolve) => {
          let clsValue = 0;
          
          const observer = new PerformanceObserver((list) => {
            for (const entry of list.getEntries()) {
              if (entry.entryType === 'layout-shift' && !(entry as any).hadRecentInput) {
                clsValue += (entry as any).value;
              }
            }
          });
          
          observer.observe({ type: 'layout-shift', buffered: true });
          
          // Wait a bit then resolve
          setTimeout(() => {
            observer.disconnect();
            resolve(clsValue);
          }, 1000);
        });
      });
      
      // CLS should be minimal (less than 0.1)
      expect(cls).toBeLessThan(0.1);
    });
  });

  test.describe('Cross-browser Compatibility', () => {
    ['chromium', 'firefox', 'webkit'].forEach(browserName => {
      test(`should render consistently in ${browserName}`, async ({ page, browserName: currentBrowser }) => {
        // Skip if not the target browser
        if (currentBrowser !== browserName) {
          test.skip();
        }
        
        await createElevationTestPage(page, { theme: 'light' });
        
        // Take screenshot for browser
        await screenshotElevationShowcase(page, `browser-${browserName}`);
        
        // Verify shadows are supported
        const shadowSupport = await page.evaluate(() => {
          const testElement = document.createElement('div');
          testElement.style.boxShadow = '0 2px 4px rgba(0,0,0,0.1)';
          return testElement.style.boxShadow !== '';
        });
        
        expect(shadowSupport).toBe(true);
        
        // Verify elevation elements are rendered
        const elevationElements = await page.locator('[data-testid^="elevation-level-"]').count();
        expect(elevationElements).toBe(ELEVATION_LEVELS.length);
      });
    });
  });
});