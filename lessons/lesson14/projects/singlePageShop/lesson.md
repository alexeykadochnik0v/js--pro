---
title: "Урок 14"
description: "React Router, ленивая загрузка компонентов, Suspense, оптимизация React-приложения"
---

<div style="text-align: center;">

## **OTUS**

### JS Professional

# React Router

## ленивая загрузка компонентов

## Suspense, оптимизация

### React-приложения

#### **Урок 14**

</div>

<!-- v -->

## Правила на занятии

- 🙋‍♀️ **Активно участвуем**

- 💬 **Задаем вопрос в чат или голосом**

- 👀 **Вопросы вижу в чате, могу ответить не сразу**

<!-- v -->

## Цели занятия

- 🎯 Освоить роутинг в React приложениях
- ⚡ Изучить техники оптимизации производительности
- 🔄 Научиться работать с ленивой загрузкой компонентов
- 📦 Понять принципы работы Suspense

<!-- v -->

## Краткое содержание

- **React Router** - маршрутизация в SPA
- **Suspense** - управление асинхронной загрузкой
- **Lazy loading** - ленивая загрузка компонентов
- **Оптимизация** - Code Splitting и производительность

<!-- v -->

## Результат

**Приложение с полноценной маршрутизацией:**

- Многостраничная навигация
- Ленивая загрузка компонентов
- Динамические маршруты
- Оптимизированная производительность

<!-- s -->

# Теоретическая часть

## Что такое маршрутизация?

<!-- v -->

## Маршрутизация в веб-приложениях

**Маршрутизация (Routing)** - это механизм определения того, какой контент показать пользователю на основе URL в браузере.

### Типы приложений:

- **MPA (Multi-Page Application)** - традиционные многостраничные приложения
- **SPA (Single-Page Application)** - одностраничные приложения

<!-- v -->

## Проблемы SPA без роутинга

```javascript
// Без роутинга - один большой компонент
function App() {
  const [currentPage, setCurrentPage] = useState("home");

  return (
    <div>
      {currentPage === "home" && <HomePage />}
      {currentPage === "about" && <AboutPage />}
      {currentPage === "contact" && <ContactPage />}
    </div>
  );
}
```

❌ **Проблемы:**

- URL не меняется
- Нет истории браузера
- Невозможно поделиться ссылкой
- Сложно масштабировать

<!-- v -->

## React Router - решение проблем

**React Router** - библиотека для декларативной маршрутизации в React приложениях.

### Основные возможности:

- 🔗 Синхронизация UI с URL
- 📖 История браузера (назад/вперед)
- 🔄 Динамические маршруты
- 🛡️ Защищенные маршруты
- ⚡ Code splitting

<!-- v -->

## Установка React Router

```bash
# npm - для v7
npm install react-router

# или для совместимости с v6
npm install react-router-dom@6
```

**Версии:**

- `react-router@7` - **текущая стабильная версия** (ноябрь 2024)
- В v7 пакет называется просто `react-router` (не `react-router-dom`)
- Новые Data APIs, улучшенная производительность
- Обратная совместимость с v6
- Интеграция с Vite по умолчанию

<!-- s -->

# Основные концепции React Router

<!-- v -->

## 1. createBrowserRouter - новый способ (v7)

```jsx
import { createBrowserRouter, RouterProvider } from "react-router";
import { RouterProvider } from "react-router";
import { createRoot } from "react-dom/client";
import HomePage from "./pages/HomePage";
import AboutPage from "./pages/AboutPage";

const router = createBrowserRouter([
  {
    path: "/",
    element: <HomePage />,
  },
  {
    path: "/about",
    element: <AboutPage />,
  },
]);

const root = createRoot(document.getElementById("root"));
root.render(<RouterProvider router={router} />);
```

**createBrowserRouter** - новый рекомендуемый способ создания роутера в v7.

<!-- v -->

## 2. Два подхода к определению маршрутов

### Новый подход (v7) - createBrowserRouter:

