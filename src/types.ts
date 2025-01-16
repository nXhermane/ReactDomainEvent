import { FailedEvent } from "./interfaces/DeadLetterQueue";

export type OnDeadLetter =  (event: FailedEvent<any>) => Promise<void>
export type Constructor<T> = new (...args: any[]) => T;