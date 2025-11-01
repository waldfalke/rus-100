'use client';

import React, { 
  createContext, 
  useContext, 
  useCallback, 
  useMemo, 
  useRef, 
  useEffect,
  useState,
  ReactNode 
} from 'react';

import type {
  ThemeContext,
  ThemeContractSchema,
  ThemeProviderConfig,
  ThemeResolver,
  CacheEntry,
  TokenContract,
} from '../theme-contracts';

import {
  getDefaultContext,
  mergeContext,
  createContextHash,
  getNestedValue,
  isValidTokenPath,
  debounce,
} from '../theme-contracts';
import { contextResolver, contextBuilder } from '../context';

// ============================================================================
// THEME CONTEXT
// ============================================================================

interface ThemeContextValue {
  resolver: ThemeResolver;
  context: ThemeContext;
  updateContext: (updates: Partial<ThemeContext>) => void;
  invalidateCache: (tokenPath?: string) => void;
}

const ThemeReactContext = createContext<ThemeContextValue | null>(null);

// ============================================================================
// CACHE IMPLEMENTATION
// ============================================================================

class TokenCache {
  private cache = new Map<string, CacheEntry>();
  private maxSize: number;
  private ttl: number;

  constructor(maxSize = 1000, ttl = 5 * 60 * 1000) { // 5 minutes default TTL
    this.maxSize = maxSize;
    this.ttl = ttl;
  }

  get<T>(key: string): T | undefined {
    const entry = this.cache.get(key);
    
    if (!entry) return undefined;
    
    // Check if entry has expired
    if (Date.now() - entry.timestamp > this.ttl) {
      this.cache.delete(key);
      return undefined;
    }
    
    return entry.value as T;
  }

  set<T>(key: string, value: T, contextHash: string): void {
    // Remove oldest entries if cache is full
    if (this.cache.size >= this.maxSize) {
      const firstKey = this.cache.keys().next().value;
      if (firstKey) {
        this.cache.delete(firstKey);
      }
    }

    this.cache.set(key, {
      value,
      timestamp: Date.now(),
      contextHash,
    });
  }

  invalidate(tokenPath?: string): void {
    if (tokenPath) {
      // Remove entries that start with the token path
      const keysToDelete = Array.from(this.cache.keys()).filter(key =>
        key.startsWith(`${tokenPath}:`)
      );
      keysToDelete.forEach(key => this.cache.delete(key));
    } else {
      this.cache.clear();
    }
  }

  clear(): void {
    this.cache.clear();
  }
}

// ============================================================================
// THEME RESOLVER IMPLEMENTATION
// ============================================================================

class ThemeResolverImpl implements ThemeResolver {
  private contracts: ThemeContractSchema;
  private cache: TokenCache;
  private subscribers = new Map<string, Set<(value: any) => void>>();
  private enableMemoization: boolean;
  private enableBatching: boolean;
  private batchedUpdates = new Set<string>();
  private debouncedNotify: () => void;

  constructor(config: ThemeProviderConfig) {
    this.contracts = config.contracts;
    this.enableMemoization = config.performance?.enableMemoization ?? true;
    this.enableBatching = config.performance?.enableBatching ?? true;
    
    this.cache = new TokenCache(
      config.cache?.maxSize ?? 1000,
      config.cache?.ttl ?? 5 * 60 * 1000
    );

    this.debouncedNotify = debounce(() => {
      this.notifySubscribers();
    }, 16); // ~60fps
  }

