/**
 * Batch processing utilities for optimizing token operations
 */

export interface BatchOperation<T, R> {
  id: string;
  input: T;
  priority?: number;
}

export interface BatchResult<R> {
  id: string;
  result?: R;
  error?: Error;
  duration: number;
}

export interface BatchProcessorOptions {
  batchSize: number;
  maxWaitTime: number;
  maxConcurrency: number;
  retryAttempts: number;
  retryDelay: number;
}

export class BatchProcessor<T, R> {
  private queue: BatchOperation<T, R>[] = [];
  private processing = false;
  private timeoutId: NodeJS.Timeout | null = null;
  private activePromises = new Set<Promise<void>>();

  constructor(
    private processor: (items: T[]) => Promise<R[]> | R[],
    private options: BatchProcessorOptions = {
      batchSize: 50,
      maxWaitTime: 100,
      maxConcurrency: 3,
      retryAttempts: 2,
      retryDelay: 50
    }
  ) {}

  /**
   * Add operation to batch queue
   */
  async add(operation: BatchOperation<T, R>): Promise<R> {
    return new Promise((resolve, reject) => {
      const enhancedOperation = {
        ...operation,
        resolve,
        reject,
        addedAt: Date.now()
      } as any;

      // Insert with priority consideration
      if (operation.priority !== undefined) {
        const insertIndex = this.queue.findIndex(
          item => (item.priority || 0) < (operation.priority || 0)
        );
        if (insertIndex === -1) {
          this.queue.push(enhancedOperation);
        } else {
          this.queue.splice(insertIndex, 0, enhancedOperation);
        }
      } else {
        this.queue.push(enhancedOperation);
      }

      this.scheduleProcessing();
    });
  }

  /**
   * Process batch immediately
   */
  async flush(): Promise<void> {
    if (this.timeoutId) {
      clearTimeout(this.timeoutId);
      this.timeoutId = null;
    }
    await this.processBatch();
  }

  /**
   * Get queue statistics
   */
  getStats() {
    return {
      queueLength: this.queue.length,
      processing: this.processing,
      activePromises: this.activePromises.size,
      oldestItem: this.queue.length > 0 ? Date.now() - (this.queue[0] as any).addedAt : 0
    };
  }

  private scheduleProcessing(): void {
    if (this.processing) return;

    // Process immediately if batch is full
    if (this.queue.length >= this.options.batchSize) {
      this.processBatch();
      return;
    }

    // Schedule processing after max wait time
    if (!this.timeoutId) {
      this.timeoutId = setTimeout(() => {
        this.timeoutId = null;
        this.processBatch();
      }, this.options.maxWaitTime);
    }
  }

  private async processBatch(): Promise<void> {
    if (this.processing || this.queue.length === 0) return;
    if (this.activePromises.size >= this.options.maxConcurrency) return;

    this.processing = true;

    try {
      // Extract batch
      const batchSize = Math.min(this.options.batchSize, this.queue.length);
      const batch = this.queue.splice(0, batchSize);

      if (batch.length === 0) {
        this.processing = false;
        return;
      }

      // Create processing promise
      const processingPromise = this.processBatchWithRetry(batch);
      this.activePromises.add(processingPromise);

      // Process batch
      await processingPromise;

      // Clean up
      this.activePromises.delete(processingPromise);
    } finally {
      this.processing = false;

      // Schedule next batch if queue is not empty
      if (this.queue.length > 0) {
        this.scheduleProcessing();
      }
    }
  }

  private async processBatchWithRetry(
    batch: (BatchOperation<T, R> & { resolve: Function; reject: Function })[]
  ): Promise<void> {
    let attempt = 0;

    while (attempt <= this.options.retryAttempts) {
      try {
        const startTime = performance.now();
        const inputs = batch.map(op => op.input);
        const results = await this.processor(inputs);
        const duration = performance.now() - startTime;

        // Resolve all operations
        batch.forEach((operation, index) => {
          operation.resolve(results[index]);
        });

        return;
      } catch (error) {
        attempt++;

        if (attempt > this.options.retryAttempts) {
          // Reject all operations on final failure
          batch.forEach(operation => {
            operation.reject(error);
          });
          return;
        }

        // Wait before retry
        await new Promise(resolve => 
          setTimeout(resolve, this.options.retryDelay * attempt)
        );
      }
    }
  }
}

