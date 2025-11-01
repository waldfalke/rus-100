/**
 * Contract-Driven Token Architecture Implementation
 * 
 * Implements the contract-driven token system with runtime resolution,
 * validation, and comprehensive theme integration.
 */

import type { OKLCHColor } from '../color/oklch';
import type { WCAGValidationResult, AccessibilityContext, wcagValidator } from '../accessibility/wcag-validator';
import type { ThemeContext } from './types';
import { performanceMonitor, TokenCache } from '../utils/performance';

// ============================================================================
// EXTENDED THEME CONTEXT
// ============================================================================

export interface ExtendedThemeContext extends ThemeContext {
  /** Platform information */
  platform: {
    type: 'web' | 'mobile' | 'desktop' | 'tv';
    os: 'windows' | 'macos' | 'linux' | 'ios' | 'android' | 'unknown';
    device: 'phone' | 'tablet' | 'desktop' | 'tv' | 'watch';
    screenSize: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | 'xxl';
    pixelDensity: number;
    hasTouch: boolean;
    hasKeyboard: boolean;
    hasMouse: boolean;
  };
  
  /** Accessibility preferences */
  accessibility: {
    highContrast: boolean;
    reducedMotion: boolean;
    largeText: boolean;
    colorBlindness?: 'protanopia' | 'deuteranopia' | 'tritanopia' | 'achromatopsia';
    screenReader: boolean;
    forceFocus: boolean;
    prefersReducedData: boolean;
  };
  
  /** Environmental context */
  environment: {
    ambientLight: 'low' | 'normal' | 'bright';
    batteryLevel?: 'low' | 'normal' | 'high';
    networkSpeed?: 'slow' | 'normal' | 'fast';
    dataUsage?: 'limited' | 'normal' | 'unlimited';
  };
  
  /** User preferences */
  preferences: {
    density: 'compact' | 'normal' | 'comfortable';
    animations: 'none' | 'reduced' | 'normal' | 'enhanced';
    language: string;
    locale: string;
    timezone: string;
  };
  
  /** Component state context */
  component?: {
    state: 'default' | 'hover' | 'active' | 'focus' | 'disabled' | 'loading' | 'error';
    variant: string;
    size: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
    interactive: boolean;
    nested: boolean;
    elevation: number;
  };
}

// ============================================================================
// CONTRACT TYPES
// ============================================================================

export interface ValidationResult {
  /** Whether the value is valid */
  valid: boolean;
  
  /** Validation errors */
  errors: string[];
  
  /** Validation warnings */
  warnings: string[];
  
  /** WCAG validation result if applicable */
  wcag?: WCAGValidationResult;
  
  /** Suggested fixes */
  suggestions: string[];
}

export interface ContractResolutionResult<T = any> {
  /** Resolved value */
  value: T;
  
  /** Whether fallback was used */
  usedFallback: boolean;
  
  /** Resolution time in milliseconds */
  resolutionTime: number;
  
  /** Validation result */
  validation: ValidationResult;
  
  /** Applied adaptations */
  adaptations: string[];
  
  /** Cache hit/miss */
  cached: boolean;
}

export interface TokenContract<T = any> {
  /** Contract identifier */
  id: string;
  
  /** Contract description */
  description: string;
  
  /** Contract category */
  category: 'color' | 'spacing' | 'typography' | 'motion' | 'elevation' | 'border';
  
  /** Contract resolver function */
  resolve: (context: ExtendedThemeContext) => T;
  
  /** Fallback value if resolution fails */
  fallback: T;
  
  /** Validation function */
  validate?: (value: T, context: ExtendedThemeContext) => ValidationResult;
  
  /** Dependencies on other contracts */
  dependencies?: string[];
  
  /** Contract metadata */
  metadata: {
    wcagCompliant: boolean;
    platformSupport: ExtendedThemeContext['platform']['type'][];
    performanceImpact: 'low' | 'medium' | 'high';
    cacheable: boolean;
    version: string;
  };
}

export interface ColorContract extends TokenContract<string> {
  /** Color role */
  role: 'background' | 'surface' | 'text' | 'border' | 'accent' | 'semantic';
  
  /** Semantic meaning if applicable */
  semantic?: 'primary' | 'secondary' | 'success' | 'warning' | 'error' | 'info';
  
  /** Expected contrast targets */
  contrastTargets?: {
    background: string; // Contract ID of background color
    minRatio: number;
    preferredRatio: number;
  }[];
}

export interface SpacingContract extends TokenContract<string> {
  /** Spacing purpose */
  purpose: 'margin' | 'padding' | 'gap' | 'inset' | 'offset';
  
