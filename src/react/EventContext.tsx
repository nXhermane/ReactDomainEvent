import { createContext } from "react";
import { EnhancedEventBus } from "../EnhancedEventBus";
import { EventProcessingState } from "../interfaces/EventProcessingStateManager";

export interface EventContextValue {
  getEventBus(): EnhancedEventBus;
  eventProcessingState: EventProcessingState[];
}

export const EventContext = createContext<EventContextValue>(
  {} as EventContextValue
);
