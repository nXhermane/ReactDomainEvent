import { DomainEvent } from "../DomainEvent";
import { EventHandler } from "../main";
import { EventMetadata } from "./DomainEvent";
import { EventHandlerMetaData } from "./EventHandler";

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
