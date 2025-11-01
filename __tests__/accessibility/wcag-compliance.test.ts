/**
 * WCAG Compliance Tests
 * 
 * Automated accessibility tests using axe-core to ensure WCAG compliance
 * across all generated themes and components.
 */

import { test, expect, type Page } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
import { OKLCHPaletteGenerator } from '../../lib/color/palette-generator';
import { wcagValidator, VALIDATION_PRESETS } from '../../lib/accessibility/wcag-validator';
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

const WCAG_LEVELS = ['AA', 'AAA'] as const;

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

async function setupThemeWithA11y(page: Page, themeName: string) {
  const generator = new OKLCHPaletteGenerator();
  const themeMode = THEMES.find(t => t.name === themeName)?.mode || 'light';
  
  const palette = generator.generatePalette({
    brandColors: BRAND_COLORS,
    mode: themeMode,
    wcagLevel: 'AA',
    steps: 9,
    generateSemanticRoles: true
  });
  
  // Inject theme CSS variables with accessibility enhancements
  await page.addStyleTag({
    content: `
      :root {
        --color-background-primary: ${oklch(palette.backgrounds.page.l, palette.backgrounds.page.c, palette.backgrounds.page.h)};
        --color-background-secondary: ${oklch(palette.backgrounds.surface.l, palette.backgrounds.surface.c, palette.backgrounds.surface.h)};
        --color-surface-primary: ${oklch(palette.backgrounds.surface.l, palette.backgrounds.surface.c, palette.backgrounds.surface.h)};
        --color-surface-secondary: ${oklch(palette.backgrounds.elevated.l, palette.backgrounds.elevated.c, palette.backgrounds.elevated.h)};
        --color-text-primary: ${oklch(palette.text.primary.l, palette.text.primary.c, palette.text.primary.h)};
        --color-text-secondary: ${oklch(palette.text.secondary.l, palette.text.secondary.c, palette.text.secondary.h)};
        --color-text-on-primary: ${oklch(palette.text.inverse.l, palette.text.inverse.c, palette.text.inverse.h)};
        --color-text-on-secondary: ${oklch(palette.text.inverse.l, palette.text.inverse.c, palette.text.inverse.h)};
        --color-primary-500: ${oklch(palette.primary[4].l, palette.primary[4].c, palette.primary[4].h)};
        --color-primary-600: ${oklch(palette.primary[5].l, palette.primary[5].c, palette.primary[5].h)};
        --color-secondary-500: ${oklch(palette.secondary[4].l, palette.secondary[4].c, palette.secondary[4].h)};
        --color-secondary-600: ${oklch(palette.secondary[5].l, palette.secondary[5].c, palette.secondary[5].h)};
        --color-success-500: ${oklch(palette.semantic.success[4].l, palette.semantic.success[4].c, palette.semantic.success[4].h)};
        --color-warning-500: ${oklch(palette.semantic.warning[4].l, palette.semantic.warning[4].c, palette.semantic.warning[4].h)};
        --color-error-500: ${oklch(palette.semantic.error[4].l, palette.semantic.error[4].c, palette.semantic.error[4].h)};
        --color-info-500: ${oklch(palette.semantic.info[4].l, palette.semantic.info[4].c, palette.semantic.info[4].h)};
        --color-border-primary: ${oklch(palette.borders.default.l, palette.borders.default.c, palette.borders.default.h)};
        --color-border-secondary: ${oklch(palette.borders.subtle.l, palette.borders.subtle.c, palette.borders.subtle.h)};
        
        /* Focus indicators */
        --focus-ring-color: ${oklch(palette.primary[4].l, palette.primary[4].c, palette.primary[4].h)};
        --focus-ring-width: 2px;
        --focus-ring-offset: 2px;
      }
      
      /* Base accessibility styles */
      * {
        box-sizing: border-box;
      }
      
      body {
        background-color: var(--color-background-primary);
        color: var(--color-text-primary);
        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
        line-height: 1.5;
        margin: 0;
        padding: 20px;
      }
      
      /* Focus management */
      *:focus {
        outline: var(--focus-ring-width) solid var(--focus-ring-color);
        outline-offset: var(--focus-ring-offset);
      }
      
      /* Skip links */
      .skip-link {
        position: absolute;
        top: -40px;
        left: 6px;
        background: var(--color-primary-500);
        color: var(--color-text-on-primary);
        padding: 8px;
        text-decoration: none;
        border-radius: 4px;
        z-index: 1000;
      }
      
      .skip-link:focus {
        top: 6px;
      }
      
      /* High contrast mode support */
      @media (prefers-contrast: high) {
        :root {
          --color-border-primary: ${themeMode === 'light' ? '#000000' : '#ffffff'};
          --focus-ring-width: 3px;
        }
      }
      
      /* Reduced motion support */
      @media (prefers-reduced-motion: reduce) {
        *, *::before, *::after {
          animation-duration: 0.01ms !important;
          animation-iteration-count: 1 !important;
          transition-duration: 0.01ms !important;
        }
      }
    `
  });
  
  return palette;
}

