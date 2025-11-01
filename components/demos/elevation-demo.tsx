'use client';

/**
 * Elevation Token System Demo
 * 
 * Interactive demonstration of the functional elevation and soft shadow token system
 * showcasing context-aware resolution, accessibility features, and theme integration.
 */

import React, { useState, useMemo } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Slider } from '@/components/ui/slider';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { 
  Moon, 
  Sun, 
  Eye, 
  Accessibility, 
  Smartphone, 
  Monitor, 
  Globe,
  Copy,
  Check,
  AlertTriangle
} from 'lucide-react';

// Import elevation system (assuming these exist based on our implementation)
import { useElevation, useComponentElevation, useElevationPresets } from '@/lib/hooks/use-elevation';
import type { 
  ElevationLevel, 
  ElevationVariant, 
  ComponentElevationContext 
} from '@/lib/theme-contracts/types';

// ============================================================================
// DEMO TYPES
// ============================================================================

interface DemoState {
  level: ElevationLevel;
  variant: ElevationVariant;
  size: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  platform: 'web' | 'mobile' | 'desktop';
  themeMode: 'light' | 'dark';
  accessibility: {
    highContrast: boolean;
    reducedMotion: boolean;
    prefersReducedData: boolean;
  };
}

interface ComponentDemo {
  type: 'surface' | 'card' | 'modal' | 'tooltip' | 'dropdown' | 'fab' | 'snackbar';
  label: string;
  description: string;
}

// ============================================================================
// DEMO DATA
// ============================================================================

const ELEVATION_LEVELS: { value: ElevationLevel; label: string; description: string }[] = [
  { value: 0, label: 'Level 0', description: 'No elevation - flat surface' },
  { value: 1, label: 'Level 1', description: 'Subtle elevation for cards and buttons' },
  { value: 2, label: 'Level 2', description: 'Moderate elevation for dropdowns and menus' },
  { value: 3, label: 'Level 3', description: 'Prominent elevation for tooltips and floating elements' },
  { value: 4, label: 'Level 4', description: 'High elevation for modals and overlays' },
  { value: 5, label: 'Level 5', description: 'Maximum elevation for critical overlays' }
];

const ELEVATION_VARIANTS: { value: ElevationVariant; label: string; description: string }[] = [
  { value: 'subtle', label: 'Subtle', description: 'Minimal shadow intensity' },
  { value: 'moderate', label: 'Moderate', description: 'Standard shadow intensity' },
  { value: 'prominent', label: 'Prominent', description: 'Enhanced shadow intensity' },
  { value: 'dramatic', label: 'Dramatic', description: 'Maximum shadow intensity' }
];

const COMPONENT_DEMOS: ComponentDemo[] = [
  { type: 'surface', label: 'Surface', description: 'Base surface element' },
  { type: 'card', label: 'Card', description: 'Content card component' },
  { type: 'modal', label: 'Modal', description: 'Modal dialog overlay' },
  { type: 'tooltip', label: 'Tooltip', description: 'Contextual tooltip' },
  { type: 'dropdown', label: 'Dropdown', description: 'Dropdown menu' },
  { type: 'fab', label: 'FAB', description: 'Floating action button' },
  { type: 'snackbar', label: 'Snackbar', description: 'Notification snackbar' }
];

// ============================================================================
// DEMO COMPONENTS
// ============================================================================

/**
 * Elevation Level Showcase
 */
