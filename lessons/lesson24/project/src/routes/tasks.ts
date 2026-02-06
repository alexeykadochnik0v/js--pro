import { Router } from 'express';
import { tasksController } from '../controllers/tasks.js';
import { validate } from '../middleware/validate.js';
import {
  createTaskSchema,
  idParamSchema,
  tasksQuerySchema,
  updateTaskSchema,
} from '../schemas/tasks.js';

const router = Router();

// GET / - все таски
router.get('/', validate(tasksQuerySchema, 'query'), tasksController.getAll.bind(tasksController));

// GET /:id - получаем таску по id
router.get(
  '/:id',
  validate(idParamSchema, 'params'),
  tasksController.getById.bind(tasksController)
);

// /:id - получаем таску по id
router.head(
  '/:id',
  validate(idParamSchema, 'params'),
  tasksController.headById.bind(tasksController)
);

// POST / - создаем таску
router.post('/', validate(createTaskSchema, 'body'), tasksController.create.bind(tasksController));

// PATCH /:id - обновляем таску
router.patch(
  '/:id',
  validate(idParamSchema, 'params', 'validatedParams'),
  validate(updateTaskSchema, 'body', 'validatedBody'),
  tasksController.update.bind(tasksController)
);

// DELETE /:id - обновляем таску
router.delete(
  '/:id',
  validate(idParamSchema, 'params'),
  tasksController.delete.bind(tasksController)
);

export default router;