/**
 * Token resolution batch processor
 */
export class TokenBatchProcessor {
  private colorProcessor: BatchProcessor<any, string>;
  private spacingProcessor: BatchProcessor<any, string>;
  private typographyProcessor: BatchProcessor<any, any>;

  constructor() {
    this.colorProcessor = new BatchProcessor(
      async (colors) => colors.map(color => this.processColor(color)),
      { batchSize: 100, maxWaitTime: 50, maxConcurrency: 2, retryAttempts: 1, retryDelay: 25 }
    );

    this.spacingProcessor = new BatchProcessor(
      async (spacings) => spacings.map(spacing => this.processSpacing(spacing)),
      { batchSize: 50, maxWaitTime: 30, maxConcurrency: 3, retryAttempts: 1, retryDelay: 25 }
    );

    this.typographyProcessor = new BatchProcessor(
      async (typographies) => typographies.map(typography => this.processTypography(typography)),
      { batchSize: 30, maxWaitTime: 40, maxConcurrency: 2, retryAttempts: 1, retryDelay: 25 }
    );
  }

  /**
   * Process color token in batch
   */
  async processColorToken(tokenData: any, priority?: number): Promise<string> {
    return this.colorProcessor.add({
      id: `color-${tokenData.id || Math.random()}`,
      input: tokenData,
      priority
    });
  }

  /**
   * Process spacing token in batch
   */
  async processSpacingToken(tokenData: any, priority?: number): Promise<string> {
    return this.spacingProcessor.add({
      id: `spacing-${tokenData.id || Math.random()}`,
      input: tokenData,
      priority
    });
  }

  /**
   * Process typography token in batch
   */
  async processTypographyToken(tokenData: any, priority?: number): Promise<any> {
    return this.typographyProcessor.add({
      id: `typography-${tokenData.id || Math.random()}`,
      input: tokenData,
      priority
    });
  }

  /**
   * Flush all processors
   */
  async flushAll(): Promise<void> {
    await Promise.all([
      this.colorProcessor.flush(),
      this.spacingProcessor.flush(),
      this.typographyProcessor.flush()
    ]);
  }

  /**
   * Get statistics for all processors
   */
  getStats() {
    return {
      color: this.colorProcessor.getStats(),
      spacing: this.spacingProcessor.getStats(),
      typography: this.typographyProcessor.getStats()
    };
  }

  private processColor(colorData: any): string {
    // Simplified color processing
    if (typeof colorData === 'string') return colorData;
    if (colorData.oklch) {
      const { l, c, h, a = 1 } = colorData.oklch;
      return a < 1 
        ? `oklch(${l.toFixed(3)} ${c.toFixed(3)} ${h.toFixed(1)} / ${a.toFixed(3)})`
        : `oklch(${l.toFixed(3)} ${c.toFixed(3)} ${h.toFixed(1)})`;
    }
    return colorData.value || '#000000';
  }

  private processSpacing(spacingData: any): string {
    if (typeof spacingData === 'string') return spacingData;
    if (typeof spacingData === 'number') return `${spacingData}px`;
    return spacingData.value || '0px';
  }

  private processTypography(typographyData: any): any {
    if (typeof typographyData === 'string') return { fontSize: typographyData };
    return {
      fontSize: typographyData.fontSize || '1rem',
      fontWeight: typographyData.fontWeight || 400,
      lineHeight: typographyData.lineHeight || 1.5,
      fontFamily: typographyData.fontFamily || 'system-ui',
      ...typographyData
    };
  }
}

// Export singleton instance
export const tokenBatchProcessor = new TokenBatchProcessor();