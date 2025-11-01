/**
 * WCAG Compliance Engine
 * 
 * Comprehensive WCAG 2.1 AA/AAA validation with automated feedback loops
 * and intelligent color adjustment suggestions.
 */

import type { ThemeContext } from '../theme-contracts';
import { OKLCHColor, getContrastRatio, getRelativeLuminance, oklch } from '../color/oklch';

// ============================================================================
// WCAG VALIDATION TYPES
// ============================================================================

export interface WCAGValidationConfig {
  /** WCAG compliance level */
  level: 'AA' | 'AAA';
  /** Text size category */
  textSize: 'normal' | 'large';
  /** UI component type */
  componentType: 'text' | 'ui-component' | 'graphical-object';
  /** Whether to include non-text contrast requirements */
  includeNonText: boolean;
  /** Custom contrast ratio overrides */
  customRatios?: {
    minimum?: number;
    enhanced?: number;
  };
}

export interface ContrastRequirement {
  /** Minimum contrast ratio */
  minimum: number;
  /** Enhanced contrast ratio (AAA) */
  enhanced: number;
  /** Description of the requirement */
  description: string;
  /** WCAG success criterion reference */
  criterion: string;
}

export interface WCAGValidationResult {
  /** Whether the color pair passes validation */
  passes: boolean;
  /** Actual contrast ratio */
  actualRatio: number;
  /** Required contrast ratio */
  requiredRatio: number;
  /** WCAG level achieved */
  levelAchieved: 'AA' | 'AAA' | 'fail';
  /** Validation details */
  details: {
    criterion: string;
    description: string;
    recommendation?: string;
  };
  /** Suggested improvements */
  suggestions: ColorAdjustmentSuggestion[];
}

export interface ColorAdjustmentSuggestion {
  /** Type of adjustment */
  type: 'lighten' | 'darken' | 'increase-chroma' | 'decrease-chroma' | 'hue-shift';
  /** Adjustment amount */
  amount: number;
  /** Predicted contrast ratio after adjustment */
  predictedRatio: number;
  /** Adjusted color */
  adjustedColor: OKLCHColor;
  /** Confidence in the suggestion (0-1) */
  confidence: number;
  /** Description of the change */
  description: string;
}

export interface AccessibilityContext {
  /** User's accessibility preferences */
  preferences: {
    highContrast: boolean;
    reducedMotion: boolean;
    largeText: boolean;
    colorBlindness?: 'protanopia' | 'deuteranopia' | 'tritanopia' | 'achromatopsia';
  };
  /** Environmental factors */
  environment: {
    ambientLight: 'low' | 'normal' | 'bright';
    screenType: 'mobile' | 'desktop' | 'tv' | 'print';
    viewingDistance: 'close' | 'normal' | 'far';
  };
}

export interface ComprehensiveValidationReport {
  /** Overall compliance status */
  overallCompliance: 'AA' | 'AAA' | 'fail';
  /** Individual validation results */
  results: Map<string, WCAGValidationResult>;
  /** Critical issues that must be fixed */
  criticalIssues: string[];
  /** Warnings that should be addressed */
  warnings: string[];
  /** Performance impact of suggested changes */
  performanceImpact: 'low' | 'medium' | 'high';
  /** Automated fix suggestions */
  autoFixSuggestions: AutoFixSuggestion[];
}

export interface AutoFixSuggestion {
  /** Target color pair identifier */
  targetPair: string;
  /** Original colors */
  original: { foreground: OKLCHColor; background: OKLCHColor };
  /** Suggested colors */
  suggested: { foreground: OKLCHColor; background: OKLCHColor };
  /** Confidence in the fix (0-1) */
  confidence: number;
  /** Impact on brand consistency (0-1, lower is better) */
  brandImpact: number;
  /** Description of changes */
  description: string;
}

// ============================================================================
// WCAG VALIDATOR CLASS
// ============================================================================

export class WCAGValidator {
  private contrastRequirements: Map<string, ContrastRequirement> = new Map();
  private debugMode = false;
  private feedbackLoops: Map<string, (result: WCAGValidationResult) => void> = new Map();