  /** Responsive behavior */
  responsive: boolean;
  
  /** Minimum touch target consideration */
  touchTarget: boolean;
}

export interface TypographyContract extends TokenContract<{
  fontSize: string;
  fontWeight: string;
  lineHeight: string;
  letterSpacing: string;
  fontFamily: string;
}> {
  /** Typography scale level */
  scale: 'xs' | 'sm' | 'base' | 'lg' | 'xl' | '2xl' | '3xl' | '4xl' | '5xl' | '6xl';
  
  /** Text purpose */
  purpose: 'display' | 'heading' | 'body' | 'caption' | 'label' | 'code';
  
  /** Reading context */
  readingContext: 'primary' | 'secondary' | 'tertiary';
}

// ============================================================================
// CONTRACT REGISTRY
// ============================================================================

export interface ContractRegistry {
  /** Register a new contract */
  register<T>(contract: TokenContract<T>): void;
  
  /** Unregister a contract */
  unregister(contractId: string): void;
  
  /** Get a contract by ID */
  get<T>(contractId: string): TokenContract<T> | undefined;
  
  /** Get all contracts by category */
  getByCategory(category: TokenContract['category']): TokenContract[];
  
  /** Resolve a contract */
  resolve<T>(contractId: string, context: ExtendedThemeContext): ContractResolutionResult<T>;
  
  /** Resolve multiple contracts */
  resolveMany(contractIds: string[], context: ExtendedThemeContext): Map<string, ContractResolutionResult>;
  
  /** Validate all contracts */
  validateAll(context: ExtendedThemeContext): Map<string, ValidationResult>;
  
  /** Get contract dependencies */
  getDependencies(contractId: string): string[];
  
  /** Get contracts that depend on a given contract */
  getDependents(contractId: string): string[];
  
  /** Clear resolution cache */
  clearCache(): void;
  
  /** Get registry statistics */
  getStats(): {
    totalContracts: number;
    contractsByCategory: Record<string, number>;
    resolutionStats: {
      totalResolutions: number;
      averageResolutionTime: number;
      cacheHitRate: number;
      fallbackUsage: number;
    };
  };
}

export class ContractRegistryImpl implements ContractRegistry {
  private contracts = new Map<string, TokenContract>();
  private cache = new TokenCache<string, ContractResolutionResult>(1000, 10 * 60 * 1000); // 10 min TTL
  private dependencyGraph = new Map<string, Set<string>>();
  private dependentGraph = new Map<string, Set<string>>();
  private stats = {
    totalResolutions: 0,
    totalResolutionTime: 0,
    cacheHits: 0,
    fallbackUsage: 0
  };

  register<T>(contract: TokenContract<T>): void {
    this.contracts.set(contract.id, contract);
    
    // Update dependency graphs
    if (contract.dependencies) {
      this.dependencyGraph.set(contract.id, new Set(contract.dependencies));
      
      contract.dependencies.forEach(depId => {
        if (!this.dependentGraph.has(depId)) {
          this.dependentGraph.set(depId, new Set());
        }
        this.dependentGraph.get(depId)!.add(contract.id);
      });
    }
    
    // Clear cache when contracts change
    this.clearCache();
  }

  unregister(contractId: string): void {
    this.contracts.delete(contractId);
    
    // Clean up dependency graphs
    const dependencies = this.dependencyGraph.get(contractId);
    if (dependencies) {
      dependencies.forEach(depId => {
        const dependents = this.dependentGraph.get(depId);
        if (dependents) {
          dependents.delete(contractId);
        }
      });
    }
    
    this.dependencyGraph.delete(contractId);
    this.dependentGraph.delete(contractId);
    
    this.clearCache();
  }

  get<T>(contractId: string): TokenContract<T> | undefined {
    return this.contracts.get(contractId) as TokenContract<T> | undefined;
  }

  getByCategory(category: TokenContract['category']): TokenContract[] {
    return Array.from(this.contracts.values()).filter(contract => contract.category === category);
  }

