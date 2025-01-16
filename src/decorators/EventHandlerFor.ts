import { EventBus } from "../EventBus";
import { EventHandler } from "../EventHandler";
import { EventData, IDomainEvent } from "../interfaces/DomainEvent";
import { Constants } from "../constants/constants";
import { InstanceManager } from "../shared/InstanceManager";
import { EventType } from "../type";
import { Constructor } from "../types";

/**
 * Permet de souscrir l'event handler a un evenement du bus d'evenement
 * @param eventType Construteur de la classe du domain event auquel ce handler veux se souscire
 * @param eventBusKey Identifiant unique ou type de l'instance d'eventbus a utilisé : @default SharedAvancedEventBus
 * @returns
 */
export function EventHandlerFor(
  eventType: EventType,
  eventBusKey: string | Constructor<EventBus> = Constants.eventBusDefaultKey
): (target: Function) => any {
  return function (target: Function) {
    const eventName =
      typeof eventType === "string" ? eventType : eventType.name;
    //Enregistrer le Event Type dans les metadata de la classe pour y acceder dans la  methode getEventName
    Reflect.defineMetadata(Constants.handlerMetaDataKey, eventName, target);
    // sauvegarde de la reference au constructeur original et typer explicitment le constructeur
    const originalConstructor = target as { new (...args: any[]): any };
    // Recuperer l'instance de l'eventBus
    const eventBus = InstanceManager.resolve(eventBusKey);
    // Creation d'un nouveau construteur
    const newConstructor: any = function (...args: any[]) {
      //Instancier l'objet de la classe d'origine
      const instance = new originalConstructor(...args);

      // Ajout de l'instance a l'event bus
      eventBus.suscriber(
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
