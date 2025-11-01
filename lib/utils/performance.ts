/**
 * Performance monitoring and optimization utilities for the design token system
 */

export interface PerformanceMetrics {
  resolutionTime: number;
  memoryUsage: number;
  cacheHitRate: number;
  totalResolutions: number;
  averageResolutionTime: number;
  peakMemoryUsage: number;
}

export interface PerformanceReport {
  timestamp: string;
  duration: number;
  metrics: PerformanceMetrics;
  slowestResolutions: Array<{
    tokenId: string;
    time: number;
    context: string;
  }>;
  recommendations: string[];
}

class PerformanceMonitor {
  private static instance: PerformanceMonitor;
  private metrics: PerformanceMetrics;
  private resolutionTimes: number[] = [];
  private slowestResolutions: Array<{ tokenId: string; time: number; context: string }> = [];
  private cacheHits = 0;
  private cacheMisses = 0;
  private startTime = 0;
  private isEnabled = false;

  private constructor() {
    this.reset();
  }

  static getInstance(): PerformanceMonitor {
    if (!PerformanceMonitor.instance) {
      PerformanceMonitor.instance = new PerformanceMonitor();
    }
    return PerformanceMonitor.instance;
  }

  enable(): void {
    this.isEnabled = true;
  }

  disable(): void {
    this.isEnabled = false;
  }

  startProfiling(): void {
    if (!this.isEnabled) return;
    this.startTime = performance.now();
    this.reset();
  }

  stopProfiling(): PerformanceReport {
    if (!this.isEnabled) {
      return this.createEmptyReport();
    }

    const duration = performance.now() - this.startTime;
    const recommendations = this.generateRecommendations();

    return {
      timestamp: new Date().toISOString(),
      duration,
      metrics: { ...this.metrics },
      slowestResolutions: [...this.slowestResolutions],
      recommendations,
    };
  }

  recordResolution(tokenId: string, time: number, context: any, fromCache: boolean): void {
    if (!this.isEnabled) return;

    this.resolutionTimes.push(time);
    this.metrics.totalResolutions++;
    this.metrics.resolutionTime += time;
    this.metrics.averageResolutionTime = this.metrics.resolutionTime / this.metrics.totalResolutions;

    if (fromCache) {
      this.cacheHits++;
    } else {
      this.cacheMisses++;
    }

    this.metrics.cacheHitRate = this.cacheHits / (this.cacheHits + this.cacheMisses);

    // Track slowest resolutions
    if (this.slowestResolutions.length < 10 || time > this.slowestResolutions[9].time) {
      this.slowestResolutions.push({
        tokenId,
        time,
        context: JSON.stringify(context),
      });
      this.slowestResolutions.sort((a, b) => b.time - a.time);
      this.slowestResolutions = this.slowestResolutions.slice(0, 10);
    }

    // Update memory usage
    if (typeof performance !== 'undefined' && (performance as any).memory) {
      const memInfo = (performance as any).memory;
      this.metrics.memoryUsage = memInfo.usedJSHeapSize;
      this.metrics.peakMemoryUsage = Math.max(
        this.metrics.peakMemoryUsage,
        memInfo.usedJSHeapSize
      );
    }
  }

  getMetrics(): PerformanceMetrics {
    return { ...this.metrics };
  }

  reset(): void {
    this.metrics = {
      resolutionTime: 0,
      memoryUsage: 0,
      cacheHitRate: 0,
      totalResolutions: 0,
      averageResolutionTime: 0,
      peakMemoryUsage: 0,
    };
    this.resolutionTimes = [];
    this.slowestResolutions = [];
    this.cacheHits = 0;
    this.cacheMisses = 0;
  }

  private createEmptyReport(): PerformanceReport {
    return {
      timestamp: new Date().toISOString(),
      duration: 0,
      metrics: this.metrics,
      slowestResolutions: [],
      recommendations: ['Performance monitoring is disabled'],
    };
  }

  private generateRecommendations(): string[] {
    const recommendations: string[] = [];

    // Cache hit rate recommendations
    if (this.metrics.cacheHitRate < 0.8) {
      recommendations.push(
        'Low cache hit rate detected. Consider increasing cache size or reviewing token usage patterns.'
      );
    }

    // Average resolution time recommendations
    if (this.metrics.averageResolutionTime > 1) {
      recommendations.push(
        'High average resolution time. Consider optimizing token resolution rules or caching strategy.'
      );
    }

    // Memory usage recommendations
    if (this.metrics.peakMemoryUsage > 50 * 1024 * 1024) { // 50MB
      recommendations.push(
        'High memory usage detected. Consider implementing token cleanup or reducing cache size.'
      );
    }

    // Slow resolutions recommendations
    if (this.slowestResolutions.length > 0 && this.slowestResolutions[0].time > 5) {
      recommendations.push(
        `Slow token resolutions detected. Review tokens: ${this.slowestResolutions
          .slice(0, 3)
          .map(r => r.tokenId)
          .join(', ')}`
      );
    }

    if (recommendations.length === 0) {
      recommendations.push('Performance looks good! No specific recommendations.');
    }

    return recommendations;
  }
}

/**
 * LRU Cache implementation for token resolution results
 */
export class TokenCache<K, V> {
  private cache = new Map<string, { value: V; timestamp: number; accessCount: number }>();
  private maxSize: number;
  private ttl: number; // Time to live in milliseconds

  constructor(maxSize = 1000, ttl = 5 * 60 * 1000) { // 5 minutes default TTL
    this.maxSize = maxSize;
    this.ttl = ttl;
  }

