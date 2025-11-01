/**
 * Comprehensive Design Token System Showcase
 * 
 * Demonstrates all features of the modernized design token system:
 * - OKLCH palette generation
 * - WCAG compliance validation
 * - Context-aware token resolution
 * - Override and fallback mechanisms
 * - Real-time accessibility testing
 * - Functional spacing and border-radius tokens
 */

'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { type OKLCHColor, oklch, generateColorPalette } from '../../lib/color/oklch';
import { paletteGenerator } from '../../lib/color/palette-generator';
import { wcagValidator } from '../../lib/accessibility/wcag-validator';
import { fallbackOverrideSystem } from '../../lib/overrides/fallback-system';
import { type ThemeContext } from '../../lib/theme-contracts';
import SpacingRadiusDemo from '../../components/demos/spacing-radius-demo';

// ============================================================================
// TYPES
// ============================================================================

interface ShowcaseState {
  brandPrimary: OKLCHColor;
  brandSecondary: OKLCHColor;
  themeMode: 'light' | 'dark' | 'high-contrast';
  platform: 'web' | 'ios' | 'android';
  accessibilityMode: 'standard' | 'high-contrast' | 'low-vision';
  wcagLevel: 'AA' | 'AAA';
  showOverrides: boolean;
  showValidation: boolean;
  showPerformance: boolean;
}

interface GeneratedPalette {
  colors: Record<string, any>;
  validation: {
    passes: boolean;
    issues: Array<{ path: string; issue: string; severity: string }>;
    suggestions: string[];
  };
  performance: {
    generationTime: number;
    validationTime: number;
    overrideTime: number;
  };
}

// ============================================================================
// MAIN COMPONENT
// ============================================================================

