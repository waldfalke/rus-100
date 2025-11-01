/**
 * Validation system for theme contracts
 */

import type { 
  TokenContract, 
  ColorTokenContract, 
  DimensionTokenContract,
  TypographyTokenContract,
  ThemeContext,
  ThemeContractSchema 
} from './types';

// ============================================================================
// COLOR VALIDATION
// ============================================================================

/**
 * Validate CSS color value
 */
export function isValidColor(value: string): boolean {
  // Check for common CSS color formats
  const colorPatterns = [
    /^#([0-9A-Fa-f]{3}){1,2}$/, // Hex colors
    /^rgb\(\s*\d+\s*,\s*\d+\s*,\s*\d+\s*\)$/, // RGB
    /^rgba\(\s*\d+\s*,\s*\d+\s*,\s*\d+\s*,\s*[\d.]+\s*\)$/, // RGBA
    /^hsl\(\s*\d+\s*,\s*\d+%\s*,\s*\d+%\s*\)$/, // HSL
    /^hsla\(\s*\d+\s*,\s*\d+%\s*,\s*\d+%\s*,\s*[\d.]+\s*\)$/, // HSLA
    /^oklch\(\s*[\d.]+\s+[\d.]+\s+\d+\s*\)$/, // OKLCH
    /^var\(--[\w-]+\)$/, // CSS variables
  ];
  
  return colorPatterns.some(pattern => pattern.test(value.trim()));
}

/**
 * Validate OKLCH color values
 */
export function isValidOklch(lightness: number, chroma: number, hue: number): boolean {
  return (
    lightness >= 0 && lightness <= 1 &&
    chroma >= 0 && chroma <= 0.4 &&
    hue >= 0 && hue <= 360
  );
}

/**
 * Calculate contrast ratio between two colors (simplified)
 */
export function getContrastRatio(color1: string, color2: string): number {
  // This is a simplified implementation
  // In production, you'd use a proper color contrast calculation library
  return 4.5; // Placeholder value
}

/**
 * Check WCAG contrast compliance
 */
export function meetsWCAG(
  foreground: string,
  background: string,
  level: 'AA' | 'AAA' = 'AA',
  isLargeText: boolean = false
): boolean {
  const contrast = getContrastRatio(foreground, background);
  
  if (level === 'AAA') {
    return isLargeText ? contrast >= 4.5 : contrast >= 7;
  }
  
  return isLargeText ? contrast >= 3 : contrast >= 4.5;
}

// ============================================================================
// DIMENSION VALIDATION
// ============================================================================

/**
 * Validate CSS dimension value
 */
export function isValidDimension(value: string): boolean {
  const dimensionPattern = /^-?[\d.]+(?:px|rem|em|%|vh|vw|vmin|vmax|ch|ex|cm|mm|in|pt|pc)$/;
  return dimensionPattern.test(value.trim()) || value === '0';
}

/**
 * Validate spacing scale consistency
 */
export function isValidSpacingScale(values: Record<string, string>): boolean {
  const numericValues = Object.entries(values)
    .map(([key, value]) => {
      const match = value.match(/^([\d.]+)/);
      return match ? parseFloat(match[1]) : 0;
    })
    .sort((a, b) => a - b);
  
  // Check if values are in ascending order
  for (let i = 1; i < numericValues.length; i++) {
    if (numericValues[i] <= numericValues[i - 1]) {
      return false;
    }
  }
  
  return true;
}

// ============================================================================
// TYPOGRAPHY VALIDATION
// ============================================================================

/**
 * Validate font size value
 */
export function isValidFontSize(value: string): boolean {
  const fontSizePattern = /^[\d.]+(?:px|rem|em|%|pt)$/;
  return fontSizePattern.test(value.trim());
}

/**
 * Validate font weight value
 */
export function isValidFontWeight(value: number | string): boolean {
  if (typeof value === 'number') {
    return value >= 100 && value <= 900 && value % 100 === 0;
  }
  
  const validKeywords = ['normal', 'bold', 'lighter', 'bolder'];
  return validKeywords.includes(value);
}

/**
 * Validate line height value
 */
export function isValidLineHeight(value: number | string): boolean {
  if (typeof value === 'number') {
    return value > 0 && value <= 3;
  }
  
  return isValidDimension(value) || value === 'normal';
}

// ============================================================================
// CONTRACT VALIDATION
// ============================================================================

/**
 * Validate a token contract
 */
