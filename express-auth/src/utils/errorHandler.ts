import { ValidationError } from "class-validator";
import { Request, Response, NextFunction } from "express";
import { QueryFailedError } from "typeorm";

export class AppError extends Error {
  statusCode: number;
  status: string;
  isOperational: boolean;

  constructor(message: string, statusCode: number) {
    super(message);
    this.statusCode = statusCode;
    this.status = `${statusCode}`.startsWith("4") ? "fail" : "error";
    this.isOperational = true;

    Error.captureStackTrace(this, this.constructor);
  }
}

export const handleValidationError = (errors: ValidationError[]) => {
  const firstError = errors[0];
  const formattedError = {
    path: firstError.property,
    messages: firstError.constraints
      ? Object.values(firstError.constraints)
      : [],
  };

  return new AppError(
    JSON.stringify({
      status: "fail",
      errors: [formattedError],
    }),
    400
  );
};

export const globalErrorHandler = (
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  console.error(err);

  let error: AppError;

  if (
    err instanceof ValidationError ||
    (Array.isArray(err) && err[0] instanceof ValidationError)
  ) {
    error = handleValidationError(Array.isArray(err) ? err : [err]);
  } else if (err instanceof QueryFailedError) {
    const errorCode = (err as any).code;
    switch (errorCode) {
      case "23505":
        error = new AppError(
          JSON.stringify({
            status: "fail",
            errors: [
              {
                path: "unique",
                messages: ["A record with this unique value already exists"],
              },
            ],
          }),
          409
        );
        break;
      default:
        error = new AppError(
          JSON.stringify({
            status: "fail",
            errors: [
              {
                path: "database",
                messages: ["Database error occurred"],
              },
            ],
          }),
          500
        );
    }
  } else if (err instanceof AppError) {
    error = err;
  } else {
    error = new AppError(
      JSON.stringify({
        status: "fail",
        errors: [
          {
            path: "server",
            messages: ["Internal server error"],
          },
        ],
      }),
      500
    );
  }

  res.status(error.statusCode).json(JSON.parse(error.message));
};

export const catchAsync = (
  fn: (req: Request, res: Response, next: NextFunction) => Promise<any>
) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    fn(req, res, next).catch(next);
  };
};
