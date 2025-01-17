import { Constants } from "../constants/constants";

/**
 * Options de Message definir par le dev pour etre afficher au niveau de l'interface utilisateur
 * @property message : Le message a affiche
 * @property isVisibleOnUI : qui est un boolean
 */
export interface DomainEventMessageOptions {
  message: string;
  isVisibleOnUI: boolean;
}

/**
 * Permet d'attribuer un message a une classe d'evenement de domain
 * @param message Message a afficher a l'utilisateur lors de la publication de cet evenement
 * @param isVisibleOnUI Visibilite au niveau de l'interface : si True le message sera afficher et sinon le message ne sera pas afficher
 * @returns
 */
export function DomainEventMessage(
  message: string,
  isVisibleOnUI: boolean = false
):ClassDecorator {
  return  (
    target: Function
  ) =>{
    Reflect.defineMetadata(
      Constants.eventMessageOption,
      {
        message,
        isVisibleOnUI,
      },
      target
    );
  };
}
