import { DomainExceptionBase } from "./ExceptionBase";

export class FailedEventNotFoundOnDLQ extends DomainExceptionBase {
    code: string = "FailedEventNotFoundOnDLQ";
    
}