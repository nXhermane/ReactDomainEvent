import React from "react";
import { EventContext } from "../EventContext";

export function useEventContext() {
  const context = React.useContext(EventContext);
  if (!context)
    throw new Error("EventContext must be used within an EventProvider.");
  return context;
}
