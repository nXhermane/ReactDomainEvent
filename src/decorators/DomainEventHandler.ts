import { EventBus } from "../EventBus";
import { Constants } from "../constants/constants";
import { DomainEvent, EventType } from "../type";
import { Constructor } from "../types";

import {
  DomainEventMessage,
  DomainEventMessageOptions,
} from "./DomainEventMessage";
import { EventHandlerFor } from "./EventHandlerFor";

/**
 * Permet a ce handler de souscrire un evenement et aussi attribue un options de message qui sera affiche a l'utilisateur lorsque ce handler sera en execution
 * @param eventType Construteur de la classe du domain event auquel ce handler veux se souscire
 * @param messageOptions Options de message &message: Le message a afficher au niveau de l'UI &idVisibleOnUI - visibilite au niveau de l'interface
 * @param eventBusKey Identifiant unique ou type de l'event bus auquel sera ajouter ce handler
 * @returns EventHandler
 * @note L'event handler n'arrive par accepter les decorateurs dans n'importes quel ordre donc ce qui a necessite la creation de ce decorateur
 *
 */
// FIXME : fixer le bug de l'ordre des decorateurs
export function DomainEventHandler(
  eventType: EventType,
  messageOptions: Partial<DomainEventMessageOptions>,
  eventBusKey: string | Constructor<EventBus> = Constants.eventBusDefaultKey
) {
  const eventName = typeof eventType === "string" ? eventType : eventType.name;
  return function (target: Function) {
    DomainEventMessage(
      messageOptions.message || eventName,
      messageOptions.isVisibleOnUI
    )(target);

    if (eventBusKey) {
      return EventHandlerFor(eventType, eventBusKey)(target);
    } else {
      return EventHandlerFor(eventType)(target);
    }
  };
}
