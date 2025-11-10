# 🚀 React Router v7 - Практическое руководство

## 📋 Обновление проекта до React Router v7

В этом руководстве мы обновим наш Shop App до React Router v7 с использованием новых Data APIs и современных возможностей.

<!-- s -->

## 🛠️ Обновление Shop App

### Шаг 0: Установка проекта без маршрутизации

#### Перейдите в папку cd js--pro\lessons\lesson14\projects\singlePageShop

```bash
# Установите зависимости
npm i

# Проверьте что проект без маршрутизации запускается
npm run start
```

#### Изучите структуру проекта

<!-- v -->

### Шаг 1: Установка React Router v7

> ⚠️ **Важно**: В React Router v7 пакет называется просто `react-router`, а не `react-router-dom`

```bash
# Удаляем старые пакеты роутера (если есть)
npm uninstall react-router-dom react-router

# Устанавливаем React Router v7
npm install react-router@7

# Проверяем установленную версию
npm list react-router
```

**Ожидаемый результат:**

```
react-router@7.x.x
```

> 💡 **Что изменилось**: В v7 все импорты идут из `react-router`, DOM-специфичные компоненты из `react-router/dom`

<!-- s -->

### Шаг 2: Обновление структуры файлов

```
src/
├── pages/
│   ├── HomePage.tsx           # + loader для товаров
│   ├── CartPage.tsx           # + action для обновления корзины
│   ├── ProductPage.tsx        # + loader для товара, action для корзины
│   └── NotFoundPage.tsx
├── router/
│   ├── index.ts              # Конфигурация роутера
│   └── loaders.ts            # Все loader функции
├── components/
└── store/
```

<!-- s -->

### Шаг 3: Создание loader функций

**3.1. Создаем файл `src/router/loaders.ts`:**

```tsx
// src/router/loaders.ts
import { LoaderFunctionArgs } from "react-router";
import { Product } from "../types";

// Loader для главной страницы - загрузка товаров
export async function homeLoader(): Promise<Product[]> {
  try {
    const response = await fetch("https://dummyjson.com/products?limit=6");
    if (!response.ok) {
      throw new Error("Failed to fetch products");
    }
    const data = await response.json();
    return data.products;
  } catch (error) {
    console.error("Error loading products:", error);
    throw new Response("Failed to load products", { status: 500 });
  }
}
```

<!-- v -->

```tsx
// Loader для страницы товара
export async function productLoader({
  params,
}: LoaderFunctionArgs): Promise<Product> {
  try {
    const { id } = params;
    if (!id) {
      throw new Response("Product ID is required", { status: 400 });
    }

    const response = await fetch(`https://dummyjson.com/products/${id}`);
    if (!response.ok) {
      throw new Response("Product not found", { status: 404 });
    }
    return response.json();
  } catch (error) {
    if (error instanceof Response) {
      throw error;
    }
    console.error("Error loading product:", error);
    throw new Response("Failed to load product", { status: 500 });
  }
}
```

> 💡 **Что делают loader'ы**: Загружают данные ДО рендера компонента, что улучшает UX

<!-- s -->

### Шаг 4: Создание router конфигурации (пока без lazy)

**4.1. Создаем файл `src/router/index.tsx`:**

```tsx
// src/router/index.tsx
import { createBrowserRouter } from "react-router";
import Layout from "../components/Layout";
import HomePage from "../pages/HomePage";
import CartPage from "../pages/CartPage";
import ProductPage from "../pages/ProductPage";
import NotFoundPage from "../pages/NotFoundPage";
import { homeLoader, productLoader } from "./loaders";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    children: [
      {
        index: true,
        element: <HomePage />,
        loader: homeLoader,
      },
      {
        path: "cart",
        element: <CartPage />,
      },
      {
        path: "product/:id",
        element: <ProductPage />,
        loader: productLoader,
      },
      {
        path: "*",
        element: <NotFoundPage />,
      },
    ],
  },
]);
```

> 💡 **Объяснение маршрутов**:
>
> - `index: true` - маршрут по умолчанию для "/"
> - `element` - загружаемый компонент
> - `loader` - функция предзагрузки данных
> - `:id` - динамический параметр в URL

<!-- s -->

### Шаг 5: Обновление Layout компонента

**5.1. Обновляем `src/components/Layout/Layout.tsx`:**

```tsx
// src/components/Layout/Layout.tsx
import React from "react";
import { Outlet } from "react-router";
import Header from "../Header";
import styles from "../../styles/Layout.module.css";

