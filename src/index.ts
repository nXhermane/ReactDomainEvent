import "reflect-metadata";
import { EventBus } from "./EventBus";
import { DomainEvent } from "./DomainEvent";
import { EventHandler } from "./EventHandler";
import { EventHandlerFor } from "./decorators/EventHandlerFor";
import { ExceptionBase } from "./errors/ExceptionBase";
import { PermanentEventHandleFailureError } from "./errors/PermanentEventHandleFailureError";
import { HandlerStateDecorator } from "./decorators/internalDecorators/HandlerStateDecorator";
import { DomainEventMessage } from "./decorators/DomainEventMessage";
import { DomainEventHandler } from "./decorators/DomainEventHandler";
import { SharedEnhancedEventBus } from "./SharedAvancedEventBus";

SharedEnhancedEventBus.configure({
  enableMonitoringSystem:false,
  enableRetrySystem:false
})
const eventBus = SharedEnhancedEventBus.getInstance();

@DomainEventMessage("User Domain Event created")
class UserDomainEvent extends DomainEvent<any> {
  constructor(data: any) {
    super(data);
  }
}

@DomainEventMessage("User sub domain event created", true)
class UserSubDomainEvent extends DomainEvent<any> {
  constructor(data: any) {
    super(data);
  }
}
@DomainEventMessage("User sub 1 domain event created", true)
class UserSub1DomainEvent extends DomainEvent<any> {
  constructor(data: any) {
    super(data);
  }
}

@DomainEventMessage("Oder domain Event created", true)
class OderDomainEvent extends DomainEvent<any> {}


@EventHandlerFor(OderDomainEvent)
@DomainEventMessage("oder domain event handler", true)
class OderDomainEventHandler extends EventHandler<any, OderDomainEvent> {
  async execute(event: OderDomainEvent): Promise<void> {
    console.log("Parent Executing Event ", this.getEventName());
    await eventBus.publishAndDispatchImmediate(new UserDomainEvent({}));
    console.log("Parent Finish  Event ", this.getEventName());
  }
}

@DomainEventHandler(UserSubDomainEvent,{
  message: "User domain Handler",
  isVisibleOnUI: true
})
class UserSubDomainEventHandler extends EventHandler<any, UserSubDomainEvent> {
  async execute(event: UserSubDomainEvent): Promise<void> {
    console.log("Executing: ", this.getEventName(), event.getMetaData());
    throw new PermanentEventHandleFailureError("UserSubDomainEventHandler Error");
    console.log(event);
  }
}


@DomainEventHandler(UserSub1DomainEvent,{
  message: "user sub 1 domain event handler",
  isVisibleOnUI: true
})
class UserSub1DomainEventHandler extends EventHandler<
  any,
  UserSub1DomainEvent
> {
  async execute(event: UserSub1DomainEvent): Promise<void> {
    console.log("Executing: ", this.getEventName());
    eventBus.publishAndDispatchImmediate(new UserSubDomainEvent({}));
    console.log(event);
  }
}


@EventHandlerFor(UserDomainEvent)
@DomainEventMessage("oder domain event handler", true)
class UserDomainEventHandler extends EventHandler<any, UserDomainEvent> {
  async execute(event: UserDomainEvent): Promise<void> {
    console.log("Executing", this.getEventName());
    console.log(event);
    await eventBus.publishAndDispatchImmediate(new UserSubDomainEvent({}));
    console.log("..............");
    await eventBus.publishAndDispatchImmediate(new UserSub1DomainEvent({}));
    console.log("finish");
  }
}

const oderDomainEventHandler = new OderDomainEventHandler();
const userDomainEventHandler = new UserDomainEventHandler();
const userSubDomainEventHandler = new UserSubDomainEventHandler();
const userSub1DomainEventHandler = new UserSub1DomainEventHandler();
eventBus.publish(new UserDomainEvent({}));
eventBus.publishAndDispatchImmediate(new OderDomainEvent({}));
