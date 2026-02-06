import { z } from 'zod';

export const idParamSchema = z.object({
  id: z
    .string()
    .regex(/^\d+$/, 'ID must be a positive integer')
    .transform((val) => parseInt(val, 10)),
});

export const tasksQuerySchema = z.object({
  completed: z.enum(['true', 'false']).optional(),
  search: z.string().optional(),
});

const nonEmptyString = z
  .string()
  .transform((s) => s.trim())
  .refine((s) => s.length > 0, 'Title must be non-empty');

export const createTaskSchema = z.object({
  title: nonEmptyString,
});

export const updateTaskSchema = z.object({
  title: nonEmptyString.optional(),
  completed: z.boolean().optional(),
});

export type IdParam = z.infer<typeof idParamSchema>;
export type TasksQuery = z.infer<typeof tasksQuerySchema>;
export type CreateTaskInput = z.infer<typeof createTaskSchema>;
export type UpdateTaskInput = z.infer<typeof updateTaskSchema>;