```jsx
import { createBrowserRouter } from "react-router";

const router = createBrowserRouter([
  {
    path: "/",
    element: <HomePage />,
    loader: homeLoader, // 🔄 Загрузка данных перед показом страницы
  },
  {
    path: "/about",
    element: <AboutPage />,
  },
  {
    path: "/contact",
    element: <ContactPage />,
    action: contactAction, // 📤 Обработка отправки формы
  },
]);

// 📊 Loader - функция для загрузки данных ДО рендера компонента
async function homeLoader() {
  const products = await fetch("/api/products").then((res) => res.json());
  const categories = await fetch("/api/categories").then((res) => res.json());
  return { products, categories }; // Данные будут доступны в компоненте
}

// 📝 Action - функция для обработки отправки форм
async function contactAction({ request }) {
  const formData = await request.formData();
  const message = {
    name: formData.get("name"),
    email: formData.get("email"),
    text: formData.get("message"),
  };

  await fetch("/api/contact", {
    method: "POST",
    body: JSON.stringify(message),
  });

  return { success: true, message: "Сообщение отправлено!" };
}
```

**Пояснения:**

- 📊 **homeLoader** - загружает данные (товары, категории) перед отображением HomePage
- 📝 **contactAction** - обрабатывает отправку контактной формы на странице /contact
- 🎯 Данные загружаются **параллельно** с компонентом, не внутри него

### Классический подход (v6 совместимость):

```jsx
function App() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/about" element={<AboutPage />} />
    </Routes>
  );
}
```

<!-- v -->

## 3. Link - навигация между страницами

```jsx
import { Link } from "react-router";

function Navigation() {
  return (
    <nav>
      <Link to="/">Главная</Link>
      <Link to="/about">О нас</Link>
      <Link to="/contact">Контакты</Link>
    </nav>
  );
}
```

**Link** - заменяет `<a>` теги для внутренней навигации без перезагрузки страницы.

<!-- v -->

## 4. NavLink - активная навигация

```jsx
import { NavLink } from "react-router";

function Navigation() {
  return (
    <nav>
      <NavLink to="/" className={({ isActive }) => (isActive ? "active" : "")}>
        Главная
      </NavLink>
      <NavLink to="/about">О нас</NavLink>
    </nav>
  );
}
```

**NavLink** - расширенная версия Link с возможностью стилизации активного элемента.

<!-- v -->

## 5. Data APIs - новые возможности v7

### Loaders - загрузка данных

```jsx
import { createBrowserRouter, useLoaderData } from "react-router";

// Функция загрузки данных
async function productsLoader() {
  const response = await fetch("/api/products");
  return response.json();
}

// Компонент использует загруженные данные
function ProductsPage() {
  const products = useLoaderData(); // Данные уже загружены

  return (
    <div>
      {products.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
}

// Роутер с loader'ом
const router = createBrowserRouter([
  {
    path: "/products",
    element: <ProductsPage />,
    loader: productsLoader, // Данные загружаются до рендера
  },
]);
```

### Actions - обработка форм

```jsx
import { Form, redirect } from "react-router";

// Обработчик отправки формы
async function createProduct({ request }) {
  const formData = await request.formData();
  const product = Object.fromEntries(formData);

  await fetch("/api/products", {
    method: "POST",
    body: JSON.stringify(product),
  });

  return redirect("/products");
}

// Компонент с формой
function CreateProductPage() {
  return (
    <Form method="post">
      {" "}
      {/* Автоматически вызывает action */}
      <input name="title" placeholder="Название товара" />
      <input name="price" type="number" placeholder="Цена" />
      <button type="submit">Создать товар</button>
    </Form>
  );
}

// Роутер с action
const router = createBrowserRouter([
  {
    path: "/products/create",
    element: <CreateProductPage />,
    action: createProduct,
  },
]);
```

<!-- s -->

# Типы маршрутизации

<!-- v -->

## Статическая маршрутизация

**Определение:** Маршруты определяются заранее и не изменяются во время выполнения.

```jsx
function App() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/about" element={<AboutPage />} />
      <Route path="/products" element={<ProductsPage />} />
      <Route path="/contact" element={<ContactPage />} />
    </Routes>
  );
}
```

✅ **Преимущества:** Простота, предсказуемость  
❌ **Недостатки:** Ограниченная гибкость

<!-- v -->

## Динамическая маршрутизация

**Определение:** Маршруты создаются и изменяются динамически на основе данных или условий.

