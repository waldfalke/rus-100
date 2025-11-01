/**
 * Visual Regression Tests for Theme Components
 * 
 * Tests components across different themes to ensure visual consistency
 * and proper theme application using Playwright visual testing.
 */

import { test, expect, type Page } from '@playwright/test';
import { OKLCHPaletteGenerator } from '../../lib/color/palette-generator';
import { oklch } from '../../lib/color/oklch';

// ============================================================================
// TEST CONFIGURATION
// ============================================================================

const THEMES = [
  { name: 'light', mode: 'light' as const },
  { name: 'dark', mode: 'dark' as const },
  { name: 'high-contrast', mode: 'high-contrast' as const }
];

const BRAND_COLORS = {
  primary: { l: 0.6, c: 0.15, h: 220 },
  secondary: { l: 0.7, c: 0.12, h: 280 }
};

const VIEWPORTS = [
  { name: 'desktop', width: 1280, height: 720 },
  { name: 'tablet', width: 768, height: 1024 },
  { name: 'mobile', width: 375, height: 667 }
];

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

async function setupTheme(page: Page, themeName: string) {
  const generator = new OKLCHPaletteGenerator();
  const themeMode = THEMES.find(t => t.name === themeName)?.mode || 'light';
  
  const palette = generator.generatePalette({
    brandColors: BRAND_COLORS,
    mode: themeMode,
    wcagLevel: 'AA',
    steps: 9,
    generateSemanticRoles: true
  });
  
  // Inject theme CSS variables
  await page.addStyleTag({
    content: `
      :root {
        --color-background-primary: ${palette.backgrounds.page};
        --color-background-secondary: ${palette.backgrounds.surface};
        --color-surface-primary: ${palette.backgrounds.surface};
        --color-surface-secondary: ${palette.backgrounds.elevated};
        --color-text-primary: ${palette.text.primary};
        --color-text-secondary: ${palette.text.secondary};
        --color-text-on-primary: ${palette.text.primary};
        --color-text-on-secondary: ${palette.text.secondary};
        --color-primary-500: ${palette.primary[4]};
        --color-primary-600: ${palette.primary[5]};
        --color-secondary-500: ${palette.secondary[4]};
        --color-secondary-600: ${palette.secondary[5]};
        --color-success-500: ${palette.semantic.success[4]};
        --color-warning-500: ${palette.semantic.warning[4]};
        --color-error-500: ${palette.semantic.error[4]};
        --color-info-500: ${palette.semantic.info[4]};
        --color-border-primary: ${palette.borders.default};
        --color-border-secondary: ${palette.borders.subtle};
      }
      
      body {
        background-color: var(--color-background-primary);
        color: var(--color-text-primary);
        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
        margin: 0;
        padding: 20px;
      }
    `
  });
}

