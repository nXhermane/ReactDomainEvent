export function getPlatforms() {
  return {
    isWeb: typeof window !== "undefined" && typeof document !== "undefined",
    isReactNative:
      typeof navigator !== "undefined" &&
      typeof navigator.product !== "undefined",
  };
}
