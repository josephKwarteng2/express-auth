import { plainToInstance } from "class-transformer";
import { validate } from "class-validator";
import { Request, Response, NextFunction } from "express";
import { ClassConstructor } from "class-transformer/types/interfaces";

export const validateDto = (dtoClass: ClassConstructor<object>) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    const dtoInstance = plainToInstance(dtoClass, req.body);
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