async function createTestComponent(page: Page, componentName: string) {
  const components = {
    button: `
      <div class="component-showcase">
        <h2>Buttons</h2>
        <div style="display: flex; gap: 12px; flex-wrap: wrap; margin-bottom: 24px;">
          <button style="
            background: var(--color-primary-500);
            color: var(--color-text-on-primary);
            border: none;
            padding: 12px 24px;
            border-radius: 8px;
            font-weight: 500;
            cursor: pointer;
          ">Primary Button</button>
          
          <button style="
            background: var(--color-secondary-500);
            color: var(--color-text-on-secondary);
            border: none;
            padding: 12px 24px;
            border-radius: 8px;
            font-weight: 500;
            cursor: pointer;
          ">Secondary Button</button>
          
          <button style="
            background: transparent;
            color: var(--color-primary-500);
            border: 2px solid var(--color-primary-500);
            padding: 10px 22px;
            border-radius: 8px;
            font-weight: 500;
            cursor: pointer;
          ">Outline Button</button>
          
          <button style="
            background: var(--color-error-500);
            color: white;
            border: none;
            padding: 12px 24px;
            border-radius: 8px;
            font-weight: 500;
            cursor: pointer;
          ">Danger Button</button>
        </div>
      </div>
    `,
    
    card: `
      <div class="component-showcase">
        <h2>Cards</h2>
        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 16px; margin-bottom: 24px;">
          <div style="
            background: var(--color-surface-primary);
            border: 1px solid var(--color-border-primary);
            border-radius: 12px;
            padding: 24px;
            box-shadow: 0 2px 8px rgba(0,0,0,0.1);
          ">
            <h3 style="margin: 0 0 12px 0; color: var(--color-text-primary);">Primary Card</h3>
            <p style="margin: 0 0 16px 0; color: var(--color-text-secondary); line-height: 1.5;">
              This is a primary card with standard surface background and border.
            </p>
            <button style="
              background: var(--color-primary-500);
              color: var(--color-text-on-primary);
              border: none;
              padding: 8px 16px;
              border-radius: 6px;
              font-size: 14px;
              cursor: pointer;
            ">Action</button>
          </div>
          
          <div style="
            background: var(--color-surface-secondary);
            border: 1px solid var(--color-border-secondary);
            border-radius: 12px;
            padding: 24px;
            box-shadow: 0 2px 8px rgba(0,0,0,0.1);
          ">
            <h3 style="margin: 0 0 12px 0; color: var(--color-text-primary);">Secondary Card</h3>
            <p style="margin: 0 0 16px 0; color: var(--color-text-secondary); line-height: 1.5;">
              This is a secondary card with alternative surface styling.
            </p>
            <button style="
              background: var(--color-secondary-500);
              color: var(--color-text-on-secondary);
              border: none;
              padding: 8px 16px;
              border-radius: 6px;
              font-size: 14px;
              cursor: pointer;
            ">Action</button>
          </div>
        </div>
      </div>
    `,
    
    form: `
      <div class="component-showcase">
        <h2>Form Elements</h2>
        <div style="max-width: 400px; margin-bottom: 24px;">
          <div style="margin-bottom: 16px;">
            <label style="
              display: block;
              margin-bottom: 6px;
              color: var(--color-text-primary);
              font-weight: 500;
            ">Email Address</label>
            <input type="email" placeholder="Enter your email" style="
              width: 100%;
              padding: 12px;
              border: 2px solid var(--color-border-primary);
              border-radius: 8px;
              background: var(--color-surface-primary);
              color: var(--color-text-primary);
              font-size: 16px;
              box-sizing: border-box;
            ">
          </div>
          
          <div style="margin-bottom: 16px;">
            <label style="
              display: block;
              margin-bottom: 6px;
              color: var(--color-text-primary);
              font-weight: 500;
            ">Message</label>
            <textarea placeholder="Enter your message" rows="4" style="
              width: 100%;
              padding: 12px;
              border: 2px solid var(--color-border-primary);
              border-radius: 8px;
              background: var(--color-surface-primary);
              color: var(--color-text-primary);
              font-size: 16px;
              resize: vertical;
              box-sizing: border-box;
            "></textarea>
          </div>
          
          <div style="margin-bottom: 16px;">
            <label style="
              display: flex;
              align-items: center;
              color: var(--color-text-primary);
              cursor: pointer;
            ">
              <input type="checkbox" style="margin-right: 8px;">
              I agree to the terms and conditions
            </label>
          </div>
        </div>
      </div>
    `,
    
    alerts: `
      <div class="component-showcase">
        <h2>Alert Messages</h2>
        <div style="display: flex; flex-direction: column; gap: 12px; margin-bottom: 24px;">
          <div style="
            background: var(--color-success-500);
            color: white;
            padding: 16px;
            border-radius: 8px;
            font-weight: 500;
          ">✓ Success: Operation completed successfully</div>
          
          <div style="
            background: var(--color-info-500);
            color: white;
            padding: 16px;
            border-radius: 8px;
            font-weight: 500;
          ">ℹ Info: Here's some helpful information</div>
          
          <div style="
            background: var(--color-warning-500);
            color: white;
            padding: 16px;
            border-radius: 8px;
            font-weight: 500;
          ">⚠ Warning: Please review this carefully</div>
          
          <div style="
            background: var(--color-error-500);
            color: white;
            padding: 16px;
            border-radius: 8px;
            font-weight: 500;
          ">✕ Error: Something went wrong</div>
        </div>
      </div>
    `,
    
    navigation: `
      <div class="component-showcase">
        <h2>Navigation</h2>
        <nav style="
          background: var(--color-surface-primary);
          border: 1px solid var(--color-border-primary);
          border-radius: 8px;
          padding: 16px;
          margin-bottom: 24px;
        ">
          <div style="display: flex; gap: 24px; align-items: center;">
            <div style="
              font-weight: bold;
              color: var(--color-primary-500);
              font-size: 18px;
            ">Brand</div>
            
            <div style="display: flex; gap: 16px;">
              <a href="#" style="
                color: var(--color-text-primary);
                text-decoration: none;
                padding: 8px 12px;
                border-radius: 6px;
                transition: background-color 0.2s;
              ">Home</a>
              <a href="#" style="
                color: var(--color-text-secondary);
                text-decoration: none;
                padding: 8px 12px;
                border-radius: 6px;
              ">About</a>
              <a href="#" style="
                color: var(--color-text-secondary);
                text-decoration: none;
                padding: 8px 12px;
                border-radius: 6px;
              ">Contact</a>
            </div>
          </div>
        </nav>
      </div>
    `
  };
  
  await page.setContent(`
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1">
      <title>Theme Component Test</title>
    </head>
    <body>
      ${components[componentName as keyof typeof components] || components.button}
    </body>
    </html>
  `);
}

