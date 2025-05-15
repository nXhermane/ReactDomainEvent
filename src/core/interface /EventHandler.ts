import { EventData, IDomainEvent } from "./DomainEvent";

export interface EventHandlerMetaData {
  handlerId: string;
  handlerState: HandlerState;
  message?: string;
  showOnUI?: boolean;
}
export enum HandlerState {
  WAITING = "waiting", // default state
  EXECUTING = "executing", // handler en execution
  COMPLETED = "completed", // handler a reussir
  FAILED = "failed", // handler a echoue
}
/**
 * Interface representing an event handler for domain events.
 * Event handlers are responsible for processing domain events and executing associated business logic.
 * 
 * @template DataType - The type of data contained in the event, must extend EventData
 * @template T - The type of domain event being handled, must extend IDomainEvent<DataType>
 * 
 * @interface IEventHandler
 */

export interface IEventHandler<DataType extends EventData, T extends IDomainEvent<DataType>> {
  /**
   * Gets the unique identifier of the event handler
   * @returns {string} The handler's ID
   */
  getId(): string;

  /**
   * Gets the name of the event handler
   * @returns {string} The handler's name
   */
  getName(): string;

  /**
   * Executes the event handling logic
   * @param {T} event - The domain event to handle
   * @returns {void | Promise<void>} Nothing or a Promise that resolves to nothing
   */
  execute(event: T): void | Promise<void>;

  /**
   * Internal execution method for the event handler
   * @param {T} event - The domain event to handle
   * @returns {void | Promise<void>} Nothing or a Promise that resolves to nothing
   * @internal
   */
  _internalExecute(event: T): void | Promise<void>;

  /**
   * Optional priority value for execution order of handlers
   * Higher numbers indicate higher priority
   * @type {number}
   */
  priority?: number;

  /**
   * Gets the name of the event this handler is responsible for
   * @returns {string} The event name
   */
  getEventName(): string;
}