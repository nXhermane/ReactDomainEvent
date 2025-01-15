import { EventData, IDomainEvent } from "./interfaces/DomainEvent";
import {
  EventHandlerMetaData,
  HandlerState,
  IEventHandler,
} from "./interfaces/EventHandler";
import { Constants } from "./constants/constants";
import { EventHandlerFor, generateUniqueId } from "./main";
import { HandlerStateDecorator } from "./decorators/internalDecorators/HandlerStateDecorator";
import {
  DomainEventMessage,
  DomainEventMessageOptions,
} from "./decorators/DomainEventMessage";
import { InvalidDecoratorOrderError } from "./errors/InvalidDecoratorOrderError";

export abstract class EventHandler<
  DataType extends EventData,
  EventType extends IDomainEvent<DataType>
> implements IEventHandler<DataType, EventType>
{
  metadata: EventHandlerMetaData;
  public priority?: number | undefined;
  constructor(priority?: number) {
    this.priority = priority;
    this.metadata = this.initMetaData();
  }
  getId(): string {
    return this.metadata.handlerId;
  }
  getName(): string {
    return this.constructor.name;
  }
  initMetaData(): EventHandlerMetaData {
    const domainMessageOptions: DomainEventMessageOptions = Reflect.getMetadata(
      Constants.eventMessageOption,
      this.constructor
    );
    if (!domainMessageOptions) {
      throw new InvalidDecoratorOrderError(
        EventHandlerFor.name,
        DomainEventMessage.name,
        this.constructor.name
      );
    }
    return {
      handlerId: generateUniqueId(),
      handlerState: HandlerState.WAITING,
      message: domainMessageOptions.message || undefined,
      showOnUI: domainMessageOptions.isVisibleOnUI || false,
    };
  }
  setHandlerState(state: HandlerState) {
    this.metadata.handlerState = state;
  }
  setPriority(priority: number): void {
    this.priority = priority;
  }
  abstract execute(event: EventType): void | Promise<void>;
  @HandlerStateDecorator()
  _internalExecute(event: EventType): void | Promise<void> {
    return this.execute(event);
  }
  getEventName(): string {
    const metadata = Reflect.getMetadata(
      Constants.handlerMetaDataKey,
      this.constructor
    );
    return metadata;
  }
  getMetadata(): EventHandlerMetaData {
    return this.metadata;
  }
}
