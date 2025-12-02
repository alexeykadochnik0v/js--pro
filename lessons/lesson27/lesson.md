---
title: "Урок 27: Event Loop и Timers в Node.js"
description: "Event-Driven программирование, Event Loop, фазы, таймеры, microtasks vs macrotasks"
---

# Event Loop и Timers в Node.js

## Асинхронность и события

<!-- v -->

## Цели занятия

- Понять Event-Driven программирование
- Изучить EventEmitter и паттерн Observer
- Разобраться, как работает Event Loop
- Освоить фазы Event Loop
- Понять разницу microtasks vs macrotasks
- Научиться работать с таймерами
- Понимать блокирующие операции

<!-- v -->

## Краткое содержание

- Event-Driven Programming
- Observer / EventEmitter
- Как работает Event Loop
- Фазы Event Loop (timers, poll, check)
- Microtasks vs Macrotasks
- Таймеры (setTimeout, setInterval, setImmediate)
- Блокирующие операции
- Практическое применение

<!-- v -->

## Результат занятия

Понимание работы асинхронности в Node.js и умение использовать EventEmitter и таймеры

<!-- v -->

## Компетенции по занятию

- **Работать с EventLoop, Timers, Event Emitter**
- Понимать порядок выполнения асинхронного кода
- Использовать события для организации приложения

<!-- s -->

## Event-Driven Programming

**Event-Driven** = приложение реагирует на события

**Принцип работы:**

1. Событие происходит
2. Событие попадает в очередь
3. Обработчик реагирует на событие

**Где используется:**

- Сетевой ввод-вывод
- Пользовательский ввод
- Работа с файлами
- Таймеры

<!-- s -->

## Observer / EventEmitter

**EventEmitter** = реализация паттерна Observer в Node.js

```js
import { EventEmitter } from "node:events";

const emitter = new EventEmitter();

// Подписка на событие
emitter.on("message", (data) => {
  console.log("Получено:", data);
});

// Генерация события
emitter.emit("message", "Hello!");
```

**Паттерн:** Событие → Подписчики

<!-- v -->

## Методы EventEmitter

```js
const emitter = new EventEmitter();

// on — добавить слушателя
emitter.on("data", (value) => console.log(value));

// once — сработает один раз
emitter.once("connect", () => console.log("Connected"));

// off — удалить слушателя (современный метод)
const handler = () => console.log("test");
emitter.on("test", handler);
emitter.off("test", handler);
// Старое имя: removeListener() — встречается в чужом коде

// emit — вызвать событие
emitter.emit("data", 123);
```

<!-- s -->

## Как работает Event Loop

**Event Loop** = цикл обработки асинхронных событий

**Почему Node однопоточный:**

- Один основной поток JavaScript
- Но: неблокирующий I/O через libuv
- Node однопоточный только для JavaScript, но внутри libuv используется пул потоков для работы с файлами, DNS и другими системными операциями

**Что делает libuv:**

- Управляет асинхронным I/O
- Работает с файлами, сетью
- Передаёт задачи в пул потоков

<!-- s -->

## Фазы Event Loop

**Event Loop работает в 6 фазах:**

1. **timers** — выполняет `setTimeout`, `setInterval`
2. **pending callbacks** — внутренние callbacks (например, TCP ошибки)
3. **idle, prepare** — используется Node внутри
4. **poll** — ожидание новых I/O событий
5. **check** — выполняет `setImmediate`
6. **close callbacks** — закрытие ресурсов (`socket.on('close')`)

<!-- v -->

## Визуализация фаз

```
   ┌───────────────────────────┐
┌─>│           timers          │
│  └─────────────┬─────────────┘
│  ┌─────────────┴─────────────┐
│  │     pending callbacks     │
│  └─────────────┬─────────────┘
│  ┌─────────────┴─────────────┐
│  │       idle, prepare       │
│  └─────────────┬─────────────┘      ┌───────────────┐
│  ┌─────────────┴─────────────┐      │   incoming:   │
│  │           poll            │<─────┤  connections, │
│  └─────────────┬─────────────┘      │   data, etc.  │
│  ┌─────────────┴─────────────┐      └───────────────┘
│  │           check           │
│  └─────────────┬─────────────┘
│  ┌─────────────┴─────────────┐
└──┤      close callbacks      │
   └───────────────────────────┘
```

<!-- s -->

## Microtasks vs Macrotasks

**Microtasks** (приоритет выше):

- Promise (`then`, `catch`, `finally`)
- `queueMicrotask()`
- `process.nextTick()` (только Node, выполняется раньше всех)

**Macrotasks**:

- `setTimeout`, `setInterval`
- I/O callbacks
- `setImmediate`

**Важно:** Microtasks выполняются сразу после выполнения текущего JavaScript-кода и перед переходом к следующей фазе Event Loop.