// ============================================================================
// VISUAL REGRESSION TESTS
// ============================================================================

test.describe('Theme Component Visual Regression', () => {
  
  // Test each component across all themes
  for (const component of ['button', 'card', 'form', 'alerts', 'navigation']) {
    for (const theme of THEMES) {
      test(`${component} component in ${theme.name} theme`, async ({ page }) => {
        await setupTheme(page, theme.name);
        await createTestComponent(page, component);
        
        // Wait for any animations or transitions
        await page.waitForTimeout(500);
        
        // Take screenshot
        await expect(page).toHaveScreenshot(`${component}-${theme.name}.png`, {
          fullPage: true,
          animations: 'disabled'
        });
      });
    }
  }
  
  // Test responsive behavior
  for (const viewport of VIEWPORTS) {
    for (const theme of THEMES) {
      test(`responsive layout ${viewport.name} in ${theme.name} theme`, async ({ page }) => {
        await page.setViewportSize({ width: viewport.width, height: viewport.height });
        await setupTheme(page, theme.name);
        
        // Create a comprehensive layout
        await page.setContent(`
          <!DOCTYPE html>
          <html>
          <head>
            <meta charset="utf-8">
            <meta name="viewport" content="width=device-width, initial-scale=1">
            <title>Responsive Layout Test</title>
          </head>
          <body>
            <header style="
              background: var(--color-surface-primary);
              border-bottom: 1px solid var(--color-border-primary);
              padding: 16px 20px;
              margin-bottom: 20px;
            ">
              <h1 style="margin: 0; color: var(--color-text-primary);">Design System Demo</h1>
            </header>
            
            <main style="padding: 0 20px;">
              <div style="
                display: grid;
                grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
                gap: 20px;
                margin-bottom: 20px;
              ">
                <div style="
                  background: var(--color-surface-primary);
                  border: 1px solid var(--color-border-primary);
                  border-radius: 12px;
                  padding: 20px;
                ">
                  <h3 style="margin: 0 0 12px 0; color: var(--color-text-primary);">Card Title</h3>
                  <p style="margin: 0 0 16px 0; color: var(--color-text-secondary);">
                    This is a responsive card that adapts to different screen sizes.
                  </p>
                  <button style="
                    background: var(--color-primary-500);
                    color: var(--color-text-on-primary);
                    border: none;
                    padding: 10px 20px;
                    border-radius: 6px;
                    cursor: pointer;
                  ">Action</button>
                </div>
                
                <div style="
                  background: var(--color-surface-secondary);
                  border: 1px solid var(--color-border-secondary);
                  border-radius: 12px;
                  padding: 20px;
                ">
                  <h3 style="margin: 0 0 12px 0; color: var(--color-text-primary);">Another Card</h3>
                  <p style="margin: 0 0 16px 0; color: var(--color-text-secondary);">
                    Cards should maintain proper spacing and readability across devices.
                  </p>
                  <button style="
                    background: var(--color-secondary-500);
                    color: var(--color-text-on-secondary);
                    border: none;
                    padding: 10px 20px;
                    border-radius: 6px;
                    cursor: pointer;
                  ">Action</button>
                </div>
              </div>
              
              <div style="
                background: var(--color-surface-primary);
                border: 1px solid var(--color-border-primary);
                border-radius: 12px;
                padding: 20px;
              ">
                <h3 style="margin: 0 0 16px 0; color: var(--color-text-primary);">Form Section</h3>
                <div style="
                  display: grid;
                  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
                  gap: 16px;
                ">
                  <input type="text" placeholder="First Name" style="
                    padding: 12px;
                    border: 2px solid var(--color-border-primary);
                    border-radius: 8px;
                    background: var(--color-background-primary);
                    color: var(--color-text-primary);
                  ">
                  <input type="text" placeholder="Last Name" style="
                    padding: 12px;
                    border: 2px solid var(--color-border-primary);
                    border-radius: 8px;
                    background: var(--color-background-primary);
                    color: var(--color-text-primary);
                  ">
                </div>
              </div>
            </main>
          </body>
          </html>
        `);
        
        await page.waitForTimeout(500);
        
        await expect(page).toHaveScreenshot(`responsive-${viewport.name}-${theme.name}.png`, {
          fullPage: true,
          animations: 'disabled'
        });
      });
    }
  }
  
  // Test theme transitions
  test('theme transition consistency', async ({ page }) => {
    await setupTheme(page, 'light');
    await createTestComponent(page, 'button');
    
    // Take initial screenshot
    await expect(page).toHaveScreenshot('theme-transition-light.png', {
      animations: 'disabled'
    });
    
    // Switch to dark theme
    await setupTheme(page, 'dark');
    await page.waitForTimeout(300);
    
    // Take dark theme screenshot
    await expect(page).toHaveScreenshot('theme-transition-dark.png', {
      animations: 'disabled'
    });
    
    // Switch to high contrast
    await setupTheme(page, 'high-contrast');
    await page.waitForTimeout(300);
    
    // Take high contrast screenshot
    await expect(page).toHaveScreenshot('theme-transition-high-contrast.png', {
      animations: 'disabled'
    });
  });
  
  // Test component states
  test('interactive component states', async ({ page }) => {
    await setupTheme(page, 'light');
    
    await page.setContent(`
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <title>Component States Test</title>
        <style>
          button:hover {
            opacity: 0.9;
            transform: translateY(-1px);
          }
          
          button:active {
            transform: translateY(0);
          }
          
          input:focus {
            border-color: var(--color-primary-500);
            outline: 2px solid var(--color-primary-500);
            outline-offset: 2px;
          }
        </style>
      </head>
      <body>
        <div style="padding: 20px;">
          <h2 style="color: var(--color-text-primary);">Component States</h2>
          
          <div style="margin-bottom: 20px;">
            <button id="primary-btn" style="
              background: var(--color-primary-500);
              color: var(--color-text-on-primary);
              border: none;
              padding: 12px 24px;
              border-radius: 8px;
              cursor: pointer;
              margin-right: 12px;
              transition: all 0.2s;
            ">Primary Button</button>
            
            <button disabled style="
              background: var(--color-border-primary);
              color: var(--color-text-secondary);
              border: none;
              padding: 12px 24px;
              border-radius: 8px;
              cursor: not-allowed;
              opacity: 0.6;
            ">Disabled Button</button>
          </div>
          
          <div>
            <input id="focus-input" type="text" placeholder="Focus me" style="
              padding: 12px;
              border: 2px solid var(--color-border-primary);
              border-radius: 8px;
              background: var(--color-surface-primary);
              color: var(--color-text-primary);
              transition: all 0.2s;
            ">
          </div>
        </div>
      </body>
      </html>
    `);
    
    // Test normal state
    await expect(page).toHaveScreenshot('component-states-normal.png');
    
    // Test hover state
    await page.hover('#primary-btn');
    await page.waitForTimeout(200);
    await expect(page).toHaveScreenshot('component-states-hover.png');
    
    // Test focus state
    await page.focus('#focus-input');
    await page.waitForTimeout(200);
    await expect(page).toHaveScreenshot('component-states-focus.png');
  });
});

