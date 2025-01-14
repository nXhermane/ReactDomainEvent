import { Constants } from "./constants/constants";
import { DomainEvent } from "./DomainEvent";
import { ExceptionBase } from "./errors/ExceptionBase";
import { FailedEvent, IDeadLetterQueue } from "./interfaces/DeadLetterQueue";

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
    error: ExceptionBase
  ): Promise<void> {
    const failedEvent: FailedEvent<T> = { event, error };

    // Si la DLQ est pleine, traiter le plus ancien événement
    if (this.store.size >= this.maxSize) {
      const oldestKey = Array.from(this.store.keys())[0];
      await this.processDeadLetter(this.store.get(oldestKey)!);
      this.store.delete(oldestKey);
    }

    this.store.set(event.getId(), failedEvent);
    await this.onDeadLetter(failedEvent);
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
}
