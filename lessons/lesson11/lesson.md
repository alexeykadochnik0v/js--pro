---
title: "Урок 11: Современные паттерны в React"
description: "HOC, Render Props (исторический контекст) и кастомные хуки"
---

# Современные паттерны в React

## HOC, Render Props и кастомные хуки

<!-- v -->

## Цели занятия

- Понять эволюцию паттернов в React (HOC, Render Props → Hooks)
- Освоить создание кастомных хуков
- Научиться выносить повторяющуюся логику в хуки
- Понять базовую работу с Context API
- Применять хуки в нескольких компонентах

<!-- v -->

## Краткое содержание

- Исторический контекст: HOC и Render Props (почему ушли)
- Кастомные хуки — основной паттерн переиспользования логики
- Примеры хуков: useToggle, useFetch, useLocalStorage, useForm
- Базовая работа с Context API
- Композиция хуков

<!-- v -->

## Результат занятия

React-приложение с кастомными хуками для повторяющейся логики (работа с API, формами, подписками)

<!-- v -->

## Компетенции по занятию

- **Паттерны проектирования React**
- **Владеть React Hooks и архитектурными паттернами (контекст, кастомные хуки)**
- Создавать переиспользуемые кастомные хуки
- Работать с Context API

<!-- s -->

## Зачем нужны паттерны?

**Проблема:** Повторяющаяся логика в компонентах

```jsx
// Логика дублируется в каждом компоненте
function UserProfile() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/user")
      .then(setUser)
      .finally(() => setLoading(false));
  }, []);
}

function UserSettings() {
  const [user, setUser] = useState(null); // Дублирование!
  const [loading, setLoading] = useState(true);
  // ...та же логика
}
```

**Решение:** Паттерны для переиспользования логики

<!-- s -->

# Исторический контекст

## Эволюция паттернов в React

<!-- v -->

## До хуков (2015-2019)

**Как переиспользовали логику:**

1. **HOC** (Higher-Order Components) — функция, возвращающая компонент
2. **Render Props** — функция как children
3. **Mixins** (class components) — устарели раньше всех

**Проблема:** Сложность, wrapper hell, плохая читаемость

**Решение:** React Hooks (2019) заменили всё

<!-- s -->

## HOC — исторический паттерн

**Higher-Order Component** = функция, которая принимает компонент и возвращает новый компонент

```jsx
// HOC для логирования
function withLogger(Component) {
  return function LoggedComponent(props) {
    useEffect(() => {
      console.log("Component mounted:", Component.name);
    }, []);

    return <Component {...props} />;
  };
}

// Использование
const EnhancedButton = withLogger(Button);
```

<!-- v -->

## Проблемы HOC

**Почему больше не используем:**

- Wrapper Hell — глубокая вложенность компонентов
- Конфликты имен props
- Сложный дебаг в DevTools
- Не работает с хуками нормально
- Проблемы с TypeScript типизацией

```jsx
// Wrapper Hell
export default withRouter(withAuth(withTheme(withLogger(MyComponent))));
```

**Современная замена:** Кастомные хуки

<!-- s -->

## Render Props — исторический паттерн

**Render Props** = передача функции как children для управления рендером

```jsx
// Компонент с render prop
function MouseTracker({ render }) {
  const [position, setPosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleMove = (e) => setPosition({ x: e.clientX, y: e.clientY });
    window.addEventListener("mousemove", handleMove);
    return () => window.removeEventListener("mousemove", handleMove);
  }, []);

  return render(position);
}

// Использование
<MouseTracker
  render={(pos) => (
    <div>
      x: {pos.x}, y: {pos.y}
    </div>
  )}
/>;
```

<!-- v -->

## Проблемы Render Props

**Почему больше не используем:**

- Глубокая вложенность JSX
- Сложная композиция
- Проблемы с производительностью (пересоздание функций)
- Неудобная работа с TypeScript

```jsx
// Вложенность становится ужасной
<DataProvider>
  {(data) => (
    <ThemeProvider>
      {(theme) => (
        <AuthProvider>
          {(user) => <App data={data} theme={theme} user={user} />}
        </AuthProvider>
      )}
    </ThemeProvider>
  )}
</DataProvider>
```

**Современная замена:** Кастомные хуки

<!-- s -->

# Современные паттерны (2025)

## Кастомные хуки — основа всего

<!-- v -->

## Что такое кастомный хук?

**Кастомный хук** = функция, начинающаяся с `use`, которая использует другие хуки

**Зачем:**

- Переиспользование логики между компонентами
- Изоляция побочных эффектов
- Инкапсуляция бизнес-логики
- Упрощение компонентов

```jsx
// Простой кастомный хук
function useToggle(initialValue = false) {
  const [value, setValue] = useState(initialValue);

  const toggle = () => setValue((v) => !v);
  const setTrue = () => setValue(true);
  const setFalse = () => setValue(false);

  return [value, { toggle, setTrue, setFalse }];
}
```

<!-- v -->

## Правила кастомных хуков

✅ **Обязательно:**

1. Имя начинается с `use`
2. Вызываются только внутри компонентов или других хуков
3. Вызываются на верхнем уровне (не в циклах/условиях)

```jsx
// Правильно
function useUser(id) {
  const [user, setUser] = useState(null);
  // ...
  return user;
}

// Неправильно
function fetchUser(id) {
  // Не начинается с use
  const [user, setUser] = useState(null); // useState вне хука!
}
```

<!-- v -->

## Паттерн: Data Fetching

