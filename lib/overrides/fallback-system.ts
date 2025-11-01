/**
 * Fallback and Override System
 * 
 * Provides mechanisms to override automatically generated colors for specific
 * components or exceptions, and implement fallback tokens when computed colors
 * do not meet accessibility or brand guidelines.
 */

import { type OKLCHColor, oklch, getContrastRatio } from '../color/oklch';
import { type WCAGValidationConfig, wcagValidator } from '../accessibility/wcag-validator';
import { type ThemeContext } from '../theme-contracts';

// ============================================================================
// TYPES AND INTERFACES
// ============================================================================

export interface ColorOverride {
  /** Unique identifier for the override */
  id: string;
  /** Target token path (e.g., 'colors.primary.500') */
  tokenPath: string;
  /** Override color value */
  color: OKLCHColor | string;
  /** Conditions when this override applies */
  conditions?: OverrideCondition[];
  /** Priority level (higher numbers take precedence) */
  priority: number;
  /** Reason for the override */
  reason: string;
  /** Whether this override is temporary */
  temporary?: boolean;
  /** Expiration date for temporary overrides */
  expiresAt?: Date;
}

export interface OverrideCondition {
  /** Type of condition */
  type: 'theme' | 'platform' | 'accessibility' | 'component' | 'custom';
  /** Condition value or matcher */
  value: string | RegExp | ((context: ThemeContext) => boolean);
  /** Whether condition should match or not match */
  negate?: boolean;
}

export interface FallbackRule {
  /** Unique identifier for the fallback rule */
  id: string;
  /** Target token path pattern */
  tokenPattern: string | RegExp;
  /** Fallback strategy */
  strategy: FallbackStrategy;
  /** Validation requirements that trigger fallback */
  triggers: FallbackTrigger[];
  /** Priority level */
  priority: number;
}

export interface FallbackStrategy {
  /** Type of fallback strategy */
  type: 'preset' | 'computed' | 'nearest' | 'safe' | 'custom';
  /** Configuration for the strategy */
  config: FallbackConfig;
}

export interface FallbackConfig {
  /** Preset color values */
  presets?: Record<string, OKLCHColor>;
  /** Computation function for dynamic fallbacks */
  compute?: (context: ThemeContext, originalColor: OKLCHColor) => OKLCHColor;
  /** Search parameters for nearest color matching */
  searchParams?: {
    maxDistance: number;
    preserveHue?: boolean;
    preserveChroma?: boolean;
  };
  /** Safe color defaults */
  safeDefaults?: {
    light: OKLCHColor;
    dark: OKLCHColor;
    highContrast: OKLCHColor;
  };
}

export interface FallbackTrigger {
  /** Type of validation that triggers fallback */
  type: 'contrast' | 'accessibility' | 'brand' | 'technical' | 'custom';
  /** Threshold or condition */
  condition: number | string | ((color: OKLCHColor, context: ThemeContext) => boolean);
  /** Severity level */
  severity: 'warning' | 'error' | 'critical';
}

export interface OverrideResult {
  /** Whether an override was applied */
  applied: boolean;
  /** The final color value */
  color: OKLCHColor;
  /** Override that was applied (if any) */
  override?: ColorOverride;
  /** Fallback rule that was applied (if any) */
  fallback?: FallbackRule;
  /** Validation results */
  validation: {
    passes: boolean;
    issues: string[];
    suggestions: string[];
  };
}

export interface SystemMetrics {
  /** Total number of overrides */
  totalOverrides: number;
  /** Active overrides */
  activeOverrides: number;
  /** Fallbacks triggered */
  fallbacksTriggered: number;
  /** Override success rate */
  successRate: number;
  /** Most common override reasons */
  commonReasons: Array<{ reason: string; count: number }>;
  /** Performance impact */
  performanceImpact: {
    averageResolutionTime: number;
    cacheHitRate: number;
  };
}

// ============================================================================
// FALLBACK AND OVERRIDE SYSTEM
// ============================================================================

export class FallbackOverrideSystem {
  private overrides = new Map<string, ColorOverride>();
  private fallbackRules = new Map<string, FallbackRule>();
  private cache = new Map<string, OverrideResult>();
  private metrics: SystemMetrics = {
    totalOverrides: 0,
    activeOverrides: 0,
    fallbacksTriggered: 0,
    successRate: 0,
    commonReasons: [],
    performanceImpact: {
      averageResolutionTime: 0,
      cacheHitRate: 0
    }
  };

  constructor() {
    this.initializeDefaultFallbacks();
  }

  // ========================================================================
  // OVERRIDE MANAGEMENT
  // ========================================================================

