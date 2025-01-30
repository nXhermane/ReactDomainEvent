import React from 'react';
import { render, act } from '@testing-library/react';
import { EventContext, EventProvider } from "./../../../src/react"
import { DomainEventrix } from '../../../src/DomainEventrix';
// Ne pas mocker DomainEventrix cette fois
class TestEvent {
  constructor(public readonly id: string, public readonly data: any) {}
}

describe('EventProvider Integration Tests', () => {
  const defaultProps = {
    eventBusKey: 'integration-test-bus',
    enableMonitoringSystem: true,
    enableRetrySystem: true,
    enableStateManagement: true,
    maxEventOnDQL: 100,
    maxAttempts: 3,
    maxDelay: 1000,
    onDeadLetter: jest.fn()
  };

  beforeEach(() => {
    // Nettoyage des éventuelles instances précédentes
    DomainEventrix
  });

  it('should properly initialize and handle real events', async () => {
    let contextValue: any;
    const eventHandler = jest.fn();
    
    const TestConsumer = () => {
      contextValue = React.useContext(EventContext);
      
      React.useEffect(() => {
        contextValue.eventBus.subscribe(TestEvent, eventHandler);
      }, []);
      
      return null;
    };

    render(
      <EventProvider {...defaultProps}>
        <TestConsumer />
      </EventProvider>
    );

    const testEvent = new TestEvent('test-1', { message: 'test' });
    
    await act(async () => {
      await contextValue.eventBus.publish(testEvent);
    });

    expect(eventHandler).toHaveBeenCalledWith(testEvent);
  });

  it('should track event processing state with real events', async () => {
    let contextValue: any;
    let states: any[] = [];
    
    const TestConsumer = () => {
      contextValue = React.useContext(EventContext);
      
      React.useEffect(() => {
        contextValue.eventBus.subscribe(TestEvent, async (event) => {
          // Simuler un traitement asynchrone
          await new Promise(resolve => setTimeout(resolve, 100));
        });
      }, []);

      // Capturer les changements d'état
      React.useEffect(() => {
        states.push([...contextValue.eventProcessingState]);
      }, [contextValue.eventProcessingState]);
      
      return null;
    };

    render(
      <EventProvider {...defaultProps}>
        <TestConsumer />
      </EventProvider>
    );

    const testEvent = new TestEvent('test-2', { message: 'test' });
    
    await act(async () => {
      await contextValue.eventBus.publish(testEvent);
      // Attendre que le traitement soit terminé
      await new Promise(resolve => setTimeout(resolve, 200));
    });

    // Vérifier les différents états
    expect(states.length).toBeGreaterThan(1);
    expect(states[0]).toEqual([]); // État initial
    // Le dernier état devrait montrer l'événement comme traité
    expect(states[states.length - 1]).toEqual([]);
  });

  it('should handle multiple event buses correctly', async () => {
    let contextValue1: any;
    let contextValue2: any;
    
    const handler1 = jest.fn();
    const handler2 = jest.fn();
    
    const TestConsumer1 = () => {
      contextValue1 = React.useContext(EventContext);
      React.useEffect(() => {
        contextValue1.eventBus.subscribe(TestEvent, handler1);
      }, []);
      return null;
    };

    const TestConsumer2 = () => {
      contextValue2 = React.useContext(EventContext);
      React.useEffect(() => {
        contextValue2.eventBus.subscribe(TestEvent, handler2);
      }, []);
      return null;
    };

    render(
      <>
        <EventProvider {...defaultProps} eventBusKey="bus-1">
          <TestConsumer1 />
        </EventProvider>
        <EventProvider {...defaultProps} eventBusKey="bus-2">
          <TestConsumer2 />
        </EventProvider>
      </>
    );

    const testEvent = new TestEvent('test-3', { message: 'test' });
    
    await act(async () => {
      await contextValue1.eventBus.publish(testEvent);
    });

    expect(handler1).toHaveBeenCalledWith(testEvent);
    expect(handler2).not.toHaveBeenCalled();
  });

  it('should handle retry system with real events', async () => {
    let contextValue: any;
    let failedAttempts = 0;
    
    const TestConsumer = () => {
      contextValue = React.useContext(EventContext);
      
      React.useEffect(() => {
        contextValue.eventBus.subscribe(TestEvent, async () => {
          failedAttempts++;
          if (failedAttempts <= 2) {
            throw new Error('Simulated failure');
          }
        });
      }, []);
      
      return null;
    };

    render(
      <EventProvider {...defaultProps} maxAttempts={3}>
        <TestConsumer />
      </EventProvider>
    );

    const testEvent = new TestEvent('test-4', { message: 'retry test' });
    
    await act(async () => {
      await contextValue.eventBus.publish(testEvent);
      // Attendre que les tentatives soient terminées
      await new Promise(resolve => setTimeout(resolve, 1000));
    });

    expect(failedAttempts).toBe(3);
  });
});