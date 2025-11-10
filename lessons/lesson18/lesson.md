---
title: "Урок 18: Composition API во Vue"
description: "Computed, Watch, Lifecycle, Props, Events, Composables"
---

# Composition API во Vue

## Computed, Watch, Lifecycle, Props, Events, Composables

<!-- v -->

## Как меня слышно и видно?

> Напишите в чат

- **+** если все хорошо
- **–** если есть проблемы со звуком или с видео

<!-- v -->

## Цели занятия

- Освоить computed properties для вычисляемых значений
- Научиться отслеживать изменения с watch и watchEffect
- Работать с жизненным циклом компонентов
- Организовывать взаимодействие через props и events
- Создавать переиспользуемую логику с composables

<!-- v -->

## Краткое содержание

- Computed properties (вычисляемые свойства)
- Watch и watchEffect (наблюдатели)
- Lifecycle hooks (жизненный цикл)
- Props и Events (взаимодействие компонентов)
- Template refs (доступ к DOM)
- Composables (переиспользование логики)

<!-- v -->

## Результат занятия

Vue-приложение с компонентами, использующими computed, watch, lifecycle hooks, props/events и composables

<!-- v -->

## Компетенции по занятию

**Владеть продвинутым Composition API**

- Использование computed и watch
- Работа с жизненным циклом
- Взаимодействие компонентов
- Создание composables

<!-- s -->

## Computed Properties

**Вычисляемые свойства** — реактивные значения, зависящие от других данных

<!-- v -->

## Зачем нужны computed?

**Проблема:**

```vue
<template>
  <button :disabled="!form.email || !form.password || loading">Submit</button>
</template>
```

❌ Логика в шаблоне — плохо читается

<!-- v -->

## Решение: computed

```vue
<script setup>
import { ref, computed } from "vue";

const form = ref({ email: "", password: "" });
const loading = ref(false);

const isFormDisabled = computed(() => {
  return !form.value.email || !form.value.password || loading.value;
});
</script>

<template>
  <button :disabled="isFormDisabled">Submit</button>
</template>
```

✅ Логика вынесена, код читаемый

<!-- v -->

## Computed vs Methods

**Computed кэшируются:**

```vue
<script setup>
import { ref, computed } from "vue";

const count = ref(0);

// Вычисляется только при изменении count
const doubled = computed(() => {
  console.log("Computed!");
  return count.value * 2;
});

// Вызывается каждый раз
const doubledMethod = () => {
  console.log("Method!");
  return count.value * 2;
};
</script>

<template>
  <p>{{ doubled }}</p>
  <!-- Выполнится 1 раз -->
  <p>{{ doubled }}</p>
  <!-- Из кеша -->
  <p>{{ doubledMethod() }}</p>
  <!-- Выполнится -->
  <p>{{ doubledMethod() }}</p>
  <!-- Выполнится снова -->
</template>
```

<!-- v -->

## Computed с TypeScript

```typescript
import { ref, computed } from "vue";

const count = ref<number>(0);

// Тип выводится автоматически
const doubled = computed<number>(() => count.value * 2);

// Для сложных типов
interface User {
  firstName: string;
  lastName: string;
}

const user = ref<User>({ firstName: "John", lastName: "Doe" });

const fullName = computed<string>(
  () => `${user.value.firstName} ${user.value.lastName}`
);
```

<!-- v -->

## Writable Computed

**Computed с getter и setter:**

```vue
<script setup>
import { ref, computed } from "vue";

const firstName = ref("John");
const lastName = ref("Doe");

const fullName = computed({
  get() {
    return `${firstName.value} ${lastName.value}`;
  },
  set(newValue) {
    [firstName.value, lastName.value] = newValue.split(" ");
  },
});
</script>

<template>
  <input v-model="fullName" />
  <!-- При вводе "Jane Smith" обновятся firstName и lastName -->
</template>
```

<!-- v -->

## Сравнение с React

**React (useMemo):**

```jsx
const doubled = useMemo(() => count * 2, [count]);
```

**Vue (computed):**

```javascript
const doubled = computed(() => count.value * 2);
```

