---
title: "Урок 13"
description: "Состояние приложения в React: React Query + Zustand, Redux Toolkit"
---

# Состояние приложения в React: React Query + Zustand, Redux Toolkit


<!-- s -->

## Цели занятия

Научиться управлять состоянием React-приложений.

<!-- s -->

## Краткое содержание

- React Query
- Zustand
- Redux Toolkit

<!-- s -->

## Результат

Фрагменты приложения, реализующий управление состоянием с использованием React Query + Zustand и Redux Toolkit

<!-- s -->

# TanStack (React) Query
<!-- s -->

## Базовый синтаксис

```tsx
const result = useQuery({ queryKey: ['products'], queryFn: fetchProductList })
```

, где:

- `queryKey` – уникальный ключ, по которому TanStack кэширует значение.  
  Должен быть списком сериализуемых объектов: примитивы (string, number, boolean, null), списки, простые объекты подходят. Функции, например, не подходят.

- `queryFn` – функция, которая возвращает промис. Промис должен либо вернуть данные, либо выбросить ошибку.

<!-- s -->
Пример `queryFn`:

```tsx
const fetchProductList = async () => {
  const response = await fetch("/products")

  if (!response.ok) {
    throw new Error("There was an error!")
  }

  return response.json()
}
```
<!-- s -->

## Пример использования в компоненте

```tsx
function Products() {
  const { status, data, error } = useQuery({
    queryKey: ['products'],
    queryFn: fetchProductList,
  })

  if (status === 'pending') {
    return <span>Loading...</span>
  }

  if (status === 'error') {
    return <span>Error: {error.message}</span>
  }

  return (
    <ul>
      {data.map((product) => (
        <li key={product.id}>{product.title}</li>
      ))}
    </ul>
  )
}
```

<!-- s -->

## Подробнее про ключи в TanStack (React) Query

Порядок ключей в списке важен:

```tsx
// это разные ключи
useQuery({ queryKey: ['products', status, page], ... })
useQuery({ queryKey: ['products', page, status], ... })
```

Если в `queryFn` есть параметр, этот параметр также должен фигурировать в списке ключей:

```tsx
function Product({ productId }) {
  const result = useQuery({
    queryKey: ['product', productId],
    queryFn: () => fetchProductById(productId),
  })
}
```

<!-- s -->

## Что возвращает `useQuery`?

