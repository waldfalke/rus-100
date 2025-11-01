/**
 * Design tokens index - exports all token definitions
 */

// Import all tokens first
import {
  brandPrimary,
  brandSecondary,
  background,
  foreground,
  foregroundMuted,
  surfacePrimary,
  surfaceSecondary,
  semanticSuccess,
  semanticWarning,
  semanticError,
  semanticInfo,
  borderDefault,
  borderFocus
} from './contracts/colors';

import {
  spacingXs,
  spacingSm,
  spacingMd,
  spacingLg,
  spacingXl,
  spacing2Xl,
  spacing3Xl,
  buttonPadding,
  cardPadding,
  containerMaxWidth,
  gridGap,
  radiusNone,
  radiusSm,
  radiusMd,
  radiusLg,
  radiusFull
} from './contracts/spacing';

import {
  fontSizeXs,
  fontSizeSm,
  fontSizeBase,
  fontSizeLg,
  fontSizeXl,
  fontSize2Xl,
  fontSize3Xl,
  fontWeightLight,
  fontWeightNormal,
  fontWeightMedium,
  fontWeightSemibold,
  fontWeightBold,
  lineHeightTight,
  lineHeightNormal,
  lineHeightRelaxed,
  letterSpacingTight,
  letterSpacingNormal,
  letterSpacingWide,
  headingTypography,
  bodyTypography
} from './contracts/typography';

import { pagePaddingX, pagePaddingY, gridMinItemWidthGroups, gridMinItemWidthTestForm } from './contracts/layout';

// Re-export all tokens
export {
  brandPrimary,
  brandSecondary,
  background,
  foreground,
  foregroundMuted,
  surfacePrimary,
  surfaceSecondary,
  semanticSuccess,
  semanticWarning,
  semanticError,
  semanticInfo,
  borderDefault,
  borderFocus,
  spacingXs,
  spacingSm,
  spacingMd,
  spacingLg,
  spacingXl,
  spacing2Xl,
  spacing3Xl,
  buttonPadding,
  cardPadding,
  containerMaxWidth,
  gridGap,
  radiusNone,
  radiusSm,
  radiusMd,
  radiusLg,
  radiusFull,
  fontSizeXs,
  fontSizeSm,
  fontSizeBase,
  fontSizeLg,
  fontSizeXl,
  fontSize2Xl,
  fontSize3Xl,
  fontWeightLight,
  fontWeightNormal,
  fontWeightMedium,
  fontWeightSemibold,
  fontWeightBold,
  lineHeightTight,
  lineHeightNormal,
  lineHeightRelaxed,
  letterSpacingTight,
  letterSpacingNormal,
  letterSpacingWide,
  headingTypography,
  bodyTypography,
  pagePaddingX,
  pagePaddingY,
  gridMinItemWidthGroups,
  gridMinItemWidthTestForm
};

// Elevation tokens
export * from './elevation';

// Spacing tokens
export * from './spacing';

// Border radius tokens
export * from './border-radius';

// Token collections
export const colorTokens = {
  brandPrimary,
  brandSecondary,
  background,
  foreground,
  surfacePrimary,
  surfaceSecondary,
  semanticSuccess,
  semanticWarning,
  semanticError,
  semanticInfo,
  borderDefault,
  borderFocus
};

export const spacingTokens = {
  spacingXs,
  spacingSm,
  spacingMd,
  spacingLg,
  spacingXl,
  spacing2Xl,
  spacing3Xl,
  buttonPadding,
  cardPadding,
  containerMaxWidth,
  gridGap,
  radiusNone,
  radiusSm,
  radiusMd,
  radiusLg,
  radiusFull
};

export const typographyTokens = {
  fontSizeXs,
  fontSizeSm,
  fontSizeBase,
  fontSizeLg,
  fontSizeXl,
  fontSize2Xl,
  fontSize3Xl,
  fontWeightLight,
  fontWeightNormal,
  fontWeightMedium,
  fontWeightSemibold,
  fontWeightBold,
  lineHeightTight,
  lineHeightNormal,
  lineHeightRelaxed,
  letterSpacingTight,
  letterSpacingNormal,
  letterSpacingWide,
  headingTypography,
  bodyTypography
};

// Re-export types
export type {
  ElevationLevel,
  ElevationVariant,
  ElevationShadowValues,
  ComponentElevationContext
} from '../theme-contracts/types';

export const layoutTokens = {
  pagePaddingX,
  pagePaddingY,
  gridMinItemWidthGroups,
  gridMinItemWidthTestForm
};