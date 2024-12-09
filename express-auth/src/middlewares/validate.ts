import { plainToClass, plainToInstance } from "class-transformer";
import { validate, ValidationError } from "class-validator";
import { Request, Response, NextFunction } from "express";

export const validateDto = (dtoClass: any) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    const dtoInstance = plainToClass(dtoClass, req.body);
    const errors = await validate(dtoInstance, {
      stopAtFirstError: false,
      validationError: { target: false },
    });

    if (errors.length > 0) {
      return next(errors);
    }

    req.body = dtoInstance;
    next();
  };
};
