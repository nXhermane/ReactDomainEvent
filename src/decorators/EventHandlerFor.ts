import { EventBus } from "../EventBus";
import { EventHandler } from "../EventHandler";
import { EventData, IDomainEvent } from "../interfaces/DomainEvent";
import { Constants } from "../constants/constants";
import { SharedEnhancedEventBus } from "../SharedAvancedEventBus";

export  function EventHandlerFor (eventType: Function,eventBus: EventBus= SharedEnhancedEventBus.getInstance()) {
  return function (target: Function) {
    //Enregistrer le Event Type dans les metadata de la classe pour y acceder dans la  methode getEventName
    Reflect.defineMetadata(Constants.handlerMetaDataKey, eventType.name, target);
    // sauvegarde de la reference au constructeur original et typer explicitment le constructeur
    const originalConstructor = target as { new (...args: any[]): any };

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
