import { useEffect } from "react";
import { EventProcessingState } from "../../interfaces/EventProcessingStateManager";
import { useEventContext } from "./useEventContext";

export function useEventProcessingState(
  onStateChange?: (state: EventProcessingState[]) => void
) {
  const { eventProcessingState } = useEventContext();

  useEffect(() => {
    if (onStateChange) onStateChange(eventProcessingState);
  }, [onStateChange, eventProcessingState]);
  return eventProcessingState;
}
