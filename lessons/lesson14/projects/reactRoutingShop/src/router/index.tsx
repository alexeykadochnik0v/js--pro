import { createBrowserRouter } from "react-router";
import Layout from "../components/Layout";
import { homeLoader, productLoader } from "./loaders";
import ErrorBoundary from "../components/ErrorBoundary";

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
