import { EventData, IDomainEvent } from "./DomainEvent";

export interface IEventHandler<DataType extends EventData,T extends IDomainEvent<DataType>>  {
    execute(event: T): void | Promise<void>
    priority?: number  // Priorite d'execution des handlers
    getEventName(): string
}