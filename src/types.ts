import { FailedEvent } from "./interfaces/DeadLetterQueue";

export type OnDeadLetter =  (event: FailedEvent<any>) => Promise<void>