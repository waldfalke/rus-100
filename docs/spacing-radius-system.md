# Spacing and Border-Radius System Documentation

## Overview

The spacing and border-radius system provides a consistent, hierarchical approach to layout and visual design. It ensures proper visual hierarchy through mathematical relationships between spacing values and border radii.

## Core Principles

### Spacing Hierarchy
- **Outer > Inner > Gap**: Outer spacing is always greater than inner spacing, which is greater than gap spacing
- **Level-based scaling**: Spacing increases with nesting level using a 1.4x multiplier
- **Component-specific multipliers**: Different component types have different base multipliers
- **Minimum values**: All spacing values are at least 1px

### Border-Radius Hierarchy
- **Decreasing with nesting**: Child components have smaller border radii than their parents
- **Proportional scaling**: Border radius scales proportionally with component size
- **Platform adaptation**: Different platforms may have different base radius values

## API Reference

### Spacing Functions

#### `getSpacingValues(context: SpacingContext): SpacingValues`
Returns all spacing values (outer, inner, gap) for a given context.

```typescript
const context: SpacingContext = {
  level: 0,
  size: 'md',
  componentType: 'card',
  density: 'comfortable'
};

const spacing = getSpacingValues(context);
// Returns: { outer: 12, inner: 8, gap: 6 }
```

#### `getOuterSpacing(context: SpacingContext): number`
Returns the outer spacing value for a component.

#### `getInnerSpacing(context: SpacingContext): number`
Returns the inner spacing value for a component.

#### `getGapSpacing(context: SpacingContext): number`
Returns the gap spacing value for a component.

### Border-Radius Functions

#### `getBorderRadius(context: BorderRadiusContext): number`
Returns the border radius for a component.

```typescript
const context: BorderRadiusContext = {
  level: 0,
  size: 'md',
  componentType: 'card',
  variant: 'default'
};

const radius = getBorderRadius(context);
// Returns: 8
```

#### `getNestedBorderRadius(parent: BorderRadiusContext, child: BorderRadiusContext): BorderRadiusValues`
Returns the border radius for a nested component, ensuring proper hierarchy.

### Validation Functions

#### `validateSpacingHierarchy(context: SpacingContext): ValidationResult`
Validates that spacing values follow the hierarchy rules.

```typescript
const validation = validateSpacingHierarchy(context);
if (!validation.isValid) {
  console.log('Violations:', validation.violations);
}
```

## Component Types and Multipliers

### Spacing Multipliers
- **badge**: `{ outer: 0.5, inner: 0.25, gap: 0.125 }`
- **button**: `{ outer: 1, inner: 0.75, gap: 0.5 }`
- **card**: `{ outer: 1.5, inner: 1, gap: 0.75 }`
- **panel**: `{ outer: 2, inner: 1.25, gap: 1 }`
- **block**: `{ outer: 2.5, inner: 1.5, gap: 1.25 }`
- **container**: `{ outer: 3, inner: 2, gap: 1.5 }`

### Border-Radius Multipliers
- **badge**: `0.5`
- **button**: `1`
- **card**: `1.5`
- **panel**: `2`
- **block**: `2.5`
- **container**: `3`

## Size Scale

### Base Spacing Scale
- **xs**: 2px
- **sm**: 4px
- **md**: 8px (default)
- **lg**: 16px
- **xl**: 24px
- **responsive**: Calculated based on viewport

### Base Border-Radius Scale
- **xs**: 2px
- **sm**: 4px
- **md**: 6px (default)
- **lg**: 8px
- **xl**: 12px

## Density Adjustments

### Density Multipliers
- **compact**: 0.75x (25% smaller)
- **comfortable**: 1x (default)
- **spacious**: 1.25x (25% larger)

## Accessibility Features

### Accessibility Multipliers
- **largeText**: 1.2x (20% larger)
- **highContrast**: 1.1x (10% larger)
- **reducedMotion**: 1x (no change)

## Usage Examples

### Basic Card Component
```typescript
const cardContext: SpacingContext = {
  level: 0,
  size: 'md',
  componentType: 'card',
  density: 'comfortable'
};

const spacing = getSpacingValues(cardContext);
const radius = getBorderRadius({
  level: 0,
  size: 'md',
  componentType: 'card',
  variant: 'default'
});

// Apply to CSS
const cardStyles = {
  padding: `${spacing.inner}px`,
  margin: `${spacing.outer}px`,
  borderRadius: `${radius}px`
};
```

