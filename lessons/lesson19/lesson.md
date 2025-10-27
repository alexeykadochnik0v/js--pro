---
title: "Урок 19: Pinia - State Management во Vue"
description: "Глобальное состояние, stores, getters, actions"
---

# Pinia - State Management

## Глобальное состояние приложения во Vue

<!-- v -->

## Как меня слышно и видно?

> Напишите в чат

- **+** если все хорошо
- **–** если есть проблемы со звуком или с видео

<!-- v -->

## Цели занятия

- Понять зачем нужен state management
- Освоить создание stores в Pinia
- Научиться работать с state, getters и actions
- Организовать взаимодействие между stores
- Использовать плагины и подписки
- Применить Pinia на практике

<!-- v -->

## Краткое содержание

- State Management Pattern (зачем нужен)
- История: Flux, Redux, Vuex
- Pinia — современное решение для Vue 3
- Создание stores (Options & Composition API)
- State, Getters, Actions
- Взаимодействие между stores
- Практические примеры

<!-- v -->

## Результат занятия

Vue-приложение с глобальным состоянием, управляемым через Pinia stores

<!-- v -->

## Компетенции по занятию

**Управлять глобальным состоянием через Pinia**

- Создание и настройка stores
- Работа с state, getters, actions
- Организация взаимодействия между stores
- Использование Pinia DevTools

<!-- s -->

## Зачем нужен State Management?

**Проблема:** когда приложение растет, управление состоянием усложняется

<!-- v -->

## Проблема без State Management

```vue
<!-- ParentComponent.vue -->
<script setup>
import { ref } from "vue";
const user = ref(null);
const cart = ref([]);
</script>

<template>
  <Header :user="user" />
  <ProductList :cart="cart" @add-to-cart="..." />
  <Cart :cart="cart" :user="user" @checkout="..." />
  <Footer :user="user" />
</template>
```

Проблемы:
- Props drilling — передача данных через множество уровней
- Сложно синхронизировать состояние
- Дублирование логики в компонентах

<!-- v -->

## State Management Pattern

**Централизованное хранилище состояния:**

```
┌─────────────────────────────────┐
│      Global Store (Pinia)       │
│  ┌─────────┐  ┌─────────┐       │
│  │  User   │  │  Cart   │  ...  │
│  └─────────┘  └─────────┘       │
└─────────────────────────────────┘
         ↓          ↓          ↓
    ┌────────┐  ┌────────┐  ┌────────┐
    │ Header │  │Product │  │  Cart  │
    └────────┘  └────────┘  └────────┘
```

Преимущества:
- Единый источник истины
- Предсказуемое управление состоянием
- Легко тестировать и отлаживать

<!-- v -->

## История: Vuex → Pinia

**Vuex** (устаревший):
- Основан на mutations (синхронные)
- Сложный для TypeScript
- Больше boilerplate кода

**Pinia** (современный):
- Нет mutations — только actions
- Отличная поддержка TypeScript
- Проще и интуитивнее
- Официально рекомендуется для Vue 3

<!-- s -->

## Что такое Pinia?

**Pinia** — официальная библиотека управления состоянием для Vue 3

<!-- v -->

## Преимущества Pinia

- **Простота** — меньше концепций, проще API
- **TypeScript** — полная типизация из коробки
- **DevTools** — интеграция с Vue DevTools
- **SSR** — поддержка Server-Side Rendering
- **Модульность** — несколько независимых stores
- **Легковесность** — ~1KB (gzip)

<!-- v -->

## Установка Pinia

**При создании проекта:**

```bash
npm create vue@latest
# Add Pinia? Yes
```

**В существующий проект:**

```bash
npm install pinia
```

**Подключение в main.ts:**

```typescript
import { createApp } from "vue";
import { createPinia } from "pinia";
import App from "./App.vue";

const app = createApp(App);
const pinia = createPinia();

app.use(pinia);
app.mount("#app");
```

<!-- s -->

## Создание Store

**Store** — хранилище состояния и логики

<!-- v -->

## Структура проекта со stores

```
src/
├── stores/
│   ├── user.ts        # User store
│   ├── cart.ts        # Cart store
│   └── index.ts       # Экспорт всех stores
├── components/
├── App.vue
└── main.ts
```

<!-- v -->

## Composition API Style (рекомендуется)

**stores/counter.ts:**

```typescript
import { ref, computed } from "vue";
import { defineStore } from "pinia";

export const useCounterStore = defineStore("counter", () => {
  const count = ref(0);
  const doubled = computed(() => count.value * 2);

  function increment() {
    count.value++;
  }

  function decrement() {
    count.value--;
  }

  return { count, doubled, increment, decrement };
});
```

