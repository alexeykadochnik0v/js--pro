---
title: "Урок 24: Разработка собственного API"
description: "Express.js, CRUD, валидация, обработка ошибок"
---

# Разработка собственного API

## Express.js, CRUD, валидация и обработка ошибок

<!-- v -->

## Как меня слышно и видно?

> Напишите в чат

- **+** если все хорошо
- **–** если есть проблемы со звуком или с видео

<!-- v -->

## Цели занятия

- Понять, что такое API и зачем он нужен
- Научиться создавать HTTP-сервер на Express.js
- Реализовать полный CRUD для ресурса
- Освоить валидацию входных данных
- Настроить корректную обработку ошибок и HTTP-статусы
- Использовать единый формат ответов

<!-- v -->

## Краткое содержание

- Что такое API и REST (базовые принципы)
- Express.js: минимальная настройка
- CRUD-операции на примере сущности tasks
- HTTP-методы и статус-коды
- Валидация входных данных
- Обработка ошибок и middleware
- Единый формат ответов
- Типичные ошибки при разработке API

<!-- v -->

## Результат занятия

Работающий REST API с CRUD-операциями для сущности tasks, валидацией данных и корректной обработкой ошибок

<!-- v -->

## Компетенции по занятию

- **Строить REST API**
- **Уметь писать CRUD-операции**
- **Уметь писать серверный JavaScript-код**
- Применять валидацию и обработку ошибок
- Использовать правильные HTTP-статусы

<!-- s -->

## Глоссарий

| Термин          | Описание                                                                           |
| --------------- | ---------------------------------------------------------------------------------- |
| **API**         | Application Programming Interface — интерфейс для взаимодействия между программами |
| **REST**        | Архитектурный стиль для построения веб-сервисов                                    |
| **Endpoint**    | URL-адрес, по которому доступен ресурс                                             |
| **Resource**    | Сущность, с которой работает API (users, tasks, orders)                            |
| **CRUD**        | Create, Read, Update, Delete — базовые операции с данными                          |
| **Middleware**  | Промежуточная функция, обрабатывающая запрос до контроллера                        |
| **Idempotency** | Свойство операции давать одинаковый результат при повторных вызовах                |

<!-- s -->

# Что такое API?

<!-- v -->

## API — интерфейс между программами

**API** (Application Programming Interface) — набор правил и механизмов для взаимодействия между программами

**Примеры API:**

- Браузерные API: `fetch()`, `localStorage`, `DOM`
- Библиотечные API: методы React, Lodash
- Сетевые API: GitHub API, Telegram API, ваш собственный backend

**В этом уроке:** создаём HTTP API — сервер, принимающий запросы и возвращающий данные

<!-- v -->

## REST — стиль построения API

**REST** (Representational State Transfer) — архитектурный подход

**Ключевые принципы:**

- **Ресурсы** — всё есть ресурс (users, tasks, products)
- **URL = идентификатор ресурса** — `/api/tasks/123`
- **HTTP-методы = действия** — GET читает, POST создаёт
- **Stateless** — сервер не хранит состояние клиента между запросами
- **JSON** — стандартный формат обмена данными

> Детальнее REST, RPC и сетевые запросы — в следующем уроке

<!-- s -->

## HTTP-методы и CRUD

| Метод      | CRUD   | Описание                  | Idempotent |
| ---------- | ------ | ------------------------- | ---------- |
| **GET**    | Read   | Получить данные           | ✅ Да      |
| **POST**   | Create | Создать ресурс            | ❌ Нет     |
| **PUT**    | Update | Полностью заменить ресурс | ✅ Да      |
| **PATCH**  | Update | Частично обновить ресурс  | ✅ Да      |
| **DELETE** | Delete | Удалить ресурс            | ✅ Да      |

**Idempotent** — повторный вызов даёт тот же результат

<!-- v -->

## HTTP статус-коды

**2xx — успех:**

- `200 OK` — успешный запрос
- `201 Created` — ресурс создан
- `204 No Content` — успешно, но тело ответа пустое

**4xx — ошибка клиента:**

- `400 Bad Request` — некорректные данные
- `404 Not Found` — ресурс не найден
- `422 Unprocessable Entity` — валидация не пройдена

**5xx — ошибка сервера:**

- `500 Internal Server Error` — необработанная ошибка

<!-- s -->

# Express.js

## Минимальный HTTP-сервер

<!-- v -->

## Почему Express?

