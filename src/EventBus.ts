import { EventData, IDomainEvent } from "./interfaces/DomainEvent";
import { IEventBus } from "./interfaces/EventBus";
import { EventHandler } from "./EventHandler";
import { DomainEvent } from "./DomainEvent";
import Stack from "../utils/Stack";

type EventQueueObject = { event: DomainEvent<any>; timestamp: number };
export abstract class EventBus implements IEventBus {
  //private static instance: EventBus | null = null;
  private eventQueue: Array<EventQueueObject> = [];
  private handlers: Map<string, Set<EventHandler<any, any>>> = new Map();
  private queueStack: Stack<DomainEvent<any>> = new Stack();
  constructor() {}

  // static getInstance(): EventBus {
  //   if (EventBus.instance === null) EventBus.instance = new EventBus();
  //   return EventBus.instance as EventBus;
  // }

  publish<DataType extends EventData, T extends DomainEvent<DataType>>(
    event: T
  ): void {
    // Verifier si l'event actuelle est emise lors de l'execution d'un handler et si oui , on a lui attribut un parent
    if (this.checkEventEmissionInHandler()) {
      const activeEvent = this.queueStack.peek();
      event.setParentId(activeEvent?.getId() as string);
    }
    // Ajouter l'event a la file d'attente
    this.eventQueue.push({
      event: event,
      timestamp: Date.now(),
    });
  }
  async publishAndDispatchImmediate<
    DataType extends EventData,
    T extends DomainEvent<DataType>
  >(event: T): Promise<void> {
    // Publier l'event
    this.publish(event);
    // Dispatcher l'evenement a meme temps qu'il est publier
    await this.dispatchEvent<T>(event);
  }

  suscriber<DataType extends EventData, T extends IDomainEvent<DataType>>(
    handler: EventHandler<DataType, T>
  ): void {
    // Verifier s'il existe deja des handlers associés a ce l'event du handler a ajouter
    if (!this.handlers.has(handler.getEventName())) {
      // Creer le container des handlers de cet evenement
      this.handlers.set(
        handler.getEventName(),
        new Set<EventHandler<DataType, T>>()
      );
    }
    // Recuperation et ajout du nouveau handler a la liste des handlers de cet event
    const handlers = this.handlers.get(handler.getEventName())!;
    handlers.add(handler);
    this.handlers.set(handler.getEventName(), handlers);
  }
  public dispatch(eventName: string) {
    // Rechercher et Trier les events dans la file d'attente ayant ce nom
    const eventObjects = this.sortEventByTimestamps(
      this.searchEventWithEventName(eventName)
    );
    // Boucler a Travers l'eventObjects pour executer chaque evenement
    for (const { event } of eventObjects) {
      // TODO : A desactiver apres le developpement
      this.dispatchEvent(event)
        .then(() => {
          console.log("Fin d'execution de l'evenements", event.getName());
        })
        .catch((error) => {
          console.error(
            "[Error]: erreur lors de l'execution de l'evenement : ",
            event.getName(),
            error
          );
        });
    }
  }
  private async dispatchEvent<T extends DomainEvent<any>>(
    event: T
  ): Promise<void> {
    // Ajouter l'evenement a la pile d'execution des handlers (Stack QueueStack)
    this.queueStack.push(event);
    const eventName = event.getName();
    // Rechercher les handlers associés a l'evenement par son nom
    const handlers = this.handlers.get(eventName) || new Set();
    // Execution des handlers
    await Promise.all(
      Array.from(handlers).map((handler) =>
        this.executeHandler<any, T>(handler, event)
      )
    );
    // Supprimer l'evenement de la file d'attente (eventQueue )
    this.deleteEvent(event);
    // Supprimer l'evenement de la pile (Stack queueStack)
    this.queueStack.pop();
  }

  protected async executeHandler<
    DataType extends EventData,
    T extends DomainEvent<DataType>
  >(handler: EventHandler<DataType, T>, event: T): Promise<void> {
    try {
      await Promise.resolve(handler._internalExecute(event));
    } catch (error) {
      console.error("Error executing handler");
    }
  }

  private deleteEvent<
    DataType extends EventData,
    T extends DomainEvent<DataType>
  >(event: T) {
    const eventIndex = this.eventQueue.findIndex(
      (eventObject) => event.getId() === eventObject.event.getId()
    );
    if (eventIndex != -1) {
      this.eventQueue.splice(eventIndex, 1);
    }
  }

  private checkEventEmissionInHandler(): boolean {
    return this.queueStack.size() > 0;
  }
  private sortEventByTimestamps(
    eventObjects: EventQueueObject[]
  ): EventQueueObject[] {
    // Trier du plus grand au plus petit les evenements pour avoir le plus anciens en debut de liste :
    // Implication : Le plus ancien sera donc le premier a executer
    return eventObjects.sort(
      (eventObject1, eventObject2) =>
        eventObject2.timestamp - eventObject1.timestamp
    );
  }
  private searchEventWithEventName(eventName: string): EventQueueObject[] {
    const eventQueueObjects = this.eventQueue.filter(
      (eventObject) => eventObject.event.getName() === eventName
    );
    return eventQueueObjects;
  }
  protected seachHandlerByNameOrId<
    DataType extends EventData,
    T extends DomainEvent<DataType>
  >(name: string, id: string): EventHandler<DataType, T>[] {
    // Recuperer tous les handlers dans un array
    const handlers = Array.from(this.handlers.values())
      .map((handlerSet) => {
        const eventhandlers = Array.from(handlerSet);
        return eventhandlers;
      })
      .flat();
    const filteredHandler = handlers.filter(
      (handler) => handler.getId() === id || handler.getName() === name
    );
    return filteredHandler;
  }
}
