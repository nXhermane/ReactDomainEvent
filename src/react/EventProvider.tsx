import { PropsWithChildren, useEffect, useState } from "react";
import { EnhancedEventBus } from "../EnhancedEventBus";
import {
  EventProcessingState,
  EventProcessingStateObserver,
} from "../interfaces/EventProcessingStateManager";
import {  InstanceManager } from "../shared/InstanceManager";
import { Constants } from "../constants/constants";
import { EventProcessingStateManager } from "../EventProcessingStateManager";
import React from "react";
import { EventContext } from "./EventContext";
import { Constructor } from "../types";

const getEventBusGetterFunc = (
  eventBusKey?: string | Constructor<EnhancedEventBus>
): (() => EnhancedEventBus) => {
  return () =>
    InstanceManager.resolve(eventBusKey || Constants.eventBusDefaultKey);
};

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
export interface EventProviderProps extends PropsWithChildren {
  eventBusKey?: string | Constructor<EnhancedEventBus>;
}

export const EventProvider: React.FC<EventProviderProps> = ({
  eventBusKey,
  children,
}) => {
  const [eventProcessingState, setEventProcessingState] = useState<
    EventProcessingState[]
  >([]);
  const observer = new EventContextProcessingStateObserver(
    (eventState: EventProcessingState[]) => {
      setEventProcessingState(eventProcessingState);
    }
  );
  const getEventBus = getEventBusGetterFunc(eventBusKey);
  useEffect(() => {
    EventProcessingStateManager.getInstance().subscribe(observer);
    return () => {
      EventProcessingStateManager.getInstance().unsubscribe(observer);
    };
  }, [eventBusKey]);
  return (
    <EventContext.Provider
      value={{ getEventBus, eventProcessingState: eventProcessingState }}
    >
      {children}
    </EventContext.Provider>
  );
};
