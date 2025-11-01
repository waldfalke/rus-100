/**
 * Property-Based Tests for OKLCH Palette Generation
 * 
 * Tests palette generation functions using property-based testing
 * to validate contrast rules, color harmony, and WCAG compliance.
 */

import { describe, it, expect } from '@jest/globals';
import fc from 'fast-check';
import { OKLCHPaletteGenerator, type PaletteGenerationConfig, type BrandColorPair } from '../../lib/color/palette-generator';
import { wcagValidator, VALIDATION_PRESETS } from '../../lib/accessibility/wcag-validator';
import { oklch, getContrastRatio, type OKLCHColor } from '../../lib/color/oklch';

// ============================================================================
// PROPERTY-BASED TEST GENERATORS
// ============================================================================

// Generate valid OKLCH colors
const oklchColorArbitrary = fc.record({
  l: fc.float({ min: 0, max: 1 }),
  c: fc.float({ min: 0, max: 0.4 }),
  h: fc.float({ min: 0, max: 360 })
});

// Generate brand color pairs
const brandColorPairArbitrary = fc.record({
  primary: oklchColorArbitrary,
  secondary: oklchColorArbitrary
});

// Generate theme modes
const themeModeArbitrary = fc.constantFrom('light', 'dark', 'high-contrast');

// Generate palette configurations
const paletteConfigArbitrary = fc.record({
  steps: fc.integer({ min: 5, max: 11 }),
  contrastRatio: fc.float({ min: 1.5, max: 21 }),
  preserveChroma: fc.boolean(),
  harmonious: fc.boolean()
});

// ============================================================================
// PROPERTY-BASED TESTS
// ============================================================================