  get<T>(tokenPath: string, context?: Partial<ThemeContext>): T {
    if (!isValidTokenPath(tokenPath)) {
      throw new Error(`Invalid token path: ${tokenPath}`);
    }

    const fullContext = mergeContext(getDefaultContext(), context);
    const contextHash = createContextHash(fullContext);
    const cacheKey = `${tokenPath}:${contextHash}`;

    // Try to get from cache first
    if (this.enableMemoization) {
      const cached = this.cache.get<T>(cacheKey);
      if (cached !== undefined) {
        return cached;
      }
    }

    // Resolve token contract
    const contract = getNestedValue(this.contracts, tokenPath) as TokenContract<T>;
    
    if (!contract) {
      throw new Error(`Token contract not found: ${tokenPath}`);
    }

    try {
      let resolved = contract.resolve(fullContext);
      
      // Apply context-aware resolution (platform, accessibility, etc.)
      if (resolved !== null && resolved !== undefined) {
        resolved = contextResolver.resolve(tokenPath, resolved, fullContext);
      }
      
      // Validate if validator exists
      if (contract.validate && !contract.validate(resolved)) {
        console.warn(`Token validation failed for ${tokenPath}, using fallback`);
        return contract.fallback;
      }

      // Cache the result
      if (this.enableMemoization) {
        this.cache.set(cacheKey, resolved, contextHash);
      }

      return resolved;
    } catch (error) {
      console.error(`Token resolution failed for ${tokenPath}:`, error);
      return contract.fallback;
    }
  }

  getMany(tokenPaths: string[], context?: Partial<ThemeContext>): Record<string, any> {
    const results: Record<string, any> = {};
    
    tokenPaths.forEach(path => {
      try {
        results[path] = this.get(path, context);
      } catch (error) {
        console.error(`Failed to resolve token ${path}:`, error);
      }
    });

    return results;
  }

  invalidateCache(tokenPath?: string): void {
    this.cache.invalidate(tokenPath);
    
    if (this.enableBatching) {
      this.batchedUpdates.add(tokenPath || '*');
      this.debouncedNotify();
    } else {
      this.notifySubscribers(tokenPath);
    }
  }

  subscribe(tokenPath: string, callback: (value: any) => void): () => void {
    if (!this.subscribers.has(tokenPath)) {
      this.subscribers.set(tokenPath, new Set());
    }
    
    this.subscribers.get(tokenPath)!.add(callback);

    // Return unsubscribe function
    return () => {
      const subscribers = this.subscribers.get(tokenPath);
      if (subscribers) {
        subscribers.delete(callback);
        if (subscribers.size === 0) {
          this.subscribers.delete(tokenPath);
        }
      }
    };
  }

  private notifySubscribers(tokenPath?: string): void {
    if (tokenPath) {
      const subscribers = this.subscribers.get(tokenPath);
      if (subscribers) {
        const value = this.get(tokenPath);
        subscribers.forEach(callback => callback(value));
      }
    } else {
      // Notify all subscribers
      this.subscribers.forEach((subscribers, path) => {
        const value = this.get(path);
        subscribers.forEach(callback => callback(value));
      });
    }

    this.batchedUpdates.clear();
  }
}

// ============================================================================
// THEME PROVIDER COMPONENT
// ============================================================================

interface ThemeProviderProps {
  children: ReactNode;
  config: ThemeProviderConfig;
  initialContext?: Partial<ThemeContext>;
}

