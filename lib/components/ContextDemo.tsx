/**
 * Context-aware token resolution demonstration
 */

import React, { useState, useEffect } from 'react';
import { useTheme, useColorToken, useSpacingToken } from '../hooks';
import { 
  platformDetector, 
  accessibilityDetector, 
  contextBuilder,
  type PlatformInfo,
  type AccessibilityPreferences 
} from '../context';
import type { ThemeContext } from '../theme-contracts';

// ============================================================================
// PLATFORM INFO DISPLAY
// ============================================================================

const PlatformInfoDisplay: React.FC = () => {
  const [platformInfo, setPlatformInfo] = useState<PlatformInfo | null>(null);
  
  useEffect(() => {
    setPlatformInfo(platformDetector.detectPlatform());
  }, []);
  
  if (!platformInfo) return <div>Detecting platform...</div>;
  
  return (
    <div style={{ 
      padding: '1rem', 
      border: '1px solid #ccc', 
      borderRadius: '8px',
      marginBottom: '1rem' 
    }}>
      <h3>Platform Information</h3>
      <p><strong>Platform:</strong> {platformInfo.platform}</p>
      {platformInfo.version && <p><strong>Version:</strong> {platformInfo.version}</p>}
      <h4>Capabilities:</h4>
      <ul>
        <li>Touch Support: {platformInfo.capabilities.touchSupport ? '✅' : '❌'}</li>
        <li>Hover Support: {platformInfo.capabilities.hoverSupport ? '✅' : '❌'}</li>
        <li>Keyboard Navigation: {platformInfo.capabilities.keyboardNavigation ? '✅' : '❌'}</li>
        <li>Screen Reader: {platformInfo.capabilities.screenReader ? '✅' : '❌'}</li>
      </ul>
    </div>
  );
};

// ============================================================================
// ACCESSIBILITY PREFERENCES DISPLAY
// ============================================================================

const AccessibilityDisplay: React.FC = () => {
  const [preferences, setPreferences] = useState<AccessibilityPreferences | null>(null);
  
  useEffect(() => {
    const initialPrefs = accessibilityDetector.detectPreferences();
    setPreferences(initialPrefs);
    
    const unsubscribe = accessibilityDetector.subscribe((newPrefs) => {
      setPreferences(newPrefs);
    });
    
    return unsubscribe;
  }, []);
  
  if (!preferences) return <div>Detecting accessibility preferences...</div>;
  
  return (
    <div style={{ 
      padding: '1rem', 
      border: '1px solid #ccc', 
      borderRadius: '8px',
      marginBottom: '1rem' 
    }}>
      <h3>Accessibility Preferences</h3>
      <ul>
        <li>Reduced Motion: {preferences.reducedMotion ? '✅' : '❌'}</li>
        <li>High Contrast: {preferences.highContrast ? '✅' : '❌'}</li>
        <li>Large Text: {preferences.largeText ? '✅' : '❌'}</li>
        <li>Dark Mode: {preferences.darkMode ? '✅' : '❌'}</li>
        <li>Forced Colors: {preferences.forcedColors ? '✅' : '❌'}</li>
      </ul>
    </div>
  );
};

// ============================================================================
// CONTEXT-AWARE BUTTON
// ============================================================================

const ContextAwareButton: React.FC<{ 
  children: React.ReactNode;
  variant?: 'primary' | 'secondary';
}> = ({ children, variant = 'primary' }) => {
  const { context, updateContext } = useTheme();
  const backgroundColor = useColorToken(
    variant === 'primary' ? 'colors.brandPrimary' : 'colors.brandSecondary'
  );
  const textColor = useColorToken('colors.foreground');
  const padding = useSpacingToken('spacing.md');
  const borderRadius = useSpacingToken('spacing.xs');
  
  // Update component context for this button
  useEffect(() => {
    updateContext({
      component: {
        ...context.component,
        variant,
        state: 'default',
      },
    });
  }, [variant, updateContext, context.component]);
  
  return (
    <button
      style={{
        backgroundColor: backgroundColor.value,
        color: textColor.value,
        padding: padding.value,
        borderRadius: borderRadius.value,
        border: 'none',
        cursor: 'pointer',
        fontSize: '1rem',
        fontWeight: '500',
        transition: 'all 0.2s ease',
        margin: '0.5rem',
      }}
      onMouseEnter={(e) => {
        updateContext({
          component: {
            ...context.component,
            state: 'hover',
          },
        });
      }}
      onMouseLeave={(e) => {
        updateContext({
          component: {
            ...context.component,
            state: 'default',
          },
        });
      }}
      onMouseDown={(e) => {
        updateContext({
          component: {
            ...context.component,
            state: 'active',
          },
        });
      }}
      onMouseUp={(e) => {
        updateContext({
          component: {
            ...context.component,
            state: 'hover',
          },
        });
      }}
    >
      {children}
    </button>
  );
};

// ============================================================================
// CONTEXT CONTROLS
// ============================================================================

