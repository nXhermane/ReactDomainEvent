# domain-eventrix

## Description
A TypeScript library for managing domain events, providing integration with React, React Native, and supporting DDD use cases. Designed to work in TypeScript projects, it enables developers to implement event-driven architectures effectively.

## Installation
To install the library, use npm or yarn:

```bash
npm install domain-eventrix
```
or
```bash
yarn add domain-eventrix
```

## Usage
### Configuring the Event Bus
To configure the `SharedEnhancedEventBus`, you can do the following:

```typescript
import { SharedEnhancedEventBus } from "domain-eventrix";

SharedEnhancedEventBus.configure({
  enableMonitoringSystem: true,
  enableRetrySystem: true,
});
```

### Creating an Instance of `EnhancedEventBus`
You can create a new instance of `EnhancedEventBus` as follows:

```typescript
import { createEnhancedEventBus } from "domain-eventrix";

const myEventBus = createEnhancedEventBus({
  enableMonitoringSystem: true,
  enableRetrySystem: true,
});
```

### Registering the Instance
To register the instance with the `InstanceManager`, use the following code:

```typescript
import { InstanceManager } from "domain-eventrix";

InstanceManager.register("myEventBusKey", myEventBus);
```

### Using the Event Bus
You can publish events using the event bus:

```typescript
myEventBus.publish(new UserDomainEvent({}));
```

### Using the Event Bus with Decorators
When using decorators, you can pass the instance as follows:

```typescript
import { DomainEventHandler } from "domain-eventrix";

@DomainEventHandler(UserDomainEvent, {
  message: "User domain event handler",
  isVisibleOnUI: true,
}, "myEventBusKey")
class UserDomainEventHandler extends EventHandler<any, UserDomainEvent> {
  async execute(event: UserDomainEvent): Promise<void> {
    console.log("Executing", this.getEventName());
    // Handle the event
  }
}
```

### Detailed Use Case: User Registration with DDD
In a typical user registration scenario, you might want to handle user domain events. Here’s how you can implement it using the `AggregateEventDispatcher`:

1. **Define the Domain Event**:
   ```typescript
   @DomainEventMessage("User Registered")
   class UserRegisteredEvent extends DomainEvent<any> {
     constructor(data: any) {
       super(data);
     }
   }
   ```

2. **Create the Aggregate**:
   ```typescript
   class UserAggregate implements Aggregate {
     private domainEvents: DomainEvent<any>[] = [];
     private id: string;

     constructor(id: string) {
       this.id = id;
     }

     getID() {
       return this.id;
     }

     getDomainEvents() {
       return this.domainEvents;
     }

     clearDomainEvent() {
       this.domainEvents = [];
     }

     registerUser(data: any) {
       const event = new UserRegisteredEvent(data);
       this.domainEvents.push(event);
     }
   }
   ```

3. **Using the `AggregateEventDispatcher`**:
   ```typescript
   const dispatcher = new AggregateEventDispatcher<UserAggregate>("myEventBusKey");
   const userAggregate = new UserAggregate("user-1");
   userAggregate.registerUser({ username: "john_doe" });
   dispatcher.queueAggregateForDispatch(userAggregate);
   dispatcher.dispatchEventsForMarkedAggregate(userAggregate.getID());
   ```

### React Integration
To integrate the library with a React application, you can use the `EventProvider` to manage the event bus context:

1. **Using `SharedEnhancedEventBus`**:
   ```typescript
   import React from "react";
   import { EventProvider, SharedEnhancedEventBus } from "domain-eventrix";

   const App: React.FC = () => {
     return (
       <EventProvider eventBusKey={SharedEnhancedEventBus}>
         <UserRegistration />
       </EventProvider>
     );
   };
   ```

2. **Using `EnhancedEventBus`**:
   ```typescript
   import React from "react";
   import { EventProvider, createEnhancedEventBus } from "domain-eventrix";

   const myEventBus = createEnhancedEventBus({
     enableMonitoringSystem: true,
     enableRetrySystem: true,
   });
   InstanceManager.register("myEventBusKey", myEventBus);

   const App: React.FC = () => {
     return (
       <EventProvider eventBusKey="myEventBusKey">
         <UserRegistration />
       </EventProvider>
     );
   };
   ```

### Using Hooks in React
The library provides hooks to facilitate the use of the event bus in functional components:

1. **Using `useEventBus`**:
   ```typescript
   import { useEventBus } from "domain-eventrix";

   const MyComponent: React.FC = () => {
     const eventBus = useEventBus();

     const handleClick = () => {
       eventBus.publish(new UserDomainEvent({}));
     };

     return <button onClick={handleClick}>Trigger Event</button>;
   };
   ```

2. **Using `useEventContext`**:
   ```typescript
   import { useEventContext } from "domain-eventrix";

   const MyComponent: React.FC = () => {
     const { getEventBus, eventProcessingState } = useEventContext();

     const handleClick = () => {
       const eventBus = getEventBus();
       eventBus.publish(new UserDomainEvent({}));
     };

     return <button onClick={handleClick}>Trigger Event</button>;
   };
   ```



## Contributing
Contributions are welcome! Please submit a pull request or open an issue for any suggestions or improvements.

## License
This project is licensed under the MIT License.