  constructor() {
    this.initializeContrastRequirements();
  }

  /**
   * Validate a color pair against WCAG requirements
   */
  validateColorPair(
    foreground: OKLCHColor,
    background: OKLCHColor,
    config: WCAGValidationConfig
  ): WCAGValidationResult {
    const actualRatio = getContrastRatio(foreground, background);
    const requirement = this.getContrastRequirement(config);
    const requiredRatio = config.level === 'AAA' ? requirement.enhanced : requirement.minimum;
    
    const passes = actualRatio >= requiredRatio;
    const levelAchieved = this.determineLevelAchieved(actualRatio, requirement);
    
    const result: WCAGValidationResult = {
      passes,
      actualRatio,
      requiredRatio,
      levelAchieved,
      details: {
        criterion: requirement.criterion,
        description: requirement.description,
        recommendation: passes ? undefined : this.generateRecommendation(actualRatio, requiredRatio)
      },
      suggestions: passes ? [] : this.generateAdjustmentSuggestions(foreground, background, requiredRatio)
    };

    // Trigger feedback loops
    this.triggerFeedbackLoops(result);

    return result;
  }

  /**
   * Validate multiple color pairs comprehensively
   */
  validatePalette(
    colorPairs: Map<string, { foreground: OKLCHColor; background: OKLCHColor }>,
    config: WCAGValidationConfig,
    accessibilityContext?: AccessibilityContext
  ): ComprehensiveValidationReport {
    const results = new Map<string, WCAGValidationResult>();
    const criticalIssues: string[] = [];
    const warnings: string[] = [];
    const autoFixSuggestions: AutoFixSuggestion[] = [];

    // Adjust config based on accessibility context
    const adjustedConfig = this.adjustConfigForContext(config, accessibilityContext);

    // Validate each color pair
    colorPairs.forEach((pair, identifier) => {
      const result = this.validateColorPair(pair.foreground, pair.background, adjustedConfig);
      results.set(identifier, result);

      if (!result.passes) {
        if (result.actualRatio < 3) {
          criticalIssues.push(`Critical contrast failure for ${identifier}: ${result.actualRatio.toFixed(2)}`);
        } else {
          warnings.push(`Contrast warning for ${identifier}: ${result.actualRatio.toFixed(2)} (required: ${result.requiredRatio})`);
        }

        // Generate auto-fix suggestion
        const autoFix = this.generateAutoFix(identifier, pair, result);
        if (autoFix) {
          autoFixSuggestions.push(autoFix);
        }
      }
    });

    // Determine overall compliance
    const overallCompliance = this.determineOverallCompliance(results, adjustedConfig.level);

    return {
      overallCompliance,
      results,
      criticalIssues,
      warnings,
      performanceImpact: this.assessPerformanceImpact(autoFixSuggestions),
      autoFixSuggestions
    };
  }

  /**
   * Generate intelligent color adjustment suggestions
   */
  generateAdjustmentSuggestions(
    foreground: OKLCHColor,
    background: OKLCHColor,
    targetRatio: number
  ): ColorAdjustmentSuggestion[] {
    const suggestions: ColorAdjustmentSuggestion[] = [];
    const currentRatio = getContrastRatio(foreground, background);
    
    if (currentRatio >= targetRatio) {
      return suggestions;
    }

    const backgroundLuminance = getRelativeLuminance(background);
    const foregroundLuminance = getRelativeLuminance(foreground);

    // Strategy 1: Adjust foreground lightness
    const lightnessAdjustments = this.calculateLightnessAdjustments(
      foreground, 
      background, 
      targetRatio,
      backgroundLuminance > 0.5 ? 'darken' : 'lighten'
    );
    suggestions.push(...lightnessAdjustments);

    // Strategy 2: Adjust background lightness (if foreground adjustment isn't sufficient)
    if (suggestions.length === 0 || suggestions[0].predictedRatio < targetRatio) {
      const backgroundAdjustments = this.calculateLightnessAdjustments(
        background,
        foreground,
        targetRatio,
        backgroundLuminance > 0.5 ? 'lighten' : 'darken',
        true
      );
      suggestions.push(...backgroundAdjustments);
    }

    // Strategy 3: Reduce chroma for better readability
    const chromaReduction = this.calculateChromaAdjustment(foreground, background, targetRatio);
    if (chromaReduction) {
      suggestions.push(chromaReduction);
    }

    // Sort by confidence and predicted effectiveness
    return suggestions
      .sort((a, b) => b.confidence - a.confidence)
      .slice(0, 3); // Return top 3 suggestions
  }

