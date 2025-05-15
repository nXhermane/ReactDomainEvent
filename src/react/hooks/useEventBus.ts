import { IEventBus } from "../../core/interface /EventBus";
import { useEventContext } from "./useEventContext";

export function useEventBus(): IEventBus {
  const { eventBus } = useEventContext()
  return eventBus
}
