'use client';

import React, { useState } from 'react';
import { getSpacingValues, getBorderRadius, validateSpacingHierarchy } from '../../lib/tokens/spacing';
import { getBorderRadius as getBorderRadiusFromBorderRadius } from '../../lib/tokens/border-radius';
import type { SpacingContext, ComponentType, SpacingSize } from '../../lib/tokens/spacing';
import type { BorderRadiusContext } from '../../lib/tokens/border-radius';

interface DemoProps {
  className?: string;
}

const COMPONENT_TYPES: ComponentType[] = ['badge', 'button', 'card', 'panel', 'block', 'container'];
const SIZES: SpacingSize[] = ['xs', 'sm', 'md', 'lg', 'xl'];
const DENSITIES = ['compact', 'comfortable', 'spacious'] as const;

// Helper function for creating spacing context
function createSpacingContext(
  selectedComponent: ComponentType,
  selectedSize: SpacingSize,
  selectedDensity: 'compact' | 'comfortable' | 'spacious',
  nestingLevel: number,
  largeText: boolean,
  highContrast: boolean
): SpacingContext {
  return {
    level: nestingLevel,
    size: selectedSize,
    componentType: selectedComponent,
    density: selectedDensity,
    accessibility: {
      largeText,
      highContrast
    }
  };
}

// Helper function for creating border radius context
function createBorderRadiusContext(
  selectedComponent: ComponentType,
  selectedSize: SpacingSize,
  nestingLevel: number
): BorderRadiusContext {
  return {
    level: nestingLevel,
    size: selectedSize,
    componentType: selectedComponent,
    variant: 'default'
  };
}

