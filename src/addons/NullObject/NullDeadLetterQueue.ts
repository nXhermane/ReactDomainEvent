import { Config } from "../../constants/Config";
import { DomainEvent } from "../../core/DomainEvent";
import {
  FailedEvent,
  FailedHandlerData,
  IDeadLetterQueue,
} from "../interfaces/DeadLetterQueue";
import { EventData } from "../../core/interface /DomainEvent";

export class NullDeadLetterQueue implements IDeadLetterQueue {
  async addFailedEvent<T extends DomainEvent<any>>(
    event: T,
    failedHandlerData: FailedHandlerData
  ): Promise<void> {
    if (Config.mode === "debug")
      console.warn(
        this.constructor.name,
        "addFailedEvent called with arguments:",
        event.serialize(),
        failedHandlerData
      );
  }

  async processDeadLetter(failedEvent: FailedEvent<any>): Promise<void> {
    if (Config.mode === "debug")
      console.warn(
        this.constructor.name,
        "proceessDeadLette called with arguments:",
        failedEvent
      );
  }
  async retryAll(): Promise<void> {
    if (Config.mode === "debug")
      console.warn(this.constructor.name, "retryAll called");
  }

  getFailedEvent<DataType extends EventData, T extends DomainEvent<DataType>>(
    eventId: string
  ): FailedEvent<T> | undefined {
    return undefined;
  }
}
