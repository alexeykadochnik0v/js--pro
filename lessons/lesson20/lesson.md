---
title: "Урок 20: Vue Router и Advanced Vue"
description: "Роутинг, динамические маршруты, Transitions, Slots, Nuxt"
---

# Vue Router и Advanced Vue

## Роутинг, переходы, продвинутые возможности

<!-- v -->

## Как меня слышно и видно?

> Напишите в чат

- **+** если все хорошо
- **–** если есть проблемы со звуком или с видео

<!-- v -->

## Цели занятия

- Освоить Vue Router для SPA навигации
- Создавать динамические и вложенные маршруты
- Использовать Navigation Guards
- Применять Transitions для анимаций
- Работать со Slots
- Познакомиться с Nuxt 3

<!-- v -->

## Краткое содержание

- Vue Router: установка, роуты, навигация
- Динамические маршруты и параметры
- Navigation Guards
- Transitions для анимаций
- Slots (продвинутое использование)
- Введение в Nuxt 3

<!-- v -->

## Результат занятия

Vue SPA с маршрутизацией, анимациями и пониманием продвинутых возможностей

<!-- v -->

## Компетенции по занятию

**Владеть продвинутыми возможностями Vue 3**

- Настройка и использование Vue Router
- Динамические маршруты и guards
- Анимации с Transition
- Продвинутая работа со слотами
- Понимание Nuxt 3

<!-- s -->

## Зачем нужен роутинг?

**SPA** (Single Page Application) — приложение на одной HTML странице

<!-- v -->

## Проблема без роутинга

```vue
<script setup>
import { ref } from "vue";
const currentPage = ref("home");
</script>

<template>
  <nav>
    <button @click="currentPage = 'home'">Home</button>
    <button @click="currentPage = 'about'">About</button>
  </nav>

  <div v-if="currentPage === 'home'">Home page</div>
  <div v-if="currentPage === 'about'">About page</div>
</template>
```

Проблемы:

- URL не меняется
- Нельзя поделиться ссылкой
- Не работают кнопки браузера назад/вперед
- Нет истории навигации

<!-- s -->

## Vue Router

**Официальная библиотека роутинга для Vue.js**

<!-- v -->

## Установка

**При создании проекта:**

```bash
npm create vue@latest
# Add Vue Router? Yes
```

**В существующий проект:**

```bash
npm install vue-router@4
```

<!-- v -->

## Настройка Router

**src/router/index.ts:**

```typescript
import { createRouter, createWebHistory } from "vue-router";
import HomeView from "@/views/HomeView.vue";
import AboutView from "@/views/AboutView.vue";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/",
      name: "home",
      component: HomeView,
    },
    {
      path: "/about",
      name: "about",
      component: AboutView,
    },
  ],
});

export default router;
```

<!-- v -->

## Подключение к приложению

**src/main.ts:**

```typescript
import { createApp } from "vue";
import { createPinia } from "pinia";
import App from "./App.vue";
import router from "./router";

const app = createApp(App);

app.use(createPinia());
app.use(router);
app.mount("#app");
```

<!-- v -->

## RouterView и RouterLink

**App.vue:**

```vue
<script setup lang="ts">
import { RouterLink, RouterView } from "vue-router";
</script>

<template>
  <nav>
    <RouterLink to="/">Home</RouterLink>
    <RouterLink to="/about">About</RouterLink>
  </nav>

  <main>
    <RouterView />
  </main>
</template>
```

**RouterView** — отображает компонент активного маршрута
**RouterLink** — ссылка для навигации (без перезагрузки страницы)

<!-- s -->

## Динамические маршруты

**Маршруты с параметрами**

<!-- v -->

## Параметры в URL

```typescript
const router = createRouter({
  routes: [
    {
      path: "/users/:id",
      name: "user",
      component: UserView,
    },
    {
      path: "/posts/:id(\\d+)", // только цифры
      component: PostView,
    },
    {
      path: "/articles/:id?", // опциональный параметр
      component: ArticleView,
    },
  ],
});
```

