import { DomainEvent } from "./DomainEvent";
import { EventHandler } from "./EventHandler";
import { DomainEventState, EventMetadata } from "./interfaces/DomainEvent";
import { EventHandlerMetaData, HandlerState } from "./interfaces/EventHandler";
import {
  EventProcessingState,
  EventProcessingStateObserver,
  IEventProcessingStateManager,
} from "./interfaces/EventProcessingStateManager";


interface ArchiEventProcessingState extends EventProcessingState {
  child: EventProcessingState[];
}

export class EventProcessingStateManager
  implements IEventProcessingStateManager
{
  private static instance: EventProcessingStateManager | null = null;
  private observers: EventProcessingStateObserver[] = [];

  private constructor() {}
  subscribe(observer: EventProcessingStateObserver): void {
    this.observers.push(observer);
  }
  unsubscribe(observer: EventProcessingStateObserver): void {
    this.observers = this.observers.filter((obs) => obs !== observer);
  }
  notify(): void {
    for (const observer of this.observers) {
      observer.update(Array.from(this.state.values()));
    }
  }

  static getInstance(): EventProcessingStateManager {
    if (!EventProcessingStateManager.instance)
      EventProcessingStateManager.instance = new EventProcessingStateManager();
    return EventProcessingStateManager.instance;
  }

  private state: Map<string, EventProcessingState> = new Map();
  private archiState: Map<string, ArchiEventProcessingState> = new Map();

  private setState(
    eventId: string,
    eventProcessingState: EventProcessingState
  ) {
    this.state.set(eventId, eventProcessingState);
    this.notify();
  }
  /**
   * Ajoute un nouvel événement à l'état s'il n'existe pas déjà.
   * @param event - L'événement de domaine à ajouter.
   */
  addEvent(event: DomainEvent<any>): void {
    const eventMetaData = event.getMetaData();
   
    if (!this.state.has(eventMetaData.eventId)) {
      const eventProcessingState: EventProcessingState = {
        domainEventMetadata: eventMetaData,
        handlers: [],
        status: {
          totalHandlers: 0,
          completedHandlers: 0,
          executingHandlers: 0,
          failedHandlers: 0,
        },
      };
      this.setState(eventMetaData.eventId, eventProcessingState);
    } else {
      const eventProcessingState: EventProcessingState = this.state.get(
        eventMetaData.eventId
      )!;
      eventProcessingState.domainEventMetadata = eventMetaData;
      this.setState(eventMetaData.eventId, eventProcessingState);
    }
  }

  /**
   * Ajoute un handler pour un événement spécifique et met à jour l'état de l'événement.
   * @param event - L'événement de domaine associé au handler.
   * @param handler - Le handler à ajouter.
   */
  addHandler(event: DomainEvent<any>, handler: EventHandler<any, any>): void {
    this.addEvent(event);
    const handlerMetadata = handler.getMetadata();
    const eventProcessingState = this.state.get(
      event.getId()
    )!
    const updatedState = this.addOrUpdateHandlerMetadata(
      eventProcessingState,
      handlerMetadata
    );

    this.updateEventProcessingStatus(event.getId(), updatedState);
  }

  /**
   * Met à jour les métadonnées d'un handler dans l'état de traitement d'un événement.
   * Si le handler existe déjà, ses métadonnées sont mises à jour, sinon il est ajouté.
   * @param state - L'état actuel de traitement de l'événement.
   * @param handlerMetadata - Les métadonnées du handler à ajouter ou mettre à jour.
   * @returns L'état de traitement mis à jour.
   */
  private addOrUpdateHandlerMetadata(
    state: EventProcessingState,
    handlerMetadata: EventHandlerMetaData
  ): EventProcessingState {
    const handlerIndex = state.handlers.findIndex(
      (handlerData) => handlerData.handlerId === handlerMetadata.handlerId
    );

    if (handlerIndex !== -1) {
      state.handlers[handlerIndex] = handlerMetadata;
    } else {
      state.handlers.push(handlerMetadata);
    }

    return state;
  }

  /**
   * Met à jour l'état d'un handler pour un événement donné.
   * @param eventId - L'ID de l'événement de domaine.
   * @param handlerMetadata - Les métadonnées mises à jour du handler.
   */
  updateHandlerState(
    eventId: string,
    handlerMetadata: EventHandlerMetaData
  ): void {
    const eventProcessingState = this.state.get(
      eventId
    ) as EventProcessingState;
    const updatedState = this.addOrUpdateHandlerMetadata(
      eventProcessingState,
      handlerMetadata
    );

    this.updateEventProcessingStatus(eventId, updatedState);
  }

  /**
   * Calcule et met à jour l'état de traitement d'un événement en examinant ses handlers.
   * Stocke l'état dans les métadonnées de l'événement pour un accès futur.
   * @param eventId - L'ID de l'événement de domaine.
   */
  private updateEventProcessingStatus(
    eventId: string,
    eventProcessingState: EventProcessingState
  ): void {
    if (eventProcessingState) {
      eventProcessingState.status = this.calculateEventProcessingStatus(
        eventProcessingState.handlers
      );
      const hasProcessing = eventProcessingState.status.executingHandlers > 0;
      const hasFailed = eventProcessingState.status.failedHandlers > 0;
      const hasCompleted =
        eventProcessingState.status.completedHandlers ===
          eventProcessingState.status.totalHandlers &&
        !hasFailed &&
        !hasProcessing;

      if (hasProcessing)
        eventProcessingState.domainEventMetadata.domainEventState =
          DomainEventState.IsProcessing;
      if (hasFailed)
        eventProcessingState.domainEventMetadata.domainEventState =
          DomainEventState.HasFailed;
      if (hasCompleted)
        eventProcessingState.domainEventMetadata.domainEventState =
          DomainEventState.IsCompleted;

      this.setState(eventId, eventProcessingState);
    }
  }

  /**
   * Détermine l'état de traitement d'un événement en examinant ses handlers.
   * Renvoie des statistiques incluant le nombre total de handlers, ceux terminés,
   * et si au moins un a échoué.
   * @param handlers - Le tableau des métadonnées des handlers à évaluer.
   * @returns Un objet avec l'état des handlers de l'événement.
   */
  private calculateEventProcessingStatus(handlers: EventHandlerMetaData[]): {
    totalHandlers: number;
    completedHandlers: number;
    failedHandlers: number;
    executingHandlers: number;
  } {
    const totalHandlers = handlers.length;
    const completedHandlers = handlers.filter(
      (handler) => handler.handlerState === HandlerState.COMPLETED
    ).length;
    const failedHandlers = handlers.filter(
      (handler) => handler.handlerState === HandlerState.FAILED
    ).length;
    const executingHandlers = handlers.filter(
      (handler) => handler.handlerState === HandlerState.EXECUTING
    ).length;

    return {
      totalHandlers,
      completedHandlers,
      failedHandlers,
      executingHandlers,
    };
  }

  // TODO: Cette methode semble non essentielle pour le moment donc on vera plustart s'il serai utile
  private buildArchiState(): Map<string, ArchiEventProcessingState> {
    const archiStore: Map<string, ArchiEventProcessingState> = new Map();

    // Parcours de tous les événements dans l'état
    for (const eventProcessingState of this.state.values()) {
      const eventMetaData = eventProcessingState.domainEventMetadata;
      // Créer l'entrée pour l'événement dans archiStore s'il n'existe pas déjà
      if (!archiStore.has(eventMetaData.eventId)) {
        archiStore.set(eventMetaData.eventId, {
          ...eventProcessingState,
          child: [], // Initialiser la liste des enfants
        });
      }

      // Si l'événement a un parent, l'ajouter à la structure du parent
      if (eventMetaData.parentId) {
        this.addParentToHierarchy(
          eventMetaData,
          archiStore,
          eventProcessingState
        );
      }
    }

    return archiStore;
  }

  /**
   * Ajoute un parent à la hiérarchie des événements.
   * Cela gère les relations parents multiples en remontant la chaîne des parents.
   */
  private addParentToHierarchy(
    eventMetaData: EventMetadata,
    archiStore: Map<string, ArchiEventProcessingState>,
    eventProcessingState: EventProcessingState
  ) {
    const parentId = eventMetaData.parentId!;

    if (!archiStore.has(parentId)) {
      // Si le parent n'existe pas encore, l'ajouter avec l'événement actuel comme enfant
      const parentEvent = this.state.get(parentId);
      if (parentEvent) {
        archiStore.set(parentId, {
          ...parentEvent,
          child: [archiStore.get(eventMetaData.eventId)!],
        });
      }
    } else {
      // Sinon, ajouter l'événement actuel à la liste des enfants du parent
      const parentState = archiStore.get(parentId);
      if (parentState) {
        parentState.child.push(archiStore.get(eventMetaData.eventId)!);
      }
    }

    // Vérifier si le parent a lui-même un parent
    if (this.state.get(parentId)?.domainEventMetadata.parentId) {
      const grandParentId =
        this.state.get(parentId)?.domainEventMetadata.parentId!;
      this.addParentToHierarchy(
        this.state.get(parentId)!.domainEventMetadata,
        archiStore,
        eventProcessingState
      );
    }
  }

  private domainEventHaveParent(domainEventMetaData: EventMetadata): boolean {
    return domainEventMetaData.parentId != undefined;
  }
  private domainEventIsRegistered(
    parendId: string,
    archiStore: Map<string, ArchiEventProcessingState>
  ): boolean {
    return archiStore.has(parendId);
  }
}
