/**
 * Elevation Token System Tests
 * 
 * Comprehensive test suite for functional elevation and soft shadow tokens
 * including property-based tests, accessibility validation, and integration tests.
 */

import { describe, it, expect, beforeEach, afterEach } from '@jest/globals';
import { renderHook, act } from '@testing-library/react';
import fc from 'fast-check';

// Import elevation system
import {
  getElevationShadow,
  calculateShadowColor,
  validateElevationHierarchy,
  generateElevationCSS,
  generateTailwindElevation,
  ELEVATION_PRESETS,
  BASE_ELEVATION_SCALE as ELEVATION_SCALE,
  SIZE_MULTIPLIERS,
  VARIANT_MULTIPLIERS,
  PLATFORM_ADJUSTMENTS,
  ACCESSIBILITY_MULTIPLIERS
} from '@/lib/tokens/elevation';

import { useElevation, useComponentElevation } from '@/lib/hooks/use-elevation';

import type {
  ElevationLevel,
  ElevationVariant,
  ComponentElevationContext,
  ElevationShadow
} from '@/lib/theme-contracts/types';

// ============================================================================
// TEST UTILITIES
// ============================================================================

/**
 * Parse CSS box-shadow string to extract numeric values
 */
function parseShadowCSS(shadowCSS: string): {
  offsetX: number;
  offsetY: number;
  blur: number;
  spread: number;
  color: string;
  opacity?: number;
} {
  // Match pattern: "0 4px 8px 2px rgba(0, 0, 0, 0.15)"
  const match = shadowCSS.match(/(-?\d+(?:\.\d+)?)px\s+(-?\d+(?:\.\d+)?)px\s+(-?\d+(?:\.\d+)?)px\s+(-?\d+(?:\.\d+)?)px\s+(.+)/);
  
  if (!match) {
    throw new Error(`Invalid shadow CSS: ${shadowCSS}`);
  }

  const [, offsetX, offsetY, blur, spread, color] = match;
  
  // Extract opacity from rgba if present
  const opacityMatch = color.match(/rgba?\([^,]+,[^,]+,[^,]+,\s*([^)]+)\)/);
  const opacity = opacityMatch ? parseFloat(opacityMatch[1]) : undefined;

  return {
    offsetX: parseFloat(offsetX),
    offsetY: parseFloat(offsetY),
    blur: parseFloat(blur),
    spread: parseFloat(spread),
    color,
    opacity
  };
}

/**
 * Create test context for elevation
 */
function createTestContext(overrides: Partial<ComponentElevationContext> = {}): ComponentElevationContext {
  return {
    level: 2,
    variant: 'moderate',
    size: 'md',
    platform: 'web',
    ...overrides
  };
}

/**
 * Fast-check arbitraries for property-based testing
 */
const elevationLevelArb = fc.integer({ min: 0, max: 5 }) as fc.Arbitrary<ElevationLevel>;
const elevationVariantArb = fc.constantFrom('subtle', 'moderate', 'prominent', 'dramatic') as fc.Arbitrary<ElevationVariant>;
const sizeArb = fc.constantFrom('xs', 'sm', 'md', 'lg', 'xl');
const platformArb = fc.constantFrom('web', 'mobile', 'desktop');

// ============================================================================
// CORE ELEVATION FUNCTION TESTS
// ============================================================================

