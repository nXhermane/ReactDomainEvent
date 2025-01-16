import { DomainEvent } from "../../DomainEvent";
import { EventData } from "../../interfaces/DomainEvent";
import { EventType } from "../../type";
import { useEventBus } from "./useEventBus";

export function useEventBusMethode() {
  const eventBus = useEventBus();
  const publish = <DataType extends EventData, T extends DomainEvent<DataType>>(
    event: T
  ) => {
    eventBus.publish(event);
  };
  const publishImmediate = async <
    DataType extends EventData,
    T extends DomainEvent<DataType>
  >(
    event: T
  ) => {
    await eventBus.publishAndDispatchImmediate(event);
  };

  const dispatch = <T extends EventData>(eventType: EventType<T>) => {
    eventBus.dispatch<T>(eventType);
  };

  return { publish, publishImmediate, dispatch };
}
