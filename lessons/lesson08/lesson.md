---
title: "Урок 8: Build tools — Vite, Webpack, Rollup, Web Components"
description: "Современные инструменты сборки: что актуально, что устаревает. Практика с Vite, когда нужен Webpack, Rollup для библиотек, Web Components"
---

# Build tools: Vite, Webpack, Rollup, Web Components

<!-- s -->

## Цели занятия

Освоить сборку и деплой фронтенда.

> Этот урок продолжает практику CI/CD из прошлого занятия: после освоения деплоя мы разбираем инструменты сборки, подготавливающие приложение к этому деплою.

<!-- v -->

## К концу занятия вы сможете

- Настроить проект на Vite (dev/build/preview)
- Понимать, когда выбирать Vite, Webpack 5 или Rollup
- Подготовить сборку к деплою и связать её с CI/CD

<!-- s -->

## Краткое содержание

- Обзор инструментов: Vite, Webpack 5, Rollup
- Что устаревает: Gulp/Parcel/Babel-heavy пайплайны
- Практика Vite: конфигурация, алиасы, env, HMR, CSS/Assets
- Когда нужен Webpack 5: Module Federation, сложные интеграции
- Rollup для библиотек: ESM/CJS/DTs, exports
- Web Components: Shadow DOM, сборка и публикуемость
- CI/CD для сборки (продолжение урока 7)
- CI/CD для сборки

<!-- s -->

## Результат занятия

Настроенная сборка проекта с использованием Vite

<!-- s -->

## Компетенции по занятию

- Настраивать Vite/Webpack
- Использовать CI/CD
- Использование современного инструментария для JS
- Web Components

<!-- s -->

## Компетенции по ДЗ

- Настраивать Vite/Webpack

<!-- s -->

## Обзор актуальных инструментов

- Vite — быстрый dev (esbuild), сборка на Rollup; де‑факто стандарт для SPA/MPA
- Webpack 5 — силён для нетривиальных пайплайнов, Module Federation, специфичных лоадеров
- Rollup — оптимален для библиотек (чистый ESM, fine‑grained tree‑shaking)
- SWC/esbuild постепенно вытесняют «Babel‑heavy» конфиги; Babel оставляем точечно

<!-- s -->

## Что устаревает

- Gulp как «общий сборщик фронтенда» — для задач сборки проектов больше не нужен
- Parcel теряет долю — неплохо для прототипов, но реже встречается в проде
- Тяжёлые многоступенчатые цепочки Babel → Terser → PostCSS без нужды

<!-- s -->

## Vite — быстрый старт

- Dev: мгновенный сервер с HMR
- Build: Rollup под капотом (code‑splitting, tree‑shaking)
- Плагины: совместимы с плагинами Rollup

```bash
npm create vite@latest my-app -- --template vanilla
cd my-app
npm i
npm run dev     # dev‑сервер
npm run build   # прод‑сборка
npm run preview # локальный предпросмотр билда
```

<!-- s -->

## Vite: скрипты npm (связка с CI)

```json
{
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "preview": "vite preview",
    "lint": "eslint . && prettier -c ."
  }
}
```

<!-- v -->

### Где применяются эти скрипты

Эти команды используются локально и в CI: `build` и, при желании, `lint`.

## Vite: структура и ключевые элементы

- `index.html` — часть графа сборки: можно подключать ESM‑скрипты; шаблон для вставки переменных (`%VITE_...%`).
- `src/main.js` (или `main.ts`/`main.tsx`) — точка входа; импорт стилей, инициализация роутера и корневого компонента.
- `vite.config.js` — ключевые блоки:
  - `root`, `base` — корень проекта и базовый путь деплоя
  - `plugins` — подключение плагинов (React/Vue/Svelte и т. п.)
  - `resolve.alias` — алиасы импортов (например, `@` → `src/`)
  - `server` — порт, прокси, настройки HMR
  - `build` — `outDir`, `sourcemap`, `rollupOptions` (code‑splitting)

<!-- v -->

- `public/` — файлы без обработки; копируются в корень билда (иконки, PDF).
- `.env*` — переменные окружения (`.env`, `.env.production`), доступны через `import.meta.env`.
  - Важно: чтобы переменная попала в клиентскую сборку, она должна начинаться с префикса `VITE_` (например, `VITE_API_URL`).

<!-- v -->

| Что меняем      | Зачем                                               |
| --------------- | --------------------------------------------------- |
| `base`          | если деплой в подпапку (например, `/app/`)          |
| `server.proxy`  | проксировать API в dev, чтобы избежать CORS         |
| `resolve.alias` | короткие относительные пути (`@/components/Button`) |
| `build.outDir`  | кастомная папка сборки, если требуется окружением   |

<!-- v -->

## Структура проекта (Vite)

```
my-app/
  index.html
  src/
    main.js
    styles.css
  public/            # статические ассеты без обработки
```

Особенности:

- `index.html` — часть графа сборки, можно подключать ESM‑скрипты
- `public/` копируется как есть; импорт через `/` корня

<!-- v -->

## Конфигурация Vite: vite.config.js

```js
// vite.config.js
import { defineConfig } from "vite";
import path from "node:path";

export default defineConfig({
  root: ".",
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "src"),
    },
  },
  server: {
    port: 5173,
    open: true,
  },
  build: {
    outDir: "dist",
    sourcemap: true,
  },
});
```

<!-- v -->

## Vite: переменные окружения и режимы

- Файлы `.env`, `.env.development`, `.env.production`
- Доступ из `import.meta.env.VITE_API_URL`
- Команды: `vite --mode staging`

<!-- v -->

### Пример запуска в особом режиме

```bash
vite build --mode staging
```

<!-- v -->

## Vite: CSS и ассеты

