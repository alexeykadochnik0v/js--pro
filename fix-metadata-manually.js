const fs = require("fs");
const path = require("path");

// Функция для исправления метаданных в файле урока
function fixMetadata(lessonDir, title) {
  const lessonPath = path.join(__dirname, "lessons", lessonDir, "lesson.md");

  if (fs.existsSync(lessonPath)) {
    let content = fs.readFileSync(lessonPath, "utf8");

    // Удаляем существующие метаданные, если они есть
    content = content.replace(/^---[\s\S]*?---\n\n/, "");

    // Извлекаем номер урока из имени директории
    const lessonNumber = lessonDir.replace("lesson", "");

    // Добавляем метаданные в начало файла
    const newContent = `---
title: Урок ${lessonNumber}
description: ${title}
---

${content}`;

    fs.writeFileSync(lessonPath, newContent);
    console.log(`Fixed metadata in ${lessonDir}/lesson.md`);
  } else {
    console.log(`File ${lessonPath} does not exist`);
  }
}

// Исправляем метаданные для каждого урока вручную
fixMetadata("lesson01", "Современный JavaScript и настройка окружения");
fixMetadata("lesson02", "ООП в JavaScript");
fixMetadata("lesson03", "Основы функциональной разработки");
fixMetadata("lesson04", "Введение в TypeScript");
fixMetadata("lesson05", "Управление состоянием приложения с Redux Toolkit");
fixMetadata("lesson06", "Клиентский роутинг и SPA");
fixMetadata("lesson07", "Деплой и сборка SPA (CI/CD, Vercel, Netlify)");
fixMetadata("lesson08", "Build tools (Vite, Webpack, Rollup, Web Components)");
fixMetadata("lesson09", "React, JSX и настройка окружения");
fixMetadata("lesson10", "Hooks в React");
fixMetadata("lesson11", "Современные паттерны в React");
fixMetadata("lesson12", "TypeScript в React");
fixMetadata(
  "lesson13",
  "Состояние приложения в React с Redux Toolkit, Zustand, React Query"
);
fixMetadata(
  "lesson14",
  "React Router, ленивая загрузка компонентов, Suspense, оптимизация React-приложения"
);
fixMetadata(
  "lesson15",
  "Тестирование React-приложений: React Testing Library, Jest"
);
fixMetadata("lesson16", "Консультация по ДЗ");
fixMetadata("lesson17", "Основы Vue3: компоненты, реактивность");
fixMetadata("lesson18", "Управление компонентами во Vue: Composition API");
fixMetadata("lesson19", "Состояние приложения во Vue: Pinia");
fixMetadata("lesson20", "Routing и Advanced Vue: динамические маршруты, Nuxt");
fixMetadata("lesson21", "Консультация по ДЗ");
fixMetadata(
  "lesson22",
  "Архитектура фронтенд-приложений: микрофронтенды, Monorepo, принципы SOLID"
);
fixMetadata(
  "lesson23",
  "Современные рендеринг-фреймворки и SSR: Next.js, Nuxt 3, SvelteKit, SSG/ISR"
);
fixMetadata("lesson24", "Разработка собственного API");
fixMetadata("lesson25", "REST, RPC и сетевые запросы");
fixMetadata("lesson26", "Введение в Node.js и NPM, работа с браузером");
fixMetadata("lesson27", "Под капотом Node.js: Event Loop, Timers, модули");
fixMetadata("lesson28", "Серверный фреймворк Nest.js и его альтернативы");
fixMetadata("lesson29", "Базы данных: SQL и NoSQL, ORM и ODM");
fixMetadata("lesson30", "Контейнеризация с Docker");
fixMetadata("lesson31", "Консультация по ДЗ");
fixMetadata(
  "lesson32",
  "Проектная работа: выбор проекта, планирование, архитектура"
);
fixMetadata("lesson33", "Проектная работа: защита проекта");

console.log("Metadata fixed in all lesson files");
