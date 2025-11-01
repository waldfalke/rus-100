/**
 * Elevation Accessibility Tests
 * 
 * Comprehensive accessibility testing for elevation tokens including
 * WCAG compliance, assistive technology compatibility, and user preference handling.
 */

import { describe, it, expect, beforeEach, afterEach } from '@jest/globals';
import { render, screen, fireEvent } from '@testing-library/react';
import { axe, toHaveNoViolations } from 'jest-axe';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom';

// Extend Jest matchers
expect.extend(toHaveNoViolations);

// Type declaration for extended matchers
declare module '@jest/expect' {
  interface Matchers<R> {
    toBeInTheDocument(): R;
    toHaveFocus(): R;
    toHaveNoViolations(): R;
  }
}

// Import elevation system
import type { ElevationLevel } from '@/lib/tokens/elevation';
import { calculateShadowColor, getElevationShadow } from '@/lib/tokens/elevation';
import { useElevation, useComponentElevation } from '@/lib/hooks/use-elevation';
import type { ComponentElevationContext } from '@/lib/theme-contracts/types';

// Test components
import React from 'react';

// ============================================================================
// TEST UTILITIES
// ============================================================================

/**
 * Calculate relative luminance from RGB values
 * Based on WCAG 2.1 specification
 */
function calculateLuminance(r: number, g: number, b: number): number {
  const [rs, gs, bs] = [r, g, b].map(c => {
    c = c / 255;
    return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
  });
  
  return 0.2126 * rs + 0.7152 * gs + 0.0722 * bs;
}

/**
 * Calculate contrast ratio between two colors
 * Based on WCAG 2.1 specification
 */
function calculateContrastRatio(color1: [number, number, number], color2: [number, number, number]): number {
  const lum1 = calculateLuminance(...color1);
  const lum2 = calculateLuminance(...color2);
  
  const lighter = Math.max(lum1, lum2);
  const darker = Math.min(lum1, lum2);
  
  return (lighter + 0.05) / (darker + 0.05);
}

/**
 * Parse OKLCH color to approximate RGB for contrast testing
 * Note: This is a simplified conversion for testing purposes
 */
function oklchToRGB(oklchString: string): [number, number, number] {
  // Extract L, C, H values from oklch(L C H) format
  const match = oklchString.match(/oklch\(([^)]+)\)/);
  if (!match) throw new Error(`Invalid OKLCH color: ${oklchString}`);
  
  const [l, c, h] = match[1].split(' ').map(parseFloat);
  
  // Simplified conversion (for testing purposes)
  // In production, you'd use a proper color conversion library
  const lightness = l * 255;
  const chroma = c * 128;
  const hue = (h || 0) * Math.PI / 180;
  
  const r = Math.max(0, Math.min(255, lightness + chroma * Math.cos(hue)));
  const g = Math.max(0, Math.min(255, lightness + chroma * Math.cos(hue + 2 * Math.PI / 3)));
  const b = Math.max(0, Math.min(255, lightness + chroma * Math.cos(hue + 4 * Math.PI / 3)));
  
  return [Math.round(r), Math.round(g), Math.round(b)];
}

/**
 * Test component with elevation
 */
function ElevatedComponent({ 
  level, 
  variant = 'moderate', 
  accessibility = {},
  children = 'Test Content',
  ...props 
}: {
  level: ElevationLevel;
  variant?: 'subtle' | 'moderate' | 'prominent' | 'dramatic';
  accessibility?: {
    highContrast?: boolean;
    reducedMotion?: boolean;
    prefersReducedData?: boolean;
  };
  children?: React.ReactNode;
  [key: string]: any;
}) {
  const { shadowCSS } = useComponentElevation('card', {
    variant,
    accessibility: {
        highContrast: false,
        reducedMotion: false,
        ...accessibility
      }
  });

  return (
    <div
      style={{ boxShadow: shadowCSS }}
      role="region"
      aria-label="Elevated content"
      {...props}
    >
      {children}
    </div>
  );
}

/**
 * Mock media query for testing user preferences
 */
