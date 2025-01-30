# Domain-Eventrix Usage Guide

Domain-Eventrix is a powerful event bus library for TypeScript/JavaScript applications, with first-class support for Domain-Driven Design (DDD) and React/React Native integration.

## Table of Contents
- [Domain-Eventrix Usage Guide](#domain-eventrix-usage-guide)
  - [Table of Contents](#table-of-contents)
  - [Installation](#installation)
  - [Core Concepts](#core-concepts)
  - [Creating an Event Bus](#creating-an-event-bus)
    - [1. Using DomainEventrix Factory (Recommended)](#1-using-domaineventrix-factory-recommended)
    - [2. Using Component Factories](#2-using-component-factories)
    - [3. Manual Configuration](#3-manual-configuration)
  - [Event Processing and Monitoring](#event-processing-and-monitoring)
    - [Setting Up State Management](#setting-up-state-management)
    - [Adding State Observers](#adding-state-observers)
  - [Working with Events](#working-with-events)
    - [TypeScript Example](#typescript-example)
    - [JavaScript Example](#javascript-example)
  - [Domain-Driven Design Integration](#domain-driven-design-integration)
  - [React/React Native Integration](#reactreact-native-integration)
    - [Configuration Setup](#configuration-setup)
    - [Provider Setup](#provider-setup)
    - [Using Hooks](#using-hooks)
  - [Best Practices](#best-practices)

## Installation

```bash
npm install domain-eventrix
# or
yarn add domain-eventrix
```

## Core Concepts

Domain-Eventrix provides several key components:
- **Event Bus**: The central message broker that handles event publishing and subscription
- **Domain Events**: Events that represent something meaningful happening in your domain
- **Event Handlers**: Components that process specific types of events
- **Event Processing State Manager**: Monitors and tracks the state of event processing
- **Dead Letter Queue**: Handles failed event processing attempts
- **Retry Strategy**: Configures how failed events should be retried

## Creating an Event Bus

There are three ways to create an event bus:

### 1. Using DomainEventrix Factory (Recommended)

```typescript
import DomainEventrix from "domain-eventrix"

// Create a named event bus
const customBus = DomainEventrix.create({
  eventBusKey: "CustomBus",
  enableStateManagement: true, // Enable state tracking
  // ... other options
})

// Create a shared event bus (default)
const sharedBus = DomainEventrix.get()
```

### 2. Using Component Factories

```typescript
import { 
  SharedEnhancedEventBus, 
  createEnhancedEventBus, 
  InstanceManager 
} from "domain-eventrix"

// Create and register a custom event bus
const customBus = createEnhancedEventBus({
  eventBusKey: "CustomBus",
  // ... configuration options
})
InstanceManager.get().register("CustomBus", customBus)

// Create and register a shared bus
const sharedBus = SharedEnhancedEventBus.create()
InstanceManager.get().register(SharedEnhancedEventBus, sharedBus)
```

### 3. Manual Configuration

```typescript
import {
  EnhancedEventBus,
  ExponentialBackoffStrategy,
  DeadLetterQueue,
  EventMonitoringSystem
} from 'domain-eventrix'

// Configure retry strategy
const retryStrategy = new ExponentialBackoffStrategy(
  5,      // Max retries
  1000,   // Initial delay (ms)
  3600000 // Max delay (1 hour)
)

// Configure dead letter queue
const deadLetterQueue = new DeadLetterQueue(
  async (event) => {
    // Handle dead letters
    console.error('Event processing failed:', event)
  },
  100 // Queue size
)

// Create monitoring system
const monitoring = new EventMonitoringSystem()

// Create and register event bus
const eventBus = new EnhancedEventBus(
  "CustomBus",
  retryStrategy,
  deadLetterQueue,
  monitoring
)
```

## Event Processing and Monitoring

### Setting Up State Management

```typescript
import DomainEventrix from 'domain-eventrix'

// Method 1: Enable during creation
DomainEventrix.create({
  eventBusKey: "CustomBus",
  enableStateManagement: true
})

// Method 2: Add explicitly
DomainEventrix.addEventProcessingStateManager("CustomBus")

// Method 3: Create manually
import { EventProcessingStateManager } from "domain-eventrix"
const stateManager = new EventProcessingStateManager()
```

### Adding State Observers

```typescript
import { EventProcessingStateObserver, EventProcessingState } from 'domain-eventrix'

class StateObserver implements EventProcessingStateObserver {
  update(state: EventProcessingState[]): void {
    console.log('Event processing state updated:', state)
  }
}

const stateManager = DomainEventrix.getEventProcessingStateManagerByEventBusKey("CustomBus")
stateManager.subscribe(new StateObserver())
```

## Working with Events

### TypeScript Example

```typescript
import { 
  DomainEvent, 
  DomainEventMessage, 
  EventHandler, 
  DomainEventHandler 
} from "domain-eventrix"

// Define an event
@DomainEventMessage("UserRegistered")
class UserRegisteredEvent extends DomainEvent<User> {
  constructor(user: User) {
    super(user)
  }
}

// Define a handler
@DomainEventHandler(UserRegisteredEvent, {
  message: "Handle user registration",
  isVisibleOnUI: true
}, "CustomBus")
class UserRegistrationHandler extends EventHandler<User, UserRegisteredEvent> {
  async execute(event: UserRegisteredEvent): Promise<void> {
    const user = event.data
    // Handle the registration
  }
}

// Usage
const eventBus = DomainEventrix.get("CustomBus")
eventBus.publish(new UserRegisteredEvent(user))        // Async processing
eventBus.publishAndDispatchImmediate(new UserRegisteredEvent(user)) // Immediate processing
```

### JavaScript Example

```javascript
import { 
  DomainEvent,
  defineDomainEventMessage,
  EventHandler,
  bindEventHandler
} from "domain-eventrix"

// Define an event
class UserRegisteredEvent extends DomainEvent {
  constructor(user) {
    super(user)
  }
}
defineDomainEventMessage(UserRegisteredEvent, "UserRegistered")

// Define a handler
class UserRegistrationHandler extends EventHandler {
  async execute(event) {
    const user = event.data
    // Handle the registration
  }
}
defineDomainEventMessage(UserRegistrationHandler, "Handle user registration", true)
bindEventHandler(UserRegistrationHandler, UserRegisteredEvent)

// Usage
const eventBus = DomainEventrix.get("CustomBus")
eventBus.subscribe(new UserRegistrationHandler())
eventBus.publish(new UserRegisteredEvent(user))
```

## Domain-Driven Design Integration

Domain-Eventrix provides special support for DDD patterns:

```typescript
import { DomainEvent } from 'domain-eventrix'
import { AggregateEventDispatcher, Aggregate } from 'domain-eventrix/ddd'

// Base aggregate root class
abstract class AggregateRoot implements Aggregate {
  private _domainEvents: DomainEvent<any>[] = []
  abstract id: string

  addDomainEvent(event: DomainEvent<any>) {
    this._domainEvents.push(event)
    AggregateEventDispatcher.get().queueAggregateForDispatch(this)
  }

  // ... other aggregate methods
}

// Example aggregate
class UserAggregate extends AggregateRoot {
  constructor(public name: string, public email: string) {
    super()
    this.id = generateUniqueId()
  }

  static create(name: string, email: string): UserAggregate {
    const user = new UserAggregate(name, email)
    user.addDomainEvent(new UserCreatedEvent(user))
    return user
  }
}

// Usage in application service
function createUser(name: string, email: string) {
  const user = UserAggregate.create(name, email)
  AggregateEventDispatcher.get().dispatchEventsForMarkedAggregate(user.id)
  return user
}
```

## React/React Native Integration

### Configuration Setup

```typescript
// eventrix.config.ts
import DomainEventrix from "domain-eventrix"

DomainEventrix.create({
  eventBusKey: "ReactAppEventBus",
  // ... other options
})
```

### Provider Setup

```tsx
// App.tsx
import "./eventrix.config"
import { EventProvider } from "domain-eventrix/react"

function App() {
  return (
    <EventProvider eventBusKey="ReactAppEventBus">
      <YourApp />
    </EventProvider>
  )
}
```

### Using Hooks

```tsx
import { 
  useEventBus,
  useEventContext,
  useEventBusMethods,
  useEventProcessingState,
  EventProcessingState
} from "domain-eventrix/react"

function YourComponent() {
  // Get event bus instance
  const eventBus = useEventBus()
  
  // Get event context
  const context = useEventContext()
  
  // Get event bus methods
  const { publish, publishImmediate, dispatch } = useEventBusMethods()
  
  // Subscribe to processing state
  useEventProcessingState((state: EventProcessingState[]) => {
    console.log('Processing state:', state)
  })

  return (
    // Your component JSX
  )
}
```

## Best Practices

1. **Event Bus Creation**: Use the `DomainEventrix.create()` factory method when possible, as it provides the most straightforward setup.

2. **State Management**: Enable state management when you need to track event processing status, especially in UI applications.

3. **Error Handling**: Configure appropriate retry strategies and dead letter queues for production environments.

4. **React Integration**: Always initialize the event bus configuration before rendering your React application.

5. **Type Safety**: In TypeScript projects, leverage the type system by properly typing your events and handlers.