/**
 * Context-Aware Functional Design Tokens System
 * Main export file for theme contracts
 */

// Core types
export type {
  ThemeMode,
  Platform,
  ContrastLevel,
  MotionPreference,
  ComponentState,
  ComponentSize,
  ComponentVariant,
  ThemeContext,
  TokenContract,
  ColorTokenContract,
  DimensionTokenContract,
  TypographyTokenContract,
  ThemeContractSchema,
  ThemeProviderConfig,
  CacheEntry,
  ThemeResolver,
} from './types';

// Extended contract-driven architecture types
export type {
  ValidationResult,
  ContractResolutionResult,
  ColorContract,
  SpacingContract,
  TypographyContract,
  ContractRegistry,
  ContractBuilder,
  ColorContractFactory,
  SpacingContractFactory,
  TypographyContractFactory,
  ThemeProvider,
  ComponentThemeProps,
  ComponentTokens,
} from './contracts';

// Utilities
export {
  oklch,
  generateOklchPalette,
  adjustColorForPlatform,
  increaseContrast,
  meetsWCAGContrast,
  createContextHash,
  mergeContext,
  getDefaultContext,
  getNestedValue,
  setNestedValue,
  isValidTokenPath,
  memoize,
  debounce,
} from './utils';

// Validation
export {
  isValidColor,
  isValidOklch,
  getContrastRatio,
  meetsWCAG,
  isValidDimension,
  isValidSpacingScale,
  isValidFontSize,
  isValidFontWeight,
  isValidLineHeight,
  validateTokenContract,
  validateColorContract,
  validateDimensionContract,
  validateThemeSchema,
  batchValidateContracts,
} from './validation';