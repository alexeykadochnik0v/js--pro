import type { Request, Response } from 'express';
import type { CreateTaskInput, IdParam, TasksQuery, UpdateTaskInput } from '../schemas/tasks.js';
import { tasksService } from '../services/tasks.js';
import { error, success } from '../utils/response.js';

export const tasksController = {
  getAll(req: Request, res: Response) {
    const query = req.validated as TasksQuery;
    const tasks = tasksService.findAll(query);
    res.json(success(tasks));
  },

  getById(req: Request, res: Response) {
    const { id } = req.validated as IdParam;
    const task = tasksService.findById(id);

    if (!task) {
      return res.status(404).json(error('Task not found', 404));
    }

    res.json(success(task));
  },

  headById(req: Request, res: Response) {
    const { id } = req.validated as IdParam;
    const task = tasksService.findById(id);

    if (!task) {
      return res.status(404).end();
    }

    res.status(200).end();
  },

  create(req: Request, res: Response) {
    const data = req.validated as CreateTaskInput;
    const task = tasksService.create(data);
    res.status(201).json(success(task));
  },

  update(req: Request, res: Response) {
    const { id } = req.validatedParams as IdParam;
    const body = req.validatedBody as UpdateTaskInput;
    const task = tasksService.update(id, body);

    if (!task) {
      return res.status(404).json(error('Task not found', 404));
    }

    res.json(success(task));
  },

  delete(req: Request, res: Response) {
    const { id } = req.validated as IdParam;
    const deleted = tasksService.delete(id);

    if (!deleted) {
      return res.status(404).json(error('Task not found', 404));
    }

    res.status(204).send();
  },
};
