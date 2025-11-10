// TODO: Здесь будет конфигурация React Router v7
// При добавлении маршрутизации создать createBrowserRouter здесь

/*
Будущая структура:

import { createBrowserRouter } from 'react-router';
import Layout from '../components/Layout';
import { homeLoader, productLoader } from './loaders';

export const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    children: [
      {
        index: true,
        lazy: () => import("../pages/HomePage"),
        loader: homeLoader,
      },
      {
        path: "cart",
        lazy: () => import("../pages/CartPage"),
      },
      {
        path: "product/:id",
        lazy: () => import("../pages/ProductPage"),
        loader: productLoader,
      },
      {
        path: "*",
        lazy: () => import("../pages/NotFoundPage"),
      },
    ],
  },
]);
*/