  /**
   * Register a color override
   */
  registerOverride(override: ColorOverride): void {
    // Validate override
    this.validateOverride(override);
    
    // Clean up expired overrides
    this.cleanupExpiredOverrides();
    
    // Store override
    this.overrides.set(override.id, override);
    this.metrics.totalOverrides++;
    
    // Clear related cache entries
    this.clearCacheForToken(override.tokenPath);
    
    console.log(`Registered override: ${override.id} for ${override.tokenPath}`);
  }

  /**
   * Remove an override
   */
  removeOverride(overrideId: string): boolean {
    const override = this.overrides.get(overrideId);
    if (!override) return false;
    
    this.overrides.delete(overrideId);
    this.clearCacheForToken(override.tokenPath);
    
    console.log(`Removed override: ${overrideId}`);
    return true;
  }

  /**
   * Register a fallback rule
   */
  registerFallbackRule(rule: FallbackRule): void {
    this.validateFallbackRule(rule);
    this.fallbackRules.set(rule.id, rule);
    
    console.log(`Registered fallback rule: ${rule.id}`);
  }

  /**
   * Remove a fallback rule
   */
  removeFallbackRule(ruleId: string): boolean {
    return this.fallbackRules.delete(ruleId);
  }

  // ========================================================================
  // COLOR RESOLUTION
  // ========================================================================

  /**
   * Resolve color with overrides and fallbacks
   */
  resolveColor(
    tokenPath: string,
    originalColor: OKLCHColor,
    context: ThemeContext
  ): OverrideResult {
    const startTime = performance.now();
    
    // Check cache first
    const cacheKey = this.getCacheKey(tokenPath, originalColor, context);
    const cached = this.cache.get(cacheKey);
    if (cached) {
      this.metrics.performanceImpact.cacheHitRate++;
      return cached;
    }

    let result: OverrideResult = {
      applied: false,
      color: originalColor,
      validation: { passes: true, issues: [], suggestions: [] }
    };

    // 1. Check for applicable overrides
    const override = this.findApplicableOverride(tokenPath, context);
    if (override) {
      result = this.applyOverride(override, originalColor, context);
    }

    // 2. Validate the color (original or overridden)
    const validation = this.validateColor(result.color, context);
    result.validation = validation;

    // 3. Apply fallback if validation fails
    if (!validation.passes) {
      const fallbackResult = this.applyFallback(tokenPath, result.color, context);
      if (fallbackResult) {
        result.color = fallbackResult.color;
        result.fallback = fallbackResult.rule;
        result.applied = true;
        result.validation = this.validateColor(result.color, context);
        this.metrics.fallbacksTriggered++;
      }
    }

    // Cache result
    this.cache.set(cacheKey, result);
    
    // Update metrics
    const endTime = performance.now();
    this.updatePerformanceMetrics(endTime - startTime);

    return result;
  }

  // ========================================================================
  // BULK OPERATIONS
  // ========================================================================

  /**
   * Apply overrides to an entire palette
   */
  applyOverridesToPalette(
    palette: Record<string, any>,
    context: ThemeContext
  ): Record<string, any> {
    const result = { ...palette };
    
    this.traverseAndApplyOverrides(result, '', context);
    
    return result;
  }

  /**
   * Validate entire palette and suggest fallbacks
   */
  validatePaletteWithFallbacks(
    palette: Record<string, any>,
    context: ThemeContext
  ): {
    palette: Record<string, any>;
    issues: Array<{ path: string; issue: string; resolved: boolean }>;
  } {
    const result = { ...palette };
    const issues: Array<{ path: string; issue: string; resolved: boolean }> = [];
    
    this.traverseAndValidate(result, '', context, issues);
    
    return { palette: result, issues };
  }

  // ========================================================================
  // PRESET OVERRIDES
  // ========================================================================

  /**
   * Create brand-specific overrides
   */
  createBrandOverrides(brandConfig: {
    primaryColor: OKLCHColor;
    secondaryColor: OKLCHColor;
    logoColors?: OKLCHColor[];
    restrictions?: string[];
  }): ColorOverride[] {
    const overrides: ColorOverride[] = [];

    // Primary brand color override
    overrides.push({
      id: 'brand-primary',
      tokenPath: 'colors.primary.500',
      color: brandConfig.primaryColor,
      priority: 100,
      reason: 'Brand identity requirement'
    });

    // Secondary brand color override
    overrides.push({
      id: 'brand-secondary',
      tokenPath: 'colors.secondary.500',
      color: brandConfig.secondaryColor,
      priority: 100,
      reason: 'Brand identity requirement'
    });

    // Logo color overrides
    if (brandConfig.logoColors) {
      brandConfig.logoColors.forEach((color, index) => {
        overrides.push({
          id: `brand-logo-${index}`,
          tokenPath: `colors.brand.logo${index}`,
          color,
          priority: 90,
          reason: 'Logo color specification'
        });
      });
    }

    return overrides;
  }

