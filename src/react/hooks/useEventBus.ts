import { EnhancedEventBus } from "../../EnhancedEventBus";
import { useEventContext } from "./useEventContext";

export function useEventBus(): EnhancedEventBus {
  const { getEventBus } = useEventContext()
  return getEventBus();
}