Документация: [TanStack React Query](https://tanstack.com/query/latest/docs/framework/react/reference/useQuery)

### Базовый набор

- `data` – данные или `undefined`, если запрос ещё не выполнен успешно.
- `error` – объект ошибки или `null`.
- `status` – статус запроса:
  - `pending` — запрос ещё не выполнен и нет кэшированных данных.
  - `error` — ошибка при выполнении запроса.
  - `success` — данные успешно получены или установлено `initialData`, если `enabled` = `false`.
- `refetch` – функция для повторного запроса данных

<!-- s -->

### Вспомогательные флаги
- `isPending`
- `isSuccess`
- `isError`

- `isLoading` – `true`, пока выполняется первоначальный запрос

<!-- s -->

### Дополнительные полезные параметры `useQuery`

- `enabled` – позволяет блокировать запрос до наступления определенных условий:

```tsx
const data = useQuery({
  queryKey: ['user', userId],
  queryFn: () => fetchUserById(userId),
  enabled: !!userId,
})
```

- `refetchOnWindowFocus` – автоматически обновляет данные, когда пользователь возвращается на вкладку.
- `retry` – количество попыток при ошибке:
  - `false` — отключено
  - `true` — бесконечные попытки
  - число
  - функция `(failureCount, error) => …` для кастомизации

  <!-- s -->
- `keepPreviousData` – отображает старые данные до завершения нового запроса. В пятой версии используется как значение для `placeholderData` (`placeholderData: keepPreviousData;`, где `keepPreviousData` импортируется из библиотеки).
- `refetchInterval` – автоматическое периодическое обновление данных каждые N миллисекунд.
- `staleTime` – время в миллисекундах, в течение которого данные считаются свежими. После этого могут происходить:
  - refetch при фокусе окна
  - refetch при монтировании
  - refetch при переподключении к сети  
По умолчанию `staleTime` — `0` (данные сразу становятся устаревшими).
<!-- s -->

## Преимущества `useQuery` перед `useEffect`

- Избегает race condition без дополнительного кода.
- Удобное управление состоянием загрузки (`isLoading`).
- Не триггерится дважды в `StrictMode`.
- По умолчанию возвращает `undefined` для данных до первого запроса (empty state).
<!-- s -->

## Как добавить в проект?

1. Установка:

```bash
npm i @tanstack/react-query
npm i -D @tanstack/eslint-plugin-query
```
Вторая команда опциональна.
<!-- s -->

2. Подключение через провайдер:

```tsx
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'

// Синглтон
const queryClient = new QueryClient()

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <SmthVeryImportant />
    </QueryClientProvider>
  )
}
```
<!-- s -->

3. Успех! ✨
<!-- s -->

# Zustand
<!-- s -->

### 1. Установка

```bash
npm install zustand
```

### 2. Создание стора

В Zustand стор — это хук. Создаем через функцию `create()`:

```tsx
const useSomeStore = create<StoreType>(stateCreatorFn)
```

`stateCreatorFn` принимает на вход функцию `set` и возвращает объект с методами для управления состоянием извне.
<!-- s -->

## Пример:

```tsx
import { create } from "zustand"

type BearStore = {
  bears: number
  increasePopulation: () => void
  removeAllBears: () => void
  updateBears: (newBears: number) => void
}

const useBear = create<BearStore>((set) => ({
  bears: 0,
  increasePopulation: () => set((state) => ({ bears: state.bears + 1 })),
  removeAllBears: () => set({ bears: 0 }),
  updateBears: (newBears) => set({ bears: newBears }),
}))
```

В `increasePopulation` показан каноничный пример обновления состояния на базе предыдущего значения (принцип аналогичен обновлению стейта в `useState`).

<!-- s -->

## Использование стора в компонентах

После создания стора через хук, чтобы его использовать, импортируем хук в нужный компонент:

```tsx
function BearCounter() {
  const { bears } = useBear()
  return <h1>{bears} bears around here...</h1>
}

function Controls() {
  const { increasePopulation } = useBear()
  return <button onClick={increasePopulation}>one up</button>
}
```

<!-- s -->

И всё! Больше ничего не нужно. 👍

<!-- s -->


# Redux Toolkit

<!-- s -->

## Архитектура Redux и связь с Flux

В 2012-2013 годах, когда React только появился, Facebook использовал его внутренне. Одной из проблем было управление несколькими независимыми частями UI, которые нуждались в доступе к одним и тем же данным, например "сколько непрочитанных уведомлений". Это было сложно делать в Backbone-подобном коде.

Facebook предложил паттерн "Flux": создавать несколько singleton Store, например, `PostsStore` и `CommentsStore`. Каждый Store регистрировался в `Dispatcher`, и *единственный способ* обновить Store — вызвать `Dispatcher.dispatch({ type: "что-то произошло" })`. Такой объект назывался "action". Идея заключалась в том, чтобы все обновления состояния были централизованы и предсказуемы.

В 2015 году Дэн Абрамов создал Redux, вдохновленный Flux, но упрощенный и удобный для работы с React. Стор в Redux один, но есть слайсы.

Redux Toolkit — это современная реинкарнация Redux, с чуть меньшим количеством boilerplate.

<!-- s -->

## Как прикрутить к проекту?
Пристегнитесь..

<!-- s -->

### 1. Установка

```bash
npm install @reduxjs/toolkit react-redux
```

### 2. Создаем стор (`src/app/store.ts`)

```tsx
import { configureStore } from '@reduxjs/toolkit'

export const store = configureStore({
  reducer: {},
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
```

<!-- s -->

### 3. Добавляем провайдер (`index.tsx`)

```tsx
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { store } from './app/store'
import { Provider } from 'react-redux'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Provider store={store}>
      <App />
    </Provider>
  </StrictMode>,
)
```

<!-- s -->

### 4. Создание слайса

Слайс — это тематический раздел внутри стора. Стор – книга, слайс – подраздел. 
Пример слайса для счетчика:

```tsx
import { createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'

export interface CounterState {
  value: number
}

const initialState: CounterState = {
  value: 0,
}

export const counterSlice = createSlice({
  name: 'counter',
  initialState,
  reducers: {
    increment: (state) => {
      state.value += 1
    },
    decrement: (state) => {
      state.value -= 1
    },
    incrementByAmount: (state, action: PayloadAction<number>) => {
      state.value += action.payload
    },
  },
})

export const { increment, decrement, incrementByAmount } = counterSlice.actions
export default counterSlice.reducer
```

<!-- s -->

### 5. Добавляем слайс в стор

```tsx
import { configureStore } from '@reduxjs/toolkit'
import counterReducer from '../features/counter/counterSlice'

export const store = configureStore({
  reducer: {
    counter: counterReducer,
  },
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
```

<!-- s -->

### 6. Использование значений и редьюсеров в компоненте

```tsx
import type { RootState } from '../../app/store'
import { useSelector, useDispatch } from 'react-redux'
import { decrement, increment } from './counterSlice'

export function Counter() {
  const count = useSelector((state: RootState) => state.counter.value)
  const dispatch = useDispatch()

  return (
    <div>
      <div>
        <button
          aria-label="Increment value"
          onClick={() => dispatch(increment())}
        >
          Increment
        </button>
        <span>{count}</span>
        <button
          aria-label="Decrement value"
          onClick={() => dispatch(decrement())}
        >
          Decrement
        </button>
      </div>
    </div>
  )
}
```

<!-- s -->

### 7. Классический Redux (для сравнения)

Раньше нужно было явно описывать константы, action creators и редьюсер:

```tsx
// type constants
const INCREMENT = "counter/INCREMENT"
const DECREMENT = "counter/DECREMENT"
const INCREMENT_BY_AMOUNT = "counter/INCREMENT_BY_AMOUNT"

// action creators
export const increment = () => ({ type: INCREMENT })
export const decrement = () => ({ type: DECREMENT })
export const incrementByAmount = (amount: number) => ({
  type: INCREMENT_BY_AMOUNT,
  payload: amount,
})

const initialState = { value: 0 }

// редьюсер
export default function counterReducer(state = initialState, action: any) {
  switch (action.type) {
    case INCREMENT:
      return { ...state, value: state.value + 1 }
    case DECREMENT:
      return { ...state, value: state.value - 1 }
    case INCREMENT_BY_AMOUNT:
      return { ...state, value: state.value + action.payload }
    default:
      return state
  }
}
```

С `createSlice` весь этот код генерируется автоматически.

Но писать все равно придется много..

<!-- s -->