**Express.js** — минималистичный фреймворк для Node.js

**Преимущества:**

- Простой и понятный API
- Большая экосистема middleware
- Низкий порог входа
- Подходит для обучения основам

**Альтернативы:** Fastify, Koa, Hono

> В следующих уроках познакомимся с NestJS — фреймворком корпоративного уровня

<!-- v -->

## Структура проекта

```
api-demo/
├── package.json
├── src/
│   ├── index.js          # Точка входа
│   ├── routes/
│   │   └── tasks.js      # Роуты для tasks
│   ├── controllers/
│   │   └── tasks.js      # Логика обработки запросов
│   ├── services/
│   │   └── tasks.js      # Бизнес-логика и хранилище
│   ├── middleware/
│   │   └── errorHandler.js
│   └── utils/
│       └── response.js   # Формат ответов
```

**Принцип:** разделение ответственности (routes → controllers → services)

<!-- v -->

## Инициализация проекта

```bash
mkdir api-demo && cd api-demo
npm init -y
npm install express
```

**package.json:**

```json
{
  "name": "api-demo",
  "type": "module",
  "scripts": {
    "start": "node src/index.js",
    "dev": "node --watch src/index.js"
  },
  "dependencies": {
    "express": "^5.0.0"
  }
}
```

<!-- s -->

## Точка входа: src/index.js

```javascript
import express from "express";
import tasksRouter from "./routes/tasks.js";
import { errorHandler } from "./middleware/errorHandler.js";

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware для парсинга JSON
app.use(express.json());

// Роуты
app.use("/api/tasks", tasksRouter);

// Обработчик ошибок (должен быть последним)
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
```

<!-- s -->

# CRUD на примере tasks

## Полный цикл операций

## Практика

<!-- v -->

## Сервис: src/services/tasks.js

**In-memory хранилище данных:**

```javascript
// Хранилище данных (вместо БД)
let tasks = [
  { id: 1, title: "Изучить Express", completed: false, createdAt: Date.now() },
  { id: 2, title: "Написать API", completed: false, createdAt: Date.now() },
];

let nextId = 3;

export const tasksService = {
  // Получить все задачи
  findAll() {
    return tasks;
  },

  // Получить задачу по ID
  findById(id) {
    return tasks.find((task) => task.id === id);
  },

  // Создать задачу
  create(data) {
    const task = {
      id: nextId++,
      title: data.title,
      completed: false,
      createdAt: Date.now(),
    };
    tasks.push(task);
    return task;
  },

  // Обновить задачу
  update(id, data) {
    const task = this.findById(id);
    if (!task) return null;

    if (data.title !== undefined) task.title = data.title;
    if (data.completed !== undefined) task.completed = data.completed;

    return task;
  },

  // Удалить задачу
  delete(id) {
    const index = tasks.findIndex((task) => task.id === id);
    if (index === -1) return false;

    tasks.splice(index, 1);
    return true;
  },
};
```

<!-- v -->

## Контроллер: src/controllers/tasks.js

```javascript
import { tasksService } from "../services/tasks.js";
import { success, error } from "../utils/response.js";

export const tasksController = {
  // GET /api/tasks
  getAll(req, res) {
    const tasks = tasksService.findAll();
    res.json(success(tasks));
  },

  // GET /api/tasks/:id
  getById(req, res) {
    const id = parseInt(req.params.id);
    const task = tasksService.findById(id);

    if (!task) {
      return res.status(404).json(error("Task not found", 404));
    }

    res.json(success(task));
  },

  // POST /api/tasks
  create(req, res) {
    const { title } = req.body;

    // Валидация
    if (!title || typeof title !== "string" || title.trim() === "") {
      return res.status(400).json(error("Title is required", 400));
    }

    const task = tasksService.create({ title: title.trim() });
    res.status(201).json(success(task));
  },

  // PATCH /api/tasks/:id
  update(req, res) {
    const id = parseInt(req.params.id);
    const { title, completed } = req.body;

    // Валидация title если передан
    if (
      title !== undefined &&
      (typeof title !== "string" || title.trim() === "")
    ) {
      return res
        .status(400)
        .json(error("Title must be a non-empty string", 400));
    }

    // Валидация completed если передан
    if (completed !== undefined && typeof completed !== "boolean") {
      return res.status(400).json(error("Completed must be a boolean", 400));
    }

    const task = tasksService.update(id, { title: title?.trim(), completed });

    if (!task) {
      return res.status(404).json(error("Task not found", 404));
    }

    res.json(success(task));
  },

  // DELETE /api/tasks/:id
  delete(req, res) {
    const id = parseInt(req.params.id);
    const deleted = tasksService.delete(id);

    if (!deleted) {
      return res.status(404).json(error("Task not found", 404));
    }

    res.status(204).send();
  },
};
```

