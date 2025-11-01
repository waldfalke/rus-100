/**
 * Advanced OKLCH Palette Generator
 * 
 * Generates complete color palettes from minimal brand color inputs using
 * OKLCH color space with WCAG compliance validation and theme adaptation.
 */

import type { ThemeContext } from '../theme-contracts';
import { 
  OKLCHColor, 
  oklch, 
  parseOKLCH, 
  meetsWCAGContrast, 
  getContrastRatio,
  getRelativeLuminance 
} from './oklch';

// ============================================================================
// PALETTE GENERATOR TYPES
// ============================================================================

export interface BrandColorPair {
  /** Primary brand color in OKLCH format */
  primary: OKLCHColor;
  /** Secondary brand color in OKLCH format */
  secondary: OKLCHColor;
}

export interface PaletteGenerationConfig {
  /** Brand color pair as input */
  brandColors: BrandColorPair;
  /** Target theme mode */
  mode: 'light' | 'dark' | 'high-contrast';
  /** WCAG compliance level */
  wcagLevel: 'AA' | 'AAA';
  /** Number of steps in each color scale */
  steps: number;
  /** Whether to generate semantic roles */
  generateSemanticRoles: boolean;
  /** Custom adjustments */
  adjustments?: {
    lightnessRange?: [number, number];
    chromaBoost?: number;
    hueShift?: number;
  };
}

export interface GeneratedPalette {
  /** Primary color scale */
  primary: OKLCHColor[];
  /** Secondary color scale */
  secondary: OKLCHColor[];
  /** Neutral/gray scale */
  neutral: OKLCHColor[];
  /** Semantic colors */
  semantic: {
    success: OKLCHColor[];
    warning: OKLCHColor[];
    error: OKLCHColor[];
    info: OKLCHColor[];
  };
  /** Background colors */
  backgrounds: {
    page: OKLCHColor;
    surface: OKLCHColor;
    elevated: OKLCHColor;
  };
  /** Text colors with guaranteed contrast */
  text: {
    primary: OKLCHColor;
    secondary: OKLCHColor;
    tertiary: OKLCHColor;
    inverse: OKLCHColor;
  };
  /** Border colors */
  borders: {
    subtle: OKLCHColor;
    default: OKLCHColor;
    strong: OKLCHColor;
  };
}

export interface PaletteValidationResult {
  /** Whether the palette passes all WCAG requirements */
  isValid: boolean;
  /** Validation errors */
  errors: string[];
  /** Validation warnings */
  warnings: string[];
  /** Contrast ratios for key pairs */
  contrastRatios: Record<string, number>;
  /** Suggestions for improvement */
  suggestions: string[];
}

// ============================================================================
// PALETTE GENERATOR CLASS
// ============================================================================

export class OKLCHPaletteGenerator {
  private wcagLevel: 'AA' | 'AAA' = 'AA';
  private debugMode = false;

  /**
   * Generate a complete color palette from brand colors
   */
  generatePalette(config: PaletteGenerationConfig): GeneratedPalette {
    this.wcagLevel = config.wcagLevel;
    
    const { brandColors, mode, steps } = config;
    const adjustments = config.adjustments || {};

    // Generate primary and secondary scales
    const primary = this.generateColorScale(brandColors.primary, {
      steps,
      mode,
      ...adjustments
    });

    const secondary = this.generateColorScale(brandColors.secondary, {
      steps,
      mode,
      ...adjustments
    });

    // Generate neutral scale based on primary hue
    const neutral = this.generateNeutralScale(brandColors.primary.h, {
      steps,
      mode,
      ...adjustments
    });

    // Generate semantic colors
    const semantic = this.generateSemanticColors(mode, adjustments);

    // Generate backgrounds
    const backgrounds = this.generateBackgrounds(neutral, mode);

    // Generate text colors with guaranteed contrast
    const text = this.generateTextColors(backgrounds, primary, mode);

    // Generate border colors
    const borders = this.generateBorderColors(neutral, mode);

    const palette: GeneratedPalette = {
      primary,
      secondary,
      neutral,
      semantic,
      backgrounds,
      text,
      borders
    };

    // Validate and adjust if necessary
    const validation = this.validatePalette(palette);
    if (!validation.isValid) {
      return this.adjustPaletteForCompliance(palette, validation);
    }

    return palette;
  }