<!-- v -->

## Options API Style

**stores/counter.ts:**

```typescript
import { defineStore } from "pinia";

export const useCounterStore = defineStore("counter", {
  state: () => ({
    count: 0,
  }),

  getters: {
    doubled: (state) => state.count * 2,
  },

  actions: {
    increment() {
      this.count++;
    },
    decrement() {
      this.count--;
    },
  },
});
```

<!-- v -->

## Использование Store в компоненте

```vue
<script setup lang="ts">
import { useCounterStore } from "@/stores/counter";

const counter = useCounterStore();
</script>

<template>
  <div>
    <p>Count: {{ counter.count }}</p>
    <p>Doubled: {{ counter.doubled }}</p>

    <button @click="counter.decrement">-</button>
    <button @click="counter.increment">+</button>
  </div>
</template>
```

<!-- v -->

## Деструктуризация с storeToRefs

**Неправильно — теряется реактивность:**

```typescript
const { count, doubled } = useCounterStore();
```

**Правильно — с storeToRefs:**

```vue
<script setup lang="ts">
import { storeToRefs } from "pinia";
import { useCounterStore } from "@/stores/counter";

const counter = useCounterStore();
const { count, doubled } = storeToRefs(counter);
const { increment, decrement } = counter; // Методы можно без storeToRefs
</script>

<template>
  <p>Count: {{ count }}</p>
  <button @click="increment">+</button>
</template>
```

<!-- s -->

## State, Getters, Actions

**Основные концепции Pinia**

<!-- v -->

## State — хранение данных

**Изменение state:**

```typescript
const counter = useCounterStore();

// 1. Прямое изменение
counter.count++;

// 2. Через $patch (объект)
counter.$patch({ count: counter.count + 1 });

// 3. Через $patch (функция)
counter.$patch((state) => {
  state.count++;
});

// 4. Через action (рекомендуется)
counter.increment();
```

<!-- v -->

## Getters — вычисляемые значения

```typescript
export const useProductStore = defineStore("products", () => {
  const products = ref([
    { id: 1, name: "Laptop", price: 1000, category: "electronics" },
    { id: 2, name: "Phone", price: 500, category: "electronics" },
  ]);

  const totalPrice = computed(() => {
    return products.value.reduce((sum, p) => sum + p.price, 0);
  });

  // Getter с параметром
  const getProductsByCategory = computed(() => {
    return (category: string) => {
      return products.value.filter((p) => p.category === category);
    };
  });

  return { products, totalPrice, getProductsByCategory };
});
```

<!-- v -->

## Actions — методы для изменения state

**Синхронные и асинхронные:**

```typescript
export const useUserStore = defineStore("user", () => {
  const user = ref<User | null>(null);
  const loading = ref(false);

  // Синхронный action
  function logout() {
    user.value = null;
  }

  // Асинхронный action
  async function login(email: string, password: string) {
    loading.value = true;
    try {
      const response = await fetch("/api/login", {
        method: "POST",
        body: JSON.stringify({ email, password }),
      });
      user.value = await response.json();
    } finally {
      loading.value = false;
    }
  }

  return { user, loading, login, logout };
});
```

<!-- s -->

## Взаимодействие между Stores

**Stores могут использовать друг друга**

<!-- v -->

## Доступ к другим Stores

```typescript
import { useUserStore } from "./user";

export const useCartStore = defineStore("cart", () => {
  const items = ref([]);

  // Используем другой store
  const userStore = useUserStore();

  const cartWithDiscount = computed(() => {
    const discount = userStore.isPremium ? 0.1 : 0;
    return items.value.map((item) => ({
      ...item,
      price: item.price * (1 - discount),
    }));
  });

  return { items, cartWithDiscount };
});
```

<!-- v -->

## Actions вызывающие другие Actions

```typescript
import { useCartStore } from "./cart";

export const useOrderStore = defineStore("order", () => {
  async function createOrder() {
    const cartStore = useCartStore();

    const order = {
      items: cartStore.items,
      total: cartStore.total,
    };

    await fetch("/api/orders", {
      method: "POST",
      body: JSON.stringify(order),
    });

    // Очистить корзину после заказа
    cartStore.clearCart();
  }

  return { createOrder };
});
```

<!-- s -->

## Домашнее задание

Полное описание в учебном портале и в ветке урока tack

<!-- s -->

## Q&A

**Вопросы?**

- Когда использовать Pinia, а когда composables?
- Как организовать несколько stores?
- Pinia vs Context API (React)
- Best practices для работы с API