### Nested Components
```typescript
const parentContext: SpacingContext = {
  level: 0,
  size: 'md',
  componentType: 'panel'
};

const childContext: SpacingContext = {
  level: 1,
  size: 'md',
  componentType: 'card'
};

const parentSpacing = getSpacingValues(parentContext);
const childSpacing = getSpacingValues(childContext);

// Child spacing will be larger due to level scaling
console.log(parentSpacing.outer); // 16px
console.log(childSpacing.outer);  // 22px (16 * 1.4)
```

### Accessibility-Enhanced Components
```typescript
const accessibleContext: SpacingContext = {
  level: 0,
  size: 'md',
  componentType: 'button',
  density: 'comfortable',
  accessibility: {
    largeText: true,
    highContrast: true
  }
};

const spacing = getSpacingValues(accessibleContext);
// Values will be 32% larger (1.2 * 1.1 = 1.32)
```

## Best Practices

### 1. Always Use Context Objects
Don't hardcode spacing values. Always use the context-based functions to ensure consistency.

```typescript
// ❌ Don't do this
const padding = '8px';

// ✅ Do this
const context = createSpacingContext({ componentType: 'card', size: 'md' });
const spacing = getSpacingValues(context);
const padding = `${spacing.inner}px`;
```

### 2. Validate Hierarchies
Always validate spacing hierarchies, especially when creating custom components.

```typescript
const validation = validateSpacingHierarchy(context);
if (!validation.isValid) {
  throw new Error(`Invalid spacing hierarchy: ${validation.violations.join(', ')}`);
}
```

### 3. Consider Nesting Levels
When creating nested components, ensure proper level assignment.

```typescript
// Parent component
const parentContext = { level: 0, componentType: 'panel' };

// Child component should have level + 1
const childContext = { level: 1, componentType: 'card' };
```

### 4. Use Appropriate Component Types
Choose component types that match the semantic meaning and visual hierarchy.

```typescript
// For small UI elements
const badgeContext = { componentType: 'badge' };

// For interactive elements
const buttonContext = { componentType: 'button' };

// For content containers
const cardContext = { componentType: 'card' };

// For layout containers
const containerContext = { componentType: 'container' };
```

### 5. Respect Density Settings
Use density settings to adapt to different UI contexts.

```typescript
// For mobile or compact layouts
const compactContext = { density: 'compact' };

// For desktop or spacious layouts
const spaciousContext = { density: 'spacious' };
```

## Testing

The system includes comprehensive tests that validate:
- Spacing hierarchy rules
- Border-radius consistency
- Component type behavior
- Accessibility adjustments
- Performance characteristics

Run tests with:
```bash
npx vitest run tests/tokens/spacing-radius.test.ts --project=unit
```

## Integration with CSS-in-JS

### Styled Components Example
```typescript
import styled from 'styled-components';
import { getSpacingValues, getBorderRadius } from './lib/tokens';

const Card = styled.div<{ context: SpacingContext }>`
  ${({ context }) => {
    const spacing = getSpacingValues(context);
    const radius = getBorderRadius(context);
    
    return `
      padding: ${spacing.inner}px;
      margin: ${spacing.outer}px;
      border-radius: ${radius}px;
      gap: ${spacing.gap}px;
    `;
  }}
`;
```

### CSS Custom Properties
```typescript
import { generateSpacingCSS } from './lib/tokens';

const cssVariables = generateSpacingCSS(context);
// Returns: { '--spacing-outer': '12px', '--spacing-inner': '8px', ... }
```

## Troubleshooting

### Common Issues

1. **Outer spacing equals inner spacing**: This can happen with very small components or extreme density settings. The system handles this gracefully by ensuring minimum 1px values.

2. **Validation failures**: Check that your context parameters are valid and that component types match their intended use.

3. **Inconsistent spacing**: Ensure you're using the same context parameters across related components.

### Debug Mode
Enable debug logging to understand spacing calculations:

```typescript
const context = { ...yourContext, debug: true };
const spacing = getSpacingValues(context);
```