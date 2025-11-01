# Modernized Design Token System

## Overview

This document describes the comprehensive design token system implemented for the RUS100 project. The system provides a modern, accessible, and maintainable approach to design tokens using OKLCH color space, WCAG compliance validation, and context-aware token generation.

## Key Features

### 1. OKLCH Color Space
- **Perceptually uniform**: Colors appear more consistent to human vision
- **Wide gamut support**: Better color reproduction on modern displays
- **Predictable lightness**: Easier to create accessible color scales
- **Intuitive adjustments**: Separate controls for lightness, chroma, and hue

### 2. WCAG Compliance Validation
- Automated contrast ratio checking
- Support for AA and AAA compliance levels
- Real-time validation feedback
- Auto-fix suggestions for accessibility issues

### 3. Context-Aware Token Generation
- Theme-aware color generation (light/dark/high-contrast)
- Platform-specific adaptations (web/iOS/Android)
- Accessibility mode support
- User preference integration

### 4. Override and Fallback System
- Hierarchical token resolution
- Context-based overrides
- Graceful fallback mechanisms
- Runtime token customization

## Architecture

### Core Components

#### 1. OKLCH Color System (`lib/color/oklch.ts`)
```typescript
interface OKLCHColor {
  l: number; // Lightness (0-1)
  c: number; // Chroma (0-0.4+)
  h: number; // Hue (0-360)
}
```

#### 2. Palette Generator (`lib/color/palette-generator.ts`)
```typescript
const palette = paletteGenerator.generatePalette({
  brandColors: {
    primary: { l: 0.6, c: 0.15, h: 220 },
    secondary: { l: 0.7, c: 0.12, h: 160 }
  },
  mode: 'light',
  wcagLevel: 'AA',
  steps: 9,
  generateSemanticRoles: true
});
```

#### 3. WCAG Validator (`lib/accessibility/wcag-validator.ts`)
```typescript
const validation = wcagValidator.validatePalette(colorPairs, {
  level: 'AA',
  textSize: 'normal',
  componentType: 'text',
  includeNonText: true
});
```

#### 4. Override System (`lib/overrides/fallback-system.ts`)
```typescript
const enhancedPalette = fallbackOverrideSystem.applyOverridesToPalette(
  basePalette,
  themeContext
);
```

## Usage Examples

### Basic Palette Generation

```typescript
import { paletteGenerator } from './lib/color/palette-generator';

// Generate a complete color palette from brand colors
const palette = paletteGenerator.generatePalette({
  brandColors: {
    primary: { l: 0.6, c: 0.15, h: 220 }, // Blue
    secondary: { l: 0.7, c: 0.12, h: 160 } // Green
  },
  mode: 'light',
  wcagLevel: 'AA',
  steps: 9,
  generateSemanticRoles: true
});

// Access generated colors
console.log(palette.primary); // Array of 9 blue shades
console.log(palette.text.primary); // Accessible text color
console.log(palette.backgrounds.page); // Page background color
```

### WCAG Validation

```typescript
import { wcagValidator } from './lib/accessibility/wcag-validator';

// Validate color pairs for accessibility
const colorPairs = new Map([
  ['text-on-background', {
    foreground: { l: 0.2, c: 0.05, h: 220 },
    background: { l: 0.95, c: 0.02, h: 220 }
  }]
]);

const validation = wcagValidator.validatePalette(colorPairs, {
  level: 'AA',
  textSize: 'normal'
});

if (!validation.overallCompliance) {
  console.log('Accessibility issues found:', validation.results);
  console.log('Suggestions:', validation.autoFixSuggestions);
}
```

### Context-Aware Tokens

```typescript
import { fallbackOverrideSystem } from './lib/overrides/fallback-system';

const themeContext = {
  mode: 'dark',
  platform: 'web',
  accessibility: {
    mode: 'high-contrast',
    highContrast: true
  }
};

// Apply context-specific overrides
const contextualPalette = fallbackOverrideSystem.applyOverridesToPalette(
  basePalette,
  themeContext
);
```

