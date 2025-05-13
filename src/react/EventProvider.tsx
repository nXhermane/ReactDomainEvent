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
    EventManagerConfig {
  // Ajout de la prop pour le composant de chargement
  LoadingComponent?: React.ComponentType<any> | null;
}

export const EventProvider: React.FC<EventProviderProps> = ({
  children,
  enableMonitoringSystem,
  enableStateManagement,
  eventBusKey = Constants.eventBusDefaultKey,
  maxAttempts,
  maxDelay,
  maxEventOnDQL,
  enableRetrySystem,
  onDeadLetter,
  LoadingComponent = null, // Valeur par défaut
}) => {
  // Utilisation de useState pour forcer le re-rendu une fois l'eventBus initialisé
  const [isInitialized, setIsInitialized] = React.useState(false);
  const eventBus = React.useRef<EnhancedEventBus | null>(null);
  const [eventProcessingState, setEventProcessingState] = React.useState<
    EventProcessingState[]
  >([]);

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

  // Initialisation synchrone de l'EventBus
  React.useEffect(() => {
    try {
      if (!DomainEventrix.getInstanceManager().has(eventBusKey)) {
        DomainEventrix.create({
          eventBusKey,
          enableMonitoringSystem,
          maxAttempts,
          maxEventOnDQL,
          maxDelay,
          onDeadLetter,
          enableRetrySystem,
        });
      }

      eventBus.current = DomainEventrix.get(eventBusKey);
      setIsInitialized(true);

      if (enableStateManagement) {
        DomainEventrix.addEventProcessingStateManager(eventBusKey);
        DomainEventrix.getEventProcessingStateManagerByEventBusKey(eventBusKey)?.subscribe(observer);
      }

      return () => {
        if (enableStateManagement) {
          DomainEventrix.getEventProcessingStateManagerByEventBusKey(eventBusKey)?.unsubscribe(observer);
        }
      };
    } catch (error) {
      console.error('Failed to initialize EventBus:', error);
      throw error;
    }
  }, [eventBusKey, enableStateManagement]);

  // Protection contre le rendu avant initialisation
  if (!isInitialized || !eventBus.current) {
    return LoadingComponent ? <LoadingComponent /> : null;
  }

  return (
    <EventContext.Provider
      value={{
        eventBus: eventBus.current,
        eventProcessingState,
      }}
    >
      {children}
    </EventContext.Provider>
  );
};
