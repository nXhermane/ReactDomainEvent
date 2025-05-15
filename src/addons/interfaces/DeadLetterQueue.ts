import { DomainEvent } from "../../core/DomainEvent";
import { DomainExceptionBase } from "../../errors/ExceptionBase";
import { EventData } from "../../core/interface /DomainEvent";

export interface FailedEvent<T extends DomainEvent<any>> {
  event: T;
  failedHandlersData: FailedHandlerData[];
}
export type FailedEventSerialize = {
  event: string;
  failedHandlersData: string[]
};

export type FailedHandlerData = {
  id: string;
  name: string;
  error: DomainExceptionBase;
};

export interface IDeadLetterQueue {
  addFailedEvent<T extends DomainEvent<any>>(
    event: T,
    failedHandlerData: FailedHandlerData
  ): Promise<void>;
  processDeadLetter(failedEvent: FailedEvent<any>): Promise<void>;
  retryAll(): Promise<void>;
  getFailedEvent<DataType extends EventData, T extends DomainEvent<DataType>>(
    eventId: string
  ): FailedEvent<T> | undefined;
}