  get(key: K): V | undefined {
    const keyStr = this.serializeKey(key);
    const item = this.cache.get(keyStr);

    if (!item) {
      PerformanceMonitor.getInstance().recordResolution('cache-miss', 0, key, false);
      return undefined;
    }

    // Check if item has expired
    if (Date.now() - item.timestamp > this.ttl) {
      this.cache.delete(keyStr);
      PerformanceMonitor.getInstance().recordResolution('cache-expired', 0, key, false);
      return undefined;
    }

    // Update access count and timestamp
    item.accessCount++;
    item.timestamp = Date.now();

    PerformanceMonitor.getInstance().recordResolution('cache-hit', 0, key, true);
    return item.value;
  }

  set(key: K, value: V): void {
    const keyStr = this.serializeKey(key);

    // If cache is full, remove least recently used item
    if (this.cache.size >= this.maxSize && !this.cache.has(keyStr)) {
      this.evictLRU();
    }

    this.cache.set(keyStr, {
      value,
      timestamp: Date.now(),
      accessCount: 1,
    });
  }

  clear(): void {
    this.cache.clear();
  }

  size(): number {
    return this.cache.size;
  }

  getStats(): { size: number; hitRate: number; oldestEntry: number } {
    const now = Date.now();
    let oldestTimestamp = now;

    for (const item of this.cache.values()) {
      if (item.timestamp < oldestTimestamp) {
        oldestTimestamp = item.timestamp;
      }
    }

    return {
      size: this.cache.size,
      hitRate: 0, // This would need to be calculated separately
      oldestEntry: now - oldestTimestamp,
    };
  }

  private serializeKey(key: K): string {
    if (typeof key === 'string') {
      return key;
    }
    return JSON.stringify(key);
  }

  private evictLRU(): void {
    let lruKey: string | undefined;
    let lruTimestamp = Date.now();
    let lruAccessCount = Infinity;

    for (const [key, item] of this.cache.entries()) {
      // Prioritize by access count, then by timestamp
      if (item.accessCount < lruAccessCount || 
          (item.accessCount === lruAccessCount && item.timestamp < lruTimestamp)) {
        lruKey = key;
        lruTimestamp = item.timestamp;
        lruAccessCount = item.accessCount;
      }
    }

    if (lruKey) {
      this.cache.delete(lruKey);
    }
  }
}

/**
 * Debounced function utility for performance optimization
 */
export function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout | null = null;

  return (...args: Parameters<T>) => {
    if (timeout) {
      clearTimeout(timeout);
    }

    timeout = setTimeout(() => {
      func(...args);
      timeout = null;
    }, wait);
  };
}

/**
 * Throttled function utility for performance optimization
 */
export function throttle<T extends (...args: any[]) => any>(
  func: T,
  limit: number
): (...args: Parameters<T>) => void {
  let inThrottle = false;

  return (...args: Parameters<T>) => {
    if (!inThrottle) {
      func(...args);
      inThrottle = true;
      setTimeout(() => {
        inThrottle = false;
      }, limit);
    }
  };
}

/**
 * Memoization utility for expensive computations
 */
export function memoize<T extends (...args: any[]) => any>(
  func: T,
  keyGenerator?: (...args: Parameters<T>) => string
): T {
  const cache = new Map<string, ReturnType<T>>();

  return ((...args: Parameters<T>): ReturnType<T> => {
    const key = keyGenerator ? keyGenerator(...args) : JSON.stringify(args);
    
    if (cache.has(key)) {
      return cache.get(key)!;
    }

    const result = func(...args);
    cache.set(key, result);
    return result;
  }) as T;
}

/**
 * Batch processing utility for multiple token resolutions
 */
export class BatchProcessor<T, R> {
  private batch: T[] = [];
  private batchSize: number;
  private processor: (items: T[]) => Promise<R[]>;
  private timeout: NodeJS.Timeout | null = null;
  private flushDelay: number;

  constructor(
    processor: (items: T[]) => Promise<R[]>,
    batchSize = 10,
    flushDelay = 16 // ~60fps
  ) {
    this.processor = processor;
    this.batchSize = batchSize;
    this.flushDelay = flushDelay;
  }

  add(item: T): Promise<R> {
    return new Promise((resolve, reject) => {
      this.batch.push(item);

      // Store the resolve/reject functions with the item
      (item as any).__resolve = resolve;
      (item as any).__reject = reject;

      if (this.batch.length >= this.batchSize) {
        this.flush();
      } else {
        this.scheduleFlush();
      }
    });
  }

  private scheduleFlush(): void {
    if (this.timeout) return;

    this.timeout = setTimeout(() => {
      this.flush();
    }, this.flushDelay);
  }

  private async flush(): Promise<void> {
    if (this.timeout) {
      clearTimeout(this.timeout);
      this.timeout = null;
    }

    if (this.batch.length === 0) return;

    const currentBatch = this.batch.splice(0);

    try {
      const results = await this.processor(currentBatch);
      
      currentBatch.forEach((item, index) => {
        const resolve = (item as any).__resolve;
        if (resolve) {
          resolve(results[index]);
        }
      });
    } catch (error) {
      currentBatch.forEach((item) => {
        const reject = (item as any).__reject;
        if (reject) {
          reject(error);
        }
      });
    }
  }
}

// Export singleton instances
export const performanceMonitor = new PerformanceMonitor();
export const tokenCache = new TokenCache<string, any>();

export * from './batch-processor';