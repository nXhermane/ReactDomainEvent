import React from "react";
import { EnhancedEventBus } from "../EnhancedEventBus/EnhancedEventBus";
import { EventProcessingState } from "../addons/interfaces/EventProcessingStateManager";

export interface EventContextValue {
  //getEventBus(): EnhancedEventBus;
  /**
   * @property eventProssessingState
   * @description Contain the Executing DomainEvent State and Insights
   */
  eventProcessingState: EventProcessingState[];
  /**
   * @property eventBus
   * @description Give access to specific EventBus
   */
  eventBus: EnhancedEventBus
}

export const EventContext = React.createContext<EventContextValue>(
  {} as EventContextValue
);
