import { EnhancedEventBus } from "../EnhancedEventBus/EnhancedEventBus";
import { Constructor } from "../types/types";

export const Constants = {
  handlerMetaDataKey: "handler",
  handlerEventBusMetaDataKey: "eventBus",
  eventMessageOption: "domainEventMessage",
  eventBusDefaultKey: "SharedEnhancedEventBus",
  getEventProcessingKey: (
    eventBusKey: string | Constructor<EnhancedEventBus>
  ) => {
    const eventBusName =
      typeof eventBusKey === "string" ? eventBusKey : eventBusKey.name;
    return `${eventBusName}-EventProcessingStateManager`;
  },
  // constante du Exponential Back off Strategy
  maxAttempts: 5,
  baseDelay: 1000,
  maxDelay: 1000 * 60 * 60, // 1 Hours

  // constante du DQL
  maxEventOnDQL: 1000,
};
