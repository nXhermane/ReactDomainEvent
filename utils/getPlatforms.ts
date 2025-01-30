export function getPlatforms() {
  return {
    isWeb: typeof window !== "undefined" && typeof document !== "undefined",
    isNode:
      typeof process !== "undefined" &&
      process.versions &&
      process.versions.node,
    isReactNative:
      typeof navigator !== "undefined" && navigator.product === "ReactNative",
  };
}
