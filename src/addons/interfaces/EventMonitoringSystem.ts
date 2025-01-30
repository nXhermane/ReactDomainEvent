export interface EventMetrics {
  processed: number;
  failed: number;
  retried: number;
  deadLettered: number;
  processingTime: number[];
  queueSize: number;
}

export interface EventMetricsReport extends EventMetrics {
  averageProcessingTime: number;
  processingTimeP95: number;
  processingTimeP99: number;
  failureRate: number;
  throughput: number;
}

export interface IEventMonitoringSystem {
    recordProcessedEvent(processingTime: number): void 
    recordFailedEvent(): void
    recordRetriedEvent(): void
    recordDeadLetteredEvent(): void
    updateQueueSize(size: number): void
    getMetrics(): EventMetricsReport 
}
