import { ExceptionBase } from "../../errors/ExceptionBase";

export interface IDomainEvent<T extends EventData> {
  metadata: EventMetadata;
  data: T;
  getId(): string;
  getName(): string;
}

export interface EventMetadata {
  eventId: string;
  name: string;
  occurredAt: Date;
  attempts: number;
  lastError?: ExceptionBase;
  nextRetryAt?: Date;
  domainEventState: DomainEventState;
  parentId?: string;
  message?: string;
  showOnUI?: boolean;
}

export enum DomainEventState {
  IsProcessing = "isProcessing",
  IsCompleted = "isCompleted",
  HasFailed = "hasFailed",
  NeedRetry = "needRetry",
}

export interface EventData {
  [key: string]: any;
}
