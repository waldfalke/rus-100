/**
 * Context-Aware Functional Design Tokens System
 * 
 * A revolutionary design token system where tokens are functions that resolve
 * based on context rather than static values. Components request needed 
 * properties through contracts, enabling true context-aware theming.
 */

// ============================================================================
// CORE EXPORTS
// ============================================================================

// Theme contracts and types
export * from './theme-contracts';

// Theme provider and context
export { ThemeProvider } from './providers/ThemeProvider';
// ThemeProviderProps is not exported from ThemeProvider module

// Hooks for theme consumption
export * from './hooks';

// Token contracts
export * from './tokens/contracts';

// Context-aware resolution system
export { 
  ContextResolver, 
  contextResolver,
  PlatformDetector,
  AccessibilityDetector,
  ContextBuilder,
  platformDetector,
  accessibilityDetector,
  contextBuilder,
  type ContextResolutionRule,
  type PlatformAdaptation,
  type AccessibilityAdaptation,
  type PlatformInfo,
  type AccessibilityPreferences,
} from './context';

// OKLCH color system
export * from './color';

// Export testing utilities
export {
  TokenValidator,
  DEFAULT_VALIDATION_RULES,
} from './testing';

export type {
  ValidationResult,
  ValidationError,
  ValidationWarning,
  ValidationMetrics,
  ValidationConfig,
  ValidationRule,
  ValidationReport,
} from './testing';

// Example components
export * from './components';

// ============================================================================
// CONVENIENCE RE-EXPORTS
// ============================================================================

// Most commonly used types
export type {
  ThemeContext,
  TokenContract,
  ColorTokenContract,
  DimensionTokenContract,
  TypographyTokenContract,
  ThemeContractSchema,
} from './theme-contracts/types';

// Most commonly used hooks
export {
  useTheme,
  useToken,
  useTokens,
  useColorToken,
  useSpacingToken,
} from './hooks/useTheme';

// ============================================================================
// VERSION AND METADATA
// ============================================================================

export const DESIGN_TOKENS_VERSION = '1.0.0';

export const SYSTEM_METADATA = {
  name: 'Context-Aware Functional Design Tokens',
  version: DESIGN_TOKENS_VERSION,
  description: 'Functional design tokens with context-aware resolution',
  features: [
    'Contract-based token definitions',
    'Runtime context resolution',
    'OKLCH color space support',
    'Platform-aware adaptations',
    'Accessibility-first design',
    'Performance-optimized caching',
    'Type-safe token consumption',
  ],
  compatibility: {
    react: '>=18.0.0',
    typescript: '>=4.9.0',
    tailwind: '>=3.0.0',
  },
} as const;