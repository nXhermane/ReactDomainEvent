import { Config } from "../../constants/Config";
import { IExponentialBackoffStrategy } from "../interfaces/ExponentialBackOfStategy";

export class NullExponentialBackOffStrategy
  implements IExponentialBackoffStrategy
{
  shouldRetry(attempts: number, error: Error): boolean {
    if (Config.mode === "debug")
      console.warn(
        this.constructor.name,
        "shouldRetry called with arguments : ",
        attempts,
        "returning false"
      );
    return false;
  }
  getNextRetryDelay(attempts: number): number {
    if (Config.mode === "debug")
      console.warn(
        this.constructor.name,
        "getNextRetryDelay called with arguments : ",
        attempts,
        "returning 0"
      );
    return 0;
  }
}