// ============================================================================
// ACCESSIBILITY VISUAL TESTS
// ============================================================================

test.describe('Accessibility Visual Tests', () => {
  
  test('high contrast mode compliance', async ({ page }) => {
    await setupTheme(page, 'high-contrast');
    
    await page.setContent(`
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <title>High Contrast Test</title>
      </head>
      <body>
        <div style="padding: 20px;">
          <h1 style="color: var(--color-text-primary);">High Contrast Mode</h1>
          
          <p style="color: var(--color-text-primary); line-height: 1.6;">
            This text should have sufficient contrast against the background
            to meet WCAG AAA standards for accessibility.
          </p>
          
          <div style="
            background: var(--color-surface-primary);
            border: 2px solid var(--color-border-primary);
            padding: 20px;
            border-radius: 8px;
            margin: 20px 0;
          ">
            <h3 style="color: var(--color-text-primary); margin: 0 0 12px 0;">
              Card Content
            </h3>
            <p style="color: var(--color-text-secondary); margin: 0;">
              Secondary text should also maintain proper contrast ratios.
            </p>
          </div>
          
          <button style="
            background: var(--color-primary-500);
            color: var(--color-text-on-primary);
            border: none;
            padding: 12px 24px;
            border-radius: 8px;
            font-weight: bold;
            cursor: pointer;
          ">High Contrast Button</button>
        </div>
      </body>
      </html>
    `);
    
    await expect(page).toHaveScreenshot('high-contrast-compliance.png', {
      fullPage: true
    });
  });
  
  test('color blindness simulation', async ({ page }) => {
    // Test with different color vision deficiencies
    const colorBlindnessFilters = {
      protanopia: 'url("data:image/svg+xml;base64,PHN2ZyB2ZXJzaW9uPSIxLjEiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PGZpbHRlciBpZD0icHJvdGFub3BpYSI+PGZlQ29sb3JNYXRyaXggdmFsdWVzPSIwLjU2NyAwLjQzMyAwIDAgMCAwLjU1OCAwLjQ0MiAwIDAgMCAwLjI0MiAwLjc1OCAwIDAgMCAwIDAgMSAwIi8+PC9maWx0ZXI+PC9kZWZzPjwvc3ZnPiMjcHJvdGFub3BpYSI=)',
      deuteranopia: 'url("data:image/svg+xml;base64,PHN2ZyB2ZXJzaW9uPSIxLjEiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PGZpbHRlciBpZD0iZGV1dGVyYW5vcGlhIj48ZmVDb2xvck1hdHJpeCB2YWx1ZXM9IjAuNjI1IDAuMzc1IDAgMCAwIDAuNzAgMC4zIDAgMCAwIDAgMC4zIDAgMCAwIDAgMCAwIDEgMCIvPjwvZmlsdGVyPjwvZGVmcz48L3N2Zz4jI2RldXRlcmFub3BpYSI=)',
      tritanopia: 'url("data:image/svg+xml;base64,PHN2ZyB2ZXJzaW9uPSIxLjEiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PGZpbHRlciBpZD0idHJpdGFub3BpYSI+PGZlQ29sb3JNYXRyaXggdmFsdWVzPSIwLjk1IDAuMDUgMCAwIDAgMCAwLjQzMyAwLjU2NyAwIDAgMCAwLjQ3NSAwLjUyNSAwIDAgMCAwIDAgMSAwIi8+PC9maWx0ZXI+PC9kZWZzPjwvc3ZnPiMjdHJpdGFub3BpYSI='
    };
    
    for (const [type, filter] of Object.entries(colorBlindnessFilters)) {
      await setupTheme(page, 'light');
      await createTestComponent(page, 'alerts');
      
      // Apply color blindness filter
      await page.addStyleTag({
        content: `body { filter: ${filter}; }`
      });
      
      await expect(page).toHaveScreenshot(`color-blindness-${type}.png`, {
        fullPage: true
      });
    }
  });
});