export default function ComprehensiveShowcase() {
  const [state, setState] = useState<ShowcaseState>({
    brandPrimary: { l: 0.6, c: 0.15, h: 220 },
    brandSecondary: { l: 0.7, c: 0.12, h: 160 },
    themeMode: 'light',
    platform: 'web',
    accessibilityMode: 'standard',
    wcagLevel: 'AA',
    showOverrides: false,
    showValidation: true,
    showPerformance: false
  });

  const [generatedPalette, setGeneratedPalette] = useState<GeneratedPalette | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);

  // Create theme context from current state
  const themeContext: ThemeContext = useMemo(() => ({
    mode: state.themeMode,
    platform: state.platform,
    accessibility: {
      mode: state.accessibilityMode,
      reducedMotion: false,
      highContrast: state.accessibilityMode === 'high-contrast',
      colorBlindness: null
    },
    user: {
      preferences: {
        contrastPreference: state.wcagLevel === 'AAA' ? 'high' : 'normal'
      }
    },
    environment: {
      lighting: 'normal',
      device: 'desktop'
    }
  }), [state]);

  // Generate palette when inputs change
  useEffect(() => {
    generatePalette();
  }, [state.brandPrimary, state.brandSecondary, state.themeMode, state.wcagLevel]);

  const generatePalette = async () => {
    setIsGenerating(true);
    const startTime = performance.now();

    try {
      // 1. Generate base palette
      const generationStart = performance.now();
      const palette = paletteGenerator.generatePalette({
        brandColors: {
          primary: state.brandPrimary,
          secondary: state.brandSecondary
        },
        mode: state.themeMode,
        wcagLevel: state.wcagLevel,
        steps: 9,
        generateSemanticRoles: true
      });
      const generationTime = performance.now() - generationStart;

      // 2. Apply overrides
      const overrideStart = performance.now();
      const paletteWithOverrides = fallbackOverrideSystem.applyOverridesToPalette(
        palette,
        themeContext
      );
      const overrideTime = performance.now() - overrideStart;

      // 3. Validate WCAG compliance
      const validationStart = performance.now();
      const validation = await validatePalette(paletteWithOverrides);
      const validationTime = performance.now() - validationStart;

      setGeneratedPalette({
        colors: paletteWithOverrides,
        validation,
        performance: {
          generationTime,
          validationTime,
          overrideTime
        }
      });
    } catch (error) {
      console.error('Palette generation failed:', error);
    } finally {
      setIsGenerating(false);
    }
  };

  // Validate generated palette
  const validatePalette = async (palette: any) => {
    const colorPairs = new Map();
    
    // Extract color pairs for validation
    if (palette.text && palette.backgrounds) {
      colorPairs.set('text-primary', {
        foreground: palette.text.primary,
        background: palette.backgrounds.page
      });
      colorPairs.set('text-secondary', {
        foreground: palette.text.secondary,
        background: palette.backgrounds.surface
      });
    }

    const report = wcagValidator.validatePalette(colorPairs, {
      level: state.wcagLevel,
      textSize: 'normal',
      componentType: 'text',
      includeNonText: true
    });

    return {
      passes: report.overallCompliance !== 'fail',
      issues: Array.from(report.results.entries()).map(([key, result]) => ({
        path: key,
        issue: result.details.description,
        severity: result.passes ? 'info' : 'error'
      })),
      suggestions: report.autoFixSuggestions.map(fix => fix.description)
    };
  };

  const extractColors = (obj: any, path = ''): Array<[string, OKLCHColor]> => {
    const colors: Array<[string, OKLCHColor]> = [];
    
    for (const [key, value] of Object.entries(obj)) {
      const currentPath = path ? `${path}.${key}` : key;
      
      if (typeof value === 'object' && value !== null) {
        colors.push(...extractColors(value, currentPath));
      } else if (typeof value === 'string' && value.startsWith('oklch(')) {
        try {
          colors.push([currentPath, oklch(value)]);
        } catch (error) {
          console.warn(`Failed to parse color at ${currentPath}:`, value);
        }
      }
    }
    
    return colors;
  };

  const updateBrandColor = (type: 'primary' | 'secondary', property: 'l' | 'c' | 'h', value: number) => {
    setState(prev => ({
      ...prev,
      [`brand${type.charAt(0).toUpperCase() + type.slice(1)}`]: {
        ...prev[`brand${type.charAt(0).toUpperCase() + type.slice(1)}` as keyof ShowcaseState] as OKLCHColor,
        [property]: value
      }
    }));
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
            Design Token System Showcase
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-300">
            Comprehensive demonstration of OKLCH palette generation, WCAG compliance, 
            and context-aware design tokens.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Controls Panel */}
          <div className="lg:col-span-1">
            <ControlsPanel
              state={state}
              setState={setState}
              onBrandColorUpdate={updateBrandColor}
              onGenerate={generatePalette}
              isGenerating={isGenerating}
            />
          </div>

          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Palette Display */}
            {generatedPalette && (
              <PaletteDisplay
                palette={generatedPalette}
                themeContext={themeContext}
                showValidation={state.showValidation}
                showPerformance={state.showPerformance}
              />
            )}

            {/* Component Examples */}
            <ComponentExamples
              palette={generatedPalette?.colors}
              themeMode={state.themeMode}
            />

            {/* Accessibility Testing */}
            {state.showValidation && generatedPalette && (
              <AccessibilityTesting
                validation={generatedPalette.validation}
                wcagLevel={state.wcagLevel}
              />
            )}

            {/* Override Management */}
            {state.showOverrides && (
              <OverrideManagement
                themeContext={themeContext}
              />
            )}

            {/* Spacing and Border-Radius Demo */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
              <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-6">
                Functional Spacing & Border-Radius Tokens
              </h2>
              <SpacingRadiusDemo />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ============================================================================
// CONTROLS PANEL
// ============================================================================

interface ControlsPanelProps {
  state: ShowcaseState;
  setState: React.Dispatch<React.SetStateAction<ShowcaseState>>;
  onBrandColorUpdate: (type: 'primary' | 'secondary', property: 'l' | 'c' | 'h', value: number) => void;
  onGenerate: () => void;
  isGenerating: boolean;
}

function ControlsPanel({ state, setState, onBrandColorUpdate, onGenerate, isGenerating }: ControlsPanelProps) {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 space-y-6">
      <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">
        Configuration
      </h2>

      {/* Brand Colors */}
      <div className="space-y-4">
        <h3 className="text-lg font-medium text-gray-900 dark:text-white">Brand Colors</h3>
        
        {/* Primary Color */}
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Primary Color
          </label>
          <div className="grid grid-cols-3 gap-2">
            <div>
              <label className="block text-xs text-gray-500">L</label>
              <input
                type="range"
                min="0"
                max="1"
                step="0.01"
                value={state.brandPrimary.l}
                onChange={(e) => onBrandColorUpdate('primary', 'l', parseFloat(e.target.value))}
                className="w-full"
              />
              <span className="text-xs text-gray-500">{state.brandPrimary.l.toFixed(2)}</span>
            </div>
            <div>
              <label className="block text-xs text-gray-500">C</label>
              <input
                type="range"
                min="0"
                max="0.5"
                step="0.01"
                value={state.brandPrimary.c}
                onChange={(e) => onBrandColorUpdate('primary', 'c', parseFloat(e.target.value))}
                className="w-full"
              />
              <span className="text-xs text-gray-500">{state.brandPrimary.c.toFixed(2)}</span>
            </div>
            <div>
              <label className="block text-xs text-gray-500">H</label>
              <input
                type="range"
                min="0"
                max="360"
                step="1"
                value={state.brandPrimary.h}
                onChange={(e) => onBrandColorUpdate('primary', 'h', parseFloat(e.target.value))}
                className="w-full"
              />
              <span className="text-xs text-gray-500">{state.brandPrimary.h.toFixed(0)}°</span>
            </div>
          </div>
          <div 
            className="w-full h-8 rounded border"
            style={{ 
              backgroundColor: `oklch(${state.brandPrimary.l} ${state.brandPrimary.c} ${state.brandPrimary.h})` 
            }}
          />
        </div>

        {/* Secondary Color */}
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Secondary Color
          </label>
          <div className="grid grid-cols-3 gap-2">
            <div>
              <label className="block text-xs text-gray-500">L</label>
              <input
                type="range"
                min="0"
                max="1"
                step="0.01"
                value={state.brandSecondary.l}
                onChange={(e) => onBrandColorUpdate('secondary', 'l', parseFloat(e.target.value))}
                className="w-full"
              />
              <span className="text-xs text-gray-500">{state.brandSecondary.l.toFixed(2)}</span>
            </div>
            <div>
              <label className="block text-xs text-gray-500">C</label>
              <input
                type="range"
                min="0"
                max="0.5"
                step="0.01"
                value={state.brandSecondary.c}
                onChange={(e) => onBrandColorUpdate('secondary', 'c', parseFloat(e.target.value))}
                className="w-full"
              />
              <span className="text-xs text-gray-500">{state.brandSecondary.c.toFixed(2)}</span>
            </div>
            <div>
              <label className="block text-xs text-gray-500">H</label>
              <input
                type="range"
                min="0"
                max="360"
                step="1"
                value={state.brandSecondary.h}
                onChange={(e) => onBrandColorUpdate('secondary', 'h', parseFloat(e.target.value))}
                className="w-full"
              />
              <span className="text-xs text-gray-500">{state.brandSecondary.h.toFixed(0)}°</span>
            </div>
          </div>
          <div 
            className="w-full h-8 rounded border"
            style={{ 
              backgroundColor: `oklch(${state.brandSecondary.l} ${state.brandSecondary.c} ${state.brandSecondary.h})` 
            }}
          />
        </div>
      </div>

      {/* Theme Settings */}
      <div className="space-y-4">
        <h3 className="text-lg font-medium text-gray-900 dark:text-white">Theme Settings</h3>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Theme Mode
          </label>
          <select
            value={state.themeMode}
            onChange={(e) => setState(prev => ({ ...prev, themeMode: e.target.value as any }))}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="light">Light</option>
            <option value="dark">Dark</option>
            <option value="high-contrast">High Contrast</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Platform
          </label>
          <select
            value={state.platform}
            onChange={(e) => setState(prev => ({ ...prev, platform: e.target.value as any }))}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="web">Web</option>
            <option value="ios">iOS</option>
            <option value="android">Android</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            WCAG Level
          </label>
          <select
            value={state.wcagLevel}
            onChange={(e) => setState(prev => ({ ...prev, wcagLevel: e.target.value as any }))}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="AA">WCAG AA (4.5:1)</option>
            <option value="AAA">WCAG AAA (7:1)</option>
          </select>
        </div>
      </div>

      {/* Display Options */}
      <div className="space-y-4">
        <h3 className="text-lg font-medium text-gray-900 dark:text-white">Display Options</h3>
        
        <div className="space-y-2">
          <label className="flex items-center">
            <input
              type="checkbox"
              checked={state.showValidation}
              onChange={(e) => setState(prev => ({ ...prev, showValidation: e.target.checked }))}
              className="mr-2"
            />
            <span className="text-sm text-gray-700 dark:text-gray-300">Show Validation</span>
          </label>
          
          <label className="flex items-center">
            <input
              type="checkbox"
              checked={state.showPerformance}
              onChange={(e) => setState(prev => ({ ...prev, showPerformance: e.target.checked }))}
              className="mr-2"
            />
            <span className="text-sm text-gray-700 dark:text-gray-300">Show Performance</span>
          </label>
          
          <label className="flex items-center">
            <input
              type="checkbox"
              checked={state.showOverrides}
              onChange={(e) => setState(prev => ({ ...prev, showOverrides: e.target.checked }))}
              className="mr-2"
            />
            <span className="text-sm text-gray-700 dark:text-gray-300">Show Overrides</span>
          </label>
        </div>
      </div>

      {/* Generate Button */}
      <button
        onClick={onGenerate}
        disabled={isGenerating}
        className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-medium py-2 px-4 rounded-md transition-colors"
      >
        {isGenerating ? 'Generating...' : 'Generate Palette'}
      </button>
    </div>
  );
}

