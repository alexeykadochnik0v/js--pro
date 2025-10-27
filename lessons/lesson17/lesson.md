---
title: "Урок 17: Основы Vue3"
description: "Компоненты, реактивность, синтаксис шаблонов"
---

# Основы Vue3

## Компоненты, реактивность, синтаксис шаблонов

<!-- v -->

## Как меня слышно и видно?

> Напишите в чат

- **+** если все хорошо
- **–** если есть проблемы со звуком или с видео

<!-- v -->

## Цели занятия

- Понять философию Vue и отличия от React
- Создавать Vue-компоненты с Composition API
- Работать с базовой реактивностью (ref, reactive)
- Применять синтаксис шаблонов и директивы Vue
- Обрабатывать события и формы

<!-- v -->

## Краткое содержание

- Введение в Vue: философия и экосистема
- Настройка окружения через Vite
- Single File Components (SFC)
- Базовая реактивность: ref() и reactive()
- Синтаксис шаблонов и директивы
- Практические примеры

<!-- v -->

## Результат занятия

Vue-приложение с компонентами, использующими базовую реактивность, директивы и обработку событий

<!-- v -->

## Компетенции по занятию

**Создавать приложения на Vue 3**

- Применение Composition API
- Работа с реактивностью
- Использование директив и синтаксиса шаблонов
- Обработка событий и форм

<!-- s -->

## Что такое Vue?

**Vue** (произносится /vjuː/, как "view") — прогрессивный фреймворк для создания пользовательских интерфейсов

### Особенности:

- **Прогрессивный** — можно использовать минимально или максимально
- **Template-based** — HTML-подобный синтаксис
- **Реактивный** — автоматическое обновление UI
- **Легковесный** — ~30% меньше React

<!-- s -->

## Vue vs React: Философия

**Вы уже знаете React, давайте сравним подходы:**

| Аспект       | React                   | Vue                      |
| ------------ | ----------------------- | ------------------------ |
| Синтаксис    | JSX (JavaScript + HTML) | Templates (HTML + JS)    |
| Реактивность | Implicit (useState)     | Explicit (ref, reactive) |
| Стиль        | JavaScript everywhere   | Декларативные директивы  |
| Компоненты   | Функции                 | SFC (.vue файлы)         |
| Логика       | Hooks                   | Composition API (похоже) |
| Экосистема   | Community-driven        | Official (Router, Pinia) |

<!-- v -->

### Пример: React vs Vue

**React (вы знаете):**

```jsx
import { useState } from "react";

function Counter() {
  const [count, setCount] = useState(0);

  return (
    <div>
      <p>Count: {count}</p>
      <button onClick={() => setCount(count + 1)}>+1</button>
    </div>
  );
}
```

<!-- v -->

**Vue (будем изучать):**

```vue
<script setup>
import { ref } from "vue";
const count = ref(0);
</script>

<template>
  <div>
    <p>Count: {{ count }}</p>
    <button @click="count++">+1</button>
  </div>
</template>
```

<!-- s -->

## Экосистема Vue

**Официальные инструменты:**

- **Vite** — сборщик проектов (быстрее Webpack)
- **Vue Router** — клиентский роутинг
- **Pinia** — управление состоянием (как Redux Toolkit)
- **Vue DevTools** — отладка в браузере
- **Vue Test Utils** — тестирование компонентов

**Документация:** https://vuejs.org/

<!-- s -->

## Настройка окружения

**Создание проекта через Vite:**

```bash
npm create vue@latest

# Project name: my-vue-app
# Add TypeScript? Yes
# Add Vue Router? No (изучим позже)
# Add Pinia? No (изучим позже)
```

**Запуск проекта:**

```bash
cd my-vue-app
npm install
npm run dev
```

<!-- v -->

## Структура проекта

```
my-vue-app/
├── public/           # Статические файлы
├── src/
│   ├── assets/      # Изображения, стили
│   ├── components/  # Компоненты
│   ├── App.vue      # Корневой компонент
│   └── main.ts      # Точка входа
├── index.html       # HTML шаблон
├── vite.config.ts   # Настройки Vite
└── package.json
```

<!-- v -->

## Точка входа: main.ts

```typescript
import { createApp } from "vue";
import App from "./App.vue";
import "./assets/main.css";

createApp(App).mount("#app");
```

**Сравнение с React:**

