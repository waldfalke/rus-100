/**
 * Example component demonstrating functional design token integration
 */

import React from 'react';
import { useTheme, useColorToken, useSpacingToken, useTokenStyles, useToken } from '../hooks';
import type { ThemeContext } from '../theme-contracts';

// ============================================================================
// EXAMPLE BUTTON COMPONENT
// ============================================================================

interface ButtonProps {
  variant?: 'primary' | 'secondary' | 'destructive';
  size?: 'sm' | 'md' | 'lg';
  children: React.ReactNode;
  onClick?: () => void;
  disabled?: boolean;
  themeOverride?: Partial<ThemeContext>;
}

export function ThemeButton({ 
  variant = 'primary', 
  size = 'md', 
  children, 
  onClick, 
  disabled = false,
  themeOverride 
}: ButtonProps) {
  const { get } = useTheme();
  
  // Get token values with context awareness
  const styles = useTokenStyles({
    backgroundColor: `button.${variant}.background`,
    color: `button.${variant}.text`,
    borderRadius: 'button.borderRadius',
    padding: `button.padding.${size}`,
    fontSize: `button.fontSize.${size}`,
    fontWeight: 'button.fontWeight',
    border: `button.${variant}.border`,
    boxShadow: disabled ? 'none' : 'button.shadow',
  }, { 
    context: { 
      ...themeOverride,
      component: { 
        state: disabled ? 'disabled' : 'default',
        variant,
        size 
      }
    }
  });
  
  return (
    <button
      style={styles}
      onClick={onClick}
      disabled={disabled}
      className="transition-all duration-200 hover:scale-105 active:scale-95"
    >
      {children}
    </button>
  );
}

// ============================================================================
// EXAMPLE CARD COMPONENT
// ============================================================================

interface CardProps {
  children: React.ReactNode;
  elevated?: boolean;
  interactive?: boolean;
  themeOverride?: Partial<ThemeContext>;
}

export function ThemeCard({ 
  children, 
  elevated = false, 
  interactive = false,
  themeOverride 
}: CardProps) {
  const backgroundColor = useColorToken('surface.primary', { 
    context: { 
      ...themeOverride,
      component: { 
        variant: elevated ? 'elevated' : 'default',
        interactive 
      }
    }
  });
  
  const padding = useSpacingToken('card.padding', { context: themeOverride });
  const borderRadius = useSpacingToken('card.borderRadius', { context: themeOverride });
  const shadow = useToken('card.shadow', { 
    context: { 
      ...themeOverride,
      component: { variant: elevated ? 'elevated' : 'default' }
    }
  });
  
  return (
    <div
      style={{
        backgroundColor: backgroundColor.value,
        padding: padding.value,
        borderRadius: borderRadius.value,
        boxShadow: shadow,
        cursor: interactive ? 'pointer' : 'default',
      }}
      className={`
        transition-all duration-200
        ${interactive ? 'hover:scale-102 hover:shadow-lg' : ''}
      `}
    >
      {children}
    </div>
  );
}

// ============================================================================
// EXAMPLE TEXT COMPONENT
// ============================================================================

interface TextProps {
  variant?: 'heading' | 'body' | 'caption';
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  weight?: 'light' | 'normal' | 'medium' | 'bold';
  children: React.ReactNode;
  themeOverride?: Partial<ThemeContext>;
}

export function ThemeText({ 
  variant = 'body', 
  size = 'md', 
  weight = 'normal',
  children,
  themeOverride 
}: TextProps) {
  const { get } = useTheme();
  
  // Resolve typography tokens based on variant and size
  const fontSize = get(`typography.fontSize.${size}`, themeOverride);
  const fontWeight = get(`typography.fontWeight.${weight}`, themeOverride);
  const lineHeight = get(`typography.lineHeight.${variant}`, themeOverride);
  const letterSpacing = get(`typography.letterSpacing.${variant}`, themeOverride);
  const color = get(`typography.color.${variant}`, themeOverride);
  
  return (
    <span
      style={{
        fontSize,
        fontWeight,
        lineHeight,
        letterSpacing,
        color,
      }}
    >
      {children}
    </span>
  );
}

// ============================================================================
// EXAMPLE LAYOUT COMPONENT
// ============================================================================

interface LayoutProps {
  children: React.ReactNode;
  spacing?: 'tight' | 'normal' | 'relaxed';
  maxWidth?: 'sm' | 'md' | 'lg' | 'xl' | 'full';
  themeOverride?: Partial<ThemeContext>;
}

