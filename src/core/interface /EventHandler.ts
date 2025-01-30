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
export interface IEventHandler<
  DataType extends EventData,
  T extends IDomainEvent<DataType>
> {
  getId(): string;
  getName(): string;
  execute(event: T): void | Promise<void>;
  _internalExecute(event: T): void | Promise<void>;
  priority?: number; // Priorite d'execution des handlers
  getEventName(): string;
}
