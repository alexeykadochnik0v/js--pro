---
title: "Урок 25: REST, RPC и сетевые запросы"
description: "Архитектура API, fetch, axios, обработка ошибок"
---

# REST, RPC и сетевые запросы

## Архитектура API и работа с сетью

<!-- v -->

## Как меня слышно и видно?

> Напишите в чат

- **+** если все хорошо
- **–** если есть проблемы со звуком или с видео

<!-- v -->

## Цели занятия

- Понять архитектурные принципы REST
- Сравнить REST и RPC подходы
- Освоить Fetch API и axios
- Разобраться с CORS и обработкой ошибок

<!-- v -->

## Краткое содержание

- REST: принципы и ограничения
- RPC: JSON-RPC, gRPC
- Fetch API и Axios
- Обработка ошибок
- CORS

<!-- v -->

## Результат занятия

Понимание архитектуры API и умение работать с сетевыми запросами на клиенте

<!-- v -->

## Компетенции по занятию

- **Понимать архитектуру REST API**
- **Использовать Fetch API и axios**
- Обрабатывать ошибки сетевых запросов
- Работать с заголовками и CORS

<!-- s -->

# REST: Архитектура

<!-- v -->

## Что такое REST?

**REST** (Representational State Transfer) — архитектурный стиль, а не протокол

**Ключевая идея:** веб-сервис как набор ресурсов с унифицированным интерфейсом

```
Ресурс: /api/users/123
Представление: { "id": 123, "name": "John" }
```

<!-- v -->

## 6 ограничений REST (constraints)

1. **Client-Server** — разделение клиента и сервера
2. **Stateless** — сервер не хранит состояние клиента
3. **Cacheable** — ответы можно кэшировать
4. **Uniform Interface** — единый интерфейс для всех ресурсов
5. **Layered System** — клиент не знает, общается ли напрямую с сервером
6. **Code on Demand** — сервер может передавать код (на практике почти не используется)

<!-- v -->

## Stateless — без состояния

**Каждый запрос содержит всю информацию для обработки:**

```http
GET /api/tasks HTTP/1.1
Authorization: Bearer eyJhbGc...
```

**Преимущества:** масштабируемость, простота отладки, надёжность

**Состояние хранится на клиенте** (токены, данные формы)

<!-- v -->

## Уровни зрелости REST (Richardson)

| Уровень | Название     | Описание                            |
| ------- | ------------ | ----------------------------------- |
| 0       | Swamp of POX | HTTP как транспорт, один endpoint   |
| 1       | Resources    | Отдельные URI для ресурсов          |
| 2       | HTTP Verbs   | Правильные методы (GET, POST, etc.) |
| 3       | HATEOAS      | Гиперссылки в ответах               |

**Большинство API — уровень 2**

<!-- s -->

# RPC: Удалённый вызов процедур

<!-- v -->

## Что такое RPC?

**RPC** (Remote Procedure Call) — вызов функции на удалённом сервере

```javascript
// Локальный вызов
const result = calculator.add(2, 3);

// RPC — выполняется на сервере
const result = await remoteCalculator.add(2, 3);
```

**Фокус:** действия (процедуры), а не ресурсы

<!-- v -->

## JSON-RPC 2.0

**Запрос:**

```json
{
  "jsonrpc": "2.0",
  "method": "user.create",
  "params": { "name": "John" },
  "id": 1
}
```

**Ответ:**

```json
{
  "jsonrpc": "2.0",
  "result": { "id": 123, "name": "John" },
  "id": 1
}
```

<!-- v -->

## gRPC

**От Google, использует Protocol Buffers:**

- Бинарный формат (быстрее JSON)
- Строгая типизация
- Streaming

**Использование:** микросервисы, мобильные приложения

<!-- s -->

## REST vs RPC

| Аспект          | REST                      | RPC                    |
| --------------- | ------------------------- | ---------------------- |
| **Фокус**       | Ресурсы (существительные) | Действия (глаголы)     |
| **URL**         | `/users/123`              | `/api` + method в теле |
| **Методы**      | GET, POST, PUT, DELETE    | POST (обычно)          |
| **Кэширование** | Встроено (GET)            | Сложнее                |

<!-- v -->

## Когда что использовать?

**REST:** публичные API, CRUD-операции, браузерные приложения

**RPC:** сложные операции, микросервисы, batch-операции

<!-- v -->

## Гибридный подход

**На практике комбинируют REST + action endpoints:**

```
REST для ресурсов:
GET  /api/users/123
POST /api/users

Action endpoints для операций вне CRUD:
POST /api/users/123/send-verification-email
POST /api/orders/123/cancel
```

<!-- s -->

# Fetch API

<!-- v -->

## GET-запрос

```javascript
const response = await fetch("/api/users");
const users = await response.json();
```

<!-- v -->

## POST-запрос

```javascript
const response = await fetch("/api/users", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({ name: "John", email: "john@example.com" }),
});

const newUser = await response.json();
```

<!-- v -->

## Fetch: Важная особенность ❗

**Fetch не выбрасывает ошибку при 4xx/5xx:**

