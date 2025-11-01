/**
 * Advanced context-aware token resolution system
 */

import type { ThemeContext, TokenContract } from '../theme-contracts';
import { performanceMonitor, TokenCache, memoize, debounce } from '../utils/performance';

// ============================================================================
// CONTEXT RESOLUTION TYPES
// ============================================================================

export interface ContextResolutionRule {
  /** Rule identifier */
  id: string;
  
  /** Rule priority (higher = more important) */
  priority: number;
  
  /** Condition to match context */
  condition: (context: ThemeContext) => boolean;
  
  /** Token path pattern to match */
  tokenPattern?: RegExp;
  
  /** Transformation to apply */
  transform: (value: any, context: ThemeContext) => any;
  
  /** Description of the rule */
  description: string;
}

export interface PlatformAdaptation {
  /** Target platform */
  platform: ThemeContext['platform'];
  
  /** Adaptations by token category */
  adaptations: {
    colors?: {
      lightnessAdjustment?: number;
      chromaMultiplier?: number;
      hueShift?: number;
    };
    spacing?: {
      baseMultiplier?: number;
      minTouchTarget?: number;
    };
    typography?: {
      sizeMultiplier?: number;
      weightAdjustment?: number;
      lineHeightMultiplier?: number;
    };
  };
}

export interface AccessibilityAdaptation {
  /** Accessibility feature */
  feature: keyof ThemeContext['accessibility'];
  
  /** Token transformations */
  transformations: {
    colors?: {
      contrastBoost?: number;
      saturationReduction?: number;
    };
    spacing?: {
      sizeIncrease?: number;
      minSpacing?: number;
    };
    typography?: {
      sizeIncrease?: number;
      weightIncrease?: number;
      lineHeightIncrease?: number;
    };
    motion?: {
      durationMultiplier?: number;
      easingOverride?: string;
    };
  };
}

// ============================================================================
// CONTEXT RESOLVER CLASS
// ============================================================================

export class ContextResolver {
  private rules: ContextResolutionRule[] = [];
  private platformAdaptations: Map<string, PlatformAdaptation> = new Map();
  private accessibilityAdaptations: Map<string, AccessibilityAdaptation> = new Map();
  private cache = new TokenCache<string, any>(1000, 5 * 60 * 1000); // 5 min TTL
  private debugEnabled = false;

  // Memoized rule matching for performance
  private getApplicableRulesMemo = memoize(
    (tokenPath: string, contextKey: string) => {
      const context = JSON.parse(contextKey) as ThemeContext;
      return this.rules.filter(rule => {
        // Check condition
        if (!rule.condition(context)) return false;
        
        // Check token pattern if specified
        if (rule.tokenPattern && !rule.tokenPattern.test(tokenPath)) return false;
        
        return true;
      });
    },
    (tokenPath, contextKey) => `${tokenPath}-${contextKey}`
  );

  // Debounced cache clearing for performance
  private debouncedCacheClear = debounce(() => {
    this.cache.clear();
  }, 100);
  
  constructor() {
    this.initializeDefaultRules();
    this.initializePlatformAdaptations();
    this.initializeAccessibilityAdaptations();
  }
  
  /**
   * Resolve a token value with context awareness
   */
  resolve<T = any>(
    tokenPath: string,
    baseValue: T,
    context: ThemeContext
  ): T {
    const startTime = performance.now();
    const cacheKey = `${tokenPath}-${JSON.stringify(context)}`;
    
    // Check cache first
    const cached = this.cache.get(cacheKey);
    if (cached !== undefined) {
      const endTime = performance.now();
      performanceMonitor.recordResolution(tokenPath, endTime - startTime, context, true);
      return cached;
    }

    if (this.debugEnabled) {
      console.log(`Resolving token ${tokenPath} for context:`, context);
    }

    let resolvedValue = baseValue;
    
    // Apply context resolution rules using memoized function
    const contextKey = JSON.stringify(context);
    const applicableRules = this.getApplicableRulesMemo(tokenPath, contextKey);
    
    for (const rule of applicableRules) {
      try {
        resolvedValue = rule.transform(resolvedValue, context);
        if (this.debugEnabled) {
          console.log(`Applied rule "${rule.id}" to token "${tokenPath}"`);
        }
      } catch (error) {
        console.warn(`Failed to apply rule "${rule.id}" to token "${tokenPath}":`, error);
      }
    }
    
    // Apply platform adaptations
    resolvedValue = this.applyPlatformAdaptations(
      tokenPath,
      resolvedValue,
      context
    );
    
    // Apply accessibility adaptations
    resolvedValue = this.applyAccessibilityAdaptations(
      tokenPath,
      resolvedValue,
      context
    );

    // Cache the result
    this.cache.set(cacheKey, resolvedValue);

    const endTime = performance.now();
    performanceMonitor.recordResolution(tokenPath, endTime - startTime, context, false);
    
    return resolvedValue;
  }
  
