---
title: "Урок 4: Введение в TypeScript"
description: "Базовые типы, интерфейсы, функции и продвинутые возможности TypeScript"
---

# Введение в TypeScript

## Базовые типы, интерфейсы, функции

<!-- v -->

## Цели занятия

- Изучить основы типизации в TypeScript
- Освоить типы, интерфейсы и функции
- Понимать продвинутые возможности TypeScript
- Применять строгую типизацию в реальных проектах

<!-- v -->

## Краткое содержание

- Базовые типы данных TypeScript
- Интерфейсы и типы
- Типизация функций и объектов
- Продвинутые типы и утилиты
- Практическое применение

<!-- v -->

## Результат занятия

Функция deepEqual, переписанная с использованием строгой типизации в TypeScript, включая интерфейсы и аннотации типов

<!-- v -->

## Компетенции по занятию

- **Работать с TypeScript**
- **Использование современного инструментария для JavaScript**
- Применение строгой типизации
- Создание надежных интерфейсов

<!-- s -->

## Что такое TypeScript?

**TypeScript = JavaScript + статическая типизация**

- Надмножество JavaScript
- Компилируется в чистый JavaScript
- Статическая проверка типов во время разработки
- Поддержка современных возможностей ES6+
- Отличная поддержка IDE

<!-- s -->

## Зачем нужен TypeScript?

### Преимущества:

- **Раннее обнаружение ошибок** во время разработки
- **Лучшая поддержка IDE**: автодополнение, рефакторинг
- **Самодокументирующийся код** через типы
- **Безопасный рефакторинг** больших кодовых баз
- **Улучшенная читаемость** и поддерживаемость

<!-- s -->

## Базовые типы TypeScript

### Примитивные типы:

```typescript
let name: string = "John";
let age: number = 30;
let isActive: boolean = true;
let data: null = null;
let value: undefined = undefined;
let id: symbol = Symbol("id");
let bigNumber: bigint = 100n;
```

### Специальные типы:

```typescript
let anything: any = "может быть чем угодно";
let nothing: void = undefined;
let unknownValue: unknown = "безопасная альтернатива any";
let neverReturns: never; // функция никогда не возвращает значение
```

<!-- s -->

## Массивы и кортежи

### Массивы:

```typescript
// Два способа объявления массивов
let numbers: number[] = [1, 2, 3];
let strings: Array<string> = ["a", "b", "c"];

// Массив смешанных типов
let mixed: (string | number)[] = [1, "hello", 2];
```

### Кортежи (Tuples):

```typescript
// Фиксированная длина и типы элементов
let tuple: [string, number] = ["hello", 42];
let coordinates: [number, number, number] = [10, 20, 30];

// Опциональные элементы в кортежах
let optional: [string, number?] = ["hello"];
```

<!-- s -->

## Литеральные типы

**Точные значения как типы:**

```typescript
type Yes = "yes";
type No = "no";
type Zero = 0;
type One = 1;

let answer: Yes = "yes"; //
let answer2: Yes = "no"; // Error

// Объединение литеральных типов
type Status = "loading" | "success" | "error";
type HttpMethod = "GET" | "POST" | "PUT" | "DELETE";

function makeRequest(method: HttpMethod, status: Status) {
  // Безопасная работа с ограниченными значениями
}
```

<!-- s -->

## Объектные типы

### Inline типы:

```typescript
let user: { name: string; age: number; email?: string } = {
  name: "John",
  age: 30,
};
```

### Type aliases:

```typescript
type User = {
  name: string;
  age: number;
  email?: string; // опциональное поле
  readonly id: number; // только для чтения
};

let user: User = {
  id: 1,
  name: "John",
  age: 30,
};
```

<!-- s -->

## Интерфейсы

### Базовый интерфейс:

```typescript
interface Coordinate {
  x: number;
  y: number;
  timestamp?: number;
}

interface Square {
  leftTop: Coordinate;
  rightBottom: Coordinate;
}
```

### Расширение интерфейсов:

```typescript
interface Animal {
  name: string;
  age: number;
}

interface Dog extends Animal {
  breed: string;
  bark(): void;
}
```

<!-- s -->

## Type vs Interface

### Когда использовать Type:

```typescript
// Объединения типов
type Status = "loading" | "success" | "error";

// Примитивные типы
type ID = string | number;

// Сложные вычисляемые типы
type EventHandler<T> = (event: T) => void;
```

