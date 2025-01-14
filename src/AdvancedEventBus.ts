import { DomainEvent } from "./DomainEvent";
import { ExceptionBase } from "./errors/ExceptionBase";
import { EventBus } from "./EventBus";
import { EventHandler } from "./EventHandler";
import { IDeadLetterQueue } from "./interfaces/DeadLetterQueue";
import {
  EventMetricsReport,
  IEventMonitoringSystem,
} from "./interfaces/EventMonitoringSystem";
import { IExponentialBackoffStrategy } from "./interfaces/ExponentialBackOfStategy";
import { EventData } from "./main";

export class AdvancedEventBus {
  private readonly retryStrategy: IExponentialBackoffStrategy;
  private readonly deadLetterQueue: IDeadLetterQueue;
  private readonly monitoring: IEventMonitoringSystem;
  constructor(
    retryStrategy: IExponentialBackoffStrategy,
    deadLetterQueue: IDeadLetterQueue,
    monitoring: IEventMonitoringSystem
  ) {
    this.retryStrategy = retryStrategy;
    this.deadLetterQueue = deadLetterQueue;
    this.monitoring = monitoring;
  }

  protected async executeHandler<
    DataType extends EventData,
    T extends DomainEvent<DataType>
  >(handler: EventHandler<DataType, T>, event: T): Promise<void> {
    const startTime = Date.now();

    try {
      await handler.execute(event);

      const processingTime = Date.now() - startTime;
      this.monitoring.recordProcessedEvent(processingTime);
    } catch (error) {
      this.monitoring.recordFailedEvent();
      const metadata = event.getMetaData();
      if (this.retryStrategy.shouldRetry(metadata.attempts, error as Error)) {
        await this.scheduleRetry(handler, event, error as ExceptionBase);
      } else {
        await this.moveToDeadLetterQueue(event, error as ExceptionBase);
      }
    }
  }
  private async scheduleRetry<
    DataType extends EventData,
    T extends DomainEvent<DataType>
  >(
    handler: EventHandler<DataType, T>,
    event: T,
    error: ExceptionBase
  ): Promise<void> {
    const metadata = event.getMetaData();
    const nextRetryDelay = this.retryStrategy.getNextRetryDelay(
      metadata.attempts
    );

    metadata.attempts++;
    metadata.lastError = error;
    metadata.nextRetryAt = new Date(Date.now() + nextRetryDelay);
    event.setMetaData(metadata);
    this.monitoring.recordRetriedEvent();

    // Programmer la nouvelle tentative
    setTimeout(() => {
      this.executeHandler(handler, event).catch(console.error);
    }, nextRetryDelay);
  }

  private async moveToDeadLetterQueue<
    DataType extends EventData,
    T extends DomainEvent<DataType>
  >(event: T, error: ExceptionBase): Promise<void> {
    this.monitoring.recordDeadLetteredEvent();
    await this.deadLetterQueue.addFailedEvent(event, error);
  }

  getMetrics(): EventMetricsReport {
    return this.monitoring.getMetrics();
  }
}
