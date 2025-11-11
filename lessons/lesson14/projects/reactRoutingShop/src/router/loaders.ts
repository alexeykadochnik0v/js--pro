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
