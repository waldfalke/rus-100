/**
 * Theme hooks index - exports all theme-related hooks
 */

export {
  useTheme,
  useToken,
  useTokens,
  useColorToken,
  useSpacingToken,
  useTokenStyles,
  createStyledComponent,
  withThemeTokens,
} from './useTheme';

export { usePerformance, useTokenBatch, useOptimizedTokens } from './usePerformance';

export type { UsePerformanceOptions, PerformanceHookResult } from './usePerformance';

export type {
  UseThemeReturn,
  UseTokenOptions,
} from './useTheme';