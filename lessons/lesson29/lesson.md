---
title: "Урок 29: Базы данных и ORM"
description: "TypeORM, PostgreSQL, миграции и CRUD-операции в NestJS"
---

# Базы данных и ORM

## TypeORM + PostgreSQL + Миграции

<!-- v -->

## Цели занятия

- Соединять NestJS-приложение и PostgreSQL
- Проводить CRUD-операции, используя REST-запросы к БД
- Изменять структуру БД при помощи миграций
- Понять концепцию ORM и её преимущества
- Научиться работать с TypeORM: сущности и репозитории

<!-- v -->

## Краткое содержание

- SQL и проблема SQL-инъекций
- Что такое ORM и зачем она нужна
- TypeORM: установка, настройка, подключение к PostgreSQL
- Сущности (Entities) и репозитории
- CRUD-операции через TypeORM
- Миграции: создание, применение, откат

<!-- v -->

## Результат занятия

NestJS-приложение с интегрированной PostgreSQL, реализованными CRUD-операциями через TypeORM и миграциями для управления структурой БД

<!-- v -->

## Компетенции по занятию

- **Работать с SQL базами данных через ORM**
- **Создавать и применять миграции**
- Интегрировать TypeORM с NestJS
- Проектировать сущности и отношения между ними
- Выполнять безопасные запросы к БД

<!-- s -->

## SQL и проблемы безопасности

### Работа с БД напрямую — опасно!

```typescript
// ❌ ПЛОХО: SQL-инъекция!
public getUserBySql(id: string) {
  const query = `SELECT * FROM users WHERE id='${id}'`;
  const res = database.query(query);
  return res;
}

// Если передать id = "'; DROP TABLE users;--"
// Запрос станет:
// "SELECT * FROM users WHERE id=''; DROP TABLE users;--'"
```

**Результат:** злоумышленник может удалить таблицу или получить доступ к данным! 💥

<!-- s -->

## Решение — ORM

**ORM (Object-Relational Mapping)** — технология связывания базы данных с концепциями ООП

Маппинг таблиц БД на классы в JavaScript/TypeScript

<!-- v -->

### Преимущества ORM:

- ✅ **Безопасность** — защита от SQL-инъекций
- ✅ **Удобство** — работа с сущностями через язык программирования
- ✅ **Независимость от БД** — легко переключаться между PostgreSQL, MySQL, SQLite
- ✅ **Управление структурой** — миграции для версионирования схемы БД
- ✅ **Типизация** — полная поддержка TypeScript

<!-- s -->

## TypeORM

**TypeORM** — популярная ORM для JavaScript и TypeScript

- Поддержка PostgreSQL, MySQL, SQLite, MS SQL, MongoDB и других
- Отличная интеграция с NestJS
- Поддержка миграций
- Декораторы для описания сущностей
- Query Builder для сложных запросов

<!-- v -->

### Установка TypeORM для NestJS:

```bash
# Установка TypeORM и драйвера PostgreSQL
npm install --save @nestjs/typeorm typeorm pg

# Если нужна поддержка миграций через CLI
npm install --save-dev ts-node
```

<!-- s -->

## Подключение TypeORM к NestJS

### Настройка в AppModule:

```typescript
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 5432,
      username: 'postgres',
      password: 'postgres',
      database: 'otus_fancy',
      autoLoadEntities: true, // Автоматическая загрузка сущностей
      synchronize: true, // ⚠️ Только для dev! В продакшене используйте миграции
    }),
  ],
})
export class AppModule {}
```

<!-- s -->

## Сущности (Entities)

Сущность — это класс, который маппится на таблицу в БД

```typescript
import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity('users') // Имя таблицы
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 100 })
  name: string;

  @Column({ name: 'date_of_birth', type: 'date', nullable: true })
  dateOfBirth: Date;

  @Column({ type: 'varchar', length: 200, unique: true })
  email: string;

  @Column({ default: true })
  isActive: boolean;
}
```

<!-- v -->

### Основные декораторы TypeORM:

| Декоратор | Назначение |
|-----------|------------|
| `@Entity()` | Помечает класс как сущность (таблицу) |
| `@PrimaryGeneratedColumn()` | Автоинкрементный первичный ключ |
| `@Column()` | Обычное поле таблицы |
| `@CreateDateColumn()` | Автоматическая дата создания |
| `@UpdateDateColumn()` | Автоматическая дата обновления |
| `@ManyToOne()`, `@OneToMany()` | Связи между таблицами |

<!-- s -->

## Репозитории

Репозиторий — объект для работы с сущностями (CRUD-операции)

### Подключение репозитория в модуле:

```typescript
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './user.entity';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';

@Module({
  imports: [TypeOrmModule.forFeature([User])], // Регистрация сущности
  controllers: [UsersController],
  providers: [UsersService],
})
export class UsersModule {}
```

<!-- v -->

### Использование репозитория в сервисе:

```typescript
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './user.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}

  // Получить всех пользователей
  async findAll(): Promise<User[]> {
    return this.usersRepository.find();
  }

  // Получить одного по ID
  async findOne(id: number): Promise<User> {
    return this.usersRepository.findOneBy({ id });
  }

  // Создать нового
  async create(userData: Partial<User>): Promise<User> {
    const user = this.usersRepository.create(userData);
    return this.usersRepository.save(user);
  }

  // Удалить
  async remove(id: number): Promise<void> {
    await this.usersRepository.delete(id);
  }
}
```

<!-- v -->

### Контроллер с CRUD-операциями:

```typescript
import { Controller, Get, Post, Delete, Param, Body } from '@nestjs/common';
import { UsersService } from './users.service';
import { User } from './user.entity';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  findAll(): Promise<User[]> {
    return this.usersService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string): Promise<User> {
    return this.usersService.findOne(parseInt(id));
  }

  @Post()
  create(@Body() userData: Partial<User>): Promise<User> {
    return this.usersService.create(userData);
  }

  @Delete(':id')
  remove(@Param('id') id: string): Promise<void> {
    return this.usersService.remove(parseInt(id));
  }
}
```

<!-- s -->

## Миграции

**Миграции** — файлы, описывающие изменения структуры БД

<!-- v -->

### Зачем нужны миграции?

- ✅ Синхронизация структуры БД и моделей на продакшене
- ✅ Версионирование схемы БД (как Git для базы данных)
- ✅ Откат изменений при необходимости
- ✅ Всё в одном месте — код + структура БД

**⚠️ Важно:** на продакшене **НИКОГДА** не используйте `synchronize: true`! Только миграции!

<!-- s -->

## Настройка миграций

### 1. Создать DataSource для CLI (src/config/typeorm.config.ts):

```typescript
import { DataSource } from 'typeorm';

export default new DataSource({
  type: 'postgres',
  host: 'localhost',
  port: 5432,
  username: 'postgres',
  password: 'postgres',
  database: 'otus_fancy',
  entities: ['src/**/*.entity{.ts,.js}'],
  migrations: ['src/migrations/*{.ts,.js}'],
  migrationsTableName: 'migrations',
});
```

<!-- v -->

### 2. Добавить скрипты в package.json:

```json
{
  "scripts": {
    "typeorm": "typeorm-ts-node-commonjs",
    "migration:generate": "npm run typeorm migration:generate -d src/config/typeorm.config.ts",
    "migration:run": "npm run typeorm migration:run -d src/config/typeorm.config.ts",
    "migration:revert": "npm run typeorm migration:revert -d src/config/typeorm.config.ts"
  }
}
```

<!-- s -->

## Работа с миграциями

### Создание миграции:

```bash
# Генерация миграции на основе изменений в сущностях
npm run typeorm migration:generate src/migrations/AddFancyField -d src/config/typeorm.config.ts

# Или создать пустую миграцию вручную
npm run typeorm migration:create src/migrations/AddFancyField
```

### Применение миграций:

```bash
npm run migration:run
```

### Откат последней миграции:

```bash
npm run migration:revert
```

<!-- v -->

### Как выглядит миграция:

```typescript
import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddFancyField1684359786471 implements MigrationInterface {
  name = 'AddFancyField1684359786471';

  public async up(queryRunner: QueryRunner): Promise<void> {
    // Применение изменений
    await queryRunner.query(
      `ALTER TABLE "users" ADD "fancy_field" integer NOT NULL DEFAULT 0`
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // Откат изменений
    await queryRunner.query(
      `ALTER TABLE "users" DROP COLUMN "fancy_field"`
    );
  }
}
```

<!-- s -->

## Основные методы Repository

```typescript
// Поиск
await repo.find(); // Все записи
await repo.findOne({ where: { id: 1 } }); // Одна запись
await repo.findOneBy({ email: 'test@example.com' }); // По условию
await repo.count(); // Количество

// Создание и сохранение
const user = repo.create({ name: 'John' }); // Создать объект
await repo.save(user); // Сохранить в БД

// Обновление
await repo.update({ id: 1 }, { name: 'Jane' });

// Удаление
await repo.delete({ id: 1 });
await repo.remove(user);
```

<!-- s -->

## Вопросы?

Ставим «+», если вопросы есть  
Ставим «–», если вопросов нет

<!-- s -->

## Рефлексия

- По какому вопросу захотелось углубиться?
- Понимаете ли вы, как применять то, что узнали?
- Какие сложности видите при работе с миграциями?
- Готовы ли интегрировать TypeORM в свой проект?

<!-- s -->

## Тезисы

Сегодня:
- Познакомились с концепцией ORM и её преимуществами
- Рассмотрели TypeORM при работе с данными
- Узнали, как обновлять структуру БД миграциями
- Реализовали CRUD-операции через репозитории
- Научились безопасно работать с БД (без SQL-инъекций)

<!-- s -->

## Дополнительные материалы

1. [Официальная документация TypeORM](https://typeorm.io/)
2. [NestJS + TypeORM Integration](https://docs.nestjs.com/techniques/database)
3. [TypeORM Migrations Guide](https://typeorm.io/migrations)
4. [PostgreSQL Documentation](https://www.postgresql.org/docs/)
5. [Repository API Reference](https://typeorm.io/repository-api)
6. [Entity Decorators](https://typeorm.io/entities)
