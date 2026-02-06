import type { NextFunction, Request, Response } from 'express';
import { error } from '../utils/response.js';

export function errorHandler(
  err: Error & { status?: number },
  _req: Request,
  res: Response,
  _next: NextFunction
) {
  // logger + sentry(error tracker) + monitoring и т.д. ит.д.
  console.error('Error:', err.message);

  if (err instanceof SyntaxError && err.status === 400) {
    return res.status(400).json(error('Invalid JSON', 400));
  }

  res.status(500).json(error('Internal server error', 500));
}