  /**
   * Create accessibility-focused overrides
   */
  createAccessibilityOverrides(
    validationConfig: WCAGValidationConfig
  ): ColorOverride[] {
    const overrides: ColorOverride[] = [];

    // High contrast text overrides
    if (validationConfig.contrastRequirements.normal >= 7) {
      overrides.push({
        id: 'a11y-high-contrast-text',
        tokenPath: 'colors.text.primary',
        color: { l: 0.05, c: 0, h: 0 }, // Near black
        conditions: [
          { type: 'theme', value: 'light' },
          { type: 'accessibility', value: 'high-contrast' }
        ],
        priority: 80,
        reason: 'WCAG AAA compliance for high contrast mode'
      });

      overrides.push({
        id: 'a11y-high-contrast-text-dark',
        tokenPath: 'colors.text.primary',
        color: { l: 0.95, c: 0, h: 0 }, // Near white
        conditions: [
          { type: 'theme', value: 'dark' },
          { type: 'accessibility', value: 'high-contrast' }
        ],
        priority: 80,
        reason: 'WCAG AAA compliance for high contrast mode'
      });
    }

    return overrides;
  }

  /**
   * Create platform-specific overrides
   */
  createPlatformOverrides(platform: string): ColorOverride[] {
    const overrides: ColorOverride[] = [];

    // iOS specific overrides
    if (platform === 'ios') {
      overrides.push({
        id: 'ios-system-blue',
        tokenPath: 'colors.primary.500',
        color: { l: 0.6, c: 0.15, h: 220 }, // iOS system blue
        conditions: [{ type: 'platform', value: 'ios' }],
        priority: 70,
        reason: 'iOS platform consistency'
      });
    }

    // Android Material Design overrides
    if (platform === 'android') {
      overrides.push({
        id: 'material-primary',
        tokenPath: 'colors.primary.500',
        color: { l: 0.4, c: 0.2, h: 260 }, // Material Design primary
        conditions: [{ type: 'platform', value: 'android' }],
        priority: 70,
        reason: 'Material Design compliance'
      });
    }

    return overrides;
  }

  // ========================================================================
  // SYSTEM MANAGEMENT
  // ========================================================================

  /**
   * Get system metrics
   */
  getMetrics(): SystemMetrics {
    this.updateMetrics();
    return { ...this.metrics };
  }

  /**
   * Clear all caches
   */
  clearCache(): void {
    this.cache.clear();
    console.log('Override system cache cleared');
  }

  /**
   * Export overrides and rules for backup
   */
  exportConfiguration(): {
    overrides: ColorOverride[];
    fallbackRules: FallbackRule[];
    timestamp: string;
  } {
    return {
      overrides: Array.from(this.overrides.values()),
      fallbackRules: Array.from(this.fallbackRules.values()),
      timestamp: new Date().toISOString()
    };
  }

  /**
   * Import overrides and rules from backup
   */
  importConfiguration(config: {
    overrides: ColorOverride[];
    fallbackRules: FallbackRule[];
  }): void {
    // Clear existing configuration
    this.overrides.clear();
    this.fallbackRules.clear();

    // Import overrides
    config.overrides.forEach(override => {
      this.registerOverride(override);
    });

    // Import fallback rules
    config.fallbackRules.forEach(rule => {
      this.registerFallbackRule(rule);
    });

    console.log('Configuration imported successfully');
  }

  // ========================================================================
  // PRIVATE METHODS
  // ========================================================================

  private initializeDefaultFallbacks(): void {
    // Safe color fallbacks
    this.registerFallbackRule({
      id: 'safe-text-fallback',
      tokenPattern: /colors\.text\./,
      strategy: {
        type: 'safe',
        config: {
          safeDefaults: {
            light: { l: 0.1, c: 0, h: 0 },
            dark: { l: 0.9, c: 0, h: 0 },
            highContrast: { l: 0.05, c: 0, h: 0 }
          }
        }
      },
      triggers: [
        {
          type: 'contrast',
          condition: 4.5,
          severity: 'error'
        }
      ],
      priority: 50
    });

    // Background fallbacks
    this.registerFallbackRule({
      id: 'safe-background-fallback',
      tokenPattern: /colors\.background\./,
      strategy: {
        type: 'safe',
        config: {
          safeDefaults: {
            light: { l: 0.98, c: 0, h: 0 },
            dark: { l: 0.08, c: 0, h: 0 },
            highContrast: { l: 1, c: 0, h: 0 }
          }
        }
      },
      triggers: [
        {
          type: 'contrast',
          condition: 4.5,
          severity: 'error'
        }
      ],
      priority: 50
    });
  }