  resolve<T>(contractId: string, context: ExtendedThemeContext): ContractResolutionResult<T> {
    const startTime = performance.now();
    const cacheKey = `${contractId}-${this.getContextHash(context)}`;
    
    // Check cache first
    const cached = this.cache.get(cacheKey);
    if (cached) {
      this.stats.cacheHits++;
      return { ...cached, cached: true } as ContractResolutionResult<T>;
    }

    const contract = this.get<T>(contractId);
    if (!contract) {
      throw new Error(`Contract not found: ${contractId}`);
    }

    let value: T;
    let usedFallback = false;
    let validation: ValidationResult;
    const adaptations: string[] = [];

    try {
      // Resolve dependencies first
      if (contract.dependencies) {
        for (const depId of contract.dependencies) {
          this.resolve(depId, context);
        }
      }

      // Resolve the contract
      value = contract.resolve(context);
      
      // Apply platform and accessibility adaptations
      value = this.applyAdaptations(value, context, contract, adaptations);
      
      // Validate the result
      validation = contract.validate 
        ? contract.validate(value, context)
        : { valid: true, errors: [], warnings: [], suggestions: [] };
        
    } catch (error) {
      value = contract.fallback;
      usedFallback = true;
      this.stats.fallbackUsage++;
      
      validation = {
        valid: false,
        errors: [`Resolution failed: ${error instanceof Error ? error.message : 'Unknown error'}`],
        warnings: [],
        suggestions: ['Check contract implementation and context validity']
      };
    }

    const resolutionTime = performance.now() - startTime;
    this.stats.totalResolutions++;
    this.stats.totalResolutionTime += resolutionTime;

    const result: ContractResolutionResult<T> = {
      value,
      usedFallback,
      resolutionTime,
      validation,
      adaptations,
      cached: false
    };

    // Cache the result if the contract is cacheable
    if (contract.metadata.cacheable) {
      this.cache.set(cacheKey, result);
    }

    return result;
  }

  resolveMany(contractIds: string[], context: ExtendedThemeContext): Map<string, ContractResolutionResult> {
    const results = new Map<string, ContractResolutionResult>();
    
    contractIds.forEach(id => {
      try {
        results.set(id, this.resolve(id, context));
      } catch (error) {
        results.set(id, {
          value: null,
          usedFallback: true,
          resolutionTime: 0,
          validation: {
            valid: false,
            errors: [`Failed to resolve contract: ${id}`],
            warnings: [],
            suggestions: []
          },
          adaptations: [],
          cached: false
        });
      }
    });
    
    return results;
  }

  validateAll(context: ExtendedThemeContext): Map<string, ValidationResult> {
    const results = new Map<string, ValidationResult>();
    
    this.contracts.forEach((contract, id) => {
      try {
        const resolution = this.resolve(id, context);
        results.set(id, resolution.validation);
      } catch (error) {
        results.set(id, {
          valid: false,
          errors: [`Validation failed: ${error instanceof Error ? error.message : 'Unknown error'}`],
          warnings: [],
          suggestions: []
        });
      }
    });
    
    return results;
  }

  getDependencies(contractId: string): string[] {
    const deps = this.dependencyGraph.get(contractId);
    return deps ? Array.from(deps) : [];
  }

  getDependents(contractId: string): string[] {
    const dependents = this.dependentGraph.get(contractId);
    return dependents ? Array.from(dependents) : [];
  }

  clearCache(): void {
    this.cache.clear();
  }

  getStats() {
    return {
      totalContracts: this.contracts.size,
      contractsByCategory: this.getContractsByCategory(),
      resolutionStats: {
        totalResolutions: this.stats.totalResolutions,
        averageResolutionTime: this.stats.totalResolutions > 0 
          ? this.stats.totalResolutionTime / this.stats.totalResolutions 
          : 0,
        cacheHitRate: this.stats.totalResolutions > 0 
          ? this.stats.cacheHits / this.stats.totalResolutions 
          : 0,
        fallbackUsage: this.stats.fallbackUsage
      }
    };
  }

  private getContractsByCategory(): Record<string, number> {
    const categories: Record<string, number> = {};
    
    this.contracts.forEach(contract => {
      categories[contract.category] = (categories[contract.category] || 0) + 1;
    });
    
    return categories;
  }

  private getContextHash(context: ExtendedThemeContext): string {
    // Create a hash of the context for caching
    return JSON.stringify({
      mode: context.mode,
      platform: context.platform,
      accessibility: context.accessibility,
      environment: context.environment,
      preferences: context.preferences,
      component: context.component
    });
  }

  private applyAdaptations<T>(
    value: T,
    context: ExtendedThemeContext,
    contract: TokenContract<T>,
    adaptations: string[]
  ): T {
    let adaptedValue = value;

    // Apply platform adaptations
    if (context.platform) {
      adaptedValue = this.applyPlatformAdaptations(adaptedValue, context, contract, adaptations);
    }

    // Apply accessibility adaptations
    if (context.accessibility) {
      adaptedValue = this.applyAccessibilityAdaptations(adaptedValue, context, contract, adaptations);
    }

    // Apply environmental adaptations
    if (context.environment) {
      adaptedValue = this.applyEnvironmentalAdaptations(adaptedValue, context, contract, adaptations);
    }

    return adaptedValue;
  }

