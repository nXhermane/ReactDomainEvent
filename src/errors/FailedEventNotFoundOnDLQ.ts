import { ExceptionBase } from "./ExceptionBase";

export class FailedEventNotFoundOnDLQ extends ExceptionBase {
    code: string = "FailedEventNotFoundOnDLQ";
    
}