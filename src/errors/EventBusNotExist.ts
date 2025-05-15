import { DomainExceptionBase } from "./ExceptionBase";

export class EventBusNotExist extends DomainExceptionBase {
    code = "EventBusNotFound"
}