## Demo and Testing

### Comprehensive Showcase
Visit `/demo/comprehensive-showcase` to see the complete system in action:

- **Interactive Controls**: Adjust brand colors, theme settings, and accessibility options
- **Real-time Generation**: See palette updates as you modify parameters
- **WCAG Testing**: View accessibility compliance results
- **Performance Metrics**: Monitor generation and validation performance
- **Override Management**: Test context-aware token resolution

### Features Demonstrated

1. **Brand Color Customization**
   - Lightness, chroma, and hue sliders
   - Real-time color preview
   - OKLCH value display

2. **Theme Adaptation**
   - Light/dark/high-contrast modes
   - Platform-specific variations
   - Accessibility mode support

3. **Palette Display**
   - Complete color scales
   - Semantic color roles
   - Background and text colors
   - Border variations

4. **Component Examples**
   - Buttons with proper contrast
   - Cards with accessible backgrounds
   - Form elements with validation states
   - Navigation with hover states

5. **Accessibility Testing**
   - WCAG compliance reports
   - Contrast ratio measurements
   - Auto-fix suggestions
   - Severity indicators

6. **Performance Monitoring**
   - Generation timing
   - Validation performance
   - Override application speed

## Best Practices

### 1. Color Selection
- Start with brand colors in OKLCH format
- Ensure sufficient chroma for brand recognition
- Test across different lightness values
- Consider color blindness accessibility

### 2. Accessibility
- Always validate against WCAG guidelines
- Use AAA level for critical text
- Test with actual users when possible
- Provide high-contrast alternatives

### 3. Performance
- Cache generated palettes when possible
- Use incremental validation for large palettes
- Monitor generation times in production
- Consider lazy loading for complex themes

### 4. Maintenance
- Document color decisions and rationale
- Version control token changes
- Test across all supported platforms
- Regular accessibility audits

## Integration

### CSS Custom Properties
```css
:root {
  --color-primary-50: oklch(0.95 0.02 220);
  --color-primary-500: oklch(0.6 0.15 220);
  --color-primary-900: oklch(0.2 0.1 220);
  
  --color-text-primary: oklch(0.2 0.05 220);
  --color-background-page: oklch(0.98 0.01 220);
}
```

### Tailwind CSS
```javascript
// tailwind.config.js
module.exports = {
  theme: {
    extend: {
      colors: {
        primary: {
          50: 'oklch(0.95 0.02 220)',
          500: 'oklch(0.6 0.15 220)',
          900: 'oklch(0.2 0.1 220)'
        }
      }
    }
  }
};
```

### React Components
```typescript
import { useTheme } from './lib/hooks/useTheme';

function Button({ variant = 'primary' }) {
  const { tokens } = useTheme();
  
  return (
    <button
      style={{
        backgroundColor: tokens.colors.primary[500],
        color: tokens.colors.text.inverse
      }}
    >
      Click me
    </button>
  );
}
```

## Testing

### Unit Tests
```bash
npm test -- --grep "palette-generator"
npm test -- --grep "wcag-validator"
npm test -- --grep "fallback-system"
```

### Accessibility Tests
```bash
npm test -- --grep "accessibility"
```

### Visual Regression Tests
```bash
npm run test:visual
```

## Future Enhancements

1. **Advanced Color Harmonies**
   - Triadic and tetradic color schemes
   - Analogous color generation
   - Complementary color suggestions

2. **Dynamic Theming**
   - User-customizable themes
   - Seasonal theme variations
   - Brand-specific theme templates

3. **Enhanced Accessibility**
   - Color blindness simulation
   - Motion sensitivity support
   - Screen reader optimizations

4. **Performance Optimizations**
   - Web Workers for complex calculations
   - Incremental palette updates
   - Caching strategies

5. **Design Tool Integration**
   - Figma plugin support
   - Sketch integration
   - Adobe XD compatibility

## Support and Contribution

For questions, issues, or contributions, please refer to the project repository and follow the established contribution guidelines.