import { Constants } from "../constants/constants";
import { EnhancedEventBus, EnhancedEventBusConfig } from "../EnhancedEventBus";
import { DeadLetterQueue } from "../DeadLetterQueue";
import { ExponentialBackoffStrategy } from "../ExponentialBackoffStrategy";
import { FailedEvent } from "../interfaces/DeadLetterQueue";
import { NullExponentialBackOffStrategy } from "../NullObject/NullExponentialBackOffStrategy";
import { NullDeadLetterQueue } from "../NullObject/NullDeadLetterQueue";
import { EventMonitoringSystem } from "../EventMonitoringSystem";
import { NullEventMonitoringSystem } from "../NullObject/NullEventMonitoringSystem";
import { OnDeadLetter } from "../types";

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

  return new EnhancedEventBus(retryStrategy, deadLettered, monitoring);
}
