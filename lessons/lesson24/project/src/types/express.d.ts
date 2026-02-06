declare global {
  namespace Express {
    interface Request {
      validated?: unknown;
      validatedParams?: unknown;
      validatedBody?: unknown;
    }
  }
}

export {};