  /**
   * Add a custom resolution rule
   */
  addRule(rule: ContextResolutionRule): void {
    this.rules.push(rule);
    this.rules.sort((a, b) => b.priority - a.priority);
    
    // Clear memoization cache when rules change
    this.getApplicableRulesMemo = memoize(
      (tokenPath: string, contextKey: string) => {
        const context = JSON.parse(contextKey) as ThemeContext;
        return this.rules.filter(rule => {
          // Check condition
          if (!rule.condition(context)) return false;
          
          // Check token pattern if specified
          if (rule.tokenPattern && !rule.tokenPattern.test(tokenPath)) return false;
          
          return true;
        });
      },
      (tokenPath, contextKey) => `${tokenPath}-${contextKey}`
    );
    
    // Clear cache when rules change
    this.debouncedCacheClear();
  }
  
  /**
   * Remove a resolution rule
   */
  removeRule(ruleId: string): void {
    this.rules = this.rules.filter(rule => rule.id !== ruleId);
    
    // Clear caches when rules change
    this.getApplicableRulesMemo = memoize(
      (tokenPath: string, contextKey: string) => {
        const context = JSON.parse(contextKey) as ThemeContext;
        return this.rules.filter(rule => {
          // Check condition
          if (!rule.condition(context)) return false;
          
          // Check token pattern if specified
          if (rule.tokenPattern && !rule.tokenPattern.test(tokenPath)) return false;
          
          return true;
        });
      },
      (tokenPath, contextKey) => `${tokenPath}-${contextKey}`
    );
    
    this.debouncedCacheClear();
  }

  /**
   * Enable or disable debug logging
   */
  enableDebug(enabled: boolean): void {
    this.debugEnabled = enabled;
  }

  /**
   * Clear all caches
   */
  clearCache(): void {
    this.cache.clear();
  }

  /**
   * Get cache statistics
   */
  getCacheStats() {
    return this.cache.getStats();
  }

  /**
   * Get performance metrics
   */
  getPerformanceMetrics() {
    return performanceMonitor.getReport();
  }
  
  /**
   * Get applicable rules for a token and context
   */
  private getApplicableRules(
    tokenPath: string,
    context: ThemeContext
  ): ContextResolutionRule[] {
    return this.rules.filter(rule => {
      // Check condition
      if (!rule.condition(context)) return false;
      
      // Check token pattern if specified
      if (rule.tokenPattern && !rule.tokenPattern.test(tokenPath)) return false;
      
      return true;
    });
  }
  
  /**
   * Apply platform-specific adaptations
   */
  private applyPlatformAdaptations<T>(
    tokenPath: string,
    value: T,
    context: ThemeContext
  ): T {
    const adaptation = this.platformAdaptations.get(context.platform);
    if (!adaptation) return value;
    
    const tokenCategory = this.getTokenCategory(tokenPath);
    const categoryAdaptation = adaptation.adaptations[tokenCategory as keyof typeof adaptation.adaptations];
    
    if (!categoryAdaptation) return value;
    
    return this.applyAdaptationToValue(value, categoryAdaptation, tokenCategory);
  }
  
  /**
   * Apply accessibility adaptations
   */
  private applyAccessibilityAdaptations<T>(
    tokenPath: string,
    value: T,
    context: ThemeContext
  ): T {
    let adaptedValue = value;
    
    // Apply each relevant accessibility adaptation
    for (const [feature, enabled] of Object.entries(context.accessibility)) {
      if (!enabled) continue;
      
      const adaptation = this.accessibilityAdaptations.get(feature);
      if (!adaptation) continue;
      
      const tokenCategory = this.getTokenCategory(tokenPath);
      const transformation = adaptation.transformations[tokenCategory as keyof typeof adaptation.transformations];
      
      if (transformation) {
        adaptedValue = this.applyAdaptationToValue(
          adaptedValue,
          transformation,
          tokenCategory
        );
      }
    }
    
    return adaptedValue;
  }
  
