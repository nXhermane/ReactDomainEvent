import { Constants } from "../constants/constants";

export interface DomainEventMessageOptions {
  message: string;
  isVisibleOnUI: boolean;
}

export function DomainEventMessage(
  message: string,
  isVisibleOnUI: boolean = false
) {
  return function (
    target: any,
    propertyName?: string,
    descriptor?: PropertyDescriptor
  ) {
    Reflect.defineMetadata(
      Constants.eventMessageOption,
      {
        message,
        isVisibleOnUI,
      },
      target
    );
    return target
  };
}
