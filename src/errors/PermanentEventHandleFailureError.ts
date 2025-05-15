import { DomainExceptionBase } from "./ExceptionBase";

export class PermanentEventHandleFailureError extends DomainExceptionBase {
    code:string = "PermanentEventHandleFailureError"
}