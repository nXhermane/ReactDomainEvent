import { DomainEvent } from "../DomainEvent";
import { ExceptionBase } from "../errors/ExceptionBase";

export interface FailedEvent<T extends DomainEvent<any>> {
  event: T;
  error: ExceptionBase;
}

export interface IDeadLetterQueue {
  addFailedEvent<T extends DomainEvent<any>>(
    event: T,
    error: ExceptionBase
  ): Promise<void>;
  processDeadLetter(failedEvent: FailedEvent<any>): Promise<void>;
  retryAll(): Promise<void>;
}