export function ThemeProvider({ 
  children, 
  config, 
  initialContext 
}: ThemeProviderProps) {
  const resolverRef = useRef<ThemeResolverImpl>();
  
  // Initialize context with environment detection
  const [context, setContext] = useState<ThemeContext>(() => {
    if (initialContext) {
      return mergeContext(getDefaultContext(), initialContext);
    }
    
    // Auto-detect context from environment
    return contextBuilder.buildContext();
  });

  // Initialize resolver
  if (!resolverRef.current) {
    resolverRef.current = new ThemeResolverImpl(config);
  }

  const resolver = resolverRef.current;
  
  // Subscribe to environment changes
  useEffect(() => {
    const unsubscribe = contextBuilder.subscribeToChanges((newContext) => {
      setContext(prevContext => {
        // Merge with existing context to preserve user overrides
        const mergedContext = { ...newContext, ...prevContext };
        
        return mergedContext;
      });
    });
    
    return unsubscribe;
  }, []);

  // Update context function
  const updateContext = useCallback((updates: Partial<ThemeContext>) => {
    setContext(prevContext => {
      const newContext = mergeContext(prevContext, updates);
      
      // Invalidate cache when context changes
      resolver.invalidateCache();
      
      return newContext;
    });
  }, [resolver]);

  // Invalidate cache function
  const invalidateCache = useCallback((tokenPath?: string) => {
    resolver.invalidateCache(tokenPath);
  }, [resolver]);

  // Context value
  const contextValue = useMemo<ThemeContextValue>(() => ({
    resolver,
    context,
    updateContext,
    invalidateCache,
  }), [resolver, context, updateContext, invalidateCache]);

  // Listen for system theme changes
  useEffect(() => {
    if (context.mode === 'auto') {
      const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
      
      const handleChange = (e: MediaQueryListEvent) => {
        updateContext({ mode: e.matches ? 'dark' : 'light' });
      };

      mediaQuery.addEventListener('change', handleChange);
      
      // Set initial value
      updateContext({ mode: mediaQuery.matches ? 'dark' : 'light' });

      return () => {
        mediaQuery.removeEventListener('change', handleChange);
      };
    }
  }, [context.mode, updateContext]);

  // Listen for accessibility preferences
  useEffect(() => {
    const motionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    const contrastQuery = window.matchMedia('(prefers-contrast: high)');

    const handleMotionChange = (e: MediaQueryListEvent) => {
      updateContext({
        motion: e.matches ? 'reduced' : 'full',
        accessibility: {
          ...context.accessibility,
          reducedMotion: e.matches,
        },
      });
    };

    const handleContrastChange = (e: MediaQueryListEvent) => {
      updateContext({
        contrast: e.matches ? 'high' : 'normal',
        accessibility: {
          ...context.accessibility,
          highContrast: e.matches,
        },
      });
    };

    motionQuery.addEventListener('change', handleMotionChange);
    contrastQuery.addEventListener('change', handleContrastChange);

    // Set initial values
    handleMotionChange({ matches: motionQuery.matches } as MediaQueryListEvent);
    handleContrastChange({ matches: contrastQuery.matches } as MediaQueryListEvent);

    return () => {
      motionQuery.removeEventListener('change', handleMotionChange);
      contrastQuery.removeEventListener('change', handleContrastChange);
    };
  }, [context.accessibility, updateContext]);

  return (
    <ThemeReactContext.Provider value={contextValue}>
      {children}
    </ThemeReactContext.Provider>
  );
}

// ============================================================================
// HOOKS
// ============================================================================

/**
 * Hook to access theme resolver and context
 */
export function useTheme() {
  const context = useContext(ThemeReactContext);
  
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }

  return context;
}

/**
 * Hook to get a specific token value with reactive updates
 */
export function useToken<T>(tokenPath: string, contextOverrides?: Partial<ThemeContext>): T {
  const { resolver, context } = useTheme();
  const [value, setValue] = useState<T>(() => 
    resolver.get<T>(tokenPath, contextOverrides)
  );

  useEffect(() => {
    // Subscribe to token changes
    const unsubscribe = resolver.subscribe(tokenPath, (newValue: T) => {
      setValue(newValue);
    });

    // Update value when context changes
    const newValue = resolver.get<T>(tokenPath, contextOverrides);
    setValue(newValue);

    return unsubscribe;
  }, [resolver, tokenPath, contextOverrides, context]);

  return value;
}

/**
 * Hook to get multiple token values
 */
export function useTokens(
  tokenPaths: string[], 
  contextOverrides?: Partial<ThemeContext>
): Record<string, any> {
  const { resolver, context } = useTheme();
  const [values, setValues] = useState(() => 
    resolver.getMany(tokenPaths, contextOverrides)
  );

  useEffect(() => {
    const unsubscribes = tokenPaths.map(path =>
      resolver.subscribe(path, () => {
        setValues(resolver.getMany(tokenPaths, contextOverrides));
      })
    );

    // Update values when context changes
    setValues(resolver.getMany(tokenPaths, contextOverrides));

    return () => {
      unsubscribes.forEach(unsubscribe => unsubscribe());
    };
  }, [resolver, tokenPaths, contextOverrides, context]);

  return values;
}