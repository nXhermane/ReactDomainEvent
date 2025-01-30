import { Constants } from "../constants/constants";
import { EnhancedEventBus, EnhancedEventBusConfig } from "../EnhancedEventBus/EnhancedEventBus";
import { DeadLetterQueue } from "../addons/DeadLetterQueue";
import { ExponentialBackoffStrategy } from "../addons/ExponentialBackoffStrategy";
import { FailedEvent } from "../addons/interfaces/DeadLetterQueue";
import { NullExponentialBackOffStrategy } from "../addons/NullObject/NullExponentialBackOffStrategy";
import { NullDeadLetterQueue } from "../addons/NullObject/NullDeadLetterQueue";
import { EventMonitoringSystem } from "../addons/EventMonitoringSystem";
import { NullEventMonitoringSystem } from "../addons/NullObject/NullEventMonitoringSystem";
import { OnDeadLetter } from "../types/types";

export function createEnhancedEventBus(
  config: EnhancedEventBusConfig,
  onDeadLetter: OnDeadLetter = async (
    event: FailedEvent<any>
  ) => {}
): EnhancedEventBus {
  const retryStrategy = config.enableRetrySystem
    ? new ExponentialBackoffStrategy(
        config.maxAttempts ? config.maxAttempts : Constants.maxAttempts,
        config.baseDelay ? config.baseDelay : Constants.baseDelay,
        config.maxDelay ? config.maxDelay : Constants.maxDelay
      )
    : new NullExponentialBackOffStrategy();
  const deadLettered = config.enableRetrySystem
    ? new DeadLetterQueue(
        onDeadLetter,
        config.maxEventOnDQL ? config.maxEventOnDQL : Constants.maxEventOnDQL
      )
    : new NullDeadLetterQueue();
  const monitoring = config.enableMonitoringSystem
    ? new EventMonitoringSystem()
    : new NullEventMonitoringSystem();

  return new EnhancedEventBus(config.eventBusKey,retryStrategy, deadLettered, monitoring);
}