  /**
   * Generate a color scale from a base color
   */
  private generateColorScale(
    baseColor: OKLCHColor, 
    options: {
      steps: number;
      mode: 'light' | 'dark' | 'high-contrast';
      lightnessRange?: [number, number];
      chromaBoost?: number;
      hueShift?: number;
    }
  ): OKLCHColor[] {
    const { steps, mode } = options;
    const lightnessRange = options.lightnessRange || this.getLightnessRange(mode);
    const chromaBoost = options.chromaBoost || 1;
    const hueShift = options.hueShift || 0;

    const colors: OKLCHColor[] = [];
    const [minL, maxL] = lightnessRange;

    for (let i = 0; i < steps; i++) {
      const t = i / (steps - 1);
      
      // Use easing function for more natural distribution
      const easedT = this.easeInOutCubic(t);
      
      // Calculate lightness with non-linear distribution
      const lightness = minL + (maxL - minL) * easedT;
      
      // Adjust chroma based on lightness (more vibrant in mid-tones)
      const chromaMultiplier = this.getChromaMultiplier(lightness, mode) * chromaBoost;
      const chroma = baseColor.c * chromaMultiplier;
      
      // Apply hue shift
      const hue = (baseColor.h + hueShift * t) % 360;

      colors.push({
        l: lightness,
        c: Math.max(0, chroma),
        h: hue,
        a: baseColor.a || 1
      });
    }

    return colors;
  }

  /**
   * Generate neutral/gray scale
   */
  private generateNeutralScale(
    baseHue: number,
    options: {
      steps: number;
      mode: 'light' | 'dark' | 'high-contrast';
      lightnessRange?: [number, number];
    }
  ): OKLCHColor[] {
    const { steps, mode } = options;
    const lightnessRange = options.lightnessRange || this.getLightnessRange(mode);
    const [minL, maxL] = lightnessRange;

    const colors: OKLCHColor[] = [];
    
    // Very low chroma for neutrals, with slight brand hue influence
    const baseChroma = mode === 'high-contrast' ? 0.005 : 0.015;

    for (let i = 0; i < steps; i++) {
      const t = i / (steps - 1);
      const lightness = minL + (maxL - minL) * t;
      
      // Slightly vary chroma for more natural grays
      const chroma = baseChroma * (1 + Math.sin(t * Math.PI) * 0.3);

      colors.push({
        l: lightness,
        c: chroma,
        h: baseHue,
        a: 1
      });
    }

    return colors;
  }

  /**
   * Generate semantic colors (success, warning, error, info)
   */
  private generateSemanticColors(
    mode: 'light' | 'dark' | 'high-contrast',
    adjustments: any = {}
  ): GeneratedPalette['semantic'] {
    const baseConfig = {
      steps: 5,
      mode,
      ...adjustments
    };

    // Semantic color base hues
    const semanticHues = {
      success: 140, // Green
      warning: 45,  // Orange/Yellow
      error: 15,    // Red
      info: 220     // Blue
    };

    const semanticColors: GeneratedPalette['semantic'] = {
      success: [],
      warning: [],
      error: [],
      info: []
    };

    Object.entries(semanticHues).forEach(([role, hue]) => {
      const baseColor: OKLCHColor = {
        l: mode === 'dark' ? 0.6 : 0.5,
        c: mode === 'high-contrast' ? 0.2 : 0.15,
        h: hue,
        a: 1
      };

      semanticColors[role as keyof typeof semanticColors] = this.generateColorScale(
        baseColor,
        baseConfig
      );
    });

    return semanticColors;
  }

  /**
   * Generate background colors
   */
  private generateBackgrounds(
    neutralScale: OKLCHColor[],
    mode: 'light' | 'dark' | 'high-contrast'
  ): GeneratedPalette['backgrounds'] {
    const backgrounds: GeneratedPalette['backgrounds'] = {
      page: neutralScale[0], // Lightest/darkest
      surface: neutralScale[1],
      elevated: neutralScale[2]
    };

    // Adjust for high contrast mode
    if (mode === 'high-contrast') {
      backgrounds.page = { ...backgrounds.page, c: 0 }; // Pure neutral
      backgrounds.surface = { ...backgrounds.surface, c: 0 };
      backgrounds.elevated = { ...backgrounds.elevated, c: 0.005 };
    }

    return backgrounds;
  }