<!-- v -->

## Роуты: src/routes/tasks.js

```javascript
import { Router } from "express";
import { tasksController } from "../controllers/tasks.js";

const router = Router();

// GET /api/tasks — список всех задач
router.get("/", tasksController.getAll);

// GET /api/tasks/:id — получить задачу по ID
router.get("/:id", tasksController.getById);

// POST /api/tasks — создать задачу
router.post("/", tasksController.create);

// PATCH /api/tasks/:id — обновить задачу
router.patch("/:id", tasksController.update);

// DELETE /api/tasks/:id — удалить задачу
router.delete("/:id", tasksController.delete);

export default router;
```

<!-- s -->

## Единый формат ответов

**src/utils/response.js:**

```javascript
// Успешный ответ
export function success(data, meta = null) {
  const response = {
    success: true,
    data,
    error: null,
  };

  if (meta) {
    response.meta = meta;
  }

  return response;
}

// Ответ с ошибкой
export function error(message, code = 500) {
  return {
    success: false,
    data: null,
    error: {
      code,
      message,
    },
  };
}
```

<!-- v -->

## Примеры ответов API

**Успешный ответ (GET /api/tasks):**

```json
{
  "success": true,
  "data": [
    { "id": 1, "title": "Изучить Express", "completed": false },
    { "id": 2, "title": "Написать API", "completed": false }
  ],
  "error": null
}
```

**Ответ с ошибкой (GET /api/tasks/999):**

```json
{
  "success": false,
  "data": null,
  "error": {
    "code": 404,
    "message": "Task not found"
  }
}
```

<!-- s -->

## Обработка ошибок

**src/middleware/errorHandler.js:**

```javascript
import { error } from "../utils/response.js";

export function errorHandler(err, req, res, next) {
  console.error("Error:", err.message);

  // Ошибка парсинга JSON
  if (err instanceof SyntaxError && err.status === 400) {
    return res.status(400).json(error("Invalid JSON", 400));
  }

  // Общая ошибка сервера
  res.status(500).json(error("Internal server error", 500));
}
```

**Важно:** обработчик ошибок должен быть подключён **последним** в цепочке middleware

<!-- v -->

## Async-обёртка для обработки ошибок

**Для асинхронных контроллеров:**

```javascript
// src/utils/asyncHandler.js
export function asyncHandler(fn) {
  return (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
}

// Использование в роутах
import { asyncHandler } from "../utils/asyncHandler.js";

router.get("/", asyncHandler(tasksController.getAll));
router.post("/", asyncHandler(tasksController.create));
```

**Любая ошибка в async-функции попадёт в errorHandler**

<!-- s -->

## Тестирование API

**С помощью curl:**

```bash
# Получить все задачи
curl http://localhost:3000/api/tasks

# Получить задачу по ID
curl http://localhost:3000/api/tasks/1

# Создать задачу
curl -X POST http://localhost:3000/api/tasks \
  -H "Content-Type: application/json" \
  -d '{"title": "Новая задача"}'

# Обновить задачу
curl -X PATCH http://localhost:3000/api/tasks/1 \
  -H "Content-Type: application/json" \
  -d '{"completed": true}'

# Удалить задачу
curl -X DELETE http://localhost:3000/api/tasks/1
```

<!-- v -->

## Инструменты для тестирования API

**GUI-инструменты:**

- **Postman** — популярный клиент для API
- **Insomnia** — лёгкая альтернатива
- **Thunder Client** — расширение для VS Code

**Расширения VS Code:**

- REST Client — отправка запросов прямо из `.http` файлов

<!-- s -->

# Типичные ошибки

> Примеры ниже упрощены для наглядности (в одном файле)

<!-- v -->

## Ошибка #1: Всегда 200 OK

```javascript
// ❌ Плохо — всегда 200
app.get("/api/tasks/:id", (req, res) => {
  const task = tasks.find((t) => t.id === parseInt(req.params.id));
  res.json({ data: task }); // task может быть undefined
});

// ✅ Хорошо — корректный статус
app.get("/api/tasks/:id", (req, res) => {
  const task = tasks.find((t) => t.id === parseInt(req.params.id));

  if (!task) {
    return res.status(404).json({ error: "Task not found" });
  }

  res.json({ data: task });
});
```

