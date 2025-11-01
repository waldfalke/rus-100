# Elevation and Soft Shadow Token System

A comprehensive, context-aware elevation token system that dynamically generates soft shadows based on semantic elevation levels, theme context, and accessibility preferences.

## Table of Contents

- [Overview](#overview)
- [Core Concepts](#core-concepts)
- [Installation & Setup](#installation--setup)
- [Basic Usage](#basic-usage)
- [Advanced Usage](#advanced-usage)
- [API Reference](#api-reference)
- [Design Guidelines](#design-guidelines)
- [Accessibility](#accessibility)
- [Testing](#testing)
- [Migration Guide](#migration-guide)
- [Troubleshooting](#troubleshooting)

## Overview

The elevation token system provides a functional, contract-driven approach to managing visual depth and hierarchy in your UI through dynamically calculated soft shadows. It integrates seamlessly with your existing design token system and supports:

- **Context-Aware Resolution**: Shadows adapt to theme mode, component size, platform, and accessibility preferences
- **Semantic Elevation Levels**: Predefined elevation levels (0-5) with automatic shadow calculation
- **Component-Specific Presets**: Automatic elevation assignment for common UI components
- **Accessibility Compliance**: WCAG-compliant shadow adjustments for high contrast and reduced motion
- **Multi-Platform Support**: Platform-specific shadow optimizations for web, mobile, and desktop
- **Performance Optimized**: Efficient shadow calculation with built-in caching

## Core Concepts

### Elevation Levels

The system defines 6 elevation levels (0-5) that correspond to different UI hierarchy needs:

| Level | Usage | Examples |
|-------|-------|----------|
| 0 | No elevation - flat surfaces | Base backgrounds, dividers |
| 1 | Subtle elevation | Cards, buttons, form inputs |
| 2 | Moderate elevation | Dropdowns, menus, raised cards |
| 3 | Prominent elevation | Tooltips, floating elements |
| 4 | High elevation | Modals, overlays, dialogs |
| 5 | Maximum elevation | Critical overlays, system alerts |

### Shadow Variants

Four shadow intensity variants provide fine-grained control:

- **Subtle**: Minimal shadow intensity for delicate interfaces
- **Moderate**: Standard shadow intensity for most use cases
- **Prominent**: Enhanced shadow intensity for emphasis
- **Dramatic**: Maximum shadow intensity for high-impact elements

### Context Parameters

Elevation tokens adapt to runtime context:

```typescript
interface ComponentElevationContext {
  level: ElevationLevel;        // 0-5 elevation level
  variant: ElevationVariant;    // Shadow intensity variant
  size: ComponentSize;          // Component size (xs, sm, md, lg, xl)
  platform: Platform;           // Target platform (web, mobile, desktop)
}
```

## Installation & Setup

### 1. Import the Elevation System

```typescript
// Core elevation functions
import {
  getElevationShadow,
  calculateShadowParameters,
  generateElevationCSS,
  generateElevationTailwind,
  ELEVATION_PRESETS
} from '@/lib/tokens/elevation';

// React hooks
import { 
  useElevation, 
  useComponentElevation, 
  useElevationPresets 
} from '@/lib/hooks/use-elevation';

// TypeScript types
import type {
  ElevationLevel,
  ElevationVariant,
  ComponentElevationContext,
  ElevationShadow
} from '@/lib/theme-contracts/types';
```

### 2. Configure Theme Integration

Add elevation tokens to your theme configuration:

```typescript
// theme.config.ts
export const themeConfig = {
  elevation: {
    // Static elevation levels
    0: { resolve: (context) => getElevationShadow(0, context) },
    1: { resolve: (context) => getElevationShadow(1, context) },
    2: { resolve: (context) => getElevationShadow(2, context) },
    3: { resolve: (context) => getElevationShadow(3, context) },
    4: { resolve: (context) => getElevationShadow(4, context) },
    5: { resolve: (context) => getElevationShadow(5, context) },
    
    // Functional contracts
    getLevel: (level: ElevationLevel, context: ComponentElevationContext) => 
      getElevationShadow(level, context),
    getSemantic: (component: string) => 
      ELEVATION_PRESETS[component] || ELEVATION_PRESETS.surface
  }
};
```

## Basic Usage

### Using React Hooks

The simplest way to use elevation tokens is through React hooks:

```tsx
import { useComponentElevation } from '@/lib/hooks/use-elevation';

function Card({ children, variant = 'moderate' }) {
  const { shadowCSS, level } = useComponentElevation('card', { variant });
  
  return (
    <div 
      className="bg-white rounded-lg p-4"
      style={{ boxShadow: shadowCSS }}
    >
      {children}
    </div>
  );
}
```

### Manual Elevation Control

For more control, use the elevation hook directly:

```tsx
import { useElevation } from '@/lib/hooks/use-elevation';

function CustomComponent() {
  const elevation = useElevation({
    accessibility: {
      highContrast: false,
      reducedMotion: false
    },
    platform: 'web'
  });
  
  const [currentLevel, setCurrentLevel] = useState(1);
  
  const shadowCSS = elevation.getLevel(currentLevel, {
    level: currentLevel,
    variant: 'moderate',
    size: 'md',
    platform: 'web'
  });
  
  return (
    <div style={{ boxShadow: shadowCSS }}>
      <button onClick={() => setCurrentLevel(prev => Math.min(5, prev + 1))}>
        Increase Elevation
      </button>
    </div>
  );
}
```

### CSS Custom Properties

Generate CSS custom properties for use in stylesheets:

```tsx
import { generateElevationCSS } from '@/lib/tokens/elevation';

function Component() {
  const context = {
    level: 2,
    variant: 'moderate',
    size: 'md',
    platform: 'web'
  };
  
  const cssProperties = generateElevationCSS(2, context);
  
  return (
    <div style={cssProperties} className="elevated-component">
      Content with CSS custom properties
    </div>
  );
}

// CSS
.elevated-component {
  box-shadow: var(--elevation-shadow);
  /* Additional styles using:
     --elevation-shadow-ambient
     --elevation-shadow-directional
     --elevation-level
  */
}
```

### Tailwind CSS Integration

Generate Tailwind utility classes:

```tsx
import { generateElevationTailwind } from '@/lib/tokens/elevation';

function Component() {
  const context = {
    level: 3,
    variant: 'prominent',
    size: 'lg',
    platform: 'web'
  };
  
  const tailwindClasses = generateElevationTailwind(3, context);
  
  return (
    <div className={`bg-white rounded-lg ${tailwindClasses.boxShadow}`}>
      Content with Tailwind classes
    </div>
  );
}
```

## Advanced Usage

### Context-Aware Elevation

Adapt elevation to different contexts automatically:

```tsx
import { useElevation } from '@/lib/hooks/use-elevation';

function AdaptiveCard({ children, priority = 'normal' }) {
  const elevation = useElevation({
    accessibility: {
      highContrast: window.matchMedia('(prefers-contrast: high)').matches,
      reducedMotion: window.matchMedia('(prefers-reduced-motion: reduce)').matches
    },
    platform: detectPlatform() // Custom platform detection
  });
  
  // Adjust elevation based on priority
  const level = priority === 'high' ? 3 : priority === 'low' ? 1 : 2;
  
  const shadowCSS = elevation.getLevel(level, {
    level,
    variant: priority === 'high' ? 'prominent' : 'moderate',
    size: 'md',
    platform: 'web'
  });
  
  return (
    <div style={{ boxShadow: shadowCSS }}>
      {children}
    </div>
  );
}
```

### Theme-Responsive Elevation

Automatically adapt to theme changes:

```tsx
import { useTheme } from '@/lib/hooks/use-theme';
import { useElevation } from '@/lib/hooks/use-elevation';

function ThemedCard({ children }) {
  const { theme } = useTheme();
  const elevation = useElevation();
  
  const shadowCSS = elevation.getLevel(2, {
    level: 2,
    variant: theme.mode === 'dark' ? 'prominent' : 'moderate',
    size: 'md',
    platform: 'web'
  });
  
  return (
    <div 
      className={`p-4 rounded-lg ${theme.mode === 'dark' ? 'bg-gray-800' : 'bg-white'}`}
      style={{ boxShadow: shadowCSS }}
    >
      {children}
    </div>
  );
}
```

### Elevation Hierarchy Validation

Ensure proper elevation hierarchy in complex layouts:

```tsx
import { useElevation } from '@/lib/hooks/use-elevation';

function LayeredInterface() {
  const elevation = useElevation();
  
  const components = [
    { type: 'surface', level: 0 },
    { type: 'card', level: 1 },
    { type: 'dropdown', level: 2 },
    { type: 'tooltip', level: 3 }
  ];
  
  // Validate hierarchy
  const contexts = components.map(comp => ({
    level: comp.level,
    variant: 'moderate' as const,
    size: 'md' as const,
    platform: 'web' as const
  }));
  
  const validation = elevation.validateHierarchy(contexts);
  
  if (!validation.isValid) {
    console.warn('Elevation hierarchy violations:', validation.violations);
  }
  
  return (
    <div>
      {components.map((comp, index) => {
        const shadowCSS = elevation.getLevel(comp.level, contexts[index]);
        return (
          <div key={comp.type} style={{ boxShadow: shadowCSS }}>
            {comp.type} (Level {comp.level})
          </div>
        );
      })}
    </div>
  );
}
```

### Custom Elevation Presets

Create custom elevation presets for your components:

```tsx
import { ELEVATION_PRESETS } from '@/lib/tokens/elevation';

// Extend existing presets
const customPresets = {
  ...ELEVATION_PRESETS,
  'custom-panel': {
    level: 2,
    variant: 'prominent',
    description: 'Custom panel with enhanced shadow'
  },
  'floating-toolbar': {
    level: 4,
    variant: 'dramatic',
    description: 'Floating toolbar with high elevation'
  }
};

function CustomPanel({ children }) {
  const { shadowCSS } = useComponentElevation('custom-panel');
  
  return (
    <div style={{ boxShadow: shadowCSS }}>
      {children}
    </div>
  );
}
```

## API Reference

### Core Functions

#### `getElevationShadow(level, context)`

Generates complete shadow information for a given elevation level and context.

```typescript
function getElevationShadow(
  level: ElevationLevel,
  context: ComponentElevationContext
): ElevationShadow;
```

**Parameters:**
- `level`: Elevation level (0-5)
- `context`: Component context including variant, size, and platform

**Returns:**
```typescript
interface ElevationShadow {
  css: string;           // Complete CSS box-shadow string
  ambient: string;       // Ambient shadow component
  directional: string;   // Directional shadow component
  combined: string;      // Combined shadow (ambient + directional)
  parameters: {
    blur: number;
    spread: number;
    offsetY: number;
    color: string;
    opacity: number;
  };
}
```

#### `calculateShadowParameters(level, context)`

Calculates individual shadow parameters for custom shadow construction.

```typescript
function calculateShadowParameters(
  level: ElevationLevel,
  context: ComponentElevationContext
): ShadowParameters;
```

#### `generateElevationCSS(level, context)`

Generates CSS custom properties for elevation.

```typescript
function generateElevationCSS(
  level: ElevationLevel,
  context: ComponentElevationContext
): Record<string, string>;
```

**Returns:**
```typescript
{
  '--elevation-shadow': string;
  '--elevation-shadow-ambient': string;
  '--elevation-shadow-directional': string;
  '--elevation-level': string;
}
```

#### `generateElevationTailwind(level, context)`

Generates Tailwind utility classes for elevation.

```typescript
function generateElevationTailwind(
  level: ElevationLevel,
  context: ComponentElevationContext
): { boxShadow: string; elevation: string };
```

### React Hooks

#### `useElevation(options?)`

Primary hook for accessing elevation functionality.

```typescript
function useElevation(options?: UseElevationOptions): ElevationTokens;

interface UseElevationOptions {
  accessibility?: {
    highContrast?: boolean;
    reducedMotion?: boolean;
    prefersReducedData?: boolean;
  };
  platform?: 'web' | 'mobile' | 'desktop';
  generateCSS?: boolean;
  generateTailwind?: boolean;
}

interface ElevationTokens {
  getLevel: (level: ElevationLevel, context: ComponentElevationContext) => string;
  getShadow: (level: ElevationLevel, context: ComponentElevationContext) => ElevationShadow;
  getSemantic: (component: string) => ElevationLevel;
  validateHierarchy: (contexts: ComponentElevationContext[]) => ValidationResult;
  generateCSS: (level: ElevationLevel, context: ComponentElevationContext) => Record<string, string>;
  generateTailwind: (level: ElevationLevel, context: ComponentElevationContext) => { boxShadow: string; elevation: string };
}
```

#### `useComponentElevation(component, options?)`

Simplified hook for component-specific elevation.

```typescript
function useComponentElevation(
  component: string,
  options?: Partial<ComponentElevationContext> & {
    accessibility?: AccessibilityPreferences;
  }
): {
  shadowCSS: string;
  level: ElevationLevel;
  shadow: ElevationShadow;
};
```

#### `useElevationPresets()`

Hook for accessing predefined elevation presets.

```typescript
function useElevationPresets(): Record<string, ElevationPreset>;

interface ElevationPreset {
  level: ElevationLevel;
  variant: ElevationVariant;
  description: string;
}
```

### Constants and Presets

#### `ELEVATION_PRESETS`

Predefined elevation configurations for common components:

```typescript
const ELEVATION_PRESETS = {
  surface: { level: 0, variant: 'subtle' },
  card: { level: 1, variant: 'moderate' },
  button: { level: 1, variant: 'subtle' },
  dropdown: { level: 2, variant: 'moderate' },
  menu: { level: 2, variant: 'moderate' },
  tooltip: { level: 3, variant: 'prominent' },
  modal: { level: 4, variant: 'dramatic' },
  overlay: { level: 4, variant: 'dramatic' },
  fab: { level: 3, variant: 'prominent' },
  snackbar: { level: 3, variant: 'moderate' }
};
```

## Design Guidelines

### Elevation Hierarchy Principles

1. **Consistent Hierarchy**: Maintain logical elevation order throughout your interface
2. **Semantic Meaning**: Use elevation to reinforce content hierarchy and importance
3. **Contextual Appropriateness**: Choose elevation levels that match user expectations
4. **Accessibility First**: Ensure shadows enhance rather than hinder accessibility

### Best Practices

#### ✅ Do

- Use elevation to guide user attention and establish visual hierarchy
- Maintain consistent elevation levels for similar components
- Test elevation appearance across different themes and accessibility modes
- Validate elevation hierarchy in complex layouts
- Use semantic component presets when available

#### ❌ Don't

- Overuse high elevation levels (4-5) - reserve for critical overlays
- Create elevation conflicts where child elements have higher elevation than parents
- Ignore accessibility preferences when implementing elevation
- Use elevation as the only means of visual differentiation
- Apply elevation to every element - use it purposefully

### Component-Specific Guidelines

#### Cards and Surfaces
```tsx
// ✅ Good: Appropriate elevation for content cards
<Card elevation={1} variant="moderate">
  <CardContent>...</CardContent>
</Card>

// ❌ Avoid: Excessive elevation for simple content
<Card elevation={4} variant="dramatic">
  <CardContent>Simple text content</CardContent>
</Card>
```

#### Modals and Overlays
```tsx
// ✅ Good: High elevation for modal overlays
<Modal elevation={4} variant="dramatic">
  <ModalContent>...</ModalContent>
</Modal>

// ✅ Good: Progressive elevation for nested modals
<Modal elevation={4}>
  <NestedModal elevation={5}>...</NestedModal>
</Modal>
```

#### Interactive Elements
```tsx
// ✅ Good: Subtle elevation for buttons
<Button elevation={1} variant="subtle">
  Click me
</Button>

// ✅ Good: Increased elevation on hover/focus
<Button 
  elevation={1} 
  hoverElevation={2}
  variant="moderate"
>
  Interactive button
</Button>
```

### Platform Considerations

#### Web
- Standard shadow blur and spread values
- Optimized for mouse and keyboard interaction
- Full accessibility feature support

#### Mobile
- Slightly reduced shadow intensity for smaller screens
- Touch-optimized elevation feedback
- Consideration for battery and performance

#### Desktop
- Enhanced shadow definition for high-DPI displays
- Optimized for precise cursor interaction
- Full feature set available

## Accessibility

### WCAG Compliance

The elevation system is designed to meet WCAG 2.1 AA standards:

- **Contrast**: Shadows maintain sufficient contrast ratios in all themes
- **Motion**: Respects `prefers-reduced-motion` for shadow transitions
- **High Contrast**: Adapts shadow intensity for high contrast modes
- **Focus Indicators**: Preserves focus visibility with elevation changes

### Accessibility Features

#### High Contrast Mode
```tsx
// Automatic adaptation to high contrast preferences
const elevation = useElevation({
  accessibility: {
    highContrast: window.matchMedia('(prefers-contrast: high)').matches
  }
});
```

#### Reduced Motion
```tsx
// Respects reduced motion preferences
const elevation = useElevation({
  accessibility: {
    reducedMotion: window.matchMedia('(prefers-reduced-motion: reduce)').matches
  }
});
```

#### Reduced Data
```tsx
// Optimizes for reduced data usage
const elevation = useElevation({
  accessibility: {
    prefersReducedData: window.matchMedia('(prefers-reduced-data: reduce)').matches
  }
});
```

### Testing Accessibility

```tsx
// Test component with accessibility features
import { render, screen } from '@testing-library/react';
import { axe, toHaveNoViolations } from 'jest-axe';

expect.extend(toHaveNoViolations);

test('elevation component is accessible', async () => {
  const { container } = render(
    <ElevatedCard level={2}>
      Accessible content
    </ElevatedCard>
  );
  
  const results = await axe(container);
  expect(results).toHaveNoViolations();
});
```

## Testing

### Unit Testing

```typescript
import { getElevationShadow, validateElevationHierarchy } from '@/lib/tokens/elevation';

describe('Elevation System', () => {
  test('generates valid shadow CSS', () => {
    const shadow = getElevationShadow(2, {
      level: 2,
      variant: 'moderate',
      size: 'md',
      platform: 'web'
    });
    
    expect(shadow.css).toMatch(/^\d+px \d+px \d+px \d+px .+$/);
    expect(shadow.parameters.blur).toBeGreaterThan(0);
    expect(shadow.parameters.opacity).toBeBetween(0, 1);
  });
  
  test('validates elevation hierarchy', () => {
    const contexts = [
      { level: 0, variant: 'moderate', size: 'md', platform: 'web' },
      { level: 1, variant: 'moderate', size: 'md', platform: 'web' },
      { level: 2, variant: 'moderate', size: 'md', platform: 'web' }
    ];
    
    const result = validateElevationHierarchy(contexts);
    expect(result.isValid).toBe(true);
    expect(result.violations).toHaveLength(0);
  });
});
```

### Visual Regression Testing

```typescript
// Playwright visual tests
import { test, expect } from '@playwright/test';

test('elevation levels render consistently', async ({ page }) => {
  await page.goto('/elevation-demo');
  
  // Take screenshot of elevation showcase
  const showcase = page.locator('[data-testid="elevation-showcase"]');
  await expect(showcase).toHaveScreenshot('elevation-levels.png');
});
```

### Accessibility Testing

```typescript
import { render } from '@testing-library/react';
import { axe } from 'jest-axe';

test('elevation system meets accessibility standards', async () => {
  const { container } = render(<ElevationDemo />);
  const results = await axe(container);
  expect(results).toHaveNoViolations();
});
```

## Migration Guide

### From Static Shadows

If you're migrating from static shadow utilities:

```tsx
// Before: Static shadow classes
<div className="shadow-md">Content</div>

// After: Dynamic elevation tokens
const { shadowCSS } = useComponentElevation('card');
<div style={{ boxShadow: shadowCSS }}>Content</div>
```

### From CSS Variables

If you're using CSS custom properties:

```css
/* Before: Static CSS variables */
.card {
  box-shadow: var(--shadow-medium);
}

/* After: Dynamic elevation properties */
.card {
  box-shadow: var(--elevation-shadow);
}
```

### From Tailwind Shadows

If you're using Tailwind shadow utilities:

```tsx
// Before: Static Tailwind classes
<div className="shadow-lg">Content</div>

// After: Dynamic elevation classes
const tailwindClasses = generateElevationTailwind(2, context);
<div className={tailwindClasses.boxShadow}>Content</div>
```

## Troubleshooting

### Common Issues

#### Shadows Not Appearing

**Problem**: Elevation shadows are not visible
**Solutions**:
- Check that the element has a background color
- Verify the elevation level is greater than 0
- Ensure the context parameters are valid
- Check for CSS conflicts or overrides

#### Performance Issues

**Problem**: Slow shadow rendering
**Solutions**:
- Use component-specific presets instead of manual calculation
- Enable caching in the elevation hook options
- Consider using CSS custom properties for static shadows
- Profile shadow calculation performance

#### Accessibility Violations

**Problem**: Elevation causes accessibility issues
**Solutions**:
- Enable accessibility options in elevation hooks
- Test with screen readers and keyboard navigation
- Verify contrast ratios in high contrast mode
- Use semantic HTML alongside elevation

#### Hierarchy Conflicts

**Problem**: Elevation hierarchy validation fails
**Solutions**:
- Review component elevation levels
- Use the `validateHierarchy` function to identify conflicts
- Adjust elevation levels to maintain logical hierarchy
- Consider using semantic presets for consistency

### Debug Mode

Enable debug logging for elevation calculations:

```tsx
const elevation = useElevation({
  debug: true, // Enable debug logging
  accessibility: { /* ... */ }
});
```

### Performance Monitoring

Monitor elevation system performance:

```tsx
import { performance } from 'perf_hooks';

const start = performance.now();
const shadow = getElevationShadow(level, context);
const end = performance.now();

console.log(`Elevation calculation took ${end - start}ms`);
```

---

## Contributing

To contribute to the elevation system:

1. Follow the existing code patterns and TypeScript types
2. Add comprehensive tests for new features
3. Update documentation for API changes
4. Ensure accessibility compliance
5. Test across different platforms and themes

## License

This elevation token system is part of the broader design token system and follows the same licensing terms.