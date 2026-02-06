import type { Request, Response, NextFunction } from 'express';
import { error } from '../utils/response.js';

export function errorHandler(
  err: Error & { status?: number },
  _req: Request,
  res: Response,
  _next: NextFunction
) {
  console.error('Error:', err.message);

  if (err instanceof SyntaxError && err.status === 400) {
    return res.status(400).json(error('Invalid JSON', 400));
  }

  res.status(500).json(error('Internal server error', 500));
}
