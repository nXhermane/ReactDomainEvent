import React, { useRef } from "react";
import {
  EventProcessingState,
  EventProcessingStateObserver,
} from "../addons/interfaces/EventProcessingStateManager";
import { EventContext } from "./EventContext";
import { DomainEventrix, EventManagerConfig } from "../DomainEventrix";
import { Constants } from "../constants/constants";
import { EnhancedEventBus } from "../EnhancedEventBus/EnhancedEventBus";

class EventContextProcessingStateObserver
  implements EventProcessingStateObserver
{
  constructor(
    private onEventPocessingStateChange: (
      eventState: EventProcessingState[]
    ) => void
  ) {}
  update(state: EventProcessingState[]): void {
    this.onEventPocessingStateChange(state);
  }
}

export interface EventProviderProps
  extends React.PropsWithChildren,
    EventManagerConfig {}

export const EventProvider: React.FC<EventProviderProps> = ({
  children,
  enableMonitoringSystem,
  enableStateManagement,
  eventBusKey,
  maxAttempts,
  maxDelay,
  maxEventOnDQL,
  enableRetrySystem,
  onDeadLetter,
}) => {
  // State
  const [eventProcessingState, setEventProcessingState] = React.useState<
    EventProcessingState[]
  >([]);
   console.log("Provider Entering")
  const eventBus = useRef<EnhancedEventBus | null>(null);


  const observer = React.useMemo<EventProcessingStateObserver>(
    () =>
      new EventContextProcessingStateObserver(
        (eventState: EventProcessingState[]) =>
          setEventProcessingState((postEventState: EventProcessingState[]) => {
            return [...postEventState, ...eventState];
          })
      ),
    []
  );

  React.useEffect(() => {
    console.log("UseEffect Munt")
    if (
      !DomainEventrix.getInstanceManager().has(
        eventBusKey || Constants.eventBusDefaultKey
      )
    ) {
      console.log("EventBus Creation ", eventBus,eventBusKey,DomainEventrix.get(eventBusKey||Constants.eventBusDefaultKey))
      DomainEventrix.create({
        eventBusKey: eventBusKey || Constants.eventBusDefaultKey,
        enableMonitoringSystem,
        maxAttempts,
        maxEventOnDQL,
        maxDelay,
        onDeadLetter,
        enableRetrySystem,
      });
    }
    if (eventBus.current === null) {
      console.log("Assignement ", eventBus,eventBusKey,DomainEventrix.get(eventBusKey||Constants.eventBusDefaultKey))
      eventBus.current = DomainEventrix.get(
        eventBusKey || Constants.eventBusDefaultKey
      );
    }
    if (enableStateManagement) {
      DomainEventrix.addEventProcessingStateManager(eventBusKey);
      DomainEventrix.getEventProcessingStateManagerByEventBusKey(
        eventBusKey
      )?.subscribe(observer);
    }

    return () => {
      if (enableStateManagement)
        DomainEventrix.getEventProcessingStateManagerByEventBusKey(
          eventBusKey
        )?.unsubscribe(observer);
    };
  }, [eventBusKey, enableStateManagement]);
  return (
    <EventContext.Provider
      value={{
        eventBus: eventBus.current as EnhancedEventBus,
        eventProcessingState: eventProcessingState,
      }}
    >
      {children}
    </EventContext.Provider>
  );
};