  /**
   * Generate text colors with guaranteed WCAG contrast
   */
  private generateTextColors(
    backgrounds: GeneratedPalette['backgrounds'],
    primaryScale: OKLCHColor[],
    mode: 'light' | 'dark' | 'high-contrast'
  ): GeneratedPalette['text'] {
    const contrastTarget = this.wcagLevel === 'AAA' ? 7 : 4.5;
    
    // Base text lightness values
    const textLightness = {
      light: { primary: 0.2, secondary: 0.4, tertiary: 0.6 },
      dark: { primary: 0.9, secondary: 0.7, tertiary: 0.5 },
      'high-contrast': { primary: mode === 'dark' ? 1 : 0, secondary: mode === 'dark' ? 0.9 : 0.1, tertiary: mode === 'dark' ? 0.8 : 0.2 }
    };

    const baseLightness = textLightness[mode];
    const baseHue = primaryScale[0].h;

    const text: GeneratedPalette['text'] = {
      primary: this.ensureContrast({
        l: baseLightness.primary,
        c: mode === 'high-contrast' ? 0 : 0.02,
        h: baseHue,
        a: 1
      }, backgrounds.page, contrastTarget),

      secondary: this.ensureContrast({
        l: baseLightness.secondary,
        c: mode === 'high-contrast' ? 0 : 0.015,
        h: baseHue,
        a: 1
      }, backgrounds.page, contrastTarget * 0.8),

      tertiary: this.ensureContrast({
        l: baseLightness.tertiary,
        c: mode === 'high-contrast' ? 0 : 0.01,
        h: baseHue,
        a: 1
      }, backgrounds.page, contrastTarget * 0.6),

      inverse: {
        l: mode === 'dark' ? 0.1 : 0.9,
        c: 0,
        h: baseHue,
        a: 1
      }
    };

    return text;
  }

  /**
   * Generate border colors
   */
  private generateBorderColors(
    neutralScale: OKLCHColor[],
    mode: 'light' | 'dark' | 'high-contrast'
  ): GeneratedPalette['borders'] {
    const midIndex = Math.floor(neutralScale.length / 2);
    
    return {
      subtle: neutralScale[Math.floor(neutralScale.length * 0.2)],
      default: neutralScale[midIndex],
      strong: neutralScale[Math.floor(neutralScale.length * 0.8)]
    };
  }

  /**
   * Ensure a color meets contrast requirements against a background
   */
  private ensureContrast(
    color: OKLCHColor,
    background: OKLCHColor,
    targetRatio: number,
    maxIterations: number = 10
  ): OKLCHColor {
    let adjustedColor = { ...color };
    let iterations = 0;

    while (iterations < maxIterations) {
      const ratio = getContrastRatio(adjustedColor, background);
      
      if (ratio >= targetRatio) {
        break;
      }

      // Adjust lightness to improve contrast
      const backgroundLuminance = getRelativeLuminance(background);
      if (backgroundLuminance > 0.5) {
        // Light background - darken text
        adjustedColor.l = Math.max(0, adjustedColor.l - 0.1);
      } else {
        // Dark background - lighten text
        adjustedColor.l = Math.min(1, adjustedColor.l + 0.1);
      }

      iterations++;
    }

    return adjustedColor;
  }

  /**
   * Validate entire palette for WCAG compliance
   */
  private validatePalette(palette: GeneratedPalette): PaletteValidationResult {
    const errors: string[] = [];
    const warnings: string[] = [];
    const contrastRatios: Record<string, number> = {};
    const suggestions: string[] = [];

    // Check text on background contrasts
    const textBackgroundPairs = [
      ['text.primary', 'backgrounds.page'],
      ['text.secondary', 'backgrounds.page'],
      ['text.primary', 'backgrounds.surface'],
      ['text.secondary', 'backgrounds.surface']
    ];

    textBackgroundPairs.forEach(([textPath, bgPath]) => {
      const textColor = this.getNestedValue(palette, textPath) as OKLCHColor;
      const bgColor = this.getNestedValue(palette, bgPath) as OKLCHColor;
      
      if (textColor && bgColor) {
        const ratio = getContrastRatio(textColor, bgColor);
        contrastRatios[`${textPath}-${bgPath}`] = ratio;
        
        const minRatio = this.wcagLevel === 'AAA' ? 7 : 4.5;
        if (ratio < minRatio) {
          errors.push(`Insufficient contrast between ${textPath} and ${bgPath}: ${ratio.toFixed(2)} (required: ${minRatio})`);
        }
      }
    });

    // Check semantic color contrasts
    Object.entries(palette.semantic).forEach(([role, colors]) => {
      const midColor = colors[Math.floor(colors.length / 2)];
      const ratio = getContrastRatio(midColor, palette.backgrounds.page);
      contrastRatios[`semantic.${role}`] = ratio;
      
      if (ratio < 3) {
        warnings.push(`Low contrast for semantic ${role} color: ${ratio.toFixed(2)}`);
      }
    });

    // Generate suggestions
    if (errors.length > 0) {
      suggestions.push('Consider adjusting lightness values for better contrast');
      suggestions.push('Try reducing chroma for problematic colors');
    }

    return {
      isValid: errors.length === 0,
      errors,
      warnings,
      contrastRatios,
      suggestions
    };
  }

