import generateUniqueId from "../../utils/generateUniqueId";
import { Constants } from "../constants/constants";
import { DomainEventMessageOptions } from "../decorators/DomainEventMessage";
import {
  DomainEventState,
  EventData,
  EventMetadata,
  IDomainEvent,
} from "./interface /DomainEvent";

export class DomainEvent<T extends EventData> implements IDomainEvent<T> {
  metadata: EventMetadata;
  data: T;
  constructor(data: T, metadata?: EventMetadata) {
    this.data = data ? data : ({} as T);
    this.metadata = metadata || this.initializeMetadata();
  }
  getState(): DomainEventState {
    return this.metadata.domainEventState;
  }
  getParentId(): string {
    return this.metadata.parentId as string;
  }
  getMetaData(): EventMetadata {
    return this.metadata;
  }
  setMetaData(data: EventMetadata): void {
    if (data.eventId != this.metadata.eventId)
      throw new Error(
        "[Error] : ce eventMetaData n'est pas pour ce DomainEvent"
      );
    this.metadata = data;
  }
  setState(domainEventState: DomainEventState) {
    this.metadata.domainEventState = domainEventState;
  }
  setParentId(parentId: string) {
    this.metadata.parentId = parentId;
  }

  private initializeMetadata(): EventMetadata {
    const domainMessageOptions : DomainEventMessageOptions= Reflect.getMetadata(Constants.eventMessageOption,this.constructor)
    return {
      name: this.getName(),
      eventId: generateUniqueId(),
      occurredAt: new Date(),
      attempts: 0,
      domainEventState: DomainEventState.IsProcessing,
      message: domainMessageOptions.message || undefined,
      showOnUI: domainMessageOptions.isVisibleOnUI || false
    };
  }
  getId(): string {
    return this.metadata.eventId;
  }
  getName(): string {
    return this.metadata?.name || this.constructor.name;
  }
  static deserialize(data: string): DomainEvent<any> {
    const domainEventData = JSON.parse(data);
    const domainEvent = new DomainEvent(
      domainEventData.data,
      domainEventData.metadata
    );
    return domainEvent;
  }
  serialize(): string {
    return JSON.stringify({
      data: this.data,
      metadata: this.metadata,
    });
  }
}
