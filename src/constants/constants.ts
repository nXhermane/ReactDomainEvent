export const Constants = {
  handlerMetaDataKey: "handler",
  eventMessageOption: "domainEventMessage",
  // constante du Exponential Back off Strategy
  maxAttempts: 5,
  baseDelay: 1000,
  maxDelay: 1000 * 60 * 60, // 1 Hours

  // constante du DQL
  maxEventOnDQL: 1000,
};