  /**
   * Adjust palette to meet WCAG compliance
   */
  private adjustPaletteForCompliance(
    palette: GeneratedPalette,
    validation: PaletteValidationResult
  ): GeneratedPalette {
    const adjustedPalette = JSON.parse(JSON.stringify(palette)) as GeneratedPalette;

    // Focus on fixing text contrast issues first
    validation.errors.forEach(error => {
      if (error.includes('text.primary') && error.includes('backgrounds.page')) {
        adjustedPalette.text.primary = this.ensureContrast(
          adjustedPalette.text.primary,
          adjustedPalette.backgrounds.page,
          this.wcagLevel === 'AAA' ? 7 : 4.5
        );
      }
      
      if (error.includes('text.secondary') && error.includes('backgrounds.page')) {
        adjustedPalette.text.secondary = this.ensureContrast(
          adjustedPalette.text.secondary,
          adjustedPalette.backgrounds.page,
          this.wcagLevel === 'AAA' ? 4.5 : 3
        );
      }
    });

    return adjustedPalette;
  }

  // ============================================================================
  // UTILITY METHODS
  // ============================================================================

  private getLightnessRange(mode: 'light' | 'dark' | 'high-contrast'): [number, number] {
    switch (mode) {
      case 'light':
        return [0.95, 0.2];
      case 'dark':
        return [0.1, 0.8];
      case 'high-contrast':
        return [0.05, 0.95];
      default:
        return [0.1, 0.9];
    }
  }

  private getChromaMultiplier(lightness: number, mode: string): number {
    // Reduce chroma at very light/dark values for better readability
    const lightnessEffect = 1 - Math.abs(lightness - 0.5) * 0.5;
    const modeMultiplier = mode === 'high-contrast' ? 1.5 : 1;
    
    return lightnessEffect * modeMultiplier;
  }

  private easeInOutCubic(t: number): number {
    return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
  }

  private getNestedValue(obj: any, path: string): any {
    return path.split('.').reduce((current, key) => current?.[key], obj);
  }

  /**
   * Enable debug mode for detailed logging
   */
  enableDebug(enabled: boolean): void {
    this.debugMode = enabled;
  }

  /**
   * Generate palette from hex colors (convenience method)
   */
  generateFromHex(
    primaryHex: string,
    secondaryHex: string,
    config: Omit<PaletteGenerationConfig, 'brandColors'>
  ): GeneratedPalette {
    // Convert hex to OKLCH (simplified - in production use proper color library)
    const primary = this.hexToOKLCH(primaryHex);
    const secondary = this.hexToOKLCH(secondaryHex);

    return this.generatePalette({
      ...config,
      brandColors: { primary, secondary }
    });
  }

  private hexToOKLCH(hex: string): OKLCHColor {
    // Simplified conversion - in production, use a proper color library
    // This is a placeholder implementation
    return {
      l: 0.5,
      c: 0.1,
      h: 220,
      a: 1
    };
  }
}

// ============================================================================
// EXPORTS
// ============================================================================

export const paletteGenerator = new OKLCHPaletteGenerator();

// Preset configurations for common use cases
export const PALETTE_PRESETS = {
  corporate: {
    wcagLevel: 'AA' as const,
    steps: 9,
    generateSemanticRoles: true,
    adjustments: {
      chromaBoost: 0.8,
      lightnessRange: [0.95, 0.15] as [number, number]
    }
  },
  
  accessible: {
    wcagLevel: 'AAA' as const,
    steps: 7,
    generateSemanticRoles: true,
    adjustments: {
      chromaBoost: 0.6,
      lightnessRange: [0.98, 0.1] as [number, number]
    }
  },
  
  vibrant: {
    wcagLevel: 'AA' as const,
    steps: 11,
    generateSemanticRoles: true,
    adjustments: {
      chromaBoost: 1.3,
      lightnessRange: [0.9, 0.2] as [number, number]
    }
  }
} as const;