/**
 * React hooks for performance monitoring and optimization
 */

import { useState, useEffect, useCallback, useRef } from 'react';
import { performanceMonitor, tokenBatchProcessor } from '../utils/performance';
import type { PerformanceReport, PerformanceMetrics } from '../utils/performance';

export interface UsePerformanceOptions {
  /** Update interval in milliseconds */
  updateInterval?: number;
  /** Enable real-time monitoring */
  realTime?: boolean;
  /** Track specific token patterns */
  tokenPatterns?: string[];
}

export interface PerformanceHookResult {
  /** Current performance metrics */
  metrics: PerformanceMetrics | null;
  /** Full performance report */
  report: PerformanceReport | null;
  /** Batch processor statistics */
  batchStats: any;
  /** Clear all performance data */
  clearMetrics: () => void;
  /** Force metrics update */
  updateMetrics: () => void;
  /** Check if monitoring is active */
  isMonitoring: boolean;
}

/**
 * Hook for monitoring token resolution performance
 */
export function usePerformance(options: UsePerformanceOptions = {}): PerformanceHookResult {
  const {
    updateInterval = 1000,
    realTime = false,
    tokenPatterns = []
  } = options;

  const [metrics, setMetrics] = useState<PerformanceMetrics | null>(null);
  const [report, setReport] = useState<PerformanceReport | null>(null);
  const [batchStats, setBatchStats] = useState<any>(null);
  const [isMonitoring, setIsMonitoring] = useState(false);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const updateMetrics = useCallback(() => {
    try {
      const currentReport = performanceMonitor.getReport();
      const currentBatchStats = tokenBatchProcessor.getStats();
      
      setReport(currentReport);
      setMetrics(currentReport.summary);
      setBatchStats(currentBatchStats);
    } catch (error) {
      console.warn('Failed to update performance metrics:', error);
    }
  }, []);

  const clearMetrics = useCallback(() => {
    performanceMonitor.clearMetrics();
    setMetrics(null);
    setReport(null);
    setBatchStats(null);
  }, []);

  // Setup monitoring
  useEffect(() => {
    if (realTime) {
      setIsMonitoring(true);
      
      intervalRef.current = setInterval(updateMetrics, updateInterval);
      
      // Initial update
      updateMetrics();
      
      return () => {
        if (intervalRef.current) {
          clearInterval(intervalRef.current);
          intervalRef.current = null;
        }
        setIsMonitoring(false);
      };
    }
  }, [realTime, updateInterval, updateMetrics]);

  // Filter metrics by token patterns if specified
  useEffect(() => {
    if (tokenPatterns.length > 0 && report) {
      const filteredMetrics = report.tokenMetrics.filter(metric =>
        tokenPatterns.some(pattern => 
          new RegExp(pattern).test(metric.tokenId)
        )
      );
      
      // Calculate filtered summary
      const filteredSummary: PerformanceMetrics = {
        totalResolutions: filteredMetrics.reduce((sum, m) => sum + m.resolutionCount, 0),
        averageResolutionTime: filteredMetrics.reduce((sum, m) => sum + m.averageTime, 0) / filteredMetrics.length || 0,
        cacheHitRate: filteredMetrics.reduce((sum, m) => sum + m.cacheHitRate, 0) / filteredMetrics.length || 0,
        memoryUsage: report.summary.memoryUsage, // Keep global memory usage
        slowestTokens: filteredMetrics
          .sort((a, b) => b.averageTime - a.averageTime)
          .slice(0, 5)
          .map(m => ({ tokenId: m.tokenId, averageTime: m.averageTime }))
      };
      
      setMetrics(filteredSummary);
    }
  }, [tokenPatterns, report]);

  return {
    metrics,
    report,
    batchStats,
    clearMetrics,
    updateMetrics,
    isMonitoring
  };
}

/**
 * Hook for optimizing token resolution with batching
 */
export function useTokenBatch() {
  const [isProcessing, setIsProcessing] = useState(false);
  const [stats, setStats] = useState<any>(null);

  const processColorTokens = useCallback(async (tokens: any[], priority?: number) => {
    setIsProcessing(true);
    try {
      const results = await Promise.all(
        tokens.map(token => tokenBatchProcessor.processColorToken(token, priority))
      );
      return results;
    } finally {
      setIsProcessing(false);
      setStats(tokenBatchProcessor.getStats());
    }
  }, []);

  const processSpacingTokens = useCallback(async (tokens: any[], priority?: number) => {
    setIsProcessing(true);
    try {
      const results = await Promise.all(
        tokens.map(token => tokenBatchProcessor.processSpacingToken(token, priority))
      );
      return results;
    } finally {
      setIsProcessing(false);
      setStats(tokenBatchProcessor.getStats());
    }
  }, []);

  const processTypographyTokens = useCallback(async (tokens: any[], priority?: number) => {
    setIsProcessing(true);
    try {
      const results = await Promise.all(
        tokens.map(token => tokenBatchProcessor.processTypographyToken(token, priority))
      );
      return results;
    } finally {
      setIsProcessing(false);
      setStats(tokenBatchProcessor.getStats());
    }
  }, []);

  const flushAll = useCallback(async () => {
    setIsProcessing(true);
    try {
      await tokenBatchProcessor.flushAll();
    } finally {
      setIsProcessing(false);
      setStats(tokenBatchProcessor.getStats());
    }
  }, []);

  const updateStats = useCallback(() => {
    setStats(tokenBatchProcessor.getStats());
  }, []);

  return {
    processColorTokens,
    processSpacingTokens,
    processTypographyTokens,
    flushAll,
    updateStats,
    isProcessing,
    stats
  };
}

/**
 * Hook for performance-aware token resolution
 */
export function useOptimizedTokens() {
  const { metrics } = usePerformance({ realTime: true });
  const { processColorTokens, processSpacingTokens, processTypographyTokens } = useTokenBatch();

  const shouldUseBatching = useCallback(() => {
    if (!metrics) return false;
    
    // Use batching if average resolution time is high or cache hit rate is low
    return metrics.averageResolutionTime > 5 || metrics.cacheHitRate < 0.8;
  }, [metrics]);

  const optimizeTokenResolution = useCallback(async (tokens: any[], category: 'color' | 'spacing' | 'typography') => {
    if (shouldUseBatching() && tokens.length > 1) {
      // Use batch processing for better performance
      switch (category) {
        case 'color':
          return processColorTokens(tokens, 1); // High priority
        case 'spacing':
          return processSpacingTokens(tokens, 2); // Medium priority
        case 'typography':
          return processTypographyTokens(tokens, 3); // Lower priority
      }
    }
    
    // Process individually for small batches or good performance
    return tokens;
  }, [shouldUseBatching, processColorTokens, processSpacingTokens, processTypographyTokens]);

  return {
    optimizeTokenResolution,
    shouldUseBatching: shouldUseBatching(),
    performanceMetrics: metrics
  };
}