const Layout: React.FC = () => {
  return (
    <div className={styles.layout}>
      <Header />
      <main className={styles.main}>
        <Outlet /> {/* Здесь рендерятся страницы */}
      </main>
      <footer className={styles.footer}>
        <div className={styles.footerContent}>
          <p>&copy; 2025 Магазин товаров. Все права защищены.</p>
          <p>Создано с ❤️ на OTUS JavaScript Pro</p>
        </div>
      </footer>
    </div>
  );
};

export default Layout;
```

> 💡 **Outlet** - специальный компонент, который рендерит дочерние маршруты

<!-- s -->

### Шаг 6: Обновление Header с навигацией

**6.1. Обновляем `src/components/Header.tsx`:**

```tsx
// src/components/Header.tsx
import React from "react";
import { Link, NavLink, useLocation } from "react-router";
import { useSelector } from "react-redux";
import { RootState } from "../store";
import styles from "../styles/Header.module.css";

const Header: React.FC = () => {
  const location = useLocation();
  const { totalQuantity, totalAmount } = useSelector(
    (state: RootState) => state.cart
  );

  return (
    <header className={styles.header}>
      <div className={styles.container}>
        <Link to="/" className={styles.logo}>
          <h1 className={styles.title}>🛒 Shop App</h1>
        </Link>

        <nav className={styles.nav}>
          <NavLink
            to="/"
            className={({ isActive }) =>
              `${styles.navLink} ${isActive ? styles.active : ""}`
            }
          >
            Каталог
          </NavLink>
          <NavLink
            to="/cart"
            className={({ isActive }) =>
              `${styles.navLink} ${isActive ? styles.active : ""}`
            }
          >
            Корзина
            {totalQuantity > 0 && (
              <span className={styles.cartBadge}>{totalQuantity}</span>
            )}
          </NavLink>
        </nav>

        <div className={styles.cartInfo}>
          {totalQuantity > 0 && (
            <div className={styles.cartSummary}>
              <span className={styles.cartCount}>{totalQuantity} товаров</span>
              <span className={styles.cartTotal}>
                {totalAmount.toFixed(2)} ₽
              </span>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
```

> 💡 **NavLink vs Link**: NavLink автоматически добавляет активные стили

<!-- s -->

### Шаг 7: Обновление компонентов для использования loaders

**7.1. Обновляем `src/pages/HomePage.tsx`:**

```tsx
// src/pages/HomePage.tsx
import React from "react";
import { useLoaderData } from "react-router";
import { Product } from "../types";
import ProductCatalog from "../components/ProductCatalog";
import styles from "../styles/App.module.css";

export default function HomePage() {
  const products = useLoaderData() as Product[]; // Данные уже загружены!

  return (
    <div className={styles.pageContainer}>
      <ProductCatalog products={products} />
    </div>
  );
}
```

<!-- v -->

**7.2. Обновляем `src/components/ProductCatalog.tsx`:**

```tsx
// src/components/ProductCatalog.tsx
import React from "react";
// Убираем useEffect и useSelector для products - теперь получаем через props
import ProductCard from "./ProductCard";
import { Product } from "../types";
import styles from "../styles/ProductCatalog.module.css";

interface ProductCatalogProps {
  products: Product[];
}

const ProductCatalog: React.FC<ProductCatalogProps> = ({ products }) => {
  return (
    <section className={styles.catalog}>
      <h2 className={styles.title}>Каталог товаров</h2>
      <div className={styles.grid}>
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </section>
  );
};

export default ProductCatalog;
```

<!-- v -->

**7.3. Обновляем `src/pages/ProductPage.tsx`:**

```tsx
// src/pages/ProductPage.tsx
import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { addToCart } from "../store/cartSlice";
import { Product } from "../types";
import { RootState } from "../store";
import styles from "../styles/ProductPage.module.css";
import { Link, useLoaderData } from "react-router";

const ProductPage: React.FC = () => {
  const product = useLoaderData() as Product;

  const dispatch = useDispatch();
  const cartItem = useSelector((state: RootState) =>
    state.cart.items.find((item) => item.id === product.id)
  );

  const handleAddToCart = () => {
    if (product) {
      dispatch(addToCart(product));
    }
  };

  return (
    <div className={styles.container}>
      <nav className={styles.breadcrumbs}>
        <Link to="/" className={styles.breadcrumbLink}>
          Каталог
        </Link>
        <span className={styles.separator}> → </span>
        <span className={styles.current}>{product.title}</span>
      </nav>

      <div className={styles.productDetail}>
        <div className={styles.imageSection}>
          <img
            src={product.thumbnail}
            alt={product.title}
            className={styles.mainImage}
          />
          {product.images && product.images.length > 1 && (
            <div className={styles.thumbnails}>
              {product.images.map((image, index) => (
                <img
                  key={index}
                  src={image}
                  alt={`${product.title} ${index + 1}`}
                  className={styles.thumbnail}
                />
              ))}
            </div>
          )}
        </div>

        <div className={styles.infoSection}>
          <h1 className={styles.title}>{product.title}</h1>

          <div className={styles.priceSection}>
            <span className={styles.price}>{product.price} ₽</span>
            {product.discountPercentage && (
              <span className={styles.discount}>
                -{product.discountPercentage}%
              </span>
            )}
          </div>

          <div className={styles.details}>
            <p>
              <strong>Категория:</strong> {product.category}
            </p>
            {product.brand && (
              <p>
                <strong>Бренд:</strong> {product.brand}
              </p>
            )}
            <p>
              <strong>В наличии:</strong> {product.stock} шт.
            </p>
            {product.rating && (
              <p>
                <strong>Рейтинг:</strong> ⭐ {product.rating}/5
              </p>
            )}
          </div>

          <div className={styles.description}>
            <h3>Описание</h3>
            <p>{product.description}</p>
          </div>

          <div className={styles.actions}>
            <div className={styles.addToCartSection}>
              <button
                onClick={handleAddToCart}
                className={styles.addToCartButton}
                disabled={product.stock === 0}
              >
                {product.stock === 0 ? "Нет в наличии" : "Добавить в корзину"}
              </button>

              {cartItem && (
                <div className={styles.cartInfo}>
                  <span className={styles.cartQuantity}>
                    В корзине: {cartItem.quantity} шт.
                  </span>
                  <span className={styles.cartTotal}>
                    {(cartItem.price * cartItem.quantity).toFixed(2)} ₽
                  </span>
                </div>
              )}
            </div>

            <Link to="/cart" className={styles.goToCartButton}>
              Перейти в корзину
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductPage;
```

<!-- v -->

**7.4. Обновляем `src/pages/CartPage.tsx`:**

```tsx
// src/pages/CartPage.tsx
import React from "react";
import { Link } from "react-router";
import { useSelector } from "react-redux";
import { RootState } from "../store";
import Cart from "../components/Cart";
import styles from "../styles/App.module.css";

const CartPage: React.FC = () => {
  const { items } = useSelector((state: RootState) => state.cart);

  return (
    <div className={styles.pageContainer}>
      {items.length === 0 ? (
        <div className={styles.centerContent}>
          <div style={{ textAlign: "center" }}>
            <h2>Ваша корзина пуста</h2>
            <p>Добавьте товары из каталога, чтобы они появились здесь.</p>
            <Link
              to="/"
              style={{
                display: "inline-block",
                marginTop: "1rem",
                padding: "0.75rem 1.5rem",
                backgroundColor: "#007bff",
                color: "white",
                textDecoration: "none",
                borderRadius: "6px",
                fontWeight: "bold",
              }}
            >
              Перейти к каталогу
            </Link>
          </div>
        </div>
      ) : (
        <Cart />
      )}
    </div>
  );
};

export default CartPage;
```

<!-- s -->

### Шаг 8: Обновление ProductCard с навигацией

**8.1. Обновляем `src/components/ProductCard.tsx`:**

```tsx
// src/components/ProductCard.tsx
import React from "react";
import { Link } from "react-router";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "../store";
import { addToCart } from "../store/cartSlice";
import { Product } from "../types";
import styles from "../styles/ProductCard.module.css";

interface ProductCardProps {
  product: Product;
}

const ProductCard = ({ product }: ProductCardProps) => {
  const dispatch = useDispatch();
  const cartItem = useSelector((state: RootState) =>
    state.cart.items.find((item) => item.id === product.id)
  );

  const handleAddToCart = () => {
    dispatch(addToCart(product));
  };

  return (
    <div className={styles.card}>
      <Link to={`/product/${product.id}`} className={styles.imageLink}>
        <img
          src={product.thumbnail}
          alt={product.title}
          className={styles.image}
        />
      </Link>
      <div className={styles.content}>
        <Link to={`/product/${product.id}`} className={styles.titleLink}>
          <h3 className={styles.title}>{product.title}</h3>
        </Link>
        <p className={styles.price}>{product.price} ₽</p>
        <p className={styles.description}>{product.description}</p>
      </div>
      <div className={styles.buttonContainer}>
        <button onClick={handleAddToCart} className={styles.addButton}>
          Добавить в корзину
        </button>
        <Link to={`/product/${product.id}`} className={styles.detailButton}>
          Подробнее
        </Link>
        {cartItem && (
          <span className={styles.quantity}>{cartItem.quantity}</span>
        )}
      </div>
    </div>
  );
};

export default ProductCard;
```

<!-- s -->

### Шаг 9: Обновление главного App

**9.1. Обновляем `src/App.tsx`:**

```tsx
// src/App.tsx
import React from "react";
import { Provider } from "react-redux";
import { RouterProvider } from "react-router";
import { store } from "./store";
import { router } from "./router";

export default function App() {
  return (
    <Provider store={store}>
      <RouterProvider router={router} />
    </Provider>
  );
}
```

<!-- s -->

### Шаг 10: Создание страницы 404

**10.1. Создаем `src/pages/NotFoundPage.tsx`:**

```tsx
// src/pages/NotFoundPage.tsx
import React from "react";
import { Link } from "react-router";
import styles from "../styles/App.module.css";

const NotFoundPage: React.FC = () => {
  return (
    <div className={styles.pageContainer}>
      <div className={styles.centerContent}>
        <div style={{ textAlign: "center" }}>
          <h1
            style={{ fontSize: "4rem", color: "#e74c3c", margin: "0 0 1rem 0" }}
          >
            404
          </h1>
          <h2>Страница не найдена</h2>
          <p style={{ color: "#666", marginBottom: "2rem" }}>
            Запрашиваемая страница не существует или была удалена.
          </p>
          <Link
            to="/"
            style={{
              display: "inline-block",
              padding: "0.75rem 1.5rem",
              backgroundColor: "#007bff",
              color: "white",
              textDecoration: "none",
              borderRadius: "6px",
              fontWeight: "bold",
            }}
          >
            ← Вернуться на главную
          </Link>
        </div>
      </div>
    </div>
  );
};

export default NotFoundPage;
```

<!-- s -->

### Шаг 11: Финальная настройка index.tsx

**11.1. Обновляем `src/index.tsx`:**

```tsx
// src/index.tsx
import React from "react";
import { createRoot } from "react-dom/client";
import App from "./App";

const container = document.getElementById("root");
if (!container) {
  throw new Error("Root element not found");
}

const root = createRoot(container);
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
```

> 💡 **Что изменилось**: Убрали BrowserRouter (v6) - теперь RouterProvider управляет роутингом

<!-- s -->

## 🧪 Шаг 12: Тестирование приложения

**12.1. Запускаем приложение:**

```bash
npm start
```

<!-- v -->

**12.2. Проверяем маршруты:**

✅ **http://localhost:3000/** - главная страница с товарами  
✅ **http://localhost:3000/cart** - страница корзины  
✅ **http://localhost:3000/product/1** - страница товара с ID=1  
✅ **http://localhost:3000/product/999** - 404 ошибка через ErrorBoundary (продукт не найден)
✅ **http://localhost:3000/nonexistent** - страница 404

<!-- v -->

**12.3. Проверяем функциональность:**

- [ ] Навигация работает без перезагрузки страницы
- [ ] Товары загружаются на главной странице
- [ ] Можно перейти к деталям товара
- [ ] Кнопки в хедере подсвечиваются активным состоянием
- [ ] Корзина работает на всех страницах
- [ ] Несуществующие URL показывают 404

<!-- s -->

## 🔧 Шаг 13: Отладка распространенных ошибок

### Ошибка: "Cannot resolve module 'react-router'"

**Решение:**

```bash
npm uninstall react-router-dom
npm install react-router@7
```

### Ошибка: "useLoaderData is undefined"

**Причина**: Неправильный импорт или компонент не в роутере с loader'ом

**Решение:**

```tsx
// Правильный импорт
import { useLoaderData } from 'react-router';

// Убедитесь что маршрут имеет loader
{
  path: "/",
  element: <HomePage />,
  loader: homeLoader, // Обязательно!
}
```

### Ошибка: "RouterProvider is not a function"

**Решение:**

```tsx
// Правильный импорт в v7
import { RouterProvider } from "react-router/dom";
```

### Ошибка: "Cannot GET /product/123" при прямом переходе по URL

**Причина**: Webpack dev server не знает о React Router маршрутах и возвращает 404 до загрузки React приложения.

**Решение**: Добавить `historyApiFallback: true` в webpack.config.js:

```javascript
// webpack.config.js
module.exports = {
  // ... другие настройки
  devServer: {
    static: {
      directory: path.join(__dirname, "public"),
    },
    compress: true,
    port: 3000,
    open: true,
    hot: true,
    historyApiFallback: true, // ← Важно для SPA!
  },
  output: {
    path: path.resolve(__dirname, "dist"),
    filename: "bundle.js",
    publicPath: "/", // ← Также важно для React Router
    clean: true,
  },
};
```

> 💡 **Что делает historyApiFallback**: Перенаправляет все 404 ошибки сервера на index.html, позволяя React Router обработать клиентскую маршрутизацию.

### Данные не загружаются

**Проверьте:**

1. Loader добавлен в маршрут
2. Функция loader экспортируется
3. API доступен (https://dummyjson.com)
4. Нет ошибок в консоли браузера

<!-- s -->

## 🎯 Новые возможности в действии

### Предзагрузка при наведении

```tsx
// Ссылки автоматически предзагружают данные при наведении
<Link to={`/product/${product.id}`}>
  {product.title} {/* Данные начнут загружаться при hover */}
</Link>
```

<!-- s -->

### Error Boundaries на уровне маршрутов

```tsx
// src/components/ErrorBoundary.tsx
import { useRouteError, isRouteErrorResponse, Link } from "react-router";

export default function ErrorBoundary() {
  const error = useRouteError();

  if (isRouteErrorResponse(error)) {
    return (
      <div
        style={{
          textAlign: "center",
          padding: "3rem",
          minHeight: "50vh",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <h1 style={{ color: "#e74c3c", fontSize: "3rem" }}>{error.status}</h1>
        <h2>{error.statusText}</h2>
        <p style={{ color: "#666", margin: "1rem 0 2rem" }}>
          {error.data || "Произошла ошибка при загрузке данных"}
        </p>
        <Link
          to="/"
          style={{
            display: "inline-block",
            padding: "0.75rem 1.5rem",
            backgroundColor: "#007bff",
            color: "white",
            textDecoration: "none",
            borderRadius: "6px",
            fontWeight: "bold",
          }}
        >
          ← Вернуться на главную
        </Link>
      </div>
    );
  }

  return (
    <div style={{ textAlign: "center", padding: "3rem" }}>
      <h1 style={{ color: "#e74c3c" }}>Упс! Что-то пошло не так</h1>
      <p>{"Неизвестная ошибка"}</p>
      <Link to="/">← Вернуться на главную</Link>
    </div>
  );
}

// Добавляем в роутер
const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    errorElement: <ErrorBoundary />, // Обработка ошибок
    children: [...],
  },
]);
```

<!-- s -->

## 🚀 Дополнительные возможности (Продвинутый уровень)

### Добавление Error Boundary

**Создаем `src/components/ErrorBoundary.tsx`:**

```tsx
// src/components/ErrorBoundary.tsx
import { useRouteError, isRouteErrorResponse, Link } from "react-router";

export default function ErrorBoundary() {
  const error = useRouteError();

  if (isRouteErrorResponse(error)) {
    return (
      <div
        style={{
          textAlign: "center",
          padding: "3rem",
          minHeight: "50vh",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <h1 style={{ color: "#e74c3c", fontSize: "3rem" }}>{error.status}</h1>
        <h2>{error.statusText}</h2>
        <p style={{ color: "#666", margin: "1rem 0 2rem" }}>
          {error.data || "Произошла ошибка при загрузке данных"}
        </p>
        <Link
          to="/"
          style={{
            display: "inline-block",
            padding: "0.75rem 1.5rem",
            backgroundColor: "#007bff",
            color: "white",
            textDecoration: "none",
            borderRadius: "6px",
            fontWeight: "bold",
          }}
        >
          ← Вернуться на главную
        </Link>
      </div>
    );
  }

  return (
    <div style={{ textAlign: "center", padding: "3rem" }}>
      <h1 style={{ color: "#e74c3c" }}>Упс! Что-то пошло не так</h1>
      <p>{error?.message || "Неизвестная ошибка"}</p>
      <Link to="/">← Вернуться на главную</Link>
    </div>
  );
}
```

<!-- v -->

**Добавляем Error Boundary в роутер:**

```tsx
// src/router/index.ts
import { createBrowserRouter } from "react-router";
import Layout from "../components/Layout";
import ErrorBoundary from "../components/ErrorBoundary";
import { homeLoader, productLoader } from "./loaders";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    errorElement: <ErrorBoundary />, // Добавляем обработку ошибок
    children: [
      {
        index: true,
        element: <HomePage />,
        loader: homeLoader,
      },
      {
        path: "cart",
        element: <CartPage />,
      },
      {
        path: "product/:id",
        element: <ProductPage />,
        loader: productLoader,
        errorElement: <ErrorBoundary />, // Индивидуальная обработка
      },
      {
        path: "*",
        element: <NotFoundPage />,
      },
    ],
  },
]);
```

<!-- s -->

### Переход к Lazy Loading компонентов

**Для оптимизации производительности обновляем роутер с lazy загрузкой:**

```tsx
// src/router/index.ts
import { createBrowserRouter } from "react-router";
import Layout from "../components/Layout";
import ErrorBoundary from "../components/ErrorBoundary";
import { homeLoader, productLoader } from "./loaders";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    errorElement: <ErrorBoundary />,
    children: [
      {
        index: true,
        lazy: async () => {
          const { default: Component } = await import("../pages/HomePage");
          return { Component };
        },
        loader: homeLoader,
      },
      {
        path: "cart",
        lazy: async () => {
          const { default: Component } = await import("../pages/CartPage");
          return { Component };
        },
      },
      {
        path: "product/:id",
        lazy: async () => {
          const { default: Component } = await import("../pages/ProductPage");
          return { Component };
        },
        loader: productLoader,
        errorElement: <ErrorBoundary />,
      },
      {
        path: "*",
        lazy: async () => {
          const { default: Component } = await import("../pages/NotFoundPage");
          return { Component };
        },
      },
    ],
  },
]);
```

> 💡 **Lazy Loading**: Компоненты загружаются только когда пользователь переходит на соответствующую страницу, что улучшает начальную загрузку приложения.

> ⚠️ **Важный синтаксис**: В React Router v7 lazy функция должна возвращать объект с свойством `Component`. Функция должна быть `async` и деструктурировать `default` экспорт:

```tsx
// ❌ Неправильно - React Router v6 синтаксис
lazy: () => import("../pages/HomePage");

// ✅ Правильно - React Router v7 синтаксис
lazy: async () => {
  const { default: Component } = await import("../pages/HomePage");
  return { Component };
};
```

<!-- s -->

### Добавление Loading UI

**Создаем компонент загрузки `src/components/LoadingFallback.tsx`:**

```tsx
// src/components/LoadingFallback.tsx
import React from "react";

const LoadingFallback: React.FC = () => {
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        minHeight: "50vh",
        flexDirection: "column",
      }}
    >
      <div
        style={{
          width: "50px",
          height: "50px",
          border: "4px solid #f3f3f3",
          borderTop: "4px solid #007bff",
          borderRadius: "50%",
          animation: "spin 1s linear infinite",
        }}
      ></div>
      <p style={{ marginTop: "1rem", color: "#666" }}>Загрузка страницы...</p>
      <style>
        {`
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        `}
      </style>
    </div>
  );
};

