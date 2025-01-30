import { EventProcessingStateManager } from "../addons/EventProcessingStateManager";
import { Constants } from "../constants/constants";
import { EnhancedEventBus } from "../EnhancedEventBus/EnhancedEventBus";
import InstanceManager from "../shared/InstanceManager";
import { Constructor } from "../types/types";

/**
 * This function create EventProcessingStateManager and saved like EventProcessingStateManager of EventBus who have the providing eventBusKey
 * @param eventBusKey 
 * @returns Instance of  EventProcessingStateManager
 */
export function createEventProcessingStateManager(
  eventBusKey: string | Constructor<EnhancedEventBus>
): EventProcessingStateManager {
  const eventProcessingState = new EventProcessingStateManager();
  InstanceManager.get().register(
    Constants.getEventProcessingKey(eventBusKey),
    eventProcessingState
  );
  return eventProcessingState;
}