async function createAccessibleComponent(page: Page, componentType: string): Promise<void> {
  const components = {
    form: `
      <main>
        <a href="#main-content" class="skip-link">Skip to main content</a>
        
        <header>
          <h1>Accessible Form Example</h1>
        </header>
        
        <div id="main-content">
          <form aria-labelledby="form-title" novalidate>
            <h2 id="form-title">Contact Information</h2>
            
            <fieldset style="
              border: 2px solid var(--color-border-primary);
              border-radius: 8px;
              padding: 20px;
              margin-bottom: 20px;
            ">
              <legend style="
                color: var(--color-text-primary);
                font-weight: 600;
                padding: 0 8px;
              ">Personal Details</legend>
              
              <div style="margin-bottom: 16px;">
                <label for="first-name" style="
                  display: block;
                  margin-bottom: 6px;
                  color: var(--color-text-primary);
                  font-weight: 500;
                ">First Name *</label>
                <input 
                  type="text" 
                  id="first-name" 
                  name="firstName"
                  required
                  aria-describedby="first-name-error"
                  style="
                    width: 100%;
                    padding: 12px;
                    border: 2px solid var(--color-border-primary);
                    border-radius: 6px;
                    background: var(--color-surface-primary);
                    color: var(--color-text-primary);
                    font-size: 16px;
                  "
                >
                <div id="first-name-error" role="alert" aria-live="polite" style="
                  color: var(--color-error-500);
                  font-size: 14px;
                  margin-top: 4px;
                  display: none;
                ">First name is required</div>
              </div>
              
              <div style="margin-bottom: 16px;">
                <label for="email" style="
                  display: block;
                  margin-bottom: 6px;
                  color: var(--color-text-primary);
                  font-weight: 500;
                ">Email Address *</label>
                <input 
                  type="email" 
                  id="email" 
                  name="email"
                  required
                  aria-describedby="email-help email-error"
                  style="
                    width: 100%;
                    padding: 12px;
                    border: 2px solid var(--color-border-primary);
                    border-radius: 6px;
                    background: var(--color-surface-primary);
                    color: var(--color-text-primary);
                    font-size: 16px;
                  "
                >
                <div id="email-help" style="
                  color: var(--color-text-secondary);
                  font-size: 14px;
                  margin-top: 4px;
                ">We'll never share your email address</div>
                <div id="email-error" role="alert" aria-live="polite" style="
                  color: var(--color-error-500);
                  font-size: 14px;
                  margin-top: 4px;
                  display: none;
                ">Please enter a valid email address</div>
              </div>
            </fieldset>
            
            <fieldset style="
              border: 2px solid var(--color-border-primary);
              border-radius: 8px;
              padding: 20px;
              margin-bottom: 20px;
            ">
              <legend style="
                color: var(--color-text-primary);
                font-weight: 600;
                padding: 0 8px;
              ">Preferences</legend>
              
              <div role="group" aria-labelledby="notification-legend">
                <div id="notification-legend" style="
                  color: var(--color-text-primary);
                  font-weight: 500;
                  margin-bottom: 12px;
                ">Notification Preferences</div>
                
                <div style="margin-bottom: 8px;">
                  <label style="
                    display: flex;
                    align-items: center;
                    color: var(--color-text-primary);
                    cursor: pointer;
                  ">
                    <input 
                      type="checkbox" 
                      name="notifications" 
                      value="email"
                      style="margin-right: 8px;"
                    >
                    Email notifications
                  </label>
                </div>
                
                <div style="margin-bottom: 8px;">
                  <label style="
                    display: flex;
                    align-items: center;
                    color: var(--color-text-primary);
                    cursor: pointer;
                  ">
                    <input 
                      type="checkbox" 
                      name="notifications" 
                      value="sms"
                      style="margin-right: 8px;"
                    >
                    SMS notifications
                  </label>
                </div>
              </div>
            </fieldset>
            
            <div style="margin-bottom: 20px;">
              <label for="message" style="
                display: block;
                margin-bottom: 6px;
                color: var(--color-text-primary);
                font-weight: 500;
              ">Message</label>
              <textarea 
                id="message" 
                name="message"
                rows="4"
                aria-describedby="message-help"
                style="
                  width: 100%;
                  padding: 12px;
                  border: 2px solid var(--color-border-primary);
                  border-radius: 6px;
                  background: var(--color-surface-primary);
                  color: var(--color-text-primary);
                  font-size: 16px;
                  resize: vertical;
                "
              ></textarea>
              <div id="message-help" style="
                color: var(--color-text-secondary);
                font-size: 14px;
                margin-top: 4px;
              ">Optional: Tell us more about your inquiry</div>
            </div>
            
            <div style="display: flex; gap: 12px; align-items: center;">
              <button type="submit" style="
                background: var(--color-primary-500);
                color: var(--color-text-on-primary);
                border: none;
                padding: 12px 24px;
                border-radius: 6px;
                font-weight: 500;
                cursor: pointer;
                font-size: 16px;
              ">Submit Form</button>
              
              <button type="reset" style="
                background: transparent;
                color: var(--color-text-secondary);
                border: 2px solid var(--color-border-primary);
                padding: 10px 22px;
                border-radius: 6px;
                font-weight: 500;
                cursor: pointer;
                font-size: 16px;
              ">Reset</button>
            </div>
          </form>
        </div>
      </main>
    `,
    
    navigation: `
      <div>
        <a href="#main-nav" class="skip-link">Skip to navigation</a>
        <a href="#main-content" class="skip-link">Skip to main content</a>
        
        <header role="banner">
          <nav id="main-nav" role="navigation" aria-label="Main navigation" style="
            background: var(--color-surface-primary);
            border: 1px solid var(--color-border-primary);
            border-radius: 8px;
            padding: 16px;
          ">
            <div style="display: flex; justify-content: space-between; align-items: center;">
              <div style="
                font-weight: bold;
                color: var(--color-primary-500);
                font-size: 20px;
              ">
                <a href="/" style="
                  color: inherit;
                  text-decoration: none;
                " aria-label="Home - Design System">
                  Design System
                </a>
              </div>
              
              <ul role="menubar" style="
                display: flex;
                gap: 0;
                list-style: none;
                margin: 0;
                padding: 0;
              ">
                <li role="none">
                  <a href="/home" role="menuitem" style="
                    color: var(--color-text-primary);
                    text-decoration: none;
                    padding: 12px 16px;
                    border-radius: 6px;
                    display: block;
                  " aria-current="page">Home</a>
                </li>
                <li role="none">
                  <a href="/about" role="menuitem" style="
                    color: var(--color-text-secondary);
                    text-decoration: none;
                    padding: 12px 16px;
                    border-radius: 6px;
                    display: block;
                  ">About</a>
                </li>
                <li role="none">
                  <a href="/services" role="menuitem" style="
                    color: var(--color-text-secondary);
                    text-decoration: none;
                    padding: 12px 16px;
                    border-radius: 6px;
                    display: block;
                  ">Services</a>
                </li>
                <li role="none">
                  <a href="/contact" role="menuitem" style="
                    color: var(--color-text-secondary);
                    text-decoration: none;
                    padding: 12px 16px;
                    border-radius: 6px;
                    display: block;
                  ">Contact</a>
                </li>
              </ul>
            </div>
          </nav>
        </header>
        
        <main id="main-content" role="main" style="margin-top: 20px;">
          <h1>Welcome to Our Design System</h1>
          <p style="color: var(--color-text-secondary); line-height: 1.6;">
            This is an example of accessible navigation and content structure.
          </p>
        </main>
      </div>
    `,
    
    alerts: `
      <main>
        <h1>Alert Messages</h1>
        
        <div role="region" aria-label="System notifications">
          <div role="alert" style="
            background: var(--color-success-500);
            color: white;
            padding: 16px;
            border-radius: 8px;
            margin-bottom: 12px;
            display: flex;
            align-items: center;
          ">
            <span aria-hidden="true" style="margin-right: 8px;">✓</span>
            <span>Success: Your changes have been saved successfully.</span>
          </div>
          
          <div role="alert" aria-live="polite" style="
            background: var(--color-info-500);
            color: white;
            padding: 16px;
            border-radius: 8px;
            margin-bottom: 12px;
            display: flex;
            align-items: center;
          ">
            <span aria-hidden="true" style="margin-right: 8px;">ℹ</span>
            <span>Information: New features are available in your dashboard.</span>
          </div>
          
          <div role="alert" aria-live="assertive" style="
            background: var(--color-warning-500);
            color: white;
            padding: 16px;
            border-radius: 8px;
            margin-bottom: 12px;
            display: flex;
            align-items: center;
          ">
            <span aria-hidden="true" style="margin-right: 8px;">⚠</span>
            <span>Warning: Your session will expire in 5 minutes.</span>
          </div>
          
          <div role="alert" aria-live="assertive" style="
            background: var(--color-error-500);
            color: white;
            padding: 16px;
            border-radius: 8px;
            margin-bottom: 12px;
            display: flex;
            align-items: center;
          ">
            <span aria-hidden="true" style="margin-right: 8px;">✕</span>
            <span>Error: Unable to save changes. Please try again.</span>
          </div>
        </div>
      </main>
    `,
    
    interactive: `
      <main>
        <h1>Interactive Components</h1>
        
        <section aria-labelledby="buttons-heading">
          <h2 id="buttons-heading">Buttons</h2>
          
          <div style="display: flex; gap: 12px; flex-wrap: wrap; margin-bottom: 24px;">
            <button style="
              background: var(--color-primary-500);
              color: var(--color-text-on-primary);
              border: none;
              padding: 12px 24px;
              border-radius: 8px;
              font-weight: 500;
              cursor: pointer;
              font-size: 16px;
            ">Primary Action</button>
            
            <button style="
              background: var(--color-secondary-500);
              color: var(--color-text-on-secondary);
              border: none;
              padding: 12px 24px;
              border-radius: 8px;
              font-weight: 500;
              cursor: pointer;
              font-size: 16px;
            ">Secondary Action</button>
            
            <button disabled aria-describedby="disabled-help" style="
              background: var(--color-border-primary);
              color: var(--color-text-secondary);
              border: none;
              padding: 12px 24px;
              border-radius: 8px;
              font-weight: 500;
              cursor: not-allowed;
              opacity: 0.6;
              font-size: 16px;
            ">Disabled Button</button>
          </div>
          
          <div id="disabled-help" style="
            color: var(--color-text-secondary);
            font-size: 14px;
            margin-bottom: 24px;
          ">The disabled button is not interactive and cannot be activated.</div>
        </section>
        
        <section aria-labelledby="modal-heading">
          <h2 id="modal-heading">Modal Dialog</h2>
          
          <button id="open-modal" style="
            background: var(--color-primary-500);
            color: var(--color-text-on-primary);
            border: none;
            padding: 12px 24px;
            border-radius: 8px;
            font-weight: 500;
            cursor: pointer;
            font-size: 16px;
          ">Open Modal</button>
          
          <div id="modal" role="dialog" aria-labelledby="modal-title" aria-describedby="modal-description" aria-hidden="true" style="
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, 0.5);
            display: none;
            align-items: center;
            justify-content: center;
            z-index: 1000;
          ">
            <div style="
              background: var(--color-surface-primary);
              border: 1px solid var(--color-border-primary);
              border-radius: 12px;
              padding: 24px;
              max-width: 400px;
              width: 90%;
            ">
              <h3 id="modal-title" style="
                margin: 0 0 12px 0;
                color: var(--color-text-primary);
              ">Confirm Action</h3>
              
              <p id="modal-description" style="
                margin: 0 0 20px 0;
                color: var(--color-text-secondary);
                line-height: 1.5;
              ">Are you sure you want to proceed with this action? This cannot be undone.</p>
              
              <div style="display: flex; gap: 12px; justify-content: flex-end;">
                <button id="modal-cancel" style="
                  background: transparent;
                  color: var(--color-text-secondary);
                  border: 2px solid var(--color-border-primary);
                  padding: 10px 20px;
                  border-radius: 6px;
                  cursor: pointer;
                ">Cancel</button>
                
                <button id="modal-confirm" style="
                  background: var(--color-error-500);
                  color: white;
                  border: none;
                  padding: 12px 20px;
                  border-radius: 6px;
                  cursor: pointer;
                ">Confirm</button>
              </div>
            </div>
          </div>
        </section>
        
        <script>
          const openModal = document.getElementById('open-modal');
          const modal = document.getElementById('modal');
          const modalCancel = document.getElementById('modal-cancel');
          const modalConfirm = document.getElementById('modal-confirm');
          
          openModal.addEventListener('click', () => {
            modal.style.display = 'flex';
            modal.setAttribute('aria-hidden', 'false');
            modalCancel.focus();
          });
          
          modalCancel.addEventListener('click', () => {
            modal.style.display = 'none';
            modal.setAttribute('aria-hidden', 'true');
            openModal.focus();
          });
          
          modalConfirm.addEventListener('click', () => {
            modal.style.display = 'none';
            modal.setAttribute('aria-hidden', 'true');
            openModal.focus();
          });
          
          // Close modal on Escape key
          document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && modal.getAttribute('aria-hidden') === 'false') {
              modal.style.display = 'none';
              modal.setAttribute('aria-hidden', 'true');
              openModal.focus();
            }
          });
        </script>
      </main>
    `
  };
  
  await page.setContent(`
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1">
      <title>Accessibility Test - ${componentType}</title>
    </head>
    <body>
      ${components[componentType as keyof typeof components] || components.form}
    </body>
    </html>
  `);
}

