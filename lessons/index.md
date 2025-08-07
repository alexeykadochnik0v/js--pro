<!DOCTYPE html>
<html lang="ru">
<head>
  <meta charset="utf-8">
  <title>JavaScript Professional — OTUS</title>
  <meta name="viewport" content="width=device-width,initial-scale=1">
  <style>
.course-modules {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(390px, 1fr));
  gap: 1.5rem;
  margin-top: 0.5rem;
  padding: 2vw;
  box-sizing: border-box;
}
.module {
  background: #f8f9fa;
  border-radius: 10px;
  padding: 1.1rem 1.2rem 0.7rem 1.2rem;
  box-shadow: 0 1px 6px #0001;
  min-width: 380px;
  max-width: 650px;
  flex: 1 1 420px;
  margin-bottom: 0;
}
.module-title {
  font-size: 1.12rem;
  font-weight: 600;
  margin-bottom: 0.4rem;
  color: #2d3a4a;
}
.lessons {
  display: flex;
  flex-wrap: wrap;
  gap: 0.7rem;
}
.lesson-card {
  background: white;
  border: 1px solid #e0e0e0;
  border-radius: 7px;
  padding: 0.45rem 1.1rem;
  min-width: 200px;
  margin-bottom: 0.5rem;
  transition: box-shadow 0.15s, border 0.15s;
  text-decoration: none;
  color: #1a2330;
  font-weight: 500;
  box-shadow: 0 1px 4px #0001;
  font-size: 1rem;
}
.lesson-card:hover {
  box-shadow: 0 2px 8px #b4d5ff44;
  border-color: #b4d5ff;
  background: #f7fbff;
  transition: box-shadow 0.25s, border 0.25s, background 0.25s;
}
.reveal .slides, .reveal .present {
  margin: 0 !important;
  padding: 0 !important;
  text-align: left !important;
  top: 0 !important;
  left: 0 !important;
  right: 0 !important;
  bottom: 0 !important;
  width: 100% !important;
  height: 100% !important;
  pointer-events: auto !important;
  position: relative !important;
  box-sizing: border-box !important;
}

.reveal .controls, .reveal .navigate-right, .reveal .navigate-left, .reveal .navigate-up, .reveal .navigate-down {
display: none !important;
}

<script>
document.addEventListener("DOMContentLoaded", function () {
  // Отключаем переход к следующему разделу при прокрутке вниз
  if (window.Reveal) {
    Reveal.configure({ controls: false, keyboard: false, touch: false, mouseWheel: false });
    // Удаляем обработчики wheel, если они были навешаны reveal.js
    window.removeEventListener('wheel', Reveal.getConfig()._wheelListener || (()=>{}), true);
  }
});
</style>
</head>
<body>

<div class="course-modules">

<div class="module">
  <div class="module-title">Модуль 1: Продвинутые основы JavaScript и TypeScript</div>
  <div class="lessons">
    <a class="lesson-card" href="lesson01/lesson.md">Урок 1: Современный JavaScript и настройка окружения</a>
    <a class="lesson-card" href="lesson02/lesson.md">Урок 2: ООП в JavaScript</a>
    <a class="lesson-card" href="lesson03/lesson.md">Урок 3: Основы функциональной разработки</a>
    <a class="lesson-card" href="lesson04/lesson.md">Урок 4: Введение в TypeScript</a>
  </div>
</div>

<div class="module">
  <div class="module-title">Модуль 2: Инфраструктура фронтенда</div>
  <div class="lessons">
    <a class="lesson-card" href="lesson05/lesson.md">Урок 5: Управление состоянием приложения с Redux Toolkit</a>
    <a class="lesson-card" href="lesson06/lesson.md">Урок 6: Клиентский роутинг и SPA</a>
    <a class="lesson-card" href="lesson07/lesson.md">Урок 7: Деплой и сборка SPA (CI/CD, Vercel, Netlify)</a>
    <a class="lesson-card" href="lesson08/lesson.md">Урок 8: Build tools (Vite, Webpack, Rollup, Web Components)</a>
  </div>