```javascript
// ❌ Плохо — 404 не поймается в catch
try {
  const response = await fetch("/api/users/999");
  const user = await response.json();
} catch (error) {
  // Сюда попадут только сетевые ошибки!
}

// ✅ Хорошо — проверяем response.ok
const response = await fetch("/api/users/999");
if (!response.ok) {
  throw new Error(`HTTP ${response.status}`);
}
const user = await response.json();
```

<!-- v -->

## Fetch: Отмена запроса

```javascript
const controller = new AbortController();
setTimeout(() => controller.abort(), 5000);

try {
  const response = await fetch("/api/data", {
    signal: controller.signal,
  });
} catch (error) {
  if (error.name === "AbortError") {
    console.log("Запрос отменён");
  }
}
```

<!-- s -->

# Axios

<!-- v -->

## Почему Axios?

- Автоматический JSON
- Выбрасывает ошибки при 4xx/5xx
- Интерцепторы
- Таймаут из коробки

```bash
npm install axios
```

<!-- v -->

## Axios: Базовые запросы

```javascript
import axios from "axios";

const { data: users } = await axios.get("/api/users");
const { data: newUser } = await axios.post("/api/users", { name: "John" });
await axios.patch("/api/users/123", { name: "Jane" });
await axios.delete("/api/users/123");
```

<!-- v -->

## Axios: Создание экземпляра

```javascript
import axios from "axios";

export const api = axios.create({
  baseURL: "https://api.example.com",
  timeout: 10000,
});

// Интерцептор для токена
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});
```

<!-- v -->

## Axios: Отмена запроса

```javascript
const controller = new AbortController();

api.get("/users", { signal: controller.signal });

// Отмена
controller.abort();
```

<!-- v -->

## Fetch vs Axios

| Аспект           | Fetch            | Axios         |
| ---------------- | ---------------- | ------------- |
| **Встроенный**   | ✅ Да            | ❌ Установка  |
| **JSON**         | Ручной `.json()` | Автоматически |
| **Ошибки HTTP**  | Не выбрасывает   | Выбрасывает   |
| **Интерцепторы** | ❌ Нет           | ✅ Есть       |
| **Размер**       | 0 KB             | ~13 KB        |

<!-- s -->

# Обработка ошибок

<!-- v -->

## Обёртка для Fetch

```javascript
async function fetchJSON(url, options = {}) {
  const method = options.method || "GET";
  const hasBody =
    !["GET", "HEAD"].includes(method.toUpperCase()) && options.body;

  const response = await fetch(url, {
    ...options,
    headers: {
      Accept: "application/json",
      ...(hasBody && { "Content-Type": "application/json" }),
      ...options.headers,
    },
    body: hasBody ? JSON.stringify(options.body) : undefined,
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw new Error(error.message || `HTTP ${response.status}`);
  }

  return response.status === 204 ? null : response.json();
}
```

<!-- s -->

# CORS

<!-- v -->

## Same-Origin Policy

**Браузер блокирует запросы к другим доменам:**

```javascript
// Страница: https://myapp.com

fetch("https://myapp.com/api"); // ✅ OK
fetch("https://api.external.com"); // ❌ Blocked
```

**Origin** = протокол + домен + порт

<!-- v -->

## Как работает CORS?

**Сервер явно разрешает запросы:**

```http
Access-Control-Allow-Origin: https://myapp.com
Access-Control-Allow-Methods: GET, POST, PUT, PATCH, DELETE
Access-Control-Allow-Headers: Content-Type, Authorization
```

<!-- v -->

## CORS на сервере (Express)

```javascript
import cors from "cors";

// Только для разработки!
app.use(cors());

// Production — указываем конкретные origins
app.use(
  cors({
    origin: ["https://myapp.com"],
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
    credentials: true,
  })
);
```

**Важно:** при `credentials: true` origin должен быть конкретным (не `*`), и на клиенте нужен `credentials: "include"` в fetch

<!-- s -->

## Практические советы

<!-- v -->

## Retry при ошибках

```javascript
async function fetchWithRetry(url, options = {}, retries = 3) {
  for (let i = 0; i < retries; i++) {
    try {
      const response = await fetch(url, options);
      // Ретрай только для 5xx; 4xx обрабатываем в вызывающем коде
      if (response.status >= 500) throw new Error("Server error");
      return response; // 2xx, 3xx, 4xx — возвращаем как есть
    } catch (error) {
      if (i === retries - 1) throw error;
      await new Promise((r) => setTimeout(r, 1000 * Math.pow(2, i)));
    }
  }
}
```

**Важно:** retry безопасен для idempotent-методов (GET, PUT, DELETE). Для 429/408 нужна отдельная логика (rate-limit)

<!-- s -->

## Домашнее задание

Полное описание в учебном портале и в ветке урока task

<!-- s -->

## Итоги занятия

- Архитектурные принципы REST (6 constraints)
- REST vs RPC — когда что использовать
- Fetch API и Axios
- Обработка ошибок
- CORS

<!-- s -->

## Q&A

**Вопросы?**

- Когда выбирать REST, а когда RPC?
- Fetch vs Axios?
- Как работает CORS?
