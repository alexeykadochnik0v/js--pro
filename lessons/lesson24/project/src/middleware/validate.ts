import type { Request, Response, NextFunction } from 'express';
import type { z, ZodIssue } from 'zod';
import { error } from '../utils/response.js';

type ValidationSource = 'body' | 'query' | 'params';

export function validate<T extends z.ZodTypeAny>(
  schema: T,
  source: ValidationSource,
  key: string = 'validated'
) {
  return (req: Request, res: Response, next: NextFunction) => {
    const raw = req[source];
    const result = schema.safeParse(raw);

    if (result.success) {
      (req as Request & Record<string, z.infer<T>>)[key] = result.data;
      next();
    } else {
      const message = result.error.issues.map((e: ZodIssue) => e.message).join('; ');
      res.status(400).json(error(message, 400));
    }
  };
}