</div>

<div class="module">
  <div class="module-title">Модуль 3: React и экосистема</div>
  <div class="lessons">
    <a class="lesson-card" href="lesson09/lesson.md">Урок 9: React, JSX и настройка окружения</a>
    <a class="lesson-card" href="lesson10/lesson.md">Урок 10: Hooks в React</a>
    <a class="lesson-card" href="lesson11/lesson.md">Урок 11: Современные паттерны в React</a>
    <a class="lesson-card" href="lesson12/lesson.md">Урок 12: TypeScript в React</a>
    <a class="lesson-card" href="lesson13/lesson.md">Урок 13: Состояние приложения в React с Redux Toolkit, Zustand, React Query</a>
    <a class="lesson-card" href="lesson14/lesson.md">Урок 14: React Router, ленивая загрузка компонентов, Suspense, оптимизация React-приложения</a>
    <a class="lesson-card" href="lesson15/lesson.md">Урок 15: Тестирование React-приложений: React Testing Library, Jest</a>
    <a class="lesson-card" href="lesson16/lesson.md">Урок 16: Консультация по ДЗ</a>
  </div>
</div>

<div class="module">
  <div class="module-title">Модуль 4: Vue и экосистема</div>
  <div class="lessons">
    <a class="lesson-card" href="lesson17/lesson.md">Урок 17: Основы Vue3: компоненты, реактивность</a>
    <a class="lesson-card" href="lesson18/lesson.md">Урок 18: Управление компонентами во Vue: Composition API</a>
    <a class="lesson-card" href="lesson19/lesson.md">Урок 19: Состояние приложения во Vue: Pinia</a>
    <a class="lesson-card" href="lesson20/lesson.md">Урок 20: Routing и Advanced Vue: динамические маршруты, Nuxt</a>
    <a class="lesson-card" href="lesson21/lesson.md">Урок 21: Консультация по ДЗ</a>
  </div>
</div>

<div class="module">
  <div class="module-title">Модуль 5: Архитектура и SSR</div>
  <div class="lessons">
    <a class="lesson-card" href="lesson22/lesson.md">Урок 22: Архитектура фронтенд-приложений: микрофронтенды, Monorepo, принципы SOLID</a>
    <a class="lesson-card" href="lesson23/lesson.md">Урок 23: Современные рендеринг-фреймворки и SSR: Next.js, Nuxt 3, SvelteKit, SSG/ISR</a>
  </div>
</div>

<div class="module">
  <div class="module-title">Модуль 6: Backend и серверные технологии</div>
  <div class="lessons">
    <a class="lesson-card" href="lesson24/lesson.md">Урок 24: Разработка собственного API</a>
    <a class="lesson-card" href="lesson25/lesson.md">Урок 25: REST, RPC и сетевые запросы</a>
    <a class="lesson-card" href="lesson26/lesson.md">Урок 26: Введение в Node.js и NPM, работа с браузером</a>
    <a class="lesson-card" href="lesson27/lesson.md">Урок 27: Под капотом Node.js: Event Loop, Timers, модули</a>
    <a class="lesson-card" href="lesson28/lesson.md">Урок 28: Серверный фреймворк Nest.js и его альтернативы</a>
    <a class="lesson-card" href="lesson29/lesson.md">Урок 29: Базы данных: SQL и NoSQL, ORM и ODM</a>
    <a class="lesson-card" href="lesson30/lesson.md">Урок 30: Контейнеризация с Docker</a>
    <a class="lesson-card" href="lesson31/lesson.md">Урок 31: Консультация по ДЗ</a>
  </div>
</div>

<div class="module">
  <div class="module-title">Модуль 7: Проектная работа</div>
  <div class="lessons">
    <a class="lesson-card" href="lesson32/lesson.md">Урок 32: Проектная работа: выбор проекта, планирование, архитектура</a>
    <a class="lesson-card" href="lesson33/lesson.md">Урок 33: Проектная работа: защита проекта</a>
  </div>
</div>

</div>