```jsx
function App() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/product/:id" element={<ProductDetail />} />
      <Route path="/user/:userId/orders" element={<UserOrders />} />
      <Route path="/category/:categoryName" element={<CategoryPage />} />
    </Routes>
  );
}
```

<!-- v -->

## Использование параметров маршрута

```jsx
import { useParams } from "react-router";

function ProductDetail() {
  const { id } = useParams();

  return (
    <div>
      <h1>Товар #{id}</h1>
      {/* Загрузка данных по ID */}
    </div>
  );
}

function UserOrders() {
  const { userId } = useParams();

  return (
    <div>
      <h1>Заказы пользователя {userId}</h1>
    </div>
  );
}
```

<!-- s -->

# Подходы к организации маршрутов

<!-- v -->

## 1. Конфигурационный подход (обновлен в v7)

**Определение:** Маршруты определяются в конфигурации с Data APIs.

```javascript
// router.js
import { createBrowserRouter } from "react-router";
import HomePage, { loader as homeLoader } from "./pages/HomePage";
import AboutPage from "./pages/AboutPage";
import ProductsPage, { loader as productsLoader } from "./pages/ProductsPage";
import ProductDetail, { loader as productLoader } from "./pages/ProductDetail";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <HomePage />,
    loader: homeLoader, // Загрузка данных
  },
  {
    path: "/about",
    element: <AboutPage />,
  },
  {
    path: "/products",
    element: <ProductsPage />,
    loader: productsLoader,
    children: [
      {
        path: ":id",
        element: <ProductDetail />,
        loader: productLoader,
      },
    ],
  },
]);
```

**Преимущества v7 подхода:**

- 🚀 **Предзагрузка данных** - данные загружаются параллельно с компонентом
- 📊 **Лучший UX** - нет состояний loading в компонентах
- 🎯 **TypeScript поддержка** - типизированные loaders и params

<!-- v -->

## Использование конфигурации в v7

```jsx
// main.jsx
import { createRoot } from "react-dom/client";
import { RouterProvider } from "react-router/dom"; // DOM-специфичный импорт в v7
import { router } from "./router";

const root = createRoot(document.getElementById("root"));
root.render(<RouterProvider router={router} />);
```

**Упрощение в v7:**

- ❌ Нет необходимости в `renderRoutes` функциях
- ✅ Роутер создается декларативно
- ✅ Встроенная поддержка TypeScript
- ✅ Автоматическая оптимизация

<!-- v -->

## 2. File System Routing Convention

**Определение:** Маршруты автоматически генерируются на основе структуры файлов.

```
src/
  pages/
    index.jsx          → /
    about.jsx          → /about
    products/
      index.jsx        → /products
      [id].jsx         → /products/:id
    users/
      [userId]/
        orders.jsx     → /users/:userId/orders
```

**Примеры фреймворков:** Next.js, Remix, SvelteKit

<!-- v -->

## Сравнение подходов в v7

| Характеристика         | Config (v7)       | File System       | Classic Routes |
| ---------------------- | ----------------- | ----------------- | -------------- |
| **Простота**           | Высокая           | Высокая           | Средняя        |
| **Гибкость**           | Высокая           | Средняя           | Высокая        |
| **Производительность** | ⚡ Высокая        | ⚡ Высокая        | Средняя        |
| **Data Loading**       | ✅ Встроено       | ✅ Встроено       | ❌ Ручное      |
| **TypeScript**         | ✅ Отличная       | ✅ Хорошая        | ⚠️ Базовая     |
| **Code Splitting**     | ✅ Автоматическое | ✅ Автоматическое | ⚠️ Ручное      |
| **DevX**               | ✅ Отличный       | ✅ Отличный       | ⚠️ Средний     |

**React Router v7** рекомендует конфигурационный подход с Data APIs для максимальной производительности.

<!-- s -->

# Ленивая загрузка и Code Splitting

<!-- v -->

## Проблема больших бандлов

```javascript
// Обычная загрузка - все сразу
import HomePage from "./HomePage";
import AboutPage from "./AboutPage";
import ProductsPage from "./ProductsPage";
import ContactPage from "./ContactPage";

// Результат: один большой bundle.js (2MB+)
```

❌ **Проблемы:**

- Медленная первоначальная загрузка
- Загрузка неиспользуемого кода
- Плохой UX на медленных соединениях

