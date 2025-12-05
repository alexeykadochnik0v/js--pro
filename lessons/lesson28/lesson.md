---
title: "Урок 28: Начинаем с NestJS"
description: "Знакомство с NestJS, концепции фреймворка, DI, декораторы, Controllers, Providers, Modules"
---

# Начинаем с NestJS

## Серверный фреймворк для Node.js

<!-- v -->

## Цели занятия

- Познакомиться с NestJS и принципами построения приложений на его базе
- Рассмотреть базовые компоненты фреймворка: Controllers, Providers, Modules
- Понять концепции Dependency Injection и декораторов
- Научиться использовать Nest CLI для генерации компонентов
- Создать базовое приложение с REST API

<!-- v -->

## Краткое содержание

- Что такое NestJS, преимущества и недостатки
- Концепции NestJS: модульная архитектура, DDD, DI, декораторы
- Nest CLI: установка и основные команды
- Controllers: обработка HTTP-запросов
- Providers: бизнес-логика и внедрение зависимостей
- Modules: структурирование приложения
- Middleware: промежуточная обработка запросов

<!-- v -->

## Результат занятия

Минимальное приложение на NestJS с базовыми контроллерами, сервисами и модулями, демонстрирующее работу DI и декораторов

<!-- v -->

## Компетенции по занятию

- **Использовать NestJS для создания Backend-приложений**
- **Применять Dependency Injection и декораторы**
- Структурировать приложение с помощью модулей
- Создавать REST API с использованием Controllers и Providers
- Работать с Nest CLI для генерации компонентов

<!-- s -->

## Что такое NestJS?

**NestJS** — фреймворк для написания Backend на Node.js

- Высокая популярность: более **60K+ звёзд на GitHub**
- Использует **TypeScript из коробки**
- Структура приложения вдохновлена **Angular**
- Подходит для создания масштабируемых серверных приложений

<!-- s -->

## NestJS. Преимущества

- **Имеет свой CLI** для быстрой генерации компонентов
- **Использует TypeScript из коробки** — строгая типизация
- **Готовая архитектура** с модулями, контроллерами, сервисами и DI
- **Множество готовых решений** и интеграций с инструментами и БД
- Позволяет создавать **REST API и GraphQL**
- Поддержка **микросервисов**

<!-- s -->

## NestJS. Недостатки

- Может иметь **худшую производительность**, чем Fastify
- **Тяжеловесный для простых проектов**
- **Высокий порог входа** для новичков
- Достаточно **жёсткие архитектурные рамки**

<!-- s -->

## NestJS. Hello World

### Установка и запуск:

```bash
# Установка CLI
npm i -g @nestjs/cli

# Создание проекта
nest new best-project

# Запуск проекта в dev-режиме
cd best-project && npm run start:dev
```

<!-- v -->

### Пример bootstrap (main.ts):

```typescript
import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  await app.listen(3000);
  console.log("Application is running on: http://localhost:3000");
}
bootstrap();
```

<!-- s -->

## NestJS. Концепции

Четыре ключевые концепции NestJS:

1. **Модульная архитектура** — разделение приложения на логические модули
2. **Layered Architecture** — слоистая структура (контроллеры → сервисы → данные)
3. **Dependency Injection** — внедрение зависимостей
4. **Decorators** — декораторы для метаданных

<!-- s -->

## NestJS без DI

### Проблема: ручное создание зависимостей

```typescript
import { Controller, Get } from "@nestjs/common";
import { UsersService } from "./users.service";
import { LoggerService } from "./logger.service";

@Controller("users")
export class UsersController {
  private usersService: UsersService;
  private logger: LoggerService;

  constructor() {
    // Ручное создание зависимостей — плохая практика!
    this.logger = new LoggerService();
    this.usersService = new UsersService(this.logger);
  }

  @Get()
  getUsers() {
    return this.usersService.findAll();
  }
}
```

**Проблемы:** сложно тестировать, нет переиспользования экземпляров, тесная связанность

<!-- s -->

## NestJS с DI

### Решение: автоматическое внедрение зависимостей

```typescript
import { Controller, Get } from "@nestjs/common";
import { UsersService } from "./users.service";

@Controller("users")
export class UsersController {
  // DI через конструктор — NestJS автоматически создаёт и внедряет сервис
  constructor(private readonly usersService: UsersService) {}

  @Get()
  getUsers() {
    return this.usersService.findAll();
  }
}
```

**Преимущества:** легко тестировать, singleton по умолчанию, слабая связанность

