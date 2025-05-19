import { getPlatforms } from "./getPlatforms";

export default function (): string {
  if (getPlatforms().isReactNative) {
    const { nanoid } = require("nanoid/non-secure");
    return nanoid();
  } else {
    const { nanoid } = require("nanoid");
    return nanoid();
  }
}
