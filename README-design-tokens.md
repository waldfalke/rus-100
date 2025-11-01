# Design Token System - Quick Start Guide

## 🎨 Modern Design Tokens with OKLCH & WCAG Compliance

This project features a comprehensive design token system built with modern web standards and accessibility in mind.

## ✨ Key Features

- **OKLCH Color Space**: Perceptually uniform colors with better accessibility
- **WCAG Compliance**: Automated accessibility validation (AA/AAA levels)
- **Context-Aware**: Adaptive tokens based on theme, platform, and user preferences
- **Override System**: Hierarchical token resolution with fallbacks
- **Real-time Validation**: Instant feedback on color accessibility

## 🚀 Quick Start

### 1. Generate a Color Palette

```typescript
import { paletteGenerator } from './lib/color/palette-generator';

const palette = paletteGenerator.generatePalette({
  brandColors: {
    primary: { l: 0.6, c: 0.15, h: 220 },   // Blue
    secondary: { l: 0.7, c: 0.12, h: 160 }  // Green
  },
  mode: 'light',
  wcagLevel: 'AA',
  steps: 9,
  generateSemanticRoles: true
});
```

### 2. Validate Accessibility

```typescript
import { wcagValidator } from './lib/accessibility/wcag-validator';

const validation = wcagValidator.validateColorPair(
  textColor,
  backgroundColor,
  { contrastRequirements: { normal: 4.5 } }
);

if (!validation.passes) {
  console.log('Contrast ratio too low:', validation.contrastRatio);
}
```

### 3. Apply Context Overrides

```typescript
import { fallbackOverrideSystem } from './lib/overrides/fallback-system';

const contextualPalette = fallbackOverrideSystem.applyOverridesToPalette(
  basePalette,
  {
    mode: 'dark',
    platform: 'web',
    accessibility: { highContrast: true }
  }
);
```

## 🎯 Demo

Visit the comprehensive showcase to see all features in action:

```bash
npm run dev
# Open http://localhost:3000/demo/comprehensive-showcase
```

### Demo Features:
- Interactive color controls
- Real-time palette generation
- WCAG compliance testing
- Performance monitoring
- Override system demonstration

## 📁 Project Structure

```
lib/
├── color/
│   ├── oklch.ts              # OKLCH color utilities
│   └── palette-generator.ts  # Main palette generator
├── accessibility/
│   └── wcag-validator.ts     # WCAG compliance validation
├── overrides/
│   └── fallback-system.ts    # Context-aware overrides
└── theme-contracts/
    └── index.ts              # Theme context types
```

## 🎨 OKLCH Color Format

OKLCH provides better color consistency and accessibility:

```typescript
interface OKLCHColor {
  l: number; // Lightness (0-1)
  c: number; // Chroma (0-0.4+)
  h: number; // Hue (0-360)
}

// Example: Accessible blue
const blue = { l: 0.6, c: 0.15, h: 220 };
```

## ♿ Accessibility Features

- **Automated WCAG Testing**: AA/AAA compliance validation
- **Contrast Ratio Calculation**: Real-time accessibility feedback
- **Auto-fix Suggestions**: Recommendations for accessibility improvements
- **High Contrast Support**: Enhanced visibility options

## 🔧 Configuration

### Palette Generation Options

```typescript
interface PaletteGenerationConfig {
  brandColors: BrandColorPair;
  mode: 'light' | 'dark' | 'high-contrast';
  wcagLevel: 'AA' | 'AAA';
  steps: number;
  generateSemanticRoles: boolean;
  adjustments?: {
    lightnessRange?: [number, number];
    chromaBoost?: number;
    hueShift?: number;
  };
}
```

### Theme Context

```typescript
interface ThemeContext {
  mode: 'light' | 'dark' | 'high-contrast';
  platform: 'web' | 'ios' | 'android';
  accessibility: {
    mode: 'standard' | 'high-contrast' | 'low-vision';
    highContrast: boolean;
    reduceMotion: boolean;
  };
}
```

## 📊 Performance

The system is optimized for performance:
- **Fast Generation**: ~10ms for complete palettes
- **Efficient Validation**: Batch processing for multiple colors
- **Caching Support**: Reuse generated palettes
- **Incremental Updates**: Only regenerate changed colors

## 🧪 Testing

```bash
# Run all tests
npm test

# Test specific components
npm test -- --grep "palette-generator"
npm test -- --grep "wcag-validator"
npm test -- --grep "accessibility"
```

## 📚 Documentation

For detailed documentation, see:
- [Complete Documentation](./docs/design-token-system.md)
- [API Reference](./docs/api-reference.md)
- [Examples](./pages/demo/)

## 🤝 Contributing

1. Follow the existing code style
2. Add tests for new features
3. Ensure WCAG compliance
4. Update documentation

## 📄 License

This project is licensed under the MIT License.