  /**
   * Get token category from path
   */
  private getTokenCategory(tokenPath: string): string {
    const parts = tokenPath.split('.');
    return parts[0] || 'unknown';
  }
  
  /**
   * Apply adaptation to a value based on category
   */
  private applyAdaptationToValue<T>(
    value: T,
    adaptation: any,
    category: string
  ): T {
    if (typeof value === 'string') {
      // Handle string values (colors, dimensions, etc.)
      if (category === 'colors' && value.includes('oklch')) {
        return this.adaptOKLCHColor(value, adaptation) as T;
      } else if (category === 'spacing' && (value.includes('rem') || value.includes('px'))) {
        return this.adaptDimension(value, adaptation) as T;
      } else if (category === 'typography' && value.includes('rem')) {
        return this.adaptDimension(value, adaptation) as T;
      }
    } else if (typeof value === 'number') {
      // Handle numeric values
      if (adaptation.baseMultiplier) {
        return (value * adaptation.baseMultiplier) as T;
      }
      if (adaptation.sizeIncrease) {
        return (value + adaptation.sizeIncrease) as T;
      }
    }
    
    return value;
  }
  
  /**
   * Adapt OKLCH color values
   */
  private adaptOKLCHColor(oklchString: string, adaptation: any): string {
    const match = oklchString.match(/oklch\(([\d.]+)\s+([\d.]+)\s+([\d.]+)(?:\s*\/\s*([\d.]+))?\)/);
    if (!match) return oklchString;
    
    let lightness = parseFloat(match[1]);
    let chroma = parseFloat(match[2]);
    let hue = parseFloat(match[3]);
    const alpha = match[4] ? parseFloat(match[4]) : 1;
    
    // Apply adaptations
    if (adaptation.lightnessAdjustment) {
      lightness = Math.max(0, Math.min(1, lightness + adaptation.lightnessAdjustment));
    }
    if (adaptation.chromaMultiplier) {
      chroma = chroma * adaptation.chromaMultiplier;
    }
    if (adaptation.hueShift) {
      hue = (hue + adaptation.hueShift) % 360;
    }
    if (adaptation.contrastBoost) {
      // Increase contrast by adjusting lightness
      lightness = lightness < 0.5 
        ? Math.max(0, lightness - adaptation.contrastBoost)
        : Math.min(1, lightness + adaptation.contrastBoost);
    }
    if (adaptation.saturationReduction) {
      chroma = chroma * (1 - adaptation.saturationReduction);
    }
    
    return alpha < 1
      ? `oklch(${lightness.toFixed(3)} ${chroma.toFixed(3)} ${hue.toFixed(1)} / ${alpha.toFixed(3)})`
      : `oklch(${lightness.toFixed(3)} ${chroma.toFixed(3)} ${hue.toFixed(1)})`;
  }
  
  /**
   * Adapt dimension values (rem, px, etc.)
   */
  private adaptDimension(dimensionString: string, adaptation: any): string {
    const remMatch = dimensionString.match(/([\d.]+)rem/);
    const pxMatch = dimensionString.match(/([\d.]+)px/);
    
    if (remMatch) {
      let value = parseFloat(remMatch[1]);
      
      if (adaptation.sizeMultiplier) {
        value *= adaptation.sizeMultiplier;
      }
      if (adaptation.sizeIncrease) {
        value += adaptation.sizeIncrease;
      }
      if (adaptation.baseMultiplier) {
        value *= adaptation.baseMultiplier;
      }
      
      return `${value.toFixed(3)}rem`;
    }
    
    if (pxMatch) {
      let value = parseFloat(pxMatch[1]);
      
      if (adaptation.sizeMultiplier) {
        value *= adaptation.sizeMultiplier;
      }
      if (adaptation.sizeIncrease) {
        value += adaptation.sizeIncrease * 16; // Convert rem to px
      }
      if (adaptation.baseMultiplier) {
        value *= adaptation.baseMultiplier;
      }
      
      return `${Math.round(value)}px`;
    }
    
    return dimensionString;
  }
  
