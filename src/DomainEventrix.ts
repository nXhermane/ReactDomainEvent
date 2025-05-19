import { Constants } from "./constants/constants";
import { EnhancedEventBus, EnhancedEventBusConfig } from "./EnhancedEventBus/EnhancedEventBus";
import { EventProcessingStateManager } from "./addons/EventProcessingStateManager";
import { createEnhancedEventBus } from "./factories/createEnhancedEventBus";
import  InstanceManager from "./shared/InstanceManager";
import { SharedEnhancedEventBus } from "./EnhancedEventBus/SharedAvancedEventBus";
import { Constructor, OnDeadLetter } from "./types/types";
import { IEventBus } from "./core/interface /EventBus";



/**
 * @Reflexion :
 * Note : Chaque state manager dois etre faire pour suivre les statistiques d'un seule classe d'eventBus
 * Donc on peux associer une cle a chaque instance
 * on utilise la cle pour le lie a une seule instance
 * la cle + "state" pour lier le state manager
 */
export interface EventManagerConfig extends Partial<EnhancedEventBusConfig> {
  onDeadLetter?: OnDeadLetter;
  enableStateManagement?: boolean;
}

export class DomainEventrix {
  private static instanceManager: InstanceManager = InstanceManager.get();

  static create(config: EventManagerConfig): void {
    const { onDeadLetter, enableStateManagement, ...otherConfig } = config;
    const eventBusKey = config.eventBusKey;
    if (eventBusKey === undefined) {
      SharedEnhancedEventBus.configure({ ...otherConfig, onDeadLetter });
      this.instanceManager.register<SharedEnhancedEventBus>(
        Constants.eventBusDefaultKey,
        SharedEnhancedEventBus.getInstance()
      );
    } else {
      const eventBus = createEnhancedEventBus(
        {
          ...otherConfig,
          eventBusKey: otherConfig.eventBusKey || Constants.eventBusDefaultKey,
        },
        onDeadLetter
      );
      this.instanceManager.register<IEventBus>(eventBusKey, eventBus);
    }
    if (enableStateManagement) this.addEventProcessingStateManager(eventBusKey);
  }

  static get(
    eventBusKey?: string | Constructor<IEventBus>
  ): IEventBus {
    if (
      eventBusKey === undefined &&
      !this.instanceManager.has(Constants.eventBusDefaultKey)
    ) {
      // Creer l'instance par defaut si l'utilisateur ne fournir par la cle
      this.create({});
    }
    return this.instanceManager.resolve(
      eventBusKey || Constants.eventBusDefaultKey
    );
  }

  static addEventProcessingStateManager(
    eventBusKey?: string | Constructor<EnhancedEventBus>
  ) {
    const eventProcessingStateManager = new EventProcessingStateManager();
    const eventProcessingStateManagerKey = Constants.getEventProcessingKey(
      eventBusKey || Constants.eventBusDefaultKey
    );
    this.instanceManager.register<EventProcessingStateManager>(
      eventProcessingStateManagerKey,
      eventProcessingStateManager
    );
  }

  static getEventProcessingStateManagerByEventBusKey(
    eventBusKey?: string | Constructor<EnhancedEventBus>
  ): EventProcessingStateManager | undefined {
    const absolutEventBusKey = eventBusKey || Constants.eventBusDefaultKey;
    if (!this.instanceManager.has(absolutEventBusKey)) {
      console.warn(
        `L'eventBus ayant cette cle (${absolutEventBusKey}) n'existe pas. Veillez en creer une pour pouvoir faire le get d'un event state manager `
      );
      return undefined;
    }
    const eventProcessingStateManagerKey =
      Constants.getEventProcessingKey(absolutEventBusKey);
    if (!this.instanceManager.has(eventProcessingStateManagerKey)) {
      this.addEventProcessingStateManager(absolutEventBusKey);
    }
    return this.instanceManager.resolve(eventProcessingStateManagerKey);
  }

  static getInstanceManager(): InstanceManager {
    return this.instanceManager;
  }
}
