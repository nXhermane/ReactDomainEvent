import "reflect-metadata"
import { EventBus } from "./EventBus"
import { DomainEvent } from "./DomainEvent"
import { EventHandler } from "./EventHandler"
import {EventHandlerFor} from "./decorators/EventHandlerFor"


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

class OderDomainEvent extends DomainEvent<any>{ 

}

@EventHandlerFor(OderDomainEvent)
class OderDomainEventHandler extends EventHandler<any,OderDomainEvent> {
   async execute(event: OderDomainEvent): Promise<void> {
      console.log("Parent Executing Event ",this.getEventName())
    await  eventBus.publishAndDispatchImmediate(new UserDomainEvent({}))
      console.log("Parent Finish  Event ",this.getEventName())
    }

}

@EventHandlerFor(UserSubDomainEvent)
class UserSubDomainEventHandler extends EventHandler<any,UserSubDomainEvent> {
   async execute(event: UserSubDomainEvent): Promise<void> {
        console.log("Executing: " , this.getEventName())

        console.log(event)
    }

}
@EventHandlerFor(UserSub1DomainEvent)
class UserSub1DomainEventHandler extends EventHandler<any,UserSub1DomainEvent>{
    async execute(event: UserSub1DomainEvent): Promise<void> {
        console.log("Executing: " , this.getEventName())
        eventBus.publishAndDispatchImmediate(new UserSubDomainEvent({}))
        console.log(event)
    }

}

@EventHandlerFor(UserDomainEvent)
class UserDomainEventHandler extends EventHandler<any,UserDomainEvent> {
   async execute(event: UserDomainEvent):  Promise<void> {
       console.log("Executing", this.getEventName())
       console.log(event)
       await eventBus.publishAndDispatchImmediate(new UserSubDomainEvent({}))
        console.log("..............")
        await eventBus.publishAndDispatchImmediate(new UserSub1DomainEvent({}))
        console.log("finish")
    }
}

const oderDomainEventHandler = new OderDomainEventHandler()
const userDomainEventHandler = new UserDomainEventHandler()
const userSubDomainEventHandler = new UserSubDomainEventHandler()
const userSub1DomainEventHandler = new UserSub1DomainEventHandler()
eventBus.publish(new UserDomainEvent({}))
eventBus.publishAndDispatchImmediate(new OderDomainEvent({}))