  /**
   * Initialize default context resolution rules
   */
  private initializeDefaultRules(): void {
    // Dark mode color adjustments
    this.addRule({
      id: 'dark-mode-colors',
      priority: 100,
      condition: (context) => context.mode === 'dark',
      tokenPattern: /^colors\./,
      transform: (value, context) => {
        if (typeof value === 'string' && value.includes('oklch')) {
          return this.adaptOKLCHColor(value, { lightnessAdjustment: 0.1 });
        }
        return value;
      },
      description: 'Adjust colors for dark mode',
    });
    
    // High contrast adjustments
    this.addRule({
      id: 'high-contrast',
      priority: 90,
      condition: (context) => context.accessibility.highContrast,
      transform: (value, context) => {
        if (typeof value === 'string' && value.includes('oklch')) {
          return this.adaptOKLCHColor(value, { 
            contrastBoost: 0.1,
            chromaMultiplier: 1.2 
          });
        }
        return value;
      },
      description: 'Increase contrast for accessibility',
    });
    
    // Large text adjustments
    this.addRule({
      id: 'large-text',
      priority: 80,
      condition: (context) => context.accessibility.largeText,
      tokenPattern: /^typography\./,
      transform: (value, context) => {
        if (typeof value === 'string' && value.includes('rem')) {
          return this.adaptDimension(value, { sizeMultiplier: 1.2 });
        }
        return value;
      },
      description: 'Increase text size for accessibility',
    });
    
    // Reduced motion adjustments
    this.addRule({
      id: 'reduced-motion',
      priority: 70,
      condition: (context) => context.accessibility.reducedMotion,
      tokenPattern: /^animation\.|^transition\./,
      transform: (value, context) => {
        if (typeof value === 'string' && value.includes('ms')) {
          // Reduce animation duration
          const match = value.match(/([\d.]+)ms/);
          if (match) {
            const duration = parseFloat(match[1]) * 0.1; // 90% reduction
            return value.replace(match[0], `${duration}ms`);
          }
        }
        return value;
      },
      description: 'Reduce motion for accessibility',
    });
  }
  
  /**
   * Initialize platform adaptations
   */
  private initializePlatformAdaptations(): void {
    // iOS adaptations
    this.platformAdaptations.set('ios', {
      platform: 'ios',
      adaptations: {
        colors: {
          lightnessAdjustment: 0.02,
          hueShift: 2,
        },
        spacing: {
          baseMultiplier: 1.05,
          minTouchTarget: 44, // iOS HIG minimum
        },
        typography: {
          sizeMultiplier: 1.02,
          lineHeightMultiplier: 1.1,
        },
      },
    });
    
    // Android adaptations
    this.platformAdaptations.set('android', {
      platform: 'android',
      adaptations: {
        colors: {
          chromaMultiplier: 1.05,
        },
        spacing: {
          baseMultiplier: 1.0,
          minTouchTarget: 48, // Material Design minimum
        },
        typography: {
          sizeMultiplier: 1.0,
        },
      },
    });
  }
  
  /**
   * Initialize accessibility adaptations
   */
  private initializeAccessibilityAdaptations(): void {
    // High contrast
    this.accessibilityAdaptations.set('highContrast', {
      feature: 'highContrast',
      transformations: {
        colors: {
          contrastBoost: 0.15,
          chromaMultiplier: 1.3,
        },
      },
    });
    
    // Large text
    this.accessibilityAdaptations.set('largeText', {
      feature: 'largeText',
      transformations: {
        typography: {
          sizeIncrease: 0.2, // 0.2rem increase
          lineHeightIncrease: 0.1,
        },
        spacing: {
          sizeIncrease: 0.1, // 0.1rem increase
        },
      },
    });
    
    // Reduced motion
    this.accessibilityAdaptations.set('reducedMotion', {
      feature: 'reducedMotion',
      transformations: {
        motion: {
          durationMultiplier: 0.1,
          easingOverride: 'ease',
        },
      },
    });
  }
}

// ============================================================================
// SINGLETON INSTANCE
// ============================================================================

export const contextResolver = new ContextResolver();