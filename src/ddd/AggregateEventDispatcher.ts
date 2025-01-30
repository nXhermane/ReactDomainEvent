import { Constants } from "../constants/constants";
import { DomainEvent } from "../core/DomainEvent";
import { DomainEventrix } from "../DomainEventrix";
import { EnhancedEventBus } from "../EnhancedEventBus/EnhancedEventBus";
import { EventBus } from "../core/EventBus";
import { Constructor } from "../types/types";

/**
 * @class AggregateRoot Basical Representation
 *
 */
export abstract class Aggregate {
  /**
   * @abstract @method getID
   * @description Return the DDD aggregateRoot id as string or number
   */
  abstract getID<ID extends any >(): ID;
  /**
   * @abstract @method getDomainEvents
   * @description Return all domain events stored on the DDD aggregateRoot
   */
  abstract getDomainEvents(): DomainEvent<any>[];
  /**
   * @abstract @method clearDomainEvent
   * @description Clear aggregateRoot DomainEvents Container
   */
  abstract clearDomainEvent(): void;
}
/**
 * @abstract @class AggregateEventDispatcher
 * @classdesc Cette classe permet de lancer et gerer les domains events dans les aggregates racines
 */

export abstract class AggregateEventDispatcher<T extends Aggregate> {
  private eventBus: EventBus;
  private queuedAggregates: T[] = [];
  constructor(
    eventBusKey:
      | string
      | Constructor<EnhancedEventBus> = Constants.eventBusDefaultKey
  ) {
    this.eventBus = DomainEventrix.get(eventBusKey);
  }
  /**
   * Ajoute l'aggregat dans a une file d'attente
   * @param aggregate Instance d'aggregate a mettre dans la file d'attente d'aggregat
   * @desc Appelé par l'aggregat racine qui crée un domain event pour etre eventuellement dispatché lors du commit de l'unité de travail (Unit of Work)
   */
  queueAggregateForDispatch(aggregate: T): void {
    const aggregateFound = !!this.findAggregate(aggregate.getID());
    if (!aggregateFound) this.queuedAggregates.push(aggregate);
  }
  /**
   * Dispatcher et executer les effets secondaires lies au domain event presente dans l'aggregat racine
   * Supprime l'aggregat racine de la file d'attente
   * @param aggregateId l'identifiant de l'aggregat racine
   */
  dispatchEventsForMarkedAggregate(aggregateId: any): void {
    const aggregate = this.findAggregate(aggregateId);
    if (aggregate) {
      this.dispatchAggregateEvents(aggregate);
      aggregate.clearDomainEvent();
      this.removeAggregateFromMarkedAggregates(aggregate);
    }
  }

  private dispatchAggregateEvents(aggregate: T): void {
    aggregate
      .getDomainEvents()
      .forEach((event: DomainEvent<any>) =>
        this.dispatch(event).then().catch(console.error)
      );
  }
  private async dispatch(event: DomainEvent<any>): Promise<void> {
    this.eventBus.publishAndDispatchImmediate(event);
  }
  private removeAggregateFromMarkedAggregates(aggregate: T): void {
    const queuedAggregateIndex = this.queuedAggregates.findIndex(
      (agg: T) => agg.getID() === aggregate.getID()
    );
  }

  private findAggregate(aggregateId: any) {
    let found: T = null as unknown as T;
    for (let aggregate of this.queuedAggregates) {
      if (aggregate.getID() === aggregateId) {
        found = aggregate;
      }
    }
    return found;
  }
}