  /**
   * Apply automated fixes to a color palette
   */
  applyAutomaticFixes(
    colorPairs: Map<string, { foreground: OKLCHColor; background: OKLCHColor }>,
    report: ComprehensiveValidationReport,
    options: {
      maxBrandImpact: number;
      minConfidence: number;
      preserveHue: boolean;
    } = { maxBrandImpact: 0.3, minConfidence: 0.7, preserveHue: true }
  ): Map<string, { foreground: OKLCHColor; background: OKLCHColor }> {
    const fixedPairs = new Map(colorPairs);

    report.autoFixSuggestions
      .filter(suggestion => 
        suggestion.confidence >= options.minConfidence &&
        suggestion.brandImpact <= options.maxBrandImpact
      )
      .forEach(suggestion => {
        fixedPairs.set(suggestion.targetPair, suggestion.suggested);
      });

    return fixedPairs;
  }

  /**
   * Register a feedback loop for continuous improvement
   */
  registerFeedbackLoop(
    identifier: string,
    callback: (result: WCAGValidationResult) => void
  ): void {
    this.feedbackLoops.set(identifier, callback);
  }

  /**
   * Simulate color blindness effects on validation
   */
  validateWithColorBlindness(
    foreground: OKLCHColor,
    background: OKLCHColor,
    config: WCAGValidationConfig,
    colorBlindnessType: 'protanopia' | 'deuteranopia' | 'tritanopia' | 'achromatopsia'
  ): WCAGValidationResult {
    const simulatedForeground = this.simulateColorBlindness(foreground, colorBlindnessType);
    const simulatedBackground = this.simulateColorBlindness(background, colorBlindnessType);
    
    return this.validateColorPair(simulatedForeground, simulatedBackground, config);
  }

  // ============================================================================
  // PRIVATE METHODS
  // ============================================================================

  private initializeContrastRequirements(): void {
    // Text contrast requirements
    this.contrastRequirements.set('text-normal', {
      minimum: 4.5,
      enhanced: 7,
      description: 'Normal text contrast',
      criterion: 'WCAG 2.1 SC 1.4.3 & 1.4.6'
    });

    this.contrastRequirements.set('text-large', {
      minimum: 3,
      enhanced: 4.5,
      description: 'Large text contrast (18pt+ or 14pt+ bold)',
      criterion: 'WCAG 2.1 SC 1.4.3 & 1.4.6'
    });

    // UI component contrast requirements
    this.contrastRequirements.set('ui-component', {
      minimum: 3,
      enhanced: 4.5,
      description: 'UI component contrast',
      criterion: 'WCAG 2.1 SC 1.4.11'
    });

    // Graphical object requirements
    this.contrastRequirements.set('graphical-object', {
      minimum: 3,
      enhanced: 4.5,
      description: 'Graphical object contrast',
      criterion: 'WCAG 2.1 SC 1.4.11'
    });
  }

  private getContrastRequirement(config: WCAGValidationConfig): ContrastRequirement {
    let key = config.componentType;
    if (config.componentType === 'text') {
      key = config.textSize === 'large' ? 'text-large' : 'text-normal';
    }

    const requirement = this.contrastRequirements.get(key);
    if (!requirement) {
      throw new Error(`Unknown contrast requirement: ${key}`);
    }

    // Apply custom ratios if provided
    if (config.customRatios) {
      return {
        ...requirement,
        minimum: config.customRatios.minimum || requirement.minimum,
        enhanced: config.customRatios.enhanced || requirement.enhanced
      };
    }

    return requirement;
  }