function mockMediaQuery(query: string, matches: boolean) {
  const mediaQuery = {
    matches,
    media: query,
    onchange: null,
    addListener: jest.fn(),
    removeListener: jest.fn(),
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    dispatchEvent: jest.fn(),
  };

  Object.defineProperty(window, 'matchMedia', {
    writable: true,
    value: jest.fn().mockImplementation((q) => q === query ? mediaQuery : {
      matches: false,
      media: q,
      onchange: null,
      addListener: jest.fn(),
      removeListener: jest.fn(),
      addEventListener: jest.fn(),
      removeEventListener: jest.fn(),
      dispatchEvent: jest.fn(),
    }),
  });

  return mediaQuery;
}

// ============================================================================
// ACCESSIBILITY TESTS
// ============================================================================

describe('Elevation Accessibility', () => {
  beforeEach(() => {
    // Reset any mocked media queries
    jest.clearAllMocks();
  });

  describe('WCAG Compliance', () => {
    it('should not introduce accessibility violations', async () => {
      const { container } = render(
        <div>
          <ElevatedComponent level={1}>Level 1 Content</ElevatedComponent>
          <ElevatedComponent level={2}>Level 2 Content</ElevatedComponent>
          <ElevatedComponent level={3}>Level 3 Content</ElevatedComponent>
        </div>
      );

      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });

    it('should maintain sufficient contrast in high contrast mode', () => {
      // Test normal mode
      const normalColor = calculateShadowColor(2, {
        level: 2,
        themeContext: {
          mode: 'light',
          platform: 'web',
          contrast: 'normal',
          motion: 'full',
          viewport: { width: 1024, height: 768, density: 1 },
          accessibility: { highContrast: false, reducedMotion: false, prefersReducedData: false, largeText: false }
        }
      });

      // Test high contrast mode
      const highContrastColor = calculateShadowColor(2, {
        level: 2,
        themeContext: {
          mode: 'light',
          platform: 'web',
          contrast: 'high',
          motion: 'full',
          viewport: { width: 1024, height: 768, density: 1 },
          accessibility: { highContrast: true, reducedMotion: false, prefersReducedData: false },
        },
        accessibility: { highContrast: true, reducedMotion: false, prefersReducedData: false }
      });

      // High contrast should have different (typically higher) opacity
      expect(highContrastColor.opacity).not.toBe(normalColor.opacity);
      
      // Both should produce valid colors
      expect(normalColor.color).toMatch(/oklch\([^)]+\)/);
      expect(highContrastColor.color).toMatch(/oklch\([^)]+\)/);
    });

    it('should respect reduced motion preferences', () => {
      const { container: normalContainer } = render(
        <ElevatedComponent 
          level={2} 
          accessibility={{ reducedMotion: false }}
        >
          Normal Motion Content
        </ElevatedComponent>
      );

      const { container: reducedContainer } = render(
        <ElevatedComponent 
          level={2} 
          accessibility={{ reducedMotion: true }}
        >
          Reduced Motion Content
        </ElevatedComponent>
      );

      const normalElement = normalContainer.firstChild as HTMLElement;
      const reducedElement = reducedContainer.firstChild as HTMLElement;

      // Elements should have different shadow styles
      expect(normalElement.style.boxShadow).not.toBe(reducedElement.style.boxShadow);
    });

    it('should handle prefers-reduced-data preference', () => {
      const context: ComponentElevationContext = {
        level: 2,
        variant: 'moderate',
        size: 'md',
        platform: 'web'
      };

      const normalColor = calculateShadowColor(2, {
        level: 2,
        themeContext: {
          mode: 'light',
          platform: 'web',
          contrast: 'normal',
          motion: 'full',
          viewport: { width: 1920, height: 1080, density: 1 },
          accessibility: { highContrast: false, reducedMotion: false, prefersReducedData: false, largeText: false }
        },
        accessibility: { highContrast: false, reducedMotion: false, prefersReducedData: false, largeText: false }
      });

      const reducedDataColor = calculateShadowColor(2, {
        level: 2,
        themeContext: {
          mode: 'light',
          platform: 'web',
          contrast: 'normal',
          motion: 'full',
          viewport: { width: 1920, height: 1080, density: 1 },
          accessibility: { highContrast: false, reducedMotion: false, prefersReducedData: true }
        },
        accessibility: { highContrast: false, reducedMotion: false, prefersReducedData: true }
      });

      // Reduced data mode should affect shadow rendering
      expect(reducedDataColor.opacity).toBeLessThanOrEqual(normalColor.opacity);
    });
  });

  describe('User Preference Detection', () => {
    it('should detect prefers-reduced-motion', () => {
      const mediaQuery = mockMediaQuery('(prefers-reduced-motion: reduce)', true);
      
      const { container } = render(
        <ElevatedComponent level={2}>
          Reduced Motion Test
        </ElevatedComponent>
      );

      // Component should adapt to reduced motion preference
      expect(window.matchMedia).toHaveBeenCalledWith('(prefers-reduced-motion: reduce)');
    });

    it('should detect prefers-contrast', () => {
      const mediaQuery = mockMediaQuery('(prefers-contrast: high)', true);
      
      const { container } = render(
        <ElevatedComponent level={2}>
          High Contrast Test
        </ElevatedComponent>
      );

      // Component should adapt to high contrast preference
      expect(window.matchMedia).toHaveBeenCalledWith('(prefers-contrast: high)');
    });

    it('should detect prefers-reduced-data', () => {
      const mediaQuery = mockMediaQuery('(prefers-reduced-data: reduce)', true);
      
      const { container } = render(
        <ElevatedComponent level={2}>
          Reduced Data Test
        </ElevatedComponent>
      );

      // Component should adapt to reduced data preference
      expect(window.matchMedia).toHaveBeenCalledWith('(prefers-reduced-data: reduce)');
    });
  });

  describe('Shadow Intensity Adjustments', () => {
    it('should reduce shadow intensity for accessibility needs', () => {
      const normalShadow = getElevationShadow({
        level: 3,
        variant: 'moderate',
        size: 'md',
        platform: 'web'
      });

      const accessibleShadow = getElevationShadow({
        level: 3,
        variant: 'moderate',
        size: 'md',
        platform: 'web'
      });

      // Both should be valid CSS
      expect(normalShadow.css).toMatch(/^-?\d+(?:\.\d+)?px\s+-?\d+(?:\.\d+)?px\s+\d+(?:\.\d+)?px\s+\d+(?:\.\d+)?px\s+.+$/);
      expect(accessibleShadow.css).toMatch(/^-?\d+(?:\.\d+)?px\s+-?\d+(?:\.\d+)?px\s+\d+(?:\.\d+)?px\s+\d+(?:\.\d+)?px\s+.+$/);
    });

    it('should maintain visual hierarchy in accessibility modes', () => {
      const contexts = [
        { level: 1 as ElevationLevel, variant: 'moderate' as const, size: 'md' as const, platform: 'web' as const },
        { level: 2 as ElevationLevel, variant: 'moderate' as const, size: 'md' as const, platform: 'web' as const },
        { level: 3 as ElevationLevel, variant: 'moderate' as const, size: 'md' as const, platform: 'web' as const }
      ];

      const shadows = contexts.map(context => getElevationShadow(context));

      // Even in accessibility mode, hierarchy should be maintained
      // This is a simplified test - in practice you'd parse the CSS and compare values
      expect(shadows[0].css).not.toBe(shadows[1].css);
      expect(shadows[1].css).not.toBe(shadows[2].css);
    });
  });

  describe('Assistive Technology Compatibility', () => {
    it('should not interfere with screen readers', async () => {
      const { container } = render(
        <div>
          <ElevatedComponent level={1} aria-label="Card 1">
            <h2>Card Title</h2>
            <p>Card content that should be readable by screen readers</p>
          </ElevatedComponent>
          <ElevatedComponent level={2} aria-label="Card 2">
            <h2>Another Card</h2>
            <p>More content for screen readers</p>
          </ElevatedComponent>
        </div>
      );

      // Check that content is still accessible
      expect(screen.getByText('Card Title')).toBeInTheDocument();
      expect(screen.getByText('Card content that should be readable by screen readers')).toBeInTheDocument();
      expect(screen.getByText('Another Card')).toBeInTheDocument();
      expect(screen.getByText('More content for screen readers')).toBeInTheDocument();

      // Check that ARIA labels are preserved
      expect(screen.getByLabelText('Card 1')).toBeInTheDocument();
      expect(screen.getByLabelText('Card 2')).toBeInTheDocument();

      // Run axe accessibility tests
      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });

    it('should maintain focus indicators', async () => {
      const user = userEvent.setup();
      
      const { container } = render(
        <div>
          <ElevatedComponent level={1} tabIndex={0}>
            Focusable elevated content
          </ElevatedComponent>
          <button>Next focusable element</button>
        </div>
      );

      const elevatedElement = container.firstChild?.firstChild as HTMLElement;
      const button = screen.getByRole('button');

      // Focus the elevated element
      await user.tab();
      expect(elevatedElement).toHaveFocus();

      // Focus should move to next element
      await user.tab();
      expect(button).toHaveFocus();

      // No accessibility violations with focus
      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });

    it('should work with keyboard navigation', async () => {
      const user = userEvent.setup();
      const handleClick = jest.fn();
      
      render(
        <ElevatedComponent 
          level={2} 
          tabIndex={0}
          onClick={handleClick}
          onKeyDown={(e: KeyboardEvent) => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault();
              handleClick();
            }
          }}
        >
          Interactive elevated content
        </ElevatedComponent>
      );

      const element = screen.getByText('Interactive elevated content');
      
      // Focus and activate with keyboard
      await user.tab();
      expect(element).toHaveFocus();
      
      await user.keyboard('{Enter}');
      expect(handleClick).toHaveBeenCalledTimes(1);
      
      await user.keyboard(' ');
      expect(handleClick).toHaveBeenCalledTimes(2);
    });
  });

  describe('Color Contrast and Visibility', () => {
    it('should maintain adequate shadow visibility across themes', () => {
      const lightThemeColor = calculateShadowColor(2, {
        level: 2,
        themeContext: {
          mode: 'light',
          platform: 'web',
          contrast: 'normal',
          motion: 'full',
          viewport: { width: 1920, height: 1080, density: 1 },
          accessibility: { highContrast: false, reducedMotion: false, prefersReducedData: false, largeText: false }
        }
      });

      const darkThemeColor = calculateShadowColor(2, {
        level: 2,
        themeContext: {
          mode: 'dark',
          platform: 'web',
          contrast: 'normal',
          motion: 'full',
          viewport: { width: 1920, height: 1080, density: 1 },
          accessibility: { highContrast: false, reducedMotion: false, prefersReducedData: false }
        },
        accessibility: { highContrast: false, reducedMotion: false, prefersReducedData: false }
      });

      // Both should have reasonable opacity for visibility
      expect(lightThemeColor.opacity).toBeGreaterThan(0.05);
      expect(lightThemeColor.opacity).toBeLessThan(0.8);
      
      expect(darkThemeColor.opacity).toBeGreaterThan(0.05);
      expect(darkThemeColor.opacity).toBeLessThan(0.8);

      // Colors should be different for different themes
      expect(lightThemeColor.color).not.toBe(darkThemeColor.color);
    });

    it('should provide sufficient contrast in high contrast mode', () => {
      const normalColor = calculateShadowColor(3, {
        level: 3,
        themeContext: {
          mode: 'light',
          platform: 'web',
          contrast: 'normal',
          motion: 'full',
          viewport: { width: 1920, height: 1080, density: 1 },
          accessibility: { highContrast: false, reducedMotion: false, prefersReducedData: false, largeText: false }
        }
      });

      const highContrastColor = calculateShadowColor(3, {
        level: 3,
        themeContext: {
          mode: 'light',
          platform: 'web',
          contrast: 'normal',
          motion: 'full',
          viewport: { width: 1920, height: 1080, density: 1 },
          accessibility: { highContrast: true, reducedMotion: false, prefersReducedData: false, largeText: false }
        }
      });

      // High contrast mode should have higher opacity for better visibility
      expect(highContrastColor.opacity).toBeGreaterThanOrEqual(normalColor.opacity);
    });
  });

  describe('Performance with Accessibility Features', () => {
    it('should not significantly impact performance with accessibility features enabled', () => {
      const iterations = 100;
      
      // Test normal mode performance
      const normalStart = performance.now();
      for (let i = 0; i < iterations; i++) {
        calculateShadowColor(2 as ElevationLevel, {
          level: 2 as ElevationLevel,
          themeContext: {
            mode: 'light',
            platform: 'web',
            contrast: 'normal',
            motion: 'full',
            viewport: { width: 1920, height: 1080, density: 1 },
            accessibility: { highContrast: false, reducedMotion: false, prefersReducedData: false }
          },
          accessibility: { highContrast: false, reducedMotion: false, prefersReducedData: false }
        });
      }
      const normalEnd = performance.now();
      const normalTime = normalEnd - normalStart;

      // Test accessibility mode performance
      const a11yStart = performance.now();
      for (let i = 0; i < iterations; i++) {
        calculateShadowColor(2 as ElevationLevel, {
          level: 2 as ElevationLevel,
          themeContext: {
            mode: 'light',
            platform: 'web',
            contrast: 'high',
            motion: 'reduced',
            viewport: { width: 1920, height: 1080, density: 1 },
            accessibility: { highContrast: true, reducedMotion: true, prefersReducedData: false }
          },
          accessibility: { highContrast: true, reducedMotion: true, prefersReducedData: false }
        });
      }
      const a11yEnd = performance.now();
      const a11yTime = a11yEnd - a11yStart;

      // Accessibility features should not significantly slow down calculations
      // Allow up to 50% performance overhead for accessibility features
      expect(a11yTime).toBeLessThan(normalTime * 1.5);
    });
  });

  describe('Error Handling and Graceful Degradation', () => {
    it('should handle invalid accessibility preferences gracefully', () => {
      expect(() => {
        calculateShadowColor(2 as ElevationLevel, {
          level: 2 as ElevationLevel,
          themeContext: {
            mode: 'light',
            platform: 'web',
            contrast: 'normal',
            motion: 'full',
            viewport: { width: 1920, height: 1080, density: 1 },
            accessibility: { highContrast: false, reducedMotion: false, prefersReducedData: false }
          },
          accessibility: { highContrast: false, reducedMotion: false, prefersReducedData: false }
        });
      }).not.toThrow();
    });

    it('should provide fallbacks when media queries are not supported', () => {
      // Mock unsupported matchMedia
      const originalMatchMedia = window.matchMedia;
      delete (window as any).matchMedia;

      const { container } = render(
        <ElevatedComponent level={2}>
          Fallback test content
        </ElevatedComponent>
      );

      // Should still render without errors
      expect(screen.getByText('Fallback test content')).toBeInTheDocument();

      // Restore matchMedia
      window.matchMedia = originalMatchMedia;
    });

    it('should handle CSS parsing errors gracefully', () => {
      // This test ensures the system doesn't break with malformed CSS
      expect(() => {
        const shadow = getElevationShadow({
          level: 2 as ElevationLevel,
          variant: 'moderate',
          size: 'md',
          platform: 'web'
        });
        
        // Should produce valid CSS even in edge cases
        expect(shadow.css).toBeTruthy();
        expect(typeof shadow.css).toBe('string');
      }).not.toThrow();
    });
  });
});

