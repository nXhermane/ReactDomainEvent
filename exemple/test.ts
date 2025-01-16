// import "reflect-metadata";
// import { DomainEvent } from "./DomainEvent";
// import { EventHandler } from "./EventHandler";
// import { EventHandlerFor } from "./decorators/EventHandlerFor";
// import { PermanentEventHandleFailureError } from "./errors/PermanentEventHandleFailureError";
// import { DomainEventMessage } from "./decorators/DomainEventMessage";
// import { DomainEventHandler } from "./decorators/DomainEventHandler";
// import { SharedEnhancedEventBus } from "./SharedAvancedEventBus";
// import { InstanceManager } from "./shared/InstanceManager";
// import { Constants } from "./constants/constants";

// SharedEnhancedEventBus.configure({
//   enableMonitoringSystem: true,
//   enableRetrySystem: true,
// });
// InstanceManager.register(
//   Constants.eventBusDefaultKey,
//   SharedEnhancedEventBus.getInstance()
// );
// const eventBus = InstanceManager.resolve<SharedEnhancedEventBus>(
//   Constants.eventBusDefaultKey
// );

// @DomainEventMessage("User Domain Event created")
// class UserDomainEvent extends DomainEvent<any> {
//   constructor(data: any) {
//     super(data);
//   }
// }

// @DomainEventMessage("User sub domain event created", true)
// class UserSubDomainEvent extends DomainEvent<any> {
//   constructor(data: any) {
//     super(data);
//   }
// }
// @DomainEventMessage("User sub 1 domain event created", true)
// class UserSub1DomainEvent extends DomainEvent<any> {
//   constructor(data: any) {
//     super(data);
//   }
// }

// @DomainEventMessage("Oder domain Event created", true)
// class OderDomainEvent extends DomainEvent<any> {}

// @EventHandlerFor(OderDomainEvent)
// @DomainEventMessage("oder domain event handler", true)
// class OderDomainEventHandler extends EventHandler<any, OderDomainEvent> {
//   async execute(event: OderDomainEvent): Promise<void> {
//     console.log("Parent Executing Event ", this.getEventName());
//     await eventBus.publishAndDispatchImmediate(new UserDomainEvent({}));
//     console.log("Parent Finish  Event ", this.getEventName());
//   }
// }

// @DomainEventHandler(UserSubDomainEvent, {
//   message: "User domain Handler",
//   isVisibleOnUI: true,
// })
// class UserSubDomainEventHandler extends EventHandler<any, UserSubDomainEvent> {
//   async execute(event: UserSubDomainEvent): Promise<void> {
//     console.log("Executing: ", this.getEventName(), event.getMetaData());
//     throw new PermanentEventHandleFailureError(
//       "UserSubDomainEventHandler Error"
//     );
//     console.log(event);
//   }
// }

// @DomainEventHandler(UserSub1DomainEvent, {
//   message: "user sub 1 domain event handler",
//   isVisibleOnUI: true,
// })
// class UserSub1DomainEventHandler extends EventHandler<
//   any,
//   UserSub1DomainEvent
// > {
//   async execute(event: UserSub1DomainEvent): Promise<void> {
//     console.log("Executing: ", this.getEventName());
//     eventBus.publishAndDispatchImmediate(new UserSubDomainEvent({}));
//     console.log(event);
//   }
// }

// @EventHandlerFor(UserDomainEvent)
// @DomainEventMessage("oder domain event handler", true)
// class UserDomainEventHandler extends EventHandler<any, UserDomainEvent> {
//   async execute(event: UserDomainEvent): Promise<void> {
//     console.log("Executing", this.getEventName());
//     console.log(event);
//     await eventBus.publishAndDispatchImmediate(new UserSubDomainEvent({}));
//     console.log("..............");
//     await eventBus.publishAndDispatchImmediate(new UserSub1DomainEvent({}));
//     console.log("finish");
//   }
// }

// const oderDomainEventHandler = new OderDomainEventHandler();
// const userDomainEventHandler = new UserDomainEventHandler();
// const userSubDomainEventHandler = new UserSubDomainEventHandler();
// const userSub1DomainEventHandler = new UserSub1DomainEventHandler();
// eventBus.publish(new UserDomainEvent({}));
// // eventBus.publishAndDispatchImmediate(new OderDomainEvent({}));
// import * as ReactDomainEvent from "../dist";