<!-- v -->

## Ошибка #2: Нет return после res.send()

```javascript
// ❌ Плохо — код продолжает выполняться
app.post("/api/tasks", (req, res) => {
  if (!req.body.title) {
    res.status(400).json({ error: "Title required" });
    // Ошибка: Cannot set headers after they are sent
  }

  const task = createTask(req.body);
  res.status(201).json(task);
});

// ✅ Хорошо — используем return
app.post("/api/tasks", (req, res) => {
  if (!req.body.title) {
    return res.status(400).json({ error: "Title required" });
  }

  const task = createTask(req.body);
  res.status(201).json(task);
});
```

<!-- v -->

## Ошибка #3: PUT вместо PATCH

```javascript
// PUT — полная замена ресурса
// Если не передать поле, оно будет удалено/сброшено
app.put("/api/tasks/:id", (req, res) => {
  const task = { id: req.params.id, ...req.body }; // Полная замена
  res.json(task);
});

// PATCH — частичное обновление
// Обновляются только переданные поля
app.patch("/api/tasks/:id", (req, res) => {
  const task = findTask(req.params.id);
  Object.assign(task, req.body); // Частичное обновление
  res.json(task);
});
```

**Выбор:** зависит от контракта API — PUT для полной замены, PATCH для частичного обновления

<!-- v -->

## Ошибка #4: Отсутствие валидации

```javascript
// ❌ Плохо — нет валидации
app.post("/api/tasks", (req, res) => {
  const task = { id: nextId++, ...req.body };
  tasks.push(task);
  res.json(task);
});

// ✅ Хорошо — валидация есть
app.post("/api/tasks", (req, res) => {
  const { title } = req.body;

  if (!title || typeof title !== "string") {
    return res.status(400).json({ error: "Title is required" });
  }

  if (title.length > 200) {
    return res.status(400).json({ error: "Title too long (max 200)" });
  }

  const task = { id: nextId++, title: title.trim(), completed: false };
  tasks.push(task);
  res.status(201).json(task);
});
```

<!-- v -->

## Ошибка #5: Смешивание слоёв

```javascript
// ❌ Плохо — всё в одном месте
app.get("/api/tasks", (req, res) => {
  const tasks = db.query("SELECT * FROM tasks"); // БД в роуте
  const filtered = tasks.filter((t) => t.active); // Логика в роуте
  res.json(filtered);
});

// ✅ Хорошо — разделение ответственности
// routes/tasks.js — только маршрутизация
router.get("/", tasksController.getAll);

// controllers/tasks.js — обработка HTTP
getAll(req, res) {
  const tasks = tasksService.findAll();
  res.json(tasks);
}

// services/tasks.js — бизнес-логика
findAll() {
  return this.tasks.filter(t => t.active);
}
```

<!-- s -->

# Практика

<!-- v -->

## Разберем: как расширить API

1. **Фильтрация по статусу:**

   - `GET /api/tasks?completed=true` — только выполненные
   - `GET /api/tasks?completed=false` — только невыполненные

2. **Поиск по title:**

   - `GET /api/tasks?search=express` — поиск подстроки

3. **Проверка существования:**
   - `HEAD /api/tasks/:id` — вернуть 200 или 404 без тела

<!-- s -->

## Итоги занятия

Сегодня мы научились:

- Создавать HTTP-сервер на Express.js
- Реализовывать CRUD-операции
- Использовать правильные HTTP-методы и статус-коды
- Валидировать входные данные
- Обрабатывать ошибки через middleware
- Формировать единый формат ответов API

**Следующий урок:** REST, RPC и сетевые запросы — глубже про архитектуру API

<!-- s -->

## Дополнительные материалы

- [Express.js Documentation](https://expressjs.com/)
- [HTTP Status Codes](https://developer.mozilla.org/en-US/docs/Web/HTTP/Status)
- [REST API Best Practices](https://restfulapi.net/)
- [JSON API Specification](https://jsonapi.org/)

<!-- s -->

## Q&A

**Вопросы?**

- Как работает Express middleware?
- В чём разница PUT и PATCH?
- Как организовать структуру большого API?
- Какие ещё HTTP-статусы важны?