// ============================================================================
// WCAG COMPLIANCE TESTS
// ============================================================================

test.describe('WCAG Compliance Tests', () => {
  
  // Test each component type across all themes for WCAG compliance
  for (const component of ['form', 'navigation', 'alerts', 'interactive']) {
    for (const theme of THEMES) {
      for (const level of WCAG_LEVELS) {
        test(`${component} component WCAG ${level} compliance in ${theme.name} theme`, async ({ page }) => {
          await setupThemeWithA11y(page, theme.name);
          await createAccessibleComponent(page, component);
          
          // Wait for any dynamic content to load
          await page.waitForTimeout(500);
          
          // Configure axe-core for the specific WCAG level
          const axeBuilder = new AxeBuilder({ page })
            .withTags([`wcag${level.toLowerCase()}`, 'wcag21aa', 'best-practice'])
            .exclude('#modal'); // Exclude hidden modal from initial scan
          
          // Run accessibility scan
          const results = await axeBuilder.analyze();
          
          // Assert no violations
          expect(results.violations).toEqual([]);
          
          // Log any incomplete tests for manual review
          if (results.incomplete.length > 0) {
            console.warn(`Incomplete accessibility tests for ${component} in ${theme.name}:`, 
              results.incomplete.map(item => item.id));
          }
        });
      }
    }
  }
  
  // Test color contrast specifically
  test('color contrast validation across themes', async ({ page }) => {
    for (const theme of THEMES) {
      const palette = await setupThemeWithA11y(page, theme.name);
      
      // Create a comprehensive color test page
      await page.setContent(`
        <!DOCTYPE html>
        <html lang="en">
        <head>
          <meta charset="utf-8">
          <title>Color Contrast Test</title>
        </head>
        <body>
          <main>
            <h1>Color Contrast Test - ${theme.name} Theme</h1>
            
            <section>
              <h2>Text on Background</h2>
              <div style="
                background: var(--color-background-primary);
                color: var(--color-text-primary);
                padding: 20px;
                border: 1px solid var(--color-border-primary);
              ">
                Primary text on primary background
              </div>
              
              <div style="
                background: var(--color-background-secondary);
                color: var(--color-text-secondary);
                padding: 20px;
                border: 1px solid var(--color-border-secondary);
                margin-top: 12px;
              ">
                Secondary text on secondary background
              </div>
            </section>
            
            <section style="margin-top: 24px;">
              <h2>Buttons</h2>
              <button style="
                background: var(--color-primary-500);
                color: var(--color-text-on-primary);
                border: none;
                padding: 12px 24px;
                border-radius: 8px;
                margin-right: 12px;
              ">Primary Button</button>
              
              <button style="
                background: var(--color-secondary-500);
                color: var(--color-text-on-secondary);
                border: none;
                padding: 12px 24px;
                border-radius: 8px;
              ">Secondary Button</button>
            </section>
            
            <section style="margin-top: 24px;">
              <h2>Status Colors</h2>
              <div style="
                background: var(--color-success-500);
                color: white;
                padding: 16px;
                margin-bottom: 8px;
              ">Success message</div>
              
              <div style="
                background: var(--color-warning-500);
                color: white;
                padding: 16px;
                margin-bottom: 8px;
              ">Warning message</div>
              
              <div style="
                background: var(--color-error-500);
                color: white;
                padding: 16px;
                margin-bottom: 8px;
              ">Error message</div>
              
              <div style="
                background: var(--color-info-500);
                color: white;
                padding: 16px;
              ">Info message</div>
            </section>
          </main>
        </body>
        </html>
      `);
      
      // Run color contrast specific tests
      const axeBuilder = new AxeBuilder({ page })
        .withTags(['wcag2aa', 'color-contrast']);
      
      const results = await axeBuilder.analyze();
      
      // Expect no color contrast violations
      const contrastViolations = results.violations.filter(
        violation => violation.id === 'color-contrast'
      );
      
      expect(contrastViolations).toEqual([]);
      
      // Validate using our custom WCAG validator
      const colorPairs = new Map([
        ['text-on-background', {
          foreground: palette.text.primary,
          background: palette.backgrounds.page
        }],
        ['primary-button', {
          foreground: palette.text.inverse,
          background: palette.primary[4]
        }],
        ['secondary-button', {
          foreground: palette.text.inverse,
          background: palette.secondary[4]
        }]
      ]);
      
      const validationPreset = theme.name === 'high-contrast' 
        ? VALIDATION_PRESETS.strict 
        : VALIDATION_PRESETS.standard;
      
      const report = wcagValidator.validatePalette(colorPairs, validationPreset);
      
      expect(report.overallCompliance).not.toBe('fail');
      expect(report.criticalIssues).toHaveLength(0);
    }
  });
  
  // Test keyboard navigation
  test('keyboard navigation accessibility', async ({ page }) => {
    await setupThemeWithA11y(page, 'light');
    await createAccessibleComponent(page, 'interactive');
    
    // Test tab navigation
    await page.keyboard.press('Tab');
    let focusedElement = await page.evaluate(() => document.activeElement?.tagName);
    expect(focusedElement).toBe('BUTTON');
    
    // Continue tabbing through interactive elements
    await page.keyboard.press('Tab');
    await page.keyboard.press('Tab');
    await page.keyboard.press('Tab');
    
    // Test modal keyboard interaction
    await page.keyboard.press('Enter'); // Open modal
    await page.waitForTimeout(100);
    
    // Modal should be visible and focused
    const modalVisible = await page.isVisible('#modal');
    expect(modalVisible).toBe(true);
    
    // Test Escape key closes modal
    await page.keyboard.press('Escape');
    await page.waitForTimeout(100);
    
    const modalHidden = await page.isHidden('#modal');
    expect(modalHidden).toBe(true);
    
    // Run axe-core keyboard navigation tests
    const axeBuilder = new AxeBuilder({ page })
      .withTags(['keyboard', 'wcag2a']);
    
    const results = await axeBuilder.analyze();
    expect(results.violations).toEqual([]);
  });
  
  // Test screen reader compatibility
  test('screen reader compatibility', async ({ page }) => {
    await setupThemeWithA11y(page, 'light');
    await createAccessibleComponent(page, 'form');
    
    // Test ARIA attributes and roles
    const axeBuilder = new AxeBuilder({ page })
      .withTags(['aria', 'wcag2a', 'wcag2aa']);
    
    const results = await axeBuilder.analyze();
    expect(results.violations).toEqual([]);
    
    // Verify specific ARIA implementations
    const fieldsetLegend = await page.locator('fieldset legend').first();
    expect(await fieldsetLegend.isVisible()).toBe(true);
    
    const requiredFields = await page.locator('input[required]').all();
    for (const field of requiredFields) {
      const ariaRequired = await field.getAttribute('required');
      expect(ariaRequired).not.toBeNull();
    }
    
    const errorMessages = await page.locator('[role="alert"]').all();
    for (const error of errorMessages) {
      const ariaLive = await error.getAttribute('aria-live');
      expect(ariaLive).toBeTruthy();
    }
  });
  
  // Test focus management
  test('focus management and indicators', async ({ page }) => {
    await setupThemeWithA11y(page, 'light');
    await createAccessibleComponent(page, 'navigation');
    
    // Test focus indicators are visible
    const firstLink = page.locator('a').first();
    await firstLink.focus();
    
    // Check that focus outline is applied
    const focusOutline = await firstLink.evaluate(el => {
      const styles = window.getComputedStyle(el);
      return styles.outline;
    });
    
    expect(focusOutline).not.toBe('none');
    expect(focusOutline).not.toBe('');
    
    // Test focus trap in skip links
    const skipLink = page.locator('.skip-link').first();
    await skipLink.focus();
    
    const skipLinkVisible = await skipLink.isVisible();
    expect(skipLinkVisible).toBe(true);
    
    // Run axe-core focus tests
    const axeBuilder = new AxeBuilder({ page })
      .withTags(['focus-order', 'wcag2a']);
    
    const results = await axeBuilder.analyze();
    expect(results.violations).toEqual([]);
  });
  
  // Test high contrast mode
  test('high contrast mode compliance', async ({ page }) => {
    // Simulate high contrast mode
    await page.emulateMedia({ colorScheme: 'dark', forcedColors: 'active' });
    
    await setupThemeWithA11y(page, 'high-contrast');
    await createAccessibleComponent(page, 'form');
    
    // Run comprehensive accessibility scan for high contrast
    const axeBuilder = new AxeBuilder({ page })
      .withTags(['wcag2aa', 'wcag2aaa', 'color-contrast']);
    
    const results = await axeBuilder.analyze();
    expect(results.violations).toEqual([]);
    
    // Verify high contrast specific requirements
    const buttons = await page.locator('button').all();
    for (const button of buttons) {
      const borderWidth = await button.evaluate(el => {
        const styles = window.getComputedStyle(el);
        return styles.borderWidth;
      });
      
      // High contrast mode should have visible borders
      expect(borderWidth).not.toBe('0px');
    }
  });
  
  // Test reduced motion preferences
  test('reduced motion compliance', async ({ page }) => {
    // Simulate reduced motion preference
    await page.emulateMedia({ reducedMotion: 'reduce' });
    
    await setupThemeWithA11y(page, 'light');
    await createAccessibleComponent(page, 'interactive');
    
    // Verify animations are disabled or minimal
    const animationDuration = await page.evaluate(() => {
      const element = document.querySelector('button');
      if (element) {
        const styles = window.getComputedStyle(element);
        return styles.transitionDuration;
      }
      return null;
    });
    
    // Should be very short or none for reduced motion
    expect(animationDuration).toMatch(/^(0s|0\.01ms)$/);
    
    // Run axe-core tests
    const axeBuilder = new AxeBuilder({ page });
    const results = await axeBuilder.analyze();
    
    expect(results.violations).toEqual([]);
  });
});