/**
 * Export Design Tokens Script
 *
 * This script exports all design tokens to a JSON file
 * Useful for:
 * - Design tools integration (Figma, Sketch)
 * - Documentation generation
 * - Version control of token values
 *
 * Usage:
 * ```bash
 * npx tsx src/design-system/scripts/export-tokens.ts
 * ```
 */

import * as fs from 'fs';
import * as path from 'path';
import * as primitives from '../tokens/primitives';
import * as semantic from '../tokens/semantic';
import type { TokenExport } from '../types';

const OUTPUT_DIR = path.join(process.cwd(), 'design-tokens-export');
const OUTPUT_FILE = path.join(OUTPUT_DIR, 'tokens.json');

/**
 * Convert tokens to JSON-serializable format
 */
function serializeTokens(obj: any): any {
  if (typeof obj !== 'object' || obj === null) {
    return obj;
  }

  if (Array.isArray(obj)) {
    return obj.map(serializeTokens);
  }

  const result: any = {};
  for (const [key, value] of Object.entries(obj)) {
    result[key] = serializeTokens(value);
  }
  return result;
}

/**
 * Main export function
 */
function exportTokens() {
  console.log('🎨 Exporting design tokens...\n');

  // Create output directory if it doesn't exist
  if (!fs.existsSync(OUTPUT_DIR)) {
    fs.mkdirSync(OUTPUT_DIR, { recursive: true });
  }

  // Prepare token export
  const tokenExport: TokenExport = {
    version: '1.0.0',
    lastUpdated: new Date().toISOString(),
    tokens: {
      primitives: {
        colors: serializeTokens(primitives.primitiveColors),
        spacing: serializeTokens(primitives.primitiveSpacing),
        sizes: serializeTokens(primitives.primitiveSizes),
        iconSizes: serializeTokens(primitives.primitiveIconSizes),
        fontFamilies: serializeTokens(primitives.primitiveFontFamilies),
        fontSizes: serializeTokens(primitives.primitiveFontSizes),
        fontWeights: serializeTokens(primitives.primitiveFontWeights),
        lineHeights: serializeTokens(primitives.primitiveLineHeights),
        letterSpacing: serializeTokens(primitives.primitiveLetterSpacing),
        shadows: serializeTokens(primitives.primitiveShadows),
        dropShadows: serializeTokens(primitives.primitiveDropShadows),
        borderWidths: serializeTokens(primitives.primitiveBorderWidths),
        borderRadii: serializeTokens(primitives.primitiveBorderRadii),
        borderStyles: serializeTokens(primitives.primitiveBorderStyles),
        animationDurations: serializeTokens(primitives.primitiveAnimationDurations),
        animationEasings: serializeTokens(primitives.primitiveAnimationEasings),
        animationDelays: serializeTokens(primitives.primitiveAnimationDelays),
        keyframes: serializeTokens(primitives.primitiveKeyframes),
        zIndices: serializeTokens(primitives.primitiveZIndices),
      },
      semantic: {
        colors: {
          light: serializeTokens(semantic.lightSemanticColors),
          dark: serializeTokens(semantic.darkSemanticColors),
        },
        components: {
          button: serializeTokens(semantic.buttonTokens),
          input: serializeTokens(semantic.inputTokens),
          card: serializeTokens(semantic.cardTokens),
          modal: serializeTokens(semantic.modalTokens),
          toast: serializeTokens(semantic.toastTokens),
          dropdown: serializeTokens(semantic.dropdownTokens),
          badge: serializeTokens(semantic.badgeTokens),
          avatar: serializeTokens(semantic.avatarTokens),
          sidebar: serializeTokens(semantic.sidebarTokens),
          tooltip: serializeTokens(semantic.tooltipTokens),
        },
      },
      components: {},
    },
  };

  // Write to file
  fs.writeFileSync(OUTPUT_FILE, JSON.stringify(tokenExport, null, 2), 'utf-8');

  console.log('✅ Design tokens exported successfully!');
  console.log(`📁 Location: ${OUTPUT_FILE}`);
  console.log(`📊 Total tokens: ${countTokens(tokenExport.tokens)}`);
}

/**
 * Count total number of tokens
 */
function countTokens(obj: any): number {
  let count = 0;

  function traverse(value: any) {
    if (typeof value === 'object' && value !== null) {
      if (Array.isArray(value)) {
        value.forEach(traverse);
      } else {
        Object.values(value).forEach(traverse);
      }
    } else {
      count++;
    }
  }

  traverse(obj);
  return count;
}

// Run the export
try {
  exportTokens();
} catch (error) {
  console.error('❌ Error exporting tokens:', error);
  process.exit(1);
}
