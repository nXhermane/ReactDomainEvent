import generateUniqueId from "../utils/generateUniqueId";
import {
  EventData,
  EventHandlingState,
  EventMetadata,
  IDomainEvent,
} from "./interfaces/DomainEvent";

export abstract class DomainEvent<T extends EventData>
  implements IDomainEvent<T>
{
  metadata: EventMetadata;
  data: T;
  constructor(data: T) {
    this.data = data ? data : ({} as T);
    this.metadata = this.initializeMetadata();
  }
  getState(): EventHandlingState {
    return this.metadata.handlerState;
  }
  getParentId(): string {
    return this.metadata.parentId as string;
  }
  getMetaData(): EventMetadata {
    return this.metadata;
  }
  setHandlerState(handlerState: EventHandlingState) {
    this.metadata.handlerState = handlerState;
  }
  setParentId(parentId: string) {
    this.metadata.parentId = parentId;
  }

  private initializeMetadata(): EventMetadata {
    return {
      eventId: generateUniqueId(),
      occurredAt: new Date(),
      attempts: 0,
      handlerState: EventHandlingState.OFF,
    };
  }
  getId(): string {
    return this.metadata.eventId;
  }
  getName(): string {
    return this.constructor.name;
  }
}