function ElevationLevelShowcase({ 
  state, 
  onStateChange 
}: { 
  state: DemoState; 
  onStateChange: (state: DemoState) => void;
}) {
  const elevation = useElevation({
    accessibility: state.accessibility,
    platform: state.platform,
    generateCSS: true,
    generateTailwind: true
  });

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {ELEVATION_LEVELS.map((levelInfo) => {
          const shadowCSS = elevation.getLevel(levelInfo.value, {
            level: levelInfo.value,
            variant: state.variant,
            size: state.size,
            platform: state.platform
          });

          const isSelected = state.level === levelInfo.value;

          return (
            <Card
              key={levelInfo.value}
              className={`cursor-pointer transition-all duration-200 ${
                isSelected ? 'ring-2 ring-blue-500' : ''
              }`}
              style={{ boxShadow: shadowCSS }}
              onClick={() => onStateChange({ ...state, level: levelInfo.value })}
            >
              <CardContent className="p-4 text-center">
                <div className="text-2xl font-bold text-blue-600 mb-2">
                  {levelInfo.value}
                </div>
                <div className="text-sm font-medium mb-1">
                  {levelInfo.label}
                </div>
                <div className="text-xs text-muted-foreground">
                  {levelInfo.description}
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}

/**
 * Component Type Showcase
 */
function ComponentTypeShowcase({ state }: { state: DemoState }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {COMPONENT_DEMOS.map((component) => {
        const { shadowCSS, level } = useComponentElevation(component.type, {
          variant: state.variant,
          size: state.size,
          accessibility: state.accessibility
        });

        return (
          <Card
            key={component.type}
            className="transition-all duration-200"
            style={{ boxShadow: shadowCSS }}
          >
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm">{component.label}</CardTitle>
                <Badge variant="secondary" className="text-xs">
                  Level {level}
                </Badge>
              </div>
              <CardDescription className="text-xs">
                {component.description}
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="text-xs font-mono bg-muted p-2 rounded">
                box-shadow: {shadowCSS}
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}

/**
 * Accessibility Features Panel
 */
function AccessibilityPanel({ 
  state, 
  onStateChange 
}: { 
  state: DemoState; 
  onStateChange: (state: DemoState) => void;
}) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Accessibility className="w-4 h-4" />
          Accessibility Features
        </CardTitle>
        <CardDescription>
          Test elevation behavior with different accessibility preferences
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center justify-between">
          <Label htmlFor="high-contrast" className="text-sm">
            High Contrast Mode
          </Label>
          <Switch
            id="high-contrast"
            checked={state.accessibility.highContrast}
            onCheckedChange={(checked) =>
              onStateChange({
                ...state,
                accessibility: { ...state.accessibility, highContrast: checked }
              })
            }
          />
        </div>
        
        <div className="flex items-center justify-between">
          <Label htmlFor="reduced-motion" className="text-sm">
            Reduced Motion
          </Label>
          <Switch
            id="reduced-motion"
            checked={state.accessibility.reducedMotion}
            onCheckedChange={(checked) =>
              onStateChange({
                ...state,
                accessibility: { ...state.accessibility, reducedMotion: checked }
              })
            }
          />
        </div>
        
        <div className="flex items-center justify-between">
          <Label htmlFor="reduced-data" className="text-sm">
            Prefers Reduced Data
          </Label>
          <Switch
            id="reduced-data"
            checked={state.accessibility.prefersReducedData}
            onCheckedChange={(checked) =>
              onStateChange({
                ...state,
                accessibility: { ...state.accessibility, prefersReducedData: checked }
              })
            }
          />
        </div>
      </CardContent>
    </Card>
  );
}

/**
 * Controls Panel
 */
function ControlsPanel({ 
  state, 
  onStateChange 
}: { 
  state: DemoState; 
  onStateChange: (state: DemoState) => void;
}) {
  return (
    <div className="space-y-4">
      {/* Variant Selection */}
      <div className="space-y-2">
        <Label className="text-sm font-medium">Shadow Variant</Label>
        <Select
          value={state.variant}
          onValueChange={(value: ElevationVariant) =>
            onStateChange({ ...state, variant: value })
          }
        >
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {ELEVATION_VARIANTS.map((variant) => (
              <SelectItem key={variant.value} value={variant.value}>
                <div>
                  <div className="font-medium">{variant.label}</div>
                  <div className="text-xs text-muted-foreground">
                    {variant.description}
                  </div>
                </div>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Size Selection */}
      <div className="space-y-2">
        <Label className="text-sm font-medium">Component Size</Label>
        <Select
          value={state.size}
          onValueChange={(value: 'xs' | 'sm' | 'md' | 'lg' | 'xl') =>
            onStateChange({ ...state, size: value })
          }
        >
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="xs">Extra Small</SelectItem>
            <SelectItem value="sm">Small</SelectItem>
            <SelectItem value="md">Medium</SelectItem>
            <SelectItem value="lg">Large</SelectItem>
            <SelectItem value="xl">Extra Large</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Platform Selection */}
      <div className="space-y-2">
        <Label className="text-sm font-medium">Platform</Label>
        <div className="flex gap-2">
          {[
            { value: 'web', icon: Globe, label: 'Web' },
            { value: 'mobile', icon: Smartphone, label: 'Mobile' },
            { value: 'desktop', icon: Monitor, label: 'Desktop' }
          ].map((platform) => (
            <Button
              key={platform.value}
              variant={state.platform === platform.value ? 'default' : 'outline'}
              size="sm"
              onClick={() =>
                onStateChange({ 
                  ...state, 
                  platform: platform.value as 'web' | 'mobile' | 'desktop' 
                })
              }
              className="flex items-center gap-1"
            >
              <platform.icon className="w-3 h-3" />
              {platform.label}
            </Button>
          ))}
        </div>
      </div>

      {/* Theme Mode */}
      <div className="space-y-2">
        <Label className="text-sm font-medium">Theme Mode</Label>
        <div className="flex gap-2">
          <Button
            variant={state.themeMode === 'light' ? 'default' : 'outline'}
            size="sm"
            onClick={() => onStateChange({ ...state, themeMode: 'light' })}
            className="flex items-center gap-1"
          >
            <Sun className="w-3 h-3" />
            Light
          </Button>
          <Button
            variant={state.themeMode === 'dark' ? 'default' : 'outline'}
            size="sm"
            onClick={() => onStateChange({ ...state, themeMode: 'dark' })}
            className="flex items-center gap-1"
          >
            <Moon className="w-3 h-3" />
            Dark
          </Button>
        </div>
      </div>
    </div>
  );
}

/**
 * Code Examples Panel
 */
function CodeExamplesPanel({ state }: { state: DemoState }) {
  const [copiedCode, setCopiedCode] = useState<string | null>(null);
  
  const elevation = useElevation({
    accessibility: state.accessibility,
    platform: state.platform,
    generateCSS: true,
    generateTailwind: true
  });

  const shadowCSS = elevation.getLevel(state.level, {
    level: state.level,
    variant: state.variant,
    size: state.size,
    platform: state.platform
  });

  const cssProperties = elevation.generateCSS(state.level, {
    level: state.level,
    variant: state.variant,
    size: state.size,
    platform: state.platform
  });

  const tailwindUtilities = elevation.generateTailwind(state.level, {
    level: state.level,
    variant: state.variant,
    size: state.size,
    platform: state.platform
  });

  const copyToClipboard = async (text: string, type: string) => {
    await navigator.clipboard.writeText(text);
    setCopiedCode(type);
    setTimeout(() => setCopiedCode(null), 2000);
  };

  const examples = [
    {
      title: 'CSS Box Shadow',
      code: `box-shadow: ${shadowCSS};`,
      type: 'css'
    },
    {
      title: 'CSS Custom Properties',
      code: Object.entries(cssProperties)
        .map(([key, value]) => `${key}: ${value};`)
        .join('\n'),
      type: 'css-props'
    },
    {
      title: 'Tailwind Utilities',
      code: `className="${tailwindUtilities.boxShadow}"`,
      type: 'tailwind'
    },
    {
      title: 'React Hook Usage',
      code: `const { shadowCSS } = useComponentElevation('card', {
  variant: '${state.variant}',
  size: '${state.size}',
  accessibility: {
    highContrast: ${state.accessibility.highContrast},
    reducedMotion: ${state.accessibility.reducedMotion}
  }
});`,
      type: 'react'
    }
  ];

  return (
    <div className="space-y-4">
      {examples.map((example) => (
        <Card key={example.type}>
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm">{example.title}</CardTitle>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => copyToClipboard(example.code, example.type)}
                className="h-6 w-6 p-0"
              >
                {copiedCode === example.type ? (
                  <Check className="w-3 h-3" />
                ) : (
                  <Copy className="w-3 h-3" />
                )}
              </Button>
            </div>
          </CardHeader>
          <CardContent className="pt-0">
            <pre className="text-xs bg-muted p-3 rounded overflow-x-auto">
              <code>{example.code}</code>
            </pre>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

// ============================================================================
// MAIN DEMO COMPONENT
// ============================================================================

export default function ElevationDemo() {
  const [state, setState] = useState<DemoState>({
    level: 2,
    variant: 'moderate',
    size: 'md',
    platform: 'web',
    themeMode: 'light',
    accessibility: {
      highContrast: false,
      reducedMotion: false,
      prefersReducedData: false
    }
  });

  const elevation = useElevation({
    accessibility: state.accessibility,
    platform: state.platform
  });

  // Validate current elevation hierarchy
  const hierarchyValidation = useMemo(() => {
    const contexts: ComponentElevationContext[] = COMPONENT_DEMOS.map(demo => ({
      level: elevation.getSemantic(demo.type) as any, // Type assertion for demo
      variant: state.variant,
      size: state.size,
      platform: state.platform
    }));
    
    return elevation.validateHierarchy(contexts);
  }, [elevation, state]);

  return (
    <div className={`min-h-screen p-6 transition-colors duration-200 ${
      state.themeMode === 'dark' ? 'dark bg-gray-900' : 'bg-gray-50'
    }`}>
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-bold">Elevation Token System Demo</h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Interactive demonstration of functional elevation and soft shadow tokens with 
            context-aware resolution, accessibility features, and theme integration.
          </p>
          
          {/* Hierarchy Validation */}
          {!hierarchyValidation.isValid && (
            <div className="flex items-center justify-center gap-2 text-amber-600 bg-amber-50 p-3 rounded-lg">
              <AlertTriangle className="w-4 h-4" />
              <span className="text-sm">
                Elevation hierarchy violations detected: {hierarchyValidation.violations.join(', ')}
              </span>
            </div>
          )}
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Controls Sidebar */}
          <div className="lg:col-span-1 space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Controls</CardTitle>
                <CardDescription>
                  Adjust elevation parameters and context
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ControlsPanel state={state} onStateChange={setState} />
              </CardContent>
            </Card>
            
            <AccessibilityPanel state={state} onStateChange={setState} />
          </div>

          {/* Main Demo Area */}
          <div className="lg:col-span-3 space-y-6">
            <Tabs defaultValue="levels" className="w-full">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="levels">Elevation Levels</TabsTrigger>
                <TabsTrigger value="components">Component Types</TabsTrigger>
                <TabsTrigger value="code">Code Examples</TabsTrigger>
              </TabsList>
              
              <TabsContent value="levels" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Elevation Levels</CardTitle>
                    <CardDescription>
                      Click on different elevation levels to see how shadows adapt to your settings
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ElevationLevelShowcase state={state} onStateChange={setState} />
                  </CardContent>
                </Card>
              </TabsContent>
              
              <TabsContent value="components" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Semantic Component Elevations</CardTitle>
                    <CardDescription>
                      See how different component types automatically resolve to appropriate elevation levels
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ComponentTypeShowcase state={state} />
                  </CardContent>
                </Card>
              </TabsContent>
              
              <TabsContent value="code" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Code Examples</CardTitle>
                    <CardDescription>
                      Copy and use these code examples in your projects
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <CodeExamplesPanel state={state} />
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </div>
  );
}