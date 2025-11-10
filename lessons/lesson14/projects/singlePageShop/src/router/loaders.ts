// TODO: Здесь будут loader функции для React Router v7
// При добавлении маршрутизации создать loader'ы здесь

/*
Будущие loader'ы:

import { LoaderFunctionArgs } from 'react-router';
import { Product } from '../types';

// Loader для главной страницы - загрузка товаров
export async function homeLoader(): Promise<Product[]> {
  const response = await fetch('https://dummyjson.com/products?limit=6');
  if (!response.ok) {
    throw new Error('Failed to fetch products');
  }
  const data = await response.json();
  return data.products;
}

// Loader для страницы товара
export async function productLoader({ params }: LoaderFunctionArgs): Promise<Product> {
  const response = await fetch(`https://dummyjson.com/products/${params.id}`);
  if (!response.ok) {
    throw new Response('Product not found', { status: 404 });
  }
  return response.json();
}
*/