<!-- s -->

## NestJS. Декораторы

Декораторы в TypeScript — это функции, добавляющие метаданные к классам, методам или свойствам

- Начинаются с **`@`**
- Требуют флаг **`experimentalDecorators`** в `tsconfig.json`
- Могут применяться к **классу, методу, свойству, параметру**

<!-- v -->

### Основные декораторы NestJS:

**Для классов:**

- `@Controller()` — помечает класс как контроллер
- `@Injectable()` — помечает класс как провайдер (сервис)
- `@Module()` — определяет модуль

**Для методов контроллера:**

- `@Get()`, `@Post()`, `@Put()`, `@Delete()` — HTTP методы
- `@Param()`, `@Body()`, `@Query()` — извлечение данных из запроса

**Для параметров:**

- `@Req()` / `@Request()` — объект запроса
- `@Res()` / `@Response()` — объект ответа

<!-- s -->

## NestJS CLI

**CLI** — интерфейс командной строки для работы с NestJS

### Установка:

```bash
npm i -g @nestjs/cli
```

### Основные команды:

```bash
# Создать новый проект
nest new <project-name>

# Генерация компонентов
nest generate module users
nest generate controller users
nest generate service users

# Сокращённый вариант
nest g mo users
nest g co users
nest g s users

# Запуск в dev-режиме
nest start --watch

# Сборка проекта
nest build
```

<!-- s -->

## NestJS. Controllers

**Controllers** — классы, отвечающие за обработку входящих HTTP-запросов

- Помечаются декоратором **`@Controller()`**
- Обрабатывают **группу связанных запросов** (например, `/users`)
- Методы обрабатывают **конечные роуты**
- Один путь может иметь **несколько обработчиков** (GET, POST, PUT, DELETE)

<!-- v -->

### Схема работы Controllers:

```
Client (HTTP Request)
       ↓
   Controller
       ↓
   Route Handler (метод контроллера)
       ↓
   Response
```

<!-- v -->

### Пример контроллера библиотеки:

```typescript
import { Controller, Get, Post, Body, Param } from "@nestjs/common";

interface Book {
  id: number;
  title: string;
  author: string;
}

@Controller("library")
export class LibraryController {
  private books: Book[] = [
    { id: 1, title: "TypeScript Handbook", author: "Microsoft" },
    { id: 2, title: "Node.js Design Patterns", author: "Mario Casciaro" },
  ];

  @Get()
  getAllBooks(): Book[] {
    return this.books;
  }

  @Get(":id")
  getBookById(@Param("id") id: string): Book {
    return this.books.find((book) => book.id === parseInt(id));
  }

  @Post()
  createBook(@Body() newBook: Book): Book {
    this.books.push(newBook);
    return newBook;
  }
}
```

<!-- v -->

### Декораторы для работы с запросом:

| Декоратор                | Соответствие                        |
| ------------------------ | ----------------------------------- |
| `@Request()` / `@Req()`  | `req`                               |
| `@Response()` / `@Res()` | `res`                               |
| `@Next()`                | `next`                              |
| `@Param(key?)`           | `req.params` / `req.params[key]`    |
| `@Body(key?)`            | `req.body` / `req.body[key]`        |
| `@Query(key?)`           | `req.query` / `req.query[key]`      |
| `@Headers(name?)`        | `req.headers` / `req.headers[name]` |

<!-- s -->

## NestJS. Providers

**Providers** — классы, которые можно внедрять как зависимости

- Помечаются декоратором **`@Injectable()`**
- Содержат **бизнес-логику** приложения
- Внедряются в контроллеры или другие провайдеры через **Dependency Injection**
- По умолчанию являются **singleton** (один экземпляр на всё приложение)

<!-- v -->

### Схема работы Providers:

```
   Providers (Services, Repositories, Factories...)
       ↓ (DI)
   Controller
       ↓
   Client
```

<!-- v -->

### Пример LibraryService:

```typescript
import { Injectable } from "@nestjs/common";

interface Book {
  id: number;
  title: string;
  author: string;
}

@Injectable()
export class LibraryService {
  private books: Book[] = [
    { id: 1, title: "Clean Code", author: "Robert Martin" },
    { id: 2, title: "Refactoring", author: "Martin Fowler" },
  ];

  findAll(): Book[] {
    return this.books;
  }

  findOne(id: number): Book | undefined {
    return this.books.find((book) => book.id === id);
  }

  create(book: Book): Book {
    this.books.push(book);
    return book;
  }

  remove(id: number): boolean {
    const index = this.books.findIndex((book) => book.id === id);
    if (index > -1) {
      this.books.splice(index, 1);
      return true;
    }
    return false;
  }
}
```