export default LoadingFallback;
```

> ⚠️ **Важно в React Router v7**: RouterProvider не поддерживает свойство `fallbackElement`. Вместо этого loading состояния обрабатываются несколькими способами:

<!-- v -->

### 1. **React Suspense + Lazy Components**

Используйте Suspense для lazy loading компонентов:

```tsx
// src/App.tsx
import React, { Suspense } from "react";
import { Provider } from "react-redux";
import { RouterProvider } from "react-router";
import { store } from "./store";
import { router } from "./router";
import LoadingFallback from "./components/LoadingFallback";

export default function App() {
  return (
    <Provider store={store}>
      <Suspense fallback={<LoadingFallback />}>
        <RouterProvider router={router} />
      </Suspense>
    </Provider>
  );
}
```

<!-- v -->

### 2. **useNavigation для состояния загрузки данных**

Показывайте загрузку на уровне Layout:

```tsx
// src/components/Layout.tsx
import React from "react";
import { Outlet, useNavigation } from "react-router";
import Header from "./Header";
import LoadingFallback from "./LoadingFallback";
import styles from "../styles/Layout.module.css";

const Layout: React.FC = () => {
  const navigation = useNavigation();

  return (
    <div className={styles.layout}>
      <Header />
      <main className={styles.main}>
        {navigation.state === "loading" ? <LoadingFallback /> : <Outlet />}
      </main>
      <footer className={styles.footer}>
        <div className={styles.footerContent}>
          <p>&copy; 2025 Магазин товаров. Все права защищены.</p>
          <p>Создано с ❤️ на OTUS JavaScript Pro</p>
        </div>
      </footer>
    </div>
  );
};

