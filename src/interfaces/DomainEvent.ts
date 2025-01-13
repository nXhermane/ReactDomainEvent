export interface IDomainEvent<T extends EventData> {
  metadata: EventMetadata;
  data: T;
  getId(): string;
  getName(): string;
}

export interface EventMetadata {
  eventId: string;
  occurredAt: Date;
  attempts: number;
  lastErors?: Error;
  nextRetryAt?: Date;
  handlerState: EventHandlingState;
  parentId?: string;
}

export enum EventHandlingState {
  ON = "on",
  OFF = "off",
  WAITING = "waiting",
}
export interface EventData {
  [key: string]: any;
}
