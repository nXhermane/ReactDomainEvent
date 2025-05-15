import { Constants } from "../constants/constants";
import { EventType, IEventBus } from "../core/interface /EventBus";
import { Constructor } from "../types/types";

export function bindEventHandler(
  target: Function,
  eventType: EventType,
  eventBusKey:
    | string
    | Constructor<IEventBus> = Constants.eventBusDefaultKey
) {
  const eventName = typeof eventType === "string" ? eventType : eventType.name;
  //Enregistrer le Event Type dans les metadata de la classe pour y acceder dans la  methode getEventName
  Reflect.defineMetadata(Constants.handlerMetaDataKey, eventName, target);
  //Enregistrer la cle de l'event bus utilisé
  Reflect.defineMetadata(
    Constants.handlerEventBusMetaDataKey,
    eventBusKey,
    target
  );
}
