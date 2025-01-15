export interface SerializedException {
  message: string;
  stack?: string;
  cause?: string;
  metadata?: unknown;
  code: string;
}

export class ExceptionBase extends Error {
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
  static toDeserialized(data: SerializedException): ExceptionBase {
    return new ExceptionBase(
      data.message,
      data.code,
      JSON.parse(data.cause || ""),
      data.metadata
    );
  }
  toJSON(): string {
    return JSON.stringify(this.toSerialized());
  }
  static hasSameError(error: ExceptionBase, error2: ExceptionBase) {
    return error.code === error2.code;
  }
}