  private applyPlatformAdaptations<T>(
    value: T,
    context: ExtendedThemeContext,
    contract: TokenContract<T>,
    adaptations: string[]
  ): T {
    // Platform-specific adaptations based on contract category
    if (contract.category === 'spacing' && context.platform.hasTouch) {
      adaptations.push('touch-target-adjustment');
      // Increase touch targets for mobile
      if (typeof value === 'string' && value.includes('px')) {
        const numValue = parseFloat(value);
        if (numValue < 44) { // Minimum touch target size
          return `${Math.max(44, numValue * 1.2)}px` as T;
        }
      }
    }

    if (contract.category === 'typography' && context.platform.pixelDensity > 2) {
      adaptations.push('high-dpi-adjustment');
      // Adjust for high DPI screens
    }

    return value;
  }

  private applyAccessibilityAdaptations<T>(
    value: T,
    context: ExtendedThemeContext,
    contract: TokenContract<T>,
    adaptations: string[]
  ): T {
    let adaptedValue = value;

    if (context.accessibility.largeText && contract.category === 'typography') {
      adaptations.push('large-text-adjustment');
      // Increase font sizes for large text preference
    }

    if (context.accessibility.highContrast && contract.category === 'color') {
      adaptations.push('high-contrast-adjustment');
      // Apply high contrast adjustments
    }

    if (context.accessibility.reducedMotion && contract.category === 'motion') {
      adaptations.push('reduced-motion-adjustment');
      // Reduce or eliminate animations
    }

    return adaptedValue;
  }

  private applyEnvironmentalAdaptations<T>(
    value: T,
    context: ExtendedThemeContext,
    contract: TokenContract<T>,
    adaptations: string[]
  ): T {
    if (context.environment.ambientLight === 'bright' && contract.category === 'color') {
      adaptations.push('bright-light-adjustment');
      // Increase contrast for bright environments
    }

    if (context.environment.batteryLevel === 'low' && contract.category === 'motion') {
      adaptations.push('battery-saving-adjustment');
      // Reduce animations to save battery
    }

    return value;
  }
}

// ============================================================================
// CONTRACT BUILDER
// ============================================================================

export interface ContractBuilder<T = any> {
  /** Set contract ID */
  id(id: string): ContractBuilder<T>;
  
  /** Set contract description */
  description(description: string): ContractBuilder<T>;
  
  /** Set contract category */
  category(category: TokenContract['category']): ContractBuilder<T>;
  
  /** Set resolver function */
  resolver(resolver: (context: ExtendedThemeContext) => T): ContractBuilder<T>;
  
  /** Set fallback value */
  fallback(fallback: T): ContractBuilder<T>;
  
  /** Set validation function */
  validator(validator: (value: T, context: ExtendedThemeContext) => ValidationResult): ContractBuilder<T>;
  
  /** Add dependencies */
  dependencies(dependencies: string[]): ContractBuilder<T>;
  
  /** Set metadata */
  metadata(metadata: Partial<TokenContract<T>['metadata']>): ContractBuilder<T>;
  
  /** Build the contract */
  build(): TokenContract<T>;
}

export class ContractBuilderImpl<T = any> implements ContractBuilder<T> {
  private contract: Partial<TokenContract<T>> = {
    metadata: {
      wcagCompliant: false,
      platformSupport: ['web'],
      performanceImpact: 'low',
      cacheable: true,
      version: '1.0.0'
    }
  };

  id(id: string): ContractBuilder<T> {
    this.contract.id = id;
    return this;
  }

  description(description: string): ContractBuilder<T> {
    this.contract.description = description;
    return this;
  }

  category(category: TokenContract['category']): ContractBuilder<T> {
    this.contract.category = category;
    return this;
  }

  resolver(resolver: (context: ExtendedThemeContext) => T): ContractBuilder<T> {
    this.contract.resolve = resolver;
    return this;
  }

  fallback(fallback: T): ContractBuilder<T> {
    this.contract.fallback = fallback;
    return this;
  }

  validator(validator: (value: T, context: ExtendedThemeContext) => ValidationResult): ContractBuilder<T> {
    this.contract.validate = validator;
    return this;
  }

  dependencies(dependencies: string[]): ContractBuilder<T> {
    this.contract.dependencies = dependencies;
    return this;
  }

