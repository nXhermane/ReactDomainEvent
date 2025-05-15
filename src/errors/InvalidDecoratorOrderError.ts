import { DomainExceptionBase } from "./ExceptionBase";

export class InvalidDecoratorOrderError extends DomainExceptionBase {
  code: string = "InvalidDecoratorOrderError";
  constructor(
    decoratorName: string,
    requiredOrder: string,
    handlerName: string
  ) {
    super(
      `Invalid decorator order : The '${decoratorName}' decorator must be applied after '${requiredOrder}'\n` +
        `Exemple of correct usage:\n\n` +
        `@${decoratorName}({...})\n@${requiredOrder}({...})\nclass ${handlerName} {...}`
    );
  }
}
