/**
 * Platform and accessibility detection utilities
 */

import type { ThemeContext } from '../theme-contracts';

// ============================================================================
// PLATFORM DETECTION
// ============================================================================

export interface PlatformInfo {
  platform: ThemeContext['platform'];
  version?: string;
  capabilities: {
    touchSupport: boolean;
    hoverSupport: boolean;
    keyboardNavigation: boolean;
    screenReader: boolean;
  };
}

export class PlatformDetector {
  private static instance: PlatformDetector;
  private platformInfo: PlatformInfo | null = null;
  
  static getInstance(): PlatformDetector {
    if (!PlatformDetector.instance) {
      PlatformDetector.instance = new PlatformDetector();
    }
    return PlatformDetector.instance;
  }
  
  /**
   * Detect current platform
   */
  detectPlatform(): PlatformInfo {
    if (this.platformInfo) {
      return this.platformInfo;
    }
    
    // Server-side rendering fallback
    if (typeof window === 'undefined') {
      this.platformInfo = {
        platform: 'web',
        capabilities: {
          touchSupport: false,
          hoverSupport: true,
          keyboardNavigation: true,
          screenReader: false,
        },
      };
      return this.platformInfo;
    }
    
    const userAgent = navigator.userAgent.toLowerCase();
    const platform = navigator.platform?.toLowerCase() || '';
    
    let detectedPlatform: ThemeContext['platform'] = 'web';
    let version: string | undefined;
    
    // iOS detection
    if (/iphone|ipad|ipod/.test(userAgent) || 
        (platform.includes('mac') && 'ontouchend' in document)) {
      detectedPlatform = 'ios';
      const match = userAgent.match(/os (\d+)_(\d+)/);
      if (match) {
        version = `${match[1]}.${match[2]}`;
      }
    }
    // Android detection
    else if (/android/.test(userAgent)) {
      detectedPlatform = 'android';
      const match = userAgent.match(/android (\d+\.?\d*)/);
      if (match) {
        version = match[1];
      }
    }
    // macOS detection
    else if (platform.includes('mac')) {
      detectedPlatform = 'macos';
    }
    // Windows detection
    else if (platform.includes('win')) {
      detectedPlatform = 'windows';
    }
    // Linux detection
    else if (platform.includes('linux')) {
      detectedPlatform = 'linux';
    }
    
    this.platformInfo = {
      platform: detectedPlatform,
      version,
      capabilities: this.detectCapabilities(),
    };
    
    return this.platformInfo;
  }
  
  /**
   * Detect platform capabilities
   */
  private detectCapabilities(): PlatformInfo['capabilities'] {
    if (typeof window === 'undefined') {
      return {
        touchSupport: false,
        hoverSupport: true,
        keyboardNavigation: true,
        screenReader: false,
      };
    }
    
    return {
      touchSupport: 'ontouchstart' in window || navigator.maxTouchPoints > 0,
      hoverSupport: window.matchMedia('(hover: hover)').matches,
      keyboardNavigation: true, // Assume keyboard is available
      screenReader: this.detectScreenReader(),
    };
  }
  
  /**
   * Detect screen reader usage
   */
  private detectScreenReader(): boolean {
    if (typeof window === 'undefined') return false;
    
    // Check for common screen reader indicators
    const indicators = [
      // NVDA
      () => 'speechSynthesis' in window && window.speechSynthesis.getVoices().length > 0,
      // JAWS, NVDA, others
      () => navigator.userAgent.includes('JAWS') || navigator.userAgent.includes('NVDA'),
      // VoiceOver (iOS/macOS)
      () => 'webkitSpeechRecognition' in window,
      // General accessibility API
      () => 'accessibility' in navigator,
    ];
    
    return indicators.some(check => {
      try {
        return check();
      } catch {
        return false;
      }
    });
  }
}

// ============================================================================
// ACCESSIBILITY DETECTION
// ============================================================================

export interface AccessibilityPreferences {
  reducedMotion: boolean;
  highContrast: boolean;
  largeText: boolean;
  darkMode: boolean;
  forcedColors: boolean;
  prefersReducedData: boolean;
}

export class AccessibilityDetector {
  private static instance: AccessibilityDetector;
  private preferences: AccessibilityPreferences | null = null;
  private listeners: Map<string, () => void> = new Map();
  
  static getInstance(): AccessibilityDetector {
    if (!AccessibilityDetector.instance) {
      AccessibilityDetector.instance = new AccessibilityDetector();
    }
    return AccessibilityDetector.instance;
  }
  
  /**
   * Detect accessibility preferences
   */
  detectPreferences(): AccessibilityPreferences {
    if (this.preferences) {
      return this.preferences;
    }
    
    // Server-side rendering fallback
    if (typeof window === 'undefined') {
      this.preferences = {
        reducedMotion: false,
        highContrast: false,
        largeText: false,
        darkMode: false,
        forcedColors: false,
        prefersReducedData: false,
      };
      return this.preferences;
    }
    
    this.preferences = {
      reducedMotion: this.checkReducedMotion(),
      highContrast: this.checkHighContrast(),
      largeText: this.checkLargeText(),
      darkMode: this.checkDarkMode(),
      forcedColors: this.checkForcedColors(),
      prefersReducedData: this.checkPrefersReducedData(),
    };
    
    // Set up listeners for changes
    this.setupListeners();
    
    return this.preferences;
  }
  
