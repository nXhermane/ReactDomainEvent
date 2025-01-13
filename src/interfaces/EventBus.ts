import { DomainEvent } from "../DomainEvent";
import { EventHandler } from "../EventHandler";
import { EventData } from "./DomainEvent";

export interface IEventBus {
    publish<DataType extends EventData,T extends DomainEvent<DataType>>(event: T):void
    publishAndDispatchImmediate<DataType extends EventData,T extends DomainEvent<DataType>>(event: T): Promise<void> 
    suscriber<DataType extends EventData, T extends DomainEvent<DataType>>(handler: EventHandler<DataType,T>): void 
}