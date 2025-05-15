export interface SerializedException {
  message: string;
  stack?: string;
  cause?: string;
  metadata?: unknown;
  code: string;
}

export class DomainExceptionBase extends Error {
  constructor(
    readonly message: string,
    protected readonly code?: string,
    readonly cause?: Error,
    readonly metadata?: unknown
  ) {
    super(message);
    Error.captureStackTrace(this, this.constructor);
  }
  toSerialized(): SerializedException {
    return {
      cause: JSON.stringify(this.cause),
      message: this.message,
      metadata: this.metadata,
      stack: this.stack,
      code: this.code || "ExceptionBase",
    };
  }
  static toDeserialized(data: SerializedException): DomainExceptionBase {
    return new DomainExceptionBase(
      data.message,
      data.code,
      JSON.parse(data.cause || ""),
      data.metadata
    );
  }
  toJSON(): string {
    return JSON.stringify(this.toSerialized());
  }
  static hasSameError(error: DomainExceptionBase, error2: DomainExceptionBase) {
    return error.code === error2.code;
  }
}
