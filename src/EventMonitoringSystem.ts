import {
  EventMetrics,
  EventMetricsReport,
  IEventMonitoringSystem,
} from "./interfaces/EventMonitoringSystem";

export class EventMonitoringSystem implements IEventMonitoringSystem {
  private metrics: EventMetrics = {
    processed: 0,
    failed: 0,
    retried: 0,
    deadLettered: 0,
    processingTime: [],
    queueSize: 0,
  };

  private readonly metricsWindow: number = 1000; // Garder les 1000 dernières mesures

  recordProcessedEvent(processingTime: number): void {
    this.metrics.processed++;
    this.metrics.processingTime.push(processingTime);

    if (this.metrics.processingTime.length > this.metricsWindow) {
      this.metrics.processingTime.shift();
    }
  }

  recordFailedEvent(): void {
    this.metrics.failed++;
  }

  recordRetriedEvent(): void {
    this.metrics.retried++;
  }

  recordDeadLetteredEvent(): void {
    this.metrics.deadLettered++;
  }

  updateQueueSize(size: number): void {
    this.metrics.queueSize = size;
  }

  getMetrics(): EventMetricsReport {
    return {
      ...this.metrics,
      averageProcessingTime: this.calculateAverageProcessingTime(),
      processingTimeP95: this.calculatePercentile(95),
      processingTimeP99: this.calculatePercentile(99),
      failureRate: this.calculateFailureRate(),
      throughput: this.calculateThroughput(),
    };
  }

  private calculateAverageProcessingTime(): number {
    if (this.metrics.processingTime.length === 0) return 0;
    const sum = this.metrics.processingTime.reduce((a, b) => a + b, 0);
    return sum / this.metrics.processingTime.length;
  }

  private calculatePercentile(percentile: number): number {
    if (this.metrics.processingTime.length === 0) return 0;
    const sorted = [...this.metrics.processingTime].sort((a, b) => a - b);
    const index = Math.ceil((percentile / 100) * sorted.length) - 1;
    return sorted[index];
  }

  private calculateFailureRate(): number {
    const total = this.metrics.processed + this.metrics.failed;
    return total === 0 ? 0 : (this.metrics.failed / total) * 100;
  }

  private calculateThroughput(): number {
    // Calculé sur la dernière minute
    return this.metrics.processed; // À améliorer avec une fenêtre glissante
  }
}
