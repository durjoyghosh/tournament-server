export class AppError extends Error {
  public readonly statusCode: number;
  public readonly isOperational: boolean;

  constructor(statusCode: number, message: string, isOperational = true, stack = '') {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = isOperational;

    if (stack) {
      this.stack = stack;
    } else {
      Error.captureStackTrace(this.prefixedStackCarrier || this, this.constructor);
    }
  }

  // Helper getter to avoid standard type warnings
  private get prefixedStackCarrier() {
    return this as unknown as Record<string, unknown>;
  }
}
export default AppError;
