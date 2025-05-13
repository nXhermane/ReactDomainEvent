import { Constants } from "../constants/constants";
import { DeadLetterQueue } from "../addons/DeadLetterQueue";
import { EnhancedEventBus, EnhancedEventBusConfig } from "./EnhancedEventBus";
import { EventMonitoringSystem } from "../addons/EventMonitoringSystem";
import { ExponentialBackoffStrategy } from "../addons/ExponentialBackoffStrategy";
import { FailedEvent, IDeadLetterQueue } from "../addons/interfaces/DeadLetterQueue";
import { IEventMonitoringSystem } from "../addons/interfaces/EventMonitoringSystem";
import { IExponentialBackoffStrategy } from "../addons/interfaces/ExponentialBackOfStategy";
import { NullDeadLetterQueue } from "../addons/NullObject/NullDeadLetterQueue";
import { NullEventMonitoringSystem } from "../addons/NullObject/NullEventMonitoringSystem";
import { NullExponentialBackOffStrategy } from "../addons/NullObject/NullExponentialBackOffStrategy";
import { Constructor, OnDeadLetter } from "../types/types";

export interface SharedEnhancedEventBusConfig
  extends Partial<EnhancedEventBusConfig> {
  onDeadLetter?: OnDeadLetter;
}
export class SharedEnhancedEventBus extends EnhancedEventBus {
  private static instance: SharedEnhancedEventBus | null;
  private static config: SharedEnhancedEventBusConfig | null;
  private static defaultConfig = {
    eventBusKey: Constants.eventBusDefaultKey,
    enableMonitoringSystem: true,
    enableRetrySystem: true,
    onDeadLetter: async (event: FailedEvent<any>) => {},
    maxAttempts: Constants.maxAttempts,
    maxDelay: Constants.maxDelay,
    baseDelay: Constants.baseDelay,
    maxEventOnDQL: Constants.maxEventOnDQL,
  };
  private constructor(
    eventBusKey: string | Constructor<EnhancedEventBus>,
    retryStrategy: IExponentialBackoffStrategy,
    deadLetterQueue: IDeadLetterQueue,
    monitoring: IEventMonitoringSystem
  ) {
    super(eventBusKey, retryStrategy, deadLetterQueue, monitoring);
  }
  static configure(config: SharedEnhancedEventBusConfig) {
    SharedEnhancedEventBus.config = satisfies(config);
    SharedEnhancedEventBus.instance = SharedEnhancedEventBus.create(config);
  }

  private static create(
    config: SharedEnhancedEventBusConfig
  ): SharedEnhancedEventBus {
    const retryStrategy = config.enableRetrySystem
      ? new ExponentialBackoffStrategy(
          config.maxAttempts
            ? config.maxAttempts
            : SharedEnhancedEventBus.defaultConfig.maxAttempts,
          config.baseDelay
            ? config.baseDelay
            : SharedEnhancedEventBus.defaultConfig.baseDelay,
          config.maxDelay
            ? config.maxDelay
            : SharedEnhancedEventBus.defaultConfig.maxDelay
        )
      : new NullExponentialBackOffStrategy();
    const deadLettered = config.enableRetrySystem
      ? new DeadLetterQueue(
          config.onDeadLetter
            ? config.onDeadLetter
            : SharedEnhancedEventBus.defaultConfig.onDeadLetter,
          config.maxEventOnDQL
            ? config.maxEventOnDQL
            : SharedEnhancedEventBus.defaultConfig.maxEventOnDQL
        )
      : new NullDeadLetterQueue();
    const monitoring = config.enableMonitoringSystem
      ? new EventMonitoringSystem()
      : new NullEventMonitoringSystem();

    return new SharedEnhancedEventBus(
      config.eventBusKey || SharedEnhancedEventBus.defaultConfig.eventBusKey,
      retryStrategy,
      deadLettered,
      monitoring
    );
  }

  static getInstance(): SharedEnhancedEventBus {
    if (!SharedEnhancedEventBus.instance) {
      SharedEnhancedEventBus.instance = SharedEnhancedEventBus.create(
        SharedEnhancedEventBus.config
          ? SharedEnhancedEventBus.config
          : SharedEnhancedEventBus.defaultConfig
      );
    }
    return SharedEnhancedEventBus.instance;
  }
}
//TODO : je vais implementer cette mehtode correctement plus tard
function satisfies(
  config: SharedEnhancedEventBusConfig
): SharedEnhancedEventBusConfig {
  return config;
}