✅ Vue проще — не нужен массив зависимостей

<!-- s -->

## Watch и WatchEffect

**Наблюдатели** — выполнение побочных эффектов при изменении данных

<!-- v -->

## watch() — отслеживание конкретных значений

```vue
<script setup>
import { ref, watch } from "vue";

const count = ref(0);

watch(count, (newValue, oldValue) => {
  console.log(`Изменилось: ${oldValue} -> ${newValue}`);
});

// Наблюдение за несколькими значениями
const firstName = ref("John");
const lastName = ref("Doe");

watch([firstName, lastName], ([newFirst, newLast], [oldFirst, oldLast]) => {
  console.log(
    `Имя изменилось: ${oldFirst} ${oldLast} -> ${newFirst} ${newLast}`
  );
});
</script>
```

<!-- v -->

## watch с опциями

```vue
<script setup>
import { ref, watch } from "vue";

const user = ref({ name: "John", age: 25 });

// Глубокое наблюдение за объектом
watch(
  user,
  (newUser) => {
    console.log("User изменился:", newUser);
  },
  { deep: true }
);

// Немедленное выполнение
watch(
  count,
  (newCount) => {
    console.log("Count:", newCount);
  },
  { immediate: true } // Выполнится сразу
);
</script>
```

<!-- v -->

## watchEffect() — автоматическое отслеживание

```vue
<script setup>
import { ref, watchEffect } from "vue";

const count = ref(0);
const multiplier = ref(2);

// Автоматически отслеживает все используемые реактивные значения
watchEffect(() => {
  console.log(`Результат: ${count.value * multiplier.value}`);
  // Сработает при изменении count ИЛИ multiplier
});
</script>
```

**Разница:**

- `watch` — явно указываем что отслеживать
- `watchEffect` — автоматически отслеживает все используемые значения

<!-- v -->

## Очистка эффектов (cleanup)

```vue
<script setup>
import { ref, watchEffect } from "vue";

const searchQuery = ref("");

watchEffect((onCleanup) => {
  const controller = new AbortController();

  fetch(`/api/search?q=${searchQuery.value}`, {
    signal: controller.signal,
  }).then((res) => res.json());

  // Очистка при следующем запуске или размонтировании
  onCleanup(() => {
    controller.abort();
  });
});
</script>
```

<!-- v -->

## Сравнение с React

**React (useEffect):**

```jsx
useEffect(() => {
  console.log(count);
}, [count]); // Массив зависимостей
```

**Vue (watch):**

```javascript
watch(count, (newValue) => {
  console.log(newValue);
}); // Без массива зависимостей
```

**Vue (watchEffect):**

```javascript
watchEffect(() => {
  console.log(count.value); // Автоматическое отслеживание
});
```

<!-- s -->

## Lifecycle Hooks

**Хуки жизненного цикла** — функции, вызываемые на разных этапах жизни компонента

<!-- v -->

## Основные хуки

```vue
<script setup>
import { onMounted, onUnmounted, onUpdated } from "vue";

onMounted(() => {
  console.log("Компонент смонтирован");
  // Запросы к API, инициализация
});

onUpdated(() => {
  console.log("Компонент обновлен");
  // После обновления DOM
});

onUnmounted(() => {
  console.log("Компонент размонтирован");
  // Очистка: отписка от событий, таймеры
});
</script>
```

<!-- v -->

## Все хуки жизненного цикла

- `onBeforeMount` — перед монтированием
- `onMounted` — после монтирования (доступен DOM)
- `onBeforeUpdate` — перед обновлением
- `onUpdated` — после обновления DOM
- `onBeforeUnmount` — перед размонтированием
- `onUnmounted` — после размонтирования
- `onErrorCaptured` — при ошибке в дочернем компоненте

<!-- v -->

## Практический пример

```vue
<script setup>
import { ref, onMounted, onUnmounted } from "vue";

const count = ref(0);
let timer: number;

onMounted(() => {
  // Запускаем таймер после монтирования
  timer = setInterval(() => {
    count.value++;
  }, 1000);
});

onUnmounted(() => {
  // Очищаем таймер при размонтировании
  clearInterval(timer);
});
</script>

<template>
  <div>Seconds: {{ count }}</div>
</template>
```