// ============================================================================
// PALETTE DISPLAY
// ============================================================================

interface PaletteDisplayProps {
  palette: GeneratedPalette;
  themeContext: ThemeContext;
  showValidation: boolean;
  showPerformance: boolean;
}

function PaletteDisplay({ palette, themeContext, showValidation, showPerformance }: PaletteDisplayProps) {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">
          Generated Palette
        </h2>
        
        {showPerformance && (
          <div className="text-sm text-gray-500 space-x-4">
            <span>Gen: {palette.performance.generationTime.toFixed(1)}ms</span>
            <span>Val: {palette.performance.validationTime.toFixed(1)}ms</span>
            <span>Override: {palette.performance.overrideTime.toFixed(1)}ms</span>
          </div>
        )}
      </div>

      {/* Color Swatches */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {renderColorSection('Primary', palette.colors.colors?.primary)}
        {renderColorSection('Secondary', palette.colors.colors?.secondary)}
        {renderColorSection('Background', palette.colors.colors?.background)}
        {renderColorSection('Text', palette.colors.colors?.text)}
        {renderColorSection('Border', palette.colors.colors?.border)}
        {renderColorSection('Semantic', {
          success: palette.colors.colors?.success?.['500'],
          warning: palette.colors.colors?.warning?.['500'],
          error: palette.colors.colors?.error?.['500'],
          info: palette.colors.colors?.info?.['500']
        })}
      </div>

      {/* Validation Results */}
      {showValidation && (
        <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
            WCAG Validation
          </h3>
          
          <div className="flex items-center mb-4">
            <div className={`w-4 h-4 rounded-full mr-2 ${
              palette.validation.passes ? 'bg-green-500' : 'bg-red-500'
            }`} />
            <span className={`font-medium ${
              palette.validation.passes ? 'text-green-700 dark:text-green-400' : 'text-red-700 dark:text-red-400'
            }`}>
              {palette.validation.passes ? 'All checks passed' : `${palette.validation.issues.length} issues found`}
            </span>
          </div>

          {palette.validation.issues.length > 0 && (
            <div className="space-y-2">
              {palette.validation.issues.map((issue, index) => (
                <div key={index} className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded p-3">
                  <div className="font-medium text-red-800 dark:text-red-400">{issue.path}</div>
                  <div className="text-sm text-red-600 dark:text-red-300">{issue.issue}</div>
                </div>
              ))}
            </div>
          )}

          {palette.validation.suggestions.length > 0 && (
            <div className="mt-4">
              <h4 className="font-medium text-gray-900 dark:text-white mb-2">Suggestions:</h4>
              <ul className="list-disc list-inside space-y-1 text-sm text-gray-600 dark:text-gray-400">
                {palette.validation.suggestions.map((suggestion, index) => (
                  <li key={index}>{suggestion}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

function renderColorSection(title: string, colors: any) {
  if (!colors) return null;

  return (
    <div>
      <h3 className="font-medium text-gray-900 dark:text-white mb-3">{title}</h3>
      <div className="space-y-2">
        {Object.entries(colors).map(([key, value]) => {
          if (typeof value !== 'string') return null;
          
          return (
            <div key={key} className="flex items-center space-x-3">
              <div
                className="w-8 h-8 rounded border border-gray-300"
                style={{ backgroundColor: value }}
              />
              <div className="flex-1 min-w-0">
                <div className="text-sm font-medium text-gray-900 dark:text-white">{key}</div>
                <div className="text-xs text-gray-500 font-mono truncate">{value}</div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ============================================================================
// COMPONENT EXAMPLES
// ============================================================================

interface ComponentExamplesProps {
  palette: Record<string, any> | undefined;
  themeMode: string;
}

function ComponentExamples({ palette, themeMode }: ComponentExamplesProps) {
  if (!palette) return null;

  const colors = palette.colors || {};

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
      <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-6">
        Component Examples
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Buttons */}
        <div>
          <h3 className="font-medium text-gray-900 dark:text-white mb-3">Buttons</h3>
          <div className="space-y-3">
            <button
              className="px-4 py-2 rounded font-medium"
              style={{
                backgroundColor: colors.primary?.['500'],
                color: colors.text?.primary
              }}
            >
              Primary Button
            </button>
            <button
              className="px-4 py-2 rounded font-medium border"
              style={{
                backgroundColor: colors.background?.primary,
                color: colors.primary?.['500'],
                borderColor: colors.primary?.['500']
              }}
            >
              Secondary Button
            </button>
          </div>
        </div>

        {/* Cards */}
        <div>
          <h3 className="font-medium text-gray-900 dark:text-white mb-3">Cards</h3>
          <div
            className="p-4 rounded-lg border"
            style={{
              backgroundColor: colors.background?.surface,
              borderColor: colors.border?.primary
            }}
          >
            <h4
              className="font-medium mb-2"
              style={{ color: colors.text?.primary }}
            >
              Card Title
            </h4>
            <p
              className="text-sm"
              style={{ color: colors.text?.secondary }}
            >
              This is an example card using the generated color palette.
            </p>
          </div>
        </div>

        {/* Alerts */}
        <div>
          <h3 className="font-medium text-gray-900 dark:text-white mb-3">Alerts</h3>
          <div className="space-y-2">
            {['success', 'warning', 'error', 'info'].map(type => (
              <div
                key={type}
                className="p-3 rounded border-l-4 text-sm"
                style={{
                  backgroundColor: colors[type]?.['50'] || colors.background?.surface,
                  borderLeftColor: colors[type]?.['500'],
                  color: colors[type]?.['700'] || colors.text?.primary
                }}
              >
                {type.charAt(0).toUpperCase() + type.slice(1)} alert message
              </div>
            ))}
          </div>
        </div>

        {/* Form Elements */}
        <div>
          <h3 className="font-medium text-gray-900 dark:text-white mb-3">Form Elements</h3>
          <div className="space-y-3">
            <input
              type="text"
              placeholder="Input field"
              className="w-full px-3 py-2 rounded border"
              style={{
                backgroundColor: colors.background?.primary,
                borderColor: colors.border?.primary,
                color: colors.text?.primary
              }}
            />
            <select
              className="w-full px-3 py-2 rounded border"
              style={{
                backgroundColor: colors.background?.primary,
                borderColor: colors.border?.primary,
                color: colors.text?.primary
              }}
            >
              <option>Select option</option>
            </select>
          </div>
        </div>
      </div>
    </div>
  );
}

// ============================================================================
// ACCESSIBILITY TESTING
// ============================================================================

interface AccessibilityTestingProps {
  validation: GeneratedPalette['validation'];
  wcagLevel: 'AA' | 'AAA';
}

function AccessibilityTesting({ validation, wcagLevel }: AccessibilityTestingProps) {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
      <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-6">
        Accessibility Testing
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* WCAG Compliance */}
        <div>
          <h3 className="font-medium text-gray-900 dark:text-white mb-3">
            WCAG {wcagLevel} Compliance
          </h3>
          
          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded">
              <span className="text-sm">Overall Compliance</span>
              <span className={`font-medium ${
                validation.passes ? 'text-green-600' : 'text-red-600'
              }`}>
                {validation.passes ? 'PASS' : 'FAIL'}
              </span>
            </div>
            
            <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded">
              <span className="text-sm">Issues Found</span>
              <span className="font-medium">{validation.issues.length}</span>
            </div>
            
            <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded">
              <span className="text-sm">Suggestions</span>
              <span className="font-medium">{validation.suggestions.length}</span>
            </div>
          </div>
        </div>

        {/* Color Blindness Simulation */}
        <div>
          <h3 className="font-medium text-gray-900 dark:text-white mb-3">
            Color Blindness Simulation
          </h3>
          
          <div className="text-sm text-gray-600 dark:text-gray-400">
            <p>Simulations for different types of color blindness would be displayed here.</p>
            <p className="mt-2">This would include:</p>
            <ul className="list-disc list-inside mt-1 space-y-1">
              <li>Protanopia (red-blind)</li>
              <li>Deuteranopia (green-blind)</li>
              <li>Tritanopia (blue-blind)</li>
              <li>Achromatopsia (completely color blind)</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}

// ============================================================================
// OVERRIDE MANAGEMENT
// ============================================================================

interface OverrideManagementProps {
  themeContext: ThemeContext;
}

function OverrideManagement({ themeContext }: OverrideManagementProps) {
  const [overrides, setOverrides] = useState<any[]>([]);
  const [metrics, setMetrics] = useState<any>(null);

  useEffect(() => {
    // Load current overrides and metrics
    const currentMetrics = fallbackOverrideSystem.getMetrics();
    setMetrics(currentMetrics);
  }, []);

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
      <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-6">
        Override Management
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* System Metrics */}
        <div>
          <h3 className="font-medium text-gray-900 dark:text-white mb-3">System Metrics</h3>
          
          {metrics && (
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded">
                <span className="text-sm">Active Overrides</span>
                <span className="font-medium">{metrics.activeOverrides}</span>
              </div>
              
              <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded">
                <span className="text-sm">Fallbacks Triggered</span>
                <span className="font-medium">{metrics.fallbacksTriggered}</span>
              </div>
              
              <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded">
                <span className="text-sm">Success Rate</span>
                <span className="font-medium">{(metrics.successRate * 100).toFixed(1)}%</span>
              </div>
              
              <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded">
                <span className="text-sm">Avg Resolution Time</span>
                <span className="font-medium">{metrics.performanceImpact.averageResolutionTime.toFixed(2)}ms</span>
              </div>
            </div>
          )}
        </div>

        {/* Override Controls */}
        <div>
          <h3 className="font-medium text-gray-900 dark:text-white mb-3">Quick Actions</h3>
          
          <div className="space-y-3">
            <button
              onClick={() => {
                const brandOverrides = fallbackOverrideSystem.createBrandOverrides({
                  primaryColor: { l: 0.6, c: 0.15, h: 220 },
                  secondaryColor: { l: 0.7, c: 0.12, h: 160 }
                });
                brandOverrides.forEach(override => {
                  fallbackOverrideSystem.registerOverride(override);
                });
              }}
              className="w-full px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded font-medium"
            >
              Apply Brand Overrides
            </button>
            
            <button
              onClick={() => {
                const a11yOverrides = fallbackOverrideSystem.createAccessibilityOverrides({
                  contrastRequirements: { normal: 7, large: 4.5 }
                });
                a11yOverrides.forEach(override => {
                  fallbackOverrideSystem.registerOverride(override);
                });
              }}
              className="w-full px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded font-medium"
            >
              Apply A11y Overrides
            </button>
            
            <button
              onClick={() => {
                fallbackOverrideSystem.clearCache();
              }}
              className="w-full px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded font-medium"
            >
              Clear Cache
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}