<!-- v -->

## Ленивая загрузка в v7 - два подхода

### 1. Классический React.lazy() (v6 совместимость)

```javascript
import React, { lazy } from "react";

const HomePage = lazy(() => import("./pages/HomePage"));
const AboutPage = lazy(() => import("./pages/AboutPage"));
```

### 2. Новый route-level lazy (рекомендуется в v7)

```javascript
import { createBrowserRouter } from "react-router";

const router = createBrowserRouter([
  {
    path: "/",
    lazy: () => import("./pages/HomePage"),
  },
  {
    path: "/about",
    lazy: () => import("./pages/AboutPage"),
  },
  {
    path: "/products/:id",
    lazy: () => import("./pages/ProductDetail"),
  },
]);
```

✅ **Преимущества v7 подхода:**

- 🚀 **Автоматическая предзагрузка** при наведении на ссылки
- ⚡ **Параллельная загрузка** данных и компонентов
- 📦 **Оптимальное разделение** без дополнительного кода
- 🎯 **Лучший Developer Experience**

<!-- v -->

## Suspense в v7 - автоматическое управление

### Классический подход (v6 совместимость):

```jsx
import React, { Suspense, lazy } from "react";

function App() {
  return (
    <Suspense fallback={<div>Загрузка...</div>}>
      <Routes>
        <Route path="/" element={<HomePage />} />
      </Routes>
    </Suspense>
  );
}
```

### Новый подход v7 - встроенные Loading UI:

```jsx
import { createBrowserRouter } from "react-router";
import { RouterProvider } from "react-router/dom";
import LoadingSpinner from "./components/LoadingSpinner";

const router = createBrowserRouter([
  {
    path: "/",
    lazy: () => import("./pages/HomePage"),
    // Автоматический Suspense для lazy routes
  },
  {
    path: "/products/:id",
    lazy: () => import("./pages/ProductDetail"),
    loader: ({ params }) => fetch(`/api/products/${params.id}`),
    // Параллельная загрузка компонента И данных
  },
]);

// Global loading UI (опционально)
function App() {
  return (
    <RouterProvider
      router={router}
      fallbackElement={<LoadingSpinner />} // Общий fallback
    />
  );
}
```

**Автоматические возможности v7:**

- 🔄 **Встроенный Suspense** для lazy routes
- ⏳ **Loading states** для данных и компонентов
- 🎯 **Предзагрузка** при наведении на ссылки

<!-- s -->

## Хуки React Router (обновлены в v7)

<!-- v -->

### useNavigate - программная навигация

```jsx
import { useNavigate } from "react-router";

function LoginForm() {
  const navigate = useNavigate();

  const handleSubmit = async (formData) => {
    try {
      await login(formData);
      navigate("/dashboard"); // Переход после успешного входа
    } catch (error) {
      console.error("Ошибка входа:", error);
    }
  };

  return <form onSubmit={handleSubmit}>{/* форма входа */}</form>;
}
```

<!-- v -->

### useLoaderData - данные из loader'а (новое в v7)

```jsx
import { useLoaderData } from "react-router";

// Loader функция
export async function loader({ params }) {
  const product = await fetch(`/api/products/${params.id}`);
  return product.json();
}

// Компонент использует данные
function ProductDetail() {
  const product = useLoaderData(); // Типизированные данные

  return (
    <div>
      <h1>{product.title}</h1>
      <p>{product.description}</p>
      <span>{product.price} ₽</span>
    </div>
  );
}
```

<!-- v -->

### useActionData - результат action'а (новое в v7)

```jsx
import { useActionData, Form } from "react-router";

export async function action({ request }) {
  const formData = await request.formData();
  const result = await createProduct(formData);
  return { success: true, productId: result.id };
}

function CreateProduct() {
  const actionData = useActionData(); // Результат отправки формы

  return (
    <div>
      {actionData?.success && <p>Товар создан! ID: {actionData.productId}</p>}
      <Form method="post">
        <input name="title" required />
        <button type="submit">Создать</button>
      </Form>
    </div>
  );
}
```

<!-- v -->

### useLocation - информация о текущем маршруте