<!-- v -->

## Сравнение с React

**React:**

```jsx
useEffect(() => {
  // onMounted
  return () => {
    // onUnmounted
  };
}, []);
```

**Vue:**

```javascript
onMounted(() => {
  // Монтирование
});

onUnmounted(() => {
  // Размонтирование
});
```

✅ Vue более явный и читаемый

<!-- s -->

## Props и Events

**Взаимодействие между компонентами**

<!-- v -->

## Props — передача данных вниз

**defineProps в TypeScript:**

```vue
<!-- ChildComponent.vue -->
<script setup lang="ts">
interface Props {
  title: string;
  count?: number; // Опциональный
}

const props = defineProps<Props>();

// С значениями по умолчанию
const propsWithDefaults = withDefaults(defineProps<Props>(), {
  count: 0,
});
</script>

<template>
  <div>
    <h2>{{ props.title }}</h2>
    <p>Count: {{ props.count }}</p>
  </div>
</template>
```

<!-- v -->

## Props — валидация (JavaScript)

```vue
<script setup>
const props = defineProps({
  title: {
    type: String,
    required: true,
  },
  count: {
    type: Number,
    default: 0,
    validator: (value) => value >= 0,
  },
  user: {
    type: Object,
    required: false,
  },
});
</script>
```

<!-- v -->

## Events — передача данных вверх

**defineEmits в TypeScript:**

```vue
<!-- ChildComponent.vue -->
<script setup lang="ts">
interface Emits {
  update: [value: number]; // Аргументы события
  delete: [id: string];
  submit: [data: { name: string; email: string }];
}

const emit = defineEmits<Emits>();

const handleClick = () => {
  emit("update", 42);
};
</script>

<template>
  <button @click="handleClick">Click</button>
</template>
```

<!-- v -->

## Использование Props и Events

**ParentComponent.vue:**

```vue
<script setup lang="ts">
import { ref } from "vue";
import ChildComponent from "./ChildComponent.vue";

const count = ref(0);

const handleUpdate = (value: number) => {
  count.value = value;
};
</script>

<template>
  <div>
    <p>Parent count: {{ count }}</p>
    <ChildComponent :count="count" @update="handleUpdate" />
  </div>
</template>
```

<!-- v -->

## v-model на компонентах

**Двустороннее связывание:**

```vue
<!-- CustomInput.vue -->
<script setup lang="ts">
interface Props {
  modelValue: string;
}

const props = defineProps<Props>();
const emit = defineEmits<{
  "update:modelValue": [value: string];
}>();
</script>

<template>
  <input
    :value="modelValue"
    @input="
      emit('update:modelValue', ($event.target as HTMLInputElement).value)
    "
  />
</template>
```

**Использование:**

```vue
<CustomInput v-model="text" />
```

<!-- s -->

## Template Refs

**Доступ к DOM элементам**

<!-- v -->

## ref для DOM

```vue
<script setup lang="ts">
import { ref, onMounted } from "vue";

const inputRef = ref<HTMLInputElement | null>(null);

onMounted(() => {
  // Доступ к DOM после монтирования
  inputRef.value?.focus();
});
</script>

<template>
  <input ref="inputRef" type="text" />
</template>
```

<!-- v -->

## ref для компонентов

```vue
<!-- ChildComponent.vue -->
<script setup lang="ts">
import { ref } from "vue";

const count = ref(0);

const increment = () => {
  count.value++;
};

// Экспортируем методы для родителя
defineExpose({
  increment,
  count,
});
</script>
```

**ParentComponent.vue:**

```vue
<script setup lang="ts">
import { ref } from "vue";
import ChildComponent from "./ChildComponent.vue";

const childRef = ref<InstanceType<typeof ChildComponent> | null>(null);

const callChildMethod = () => {
  childRef.value?.increment();
};
</script>

<template>
  <ChildComponent ref="childRef" />
  <button @click="callChildMethod">Increment Child</button>
</template>
```