// Interactive Demo Component
function InteractiveSpacingDemo({ className }: DemoProps) {
  const [selectedComponent, setSelectedComponent] = useState<ComponentType>('card');
  const [selectedSize, setSelectedSize] = useState<SpacingSize>('md');
  const [selectedDensity, setSelectedDensity] = useState<'compact' | 'comfortable' | 'spacious'>('comfortable');
  const [nestingLevel, setNestingLevel] = useState(0);
  const [largeText, setLargeText] = useState(false);
  const [highContrast, setHighContrast] = useState(false);

  const context = createSpacingContext(selectedComponent, selectedSize, selectedDensity, nestingLevel, largeText, highContrast);
  const borderRadiusContext = createBorderRadiusContext(selectedComponent, selectedSize, nestingLevel);
  const spacing = getSpacingValues(context);
  const radius = getBorderRadiusFromBorderRadius(borderRadiusContext);
  const validation = validateSpacingHierarchy(context);

  const componentStyle = {
    padding: `${spacing.inner}px`,
    margin: `${spacing.outer}px`,
    borderRadius: `${radius}px`,
    border: '2px solid #e2e8f0',
    backgroundColor: '#f8fafc',
    minHeight: '100px',
    display: 'flex',
    flexDirection: 'column' as const,
    justifyContent: 'center',
    alignItems: 'center',
    gap: `${spacing.gap}px`,
    transition: 'all 0.2s ease-in-out'
  };

  return (
    <div className={`p-6 max-w-6xl mx-auto ${className}`}>
      <h2 className="text-2xl font-bold mb-6">Interactive Spacing Demo</h2>
      
      {/* Controls */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8 p-6 bg-gray-50 rounded-lg">
        <div>
          <label className="block text-sm font-medium mb-2">Component Type</label>
          <select 
            value={selectedComponent} 
            onChange={(e) => setSelectedComponent(e.target.value as ComponentType)}
            className="w-full p-2 border rounded-md"
          >
            {COMPONENT_TYPES.map(type => (
              <option key={type} value={type}>{type}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Size</label>
          <select 
            value={selectedSize} 
            onChange={(e) => setSelectedSize(e.target.value as SpacingSize)}
            className="w-full p-2 border rounded-md"
          >
            {SIZES.map(size => (
              <option key={size} value={size}>{size}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Density</label>
          <select 
            value={selectedDensity} 
            onChange={(e) => setSelectedDensity(e.target.value as typeof selectedDensity)}
            className="w-full p-2 border rounded-md"
          >
            {DENSITIES.map(density => (
              <option key={density} value={density}>{density}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Nesting Level</label>
          <input 
            type="range" 
            min="0" 
            max="3" 
            value={nestingLevel}
            onChange={(e) => setNestingLevel(parseInt(e.target.value))}
            className="w-full"
          />
          <span className="text-sm text-gray-600">Level: {nestingLevel}</span>
        </div>

        <div className="flex flex-col gap-2">
          <label className="flex items-center">
            <input 
              type="checkbox" 
              checked={largeText}
              onChange={(e) => setLargeText(e.target.checked)}
              className="mr-2"
            />
            Large Text
          </label>
          <label className="flex items-center">
            <input 
              type="checkbox" 
              checked={highContrast}
              onChange={(e) => setHighContrast(e.target.checked)}
              className="mr-2"
            />
            High Contrast
          </label>
        </div>
      </div>

      {/* Live Preview */}
      <div className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">Live Preview</h2>
        <div className="bg-white p-8 border rounded-lg">
          <div style={componentStyle}>
            <h3 className="text-lg font-medium">{selectedComponent.charAt(0).toUpperCase() + selectedComponent.slice(1)} Component</h3>
            <p className="text-sm text-gray-600">Level {nestingLevel} • {selectedSize} • {selectedDensity}</p>
            
            {nestingLevel > 0 && (
              <div style={{
                ...componentStyle,
                margin: '8px',
                backgroundColor: '#e2e8f0',
                minHeight: '60px'
              }}>
                <span className="text-sm">Nested Content</span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Values Display */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <div className="bg-white p-6 border rounded-lg">
          <h3 className="text-xl font-semibold mb-4">Spacing Values</h3>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span>Outer:</span>
              <span className="font-mono">{spacing.outer}px</span>
            </div>
            <div className="flex justify-between">
              <span>Inner:</span>
              <span className="font-mono">{spacing.inner}px</span>
            </div>
            <div className="flex justify-between">
              <span>Gap:</span>
              <span className="font-mono">{spacing.gap}px</span>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 border rounded-lg">
          <h3 className="text-xl font-semibold mb-4">Border Radius</h3>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span>Radius:</span>
              <span className="font-mono">{radius}px</span>
            </div>
          </div>
        </div>
      </div>

      {/* Validation */}
      <div className="bg-white p-6 border rounded-lg mb-8">
        <h3 className="text-xl font-semibold mb-4">Validation</h3>
        <div className={`p-4 rounded-md ${validation.isValid ? 'bg-green-50 border border-green-200' : 'bg-red-50 border border-red-200'}`}>
          <div className="flex items-center mb-2">
            <span className={`w-3 h-3 rounded-full mr-2 ${validation.isValid ? 'bg-green-500' : 'bg-red-500'}`}></span>
            <span className="font-medium">
              {validation.isValid ? 'Valid Hierarchy' : 'Invalid Hierarchy'}
            </span>
          </div>
          {!validation.isValid && (
            <ul className="text-sm text-red-700 ml-5">
              {validation.violations.map((violation, index) => (
                <li key={index} className="list-disc">{violation}</li>
              ))}
            </ul>
          )}
        </div>
      </div>

      {/* Component Comparison */}
      <div className="bg-white p-6 border rounded-lg">
        <h3 className="text-xl font-semibold mb-4">Component Type Comparison</h3>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {COMPONENT_TYPES.map(type => {
            const typeContext: SpacingContext = {
              level: 0,
              size: 'md',
              componentType: type,
              density: 'comfortable'
            };
            const typeSpacing = getSpacingValues(typeContext);
            const typeRadius = getBorderRadiusFromBorderRadius({
              level: 0,
              size: 'md',
              componentType: type,
              variant: 'default'
            });

            return (
              <div key={type} className="text-center">
                <div 
                  className="w-full h-20 border-2 border-gray-300 mb-2 flex items-center justify-center text-xs"
                  style={{
                    padding: `${typeSpacing.inner}px`,
                    borderRadius: `${typeRadius}px`,
                    backgroundColor: type === selectedComponent ? '#dbeafe' : '#f8fafc'
                  }}
                >
                  {type}
                </div>
                <div className="text-xs text-gray-600">
                  <div>O: {typeSpacing.outer}px</div>
                  <div>I: {typeSpacing.inner}px</div>
                  <div>R: {typeRadius}px</div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

// ============================================================================
// DEMO COMPONENTS
// ============================================================================

interface BadgeProps {
  children: React.ReactNode;
  size?: SpacingSize;
  variant?: 'primary' | 'secondary' | 'success' | 'warning' | 'error';
  className?: string;
}

function Badge({ children, size = 'medium', variant = 'primary', className = '' }: BadgeProps) {
  const { spacing, borderRadius } = useTheme();
  
  // Get spacing values for badge component
  const spacingValues = spacing.getValues(size, 'badge');
  const radiusValue = borderRadius.get('small', 'badge');
  
  const variantColors = {
    primary: 'bg-blue-500 text-white',
    secondary: 'bg-gray-500 text-white',
    success: 'bg-green-500 text-white',
    warning: 'bg-yellow-500 text-black',
    error: 'bg-red-500 text-white',
  };
  
  return (
    <span
      className={`inline-flex items-center font-medium ${variantColors[variant]} ${className}`}
      style={{
        paddingTop: `${spacingValues.inner}px`,
        paddingBottom: `${spacingValues.inner}px`,
        paddingLeft: `${spacingValues.inner * 1.5}px`,
        paddingRight: `${spacingValues.inner * 1.5}px`,
        marginRight: `${spacingValues.gap}px`,
        borderRadius: `${radiusValue}px`,
      }}
    >
      {children}
    </span>
  );
}

interface CardProps {
  children: React.ReactNode;
  size?: SpacingSize;
  title?: string;
  badges?: Array<{ label: string; variant?: BadgeProps['variant'] }>;
  className?: string;
}

function Card({ children, size = 'medium', title, badges = [], className = '' }: CardProps) {
  const { spacing, borderRadius } = useTheme();
  
  // Get spacing values for card component
  const spacingValues = spacing.getValues(size, 'card');
  const radiusValue = borderRadius.get('medium', 'card');
  const nestedRadiusValue = borderRadius.getNested('medium', 'card');
  
  return (
    <div
      className={`bg-white border border-gray-200 shadow-sm ${className}`}
      style={{
        padding: `${spacingValues.inner}px`,
        marginBottom: `${spacingValues.outer}px`,
        borderRadius: `${radiusValue}px`,
      }}
    >
      {title && (
        <div
          className="flex items-center justify-between"
          style={{
            marginBottom: `${spacingValues.gap}px`,
          }}
        >
          <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
          {badges.length > 0 && (
            <div className="flex items-center">
              {badges.map((badge, index) => (
                <Badge
                  key={index}
                  size={size === 'large' ? 'medium' : 'small'}
                  variant={badge.variant}
                >
                  {badge.label}
                </Badge>
              ))}
            </div>
          )}
        </div>
      )}
      <div
        style={{
          borderRadius: `${nestedRadiusValue}px`,
        }}
      >
        {children}
      </div>
    </div>
  );
}

interface PanelProps {
  children: React.ReactNode;
  size?: SpacingSize;
  title?: string;
  className?: string;
}

function Panel({ children, size = 'large', title, className = '' }: PanelProps) {
  const { spacing, borderRadius } = useTheme();
  
  // Get spacing values for panel component
  const spacingValues = spacing.getValues(size, 'panel');
  const radiusValue = borderRadius.get('large', 'panel');
  
  return (
    <div
      className={`bg-gray-50 border border-gray-300 ${className}`}
      style={{
        padding: `${spacingValues.inner}px`,
        marginBottom: `${spacingValues.outer}px`,
        borderRadius: `${radiusValue}px`,
      }}
    >
      {title && (
        <h2
          className="text-xl font-bold text-gray-900"
          style={{
            marginBottom: `${spacingValues.gap}px`,
          }}
        >
          {title}
        </h2>
      )}
      {children}
    </div>
  );
}

// ============================================================================
// SPACING HIERARCHY DEMO
// ============================================================================

function SpacingHierarchyDemo() {
  const { spacing } = useTheme();
  
  const sizes: SpacingSize[] = ['small', 'medium', 'large'];
  const components: ComponentType[] = ['badge', 'card', 'panel'];
  
  return (
    <div className="space-y-8">
      <h2 className="text-2xl font-bold text-gray-900">Spacing Hierarchy Demo</h2>
      
      {sizes.map((size) => (
        <div key={size} className="space-y-4">
          <h3 className="text-lg font-semibold text-gray-700 capitalize">{size} Size</h3>
          
          <div className="grid grid-cols-3 gap-6">
            {components.map((component) => {
              const spacingValues = spacing.getValues(size, component);
              
              return (
                <div key={component} className="space-y-2">
                  <h4 className="font-medium text-gray-600 capitalize">{component}</h4>
                  <div className="bg-white border rounded p-4 space-y-2 text-sm">
                    <div>Outer: <span className="font-mono">{spacingValues.outer}px</span></div>
                    <div>Inner: <span className="font-mono">{spacingValues.inner}px</span></div>
                    <div>Gap: <span className="font-mono">{spacingValues.gap}px</span></div>
                    <div className="text-xs text-gray-500">
                      Ratio: {(spacingValues.outer / spacingValues.inner).toFixed(2)}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
}

// ============================================================================
// BORDER RADIUS DEMO
// ============================================================================

function BorderRadiusDemo() {
  const { borderRadius } = useTheme();
  
  const variants: BorderRadiusVariant[] = ['none', 'small', 'medium', 'large', 'full'];
  const components: ComponentType[] = ['badge', 'card', 'panel'];
  
  return (
    <div className="space-y-8">
      <h2 className="text-2xl font-bold text-gray-900">Border Radius Demo</h2>
      
      {variants.map((variant) => (
        <div key={variant} className="space-y-4">
          <h3 className="text-lg font-semibold text-gray-700 capitalize">{variant} Variant</h3>
          
          <div className="grid grid-cols-3 gap-6">
            {components.map((component) => {
              const radiusValue = borderRadius.get(variant, component);
              const nestedValue = borderRadius.getNested(variant, component);
              
              return (
                <div key={component} className="space-y-2">
                  <h4 className="font-medium text-gray-600 capitalize">{component}</h4>
                  <div className="bg-white border rounded p-4 space-y-2 text-sm">
                    <div>Base: <span className="font-mono">{radiusValue}px</span></div>
                    <div>Nested: <span className="font-mono">{nestedValue}px</span></div>
                    <div className="mt-3">
                      <div
                        className="w-16 h-16 bg-blue-500"
                        style={{ borderRadius: `${radiusValue}px` }}
                      />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
}

// ============================================================================
// NESTED COMPONENTS DEMO
// ============================================================================

function NestedComponentsDemo() {
  return (
    <div className="space-y-8">
      <h2 className="text-2xl font-bold text-gray-900">Nested Components Demo</h2>
      
      <div className="space-y-6">
        {/* Small Size Hierarchy */}
        <Panel size="small" title="Small Panel">
          <Card
            size="small"
            title="Small Card"
            badges={[
              { label: 'New', variant: 'primary' },
              { label: 'Featured', variant: 'success' },
            ]}
          >
            <p className="text-gray-600">
              This is a small card inside a small panel. Notice how the spacing and border-radius
              values create a harmonious hierarchy.
            </p>
          </Card>
          
          <Card size="small" title="Another Small Card">
            <div className="flex flex-wrap gap-2">
              <Badge size="small" variant="warning">Warning</Badge>
              <Badge size="small" variant="error">Error</Badge>
              <Badge size="small" variant="secondary">Info</Badge>
            </div>
          </Card>
        </Panel>
        
        {/* Medium Size Hierarchy */}
        <Panel size="medium" title="Medium Panel">
          <Card
            size="medium"
            title="Medium Card"
            badges={[
              { label: 'Popular', variant: 'primary' },
              { label: 'Trending', variant: 'success' },
            ]}
          >
            <p className="text-gray-600 mb-4">
              This medium-sized card demonstrates how spacing scales proportionally.
              The outer margins are always larger than inner paddings.
            </p>
            <div className="flex flex-wrap gap-2">
              <Badge size="medium" variant="primary">Primary</Badge>
              <Badge size="medium" variant="secondary">Secondary</Badge>
            </div>
          </Card>
          
          <Card size="medium" title="Card with Multiple Badges">
            <div className="space-y-3">
              <p className="text-gray-600">Multiple badge examples:</p>
              <div className="flex flex-wrap gap-2">
                <Badge size="medium" variant="success">Success</Badge>
                <Badge size="medium" variant="warning">Warning</Badge>
                <Badge size="medium" variant="error">Error</Badge>
                <Badge size="medium" variant="primary">Primary</Badge>
              </div>
            </div>
          </Card>
        </Panel>
        
        {/* Large Size Hierarchy */}
        <Panel size="large" title="Large Panel">
          <Card
            size="large"
            title="Large Card"
            badges={[
              { label: 'Enterprise', variant: 'primary' },
              { label: 'Premium', variant: 'success' },
            ]}
          >
            <p className="text-gray-600 mb-6">
              This large card shows how the system scales up while maintaining visual harmony.
              The border-radius values decrease for nested elements, creating depth perception.
            </p>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <h4 className="font-medium mb-2">Status Badges</h4>
                <div className="flex flex-wrap gap-2">
                  <Badge size="large" variant="success">Active</Badge>
                  <Badge size="large" variant="warning">Pending</Badge>
                </div>
              </div>
              <div>
                <h4 className="font-medium mb-2">Category Badges</h4>
                <div className="flex flex-wrap gap-2">
                  <Badge size="large" variant="primary">Tech</Badge>
                  <Badge size="large" variant="secondary">Design</Badge>
                </div>
              </div>
            </div>
          </Card>
        </Panel>
      </div>
    </div>
  );
}

// ============================================================================
// MAIN DEMO COMPONENT
// ============================================================================

export default function SpacingRadiusDemo({ className }: DemoProps) {
  return (
    <div className="max-w-6xl mx-auto p-6 space-y-12">
      <div className="text-center space-y-4">
        <h1 className="text-3xl font-bold text-gray-900">
          Functional Context-Aware Spacing & Border-Radius Demo
        </h1>
        <p className="text-lg text-gray-600 max-w-3xl mx-auto">
          This demo showcases the functional design token system for spacing and border-radius.
          Notice how values scale harmoniously across component hierarchies and maintain
          consistent visual relationships.
        </p>
      </div>
      
      <NestedComponentsDemo />
      <SpacingHierarchyDemo />
      <BorderRadiusDemo />
    </div>
  );
}