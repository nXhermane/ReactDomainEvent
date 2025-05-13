# domain-eventrix

A powerful TypeScript library for managing domain events with seamless integration for React, React Native, and Domain-Driven Design (DDD). Built to enhance event-driven architectures with features like retry strategies, dead letter queues, and state management.

[![npm version](https://badge.fury.io/js/domain-eventrix.svg)](https://badge.fury.io/js/domain-eventrix)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

## Features

- 🚀 Robust event bus implementation with TypeScript support
- 🔄 Built-in retry strategies and dead letter queue
- 📊 Event processing state management
- ⚛️ First-class React and React Native integration
- 🏛️ DDD-friendly with aggregate root support
- 🔍 Event monitoring system
- 🎨 Flexible configuration options

## Installation

```bash
npm install domain-eventrix
# or
yarn add domain-eventrix
# or
pnpm add domain-eventrix
```

## Quick Start

### 1. Create an Event Bus

```typescript
import DomainEventrix from "domain-eventrix"

// Create a shared (default) event bus
DomainEventrix.create()

// Or create a named event bus
DomainEventrix.create({
  eventBusKey: "CustomEventBus",
  enableStateManagement: true
})
```

### 2. Define Events and Handlers

```typescript
import { DomainEvent, DomainEventMessage, EventHandler, DomainEventHandler } from "domain-eventrix"

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
})
class UserRegistrationHandler extends EventHandler<User, UserRegisteredEvent> {
  async execute(event: UserRegisteredEvent): Promise<void> {
    const user = event.data
    // Handle the registration
    console.log(`User registered: ${user.name}`)
  }
}
```

### 3. Use the Event Bus

```typescript
const eventBus = DomainEventrix.get() // Get shared bus
// or
const customBus = DomainEventrix.get("CustomEventBus") // Get named bus

// Publish events
eventBus.publish(new UserRegisteredEvent(user))
// or publish and execute immediately
eventBus.publishAndDispatchImmediate(new UserRegisteredEvent(user))
```

## Core Concepts

### Event Bus Types

Domain-eventrix provides two types of event buses:

1. **SharedEnhancedEventBus** (Default)
   - Singleton instance shared across your application
   - Perfect for most use cases

2. **EnhancedEventBus**
   - Named instances for specific contexts
   - Useful when you need isolated event handling

### Event Processing Features

- **Retry Strategy**: Configurable retry attempts for failed event processing
- **Dead Letter Queue**: Handle persistently failed events
- **State Management**: Track event processing status
- **Monitoring**: observe event flow and processing metrics

## Advanced Usage

### Domain-Driven Design Integration

```typescript
import { AggregateEventDispatcher, Aggregate } from 'domain-eventrix/ddd'

class UserAggregate implements Aggregate {
  private domainEvents: DomainEvent<any>[] = []
  
  constructor(public id: string, public name: string) {}
  
  register() {
    const event = new UserRegisteredEvent({ id: this.id, name: this.name })
    this.domainEvents.push(event)
    AggregateEventDispatcher.get().queueAggregateForDispatch(this)
  }
  
  getDomainEvents() { return this.domainEvents }
  getID() { return this.id }
  clearDomainEvent() { this.domainEvents = [] }
}

// Usage
const user = new UserAggregate("1", "John Doe")
user.register()
AggregateEventDispatcher.get().dispatchEventsForMarkedAggregate(user.id)
```

### React Integration

#### Setup Event Provider

```tsx
// eventrix.config.ts
import DomainEventrix from "domain-eventrix"

DomainEventrix.create({
  eventBusKey: "ReactApp",
  enableStateManagement: true
})

// App.tsx
import { EventProvider } from "domain-eventrix/react"
import "./eventrix.config"

function App() {
  return (
    <EventProvider eventBusKey="ReactApp">
      <YourApp />
    </EventProvider>
  )
}
```

#### Use Hooks

```tsx
import { 
  useEventBus,
  useEventContext,
  useEventBusMethods,
  useEventProcessingState
} from "domain-eventrix/react"

function UserComponent() {
  const { publish } = useEventBusMethods()
  
  const handleRegister = () => {
    publish(new UserRegisteredEvent({ name: "John Doe" }))
  }
  
  // Monitor event processing
  useEventProcessingState(state => {
    console.log('Current processing state:', state)
  })
  
  return <button onClick={handleRegister}>Register User</button>
}
```

## Configuration Options

```typescript
DomainEventrix.create({
  eventBusKey?: string,           // Custom event bus identifier
  enableStateManagement?: boolean, // Enable processing state tracking
  enableMonitoringSystem?: boolean,// Enable event monitoring
  enableRetrySystem?: boolean,     // Enable retry strategy
  retryAttempts?: number,         // Number of retry attempts
  initialRetryDelay?: number,     // Initial delay between retries (ms)
  maxRetryDelay?: number,         // Maximum delay between retries (ms)
  deadLetterQueueSize?: number    // Size of dead letter queue
})
```
## [Usage](Usage-docs.md)
## Best Practices

1. **Event Bus Creation**
   - Use `DomainEventrix.create()` at your application's entry point
   - Configure options based on your environment needs

2. **Event Handling**
   - Keep handlers focused and single-purpose
   - Handle errors appropriately in execute methods
   - Use TypeScript for better type safety

3. **React Integration**
   - Initialize configuration before rendering
   - Use hooks for accessing event bus functionality
   - Monitor processing state for better UX

4. **DDD Implementation**
   - Keep aggregates focused and consistent
   - Dispatch events after completing business logic
   - Clear domain events after successful dispatch

## Contributing

We welcome contributions! Please feel free to submit a Pull Request. For major changes, please open an issue first to discuss what you would like to change.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

<!-- ## Support

- Documentation: [Full Documentation](https://github.com/yourusername/domain-eventrix/wiki)
- Issues: [GitHub Issues](https://github.com/yourusername/domain-eventrix/issues)
- Questions: [GitHub Discussions](https://github.com/yourusername/domain-eventrix/discussions) -->