<!-- s -->

## Composables

**Переиспользуемая логика** — аналог custom hooks в React

<!-- v -->

## Что такое Composable?

**Функция, использующая Composition API:**

```typescript
// useCounter.ts
import { ref } from "vue";

export function useCounter(initialValue = 0) {
  const count = ref(initialValue);

  const increment = () => {
    count.value++;
  };

  const decrement = () => {
    count.value--;
  };

  const reset = () => {
    count.value = initialValue;
  };

  return {
    count,
    increment,
    decrement,
    reset,
  };
}
```

<!-- v -->

## Использование Composable

```vue
<script setup>
import { useCounter } from "./useCounter";

const { count, increment, decrement, reset } = useCounter(10);
</script>

<template>
  <div>
    <p>Count: {{ count }}</p>
    <button @click="decrement">-</button>
    <button @click="reset">Reset</button>
    <button @click="increment">+</button>
  </div>
</template>
```

<!-- v -->

## Пример: useFetch

```typescript
// useFetch.ts
import { ref } from "vue";

export function useFetch<T>(url: string) {
  const data = ref<T | null>(null);
  const error = ref<Error | null>(null);
  const loading = ref(false);

  const fetchData = async () => {
    loading.value = true;
    error.value = null;

    try {
      const response = await fetch(url);
      data.value = await response.json();
    } catch (e) {
      error.value = e as Error;
    } finally {
      loading.value = false;
    }
  };

  return {
    data,
    error,
    loading,
    fetchData,
  };
}
```

<!-- v -->

## Пример: useLocalStorage

```typescript
// useLocalStorage.ts
import { ref, watch } from "vue";

export function useLocalStorage<T>(key: string, defaultValue: T) {
  const stored = localStorage.getItem(key);
  const value = ref<T>(stored ? JSON.parse(stored) : defaultValue);

  watch(
    value,
    (newValue) => {
      localStorage.setItem(key, JSON.stringify(newValue));
    },
    { deep: true }
  );

  return value;
}
```

**Использование:**

```vue
<script setup>
import { useLocalStorage } from "./useLocalStorage";

const theme = useLocalStorage("theme", "light");
</script>
```

<!-- v -->

## Best Practices для Composables

✅ **Именование:** `use` + название (useCounter, useFetch)
✅ **Возврат:** объект с реактивными значениями и методами
✅ **Инкапсуляция:** вся логика внутри composable
✅ **Переиспользование:** один composable = одна ответственность

❌ **Не делайте:** побочные эффекты при импорте
❌ **Не делайте:** зависимость от глобального состояния

<!-- s -->

## Практический пример

**Компонент с использованием всех возможностей**

<!-- v -->

## Полный пример компонента

```vue
<script setup lang="ts">
import { ref, computed, watch, onMounted } from "vue";
import { useLocalStorage } from "./composables/useLocalStorage";

interface Props {
  initialCount?: number;
}

const props = withDefaults(defineProps<Props>(), {
  initialCount: 0,
});

const emit = defineEmits<{
  countChange: [value: number];
}>();

// Composable
const theme = useLocalStorage("theme", "light");

// Реактивное состояние
const count = ref(props.initialCount);

// Computed
const doubled = computed(() => count.value * 2);
const isEven = computed(() => count.value % 2 === 0);

// Watch
watch(count, (newValue) => {
  emit("countChange", newValue);
});

// Methods
const increment = () => {
  count.value++;
};

// Lifecycle
onMounted(() => {
  console.log("Component mounted");
});
</script>

<template>
  <div :class="theme">
    <h2>Count: {{ count }}</h2>
    <p>Doubled: {{ doubled }}</p>
    <p>{{ isEven ? "Even" : "Odd" }}</p>
    <button @click="increment">+1</button>
  </div>
</template>
```

<!-- s -->

## Домашнее задание

Полное описание в учебном портале и в ветке урока tack

<!-- s -->

## Q&A

**Вопросы?**

- Computed vs Watch — когда что использовать?
- Как организовать composables в проекте?
- Props vs Events — лучшие практики
- Жизненный цикл и побочные эффекты
