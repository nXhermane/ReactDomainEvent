import { DomainEvent } from "../../core/DomainEvent";
import { EventData, IDomainEvent } from "../../core/interface /DomainEvent";
import { EventType } from "../../core/interface /EventBus";
import { IEventHandler } from "../../core/interface /EventHandler";
import { useEventBus } from "./useEventBus";

export function useEventBusMethods() {
  const eventBus = useEventBus();
  const publish = <
    DataType extends EventData,
    T extends IDomainEvent<DataType>
  >(
    event: T
  ) => {
    eventBus.publish(event);
  };
  const publishImmediate = async <
    DataType extends EventData,
    T extends IDomainEvent<DataType>
  >(
    event: T
  ) => {
    await eventBus.publishAndDispatchImmediate(event);
  };

  const dispatch = <T extends EventData>(eventType: EventType<T>) => {
    eventBus.dispatch<T>(eventType);
  };
  const subscribe = <
    DataType extends EventData,
    T extends IDomainEvent<DataType>
  >(
    handler: IEventHandler<DataType, T>
  ) => {
    eventBus.subscribe(handler);
  };
  const unsubscribe = <
    DataType extends EventData,
    T extends IDomainEvent<DataType>
  >(
    handler: IEventHandler<DataType, T>
  ) => {
    eventBus.unsubscribe(handler);
  };

  return { publish, publishImmediate, dispatch, unsubscribe, subscribe };
}
