import { EventBus } from "../core/EventBus";
import { EventHandler } from "../core/EventHandler";
import { EventData, IDomainEvent } from "../core/interface /DomainEvent";
import { Constants } from "../constants/constants";
import { Constructor } from "../types/types";
import { DomainEventrix } from "../DomainEventrix";
import { EventType } from "../core/interface /EventBus";
import { EnhancedEventBus } from "../EnhancedEventBus/EnhancedEventBus";

/**
 * Permet de souscrir l'event handler a un evenement du bus d'evenement
 * @param eventType Construteur de la classe du domain event auquel ce handler veux se souscire
 * @param eventBusKey Identifiant unique ou type de l'instance d'eventbus a utilisé : @default SharedAvancedEventBus
 * @returns
 */
export function EventHandlerFor(
  eventType: EventType,
  eventBusKey:
    | string
    | Constructor<EnhancedEventBus> = Constants.eventBusDefaultKey
): (target: Function) => any {
  return function (target: Function) {
    const eventName =
      typeof eventType === "string" ? eventType : eventType.name;
    //Enregistrer le Event Type dans les metadata de la classe pour y acceder dans la  methode getEventName
    Reflect.defineMetadata(Constants.handlerMetaDataKey, eventName, target);
    // sauvegarde de la reference au constructeur original et typer explicitment le constructeur
    const originalConstructor = target as { new (...args: any[]): any };

    //Enregistrer la cle de l'event bus utilisé
    Reflect.defineMetadata(
      Constants.handlerEventBusMetaDataKey,
      eventBusKey,
      target
    );

    // Creation d'un nouveau construteur
    const newConstructor: any = function (...args: any[]) {
      //Instancier l'objet de la classe d'origine
      const instance = new originalConstructor(...args);
      // Recuperer l'instance de l'eventBus
      const eventBus = DomainEventrix.get(eventBusKey);
      // Ajout de l'instance a l'event bus
      eventBus.subscribe(
        instance as EventHandler<EventData, IDomainEvent<EventData>>
      );
      // retourner l'instance
      return instance;
    };
    //Copier les proprietes statiques de la classe originale
    Object.setPrototypeOf(newConstructor, originalConstructor);
    //Retourner le nouveau constructeur
    return newConstructor;
  };
}
