import { Constants } from "../../../src/constants/constants";
import { EnhancedEventBus } from "../../../src";
import {describe,test,it,expect} from "@jest/globals"
describe("Constants Utility Functions and Properties", () => {
  it("should return the correct handler metadata key", () => {
    expect(Constants.handlerMetaDataKey).toBe("handler");
  });

  it("should return the correct event bus metadata key", () => {
    expect(Constants.handlerEventBusMetaDataKey).toBe("eventBus");
  });

  it("should return the correct domain event message option key", () => {
    expect(Constants.eventMessageOption).toBe("domainEventMessage");
  });

  it("should return the correct default event bus key", () => {
    expect(Constants.eventBusDefaultKey).toBe("SharedEnhancedEventBus");
  });

  it("should return the correct processing key for a string key", () => {
    const key = "eventBus";
    expect(Constants.getEventProcessingKey(key)).toBe(
      `${key}-EventProcessingStateManager`
    );
  });

  it("should return the correct processing key for a class reference", () => {
    const expectedKey = `${EnhancedEventBus.name}-EventProcessingStateManager`;
    expect(Constants.getEventProcessingKey(EnhancedEventBus)).toBe(expectedKey);
  });
  

  it("should return the correct max attempts for exponential backoff", () => {
    expect(Constants.maxAttempts).toBe(5);
  });

  it("should return the correct base delay for exponential backoff", () => {
    expect(Constants.baseDelay).toBe(1000);
  });

  it("should return the correct maximum delay for exponential backoff", () => {
    expect(Constants.maxDelay).toBe(1000 * 60 * 60);
  });

  it("should return the correct maximum number of events on the DQL", () => {
    expect(Constants.maxEventOnDQL).toBe(1000);
  });
});
