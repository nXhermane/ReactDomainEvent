import { EnhancedEventBus } from "../../EnhancedEventBus/EnhancedEventBus";
import { useEventContext } from "./useEventContext";

export function useEventBus(): EnhancedEventBus {
  const { eventBus } = useEventContext()
  return eventBus
}
