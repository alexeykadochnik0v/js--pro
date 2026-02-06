import { Router } from 'express';
import { tasksController } from '../controllers/tasks.js';
import { validate } from '../middleware/validate.js';
import {
  idParamSchema,
  tasksQuerySchema,
  createTaskSchema,
  updateTaskSchema,
} from '../schemas/tasks.js';

const router = Router();

router.get('/', validate(tasksQuerySchema, 'query'), tasksController.getAll.bind(tasksController));
router.get(
  '/:id',
  validate(idParamSchema, 'params'),
  tasksController.getById.bind(tasksController)
);
router.head(
  '/:id',
  validate(idParamSchema, 'params'),
  tasksController.headById.bind(tasksController)
);
router.post('/', validate(createTaskSchema, 'body'), tasksController.create.bind(tasksController));
router.patch(
  '/:id',
  validate(idParamSchema, 'params', 'validatedParams'),
  validate(updateTaskSchema, 'body', 'validatedBody'),
  tasksController.update.bind(tasksController)
);
router.delete(
  '/:id',
  validate(idParamSchema, 'params'),
  tasksController.delete.bind(tasksController)
);

export default router;
