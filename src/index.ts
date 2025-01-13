import "reflect-metadata"
import { EventBus } from "./EventBus"
import { DomainEvent } from "./DomainEvent"
import { EventHandler } from "./EventHandler"
import EventHandlerFor from "./decorators/EventHandlerFor"


const eventBus = EventBus.getInstance()
class UserDomainEvent extends DomainEvent<any>{
    constructor(data: any){
        super(data)
    }
}

class UserSubDomainEvent extends DomainEvent<any>{
    constructor(data: any) {
        super(data);
    }
}
class UserSub1DomainEvent extends DomainEvent<any>{
    constructor(data: any) {
        super(data)
    }
}

@EventHandlerFor(UserSubDomainEvent)
class UserSubDomainEventHandler extends EventHandler<any,UserSubDomainEvent> {
    execute(event: UserSubDomainEvent): void | Promise<void> {
        console.log("Executing: " , this.getEventName())
    }

}
@EventHandlerFor(UserSub1DomainEvent)
class UserSub1DomainEventHandler extends EventHandler<any,UserSub1DomainEvent>{
    execute(event: UserSub1DomainEvent): void | Promise<void> {
        console.log("Executing: " , this.getEventName())
        eventBus.publishAndDispatchImmediate(new UserSubDomainEvent({}))
    }

}

@EventHandlerFor(UserDomainEvent)
class UserDomainEventHandler extends EventHandler<any,UserDomainEvent> {
   async execute(event: UserDomainEvent):  Promise<void> {
       console.log("Executing", this.getEventName())
        eventBus.publishAndDispatchImmediate(new UserSubDomainEvent({}))
        console.log("..............")
        eventBus.publishAndDispatchImmediate(new UserSub1DomainEvent({}))
        console.log("finish")
    }
}

const userDomainEventHandler = new UserDomainEventHandler()
const userSubDomainEventHandler = new UserSubDomainEventHandler()
const userSub1DomainEventHandler = new UserSub1DomainEventHandler()
// eventBus.suscriber(userDomainEventHandler)
eventBus.publish(new UserDomainEvent({}))
eventBus.publishAndDispatchImmediate(new UserDomainEvent({}))
