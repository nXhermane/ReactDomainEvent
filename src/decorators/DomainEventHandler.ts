import { EventBus } from "../EventBus";
import {
  DomainEventMessage,
  DomainEventMessageOptions,
} from "./DomainEventMessage";
import { EventHandlerFor } from "./EventHandlerFor";

export function DomainEventHandler(
  eventType: Function,
  messageOptions: Partial<DomainEventMessageOptions>,
  eventBus?: EventBus
) {
  return function (target: Function) {
    DomainEventMessage(
      messageOptions.message || eventType.constructor.name,
      messageOptions.isVisibleOnUI
    )(target);
    if (eventBus) {
     return EventHandlerFor(eventType, eventBus)(target);
    } else {
     return EventHandlerFor(eventType)(target);
    }
  };
}