  private validateOverride(override: ColorOverride): void {
    if (!override.id || !override.tokenPath || !override.color) {
      throw new Error('Invalid override: missing required fields');
    }

    if (override.priority < 0 || override.priority > 100) {
      throw new Error('Invalid override: priority must be between 0 and 100');
    }

    if (override.temporary && !override.expiresAt) {
      throw new Error('Invalid override: temporary overrides must have expiration date');
    }
  }

  private validateFallbackRule(rule: FallbackRule): void {
    if (!rule.id || !rule.tokenPattern || !rule.strategy) {
      throw new Error('Invalid fallback rule: missing required fields');
    }

    if (rule.priority < 0 || rule.priority > 100) {
      throw new Error('Invalid fallback rule: priority must be between 0 and 100');
    }
  }

  private findApplicableOverride(
    tokenPath: string,
    context: ThemeContext
  ): ColorOverride | null {
    const candidates = Array.from(this.overrides.values())
      .filter(override => {
        // Check if token path matches
        if (override.tokenPath !== tokenPath) return false;
        
        // Check if override is expired
        if (override.temporary && override.expiresAt && override.expiresAt < new Date()) {
          return false;
        }
        
        // Check conditions
        if (override.conditions) {
          return override.conditions.every(condition => 
            this.evaluateCondition(condition, context)
          );
        }
        
        return true;
      })
      .sort((a, b) => b.priority - a.priority);

    return candidates[0] || null;
  }

  private evaluateCondition(condition: OverrideCondition, context: ThemeContext): boolean {
    let matches = false;

    switch (condition.type) {
      case 'theme':
        matches = context.mode === condition.value;
        break;
      case 'platform':
        matches = context.platform === condition.value;
        break;
      case 'accessibility':
        matches = context.accessibility?.mode === condition.value;
        break;
      case 'custom':
        if (typeof condition.value === 'function') {
          matches = condition.value(context);
        }
        break;
    }

    return condition.negate ? !matches : matches;
  }

  private applyOverride(
    override: ColorOverride,
    originalColor: OKLCHColor,
    context: ThemeContext
  ): OverrideResult {
    const color = typeof override.color === 'string' 
      ? oklch(override.color) 
      : override.color;

    return {
      applied: true,
      color,
      override,
      validation: { passes: true, issues: [], suggestions: [] }
    };
  }

  private validateColor(color: OKLCHColor, context: ThemeContext): {
    passes: boolean;
    issues: string[];
    suggestions: string[];
  } {
    const issues: string[] = [];
    const suggestions: string[] = [];

    // Basic OKLCH validation
    if (color.l < 0 || color.l > 1) {
      issues.push('Lightness value out of range (0-1)');
    }
    if (color.c < 0 || color.c > 0.5) {
      issues.push('Chroma value out of reasonable range (0-0.5)');
    }
    if (color.h < 0 || color.h >= 360) {
      issues.push('Hue value out of range (0-360)');
    }

    // Add more validation as needed...

    return {
      passes: issues.length === 0,
      issues,
      suggestions
    };
  }

  private applyFallback(
    tokenPath: string,
    color: OKLCHColor,
    context: ThemeContext
  ): { color: OKLCHColor; rule: FallbackRule } | null {
    const applicableRules = Array.from(this.fallbackRules.values())
      .filter(rule => {
        if (typeof rule.tokenPattern === 'string') {
          return tokenPath.includes(rule.tokenPattern);
        }
        return rule.tokenPattern.test(tokenPath);
      })
      .sort((a, b) => b.priority - a.priority);

    for (const rule of applicableRules) {
      const shouldTrigger = rule.triggers.some(trigger => 
        this.evaluateTrigger(trigger, color, context)
      );

      if (shouldTrigger) {
        const fallbackColor = this.computeFallbackColor(rule.strategy, color, context);
        if (fallbackColor) {
          return { color: fallbackColor, rule };
        }
      }
    }

    return null;
  }

