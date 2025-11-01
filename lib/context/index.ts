/**
 * Context-aware token resolution system exports
 */

export { 
  ContextResolver, 
  contextResolver 
} from './ContextResolver';

export {
  PlatformDetector,
  AccessibilityDetector,
  ContextBuilder,
  platformDetector,
  accessibilityDetector,
  contextBuilder,
} from './PlatformDetector';

export type {
  ContextResolutionRule,
  PlatformAdaptation,
  AccessibilityAdaptation,
} from './ContextResolver';

export type {
  PlatformInfo,
  AccessibilityPreferences,
} from './PlatformDetector';