### Когда использовать Interface:

```typescript
// Объекты и классы
interface User {
  name: string;
  email: string;
}

// Когда нужно расширение
interface AdminUser extends User {
  permissions: string[];
}
```

<!-- s -->

## Типизация функций

### Базовая типизация:

```typescript
function getNameLength(name: string): number {
  return name ? name.length : 0;
}

// Опциональные параметры
function greet(name: string, title?: string): string {
  return title ? `${title} ${name}` : name;
}

// Параметры по умолчанию
function createUser(name: string, age: number = 18): User {
  return { name, age };
}
```

### Функциональные типы:

```typescript
type MathOperation = (a: number, b: number) => number;

let add: MathOperation = (a, b) => a + b;
let multiply: MathOperation = (a, b) => a * b;
```

<!-- s -->

## Перегрузка функций

**Несколько сигнатур, одна реализация:**

```typescript
function sum(a: string, b: string): string;
function sum(a: number, b: number): number;
function sum(a: any, b: any): any {
  return a + b;
}

const numResult = sum(1, 2); // number
const strResult = sum("a", "b"); // string

// Почему не работает union type?
function badSum(a: number | string, b: number | string) {
  return a + b; // Error: Может вернуть неожиданный результат
}
```

<!-- s -->

## Типизация контекста (this)

```typescript
interface NumberArray {
  data: number[];
  includes(this: NumberArray, value: number): boolean;
}

function includes(this: NumberArray, value: number): boolean {
  return this.data.includes(value);
}

const arr: NumberArray = {
  data: [1, 2, 3],
  includes,
};

arr.includes(2); // this правильно типизирован
```

<!-- s -->

## Приведение типов (Type Assertions)

### Базовое приведение:

```typescript
let someData: any = "1234";
let id: string | number | null = someData;

// Приведение к более конкретному типу
(id as string).length;

// Альтернативный синтаксис (не работает в JSX)
(<string>id).length;
```

### Практический пример:

```typescript
const element = document.querySelector("#app") as HTMLElement;
const input = document.querySelector("input") as HTMLInputElement;

// Безопасное приведение с проверкой
const button = document.querySelector("button");
if (button instanceof HTMLButtonElement) {
  button.click(); // TypeScript знает, что это HTMLButtonElement
}
```

<!-- s -->

## Константные утверждения (as const)

### Неизменяемые объекты:

```typescript
const config = {
  apiUrl: "https://api.example.com",
  timeout: 5000,
  retries: 3,
} as const;

// config.apiUrl = "new url"; // Error: readonly
```

### Неизменяемые массивы:

```typescript
const colors = ["red", "green", "blue"] as const;
// Тип: readonly ["red", "green", "blue"]

const statuses = ["loading", "success", "error"] as const;
type Status = typeof statuses[number]; // "loading" | "success" | "error"
```

<!-- s -->

## Enum (перечисления)

### Числовые enum:

```typescript
enum Direction {
  Up, // 0
  Down, // 1
  Left, // 2
  Right, // 3
}

enum HttpStatus {
  OK = 200,
  NotFound = 404,
  InternalServerError = 500,
}
```

### Строковые enum:

```typescript
enum Theme {
  Light = "light",
  Dark = "dark",
  Auto = "auto",
}

function setTheme(theme: Theme) {
  document.body.className = theme;
}

setTheme(Theme.Dark);
```

<!-- s -->

## Продвинутые типы: Union и Intersection

### Union Types (|):

```typescript
type StringOrNumber = string | number;
type Status = "loading" | "success" | "error";

function processId(id: StringOrNumber) {
  if (typeof id === "string") {
    return id.toUpperCase(); // TypeScript знает, что это string
  }
  return id.toFixed(2); // TypeScript знает, что это number
}
```

### Intersection Types (&):

```typescript
type User = { name: string; email: string };
type Admin = { permissions: string[] };

type AdminUser = User & Admin;

const admin: AdminUser = {
  name: "John",
  email: "john@example.com",
  permissions: ["read", "write"],
};
```

<!-- s -->

## Generics (Дженерики)

### Базовые дженерики:

```typescript
function identity<T>(arg: T): T {
  return arg;
}

const stringResult = identity<string>("hello");
const numberResult = identity<number>(42);
const autoResult = identity("auto"); // TypeScript выведет тип автоматически
```

### Дженерики в интерфейсах:

