import { Request, Response, NextFunction, RequestHandler } from 'express';
import { AnyZodObject } from 'zod';

export const validate = (schema: AnyZodObject): RequestHandler => {
  return async (req: Request, _res: Response, next: NextFunction): Promise<void> => {
    try {
      const parsed = await schema.parseAsync({
        body: req.body,
        query: req.query,
        params: req.params,
      });

      // Assign parsed/validated values back to request only if they are defined in the schema
      if (schema && 'shape' in schema) {
        const shape = (schema as any).shape;
        if ('body' in shape) req.body = parsed.body;
        if ('query' in shape) req.query = parsed.query;
        if ('params' in shape) req.params = parsed.params;
      } else {
        req.body = parsed.body;
        req.query = parsed.query;
        req.params = parsed.params;
      }

      next();
    } catch (error) {
      next(error);
    }
  };
};

export default validate;
