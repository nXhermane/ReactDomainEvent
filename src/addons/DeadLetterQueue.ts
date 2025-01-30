import { Constants } from "../constants/constants";
import { DomainEvent } from "../core/DomainEvent";
import { ExceptionBase } from "../errors/ExceptionBase";
import {
  FailedEvent,
  FailedEventSerialize,
  FailedHandlerData,
  IDeadLetterQueue,
} from "./interfaces/DeadLetterQueue";
import { EventData } from "../core/interface /DomainEvent";

export class DeadLetterQueue implements IDeadLetterQueue {
  private readonly store: Map<string, FailedEvent<any>> = new Map();
  private readonly maxSize: number;

  constructor(
    private readonly onDeadLetter: (event: FailedEvent<any>) => Promise<void>,
    maxSize: number = Constants.maxEventOnDQL
  ) {
    this.maxSize = maxSize;
  }

  async addFailedEvent<T extends DomainEvent<any>>(
    event: T,
    failedHandlerData: FailedHandlerData
  ): Promise<void> {
    //const failedEvent: FailedEvent<T> = { event,failedHandlersData, error };

    // Si la DLQ est pleine, traiter le plus ancien événement
    if (this.store.size >= this.maxSize) {
      const oldestKey = Array.from(this.store.keys())[0];
      await this.processDeadLetter(this.store.get(oldestKey)!);
      this.store.delete(oldestKey);
    }
    // Verifier si cet event etait deja present dans la DLQ
    if (this.store.has(event.getId())) {
      const failedEvent = this.store.get(event.getId())!;
      failedEvent.failedHandlersData.push(failedHandlerData);
      this.store.set(event.getId(), failedEvent);
      await this.processDeadLetter(failedEvent);
    } else {
      const failedEvent = {
        event,
        failedHandlersData: [failedHandlerData],
      };
      this.store.set(event.getId(), failedEvent);
      await this.processDeadLetter(failedEvent);
    }
  }

  async processDeadLetter(failedEvent: FailedEvent<any>): Promise<void> {
    // Implémenter la logique de traitement (par exemple, stocker en base de données,affichage a l'utilisateur pour un retry manuel)
    await this.onDeadLetter(failedEvent);
  }

  async retryAll(): Promise<void> {
    const events = Array.from(this.store.values());
    this.store.clear();
    return Promise.all(events.map((e) => this.onDeadLetter(e))).then();
  }
  getFailedEvent<DataType extends EventData, T extends DomainEvent<DataType>>(
    eventId: string
  ): FailedEvent<T> | undefined {
    return this.store.get(eventId);
  }
  serialize(): string {
    const store = JSON.stringify(
      Array.from(this.store.values()).map((failedEvent) => {
        const failedEventSerialize = {
          event: failedEvent.event.serialize(),
          failedHandlersData: failedEvent.failedHandlersData.map(
            (failedHandlerData) =>
              JSON.stringify({
                id: failedHandlerData.id,
                name: failedHandlerData.name,
                error: failedHandlerData.error.toSerialized(),
              })
          ),
        };
      })
    );
    const maxSize = this.maxSize;
    return JSON.stringify({ store, maxSize });
  }

  static deserialize(data: any) {
    const { store, maxSize } = JSON.parse(data);
    const newStore = JSON.parse(store).map(
      (failedEventSerelized: FailedEventSerialize) => {
        const derializedEvent = DomainEvent.deserialize(
          failedEventSerelized.event
        );
        const failedHandlersData = failedEventSerelized.failedHandlersData.map(
          (failedHandler) => {
            const failedHandlerData = JSON.parse(failedHandler);
            return {
              id: failedHandlerData.id as string,
              name: failedHandlerData.name as string,
              error: ExceptionBase.toDeserialized(failedHandlerData.error),
            };
          }
        );
        return {
          event: derializedEvent,
          failedHandlersData,
        };
      }
    ) as FailedEvent<any>[];
    return { maxSize, store: newStore };
  }
}
