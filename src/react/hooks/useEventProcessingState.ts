import React from "react";
import { EventProcessingState } from "../../addons/interfaces/EventProcessingStateManager";
import { useEventContext } from "./useEventContext";

export function useEventProcessingState(
  onStateChange?: (state: EventProcessingState[]) => void
) {
  const { eventProcessingState } = useEventContext();

  React.useEffect(() => {
    if (onStateChange) onStateChange(eventProcessingState);
  }, [onStateChange, eventProcessingState]);
  return eventProcessingState;
}