  private determineLevelAchieved(
    actualRatio: number,
    requirement: ContrastRequirement
  ): 'AA' | 'AAA' | 'fail' {
    if (actualRatio >= requirement.enhanced) return 'AAA';
    if (actualRatio >= requirement.minimum) return 'AA';
    return 'fail';
  }

  private generateRecommendation(actualRatio: number, requiredRatio: number): string {
    const deficit = requiredRatio - actualRatio;
    const percentageIncrease = (deficit / actualRatio) * 100;

    if (percentageIncrease > 50) {
      return 'Significant contrast improvement needed. Consider using a different color or adjusting both foreground and background.';
    } else if (percentageIncrease > 20) {
      return 'Moderate contrast adjustment needed. Try darkening text or lightening background.';
    } else {
      return 'Minor contrast adjustment needed. Small lightness changes should suffice.';
    }
  }

  private calculateLightnessAdjustments(
    color: OKLCHColor,
    otherColor: OKLCHColor,
    targetRatio: number,
    direction: 'lighten' | 'darken',
    isBackground: boolean = false
  ): ColorAdjustmentSuggestion[] {
    const suggestions: ColorAdjustmentSuggestion[] = [];
    const step = 0.05;
    const maxSteps = 10;

    for (let i = 1; i <= maxSteps; i++) {
      const adjustment = step * i;
      const newLightness = direction === 'lighten' 
        ? Math.min(1, color.l + adjustment)
        : Math.max(0, color.l - adjustment);

      const adjustedColor: OKLCHColor = { ...color, l: newLightness };
      const predictedRatio = isBackground 
        ? getContrastRatio(otherColor, adjustedColor)
        : getContrastRatio(adjustedColor, otherColor);

      if (predictedRatio >= targetRatio) {
        suggestions.push({
          type: direction,
          amount: adjustment,
          predictedRatio,
          adjustedColor,
          confidence: Math.max(0.5, 1 - (adjustment / 0.5)), // Higher confidence for smaller changes
          description: `${direction === 'lighten' ? 'Lighten' : 'Darken'} by ${(adjustment * 100).toFixed(1)}%`
        });
        break;
      }
    }

    return suggestions;
  }

  private calculateChromaAdjustment(
    foreground: OKLCHColor,
    background: OKLCHColor,
    targetRatio: number
  ): ColorAdjustmentSuggestion | null {
    const reducedChroma = Math.max(0, foreground.c * 0.7);
    const adjustedColor: OKLCHColor = { ...foreground, c: reducedChroma };
    const predictedRatio = getContrastRatio(adjustedColor, background);

    if (predictedRatio > getContrastRatio(foreground, background)) {
      return {
        type: 'decrease-chroma',
        amount: foreground.c - reducedChroma,
        predictedRatio,
        adjustedColor,
        confidence: 0.6,
        description: 'Reduce color saturation for better readability'
      };
    }

    return null;
  }

  private generateAutoFix(
    identifier: string,
    pair: { foreground: OKLCHColor; background: OKLCHColor },
    result: WCAGValidationResult
  ): AutoFixSuggestion | null {
    if (result.suggestions.length === 0) return null;

    const bestSuggestion = result.suggestions[0];
    const isBackgroundAdjustment = identifier.includes('background');

    const suggested = {
      foreground: isBackgroundAdjustment ? pair.foreground : bestSuggestion.adjustedColor,
      background: isBackgroundAdjustment ? bestSuggestion.adjustedColor : pair.background
    };

    // Calculate brand impact (how much the color changes)
    const originalColor = isBackgroundAdjustment ? pair.background : pair.foreground;
    const brandImpact = this.calculateBrandImpact(originalColor, bestSuggestion.adjustedColor);

    return {
      targetPair: identifier,
      original: pair,
      suggested,
      confidence: bestSuggestion.confidence,
      brandImpact,
      description: `Auto-fix: ${bestSuggestion.description}`
    };
  }

