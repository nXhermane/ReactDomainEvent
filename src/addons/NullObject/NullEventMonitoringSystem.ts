import { Config } from "../../constants/Config";
import {
  EventMetricsReport,
  IEventMonitoringSystem,
} from "../interfaces/EventMonitoringSystem";

export class NullEventMonitoringSystem implements IEventMonitoringSystem {
  private metrics: EventMetricsReport = {
    processed: 0,
    failed: 0,
    retried: 0,
    deadLettered: 0,
    processingTime: [],
    queueSize: 0,
    averageProcessingTime: 0,
    processingTimeP95: 0,
    processingTimeP99: 0,
    failureRate: 0,
    throughput: 0,
  };
  recordProcessedEvent(processingTime: number): void {
    if (Config.mode === "debug")
      console.warn(
        this.constructor.name,
        "recordProcessedEvent called with arguments",
        processingTime
      );
  }
  recordFailedEvent(): void {
    if (Config.mode === "debug")
      console.warn(this.constructor.name, "recordFailedEvent called");
  }
  recordRetriedEvent(): void {
    if (Config.mode === "debug")
      console.warn(this.constructor.name, "recordRetriedEvent called");
  }
  recordDeadLetteredEvent(): void {
    if (Config.mode === "debug")
      console.warn(this.constructor.name, "recordDeadLetteredEvent called");
  }
  updateQueueSize(size: number): void {
    if (Config.mode === "debug")
      console.warn(
        this.constructor.name,
        "updateQueueSize called with arguments",
        size
      );
  }
  getMetrics(): EventMetricsReport {
    if (Config.mode === "debug")
      console.warn(
        this.constructor.name,
        "getMetrics called",
        "returning",
        this.metrics
      );
    return this.metrics;
  }
}