```typescript
import { createRoot } from "react-dom/client";
createRoot(document.getElementById("root")).render(<App />);
```

<!-- s -->

## Single File Components (SFC)

**Однофайловые компоненты** — формат `.vue`

```vue
<script setup lang="ts">
import { ref } from "vue";
const greeting = ref("Hello Vue!");
</script>

<template>
  <p class="greeting">{{ greeting }}</p>
</template>

<style scoped>
.greeting {
  color: red;
  font-weight: bold;
}
</style>
```

<!-- s -->

## ref() — реактивные переменные

```javascript
import { ref } from "vue";

const count = ref(0);

console.log(count.value); // 0
count.value++; // изменение
```

**TypeScript:**

```typescript
const count = ref<number>(0);
const user = ref<User | null>(null);
```

<!-- v -->

## reactive() — для объектов

```javascript
import { reactive } from "vue";

const user = reactive({
  name: "John",
  age: 25,
});

user.age = 26; // Прямой доступ, без .value
```

<!-- v -->

## ref() vs reactive()

**✅ ref()** для:

- Примитивов (number, string, boolean)
- Когда нужно заменить весь объект

**✅ reactive()** для:

- Объектов (форма, настройки)
- Группировки данных

```javascript
const count = ref(0);
const form = reactive({ email: "", password: "" });
```

<!-- s -->

## Директивы Vue

- `v-bind` (`:`) — связывание атрибутов
- `v-on` (`@`) — обработка событий
- `v-if` / `v-else` — условный рендеринг
- `v-for` — списки
- `v-model` — двустороннее связывание
- `v-show` — показать/скрыть

<!-- v -->

## v-bind и v-on

```vue
<template>
  <!-- v-bind сокращенно : -->
  <button :id="buttonId" :disabled="isDisabled">Submit</button>

  <!-- v-on сокращенно @ -->
  <button @click="handleClick">Click</button>
</template>
```

<!-- v -->

## Модификаторы событий

```vue
<template>
  <!-- Предотвратить действие по умолчанию -->
  <form @submit.prevent="handleSubmit"></form>

  <!-- Остановить всплытие -->
  <div @click.stop="handleClick"></div>
</template>
```

<!-- v -->

## v-if / v-else

```vue
<template>
  <div v-if="loading">Loading...</div>
  <div v-else-if="isLoggedIn">Welcome!</div>
  <div v-else>Please log in</div>
</template>
```

<!-- v -->

## v-for с :key

```vue
<script setup>
const todos = ref([
  { id: 1, text: "Learn Vue" },
  { id: 2, text: "Build app" },
]);
</script>

<template>
  <li v-for="todo in todos" :key="todo.id">{{ todo.text }}</li>
</template>
```

<!-- v -->

## v-model

```vue
<script setup>
const email = ref("");
const remember = ref(false);
</script>

<template>
  <input v-model="email" type="email" />
  <input v-model="remember" type="checkbox" />
</template>
```

<!-- s -->

## Практические примеры

<!-- v -->

## Пример 1: Счетчик (JavaScript)

```vue
<script setup>
import { ref } from "vue";

const count = ref(0);

const increment = () => count.value++;
const decrement = () => count.value--;
const reset = () => (count.value = 0);
</script>

<template>
  <div class="counter">
    <h2>Counter: {{ count }}</h2>
    <div class="buttons">
      <button @click="decrement">-</button>
      <button @click="reset">Reset</button>
      <button @click="increment">+</button>
    </div>
  </div>
</template>

<style scoped>
.counter {
  text-align: center;
  padding: 20px;
}
.buttons {
  display: flex;
  gap: 10px;
  justify-content: center;
}
button {
  padding: 10px 20px;
  font-size: 16px;
  cursor: pointer;
}
</style>
```

<!-- v -->

## Пример 1: Счетчик (TypeScript)

```vue
<script setup lang="ts">
import { ref } from "vue";

const count = ref<number>(0);

const increment = (): void => {
  count.value++;
};

const decrement = (): void => {
  count.value--;
};

const reset = (): void => {
  count.value = 0;
};
</script>

<template>
  <div class="counter">
    <h2>Counter: {{ count }}</h2>
    <div class="buttons">
      <button @click="decrement">-</button>
      <button @click="reset">Reset</button>
      <button @click="increment">+</button>
    </div>
  </div>
</template>

<style scoped>
.counter {
  text-align: center;
  padding: 20px;
}
.buttons {
  display: flex;
  gap: 10px;
  justify-content: center;
}
button {
  padding: 10px 20px;
  font-size: 16px;
  cursor: pointer;
}
</style>
```

