export function success<T>(data: T, meta: Record<string, unknown> | null = null) {
  const response: {
    success: true;
    data: T;
    error: null;
    meta?: Record<string, unknown>;
  } = {
    success: true,
    data,
    error: null,
  };

  if (meta) {
    response.meta = meta;
  }

  return response;
}

export function error(message: string, code: number = 500) {
  return {
    success: false,
    data: null,
    error: {
      code,
      message,
    },
  };
}