  private evaluateTrigger(
    trigger: FallbackTrigger,
    color: OKLCHColor,
    context: ThemeContext
  ): boolean {
    switch (trigger.type) {
      case 'contrast':
        // This would need a reference color to check against
        // For now, return false as placeholder
        return false;
      case 'custom':
        if (typeof trigger.condition === 'function') {
          return trigger.condition(color, context);
        }
        return false;
      default:
        return false;
    }
  }

  private computeFallbackColor(
    strategy: FallbackStrategy,
    originalColor: OKLCHColor,
    context: ThemeContext
  ): OKLCHColor | null {
    switch (strategy.type) {
      case 'safe':
        if (strategy.config.safeDefaults) {
          const mode = context.mode as keyof typeof strategy.config.safeDefaults;
          return strategy.config.safeDefaults[mode] || strategy.config.safeDefaults.light;
        }
        break;
      case 'computed':
        if (strategy.config.compute) {
          return strategy.config.compute(context, originalColor);
        }
        break;
      case 'preset':
        if (strategy.config.presets) {
          const presetKey = `${context.mode}-fallback`;
          return strategy.config.presets[presetKey];
        }
        break;
    }

    return null;
  }

  private traverseAndApplyOverrides(
    obj: any,
    path: string,
    context: ThemeContext
  ): void {
    for (const [key, value] of Object.entries(obj)) {
      const currentPath = path ? `${path}.${key}` : key;
      
      if (typeof value === 'object' && value !== null) {
        this.traverseAndApplyOverrides(value, currentPath, context);
      } else if (typeof value === 'string' && value.startsWith('oklch(')) {
        const color = oklch(value);
        const result = this.resolveColor(currentPath, color, context);
        if (result.applied) {
          obj[key] = `oklch(${result.color.l} ${result.color.c} ${result.color.h})`;
        }
      }
    }
  }

  private traverseAndValidate(
    obj: any,
    path: string,
    context: ThemeContext,
    issues: Array<{ path: string; issue: string; resolved: boolean }>
  ): void {
    for (const [key, value] of Object.entries(obj)) {
      const currentPath = path ? `${path}.${key}` : key;
      
      if (typeof value === 'object' && value !== null) {
        this.traverseAndValidate(value, currentPath, context, issues);
      } else if (typeof value === 'string' && value.startsWith('oklch(')) {
        const color = oklch(value);
        const validation = this.validateColor(color, context);
        
        if (!validation.passes) {
          const fallbackResult = this.applyFallback(currentPath, color, context);
          const resolved = fallbackResult !== null;
          
          if (resolved && fallbackResult) {
            obj[key] = `oklch(${fallbackResult.color.l} ${fallbackResult.color.c} ${fallbackResult.color.h})`;
          }
          
          validation.issues.forEach(issue => {
            issues.push({ path: currentPath, issue, resolved });
          });
        }
      }
    }
  }

  private cleanupExpiredOverrides(): void {
    const now = new Date();
    for (const [id, override] of this.overrides.entries()) {
      if (override.temporary && override.expiresAt && override.expiresAt < now) {
        this.overrides.delete(id);
        console.log(`Removed expired override: ${id}`);
      }
    }
  }

  private clearCacheForToken(tokenPath: string): void {
    for (const [key] of this.cache.entries()) {
      if (key.includes(tokenPath)) {
        this.cache.delete(key);
      }
    }
  }

  private getCacheKey(
    tokenPath: string,
    color: OKLCHColor,
    context: ThemeContext
  ): string {
    return `${tokenPath}:${color.l}:${color.c}:${color.h}:${context.mode}:${context.platform}`;
  }

  private updatePerformanceMetrics(resolutionTime: number): void {
    const current = this.metrics.performanceImpact.averageResolutionTime;
    this.metrics.performanceImpact.averageResolutionTime = 
      (current + resolutionTime) / 2;
  }

  private updateMetrics(): void {
    this.metrics.activeOverrides = this.overrides.size;
    
    // Calculate success rate
    const totalResolutions = this.cache.size;
    const successfulResolutions = Array.from(this.cache.values())
      .filter(result => result.validation.passes).length;
    
    this.metrics.successRate = totalResolutions > 0 
      ? successfulResolutions / totalResolutions 
      : 0;

    // Update common reasons
    const reasonCounts = new Map<string, number>();
    for (const override of this.overrides.values()) {
      const count = reasonCounts.get(override.reason) || 0;
      reasonCounts.set(override.reason, count + 1);
    }
    
    this.metrics.commonReasons = Array.from(reasonCounts.entries())
      .map(([reason, count]) => ({ reason, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 5);
  }
}

// ============================================================================
// SINGLETON INSTANCE
// ============================================================================

export const fallbackOverrideSystem = new FallbackOverrideSystem();