```jsx
import { useLocation } from "react-router";

function Analytics() {
  const location = useLocation();

  useEffect(() => {
    // Отправка аналитики при смене страницы
    trackPageView(location.pathname);
  }, [location.pathname]);

  return null;
}
```

**location объект содержит:**

- `pathname` - путь
- `search` - query параметры
- `hash` - якорь
- `state` - состояние навигации

<!-- v -->

### useSearchParams - работа с query параметрами

```jsx
import { useSearchParams } from "react-router";

function ProductList() {
  const [searchParams, setSearchParams] = useSearchParams();

  const category = searchParams.get("category");
  const sort = searchParams.get("sort");

  const handleFilterChange = (newCategory) => {
    setSearchParams({
      category: newCategory,
      sort: sort || "name",
    });
  };

  return (
    <div>
      <h1>Товары в категории: {category}</h1>
      {/* Список товаров */}
    </div>
  );
}
```

<!-- s -->

## Новые возможности React Router v7

<!-- v -->

### Automatic Code Splitting

```jsx
import { createBrowserRouter } from "react-router";

const router = createBrowserRouter([
  {
    path: "/",
    lazy: () => import("./pages/HomePage"), // Автоматический lazy import
  },
  {
    path: "/products/:id",
    lazy: () => import("./pages/ProductDetail"),
  },
]);
```

**Преимущества:**

- 🚀 **Автоматическое разделение кода** без React.lazy()
- ⚡ **Предзагрузка** при наведении на ссылки
- 📦 **Оптимальные chunk'и** из коробки

<!-- v -->

### Enhanced TypeScript Support

```typescript
import { LoaderFunctionArgs, ActionFunctionArgs } from "react-router";

interface Product {
  id: string;
  title: string;
  price: number;
}

// Типизированный loader
export async function loader({ params }: LoaderFunctionArgs): Promise<Product> {
  const response = await fetch(`/api/products/${params.id}`);
  return response.json();
}

// Типизированный action
export async function action({ request }: ActionFunctionArgs) {
  const formData = await request.formData();
  // TypeScript знает типы formData
  return { success: true };
}

// Компонент с типизированными данными
function ProductDetail() {
  const product = useLoaderData() as Product; // Автоматическая типизация в будущих версиях
  return <div>{product.title}</div>;
}
```

<!-- v -->

### Improved Error Handling

```jsx
import { isRouteErrorResponse, useRouteError } from "react-router";

function ErrorBoundary() {
  const error = useRouteError();

  if (isRouteErrorResponse(error)) {
    return (
      <div>
        <h1>
          {error.status} {error.statusText}
        </h1>
        <p>{error.data}</p>
      </div>
    );
  }

  return (
    <div>
      <h1>Упс! Что-то пошло не так</h1>
      <p>{error?.message || "Неизвестная ошибка"}</p>
    </div>
  );
}

const router = createBrowserRouter([
  {
    path: "/",
    element: <HomePage />,
    errorElement: <ErrorBoundary />, // Обработчик ошибок на уровне маршрута
  },
]);
```

<!-- s -->

## Продвинутые возможности

<!-- v -->

### Nested Routes - вложенные маршруты

```jsx
function App() {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<HomePage />} />
        <Route path="products" element={<ProductsLayout />}>
          <Route index element={<ProductsList />} />
          <Route path=":id" element={<ProductDetail />} />
          <Route path="new" element={<CreateProduct />} />
        </Route>
      </Route>
    </Routes>
  );
}

function Layout() {
  return (
    <div>
      <Header />
      <Outlet /> {/* Здесь рендерятся дочерние маршруты */}
      <Footer />
    </div>
  );
}
```

<!-- v -->

### Protected Routes - защищенные маршруты

```jsx
import { Navigate } from "react-router";

function ProtectedRoute({ children }) {
  const { user, loading } = useAuth();

  if (loading) {
    return <LoadingSpinner />;
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return children;
}

// Использование
<Route
  path="/dashboard"
  element={
    <ProtectedRoute>
      <Dashboard />
    </ProtectedRoute>
  }
/>;
```

<!-- v -->

### Error Boundaries и 404 страницы