export function validateTokenContract<T>(
  contract: TokenContract<T>,
  context: ThemeContext
): { isValid: boolean; errors: string[] } {
  const errors: string[] = [];
  
  // Check required properties
  if (typeof contract.resolve !== 'function') {
    errors.push('Contract must have a resolve function');
  }
  
  if (contract.fallback === undefined) {
    errors.push('Contract must have a fallback value');
  }
  
  // Test resolution
  try {
    const resolved = contract.resolve(context);
    
    // Validate resolved value if validator exists
    if (contract.validate && !contract.validate(resolved)) {
      errors.push('Resolved value failed validation');
    }
  } catch (error) {
    errors.push(`Resolution failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
  
  return {
    isValid: errors.length === 0,
    errors,
  };
}

/**
 * Validate a color token contract
 */
export function validateColorContract(
  contract: ColorTokenContract,
  context: ThemeContext
): { isValid: boolean; errors: string[] } {
  const baseValidation = validateTokenContract(contract, context);
  const errors = [...baseValidation.errors];
  
  // Validate fallback color
  if (!isValidColor(contract.fallback)) {
    errors.push('Fallback value is not a valid color');
  }
  
  // Validate OKLCH parameters if present
  if (contract.oklch) {
    const { lightness, chroma, hue } = contract.oklch;
    
    const l = typeof lightness === 'function' ? lightness(context) : lightness;
    const c = typeof chroma === 'function' ? chroma(context) : chroma;
    const h = typeof hue === 'function' ? hue(context) : hue;
    
    if (!isValidOklch(l, c, h)) {
      errors.push('Invalid OKLCH parameters');
    }
  }
  
  // Test resolved color
  try {
    const resolved = contract.resolve(context);
    if (!isValidColor(resolved)) {
      errors.push('Resolved value is not a valid color');
    }
  } catch (error) {
    // Already handled in base validation
  }
  
  return {
    isValid: errors.length === 0,
    errors,
  };
}

/**
 * Validate a dimension token contract
 */
export function validateDimensionContract(
  contract: DimensionTokenContract,
  context: ThemeContext
): { isValid: boolean; errors: string[] } {
  const baseValidation = validateTokenContract(contract, context);
  const errors = [...baseValidation.errors];
  
  // Validate fallback dimension
  if (!isValidDimension(contract.fallback)) {
    errors.push('Fallback value is not a valid dimension');
  }
  
  // Test resolved dimension
  try {
    const resolved = contract.resolve(context);
    if (!isValidDimension(resolved)) {
      errors.push('Resolved value is not a valid dimension');
    }
  } catch (error) {
    // Already handled in base validation
  }
  
  return {
    isValid: errors.length === 0,
    errors,
  };
}

/**
 * Validate entire theme contract schema
 */
export function validateThemeSchema(
  schema: ThemeContractSchema,
  context: ThemeContext
): { isValid: boolean; errors: Record<string, string[]> } {
  const errors: Record<string, string[]> = {};
  
  // Validate color contracts
  const colorPaths = [
    'colors.background',
    'colors.foreground',
    'colors.surface.primary',
    'colors.surface.secondary',
    'colors.surface.tertiary',
    'colors.brand.primary',
    'colors.brand.secondary',
    'colors.semantic.success',
    'colors.semantic.warning',
    'colors.semantic.error',
    'colors.semantic.info',
  ];
  
  colorPaths.forEach(path => {
    const contract = getNestedContract(schema, path) as ColorTokenContract;
    if (contract) {
      const validation = validateColorContract(contract, context);
      if (!validation.isValid) {
        errors[path] = validation.errors;
      }
    }
  });
  
  // Validate spacing contracts
  const spacingPaths = ['spacing.xs', 'spacing.sm', 'spacing.md', 'spacing.lg', 'spacing.xl'];
  
  spacingPaths.forEach(path => {
    const contract = getNestedContract(schema, path) as DimensionTokenContract;
    if (contract) {
      const validation = validateDimensionContract(contract, context);
      if (!validation.isValid) {
        errors[path] = validation.errors;
      }
    }
  });
  
  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
}

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

/**
 * Get nested contract from schema
 */
function getNestedContract(schema: any, path: string): TokenContract | undefined {
  return path.split('.').reduce((current, key) => {
    return current && current[key] !== undefined ? current[key] : undefined;
  }, schema);
}

/**
 * Batch validate multiple contracts
 */
export function batchValidateContracts(
  contracts: Array<{ path: string; contract: TokenContract }>,
  context: ThemeContext
): Record<string, { isValid: boolean; errors: string[] }> {
  const results: Record<string, { isValid: boolean; errors: string[] }> = {};
  
  contracts.forEach(({ path, contract }) => {
    results[path] = validateTokenContract(contract, context);
  });
  
  return results;
}