export class AppError extends Error {
  public readonly statusCode: number;
  public readonly publicMessage: string;
  public readonly internalMessage: string;

  constructor(
    statusCode: number,
    publicMessage: string,
    internalMessage?: string
  ) {
    super(internalMessage ?? publicMessage); // error.message devient internalMessage si fourni, sinon publicMessage
    Object.setPrototypeOf(this, new.target.prototype); // pour que instanceof fonctionne correctement
    this.statusCode = statusCode;
    this.publicMessage = publicMessage;
    this.internalMessage = internalMessage ?? publicMessage;
    Error.captureStackTrace(this, this.constructor);
  }
}

export class ValidationError extends AppError {
  constructor(details: string) {
    super(400, 'Invalid data provided', details);
    Object.setPrototypeOf(this, new.target.prototype);
  }
}

export class UnauthorizedError extends AppError {
  constructor(details: string) {
    super(401, 'Unauthorized access', details);
    Object.setPrototypeOf(this, new.target.prototype);
  }
}

export class NotFoundError extends AppError {
  constructor(resource: string, id?: string) {
    super(
      404,
      'The requested resource was not found',
      `Resource: ${resource}, ID: ${id}`
    );
    Object.setPrototypeOf(this, new.target.prototype);
  }
}

export class ConflictError extends AppError {
  constructor(details: string) {
    super(409, 'A conflict occurred.', details);
    Object.setPrototypeOf(this, new.target.prototype);
  }
}
