import { ExceptionBase } from "./ExceptionBase";

export class PermanentEventHandleFailureError extends ExceptionBase {
    code:string = this.constructor.name
}