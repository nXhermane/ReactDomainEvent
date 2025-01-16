import { DomainEvent } from "../DomainEvent";
import { EventHandler } from "../EventHandler";
import { EventMetadata } from "./DomainEvent";
import { EventHandlerMetaData } from "./EventHandler";


/**
 * @interface DomainEventProcessingState
 *
 * Représente l'état de chaque événement de domaine émis avec ses handlers associés.
 * Stocke uniquement les métadonnées des événements et des handlers.
 * Gère le tableau des handlers pour déterminer si tous sont terminés, mettant à jour
 * l'état de l'événement de domaine de "processing" à "completed".
 * Si au moins un handler échoue, l'état de l'événement devient "hasFailed".
 */

export interface EventProcessingState {
  domainEventMetadata: EventMetadata;
  handlers: EventHandlerMetaData[];
  status: {
    totalHandlers: number;
    completedHandlers: number;
    executingHandlers: number;
    failedHandlers: number;
  };
}
export interface EventProcessingStateObserver {
  update(state: EventProcessingState[]): void;
}
export interface IEventProcessingStateManager {
  addEvent(event: DomainEvent<any>): void;
  addHandler(event: DomainEvent<any>, handler: EventHandler<any, any>): void;
  updateHandlerState(eventId: string,handlerMetadata: EventHandlerMetaData): void;
  subscribe(observer: EventProcessingStateObserver): void;
  unsubscribe(observer: EventProcessingStateObserver): void;
  notify(): void;
}