- Поддержка PostCSS, CSS Modules, импорт изображений как URL/inline
- Опции `assetsDir`, `base` для корректных путей при деплое

<!-- s -->

## Типовые конфигурации

- SPA на React/Vue/Svelte — подключить официальный плагин в `plugins`.

```js
// vite.config.js — пример для React
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
export default defineConfig({ plugins: [react()] });
```

<!-- v -->

- Legacy/многостраничный сайт — использовать `build.rollupOptions.input` для нескольких HTML.

> Для Svelte используется официальный плагин `@sveltejs/vite-plugin-svelte`.

```js
// Несколько точек входа
export default defineConfig({
  build: {
    rollupOptions: {
      input: {
        main: "index.html",
        admin: "admin/index.html",
      },
    },
  },
});
```

<!-- v -->

- Библиотека — режим `build.lib` для публикации в npm.

```js
export default defineConfig({
  build: {
    lib: {
      entry: "src/index.ts",
      name: "MyLib",
      fileName: (format) => `my-lib.${format}.js`,
    },
  },
});
```

<!-- s -->

## Производительность Vite

- Dev: esbuild для трансформаций — очень быстрый старт и HMR
- Prod: Rollup для оптимальной сборки (tree‑shaking, code‑splitting)
- Кэш и инкрементальные сборки сокращают время пересборок

<!-- s -->

## TypeScript с Vite

- Vite «из коробки» понимает TypeScript; добавьте `tsconfig.json` и `src/main.ts`
- Удобно настраивать алиасы через `compilerOptions.paths`

```json
// tsconfig.json (фрагмент)
{
  "compilerOptions": {
    "target": "ES2021",
    "module": "ESNext",
    "strict": true,
    "baseUrl": ".",
    "paths": { "@/*": ["src/*"] }
  },
  "include": ["src"]
}
```

```ts
// src/main.ts — точка входа
import "@/styles.css";
import { createApp } from "./app";
createApp(document.getElementById("app")!);
```

<!-- s -->

## Переход к Web Components

Теперь, когда мы разобрали ключевые элементы Vite, проверим сборку на реальном примере — создадим Web Component. Эта структура и конфигурация Vite одинакова для проектов на React, Vue, Svelte и других фреймворках — различаются в основном подключённые плагины.

Практика: создаём простой Web Component и проверяем работу на dev‑сервере Vite.

<!-- s -->

## Когда нужен Webpack 5

- Сложные пайплайны, кастомные лоадеры/плагины
- Module Federation: микрофронтенды, независимые релизы
- Интеграции с устаревшей инфраструктурой

```js
// webpack.config.js (общая идея)
module.exports = {
  entry: "./src/index.ts",
  output: { filename: "bundle.js", clean: true },
  module: { rules: [{ test: /\.tsx?$/, loader: "ts-loader" }] },
};
```

<!-- v -->

## Module Federation (кратко)

- Разделение приложения на удалённые модули
- Примерные термины: host, remote, shared deps
- Позволяет релизить части независимо

<!-- s -->

## Rollup для библиотек

```js
// rollup.config.mjs
import dts from "rollup-plugin-dts";
import esbuild from "rollup-plugin-esbuild";

export default [
  {
    input: "src/index.ts",
    plugins: [esbuild()],
    output: [
      { file: "dist/index.mjs", format: "esm" },
      { file: "dist/index.cjs", format: "cjs", exports: "named" },
    ],
  },
  {
    input: "src/index.ts",
    plugins: [dts()],
    output: { file: "dist/index.d.ts", format: "es" },
  },
];
```

<!-- v -->

## package.json для библиотек

```json
{
  "name": "my-lib",
  "type": "module",
  "main": "dist/index.cjs",
  "module": "dist/index.mjs",
  "types": "dist/index.d.ts",
  "exports": {
    ".": {
      "import": "./dist/index.mjs",
      "require": "./dist/index.cjs"
    }
  },
  "sideEffects": false
}
```

Замечания: корректные `exports` и `sideEffects` улучшают tree‑shaking.

<!-- s -->

## Новые высокопроизводительные инструменты

- SWC — очень быстрый транспайлер/минификатор; уже используется в Next.js
- Rspack — совместим с конфигами Webpack, но работает заметно быстрее
- Turbopack — экспериментальный преемник Webpack/Next.js, ориентирован на скорость

Пока активно развиваются, но их производительность уже впечатляет.

<!-- s -->

## Web Components — основы

- Custom Elements, Shadow DOM, HTML Templates
- Изоляция стилей, переиспользуемость
- Сборка: публикуйте как ESM, избегайте глобальных зависимостей

<!-- v -->

```js
class MyButton extends HTMLElement {
  connectedCallback() {
    const root = this.attachShadow({ mode: "open" });
    root.innerHTML = `<button><slot></slot></button>`;
  }
}
customElements.define("my-button", MyButton);
```

<!-- v -->

Импорт компонента в точке входа и сборка в формате ESM:

```js
// src/main.js
import "./components/MyButton.js";
```

Современные браузеры поддерживают Custom Elements нативно. Для очень старых можно добавить polyfill `@webcomponents/webcomponentsjs` (обычно не требуется).

<!-- s -->

## CI/CD для сборки

- Node.js 20 LTS, npm 10
- Линт и сборка в GitHub Actions
- Кэш npm/pnpm, артефакты сборки

<!-- v -->

```yaml
name: Build
on: [push]
jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: "20"
          cache: "npm"
      - run: npm ci
      - run: npm run lint || true
      - run: npm run build
```

<!-- s -->

## Домашнее задание

Полное описание в учебном портале и в ветке урока tack

<!-- s -->

## Q&A

Вопросы по Vite/Webpack/Rollup, Web Components и CI‑сборке?