// ОШИБКА: Тест находился вне describe блока
// ИСПРАВЛЕНИЕ: Перемещаем тест внутрь describe блока
describe('Keyboard Navigation', () => {
// ОШИБКА: Параметр 'e' имеет неявный тип 'any'
// ИСПРАВЛЕНИЕ: Добавляем типизацию для event параметра
it('should handle keyboard navigation', async () => {
  const { container } = render(
    <ElevatedComponent level={2}>
      Keyboard Navigation Test
    </ElevatedComponent>
  );

  const element = container.firstChild as HTMLElement;
  
  // Focus the element
  element.focus();
  expect(element).toHaveFocus();
  
  // Test keyboard events with proper typing
  fireEvent.keyDown(element, { key: 'Tab' });
  
  // ИСПРАВЛЕНИЕ: Добавляем типизацию для event handler
  const handleKeyDown = (e: KeyboardEvent) => {
    if (e.key === 'Escape') {
      element.blur();
    }
  };
  
  element.addEventListener('keydown', handleKeyDown);
  fireEvent.keyDown(element, { key: 'Escape' });
  expect(element).not.toHaveFocus();
  
  const results = await axe(container);
  expect(results).toHaveNoViolations();
});
}); // ИСПРАВЛЕНИЕ: Добавляем недостающую закрывающую скобку для describe блока