<!-- v -->

### Использование сервиса в контроллере:

```typescript
import { Controller, Get, Post, Delete, Param, Body } from "@nestjs/common";
import { LibraryService } from "./library.service";

interface Book {
  id: number;
  title: string;
  author: string;
}

@Controller("library")
export class LibraryController {
  // Внедрение сервиса через конструктор
  constructor(private readonly libraryService: LibraryService) {}

  @Get()
  getAllBooks() {
    return this.libraryService.findAll();
  }

  @Get(":id")
  getBook(@Param("id") id: string) {
    return this.libraryService.findOne(parseInt(id));
  }

  @Post()
  createBook(@Body() book: Book) {
    return this.libraryService.create(book);
  }

  @Delete(":id")
  deleteBook(@Param("id") id: string) {
    return this.libraryService.remove(parseInt(id));
  }
}
```

<!-- s -->

## NestJS. Modules

**Module** — класс для агрегации связанных компонентов в логическую структуру

- Помечается декоратором **`@Module()`**
- Приложение имеет минимум **один корневой модуль** (AppModule)
- Корневой модуль передаётся в **`NestFactory.create()`**
- Модули помогают организовать код по функциональным блокам

<!-- v -->

### Схема модульной структуры:

```
        Application Module (Root)
                 ↓
    ┌────────────┼────────────┐
    ↓            ↓            ↓
Users Module  Orders Module  Chat Module
    ↓            ↓            ↓
Feature Modules...
```

<!-- v -->

### Пример модуля:

```typescript
import { Module } from "@nestjs/common";
import { LibraryController } from "./library.controller";
import { LibraryService } from "./library.service";

@Module({
  controllers: [LibraryController], // Контроллеры этого модуля
  providers: [LibraryService], // Провайдеры (сервисы)
  exports: [LibraryService], // Экспортируемые провайдеры для других модулей
})
export class LibraryModule {}
```

<!-- v -->

### Корневой модуль приложения:

```typescript
import { Module } from "@nestjs/common";
import { LibraryModule } from "./library/library.module";
import { UsersModule } from "./users/users.module";

@Module({
  imports: [LibraryModule, UsersModule],
})
export class AppModule {}
```

<!-- s -->

## NestJS. Middleware

**Middleware** — функция, вызываемая **перед обработчиком маршрута**

- Имеет доступ к объектам **`request`** и **`response`**
- Для передачи управления дальше используется **`next()`**
- Может изменять req/res, завершать запрос или вызывать следующий middleware

<!-- v -->

### Схема работы Middleware:

```
Client → Middleware → Route Handler → Response
```

<!-- v -->

### Пример Middleware для логирования:

```typescript
import { Injectable, NestMiddleware } from "@nestjs/common";
import { Request, Response, NextFunction } from "express";

@Injectable()
export class LoggerMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
    next(); // Передать управление дальше
  }
}
```

<!-- v -->

### Подключение Middleware в модуле:

```typescript
import { Module, NestModule, MiddlewareConsumer } from "@nestjs/common";
import { LibraryController } from "./library.controller";
import { LoggerMiddleware } from "./logger.middleware";

@Module({
  controllers: [LibraryController],
})
export class LibraryModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LoggerMiddleware).forRoutes("library"); // Применить ко всем роутам /library
  }
}
```

<!-- s -->

## Вопросы?

Ставим «+», если вопросы есть  
Ставим «–», если вопросов нет

<!-- s -->

## Рефлексия

- С какими впечатлениями уходите с вебинара?
- Что нового узнали о NestJS?
- Какие концепции вызывают вопросы (DI, декораторы, модули)?
- Где планируете применить NestJS?

<!-- s -->

## Дополнительные материалы

1. [Официальная документация NestJS](https://docs.nestjs.com/)
2. [NestJS GitHub](https://github.com/nestjs/nest)
3. [NestJS Fundamentals Course](https://docs.nestjs.com/fundamentals)
4. [TypeScript Decorators](https://www.typescriptlang.org/docs/handbook/decorators.html)
5. [Dependency Injection in NestJS](https://docs.nestjs.com/fundamentals/dependency-injection)
6. [Building REST APIs with NestJS](https://docs.nestjs.com/controllers)