```typescript
interface ApiResponse<T> {
  data: T;
  status: number;
  message: string;
}

interface User {
  id: number;
  name: string;
}

const userResponse: ApiResponse<User> = {
  data: { id: 1, name: "John" },
  status: 200,
  message: "Success",
};
```

<!-- s -->

## Утилитарные типы

### Встроенные утилиты:

```typescript
interface User {
  id: number;
  name: string;
  email: string;
  age: number;
}

// Partial - все поля опциональные
type PartialUser = Partial<User>;

// Pick - выбрать определенные поля
type UserSummary = Pick<User, "id" | "name">;

// Omit - исключить определенные поля
type CreateUser = Omit<User, "id">;

// Required - все поля обязательные
type RequiredUser = Required<PartialUser>;
```

<!-- s -->

## Практический пример: deepEqual

### Типизированная версия:

```typescript
type Primitive = string | number | boolean | null | undefined;
type DeepEqualValue = Primitive | object | any[];

interface DeepEqualOptions {
  strict?: boolean;
  ignoreArrayOrder?: boolean;
}

function deepEqual<T extends DeepEqualValue>(
  a: T,
  b: T,
  options: DeepEqualOptions = {}
): boolean {
  // Проверка примитивных типов
  if (a === b) return true;

  // Проверка null и undefined
  if (a == null || b == null) return a === b;

  // Проверка типов
  if (typeof a !== typeof b) return false;

  // Логика сравнения объектов и массивов...
  return compareObjects(a, b, options);
}
```

<!-- s -->

## Интерфейсы для deepEqual

```typescript
interface ComparisonContext {
  visited: WeakSet<object>;
  depth: number;
  maxDepth: number;
}

interface ObjectComparator {
  compare<T>(a: T, b: T, context: ComparisonContext): boolean;
}

class ArrayComparator implements ObjectComparator {
  compare<T extends any[]>(a: T, b: T, context: ComparisonContext): boolean {
    if (a.length !== b.length) return false;

    return a.every((item, index) => deepEqual(item, b[index], context));
  }
}

class ObjectComparator implements ObjectComparator {
  compare<T extends Record<string, any>>(
    a: T,
    b: T,
    context: ComparisonContext
  ): boolean {
    const keysA = Object.keys(a);
    const keysB = Object.keys(b);

    if (keysA.length !== keysB.length) return false;

    return keysA.every(
      (key) => keysB.includes(key) && deepEqual(a[key], b[key], context)
    );
  }
}
```

<!-- s -->

## Настройка TypeScript

### tsconfig.json:

```json
{
  "compilerOptions": {
    "target": "ES2020",
    "module": "ESNext",
    "lib": ["ES2020", "DOM"],
    "strict": true,
    "noImplicitAny": true,
    "strictNullChecks": true,
    "strictFunctionTypes": true,
    "noImplicitReturns": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true
  },
  "include": ["src/**/*"],
  "exclude": ["node_modules", "dist"]
}
```

<!-- s -->

## Best Practices

### 1. Используйте строгий режим:

```typescript
// Включите strict: true в tsconfig.json
```

### 2. Избегайте any:

```typescript
// Плохо
function process(data: any): any {
  return data.someProperty;
}

// Хорошо
function process<T extends { someProperty: unknown }>(
  data: T
): T["someProperty"] {
  return data.someProperty;
}
```

### 3. Используйте type guards:

```typescript
function isString(value: unknown): value is string {
  return typeof value === "string";
}

function processValue(value: unknown) {
  if (isString(value)) {
    return value.toUpperCase(); // TypeScript знает, что это string
  }
}
```

<!-- s -->

## Домашнее задание

### Цель:

Переписать/дополнить функцию deepEqual на TypeScript

### Требования:

1. Строгая типизация всех параметров и возвращаемых значений
2. Использование интерфейсов для опций и конфигурации
3. Применение дженериков для гибкости
4. Обработка различных типов данных (примитивы, объекты, массивы)
5. Добавление type guards для безопасности типов

### Дополнительно:

- Создать тесты с типизацией
- Настроить строгий TypeScript конфиг
- Документировать типы с помощью JSDoc

<!-- s -->

## Q&A

**Вопросы по TypeScript?**

- Базовые типы и их применение
- Интерфейсы vs типы
- Дженерики и утилитарные типы
- Практические примеры использования

**Переходим к практике!**
