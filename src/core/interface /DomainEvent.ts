import { DomainExceptionBase } from "../../errors/ExceptionBase";

export interface IDomainEvent<T extends EventData> {
  metadata: EventMetadata;
  data: T;
  getId(): string;
  getName(): string;
  setParentId(id: string ) : void 
  getMetaData(): EventMetadata
}

export interface EventMetadata {
  eventId: string;
  name: string;
  occurredAt: Date;
  attempts: number;
  lastError?: DomainExceptionBase;
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
