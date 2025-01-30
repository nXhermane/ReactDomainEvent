import "reflect-metadata";
import { DomainEventrix } from "./DomainEventrix";
import InstanceManager from "./shared/InstanceManager";
export * from "./core/DomainEvent";
export * from "./core/EventBus";
export * from "./core/EventHandler";
export * from "./addons/DeadLetterQueue";
export * from "./core/DomainEvent";
export * from "./EnhancedEventBus/EnhancedEventBus";
export * from "./addons/EventMonitoringSystem";
export * from "./addons/EventProcessingStateManager";
export * from "./addons/ExponentialBackoffStrategy";

export * from "./EnhancedEventBus/SharedAvancedEventBus";
export * from "./factories/createEnhancedEventBus";
export * from "./factories/createEventProcessingStateManagerFor"

export * from "./addons/NullObject/NullDeadLetterQueue";
export * from "./addons/NullObject/NullEventMonitoringSystem";
export * from "./addons/NullObject/NullExponentialBackOffStrategy";

export * from "./decorators/DomainEventHandler";
export * from "./decorators/DomainEventMessage";

export * from "./decorators_alternatives/bindEventHandler"
export * from "./decorators_alternatives/defineDomainEventMessage"

export * from "./core/interface /EventHandler";
export * from "./core/interface /EventBus";
export * from "./core/interface /DomainEvent";
export * from "./addons/interfaces/DeadLetterQueue";
export * from "./addons/interfaces/EventMonitoringSystem";
export * from "./addons/interfaces/EventProcessingStateManager";
export * from "./addons/interfaces/ExponentialBackOfStategy";

export * from "./errors/ExceptionBase";
export * from "./errors/FailedEventNotFoundOnDLQ";
export * from "./errors/InvalidDecoratorOrderError";
export * from "./errors/PermanentEventHandleFailureError";

export * from "./types/types";
export {InstanceManager}
export default  DomainEventrix