export function ThemeLayout({ 
  children, 
  spacing = 'normal', 
  maxWidth = 'lg',
  themeOverride 
}: LayoutProps) {
  const styles = useTokenStyles({
    maxWidth: `layout.maxWidth.${maxWidth}`,
    padding: `layout.padding.${spacing}`,
    gap: `layout.gap.${spacing}`,
    backgroundColor: 'background.primary',
    color: 'foreground.primary',
  }, { context: themeOverride });
  
  return (
    <div
      style={styles}
      className="mx-auto min-h-screen flex flex-col"
    >
      {children}
    </div>
  );
}

// ============================================================================
// COMPREHENSIVE DEMO COMPONENT
// ============================================================================

export function ThemeDemo() {
  const { context, updateContext } = useTheme();
  
  const toggleTheme = () => {
    updateContext({
      mode: context.mode === 'light' ? 'dark' : 'light'
    });
  };
  
  const toggleContrast = () => {
    updateContext({
      accessibility: {
        ...context.accessibility,
        highContrast: !context.accessibility.highContrast
      }
    });
  };
  
  const togglePlatform = () => {
    updateContext({
      platform: context.platform === 'web' ? 'ios' : 'web'
    });
  };
  
  return (
    <ThemeLayout spacing="relaxed">
      <div className="flex flex-col gap-8">
        {/* Theme Controls */}
        <ThemeCard elevated>
          <ThemeText variant="heading" size="lg" weight="bold">
            Theme Controls
          </ThemeText>
          
          <div className="flex gap-4 mt-4">
            <ThemeButton onClick={toggleTheme}>
              Toggle Theme ({context.mode})
            </ThemeButton>
            
            <ThemeButton 
              variant="secondary" 
              onClick={toggleContrast}
            >
              Toggle Contrast ({context.accessibility.highContrast ? 'High' : 'Normal'})
            </ThemeButton>
            
            <ThemeButton 
              variant="destructive" 
              onClick={togglePlatform}
            >
              Platform: {context.platform}
            </ThemeButton>
          </div>
        </ThemeCard>
        
        {/* Typography Examples */}
        <ThemeCard>
          <ThemeText variant="heading" size="xl" weight="bold">
            Typography Scale
          </ThemeText>
          
          <div className="flex flex-col gap-2 mt-4">
            <ThemeText variant="heading" size="lg">Heading Large</ThemeText>
            <ThemeText variant="heading" size="md">Heading Medium</ThemeText>
            <ThemeText variant="body" size="lg">Body Large</ThemeText>
            <ThemeText variant="body" size="md">Body Medium</ThemeText>
            <ThemeText variant="body" size="sm">Body Small</ThemeText>
            <ThemeText variant="caption" size="xs">Caption Text</ThemeText>
          </div>
        </ThemeCard>
        
        {/* Button Variants */}
        <ThemeCard>
          <ThemeText variant="heading" size="lg" weight="bold">
            Button Variants
          </ThemeText>
          
          <div className="flex gap-4 mt-4">
            <ThemeButton variant="primary" size="lg">
              Primary Large
            </ThemeButton>
            <ThemeButton variant="secondary" size="md">
              Secondary Medium
            </ThemeButton>
            <ThemeButton variant="destructive" size="sm">
              Destructive Small
            </ThemeButton>
            <ThemeButton variant="primary" disabled>
              Disabled
            </ThemeButton>
          </div>
        </ThemeCard>
        
        {/* Interactive Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <ThemeCard interactive>
            <ThemeText variant="heading" size="md" weight="medium">
              Interactive Card
            </ThemeText>
            <ThemeText variant="body" size="sm">
              This card responds to hover and has interactive styling.
            </ThemeText>
          </ThemeCard>
          
          <ThemeCard elevated>
            <ThemeText variant="heading" size="md" weight="medium">
              Elevated Card
            </ThemeText>
            <ThemeText variant="body" size="sm">
              This card has elevated styling with enhanced shadows.
            </ThemeText>
          </ThemeCard>
        </div>
        
        {/* Context Information */}
        <ThemeCard>
          <ThemeText variant="heading" size="lg" weight="bold">
            Current Theme Context
          </ThemeText>
          
          <pre className="mt-4 p-4 bg-gray-100 dark:bg-gray-800 rounded text-sm overflow-auto">
            {JSON.stringify(context, null, 2)}
          </pre>
        </ThemeCard>
      </div>
    </ThemeLayout>
  );
}

export { ThemeDemo as ThemeExample };