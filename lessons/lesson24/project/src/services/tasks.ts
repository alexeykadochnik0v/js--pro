import type { Task, CreateTaskInput, UpdateTaskInput, TasksQuery } from '../types/index.js';

const tasks: Task[] = [
  { id: 1, title: 'Изучить Express', completed: false, createdAt: Date.now() },
  { id: 2, title: 'Написать API', completed: false, createdAt: Date.now() },
];

let nextId = 3;

export const tasksService = {
  findAll(query?: TasksQuery): Task[] {
    let result = [...tasks];

    if (query?.completed !== undefined) {
      const completed = query.completed === 'true';
      result = result.filter((t) => t.completed === completed);
    }

    if (query?.search && query.search.trim() !== '') {
      const search = query.search.trim().toLowerCase();
      result = result.filter((t) => t.title.toLowerCase().includes(search));
    }

    return result;
  },

  findById(id: number): Task | undefined {
    return tasks.find((task) => task.id === id);
  },

  create(data: CreateTaskInput): Task {
    const task: Task = {
      id: nextId++,
      title: data.title,
      completed: false,
      createdAt: Date.now(),
    };
    tasks.push(task);
    return task;
  },

  update(id: number, data: UpdateTaskInput): Task | null {
    const task = this.findById(id);
    if (!task) return null;

    if (data.title !== undefined) task.title = data.title;
    if (data.completed !== undefined) task.completed = data.completed;

    return task;
  },

  delete(id: number): boolean {
    const index = tasks.findIndex((task) => task.id === id);
    if (index === -1) return false;

    tasks.splice(index, 1);
    return true;
  },
};
