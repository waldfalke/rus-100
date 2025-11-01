/**
 * Performance monitoring dashboard component
 */

import React, { useState, useEffect } from 'react';
import { usePerformance, useTokenBatch } from '../lib/hooks';
import type { PerformanceReport } from '../lib/utils/performance';

interface PerformanceMonitorProps {
  /** Show detailed metrics */
  detailed?: boolean;
  /** Update interval in milliseconds */
  updateInterval?: number;
  /** CSS class name */
  className?: string;
  /** Inline styles */
  style?: React.CSSProperties;
}

export function PerformanceMonitor({
  detailed = false,
  updateInterval = 2000,
  className = '',
  style = {}
}: PerformanceMonitorProps) {
  const { metrics, report, batchStats, clearMetrics, isMonitoring } = usePerformance({
    realTime: true,
    updateInterval
  });

  const [expanded, setExpanded] = useState(detailed);

  if (!metrics) {
    return (
      <div className={`performance-monitor loading ${className}`} style={style}>
        <div className="performance-header">
          <h3>Performance Monitor</h3>
          <span className="status">Initializing...</span>
        </div>
      </div>
    );
  }

  const formatTime = (ms: number) => `${ms.toFixed(2)}ms`;
  const formatPercent = (ratio: number) => `${(ratio * 100).toFixed(1)}%`;
  const formatMemory = (bytes: number) => {
    const mb = bytes / (1024 * 1024);
    return `${mb.toFixed(1)}MB`;
  };

  return (
    <div className={`performance-monitor ${className}`} style={style}>
      <div className="performance-header">
        <h3>Performance Monitor</h3>
        <div className="controls">
          <span className={`status ${isMonitoring ? 'active' : 'inactive'}`}>
            {isMonitoring ? 'Monitoring' : 'Inactive'}
          </span>
          <button onClick={() => setExpanded(!expanded)} className="toggle-btn">
            {expanded ? '−' : '+'}
          </button>
          <button onClick={clearMetrics} className="clear-btn">
            Clear
          </button>
        </div>
      </div>

      <div className="performance-summary">
        <div className="metric-card">
          <div className="metric-label">Total Resolutions</div>
          <div className="metric-value">{metrics.totalResolutions.toLocaleString()}</div>
        </div>
        
        <div className="metric-card">
          <div className="metric-label">Avg Resolution Time</div>
          <div className="metric-value">{formatTime(metrics.averageResolutionTime)}</div>
        </div>
        
        <div className="metric-card">
          <div className="metric-label">Cache Hit Rate</div>
          <div className="metric-value">{formatPercent(metrics.cacheHitRate)}</div>
        </div>
        
        <div className="metric-card">
          <div className="metric-label">Memory Usage</div>
          <div className="metric-value">{formatMemory(metrics.memoryUsage)}</div>
        </div>
      </div>

      {expanded && (
        <div className="performance-details">
          {/* Slowest Tokens */}
          {metrics.slowestTokens.length > 0 && (
            <div className="detail-section">
              <h4>Slowest Tokens</h4>
              <div className="token-list">
                {metrics.slowestTokens.map((token, index) => (
                  <div key={token.tokenId} className="token-item">
                    <span className="token-id">{token.tokenId}</span>
                    <span className="token-time">{formatTime(token.averageTime)}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Batch Processing Stats */}
          {batchStats && (
            <div className="detail-section">
              <h4>Batch Processing</h4>
              <div className="batch-stats">
                <div className="batch-category">
                  <span className="category-name">Colors</span>
                  <span className="queue-length">Queue: {batchStats.color?.queueLength || 0}</span>
                  <span className="processing-status">
                    {batchStats.color?.processing ? 'Processing' : 'Idle'}
                  </span>
                </div>
                <div className="batch-category">
                  <span className="category-name">Spacing</span>
                  <span className="queue-length">Queue: {batchStats.spacing?.queueLength || 0}</span>
                  <span className="processing-status">
                    {batchStats.spacing?.processing ? 'Processing' : 'Idle'}
                  </span>
                </div>
                <div className="batch-category">
                  <span className="category-name">Typography</span>
                  <span className="queue-length">Queue: {batchStats.typography?.queueLength || 0}</span>
                  <span className="processing-status">
                    {batchStats.typography?.processing ? 'Processing' : 'Idle'}
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* Token Metrics */}
          {report && report.tokenMetrics.length > 0 && (
            <div className="detail-section">
              <h4>Token Metrics</h4>
              <div className="token-metrics">
                {report.tokenMetrics.slice(0, 10).map((metric) => (
                  <div key={metric.tokenId} className="metric-row">
                    <span className="token-id">{metric.tokenId}</span>
                    <span className="resolution-count">{metric.resolutionCount}</span>
                    <span className="avg-time">{formatTime(metric.averageTime)}</span>
                    <span className="cache-rate">{formatPercent(metric.cacheHitRate)}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      <style jsx>{`
        .performance-monitor {
          background: var(--colors-surface-primary, #ffffff);
          border: 1px solid var(--colors-border-subtle, #e5e7eb);
          border-radius: var(--spacing-xs, 8px);
          padding: var(--spacing-md, 16px);
          font-family: var(--typography-body-fontFamily, system-ui);
          font-size: var(--typography-body-fontSize, 14px);
          box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
        }

        .performance-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: var(--spacing-md, 16px);
          padding-bottom: var(--spacing-sm, 8px);
          border-bottom: 1px solid var(--colors-border-subtle, #e5e7eb);
        }

        .performance-header h3 {
          margin: 0;
          font-size: var(--typography-heading-fontSize, 16px);
          font-weight: var(--typography-heading-fontWeight, 600);
          color: var(--colors-text-primary, #111827);
        }

        .controls {
          display: flex;
          align-items: center;
          gap: var(--spacing-sm, 8px);
        }

        .status {
          padding: 2px 8px;
          border-radius: 12px;
          font-size: 12px;
          font-weight: 500;
        }

        .status.active {
          background: var(--colors-success-subtle, #dcfce7);
          color: var(--colors-success-primary, #16a34a);
        }

        .status.inactive {
          background: var(--colors-neutral-subtle, #f3f4f6);
          color: var(--colors-text-secondary, #6b7280);
        }

        .toggle-btn, .clear-btn {
          background: var(--colors-surface-secondary, #f9fafb);
          border: 1px solid var(--colors-border-subtle, #e5e7eb);
          border-radius: 4px;
          padding: 4px 8px;
          cursor: pointer;
          font-size: 12px;
          transition: all 0.2s ease;
        }

        .toggle-btn:hover, .clear-btn:hover {
          background: var(--colors-surface-tertiary, #f3f4f6);
        }

        .performance-summary {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
          gap: var(--spacing-sm, 8px);
          margin-bottom: var(--spacing-md, 16px);
        }

        .metric-card {
          background: var(--colors-surface-secondary, #f9fafb);
          border-radius: var(--spacing-xs, 6px);
          padding: var(--spacing-sm, 8px);
          text-align: center;
        }

        .metric-label {
          font-size: 11px;
          color: var(--colors-text-secondary, #6b7280);
          margin-bottom: 2px;
        }

        .metric-value {
          font-size: 16px;
          font-weight: 600;
          color: var(--colors-text-primary, #111827);
        }

        .performance-details {
          border-top: 1px solid var(--colors-border-subtle, #e5e7eb);
          padding-top: var(--spacing-md, 16px);
        }

        .detail-section {
          margin-bottom: var(--spacing-md, 16px);
        }

        .detail-section h4 {
          margin: 0 0 var(--spacing-sm, 8px) 0;
          font-size: 14px;
          font-weight: 600;
          color: var(--colors-text-primary, #111827);
        }

        .token-list, .batch-stats, .token-metrics {
          background: var(--colors-surface-secondary, #f9fafb);
          border-radius: var(--spacing-xs, 6px);
          padding: var(--spacing-sm, 8px);
        }

        .token-item, .batch-category, .metric-row {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 4px 0;
          border-bottom: 1px solid var(--colors-border-subtle, #e5e7eb);
        }

        .token-item:last-child, .batch-category:last-child, .metric-row:last-child {
          border-bottom: none;
        }

        .token-id {
          font-family: var(--typography-code-fontFamily, 'SF Mono', monospace);
          font-size: 12px;
          color: var(--colors-text-secondary, #6b7280);
          flex: 1;
        }

        .token-time, .queue-length, .avg-time, .cache-rate {
          font-size: 12px;
          font-weight: 500;
          color: var(--colors-text-primary, #111827);
        }

        .processing-status {
          font-size: 11px;
          padding: 2px 6px;
          border-radius: 8px;
          background: var(--colors-neutral-subtle, #f3f4f6);
          color: var(--colors-text-secondary, #6b7280);
        }

        .category-name {
          font-weight: 500;
          color: var(--colors-text-primary, #111827);
        }

        .resolution-count {
          font-size: 12px;
          color: var(--colors-text-secondary, #6b7280);
        }

        .loading {
          opacity: 0.6;
        }

        @media (max-width: 640px) {
          .performance-summary {
            grid-template-columns: repeat(2, 1fr);
          }
          
          .performance-header {
            flex-direction: column;
            align-items: flex-start;
            gap: var(--spacing-sm, 8px);
          }
        }
      `}</style>
    </div>
  );
}

export default PerformanceMonitor;