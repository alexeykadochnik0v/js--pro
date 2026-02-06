# Урок 24: Разработка собственного API

Практика по вебинару — Express.js, CRUD, валидация, обработка ошибок. Проект на **TypeScript**.

## Структура

```
api-demo/
├── package.json
├── tsconfig.json
├── src/
│   ├── index.ts           # Точка входа
│   ├── types/
│   │   └── index.ts       # Типы Task, query и т.д.
│   ├── routes/
│   │   └── tasks.ts       # Роуты для /api/tasks
│   ├── controllers/
│   │   └── tasks.ts       # Обработчики запросов
│   ├── services/
│   │   └── tasks.ts       # Бизнес-логика и in-memory хранилище
│   ├── middleware/
│   │   └── errorHandler.ts
│   └── utils/
│       └── response.ts    # success() / error()
```

## Установка и запуск

```bash
npm install
npm run dev    # режим разработки (tsx watch)
# или
npm run build && npm start
```

Сервер: `http://localhost:3000`

## API

| Метод  | URL                  | Описание                    |
|--------|----------------------|-----------------------------|
| GET    | /api/tasks           | Список задач (поддержка ?completed= & ?search=) |
| GET    | /api/tasks/:id       | Задача по ID                |
| HEAD   | /api/tasks/:id       | Проверка существования (200/404 без тела) |
| POST   | /api/tasks           | Создать задачу              |
| PATCH  | /api/tasks/:id       | Частично обновить           |
| DELETE | /api/tasks/:id       | Удалить задачу              |

## Примеры запросов (curl)

```bash
# Все задачи
curl http://localhost:3000/api/tasks

# С фильтром и поиском
curl "http://localhost:3000/api/tasks?completed=false"
curl "http://localhost:3000/api/tasks?search=express"

# По ID
curl http://localhost:3000/api/tasks/1

# Проверка существования (HEAD)
curl -I http://localhost:3000/api/tasks/1

# Создать
curl -X POST http://localhost:3000/api/tasks \
  -H "Content-Type: application/json" \
  -d '{"title": "Новая задача"}'

# Обновить
curl -X PATCH http://localhost:3000/api/tasks/1 \
  -H "Content-Type: application/json" \
  -d '{"completed": true}'

# Удалить
curl -X DELETE http://localhost:3000/api/tasks/1
```

## Формат ответов

Успех:

```json
{
  "success": true,
  "data": { ... },
  "error": null
}
```

Ошибка:

```json
{
  "success": false,
  "data": null,
  "error": { "code": 404, "message": "Task not found" }
}
```

## Практика по уроку

См. [practice.md](./practice.md) — задания и разбор типичных ошибок по слайдам вебинара.