// import { DomainEvent, EventHandler, ExceptionBase } from "./../dist";
// ReactDomainEvent.SharedEnhancedEventBus.configure({
//   enableMonitoringSystem: true,
//   enableRetrySystem: true,
// });
// const eventBus = ReactDomainEvent.SharedEnhancedEventBus.getInstance();

// const eventBus1 = ReactDomainEvent.createEnhancedEventBus({
//   enableMonitoringSystem: true,
//   enableRetrySystem: true,
// });

// class Observer implements ReactDomainEvent.EventProcessingStateObserver {
//     update(state: ReactDomainEvent.EventProcessingState[]): void {
//       console.log(state)
//     }
// }

// const observer = new Observer()

// ReactDomainEvent.InstanceManager.register<ReactDomainEvent.EnhancedEventBus>("sharedEnhancedEventBus",eventBus1)
// const reactProcessingState = ReactDomainEvent.EventProcessingStateManager.getInstance()
// reactProcessingState.subscribe(observer)
// @ReactDomainEvent.DomainEventMessage("User Domain Event created")
// class UserDomainEvent extends DomainEvent<any> {
//   constructor(data: any) {
//     super(data);
//   }
// }

// @ReactDomainEvent.DomainEventMessage("User sub domain event created", true)
// class UserSubDomainEvent extends DomainEvent<any> {
//   constructor(data: any) {
//     super(data);
//   }
// }
// @ReactDomainEvent.DomainEventMessage("User sub 1 domain event created", true)
// class UserSub1DomainEvent extends DomainEvent<any> {
//   constructor(data: any) {
//     super(data);
//   }
// }

// @ReactDomainEvent.DomainEventMessage("Oder domain Event created", true)
// class OderDomainEvent extends DomainEvent<any> {}

// @ReactDomainEvent.DomainEventHandler(OderDomainEvent, {
//   message: "oder domain event handler",
//   isVisibleOnUI: true,
// },"sharedEnhancedEventBus")
// class OderDomainEventHandler extends EventHandler<any, OderDomainEvent> {
//   async execute(event: OderDomainEvent): Promise<void> {
//     console.log("Parent Executing Event ", this.getEventName());
//     await eventBus1.publishAndDispatchImmediate(new UserDomainEvent({}));
//     console.log("Parent Finish  Event ", this.getEventName());
//   }
// }

// @ReactDomainEvent.DomainEventHandler(UserSubDomainEvent, {
//   message: "User domain Handler",
//   isVisibleOnUI: true,
// },"sharedEnhancedEventBus")
// class UserSubDomainEventHandler extends EventHandler<any, UserSubDomainEvent> {
//   async execute(event: UserSubDomainEvent): Promise<void> {
//     console.log("Executing: ", this.getEventName(), event.getMetaData());
//     throw new ReactDomainEvent.PermanentEventHandleFailureError(
//       "UserSubDomainEventHandler Error"
//     );
//     console.log(event);
//   }
// }

// @ReactDomainEvent.DomainEventHandler(UserSub1DomainEvent, {
//   message: "user sub 1 domain event handler",
//   isVisibleOnUI: true,
// },"sharedEnhancedEventBus")
// class UserSub1DomainEventHandler extends EventHandler<
//   any,
//   UserSub1DomainEvent
// > {
//   async execute(event: UserSub1DomainEvent): Promise<void> {
//     console.log("Executing: ", this.getEventName());
//     eventBus.publishAndDispatchImmediate(new UserSubDomainEvent({}));
//     console.log(event);
//   }
// }

// @ReactDomainEvent.DomainEventHandler(UserDomainEvent, {
//   message: "oder domain event handler",
//   isVisibleOnUI: true,
// },"sharedEnhancedEventBus")
// class UserDomainEventHandler extends EventHandler<any, UserDomainEvent> {
//   async execute(event: UserDomainEvent): Promise<void> {
//     console.log("Executing", this.getEventName());
//     console.log(event);
//     await eventBus1.publishAndDispatchImmediate(new UserSubDomainEvent({}));
//     console.log("..............");
//     await eventBus1.publishAndDispatchImmediate(new UserSub1DomainEvent({}));
//     console.log("finish");
//   }
// }

// const oderDomainEventHandler = new OderDomainEventHandler();
// const userDomainEventHandler = new UserDomainEventHandler();
// const userSubDomainEventHandler = new UserSubDomainEventHandler();
// const userSub1DomainEventHandler = new UserSub1DomainEventHandler();
// eventBus1.publish(new UserDomainEvent({}));
// eventBus1.publishAndDispatchImmediate(new OderDomainEvent({}));




