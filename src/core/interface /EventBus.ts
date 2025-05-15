import { Constructor } from "../../types/types";
import { EventData, IDomainEvent } from "./DomainEvent";
import { IEventHandler } from "./EventHandler";
export type EventType<T extends EventData = any> =
  | string
  | Constructor<IDomainEvent<T>>;
/**
 * Interface for an event bus implementation.
 * Handles publishing, subscribing, and dispatching of domain events.
 */
export interface IEventBus {
  /**
   * Publishes an event to the event bus.
   * @typeParam DataType - The type of data contained in the event
   * @typeParam T - The type of domain event extending IDomainEvent
   * @param event - The event to publish
   */
  publish<DataType extends EventData, T extends IDomainEvent<DataType>>(event: T): void;

  /**
   * Publishes an event and immediately dispatches it.
   * @typeParam DataType - The type of data contained in the event
   * @typeParam T - The type of domain event extending IDomainEvent
   * @param event - The event to publish and dispatch
   * @returns A Promise that resolves when the event has been dispatched
   */
  publishAndDispatchImmediate<DataType extends EventData, T extends IDomainEvent<DataType>>(event: T): Promise<void>;

  /**
   * Subscribes an event handler to handle specific domain events.
   * @typeParam DataType - The type of data contained in the event
   * @typeParam T - The type of domain event extending IDomainEvent
   * @param handler - The event handler to subscribe
   */
  subscribe<DataType extends EventData, T extends IDomainEvent<DataType>>(handler: IEventHandler<DataType, T>): void;

  /**
   * Dispatches events of a specific event type.
   * @typeParam T - The type of event data, defaults to any
   * @param eventType - The type of event to dispatch
   */
  dispatch<T extends EventData = any>(eventType: EventType<T>): void;

  /**
   * Unsubscribes an event handler from handling specific domain events.
   * @typeParam DataType - The type of data contained in the event
   * @typeParam T - The type of domain event extending IDomainEvent
   * @param handler - The event handler to unsubscribe
   */
  unsubscribe<DataType extends EventData, T extends IDomainEvent<DataType>>(handler: IEventHandler<DataType, T>): void;
}