describe('OKLCH Palette Generation - Property-Based Tests', () => {
  const generator = new OKLCHPaletteGenerator();

  describe('Color Scale Generation Properties', () => {
    it('should always generate the requested number of color steps', () => {
      fc.assert(fc.property(
        oklchColorArbitrary,
        fc.integer({ min: 3, max: 15 }),
        (baseColor, steps) => {
          const palette = generator.generatePalette({
            brandColors: { primary: baseColor, secondary: baseColor },
            mode: 'light',
            wcagLevel: 'AA',
            steps,
            generateSemanticRoles: false
          });
          expect(palette.primary).toHaveLength(steps);
          expect(palette.secondary).toHaveLength(steps);
        }
      ));
    });

    it('should maintain monotonic lightness progression in color scales', () => {
      fc.assert(fc.property(
        oklchColorArbitrary,
        fc.integer({ min: 5, max: 11 }),
        (baseColor, steps) => {
          const palette = generator.generatePalette({
            brandColors: { primary: baseColor, secondary: baseColor },
            mode: 'light',
            wcagLevel: 'AA',
            steps,
            generateSemanticRoles: false
          });
          
          // Check that lightness values are in ascending order for primary scale
          for (let i = 1; i < palette.primary.length; i++) {
            expect(palette.primary[i].l).toBeGreaterThanOrEqual(palette.primary[i - 1].l);
          }
        }
      ));
    });

    it('should preserve hue across color scale (within tolerance)', () => {
      fc.assert(fc.property(
        oklchColorArbitrary,
        fc.integer({ min: 5, max: 11 }),
        (baseColor, steps) => {
          const palette = generator.generatePalette({
            brandColors: { primary: baseColor, secondary: baseColor },
            mode: 'light',
            wcagLevel: 'AA',
            steps,
            generateSemanticRoles: false
          });
          const hueVariance = 15; // Allow 15 degree variance
          
          palette.primary.forEach(color => {
            const hueDiff = Math.abs(color.h - baseColor.h);
            const normalizedDiff = Math.min(hueDiff, 360 - hueDiff);
            expect(normalizedDiff).toBeLessThanOrEqual(hueVariance);
          });
        }
      ));
    });

    it('should generate colors within valid OKLCH bounds', () => {
      fc.assert(fc.property(
        oklchColorArbitrary,
        fc.integer({ min: 3, max: 15 }),
        (baseColor, steps) => {
          const palette = generator.generatePalette({
            brandColors: { primary: baseColor, secondary: baseColor },
            mode: 'light',
            wcagLevel: 'AA',
            steps,
            generateSemanticRoles: false
          });
          
          palette.primary.forEach(color => {
            expect(color.l).toBeGreaterThanOrEqual(0);
            expect(color.l).toBeLessThanOrEqual(1);
            expect(color.c).toBeGreaterThanOrEqual(0);
            expect(color.c).toBeLessThanOrEqual(0.5); // Reasonable chroma limit
            expect(color.h).toBeGreaterThanOrEqual(0);
            expect(color.h).toBeLessThan(360);
          });
        }
      ));
    });
  });

  describe('Palette Generation Properties', () => {
    it('should generate palettes with all required semantic colors', () => {
      fc.assert(fc.property(
        brandColorPairArbitrary,
        themeModeArbitrary,
        (brandColors, mode) => {
          const palette = generator.generatePalette({
            brandColors,
            mode,
            wcagLevel: 'AA',
            steps: 9,
            generateSemanticRoles: true
          });
          
          // Check that all required semantic colors are present
          const requiredColors = [
            'success', 'warning', 'error', 'info'
          ];
          
          requiredColors.forEach(colorName => {
            expect(palette.semantic).toHaveProperty(colorName);
            expect(palette.semantic[colorName as keyof typeof palette.semantic]).toBeDefined();
          });
        }
      ));
    });

    it('should generate text colors with sufficient contrast', () => {
      fc.assert(fc.property(
        brandColorPairArbitrary,
        themeModeArbitrary,
        (brandColors, mode) => {
          const palette = generator.generatePalette({
            brandColors,
            mode,
            wcagLevel: 'AA',
            steps: 9,
            generateSemanticRoles: true
          });
          
          // Test text on background contrast
          const textColor = palette.text.primary;
          const backgroundColor = palette.backgrounds.page;
          const contrast = getContrastRatio(textColor, backgroundColor);
          
          expect(contrast).toBeGreaterThanOrEqual(4.5); // WCAG AA minimum
        }
      ));
    });

    it('should maintain brand color relationships in generated palette', () => {
      fc.assert(fc.property(
        brandColorPairArbitrary,
        themeModeArbitrary,
        (brandColors, mode) => {
          const palette = generator.generatePalette({
            brandColors,
            mode,
            wcagLevel: 'AA',
            steps: 9,
            generateSemanticRoles: true
          });
          
          const primaryGenerated = palette.primary[4]; // Middle color
          const secondaryGenerated = palette.secondary[4]; // Middle color
          
          // The generated colors should be related to the brand colors
          // (allowing for mode adaptations)
          const primaryHueDiff = Math.abs(primaryGenerated.h - brandColors.primary.h);
          const secondaryHueDiff = Math.abs(secondaryGenerated.h - brandColors.secondary.h);
          
          expect(Math.min(primaryHueDiff, 360 - primaryHueDiff)).toBeLessThanOrEqual(30);
          expect(Math.min(secondaryHueDiff, 360 - secondaryHueDiff)).toBeLessThanOrEqual(30);
        }
      ));
    });

    it('should adapt lightness appropriately for theme modes', () => {
      fc.assert(fc.property(
        brandColorPairArbitrary,
        (brandColors) => {
          const lightPalette = generator.generatePalette({
            brandColors,
            mode: 'light',
            wcagLevel: 'AA',
            steps: 9,
            generateSemanticRoles: true
          });
          const darkPalette = generator.generatePalette({
            brandColors,
            mode: 'dark',
            wcagLevel: 'AA',
            steps: 9,
            generateSemanticRoles: true
          });
          
          const lightBg = lightPalette.backgrounds.page;
          const darkBg = darkPalette.backgrounds.page;
          
          expect(lightBg.l).not.toBe(darkBg.l);
          
          const lightText = lightPalette.text.primary;
          const darkText = darkPalette.text.primary;
          
          // Light mode should have lighter text than dark mode
          expect(lightPalette.text.primary.l).toBeLessThan(darkPalette.text.primary.l);
        }
      ));
    });
  });

  describe('WCAG Compliance Properties', () => {
    it('should generate palettes that pass WCAG AA validation', () => {
      fc.assert(fc.property(
        brandColorPairArbitrary,
        themeModeArbitrary,
        (brandColors, mode) => {
          const palette = generator.generatePalette({
            brandColors,
            mode,
            wcagLevel: 'AA',
            steps: 9,
            generateSemanticRoles: true
          });
          
          // Test key color combinations
          const colorPairs = new Map([
            ['text-on-background', {
              foreground: palette.text.primary,
              background: palette.backgrounds.page
            }]
          ]);
          
          const report = wcagValidator.validatePalette(
            colorPairs,
            VALIDATION_PRESETS.standard
          );
          
          expect(report.overallCompliance).not.toBe('fail');
          expect(report.criticalIssues).toHaveLength(0);
        }
      ));
    });

    it('should generate high contrast palettes that pass WCAG AAA validation', () => {
      fc.assert(fc.property(
        brandColorPairArbitrary,
        (brandColors) => {
          const palette = generator.generatePalette({
            brandColors,
            mode: 'high-contrast',
            wcagLevel: 'AAA',
            steps: 9,
            generateSemanticRoles: true
          });
          
          const colorPairs = new Map([
            ['text-on-background', {
              foreground: palette.text.primary,
              background: palette.backgrounds.page
            }]
          ]);
          
          const report = wcagValidator.validatePalette(
            colorPairs,
            VALIDATION_PRESETS.strict
          );
          
          expect(report.overallCompliance).toBe('pass');
        }
      ));
    });

    it('should generate accessible semantic colors', () => {
      fc.assert(fc.property(
        brandColorPairArbitrary,
        themeModeArbitrary,
        (brandColors, mode) => {
          const palette = generator.generatePalette({
            brandColors,
            mode,
            wcagLevel: 'AA',
            steps: 9,
            generateSemanticRoles: true
          });
          
          // Test semantic color contrast
          const colorNames = ['success', 'warning', 'error', 'info'] as const;
          
          colorNames.forEach(colorName => {
            const semanticColorArray = palette.semantic[colorName];
            const semanticColor = semanticColorArray[Math.floor(semanticColorArray.length / 2)]; // Middle color
            const backgroundColor = palette.backgrounds.page;
            const contrast = getContrastRatio(semanticColor, backgroundColor);
            
            expect(contrast).toBeGreaterThanOrEqual(3.0); // Minimum for UI elements
          });
        }
      ));
    });

    it('should not throw errors during palette generation', () => {
      fc.assert(fc.property(
        brandColorPairArbitrary,
        themeModeArbitrary,
        (brandColors, mode) => {
          expect(() => {
            generator.generatePalette({
              brandColors,
              mode,
              wcagLevel: 'AA',
              steps: 9,
              generateSemanticRoles: true
            });
          }).not.toThrow();
        }
      ));
    });

    it('should generate deterministic palettes', () => {
      fc.assert(fc.property(
        brandColorPairArbitrary,
        themeModeArbitrary,
        (brandColors, mode) => {
          const palette1 = generator.generatePalette({
            brandColors,
            mode,
            wcagLevel: 'AA',
            steps: 9,
            generateSemanticRoles: true
          });
          const palette2 = generator.generatePalette({
            brandColors,
            mode,
            wcagLevel: 'AA',
            steps: 9,
            generateSemanticRoles: true
          });
          
          // Palettes should be identical for same inputs
          expect(palette1.primary).toEqual(palette2.primary);
          expect(palette1.secondary).toEqual(palette2.secondary);
        }
      ));
    });

    it('should handle edge cases gracefully', () => {
      // Test with extreme values
      expect(() => {
        generator.generatePalette({
          brandColors: {
            primary: { l: 0, c: 0, h: 0 },
            secondary: { l: 1, c: 0.4, h: 359 }
          },
          mode: 'light',
          wcagLevel: 'AA',
          steps: 3,
          generateSemanticRoles: false
        });
      }).not.toThrow();
    });

    it('should adapt lightness appropriately for theme modes', () => {
      fc.assert(fc.property(
        brandColorPairArbitrary,
        (brandColors) => {
          const lightPalette = generator.generatePalette({
            brandColors,
            mode: 'light',
            wcagLevel: 'AA',
            steps: 9,
            generateSemanticRoles: true
          });
          const darkPalette = generator.generatePalette({
            brandColors,
            mode: 'dark',
            wcagLevel: 'AA',
            steps: 9,
            generateSemanticRoles: true
          });
          
          const lightBg = lightPalette.backgrounds.page;
          const darkBg = darkPalette.backgrounds.page;
          
          // Light mode should have lighter background than dark mode
          expect(lightBg.l).toBeGreaterThan(darkBg.l);
        }
      ));
    });
  });

  describe('Color Harmony Properties', () => {
    it('should maintain color harmony in generated palettes', () => {
      fc.assert(fc.property(
        brandColorPairArbitrary,
        themeModeArbitrary,
        (brandColors, mode) => {
          const palette = generator.generatePalette({
            brandColors,
            mode,
            wcagLevel: 'AA',
            steps: 9,
            generateSemanticRoles: true
          });
          
          // Extract primary colors for harmony analysis
          const primaryScale = palette.primary;
          
          // Check that colors maintain reasonable hue relationships
          const hues = palette.primary.map(color => color.h);
          const hueSpread = Math.max(...hues) - Math.min(...hues);
          
          // For harmonious palettes, hue spread should be reasonable
          expect(hueSpread).toBeLessThanOrEqual(180);
        }
      ));
    });

    it('should generate consistent chroma levels within color families', () => {
      fc.assert(fc.property(
        brandColorPairArbitrary,
        themeModeArbitrary,
        (brandColors, mode) => {
          const palette = generator.generatePalette({
            brandColors,
            mode,
            wcagLevel: 'AA',
            steps: 9,
            generateSemanticRoles: true
          });
          
          // Check primary color scale chroma consistency
          const primaryScale = palette.primary;
          
          const chromaValues = palette.primary.map(color => color.c);
          const chromaVariance = Math.max(...chromaValues) - Math.min(...chromaValues);
          
          // Chroma should not vary too wildly within a color family
          expect(chromaVariance).toBeLessThanOrEqual(0.2);
        }
      ));
    });
  });

  describe('Performance Properties', () => {
    it('should generate palettes within reasonable time limits', () => {
      fc.assert(fc.property(
        brandColorPairArbitrary,
        themeModeArbitrary,
        (brandColors, mode) => {
          const startTime = performance.now();
          
          generator.generatePalette({
            brandColors,
            mode,
            wcagLevel: 'AA',
            steps: 9,
            generateSemanticRoles: true
          });
          
          const endTime = performance.now();
          const duration = endTime - startTime;
          
          // Palette generation should complete within 100ms
          expect(duration).toBeLessThan(100);
        }
      ));
    });

    it('should produce deterministic results for identical inputs', () => {
      fc.assert(fc.property(
        brandColorPairArbitrary,
        themeModeArbitrary,
        (brandColors, mode) => {
          const palette1 = generator.generatePalette({
            brandColors,
            mode,
            wcagLevel: 'AA',
            steps: 9,
            generateSemanticRoles: true
          });
          const palette2 = generator.generatePalette({
            brandColors,
            mode,
            wcagLevel: 'AA',
            steps: 9,
            generateSemanticRoles: true
          });
          
          // Results should be identical for same inputs
          expect(palette1).toEqual(palette2);
        }
      ));
    });
  });

  describe('Edge Cases and Robustness', () => {
    it('should handle extreme lightness values gracefully', () => {
      fc.assert(fc.property(
        fc.constantFrom(0, 1), // Extreme lightness values
        fc.float({ min: 0, max: 0.4 }),
        fc.float({ min: 0, max: 360 }),
        (l, c, h) => {
          const extremeColor: OKLCHColor = { l, c, h };
          const brandColors = { primary: extremeColor, secondary: extremeColor };
          
          expect(() => {
            generator.generatePalette({
              brandColors: { primary: extremeColor, secondary: extremeColor },
              mode: 'light',
              wcagLevel: 'AA',
              steps: 9,
              generateSemanticRoles: false
            });
          }).not.toThrow();
        }
      ));
    });

    it('should handle very low chroma colors', () => {
      fc.assert(fc.property(
        fc.float({ min: 0, max: 1 }),
        fc.constantFrom(0, 0.01), // Very low chroma
        fc.float({ min: 0, max: 360 }),
        (l, c, h) => {
          const lowChromaColor: OKLCHColor = { l, c, h };
          const brandColors = { primary: lowChromaColor, secondary: lowChromaColor };
          
          const palette = generator.generatePalette({
            brandColors: { primary: lowChromaColor, secondary: lowChromaColor },
            mode: 'light',
            wcagLevel: 'AA',
            steps: 9,
            generateSemanticRoles: false
          });
          
          // Should still generate a valid palette
          expect(palette.backgrounds.page).toBeDefined();
          expect(palette.text.primary).toBeDefined();
        }
      ));
    });

    it('should maintain valid CSS color strings in output', () => {
      fc.assert(fc.property(
        brandColorPairArbitrary,
        themeModeArbitrary,
        (brandColors, mode) => {
          const palette = generator.generatePalette({
            brandColors,
            mode,
            wcagLevel: 'AA',
            steps: 9,
            generateSemanticRoles: true
          });
          
          // Check that all color values are valid OKLCH objects
          const checkColorValue = (value: any) => {
            if (value && typeof value === 'object' && 'l' in value && 'c' in value && 'h' in value) {
              expect(value.l).toBeGreaterThanOrEqual(0);
              expect(value.l).toBeLessThanOrEqual(1);
              expect(value.c).toBeGreaterThanOrEqual(0);
              expect(value.h).toBeGreaterThanOrEqual(0);
              expect(value.h).toBeLessThan(360);
            } else if (Array.isArray(value)) {
              value.forEach(checkColorValue);
            } else if (typeof value === 'object') {
              Object.values(value).forEach(checkColorValue);
            }
          };
          
          checkColorValue(palette);
        }
      ));
    });
  });
});

