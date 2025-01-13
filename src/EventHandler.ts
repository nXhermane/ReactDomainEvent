import { EventData, IDomainEvent } from "./interfaces/DomainEvent";
import { IEventHandler } from "./interfaces/EventHandler";

export abstract class EventHandler<
  DataType extends EventData,
  EventType extends IDomainEvent<DataType>
> implements IEventHandler<DataType, EventType>
{
  public priority?: number | undefined;
  constructor(priority?: number) {
    this.priority = priority;
  }
  setPriority(priority: number): void {
    this.priority = priority;
  }
  abstract execute(event: EventType): void | Promise<void>;
  getEventName(): string {
    const metadata = Reflect.getMetadata("handler",this.constructor)
    return metadata
  }
}