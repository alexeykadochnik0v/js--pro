---
title: "Урок 10"
description: "Hooks в React"
---

# Hooks в React: углубляемся в детали useState, useEffect, useContext и кастомных хуков

## Вводные

<!-- v -->

## Цели занятия

- Понять мотивацию появления хуков и их преимущества над классами
- Освоить базовые и продвинутые хуки: `useState`, `useEffect`, `useLayoutEffect`, `useContext`, `useRef`
- Научиться работать с `forwardRef` и `useImperativeHandle`
- Разобраться с правилами хуков и типичными ошибками

<!-- v -->

## Краткое содержание

- Почему появились хуки, 2 правила хуков
- Соответствие методов жизненного цикла хукам
- `useState`: базовое состояние, функциональный апдейтер, ленивое начальное значение
- `useEffect`: побочные эффекты, зависимости, очистка (cleanup)
- `useLayoutEffect`: отличия от `useEffect`
- `useContext`: потребление контекста без проп‑дриллинга
- `useRef`: изменяемые ссылки и DOM‑рефы
- `forwardRef` и `useImperativeHandle`

<!-- v -->

## Результат занятия

Коллекция примеров компонентов на хуках (включая эффекты с очисткой, контекст, рефы и императивный API)

<!-- v -->

## Компетенции по занятию

- Владеть React Hooks и архитектурными паттернами (контекст, кастомные хуки)
- Понимать соответствие хуков жизненному циклу
- Уметь проектировать и тестировать компоненты с побочными эффектами

<!-- s -->

## Почему появились Hooks?

- Классы разрастались и смешивали разную логику в одном месте (`componentDidMount` / `componentDidUpdate` / `componentWillUnmount`)
- Не нужны конструкторы и биндинги обработчиков
- Меньше глубина дерева компонентов, проще переиспользование логики
- Чище и понятнее компоненты по сравнению с классами аналогичной сложности
- Хуки открывают новый мощный способ повторного использования кода

<!-- s -->

## Что такое Hook?

Хуки — это функции, с помощью которых можно «подцепиться» к состоянию и жизненному циклу React из функциональных компонентов. Это основной способ написания React‑приложений.

<!-- v -->

### Два правила хуков

1. Вызывать хуки только на верхнем уровне компонента — не в циклах, не в условиях, не во вложенных функциях.
2. Вызывать хуки только из функциональных компонентов React или других хуков (не из классов).

<!-- s -->

## Соответствие жизненного цикла хукам

- `constructor` → инициализируйте состояние через `useState`
- `getDerivedStateFromProps` → запланируйте обновление при рендере
- `shouldComponentUpdate` → `React.memo`
- `render` → тело функционального компонента
- `componentDidMount` / `componentDidUpdate` / `componentWillUnmount` → `useEffect` (комбинации с cleanup)
- `getSnapshotBeforeUpdate`, `componentDidCatch`, `getDerivedStateFromError` → прямых хуков пока нет

<!-- s -->

## useState

`useState` наделяет функциональный компонент внутренним состоянием. Возвращает кортеж: `[value, setValue]`.

```jsx
import { useState } from "react";

export function Counter() {
  const [count, setCount] = useState(0); // начальное значение только при первом рендере

  return (
    <div>
      <p>Count: {count}</p>
      <button onClick={() => setCount(count + 1)}>+1</button>
      <button onClick={() => setCount((prev) => prev + 2)}>
        +2 (functional)
      </button>
    </div>
  );
}
```

<!-- v -->

### Несколько состояний и ленивое начальное значение

```jsx
function heavyInit() {
  console.log("run once");
  return { clicks: 0 };
}

export function MultiState() {
  const [open, setOpen] = useState(false);
  const [data, setData] = useState(() => heavyInit()); // ленивый инит

  return (
    <div>
      <button onClick={() => setOpen((o) => !o)}>
        {open ? "Close" : "Open"}
      </button>
      <button onClick={() => setData((d) => ({ clicks: d.clicks + 1 }))}>
        Click
      </button>
      <div>Clicks: {data.clicks}</div>
    </div>
  );
}
```

<!-- s -->

## useEffect

Хук эффекта позволяет выполнять побочные эффекты: загрузка данных, подписки, изменения DOM, таймеры.

```jsx
import { useEffect, useState } from "react";

export function Ticker() {
  const [tick, setTick] = useState(0);

  useEffect(() => {
    const id = setInterval(() => setTick((t) => t + 1), 1000);
    return () => clearInterval(id); // cleanup при размонтировании/перезапуске
  }, []); // пустой массив — эффект выполнится один раз при монтировании

  return <div>Tick: {tick}</div>;
}
```

