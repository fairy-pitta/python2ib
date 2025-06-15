/**
 * Progress tracking utilities for large file processing
 */

export interface ProgressOptions {
  total: number;
  label?: string;
  showPercentage?: boolean;
  showETA?: boolean;
  width?: number;
}

export class ProgressBar {
  private current = 0;
  private startTime = Date.now();
  private lastUpdateTime = 0;
  private readonly updateInterval = 100; // Update every 100ms

  constructor(private options: ProgressOptions) {
    this.options = {
      label: 'Progress',
      showPercentage: true,
      showETA: true,
      width: 40,
      ...options
    };
  }

  /**
   * Update progress
   */
  update(current: number): void {
    this.current = Math.min(current, this.options.total);
    
    const now = Date.now();
    if (now - this.lastUpdateTime < this.updateInterval && current < this.options.total) {
      return; // Throttle updates
    }
    
    this.lastUpdateTime = now;
    this.render();
  }

  /**
   * Increment progress by 1
   */
  increment(): void {
    this.update(this.current + 1);
  }

  /**
   * Mark as complete
   */
  complete(): void {
    this.current = this.options.total;
    this.render();
    process.stdout.write('\n');
  }

  /**
   * Render progress bar
   */
  private render(): void {
    const { total, label, showPercentage, showETA, width } = this.options;
    const percentage = Math.floor((this.current / total) * 100);
    const filled = Math.floor((this.current / total) * width!);
    const empty = width! - filled;
    
    let bar = '█'.repeat(filled) + '░'.repeat(empty);
    let output = `\r${label}: [${bar}]`;
    
    if (showPercentage) {
      output += ` ${percentage}%`;
    }
    
    output += ` (${this.current}/${total})`;
    
    if (showETA && this.current > 0) {
      const elapsed = Date.now() - this.startTime;
      const rate = this.current / elapsed;
      const remaining = (total - this.current) / rate;
      
      if (remaining > 0 && remaining < Infinity) {
        output += ` ETA: ${this.formatTime(remaining)}`;
      }
    }
    
    process.stdout.write(output);
  }

  /**
   * Format time in human readable format
   */
  private formatTime(ms: number): string {
    const seconds = Math.floor(ms / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    
    if (hours > 0) {
      return `${hours}h ${minutes % 60}m`;
    } else if (minutes > 0) {
      return `${minutes}m ${seconds % 60}s`;
    } else {
      return `${seconds}s`;
    }
  }
}

/**
 * Simple progress tracker for batch operations
 */
export class BatchProgress {
  private completed = 0;
  private failed = 0;
  private progressBar: ProgressBar;

  constructor(
    private total: number,
    private onProgress?: (completed: number, failed: number, total: number) => void
  ) {
    this.progressBar = new ProgressBar({
      total,
      label: 'Converting files',
      showPercentage: true,
      showETA: true
    });
  }

  /**
   * Mark one item as completed successfully
   */
  success(): void {
    this.completed++;
    this.update();
  }

  /**
   * Mark one item as failed
   */
  failure(): void {
    this.failed++;
    this.update();
  }

  /**
   * Update progress display
   */
  private update(): void {
    const processed = this.completed + this.failed;
    this.progressBar.update(processed);
    
    if (this.onProgress) {
      this.onProgress(this.completed, this.failed, this.total);
    }
    
    if (processed >= this.total) {
      this.complete();
    }
  }

  /**
   * Complete the progress tracking
   */
  complete(): void {
    this.progressBar.complete();
    
    // Print summary
    console.log(`\nCompleted: ${this.completed}/${this.total}`);
    if (this.failed > 0) {
      console.log(`Failed: ${this.failed}/${this.total}`);
    }
  }

  /**
   * Get current statistics
   */
  getStats(): { completed: number; failed: number; total: number; percentage: number } {
    return {
      completed: this.completed,
      failed: this.failed,
      total: this.total,
      percentage: Math.floor(((this.completed + this.failed) / this.total) * 100)
    };
  }
}

/**
 * Create a progress bar for file processing
 */
export function createFileProgress(fileCount: number, label = 'Processing files'): ProgressBar {
  return new ProgressBar({
    total: fileCount,
    label,
    showPercentage: true,
    showETA: true,
    width: 30
  });
}

/**
 * Create a progress bar for line processing
 */
export function createLineProgress(lineCount: number, filename?: string): ProgressBar {
  const label = filename ? `Processing ${filename}` : 'Processing lines';
  return new ProgressBar({
    total: lineCount,
    label,
    showPercentage: true,
    showETA: false,
    width: 20
  });
}

/**
 * Utility to track progress of async operations
 */
export async function withProgress<T>(
  items: T[],
  processor: (item: T, index: number) => Promise<void>,
  options?: Partial<ProgressOptions>
): Promise<void> {
  const progress = new ProgressBar({
    total: items.length,
    label: 'Processing',
    ...options
  });

  for (let i = 0; i < items.length; i++) {
    await processor(items[i], i);
    progress.update(i + 1);
  }

  progress.complete();
}