  private calculateBrandImpact(original: OKLCHColor, adjusted: OKLCHColor): number {
    const lightnessChange = Math.abs(original.l - adjusted.l);
    const chromaChange = Math.abs(original.c - adjusted.c);
    const hueChange = Math.min(
      Math.abs(original.h - adjusted.h),
      360 - Math.abs(original.h - adjusted.h)
    ) / 360;

    // Weight the changes (lightness changes are less impactful than hue changes)
    return (lightnessChange * 0.3) + (chromaChange * 0.4) + (hueChange * 0.3);
  }

  private adjustConfigForContext(
    config: WCAGValidationConfig,
    context?: AccessibilityContext
  ): WCAGValidationConfig {
    if (!context) return config;

    const adjustedConfig = { ...config };

    // Increase requirements for high contrast preference
    if (context.preferences.highContrast) {
      adjustedConfig.level = 'AAA';
    }

    // Adjust for large text preference
    if (context.preferences.largeText) {
      adjustedConfig.textSize = 'large';
    }

    // Adjust for environmental factors
    if (context.environment.ambientLight === 'bright') {
      adjustedConfig.customRatios = {
        minimum: (config.customRatios?.minimum || 4.5) * 1.2,
        enhanced: (config.customRatios?.enhanced || 7) * 1.2
      };
    }

    return adjustedConfig;
  }

  private determineOverallCompliance(
    results: Map<string, WCAGValidationResult>,
    targetLevel: 'AA' | 'AAA'
  ): 'AA' | 'AAA' | 'fail' {
    let hasAAA = true;
    let hasAA = true;

    for (const result of results.values()) {
      if (result.levelAchieved === 'fail') {
        return 'fail';
      }
      if (result.levelAchieved !== 'AAA') {
        hasAAA = false;
      }
      if (result.levelAchieved === 'fail') {
        hasAA = false;
      }
    }

    return hasAAA ? 'AAA' : (hasAA ? 'AA' : 'fail');
  }

  private assessPerformanceImpact(suggestions: AutoFixSuggestion[]): 'low' | 'medium' | 'high' {
    const totalChanges = suggestions.length;
    const significantChanges = suggestions.filter(s => s.brandImpact > 0.3).length;

    if (significantChanges > totalChanges * 0.5) return 'high';
    if (significantChanges > totalChanges * 0.2) return 'medium';
    return 'low';
  }

  private simulateColorBlindness(
    color: OKLCHColor,
    type: 'protanopia' | 'deuteranopia' | 'tritanopia' | 'achromatopsia'
  ): OKLCHColor {
    // Simplified color blindness simulation
    // In production, use a proper color vision simulation library
    switch (type) {
      case 'protanopia':
        return { ...color, h: color.h > 180 ? color.h : color.h + 30 };
      case 'deuteranopia':
        return { ...color, h: color.h > 180 ? color.h - 20 : color.h + 20 };
      case 'tritanopia':
        return { ...color, h: color.h > 240 ? color.h - 40 : color.h };
      case 'achromatopsia':
        return { ...color, c: 0 };
      default:
        return color;
    }
  }

  private triggerFeedbackLoops(result: WCAGValidationResult): void {
    this.feedbackLoops.forEach(callback => {
      try {
        callback(result);
      } catch (error) {
        if (this.debugMode) {
          console.error('Feedback loop error:', error);
        }
      }
    });
  }

  /**
   * Enable debug mode
   */
  enableDebug(enabled: boolean): void {
    this.debugMode = enabled;
  }
}

// ============================================================================
// EXPORTS
// ============================================================================

export const wcagValidator = new WCAGValidator();

// Preset validation configurations
export const VALIDATION_PRESETS = {
  strict: {
    level: 'AAA' as const,
    textSize: 'normal' as const,
    componentType: 'text' as const,
    includeNonText: true
  },
  
  standard: {
    level: 'AA' as const,
    textSize: 'normal' as const,
    componentType: 'text' as const,
    includeNonText: true
  },
  
  relaxed: {
    level: 'AA' as const,
    textSize: 'large' as const,
    componentType: 'text' as const,
    includeNonText: false
  }
} as const;