<!-- v -->

## Пример 2: Todo List (JavaScript)

```vue
<script setup>
import { ref } from "vue";

const newTodo = ref("");
const todos = ref([
  { id: 1, text: "Learn Vue", done: false },
  { id: 2, text: "Build app", done: false },
]);

const addTodo = () => {
  if (newTodo.value.trim()) {
    todos.value.push({
      id: Date.now(),
      text: newTodo.value,
      done: false,
    });
    newTodo.value = "";
  }
};

const removeTodo = (id) => {
  todos.value = todos.value.filter((todo) => todo.id !== id);
};

const toggleTodo = (todo) => {
  todo.done = !todo.done;
};
</script>

<template>
  <div class="todo-app">
    <h2>Todo List</h2>

    <form @submit.prevent="addTodo">
      <input v-model="newTodo" placeholder="Add new todo" />
      <button type="submit">Add</button>
    </form>

    <ul v-if="todos.length">
      <li v-for="todo in todos" :key="todo.id" :class="{ done: todo.done }">
        <input type="checkbox" :checked="todo.done" @change="toggleTodo(todo)" />
        <span>{{ todo.text }}</span>
        <button @click="removeTodo(todo.id)">Delete</button>
      </li>
    </ul>

    <p v-else>No todos yet!</p>
  </div>
</template>

<style scoped>
.todo-app {
  max-width: 500px;
  margin: 0 auto;
  padding: 20px;
}
form {
  display: flex;
  gap: 10px;
  margin-bottom: 20px;
}
input[type="text"] {
  flex: 1;
  padding: 10px;
}
ul {
  list-style: none;
  padding: 0;
}
li {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 10px;
  border-bottom: 1px solid #ccc;
}
li.done span {
  text-decoration: line-through;
  color: #999;
}
</style>
```

<!-- v -->

## Пример 2: Todo List (TypeScript)

```vue
<script setup lang="ts">
import { ref } from "vue";

interface Todo {
  id: number;
  text: string;
  done: boolean;
}

const newTodo = ref<string>("");
const todos = ref<Todo[]>([
  { id: 1, text: "Learn Vue", done: false },
  { id: 2, text: "Build app", done: false },
]);

const addTodo = (): void => {
  if (newTodo.value.trim()) {
    todos.value.push({
      id: Date.now(),
      text: newTodo.value,
      done: false,
    });
    newTodo.value = "";
  }
};

const removeTodo = (id: number): void => {
  todos.value = todos.value.filter((todo) => todo.id !== id);
};

const toggleTodo = (todo: Todo): void => {
  todo.done = !todo.done;
};
</script>

<template>
  <div class="todo-app">
    <h2>Todo List</h2>

    <form @submit.prevent="addTodo">
      <input v-model="newTodo" placeholder="Add new todo" />
      <button type="submit">Add</button>
    </form>

    <ul v-if="todos.length">
      <li v-for="todo in todos" :key="todo.id" :class="{ done: todo.done }">
        <input type="checkbox" :checked="todo.done" @change="toggleTodo(todo)" />
        <span>{{ todo.text }}</span>
        <button @click="removeTodo(todo.id)">Delete</button>
      </li>
    </ul>

    <p v-else>No todos yet!</p>
  </div>
</template>

<style scoped>
.todo-app {
  max-width: 500px;
  margin: 0 auto;
  padding: 20px;
}
form {
  display: flex;
  gap: 10px;
  margin-bottom: 20px;
}
input[type="text"] {
  flex: 1;
  padding: 10px;
}
ul {
  list-style: none;
  padding: 0;
}
li {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 10px;
  border-bottom: 1px solid #ccc;
}
li.done span {
  text-decoration: line-through;
  color: #999;
}
</style>
```

<!-- s -->

## Vue DevTools

**Расширение браузера для отладки Vue-приложений**

- Просмотр дерева компонентов
- Инспектирование реактивных данных
- Отслеживание событий
- Анализ производительности

**Установка:** https://devtools.vuejs.org/

<!-- s -->

## Домашнее задание

Полное описание в учебном портале и в ветке урока tack

<!-- s -->

## Q&A

**Вопросы?**