```jsx
function useFetch(url) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch(url)
      .then((res) => res.json())
      .then(setData)
      .catch(setError)
      .finally(() => setLoading(false));
  }, [url]);

  return { data, loading, error };
}

// Использование
function UserProfile({ userId }) {
  const { data: user, loading } = useFetch(`/api/users/${userId}`);

  if (loading) return <Spinner />;
  return <div>{user.name}</div>;
}
```

<!-- v -->

## Паттерн: Local Storage

```jsx
function useLocalStorage(key, initialValue) {
  const [value, setValue] = useState(() => {
    const saved = localStorage.getItem(key);
    return saved ? JSON.parse(saved) : initialValue;
  });

  useEffect(() => {
    localStorage.setItem(key, JSON.stringify(value));
  }, [key, value]);

  return [value, setValue];
}

// Использование
function Settings() {
  const [theme, setTheme] = useLocalStorage("theme", "light");
  return <button onClick={() => setTheme("dark")}>Toggle</button>;
}
```

<!-- v -->

## Паттерн: Form Handling

```jsx
function useForm(initialValues) {
  const [values, setValues] = useState(initialValues);
  const [errors, setErrors] = useState({});

  const handleChange = (name, value) => {
    setValues((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (onSubmit) => (e) => {
    e.preventDefault();
    if (validate(values)) {
      onSubmit(values);
    }
  };

  return { values, errors, handleChange, handleSubmit };
}
```

<!-- v -->

## Паттерн: useTimeout и useInterval

```jsx
function useTimeout(callback, delay) {
  useEffect(() => {
    if (delay === null) return;

    const timeoutId = setTimeout(callback, delay);
    return () => clearTimeout(timeoutId);
  }, [callback, delay]);
}

function useInterval(callback, delay) {
  useEffect(() => {
    if (delay === null) return;

    const intervalId = setInterval(callback, delay);
    return () => clearInterval(intervalId);
  }, [callback, delay]);
}
```

<!-- s -->

## Базовая работа с Context API

**Context** = способ передать данные через дерево компонентов без props drilling

<!-- v -->

## Проблема: Props Drilling

```jsx
// Передаём theme через все компоненты
function App() {
  const [theme, setTheme] = useState("light");
  return <Layout theme={theme} setTheme={setTheme} />;
}

function Layout({ theme, setTheme }) {
  return <Sidebar theme={theme} setTheme={setTheme} />;
}

function Sidebar({ theme, setTheme }) {
  return <Button theme={theme} setTheme={setTheme} />;
}

function Button({ theme, setTheme }) {
  return <button onClick={() => setTheme("dark")}>{theme}</button>;
}
```

<!-- v -->

## Решение: Context API

```jsx
// Context решает проблему
const ThemeContext = createContext();

function App() {
  const [theme, setTheme] = useState("light");

  return (
    <ThemeContext.Provider value={{ theme, setTheme }}>
      <Layout />
    </ThemeContext.Provider>
  );
}

function Button() {
  const { theme, setTheme } = useContext(ThemeContext);
  return <button onClick={() => setTheme("dark")}>{theme}</button>;
}
```

<!-- v -->

## Context + кастомный хук

```jsx
// Создаём хук для удобства
const ThemeContext = createContext();

function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("useTheme must be inside ThemeProvider");
  }
  return context;
}

// Использование
function Button() {
  const { theme, setTheme } = useTheme();
  return <button>{theme}</button>;
}
```

<!-- s -->

## Best Practices

<!-- v -->

## Правила хороших хуков

**Делать:**

- Начинать имя с `use`
- Возвращать массив `[value, actions]` или объект `{ value, ...actions }`
- Использовать useMemo/useCallback для оптимизации
- Документировать параметры и возвращаемое значение

**Избегать:**

- Побочных эффектов в render-фазе
- Условных вызовов хуков
- Слишком больших хуков (разбивайте)

<!-- v -->

## Композиция хуков

```jsx
// Маленькие хуки
function useToggle(initial) {
  const [value, setValue] = useState(initial);
  const toggle = () => setValue((v) => !v);
  return [value, toggle];
}

function useKeyPress(targetKey) {
  const [keyPressed, setKeyPressed] = useState(false);
  // ... логика
  return keyPressed;
}

// Композиция
function useModal() {
  const [isOpen, toggle] = useToggle(false);
  const escPressed = useKeyPress("Escape");

  useEffect(() => {
    if (escPressed) toggle();
  }, [escPressed]);

  return { isOpen, open: () => toggle(), close: () => toggle() };
}
```

<!-- v -->

## Оптимизация производительности

```jsx
function useExpensiveValue(dependencies) {
  // Мемоизация вычислений
  const value = useMemo(() => {
    return expensiveCalculation(dependencies);
  }, [dependencies]);

  // Мемоизация callback
  const handler = useCallback(
    (arg) => {
      doSomething(arg, value);
    },
    [value]
  );

  return { value, handler };
}
```

<!-- s -->

## Сравнение паттернов

| Паттерн        | Актуальность | Когда использовать                  |
| -------------- | ------------ | ----------------------------------- |
| HOC            | ❌ Устарел   | Только в легаси коде                |
| Render Props   | ❌ Устарел   | Только в легаси коде                |
| Кастомные хуки | ✅ Основа    | Всегда для переиспользования логики |
| Context API    | ✅ Актуально | Глобальные данные (тема, auth)      |

<!-- s -->

## Домашнее задание

Полное описание в учебном портале и в ветке урока tack

<!-- s -->

## Q&A

**Вопросы?**

- Почему HOC и Render Props больше не используются?
- Как правильно создавать кастомные хуки?
- Когда использовать Context API?
- Как композировать хуки?