describe('Elevation Token System', () => {
  describe('Core Functions', () => {
    describe('getElevationShadow', () => {
      it('should return valid shadow parameters for all elevation levels', () => {
        fc.assert(fc.property(
          elevationLevelArb,
          elevationVariantArb,
          sizeArb,
          platformArb,
          (level, variant, size, platform) => {
            const context = createTestContext({ level, variant, size, platform });
            const shadow = getElevationShadow(context);

            // All parameters should be non-negative numbers
            expect(shadow.combined.blur).toBeGreaterThanOrEqual(0);
            expect(shadow.combined.spread).toBeGreaterThanOrEqual(0);
            expect(shadow.combined.offsetY).toBeGreaterThanOrEqual(0);
            expect(shadow.combined.opacity).toBeGreaterThanOrEqual(0);
            expect(shadow.combined.opacity).toBeLessThanOrEqual(1);
            
            // Color should be a valid OKLCH string
            expect(shadow.combined.color).toMatch(/oklch\([^)]+\)/);
          }
        ));
      });

      it('should increase shadow intensity with elevation level', () => {
        const context = createTestContext();
        const levels = [0, 1, 2, 3, 4, 5] as ElevationLevel[];
        const shadows = levels.map(level => getElevationShadow({ ...context, level }));

        // Blur should generally increase with level
        for (let i = 1; i < shadows.length; i++) {
          expect(shadows[i].combined.blur).toBeGreaterThanOrEqual(shadows[i - 1].combined.blur);
        }

        // Offset Y should increase with level
        for (let i = 1; i < shadows.length; i++) {
          expect(shadows[i].combined.offsetY).toBeGreaterThanOrEqual(shadows[i - 1].combined.offsetY);
        }

        // Opacity should generally increase with level (except for level 0)
        for (let i = 2; i < shadows.length; i++) {
          expect(shadows[i].combined.opacity).toBeGreaterThanOrEqual(shadows[i - 1].combined.opacity);
        }
      });

      it('should respect variant multipliers', () => {
        const context = createTestContext({ level: 3 });
        
        const subtleShadow = getElevationShadow({ ...context, variant: 'subtle' });
        const moderateShadow = getElevationShadow({ ...context, variant: 'moderate' });
        const prominentShadow = getElevationShadow({ ...context, variant: 'prominent' });
        const dramaticShadow = getElevationShadow({ ...context, variant: 'dramatic' });

        // Blur should increase with variant intensity
        expect(subtleShadow.combined.blur).toBeLessThan(moderateShadow.combined.blur);
        expect(moderateShadow.combined.blur).toBeLessThan(prominentShadow.combined.blur);
        expect(prominentShadow.combined.blur).toBeLessThan(dramaticShadow.combined.blur);

        // Opacity should increase with variant intensity
        expect(subtleShadow.combined.opacity).toBeLessThan(moderateShadow.combined.opacity);
        expect(moderateShadow.combined.opacity).toBeLessThan(prominentShadow.combined.opacity);
        expect(prominentShadow.combined.opacity).toBeLessThan(dramaticShadow.combined.opacity);
      });

      it('should apply size multipliers correctly', () => {
        const context = createTestContext({ level: 2 });
        
        const xsShadow = getElevationShadow({ ...context, size: 'xs' });
        const mdShadow = getElevationShadow({ ...context, size: 'md' });
        const xlShadow = getElevationShadow({ ...context, size: 'xl' });

        // Larger sizes should have more prominent shadows
        expect(xsShadow.combined.blur).toBeLessThan(mdShadow.combined.blur);
        expect(mdShadow.combined.blur).toBeLessThan(xlShadow.combined.blur);
      });

      it('should apply platform adjustments', () => {
        const context = createTestContext({ level: 2 });
        
        const webShadow = getElevationShadow({ ...context, platform: 'web' });
        const mobileShadow = getElevationShadow({ ...context, platform: 'mobile' });
        const desktopShadow = getElevationShadow({ ...context, platform: 'desktop' });

        // Each platform should have different characteristics
        expect(webShadow.combined.blur).not.toBe(mobileShadow.combined.blur);
        expect(webShadow.combined.offsetY).not.toBe(mobileShadow.combined.offsetY);
        expect(mobileShadow.combined.blur).not.toBe(desktopShadow.combined.blur);
      });
    });

    describe('calculateShadowColor', () => {
      it('should return valid OKLCH colors for all contexts', () => {
        fc.assert(fc.property(
          elevationLevelArb,
          fc.constantFrom('light', 'dark'),
          fc.boolean(),
          fc.boolean(),
          platformArb,
          (level, mode, highContrast, reducedMotion, platform) => {
            const result = calculateShadowColor(level, {
              mode,
              accessibility: { highContrast, reducedMotion, prefersReducedData: false },
              platform
            });

            expect(result.color).toMatch(/oklch\([^)]+\)/);
            expect(result.opacity).toBeGreaterThanOrEqual(0);
            expect(result.opacity).toBeLessThanOrEqual(1);
          }
        ));
      });

      it('should adjust colors for theme modes', () => {
        const context = { level: 2, variant: 'moderate' as ElevationVariant, size: 'md' as const, platform: 'web' as const };
        
        const lightColor = calculateShadowColor(2, {
          level: 2,
          themeContext: {
            mode: 'light',
            platform: 'web',
            contrast: 'normal',
            motion: 'full',
            viewport: { width: 1920, height: 1080, density: 1 },
            accessibility: { highContrast: false, reducedMotion: false, prefersReducedData: false, largeText: false }
          },
          accessibility: { highContrast: false, reducedMotion: false, prefersReducedData: false }
        });

        const darkColor = calculateShadowColor(2, {
          level: 2,
          themeContext: {
            mode: 'dark',
            platform: 'web',
            contrast: 'normal',
            motion: 'full',
            viewport: { width: 1920, height: 1080, density: 1 },
            accessibility: { highContrast: false, reducedMotion: false, prefersReducedData: false, largeText: false }
          },
          accessibility: { highContrast: false, reducedMotion: false, prefersReducedData: false }
        });

        // Colors should be different for light and dark modes
        expect(lightColor.color).not.toBe(darkColor.color);
      });

      it('should respect accessibility preferences', () => {
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
          accessibility: { highContrast: false, reducedMotion: false, prefersReducedData: false }
        });

        const highContrastColor = calculateShadowColor(2, {
          level: 2,
          themeContext: {
            mode: 'light',
            platform: 'web',
            contrast: 'normal',
            motion: 'full',
            viewport: { width: 1920, height: 1080, density: 1 },
            accessibility: { highContrast: true, reducedMotion: false, prefersReducedData: false, largeText: false }
          },
          accessibility: { highContrast: true, reducedMotion: false, prefersReducedData: false }
        });

        // High contrast should affect opacity
        expect(highContrastColor.opacity).not.toBe(normalColor.opacity);
      });
    });

    describe('getElevationShadow', () => {
      it('should generate valid CSS box-shadow strings', () => {
        fc.assert(fc.property(
          elevationLevelArb,
          elevationVariantArb,
          sizeArb,
          platformArb,
          (level, variant, size, platform) => {
            const context = createTestContext({ level, variant, size, platform });
            const shadow = getElevationShadow(context);

            // Should be a valid CSS box-shadow string
            expect(shadow.css).toMatch(/^-?\d+(?:\.\d+)?px\s+-?\d+(?:\.\d+)?px\s+\d+(?:\.\d+)?px\s+\d+(?:\.\d+)?px\s+.+$/);
            
            // Should be parseable
            expect(() => parseShadowCSS(shadow.css)).not.toThrow();
          }
        ));
      });

      it('should provide ambient, directional, and combined shadows', () => {
        const context = createTestContext();
        const shadow = getElevationShadow(context);

        expect(shadow.ambient).toBeDefined();
        expect(shadow.directional).toBeDefined();
        expect(shadow.combined).toBeDefined();
        expect(shadow.css).toBeDefined();

        // All should be valid CSS
        expect(shadow.ambient.color).toMatch(/oklch\([^)]+\)/);
        expect(shadow.directional.color).toMatch(/oklch\([^)]+\)/);
        expect(shadow.css).toContain(','); // Should contain multiple shadows
      });
    });
  });

  // ============================================================================
  // HIERARCHY VALIDATION TESTS
  // ============================================================================

  describe('Hierarchy Validation', () => {
    describe('validateElevationHierarchy', () => {
      it('should validate correct hierarchies', () => {
        const contexts: ComponentElevationContext[] = [
          { level: 0, variant: 'moderate', size: 'md', platform: 'web' },
          { level: 1, variant: 'moderate', size: 'md', platform: 'web' },
          { level: 2, variant: 'moderate', size: 'md', platform: 'web' },
          { level: 3, variant: 'moderate', size: 'md', platform: 'web' }
        ];

        const result = validateElevationHierarchy(contexts);
        expect(result.isValid).toBe(true);
        expect(result.violations).toHaveLength(0);
      });

      it('should detect hierarchy violations', () => {
        const contexts: ComponentElevationContext[] = [
          { level: 3, variant: 'moderate', size: 'md', platform: 'web' },
          { level: 1, variant: 'moderate', size: 'md', platform: 'web' },
          { level: 4, variant: 'moderate', size: 'md', platform: 'web' },
          { level: 2, variant: 'moderate', size: 'md', platform: 'web' }
        ];

        const result = validateElevationHierarchy(contexts);
        expect(result.isValid).toBe(false);
        expect(result.violations.length).toBeGreaterThan(0);
      });

      it('should handle edge cases', () => {
        // Empty array
        expect(validateElevationHierarchy([]).isValid).toBe(true);
        
        // Single element
        const singleContext = [{ level: 2, variant: 'moderate' as ElevationVariant, size: 'md' as const, platform: 'web' as const }];
        expect(validateElevationHierarchy(singleContext).isValid).toBe(true);
        
        // Duplicate levels
        const duplicateContexts = [
          { level: 2, variant: 'moderate' as ElevationVariant, size: 'md' as const, platform: 'web' as const },
          { level: 2, variant: 'moderate' as ElevationVariant, size: 'md' as const, platform: 'web' as const }
        ];
        const duplicateResult = validateElevationHierarchy(duplicateContexts);
        expect(duplicateResult.isValid).toBe(true); // Duplicates are allowed
      });
    });
  });

  // ============================================================================
  // CSS AND TAILWIND GENERATION TESTS
  // ============================================================================

  describe('CSS and Tailwind Generation', () => {
    describe('generateElevationCSS', () => {
      it('should generate valid CSS custom properties', () => {
        const context = createTestContext();
        const css = generateElevationCSS(2, context);

        expect(css).toHaveProperty('--elevation-shadow');
        expect(css).toHaveProperty('--elevation-shadow-ambient');
        expect(css).toHaveProperty('--elevation-shadow-directional');
        expect(css).toHaveProperty('--elevation-level');

        // Values should be valid CSS
        expect(css['--elevation-shadow']).toMatch(/^-?\d+(?:\.\d+)?px\s+-?\d+(?:\.\d+)?px\s+\d+(?:\.\d+)?px\s+\d+(?:\.\d+)?px\s+.+$/);
        expect(css['--elevation-level']).toBe('2');
      });
    });

    describe('generateTailwindElevation', () => {
      it('should generate valid Tailwind utilities', () => {
        const context = createTestContext();
        const tailwind = generateTailwindElevation(context);

        expect(tailwind).toHaveProperty('boxShadow');
        expect(tailwind).toHaveProperty('elevation');

        // Should be valid Tailwind class names
        expect(tailwind.boxShadow).toMatch(/^shadow-/);
        expect(tailwind.elevation).toMatch(/^elevation-/);
      });
    });
  });

  // ============================================================================
  // REACT HOOKS TESTS
  // ============================================================================

  describe('React Hooks', () => {
    describe('useElevation', () => {
      it('should provide elevation functions', () => {
        const { result } = renderHook(() => useElevation());

        expect(result.current.getLevel).toBeDefined();
        expect(result.current.getShadow).toBeDefined();
        expect(result.current.getSemantic).toBeDefined();
        expect(result.current.validateHierarchy).toBeDefined();
        expect(result.current.generateCSS).toBeDefined();
        expect(result.current.generateTailwind).toBeDefined();
      });

      it('should return consistent results for same inputs', () => {
        const { result } = renderHook(() => useElevation());
        const context = createTestContext();

        const shadow1 = result.current.getLevel(2, context);
        const shadow2 = result.current.getLevel(2, context);

        expect(shadow1).toBe(shadow2);
      });

      it('should respect accessibility options', () => {
        const { result: normalResult } = renderHook(() => 
          useElevation({ 
            accessibility: { 
              highContrast: false, 
              reducedMotion: false, 
              prefersReducedData: false 
            } 
          })
        );

        const { result: a11yResult } = renderHook(() => 
          useElevation({ 
            accessibility: { 
              highContrast: true, 
              reducedMotion: true, 
              prefersReducedData: true 
            } 
          })
        );

        const context = createTestContext();
        const normalShadow = normalResult.current.getLevel(2, context);
        const a11yShadow = a11yResult.current.getLevel(2, context);

        expect(normalShadow).not.toBe(a11yShadow);
      });
    });

    describe('useComponentElevation', () => {
      it('should provide component-specific elevation', () => {
        const { result } = renderHook(() => useComponentElevation('card'));

        expect(result.current.shadowCSS).toBeDefined();
        expect(result.current.level).toBeDefined();
        expect(result.current.shadow).toBeDefined();

        // Should be valid CSS
        expect(result.current.shadowCSS).toMatch(/^-?\d+(?:\.\d+)?px\s+-?\d+(?:\.\d+)?px\s+\d+(?:\.\d+)?px\s+\d+(?:\.\d+)?px\s+.+$/);
        
        // Level should be appropriate for card
        expect(result.current.level).toBeGreaterThanOrEqual(0);
        expect(result.current.level).toBeLessThanOrEqual(5);
      });

      it('should return different elevations for different component types', () => {
        const { result: cardResult } = renderHook(() => useComponentElevation('card'));
        const { result: modalResult } = renderHook(() => useComponentElevation('modal'));
        const { result: tooltipResult } = renderHook(() => useComponentElevation('tooltip'));

        // Different component types should have different elevation levels
        const levels = [cardResult.current.level, modalResult.current.level, tooltipResult.current.level];
        const uniqueLevels = new Set(levels);
        
        expect(uniqueLevels.size).toBeGreaterThan(1); // At least some should be different
      });
    });
  });

  // ============================================================================
  // INTEGRATION TESTS
  // ============================================================================

  describe('Integration Tests', () => {
    it('should work with all elevation presets', () => {
      Object.entries(ELEVATION_PRESETS).forEach(([presetName, preset]) => {
        const context = createTestContext();
        
        expect(() => {
          const shadow = getElevationShadow(preset.level, {
            ...context,
            level: preset.level,
            variant: preset.variant
          });
          
          // Should generate valid CSS
          parseShadowCSS(shadow.css);
        }).not.toThrow();
      });
    });

    it('should maintain consistency across different platforms', () => {
      const context = createTestContext({ level: 2 });
      const platforms: Array<'web' | 'mobile' | 'desktop'> = ['web', 'mobile', 'desktop'];
      
      platforms.forEach(platform => {
        const shadow = getElevationShadow(2, { ...context, platform });
        
        // Should generate valid CSS for all platforms
        expect(() => parseShadowCSS(shadow.css)).not.toThrow();
        
        // Should have reasonable values
        const parsed = parseShadowCSS(shadow.css);
        expect(parsed.blur).toBeGreaterThan(0);
        expect(parsed.offsetY).toBeGreaterThanOrEqual(0);
        expect(parsed.opacity).toBeGreaterThan(0);
        expect(parsed.opacity).toBeLessThanOrEqual(1);
      });
    });

    it('should handle extreme values gracefully', () => {
      const context = createTestContext();
      
      // Test with maximum values
      expect(() => {
        getElevationShadow(5, {
          ...context,
          level: 5,
          variant: 'dramatic',
          size: 'xl'
        });
      }).not.toThrow();
      
      // Test with minimum values
      expect(() => {
        getElevationShadow(0, {
          ...context,
          level: 0,
          variant: 'subtle',
          size: 'xs'
        });
      }).not.toThrow();
    });
  });

  // ============================================================================
  // PERFORMANCE TESTS
  // ============================================================================

  describe('Performance Tests', () => {
    it('should generate shadows efficiently', () => {
      const context = createTestContext();
      const iterations = 1000;
      
      const startTime = performance.now();
      
      for (let i = 0; i < iterations; i++) {
        getElevationShadow(2, context);
      }
      
      const endTime = performance.now();
      const avgTime = (endTime - startTime) / iterations;
      
      // Should be fast (less than 1ms per call on average)
      expect(avgTime).toBeLessThan(1);
    });

    it('should cache results when appropriate', () => {
      const { result } = renderHook(() => useElevation());
      const context = createTestContext();
      
      // Multiple calls with same parameters should be fast
      const startTime = performance.now();
      
      for (let i = 0; i < 100; i++) {
        result.current.getLevel(2, context);
      }
      
      const endTime = performance.now();
      const totalTime = endTime - startTime;
      
      // Should be very fast due to caching
      expect(totalTime).toBeLessThan(10);
    });
  });
});