```jsx
function App() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/about" element={<AboutPage />} />
      <Route path="/products/:id" element={<ProductDetail />} />

      {/* Catch-all route для 404 */}
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
}

function NotFoundPage() {
  return (
    <div>
      <h1>404 - Страница не найдена</h1>
      <Link to="/">Вернуться на главную</Link>
    </div>
  );
}
```

<!-- s -->

# Практическая часть

## Добавляем React Router в Shop App

<!-- v -->

## План практической работы

🎯 **Что будем делать:**

1. **Установим React Router** в существующий проект
2. **Создадим структуру страниц:**
   - Главная страница (каталог товаров)
   - Страница корзины
   - Страница товара (динамическая)
3. **Добавим навигацию** между страницами
4. **Реализуем ленивую загрузку** компонентов
5. **Оптимизируем производительность**

<!-- v -->

## Текущая структура Shop App

```
src/
  ├── components/
  │   ├── Header.tsx
  │   ├── ProductCatalog.tsx
  │   ├── ProductCard.tsx
  │   ├── Cart.tsx
  │   └── CartItem.tsx
  ├── store/
  ├── styles/
  ├── types/
  ├── App.tsx
  └── index.tsx
```

**Проблема:** Все компоненты на одной странице

<!-- v -->

## Новая структура с роутингом

```
src/
  ├── pages/
  │   ├── HomePage.tsx      // Каталог товаров
  │   ├── CartPage.tsx      // Корзина
  │   └── ProductPage.tsx   // Детали товара
  ├── components/
  │   ├── Layout/
  │   │   ├── Header.tsx
  │   │   └── Navigation.tsx
  │   ├── ProductCatalog.tsx
  │   ├── ProductCard.tsx
  │   ├── Cart.tsx
  │   └── CartItem.tsx
  ├── App.tsx
  └── index.tsx
```

<!-- v -->

## Результат занятия

✅ **Что мы изучили:**

- 🔄 **React Router v7** - современная маршрутизация с Data APIs
- ⚡ **Automatic Code Splitting** - автоматическое разделение кода
- � **Data Loading** - предзагрузка данных с loaders
- 📝 **Form Handling** - обработка форм с actions
- 🎯 **Performance** - встроенная оптимизация и предзагрузка
- 🛡️ **TypeScript** - улучшенная типизация

✅ **Практические навыки:**

- Настройка React Router v7 в проекте
- Использование Data APIs (loaders/actions)
- Создание производительных SPA
- Автоматическая оптимизация загрузки

✅ **Новые возможности v7:**

- 🚀 **createBrowserRouter** - новый способ создания роутера
- 📦 **Route-level lazy loading** - встроенная ленивая загрузка
- ⚡ **Link prefetching** - предзагрузка при наведении
- 🎯 **Enhanced DX** - лучший Developer Experience

<!-- v -->

## Полезные ресурсы

📚 **Документация и материалы:**

- [React Router v7 Documentation](https://reactrouter.com/dev) - **новая документация v7**
- [React Router v7 Migration Guide](https://reactrouter.com/dev/guides/v7-migration)
- [Data APIs Guide](https://reactrouter.com/dev/guides/data-loading)
- [React.dev - Code Splitting](https://react.dev/reference/react/lazy)
- [Vite + React Router](https://vitejs.dev/guide/features.html#client-side-routing)

🛠️ **Инструменты:**

- **React Router DevTools** - отладка маршрутов и данных
- **Vite** - встроенная поддержка React Router v7
- **Chrome DevTools** - анализ производительности и Network tab
- **Bundle Analyzer** - анализ автоматических chunks

🎯 **Новые возможности v7:**

- [createBrowserRouter API](https://reactrouter.com/dev/api/react-router-dom/create-browser-router)
- [Data Loading Patterns](https://reactrouter.com/dev/guides/data-loading)
- [Form Actions Guide](https://reactrouter.com/dev/guides/form-actions)
- [TypeScript Integration](https://reactrouter.com/dev/guides/typescript)

<!-- v -->

## Вопросы и обсуждение

🤔 **Вопросы для закрепления v7:**

1. **В чем преимущества createBrowserRouter перед классическими Routes?**
2. **Как работают loaders и actions в React Router v7?**
3. **Чем отличается route-level lazy от React.lazy()?**

💬 **Время для вопросов от студентов**

<!-- v -->

## Спасибо за внимание!