<!-- v -->

## Доступ к параметрам

**Composition API:**

```vue
<script setup lang="ts">
import { useRoute } from "vue-router";
import { watch } from "vue";

const route = useRoute();

// Доступ к параметру
const userId = route.params.id;

// Отслеживание изменений
watch(
  () => route.params.id,
  async (newId) => {
    // Загрузить новые данные
    await fetchUser(newId);
  }
);
</script>

<template>
  <div>User ID: {{ route.params.id }}</div>
</template>
```

<!-- v -->

## Query параметры

```vue
<script setup lang="ts">
import { useRoute } from "vue-router";

const route = useRoute();

// URL: /search?q=vue&sort=date
const searchQuery = route.query.q; // 'vue'
const sortBy = route.query.sort; // 'date'
</script>
```

**Создание ссылки с query:**

```vue
<RouterLink :to="{ path: '/search', query: { q: 'vue', sort: 'date' } }">
  Search
</RouterLink>
```

<!-- s -->

## Программная навигация

**Навигация из кода**

<!-- v -->

## useRouter

```vue
<script setup lang="ts">
import { useRouter } from "vue-router";

const router = useRouter();

function goToUser(id: number) {
  // По path
  router.push(`/users/${id}`);

  // По name
  router.push({ name: "user", params: { id } });

  // С query
  router.push({ path: "/search", query: { q: "vue" } });
}

function goBack() {
  router.back();
}

function goForward() {
  router.forward();
}

// Заменить текущую запись (без добавления в историю)
function replaceRoute() {
  router.replace({ name: "home" });
}
</script>
```

<!-- s -->

## Navigation Guards

**Защита маршрутов и контроль навигации**

<!-- v -->

## Глобальные Guards

```typescript
// router/index.ts
import { useUserStore } from "@/stores/user";

const router = createRouter({ ... });

// Перед каждым переходом
router.beforeEach((to, from) => {
  const userStore = useUserStore();

  // Проверка авторизации
  if (to.meta.requiresAuth && !userStore.isLoggedIn) {
    return { name: "login" };
  }

  // Проверка прав
  if (to.meta.requiresAdmin && !userStore.isAdmin) {
    return { name: "forbidden" };
  }
});

// После каждого перехода
router.afterEach((to, from) => {
  document.title = to.meta.title || "My App";
});

export default router;
```

<!-- v -->

## Meta поля

```typescript
const routes = [
  {
    path: "/",
    component: HomeView,
    meta: { title: "Home" },
  },
  {
    path: "/admin",
    component: AdminView,
    meta: {
      requiresAuth: true,
      requiresAdmin: true,
      title: "Admin Panel",
    },
  },
];
```

<!-- v -->

## Per-Route Guards

```typescript
const routes = [
  {
    path: "/users/:id/edit",
    component: UserEdit,
    beforeEnter: (to, from) => {
      // Проверить права на редактирование
      const canEdit = checkEditPermission(to.params.id);
      if (!canEdit) {
        return { name: "forbidden" };
      }
    },
  },
];
```

<!-- v -->

## In-Component Guards

```vue
<script setup lang="ts">
import { onBeforeRouteLeave, onBeforeRouteUpdate } from "vue-router";

const hasUnsavedChanges = ref(false);

// Перед уходом со страницы
onBeforeRouteLeave((to, from) => {
  if (hasUnsavedChanges.value) {
    const answer = window.confirm(
      "У вас есть несохраненные изменения. Покинуть страницу?"
    );
    if (!answer) return false;
  }
});

// При обновлении параметров маршрута
onBeforeRouteUpdate(async (to, from) => {
  // Загрузить новые данные без перезагрузки компонента
  await fetchData(to.params.id);
});
</script>
```

<!-- s -->

## Transitions

**Анимации при переходах между компонентами**

<!-- v -->

## Базовый Transition

```vue
<template>
  <Transition name="fade">
    <div v-if="show">Content</div>
  </Transition>
</template>

<style>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.5s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
```