<!-- v -->

### Зависимости эффекта (deps)

```jsx
export function TitleWithCount({ count }) {
  useEffect(() => {
    document.title = `Count: ${count}`;
  }, [count]); // меняем title, только когда меняется count

  return null;
}
```

<!-- v -->

### Частая ошибка с замыканиями

```jsx
export function WrongIntervalCounter() {
  const [count, setCount] = useState(0);
  useEffect(() => {
    const id = setInterval(() => setCount(count + 1), 1000); // захвачен старый count!
    return () => clearInterval(id);
  }, []);
  return <div>{count}</div>;
}

export function FixedIntervalCounter() {
  const [count, setCount] = useState(0);
  useEffect(() => {
    const id = setInterval(() => setCount((c) => c + 1), 1000); // функциональный апдейтер
    return () => clearInterval(id);
  }, []);
  return <div>{count}</div>;
}
```

<!-- s -->

## useLayoutEffect

`useLayoutEffect` срабатывает до «отрисовки» браузером. Код и обновления из него блокируют перерисовку. Используйте его только когда нужно измерить DOM/синхронно скорректировать layout; в остальных случаях предпочитайте `useEffect`.

```jsx
import { useLayoutEffect, useRef } from "react";

export function Measure() {
  const ref = useRef(null);
  useLayoutEffect(() => {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    // синхронно вычислили и при необходимости обновили состояние/стили
    console.log(rect.width, rect.height);
  });
  return (
    <div ref={ref} style={{ padding: 8, border: "1px solid #ccc" }}>
      Box
    </div>
  );
}
```

<!-- s -->

## useContext

Контекст позволяет передавать данные через дерево без проп‑дриллинга.

```jsx
import { createContext, useContext, useState } from "react";

const ThemeContext = createContext("light");

export function ThemeProvider({ children }) {
  const [theme, setTheme] = useState("light");
  const toggle = () => setTheme((t) => (t === "light" ? "dark" : "light"));
  return (
    <ThemeContext.Provider value={{ theme, toggle }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function Toolbar() {
  const { theme, toggle } = useContext(ThemeContext);
  return (
    <div>
      <div>Theme: {theme}</div>
      <button onClick={toggle}>Toggle</button>
    </div>
  );
}
```

<!-- s -->

## useRef

`useRef` хранит изменяемое значение между рендерами и/или ссылку на DOM‑узел. Изменение `ref.current` не вызывает ререндер.

```jsx
import { useRef, useEffect } from "react";

export function FocusInput() {
  const inputRef = useRef(null);
  useEffect(() => {
    inputRef.current?.focus();
  }, []);
  return <input ref={inputRef} placeholder="Auto focus" />;
}

export function StopWatch() {
  const start = useRef(null);
  const id = useRef(null);

  const onStart = () => {
    start.current = Date.now();
    id.current = setInterval(() => {
      // просто тикаем — состояние не нужно
    }, 1000);
  };
  const onStop = () => {
    clearInterval(id.current);
    alert(`Elapsed: ${((Date.now() - start.current) / 1000).toFixed(1)}s`);
  };
  return (
    <div>
      <button onClick={onStart}>Start</button>
      <button onClick={onStop}>Stop</button>
    </div>
  );
}
```

<!-- s -->

## forwardRef и useImperativeHandle

`forwardRef` передает реф внутрь дочернего компонента. `useImperativeHandle` позволяет ограничить/переопределить доступный через реф API.

```jsx
import { forwardRef, useImperativeHandle, useRef } from "react";

const FancyInput = forwardRef(function FancyInput(_, ref) {
  const inputRef = useRef(null);
  useImperativeHandle(ref, () => ({
    focus: () => inputRef.current?.focus(),
    clear: () => (inputRef.current.value = ""),
  }));
  return <input ref={inputRef} placeholder="Type here" />;
});

export function Parent() {
  const ref = useRef(null);
  return (
    <div>
      <FancyInput ref={ref} />
      <button onClick={() => ref.current.focus()}>Focus</button>
      <button onClick={() => ref.current.clear()}>Clear</button>
    </div>
  );
}
```

<!-- s -->

## Вопросы?

Ставим «+», если вопросы есть; «–», если вопросов нет

<!-- s -->

## Рефлексия

- Что нового узнали о хуках сегодня?
- Какие места вызывают вопросы (особенно по deps в `useEffect`)?
- Где планируете применить `useRef` / `useImperativeHandle`?
