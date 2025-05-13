import { DomainEvent } from "../core/DomainEvent";
import { DomainEventrix } from "../DomainEventrix";
import { ExceptionBase } from "../errors/ExceptionBase";
import { FailedEventNotFoundOnDLQ } from "../errors/FailedEventNotFoundOnDLQ";
import { EventBus } from "../core/EventBus";
import { EventHandler } from "../core/EventHandler";
import {
  FailedHandlerData,
  IDeadLetterQueue,
} from "../addons/interfaces/DeadLetterQueue";
import { DomainEventState, EventData } from "../core/interface /DomainEvent";
import {
  EventMetricsReport,
  IEventMonitoringSystem,
} from "../addons/interfaces/EventMonitoringSystem";
import { IExponentialBackoffStrategy } from "../addons/interfaces/ExponentialBackOfStategy";
import { Constructor } from "../types/types";

export interface EnhancedEventBusConfig {
  eventBusKey: string | Constructor<EnhancedEventBus>
  enableRetrySystem?: boolean;
  enableMonitoringSystem?: boolean;
  maxEventOnDQL?: number;
  maxAttempts?: number;
  baseDelay?: number;
  maxDelay?: number;
}
export class EnhancedEventBus extends EventBus {
  private readonly retryStrategy: IExponentialBackoffStrategy;
  private readonly deadLetterQueue: IDeadLetterQueue;
  private readonly monitoring: IEventMonitoringSystem;
  private readonly eventBuskey: string | Constructor<EnhancedEventBus>;
  constructor(
    evenBusKey: string | Constructor<EnhancedEventBus>,
    retryStrategy: IExponentialBackoffStrategy,
    deadLetterQueue: IDeadLetterQueue,
    monitoring: IEventMonitoringSystem
  ) {
    super();
    this.eventBuskey = evenBusKey;
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
      await handler._internalExecute(event);

      const processingTime = Date.now() - startTime;
      this.monitoring.recordProcessedEvent(processingTime);
    } catch (error) {
      this.monitoring.recordFailedEvent();
      const metadata = event.getMetaData();
      if (
        this.retryStrategy.shouldRetry(
          metadata.attempts,
          error as ExceptionBase
        )
      ) {
        await this.scheduleRetry(handler, event, error as ExceptionBase);
      } else {
        // Changer l'etat avant actualiser les donnees de l'eventProcessingStateManager
        event.setState(DomainEventState.NeedRetry);
        DomainEventrix.getEventProcessingStateManagerByEventBusKey(
          this.eventBuskey
        )?.addHandler(event, handler);
        await this.moveToDeadLetterQueue(event, {
          id: handler.getId(),
          name: handler.getName(),
          error: error as ExceptionBase,
        });
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

  async retry<DataType extends EventData, T extends DomainEvent<DataType>>(
    failedEventId: string
  ): Promise<void> {
    const failedEvent = this.deadLetterQueue.getFailedEvent(failedEventId);
    if (!failedEvent)
      throw new FailedEventNotFoundOnDLQ(
        "The failed event with id " + failedEventId + " not found on DLQ."
      );
    const event = failedEvent.event;
    const handlers = failedEvent.failedHandlersData
      .map((failedHandlerState) => {
        return this.searchHandlerByNameOrId(
          failedHandlerState.name,
          failedHandlerState.id
        );
      })
      .flat();
    for (const handler of handlers) {
      Promise.resolve(this.executeHandler(handler, event));
    }
  }
  private async moveToDeadLetterQueue<
    DataType extends EventData,
    T extends DomainEvent<DataType>
  >(event: T, failedHandlerData: FailedHandlerData): Promise<void> {
    this.monitoring.recordDeadLetteredEvent();
    await this.deadLetterQueue.addFailedEvent(event, failedHandlerData);
  }

  getMetrics(): EventMetricsReport {
    return this.monitoring.getMetrics();
  }
}