**Классы:** `v-enter-from`, `v-enter-active`, `v-enter-to`, `v-leave-from`, `v-leave-active`, `v-leave-to`

<!-- v -->

## Transition для роутов

```vue
<template>
  <RouterView v-slot="{ Component }">
    <Transition name="fade" mode="out-in">
      <component :is="Component" />
    </Transition>
  </RouterView>
</template>
```

**mode:**

- `out-in` — старый компонент уходит, потом новый появляется
- `in-out` — новый компонент появляется, потом старый уходит

<!-- v -->

## TransitionGroup

**Для анимации списков:**

```vue
<template>
  <TransitionGroup name="list" tag="ul">
    <li v-for="item in items" :key="item.id">
      {{ item.text }}
    </li>
  </TransitionGroup>
</template>

<style>
.list-move,
.list-enter-active,
.list-leave-active {
  transition: all 0.5s ease;
}

.list-enter-from,
.list-leave-to {
  opacity: 0;
  transform: translateX(30px);
}

.list-leave-active {
  position: absolute;
}
</style>
```

<!-- s -->

## Slots

**Продвинутое использование слотов**

<!-- v -->

## Именованные слоты

```vue
<!-- BaseLayout.vue -->
<template>
  <div class="container">
    <header>
      <slot name="header"></slot>
    </header>

    <main>
      <slot></slot>
      <!-- default slot -->
    </main>

    <footer>
      <slot name="footer"></slot>
    </footer>
  </div>
</template>
```

**Использование:**

```vue
<BaseLayout>
  <template #header>
    <h1>Page Title</h1>
  </template>

  <p>Main content</p>

  <template #footer>
    <p>Footer info</p>
  </template>
</BaseLayout>
```

<!-- v -->

## Scoped Slots

**Передача данных из дочернего в родительский:**

```vue
<!-- TodoList.vue -->
<template>
  <ul>
    <li v-for="todo in todos" :key="todo.id">
      <slot :todo="todo" :index="index"></slot>
    </li>
  </ul>
</template>
```

**Использование:**

```vue
<TodoList :todos="todos">
  <template #default="{ todo, index }">
    <span>{{ index + 1 }}. {{ todo.text }}</span>
  </template>
</TodoList>
```

<!-- s -->

## Nuxt 3

**Full-stack фреймворк на базе Vue 3**

<!-- v -->

## Что такое Nuxt?

**Nuxt** — фреймворк для создания Vue-приложений с SSR, SSG и другими возможностями

**Основные возможности:**

- Server-Side Rendering (SSR)
- Static Site Generation (SSG)
- File-based роутинг
- Auto-imports
- API routes (backend)
- SEO оптимизация
- Встроенный TypeScript

<!-- v -->

## Создание Nuxt проекта

```bash
npx nuxi@latest init my-app
cd my-app
npm install
npm run dev
```

**Структура:**

```
my-app/
├── pages/           # Автоматический роутинг
│   ├── index.vue    # /
│   ├── about.vue    # /about
│   └── users/
│       └── [id].vue # /users/:id
├── components/      # Автоимпорт компонентов
├── composables/     # Автоимпорт composables
├── server/          # API endpoints
└── app.vue          # Корневой компонент
```

<!-- v -->

## File-based роутинг

**Файлы в `pages/` автоматически становятся роутами:**

```
pages/
├── index.vue          → /
├── about.vue          → /about
├── posts/
│   ├── index.vue      → /posts
│   ├── [id].vue       → /posts/:id
│   └── [...slug].vue  → /posts/*
└── admin/
    └── index.vue      → /admin
```

**Без настройки роутера!**

<!-- s -->

## Домашнее задание

Полное описание в учебном портале и в ветке урока tack

<!-- s -->

## Q&A

**Вопросы?**

- Vue Router vs React Router
- Когда использовать Nuxt?
- SSR vs CSR vs SSG
- Best practices для роутинга
