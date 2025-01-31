import { DomainEvent } from "../core/DomainEvent";

/**
 * @interface Aggregate AggregateRoot Basical Representation
 *
 */
export interface Aggregate {
  /**
   * @method getID
   * @description Return the DDD aggregateRoot id as string or number
   */
  getID<ID = string | number>(): ID;
  /**
   * @method getDomainEvents
   * @description Return all domain events stored on the DDD aggregateRoot
   */
  getDomainEvents(): DomainEvent<any>[];
  /**
   * @method clearDomainEvent
   * @description Clear aggregateRoot DomainEvents Container
   */
  clearDomainEvent(): void;
}