  /**
   * Subscribe to accessibility preference changes
   */
  subscribe(callback: (preferences: AccessibilityPreferences) => void): () => void {
    const id = Math.random().toString(36).substr(2, 9);
    
    const listener = () => {
      this.preferences = null; // Force re-detection
      callback(this.detectPreferences());
    };
    
    this.listeners.set(id, listener);
    
    // Return unsubscribe function
    return () => {
      this.listeners.delete(id);
    };
  }
  
  /**
   * Check for reduced motion preference
   */
  private checkReducedMotion(): boolean {
    if (typeof window === 'undefined') return false;
    
    return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  }
  
  /**
   * Check for high contrast preference
   */
  private checkHighContrast(): boolean {
    if (typeof window === 'undefined') return false;
    
    return (
      window.matchMedia('(prefers-contrast: high)').matches ||
      window.matchMedia('(-ms-high-contrast: active)').matches ||
      window.matchMedia('(-ms-high-contrast: black-on-white)').matches ||
      window.matchMedia('(-ms-high-contrast: white-on-black)').matches
    );
  }
  
  /**
   * Check for large text preference
   */
  private checkLargeText(): boolean {
    if (typeof window === 'undefined') return false;
    
    // Check for browser zoom or system text scaling
    const devicePixelRatio = window.devicePixelRatio || 1;
    const zoomLevel = Math.round((window.outerWidth / window.innerWidth) * 100) / 100;
    
    return zoomLevel > 1.2 || devicePixelRatio > 1.5;
  }
  
  /**
   * Check for dark mode preference
   */
  private checkDarkMode(): boolean {
    if (typeof window === 'undefined') return false;
    
    return window.matchMedia('(prefers-color-scheme: dark)').matches;
  }
  
  /**
   * Check for forced colors mode
   */
  private checkForcedColors(): boolean {
    if (typeof window === 'undefined') return false;
    
    return window.matchMedia('(forced-colors: active)').matches;
  }
  
  /**
   * Check for prefers reduced data
   */
  private checkPrefersReducedData(): boolean {
    if (typeof window === 'undefined') return false;
    
    return window.matchMedia('(prefers-reduced-data: reduce)').matches;
  }
  
  /**
   * Set up media query listeners
   */
  private setupListeners(): void {
    if (typeof window === 'undefined') return;
    
    const mediaQueries = [
      '(prefers-reduced-motion: reduce)',
      '(prefers-contrast: high)',
      '(prefers-color-scheme: dark)',
      '(forced-colors: active)',
      '(prefers-reduced-data: reduce)',
      '(-ms-high-contrast: active)',
    ];
    
    mediaQueries.forEach(query => {
      const mediaQuery = window.matchMedia(query);
      const listener = () => {
        this.preferences = null; // Force re-detection
        this.listeners.forEach(callback => callback());
      };
      
      // Modern browsers
      if (mediaQuery.addEventListener) {
        mediaQuery.addEventListener('change', listener);
      }
      // Legacy browsers
      else if (mediaQuery.addListener) {
        mediaQuery.addListener(listener);
      }
    });
  }
}

// ============================================================================
// CONTEXT BUILDER
// ============================================================================

export class ContextBuilder {
  private platformDetector = PlatformDetector.getInstance();
  private accessibilityDetector = AccessibilityDetector.getInstance();
  
  /**
   * Build a complete theme context from environment
   */
  buildContext(overrides: Partial<ThemeContext> = {}): ThemeContext {
    const platformInfo = this.platformDetector.detectPlatform();
    const accessibilityPrefs = this.accessibilityDetector.detectPreferences();
    
    const baseContext: ThemeContext = {
      mode: accessibilityPrefs.darkMode ? 'dark' : 'light',
      platform: platformInfo.platform,
      viewport: this.detectViewport(),
      accessibility: {
        reducedMotion: accessibilityPrefs.reducedMotion,
        highContrast: accessibilityPrefs.highContrast,
        largeText: accessibilityPrefs.largeText,
        forcedColors: accessibilityPrefs.forcedColors,
      },
      component: {
        state: 'default',
        variant: 'primary',
        size: 'medium',
      },
      user: {
        preferences: {
          density: 'comfortable',
          animations: !accessibilityPrefs.reducedMotion,
        },
      },
    };
    
    return { ...baseContext, ...overrides };
  }
  
  /**
   * Detect viewport size category
   */
  private detectViewport(): ThemeContext['viewport'] {
    if (typeof window === 'undefined') return 'desktop';
    
    const width = window.innerWidth;
    
    if (width < 640) return 'mobile';
    if (width < 1024) return 'tablet';
    return 'desktop';
  }
  
  /**
   * Subscribe to context changes
   */
  subscribeToChanges(callback: (context: ThemeContext) => void): () => void {
    const unsubscribeA11y = this.accessibilityDetector.subscribe(() => {
      callback(this.buildContext());
    });
    
    // Viewport change listener
    const handleResize = () => {
      callback(this.buildContext());
    };
    
    if (typeof window !== 'undefined') {
      window.addEventListener('resize', handleResize);
    }
    
    return () => {
      unsubscribeA11y();
      if (typeof window !== 'undefined') {
        window.removeEventListener('resize', handleResize);
      }
    };
  }
}

// ============================================================================
// SINGLETON INSTANCES
// ============================================================================

export const platformDetector = PlatformDetector.getInstance();
export const accessibilityDetector = AccessibilityDetector.getInstance();
export const contextBuilder = new ContextBuilder();