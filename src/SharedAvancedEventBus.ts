import { Constants } from "./constants/constants";
import { DeadLetterQueue } from "./DeadLetterQueue";
import { EnhancedEventBus, EnhancedEventBusConfig } from "./EnhancedEventBus";
import { EventMonitoringSystem } from "./EventMonitoringSystem";
import { ExponentialBackoffStrategy } from "./ExponentialBackoffStrategy";
import { FailedEvent, IDeadLetterQueue } from "./interfaces/DeadLetterQueue";
import { IEventMonitoringSystem } from "./interfaces/EventMonitoringSystem";
import { IExponentialBackoffStrategy } from "./interfaces/ExponentialBackOfStategy";
import { NullDeadLetterQueue } from "./NullObject/NullDeadLetterQueue";
import { NullEventMonitoringSystem } from "./NullObject/NullEventMonitoringSystem";
import { NullExponentialBackOffStrategy } from "./NullObject/NullExponentialBackOffStrategy";
import { InstanceManager } from "./shared/InstanceManager";
import { OnDeadLetter } from "./types";

export interface SharedEnhancedEventBusConfig extends EnhancedEventBusConfig {
  onDeadLetter?: OnDeadLetter;
}
export class SharedEnhancedEventBus extends EnhancedEventBus {
  private static intance: SharedEnhancedEventBus | null;
  private static config: SharedEnhancedEventBusConfig | null;
  private static defaultConfig = {
    enableMonitoringSystem: true,
    enableRetrySystem: true,
    onDeadLetter: async (event: FailedEvent<any>) => {},
    maxAttempts: Constants.maxAttempts,
    maxDelay: Constants.maxDelay,
    baseDelay: Constants.baseDelay,
    maxEventOnDQL: Constants.maxEventOnDQL,
  };
  private constructor(
    retryStrategy: IExponentialBackoffStrategy,
    deadLetterQueue: IDeadLetterQueue,
    monitoring: IEventMonitoringSystem
  ) {
    super(retryStrategy, deadLetterQueue, monitoring);
  }
  static configure(config: SharedEnhancedEventBusConfig) {
    SharedEnhancedEventBus.config = satisfies(config);
    SharedEnhancedEventBus.intance = SharedEnhancedEventBus.create(config);
    InstanceManager.register<SharedEnhancedEventBus>(
      Constants.eventBusDefaultKey,
      SharedEnhancedEventBus.getInstance()
    );
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

    return new SharedEnhancedEventBus(retryStrategy, deadLettered, monitoring);
  }

  static getInstance(): SharedEnhancedEventBus {
    if (!SharedEnhancedEventBus.intance) {
      SharedEnhancedEventBus.intance = SharedEnhancedEventBus.create(
        SharedEnhancedEventBus.config
          ? SharedEnhancedEventBus.config
          : SharedEnhancedEventBus.defaultConfig
      );
      InstanceManager.register<SharedEnhancedEventBus>(
        Constants.eventBusDefaultKey,
        SharedEnhancedEventBus.intance
      );
    }
    return SharedEnhancedEventBus.intance;
  }
}
//TODO : je vais implementer cette mehtode correctemenet plus tard
function satisfies(
  config: SharedEnhancedEventBusConfig
): SharedEnhancedEventBusConfig {
  return config;
}