  metadata(metadata: Partial<TokenContract<T>['metadata']>): ContractBuilder<T> {
    this.contract.metadata = { ...this.contract.metadata!, ...metadata };
    return this;
  }

  build(): TokenContract<T> {
    if (!this.contract.id || !this.contract.description || !this.contract.category || 
        !this.contract.resolve || this.contract.fallback === undefined) {
      throw new Error('Missing required contract properties');
    }

    return this.contract as TokenContract<T>;
  }
}

// ============================================================================
// CONTRACT FACTORIES
// ============================================================================

export interface ColorContractFactory {
  /** Create a background color contract */
  background(id: string, options?: {
    semantic?: ColorContract['semantic'];
    contrastTargets?: ColorContract['contrastTargets'];
  }): ColorContract;
  
  /** Create a text color contract */
  text(id: string, options?: {
    background: string;
    minRatio?: number;
    preferredRatio?: number;
  }): ColorContract;
  
  /** Create a semantic color contract */
  semantic(
    id: string,
    semantic: NonNullable<ColorContract['semantic']>,
    options?: {
      contrastTargets?: ColorContract['contrastTargets'];
    }
  ): ColorContract;
  
  /** Create a border color contract */
  border(id: string, options?: {
    background: string;
    minRatio?: number;
  }): ColorContract;
}

export interface SpacingContractFactory {
  /** Create a responsive spacing contract */
  responsive(id: string, baseValue: number, options?: {
    purpose?: SpacingContract['purpose'];
    touchTarget?: boolean;
  }): SpacingContract;
  
  /** Create a fixed spacing contract */
  fixed(id: string, value: number, options?: {
    purpose?: SpacingContract['purpose'];
  }): SpacingContract;
  
  /** Create a touch-target aware spacing contract */
  touchTarget(id: string, minSize: number): SpacingContract;
}

export interface TypographyContractFactory {
  /** Create a typography scale contract */
  scale(
    id: string,
    scale: TypographyContract['scale'],
    options?: {
      purpose?: TypographyContract['purpose'];
      readingContext?: TypographyContract['readingContext'];
    }
  ): TypographyContract;
  
  /** Create a custom typography contract */
  custom(
    id: string,
    baseSize: number,
    options?: {
      weight?: number;
      lineHeight?: number;
      letterSpacing?: number;
      fontFamily?: string;
      purpose?: TypographyContract['purpose'];
    }
  ): TypographyContract;
}

// ============================================================================
// THEME PROVIDER INTERFACE
// ============================================================================

export interface ThemeProvider {
  /** Current theme context */
  context: ExtendedThemeContext;
  
  /** Contract registry */
  registry: ContractRegistry;
  
  /** Update theme context */
  updateContext(updates: Partial<ExtendedThemeContext>): void;
  
  /** Resolve a token contract */
  resolve<T>(contractId: string): T;
  
  /** Resolve multiple contracts */
  resolveMany(contractIds: string[]): Record<string, any>;
  
  /** Subscribe to context changes */
  subscribe(callback: (context: ExtendedThemeContext) => void): () => void;
  
  /** Get theme CSS variables */
  getCSSVariables(): Record<string, string>;
  
  /** Get Tailwind CSS configuration */
  getTailwindConfig(): Record<string, any>;
  
  /** Validate current theme */
  validate(): Map<string, ValidationResult>;
}

// ============================================================================
// COMPONENT INTEGRATION TYPES
// ============================================================================

export interface ComponentThemeProps {
  /** Component variant */
  variant?: string;
  
  /** Component size */
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  
  /** Component state */
  state?: 'default' | 'hover' | 'active' | 'focus' | 'disabled' | 'loading' | 'error';
  
  /** Override theme context */
  themeOverride?: Partial<ExtendedThemeContext>;
  
  /** Contract overrides */
  contractOverrides?: Record<string, any>;
}

export interface ComponentTokens {
  /** Get resolved token value */
  get<T>(contractId: string): T;
  
  /** Get multiple token values */
  getMany(contractIds: string[]): Record<string, any>;
  
  /** Get CSS custom properties */
  getCSSProps(): Record<string, string>;
  
  /** Get inline styles */
  getStyles(): React.CSSProperties;
  
  /** Get Tailwind classes */
  getTailwindClasses(): string;
}

// ============================================================================
// SINGLETON INSTANCES
// ============================================================================

export const contractRegistry = new ContractRegistryImpl();

export function createContractBuilder<T = any>(): ContractBuilder<T> {
  return new ContractBuilderImpl<T>();
}