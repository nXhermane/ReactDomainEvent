import { DomainEvent } from "../DomainEvent";
import { EventHandler } from "../EventHandler";
import { Constructor } from "../types";
import { EventData } from "./DomainEvent";
export type EventType<T extends EventData = any> =
  | string
  | Constructor<DomainEvent<T>>;
export interface IEventBus {
  publish<DataType extends EventData, T extends DomainEvent<DataType>>(
    event: T
  ): void;
  publishAndDispatchImmediate<
    DataType extends EventData,
    T extends DomainEvent<DataType>
  >(
    event: T
  ): Promise<void>;
  suscriber<DataType extends EventData, T extends DomainEvent<DataType>>(
    handler: EventHandler<DataType, T>
  ): void;
  dispatch<T extends EventData = any>(eventType: EventType<T>): void;
}
