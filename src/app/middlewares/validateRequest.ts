import { NextFunction, Request, Response } from 'express';
import { AnyZodObject } from 'zod';
import catchAsync from '../utils/catchAsync';

const validateRequest = (schema: AnyZodObject) => {
  
  return catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    // console.log('payload=>', req?.body);
    console.log('tokens=>', req?.cookies);
    await schema.parseAsync({
      body: req.body,
      cookies: req.cookies,
    });

    next();
  });
};

export default validateRequest;