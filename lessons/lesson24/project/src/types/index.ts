export interface Task {
  id: number;
  title: string;
  completed: boolean;
  createdAt: number;
}

export type {
  CreateTaskInput,
  UpdateTaskInput,
  TasksQuery,
} from '../schemas/tasks.js';