// ============================================================================
// INTEGRATION TESTS WITH WCAG VALIDATOR
// ============================================================================

describe('Palette Generation + WCAG Validation Integration', () => {
  const generator = new OKLCHPaletteGenerator();

  it('should generate palettes that consistently pass validation', () => {
    fc.assert(fc.property(
      brandColorPairArbitrary,
      (brandColors) => {
        const palette = generator.generatePalette({
          brandColors,
          mode: 'light',
          wcagLevel: 'AA',
          steps: 9,
          generateSemanticRoles: true
        });
        
        // Create comprehensive color pair map for validation
        const colorPairs = new Map();
        
        // Add all text/background combinations
        Object.entries(palette.text).forEach(([textType, textColor]) => {
          colorPairs.set(`${textType}-on-background`, {
            foreground: textColor,
            background: palette.backgrounds.page
          });
        });
        
        const report = wcagValidator.validatePalette(
          colorPairs,
          VALIDATION_PRESETS.standard
        );
        
        // Should have minimal critical issues
        expect(report.criticalIssues.length).toBeLessThanOrEqual(1);
        
        // Auto-fix suggestions should be reasonable
        report.autoFixSuggestions.forEach(suggestion => {
          expect(suggestion.confidence).toBeGreaterThan(0.3);
          expect(suggestion.brandImpact).toBeLessThan(0.8);
        });
      }
    ));
  });
});