export default Layout;
```

<!-- v -->

### 3. **Кастомный Loading в компонентах**

Для более детального контроля используйте состояние navigation в компонентах:

```tsx
// src/pages/HomePage.tsx
import React from "react";
import { useLoaderData, useNavigation } from "react-router";
import { Product } from "../types";
import ProductCatalog from "../components/ProductCatalog";
import LoadingFallback from "../components/LoadingFallback";
import styles from "../styles/App.module.css";

export default function HomePage() {
  const products = useLoaderData() as Product[];
  const navigation = useNavigation();

  // Показываем loader при переходах между страницами
  if (navigation.state === "loading") {
    return <LoadingFallback />;
  }

  return (
    <div className={styles.pageContainer}>
      <ProductCatalog products={products} />
    </div>
  );
}
```

<!-- v -->

### 4. **Индикатор загрузки в навигации**

Добавьте индикатор в Header:

```tsx
// src/components/Header.tsx
import React from "react";
import { Link, NavLink, useNavigation } from "react-router";
import { useSelector } from "react-redux";
import { RootState } from "../store";
import styles from "../styles/Header.module.css";

const Header: React.FC = () => {
  const navigation = useNavigation();
  const { totalQuantity, totalAmount } = useSelector(
    (state: RootState) => state.cart
  );

  return (
    <header className={styles.header}>
      <div className={styles.container}>
        <Link to="/" className={styles.logo}>
          <h1 className={styles.title}>🛒 Shop App</h1>
        </Link>

        {/* Индикатор загрузки */}
        {navigation.state === "loading" && (
          <div className={styles.loadingIndicator}>
            <div className={styles.spinner}></div>
            <span>Загрузка...</span>
          </div>
        )}

        <nav className={styles.nav}>
          <NavLink
            to="/"
            className={({ isActive }) =>
              `${styles.navLink} ${isActive ? styles.active : ""}`
            }
          >
            Каталог
          </NavLink>
          <NavLink
            to="/cart"
            className={({ isActive }) =>
              `${styles.navLink} ${isActive ? styles.active : ""}`
            }
          >
            Корзина
            {totalQuantity > 0 && (
              <span className={styles.cartBadge}>{totalQuantity}</span>
            )}
          </NavLink>
        </nav>

        <div className={styles.cartInfo}>
          {totalQuantity > 0 && (
            <div className={styles.cartSummary}>
              <span className={styles.cartCount}>{totalQuantity} товаров</span>
              <span className={styles.cartTotal}>
                {totalAmount.toFixed(2)} ₽
              </span>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
```

**Рекомендуемый подход - комбинированный:**

1. **Suspense в App.tsx** для lazy loading компонентов при загрузке приложения
2. **useNavigation в Layout** для показа загрузки при переходах между страницами
3. **Индикатор в Header** для визуальной обратной связи пользователю
4. **Кастомные индикаторы** в отдельных компонентах при необходимости

> 💡 **Преимущества этого подхода**:
>
> - Пользователь всегда видит, что происходит загрузка
> - Вы можете контролировать где и как показывать loading состояния
> - Разные типы загрузки обрабатываются соответствующими механизмами
> - Лучший UX за счет информативной обратной связи

**Итоговый результат:**

- ✅ **Lazy loading** - Suspense показывает LoadingFallback при загрузке chunk'ов
- ✅ **Data loading** - useNavigation показывает загрузку во время работы loader'ов
- ✅ **Visual feedback** - Индикатор в Header показывает активность
- ✅ **Fallback coverage** - Все состояния загрузки покрыты подходящими индикаторами

<!-- s -->

### Формы с Actions (Промокоды)

**Добавляем action в CartPage:**

```tsx
// src/pages/CartPage.tsx
import React from "react";
import { Link, Form, useActionData } from "react-router";
import { ActionFunctionArgs } from "react-router";
import { useSelector } from "react-redux";
import { RootState } from "../store";
import Cart from "../components/Cart";
import styles from "../styles/App.module.css";

// Action для обработки промокода
export async function action({ request }: ActionFunctionArgs) {
  const formData = await request.formData();
  const promoCode = formData.get("promoCode") as string;

  // Простая валидация промокода
  // Record<string, number> позволяет использовать любой string как ключ
  const validCodes: Record<string, number> = {
    SAVE10: 10,
    SAVE20: 20,
    WELCOME: 15,
  };

  if (validCodes[promoCode]) {
    return {
      success: true,
      discount: validCodes[promoCode],
      message: `Промокод применен! Скидка ${validCodes[promoCode]}%`,
    };
  }

  return {
    success: false,
    message: "Неверный промокод",
  };
}

// Типы для action data
interface ActionData {
  success: boolean;
  discount?: number;
  message: string;
}

const CartPage: React.FC = () => {
  const { items } = useSelector((state: RootState) => state.cart);
  const actionData = useActionData() as ActionData | undefined;

  return (
    <div className={styles.pageContainer}>
      {items.length === 0 ? (
        <div className={styles.centerContent}>
          <div style={{ textAlign: "center" }}>
            <h2>Ваша корзина пуста</h2>
            <p>Добавьте товары из каталога, чтобы они появились здесь.</p>
            <Link
              to="/"
              style={{
                display: "inline-block",
                marginTop: "1rem",
                padding: "0.75rem 1.5rem",
                backgroundColor: "#007bff",
                color: "white",
                textDecoration: "none",
                borderRadius: "6px",
                fontWeight: "bold",
              }}
            >
              Перейти к каталогу
            </Link>
          </div>
        </div>
      ) : (
        <div>
          <Cart />

          {/* Форма промокода */}
          <div
            style={{
              marginTop: "2rem",
              padding: "1rem",
              border: "1px solid #ddd",
              borderRadius: "8px",
              backgroundColor: "white",
            }}
          >
            <h3>Промокод</h3>
            <Form
              method="post"
              style={{ display: "flex", gap: "1rem", alignItems: "center" }}
            >
              <input
                name="promoCode"
                placeholder="Введите промокод"
                style={{
                  padding: "0.5rem",
                  border: "1px solid #ddd",
                  borderRadius: "4px",
                  flex: 1,
                }}
              />
              <button
                type="submit"
                style={{
                  padding: "0.5rem 1rem",
                  backgroundColor: "#28a745",
                  color: "white",
                  border: "none",
                  borderRadius: "4px",
                  cursor: "pointer",
                }}
              >
                Применить
              </button>
            </Form>

            {actionData && (
              <div
                style={{
                  marginTop: "1rem",
                  padding: "0.5rem",
                  borderRadius: "4px",
                  backgroundColor: actionData.success ? "#d4edda" : "#f8d7da",
                  color: actionData.success ? "#155724" : "#721c24",
                  border: `1px solid ${
                    actionData.success ? "#c3e6cb" : "#f5c6cb"
                  }`,
                }}
              >
                {actionData.message}
              </div>
            )}

            <div
              style={{ marginTop: "1rem", fontSize: "0.9rem", color: "#666" }}
            >
              <strong>Доступные промокоды для тестирования:</strong>
              <br />
              SAVE10 (10%), SAVE20 (20%), WELCOME (15%)
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CartPage;
```

<!-- v -->

**Обновляем роутер с action:**

```tsx
// src/router/index.ts
export const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    errorElement: <ErrorBoundary />,
    children: [
      {
        index: true,
        lazy: async () => {
          const { default: Component } = await import("../pages/HomePage");
          return { Component };
        },
        loader: homeLoader,
      },
      {
        path: "cart",
        lazy: async () => {
          const { default: Component, action } = await import(
            "../pages/CartPage"
          );
          return { Component, action };
        },
      },
      {
        path: "product/:id",
        lazy: async () => {
          const { default: Component } = await import("../pages/ProductPage");
          return { Component };
        },
        loader: productLoader,
        errorElement: <ErrorBoundary />,
      },
      {
        path: "*",
        lazy: async () => {
          const { default: Component } = await import("../pages/NotFoundPage");
          return { Component };
        },
      },
    ],
  },
]);
```

<!-- s -->

## 📊 Преимущества обновления

### До v7:

- ❌ Manual loading states в каждом компоненте
- ❌ Ручное управление code splitting
- ❌ Нет предзагрузки данных
- ❌ Сложная обработка форм

### После v7:

- ✅ **Автоматические loading states**
- ✅ **Встроенное code splitting**
- ✅ **Предзагрузка при hover**
- ✅ **Декларативные формы**
- ✅ **Лучшая типизация TypeScript**
- ✅ **Улучшенная производительность**

<!-- s -->

## 📋 Чек-лист готовности проекта

### ✅ Базовая функциональность:

- [ ] React Router v7 установлен (`npm list react-router`)
- [ ] Все страницы доступны по URL
- [ ] Навигация работает без перезагрузки страницы
- [ ] Loader'ы загружают данные до рендера компонентов
- [ ] Lazy loading работает (проверить в Network tab)
- [ ] Error boundaries обрабатывают ошибки
- [ ] 404 страница показывается для несуществующих URL

### ✅ Дополнительные возможности:

- [ ] Предзагрузка данных при наведении на ссылки
- [ ] Actions обрабатывают формы
- [ ] Loading состояния отображаются корректно
- [ ] Breadcrumbs навигация работает
- [ ] Активные пункты меню подсвечиваются

<!-- s -->

## 🎯 Заключение

Поздравляем! Вы успешно настроили приложение с React Router v7 и получили:

✅ **Современную архитектуру** с Data APIs  
✅ **Автоматическую оптимизацию** производительности  
✅ **Лучший UX** благодаря предзагрузке данных  
✅ **Упрощенный код** без manual loading states  
✅ **Готовность к масштабированию** проекта

### 📚 Что изучили:

1. **createBrowserRouter** - новый способ создания маршрутов
2. **Data APIs** - loaders и actions для работы с данными
3. **Automatic Code Splitting** - автоматическое разделение кода
4. **Error Boundaries** - обработка ошибок на уровне маршрутов
5. **Enhanced UX** - предзагрузка и оптимизация

<!-- s -->

**Это современный подход к маршрутизации в React 2025!** 🚀

> 💡 **Совет**: Сохраните это руководство как reference для будущих проектов!
