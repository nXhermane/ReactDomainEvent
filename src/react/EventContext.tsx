import React from "react";
import { EventProcessingState } from "../addons/interfaces/EventProcessingStateManager";
import { IEventBus } from "../core/interface /EventBus";

export interface EventContextValue {
  /**
   * @property eventProssessingState
   * @description Contain the Executing DomainEvent State and Insights
   */
  eventProcessingState: EventProcessingState[];
  /**
   * @property eventBus
   * @description Give access to specific EventBus
   */
  eventBus: IEventBus
}

export const EventContext = React.createContext<EventContextValue>(
  {} as EventContextValue
);