const ContextControls: React.FC = () => {
  const { context, updateContext } = useTheme();
  
  return (
    <div style={{ 
      padding: '1rem', 
      border: '1px solid #ccc', 
      borderRadius: '8px',
      marginBottom: '1rem' 
    }}>
      <h3>Context Controls</h3>
      
      <div style={{ marginBottom: '1rem' }}>
        <label>
          <strong>Theme Mode:</strong>
          <select 
            value={context.mode} 
            onChange={(e) => updateContext({ mode: e.target.value as 'light' | 'dark' })}
            style={{ marginLeft: '0.5rem' }}
          >
            <option value="light">Light</option>
            <option value="dark">Dark</option>
          </select>
        </label>
      </div>
      
      <div style={{ marginBottom: '1rem' }}>
        <label>
          <strong>Platform:</strong>
          <select 
            value={context.platform} 
            onChange={(e) => updateContext({ platform: e.target.value as ThemeContext['platform'] })}
            style={{ marginLeft: '0.5rem' }}
          >
            <option value="web">Web</option>
            <option value="ios">iOS</option>
            <option value="android">Android</option>
            <option value="macos">macOS</option>
            <option value="windows">Windows</option>
            <option value="linux">Linux</option>
          </select>
        </label>
      </div>
      
      <div style={{ marginBottom: '1rem' }}>
        <label>
          <strong>Viewport:</strong>
          <select 
            value={context.viewport} 
            onChange={(e) => updateContext({ viewport: e.target.value as ThemeContext['viewport'] })}
            style={{ marginLeft: '0.5rem' }}
          >
            <option value="mobile">Mobile</option>
            <option value="tablet">Tablet</option>
            <option value="desktop">Desktop</option>
          </select>
        </label>
      </div>
      
      <div>
        <h4>Accessibility Overrides:</h4>
        <label style={{ display: 'block', marginBottom: '0.5rem' }}>
          <input
            type="checkbox"
            checked={context.accessibility.highContrast}
            onChange={(e) => updateContext({
              accessibility: {
                ...context.accessibility,
                highContrast: e.target.checked,
              },
            })}
          />
          <span style={{ marginLeft: '0.5rem' }}>High Contrast</span>
        </label>
        
        <label style={{ display: 'block', marginBottom: '0.5rem' }}>
          <input
            type="checkbox"
            checked={context.accessibility.largeText}
            onChange={(e) => updateContext({
              accessibility: {
                ...context.accessibility,
                largeText: e.target.checked,
              },
            })}
          />
          <span style={{ marginLeft: '0.5rem' }}>Large Text</span>
        </label>
        
        <label style={{ display: 'block', marginBottom: '0.5rem' }}>
          <input
            type="checkbox"
            checked={context.accessibility.reducedMotion}
            onChange={(e) => updateContext({
              accessibility: {
                ...context.accessibility,
                reducedMotion: e.target.checked,
              },
            })}
          />
          <span style={{ marginLeft: '0.5rem' }}>Reduced Motion</span>
        </label>
      </div>
    </div>
  );
};

// ============================================================================
// TOKEN VALUES DISPLAY
// ============================================================================

const TokenValuesDisplay: React.FC = () => {
  const { context, get } = useTheme();
  
  const tokenPaths = [
    'colors.brandPrimary',
    'colors.background',
    'colors.foreground',
    'spacing.md',
    'spacing.lg',
    'typography.fontSize.md',
    'typography.lineHeight.normal',
  ];
  
  return (
    <div style={{ 
      padding: '1rem', 
      border: '1px solid #ccc', 
      borderRadius: '8px',
      marginBottom: '1rem' 
    }}>
      <h3>Resolved Token Values</h3>
      <div style={{ fontFamily: 'monospace', fontSize: '0.9rem' }}>
        {tokenPaths.map(path => {
          const value = get(path);
          return (
            <div key={path} style={{ marginBottom: '0.5rem' }}>
              <strong>{path}:</strong> {JSON.stringify(value)}
            </div>
          );
        })}
      </div>
    </div>
  );
};

// ============================================================================
// MAIN DEMO COMPONENT
// ============================================================================

export const ContextDemo: React.FC = () => {
  const [autoContext, setAutoContext] = useState<ThemeContext | null>(null);
  
  useEffect(() => {
    // Build context from environment
    const context = contextBuilder.buildContext();
    setAutoContext(context);
    
    // Subscribe to changes
    const unsubscribe = contextBuilder.subscribeToChanges((newContext) => {
      setAutoContext(newContext);
    });
    
    return unsubscribe;
  }, []);
  
  return (
    <div style={{ padding: '2rem', maxWidth: '1200px', margin: '0 auto' }}>
      <h1>Context-Aware Design Token System Demo</h1>
      <p>
        This demo shows how the design token system automatically adapts to platform, 
        accessibility preferences, and user context.
      </p>
      
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
        <div>
          <PlatformInfoDisplay />
          <AccessibilityDisplay />
          
          {autoContext && (
            <div style={{ 
              padding: '1rem', 
              border: '1px solid #ccc', 
              borderRadius: '8px',
              marginBottom: '1rem' 
            }}>
              <h3>Auto-Detected Context</h3>
              <pre style={{ fontSize: '0.8rem', overflow: 'auto' }}>
                {JSON.stringify(autoContext, null, 2)}
              </pre>
            </div>
          )}
        </div>
        
        <div>
          <ContextControls />
          <TokenValuesDisplay />
          
          <div style={{ 
            padding: '1rem', 
            border: '1px solid #ccc', 
            borderRadius: '8px',
            marginBottom: '1rem' 
          }}>
            <h3>Context-Aware Components</h3>
            <p>These buttons adapt their styling based on the current context:</p>
            <ContextAwareButton variant="primary">Primary Button</ContextAwareButton>
            <ContextAwareButton variant="secondary">Secondary Button</ContextAwareButton>
          </div>
        </div>
      </div>
    </div>
  );
};