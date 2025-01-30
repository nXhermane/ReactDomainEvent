import { Constants } from "../../constants/constants";
import { DomainEventrix } from "../../DomainEventrix";
import { EventHandler } from "../../core/EventHandler";
import { HandlerState } from "../../core/interface /EventHandler";
/**
 * Decorateur utilisé en interne pour actualiser l'etat des handlers afin de recuperer les metrics lie a l'execution des handlers et au domain event
 * @returns
 */
export function HandlerStateDecorator() {
  
  return function (
    target: any,
    propertyKey: string,
    descriptor: PropertyDescriptor
  ) {
    const originalMethod = descriptor.value;

    descriptor.value = function (this: EventHandler<any, any>, ...args: any[]) {
      const eventBusKey = Reflect.getMetadata(
        Constants.handlerEventBusMetaDataKey,
        this.constructor
      );
      const eventProcessingInstance =
        DomainEventrix.getEventProcessingStateManagerByEventBusKey(eventBusKey);
      eventProcessingInstance?.addHandler(args[0], this);
      const updateState = (state: HandlerState) => {
        this.setHandlerState(state);
        eventProcessingInstance?.updateHandlerState(
          args[0]?.getId(),
          this.getMetadata()
        );
      };
      updateState(HandlerState.EXECUTING);
      try {
        const result = originalMethod.apply(this, args);
        if (result instanceof Promise) {
          return result
            .then(() => updateState(HandlerState.COMPLETED))
            .catch((error) => {
              updateState(HandlerState.FAILED);
              throw error;
            });
        } else {
          updateState(HandlerState.COMPLETED);
        }
      } catch (error) {
        updateState(HandlerState.FAILED);
        throw error;
      }
    };
    return descriptor;
  };
}
