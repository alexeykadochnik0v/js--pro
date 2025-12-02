---
title: "Урок 26: Введение в Node.js и NPM"
description: "Запуск JavaScript вне браузера, модули, работа с файлами и NPM"
---

# Введение в Node.js и NPM

## Запуск JavaScript вне браузера

<!-- v -->

## Цели занятия

- Понять, что такое Node.js и зачем он нужен
- Научиться запускать JS-файлы через Node
- Освоить модульную систему ESM
- Познакомиться с работой с файлами
- Изучить NPM и управление зависимостями
- Понять разницу между Node и браузером

<!-- v -->

## Краткое содержание

- Что такое Node.js (среда выполнения JS)
- Установка и проверка работы
- Запуск JS-файлов
- Разница Node vs браузер
- Модульная система ESM
- Базовая работа с файловой системой
- NPM и package.json
- Установка пакетов
- Скрипты

<!-- v -->

## Результат занятия

Простой проект с модулями, работой с файлами и установленными зависимостями через NPM

<!-- v -->

## Компетенции по занятию

- **Создавать и управлять проектом с NPM, Node.js**
- Запускать JS-программы через Node
- Работать с модулями
- Устанавливать зависимости

<!-- s -->

## Что такое Node.js?

**Node.js** = среда выполнения JavaScript вне браузера

**Для чего:**

- Запуск JS-программ на локальной машине
- CLI-утилиты (ESLint, Prettier, Vite)
- Сборка фронтенда
- Автоматизация задач
- Работа с файлами
- Запуск тестов

**Основа:** Движок V8 (Chrome)

<!-- s -->

## Установка Node.js

**Установка:**

- Скачать с nodejs.org
- Установить LTS версию (Node 20)

**Проверка:**

```bash
node -v    # v20.10.0
npm -v     # 10.2.3
```

<!-- s -->

## REPL — интерактивная консоль

```bash
node       # запуск REPL

> 2 + 2
4
> const name = "John"
> name.toUpperCase()
'JOHN'
```

**REPL** = Read-Eval-Print-Loop  
Как консоль браузера, но для Node

<!-- s -->

## Запуск JS-файлов

```js
// app.js
console.log("Hello from Node!");
```

```bash
node app.js
# Hello from Node!
```

**Node запускает JS-файлы как программы**

<!-- s -->

## Разница: Node vs Браузер

**В браузере есть:**

```js
window; // глобальный объект
document; // DOM
alert(); // модальные окна
```

**В Node есть:**

```js
global; // глобальный объект
process; // информация о процессе
console.log(); // вывод (одинаково)
```

**Node работает с ОС:**

- Файлы и директории
- Процессы
- Сетевые запросы

<!-- s -->

## Глобальные объекты Node

```js
// process — информация о процессе
console.log(process.version); // v20.10.0
console.log(process.platform); // win32, linux, darwin

// global — глобальный объект (как window)
global.myVar = "test";

// __dirname, __filename — путь к файлу (в CommonJS)
// В ESM используем import.meta.url
```

<!-- s -->

## Модульная система ESM

**Один файл = один модуль**

```js
// math.js
export function add(a, b) {
  return a + b;
}

export function subtract(a, b) {
  return a - b;
}
```

```js
// main.js
import { add, subtract } from "./math.js";

console.log(add(2, 3)); // 5
console.log(subtract(5, 2)); // 3
```

<!-- v -->

## Включение ESM

```json
// package.json
{
  "type": "module"
}
```

После этого все `.js` файлы работают как ESM

<!-- s -->

## Работа с файлами (концепция)

**Node может работать с файловой системой:**

```js
import { readFile, writeFile } from "node:fs/promises";

// Чтение файла
const content = await readFile("data.txt", "utf-8");

// Запись файла
await writeFile("output.txt", "Hello!");
```

**Модуль `fs`:**

- Чтение/запись файлов
- Создание/удаление директорий
- Работа с путями

<!-- s -->

## Что такое NPM?

**NPM** = Node Package Manager

**Зачем нужен:**

- Управление зависимостями проекта
- Хранение пакетов (библиотек)
- Создание проектной структуры
- Запуск скриптов

<!-- s -->

## Инициализация проекта

```bash
npm init -y
```

Создаёт файл `package.json`

```json
{
  "name": "my-project",
  "version": "1.0.0",
  "type": "module",
  "scripts": {},
  "dependencies": {}
}
```

<!-- s -->

## Что такое package.json?

**package.json** описывает проект:

- **name** — название проекта
- **version** — версия
- **type** — тип модулей (module для ESM)
- **scripts** — команды для запуска
- **dependencies** — зависимости проекта
- **devDependencies** — зависимости для разработки

<!-- s -->

## Установка пакетов

```bash
# Установка зависимости
npm install express

# Dev-зависимость (только для разработки)
npm install --save-dev eslint

# Глобальная установка
npm install -g typescript
```

**После установки:**

- Появляется `node_modules/`
- Обновляется `package.json`
- Создаётся `package-lock.json`

<!-- s -->

## Скрипты в package.json

```json
{
  "scripts": {
    "start": "node src/index.js",
    "dev": "node --watch src/index.js",
    "test": "node test.js"
  }
}
```

```bash
npm run start
npm run dev
npm test     # можно без run
```

<!-- s -->

## Итог

Теперь вы умеете:

- Устанавливать Node.js
- Запускать JS-файлы через Node
- Создавать проект с npm init
- Использовать модули import/export
- Понимать разницу между Node и браузером
- Работать с файлами (концепция)
- Устанавливать зависимости
- Запускать скрипты из package.json

<!-- s -->

## Домашнее задание

Полное описание в учебном портале и в ветке урока tack

<!-- s -->

## Q&A

**Вопросы?**

- Чем Node отличается от браузера?
- Как работают модули ESM?
- Что такое package.json?
- Как устанавливать пакеты?
