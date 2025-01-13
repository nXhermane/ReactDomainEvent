import {
  EventData,
  EventHandlingState,
  IDomainEvent,
} from "./interfaces/DomainEvent";
import { IEventBus } from "./interfaces/EventBus";
import { EventHandler } from "./EventHandler";
import { DomainEvent } from "./DomainEvent";
import Stack from "../utils/Stack";

export class EventBus implements IEventBus {
  private static instance: EventBus | null = null;
  private eventQueue: Array<{ event: DomainEvent<any>; timestamp: number }> =
    [];
  private handlers: Map<string, Set<EventHandler<any, any>>> = new Map();
  private processQueue: Stack<DomainEvent<any>> = new Stack();
  private isProcessing: boolean = false;
  private parentChildProcessing: boolean = false;
  private constructor() {}

  static getInstance(): EventBus {
    if (EventBus.instance === null) EventBus.instance = new EventBus();
    return EventBus.instance as EventBus;
  }

  publish<DataType extends EventData, T extends DomainEvent<DataType>>(
    event: T
  ): void {
    if (this.checkEventEmissionInHandler()) {
      const activeEvent = this.processQueue.peek();
      event.setParentId(activeEvent?.getId() as string);
      this.setEventState(activeEvent?.getId() as string,EventHandlingState.WAITING)
    }
    this.eventQueue.push({
      event: event,
      timestamp: Date.now(),
    });
  }
  async publishAndDispatchImmediate<
    DataType extends EventData,
    T extends DomainEvent<DataType>
  >(event: T): Promise<void> {
    this.publish(event);
    await this.dispatchEvent<T>(event);
  }

  suscriber<DataType extends EventData, T extends IDomainEvent<DataType>>(
    handler: EventHandler<DataType, T>
  ): void {
    if (this.handlers.has(handler.getEventName())) {
      this.handlers.set(
        handler.getEventName(),
        new Set<EventHandler<DataType, T>>()
      );
    }
    const handlers =
      this.handlers.get(handler.getEventName()) ||
      new Set<EventHandler<DataType, T>>();
    handlers.add(handler);
    this.handlers.set(handler.getEventName(), handlers);
  }

  private async dispatchEvent<T extends DomainEvent<any>>(
    event: T
  ): Promise<void> {
    if(this.isProcessing && !this.parentChildProcessing) {
      this.setEventState(event.getId(),EventHandlingState.ON)
      event.setHandlerState(EventHandlingState.ON)
      this.setEventState(event.getParentId(),EventHandlingState.WAITING)
      this.parentChildProcessing = true
    }else if(this.isProcessing && this.parentChildProcessing) {
      this.setEventState(event.getId(),EventHandlingState.ON)
      event.setHandlerState(EventHandlingState.ON)
    }else {
      event.setHandlerState(EventHandlingState.ON)
      this.setEventState(event.getId(),EventHandlingState.ON)
      this.isProcessing = true
    }
    this.processQueue.push(event);

    const eventName = event.getName();
    // Search Event Handler
    const handlers = this.handlers.get(eventName) || new Set();
    await Promise.all(
      Array.from(handlers).map((handler) =>
        this.executeHandler<any, T>(handler, event)
      )
    );
    if(this.isProcessing && this.parentChildProcessing) {
       this.setEventState(event.getId(),EventHandlingState.OFF)
       this.setEventState(event.getParentId(),EventHandlingState.ON)
       this.parentChildProcessing =false
    }else if(this.isProcessing && !this.parentChildProcessing){
      this.setEventState(event.getId(),EventHandlingState.OFF)
      this.isProcessing = false ;
    }
    this.processQueue.pop();
  }
  private async executeHandler<
    DataType extends EventData,
    T extends DomainEvent<DataType>
  >(handler: EventHandler<DataType, T>, event: T): Promise<void> {
    try {
      await Promise.resolve(handler.execute(event));
    } catch (error) {
      console.error("Error executing handler");
    }
  }

  private checkEventEmissionInHandler(): boolean {
    return this.processQueue.size() > 0;
  }
  private handleEventEmittedInHandler<
    DataType extends EventData,
    T extends DomainEvent<DataType>
  >(event: T) {}

  private getActivedEvent(
    state: EventHandlingState = EventHandlingState.ON
  ): DomainEvent<any> {
    return this.processQueue.getFirst((item: DomainEvent<any>) => {
      return item.getState() === state;
    }) as DomainEvent<any>;
  }

  private setEventState(eventId: string, state: EventHandlingState) {
    this.eventQueue.forEach((queueEvent) => {
      if (queueEvent.event.metadata.eventId === eventId)
        queueEvent.event.metadata.handlerState = state;
    });
  }
}