**Правило:** После каждого macrotask выполняются ВСЕ microtasks

<!-- v -->

## Порядок выполнения

```js
console.log("1: Start");

setTimeout(() => console.log("2: setTimeout"), 0);

Promise.resolve().then(() => console.log("3: Promise"));

process.nextTick(() => console.log("4: nextTick"));

console.log("5: End");
```

**Вывод:**

```
1: Start
5: End
4: nextTick      // Самый приоритетный
3: Promise       // Microtask
2: setTimeout    // Macrotask
```

**Предупреждение:** `process.nextTick()` может привести к starvation (голоданию других задач), если злоупотреблять им — Event Loop не перейдёт к следующей фазе, пока очередь nextTick не опустеет

<!-- s -->

## Таймеры

### setTimeout

```js
setTimeout(() => {
  console.log("Выполнится через ~100мс");
}, 100);
```

**Важно:** Время НЕ гарантировано - это минимальная задержка

<!-- v -->

### setInterval

```js
const id = setInterval(() => {
  console.log("Каждые 1000мс");
}, 1000);

// Остановка
clearInterval(id);
```

**Проблема:** Может накапливать задержки при долгих операциях

<!-- v -->

### setImmediate

```js
setImmediate(() => {
  console.log("Выполнится в фазе check");
});
```

**Отличие от setTimeout(fn, 0):**

- `setImmediate` — выполнится в фазе **check**
- `setTimeout` — в фазе **timers**

<!-- v -->

## Сравнение таймеров

```js
setTimeout(() => console.log("setTimeout"), 0);
setImmediate(() => console.log("setImmediate"));
```

**Порядок не гарантирован!** Зависит от фазы Event Loop

Но внутри I/O callback:

```js
fs.readFile("file.txt", () => {
  setTimeout(() => console.log("setTimeout"), 0);
  setImmediate(() => console.log("setImmediate"));
});
// setImmediate всегда выполнится первым
```

<!-- s -->

## Сравнение Microtasks vs Macrotasks

**Microtasks:**

- Выполняются сразу после текущего JavaScript-кода
- Нельзя прервать — выполняются ВСЕ до конца
- Блокируют переход к следующей фазе Event Loop
- Примеры: Promise, queueMicrotask, process.nextTick

**Macrotasks:**

- Планируются в Event Loop
- Выполняются по одному в каждой фазе
- Могут ожидать своей очереди
- Примеры: setTimeout, setInterval, setImmediate, I/O

**Главное отличие:** Microtasks имеют приоритет и выполняются до следующего macrotask

<!-- s -->

## Блокирующие операции

**Блокирующая операция** = останавливает Event Loop

**Примеры:**

```js
// Синхронная работа с файлами
const data = fs.readFileSync("big-file.txt"); // БЛОКИРУЕТ

// Тяжёлые вычисления
for (let i = 0; i < 1000000000; i++) {} // БЛОКИРУЕТ
```

**Проблема:** Весь Node.js остановится, запросы не обрабатываются

<!-- v -->

## Как избежать блокировок

**Использовать асинхронные API:**

```js
// Плохо
const data = fs.readFileSync("file.txt");

// Хорошо
const data = await fs.promises.readFile("file.txt");
```

**Для тяжёлых вычислений:**

- Разбить на части
- Использовать Worker Threads (в следующих уроках)

<!-- s -->

## Практическое применение

**Почему асинхронность важна:**

```js
// Node может обрабатывать тысячи соединений
server.on("request", async (req, res) => {
  // Пока ждём базу данных, обрабатываем другие запросы
  const data = await db.query("SELECT * FROM users");
  res.end(JSON.stringify(data));
});
```

**Один поток обслуживает множество клиентов благодаря Event Loop**

<!-- v -->

## Почему таймеры не точные

```js
setTimeout(() => {
  console.log("Должно быть через 100мс");
}, 100);

// Но если Event Loop занят:
for (let i = 0; i < 1000000000; i++) {}
// Callback выполнится позже 100мс
```

**Event Loop может быть занят** → таймеры запаздывают

<!-- s -->

## Итог

Теперь вы понимаете:

- Event-Driven программирование
- Как работает EventEmitter
- Фазы Event Loop (timers, poll, check)
- Разницу между microtasks и macrotasks
- Как работают таймеры и почему они не точные
- Что такое блокирующие операции
- Почему Node может обрабатывать тысячи соединений

<!-- s -->

## Домашнее задание

Полное описание в учебном портале и в ветке урока tack

<!-- s -->

## Q&A

**Вопросы?**

- Как работает Event Loop?
- В чём разница между setTimeout и setImmediate?
- Что такое microtasks и macrotasks?
- Почему нельзя блокировать Event Loop?
