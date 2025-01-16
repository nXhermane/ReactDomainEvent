import { useContext } from "react";
import { EventContext ,EventContextValue} from "../EventContext";

export function useEventContext() {
  const context = useContext(EventContext);
  if (!context)
    throw new Error("EventContext must be used within an EventProvider.");
  return context;
}
