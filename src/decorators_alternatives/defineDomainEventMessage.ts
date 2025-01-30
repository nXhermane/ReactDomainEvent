import { DomainEventMessage } from "../decorators/DomainEventMessage";

export function defineDomainEventMessage(
  target: Function,
  message: string,
  isVisibleOnUI: boolean = false
) {
  DomainEventMessage(message, isVisibleOnUI)(target);
}
