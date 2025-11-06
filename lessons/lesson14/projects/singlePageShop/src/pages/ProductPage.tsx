import React from "react";
// TODO: При добавлении React Router заменить на useLoaderData
// import { useLoaderData, Link } from 'react-router';
import { useDispatch } from "react-redux";
import { addToCart } from "../store/cartSlice";
import { Product } from "../types";
import styles from "../styles/ProductPage.module.css";

const ProductPage: React.FC = () => {
  // TODO: При добавлении React Router получать product из loader'а:
  // const product = useLoaderData() as Product;

  const dispatch = useDispatch();

  // Временные данные для демонстрации без роутера
  const product: Product = {
    id: 1,
    title: "Пример товара",
    description:
      "Это пример товара для демонстрации страницы без маршрутизации",
    price: 999,
    thumbnail: "https://via.placeholder.com/400x300",
    category: "Электроника",
    stock: 10,
    rating: 4.5,
    discountPercentage: 10,
    brand: "Example Brand",
    images: ["https://via.placeholder.com/400x300"],
  };

  const handleAddToCart = () => {
    if (product) {
      dispatch(addToCart(product));
    }
  };

  const handleGoToCatalog = () => {
    // TODO: При добавлении React Router использовать навигацию
    alert("Переход к каталогу будет работать после добавления маршрутизации");
  };

  const handleGoToCart = () => {
    // TODO: При добавлении React Router использовать навигацию
    alert("Переход к корзине будет работать после добавления маршрутизации");
  };

  return (
    <div className={styles.container}>
      <nav className={styles.breadcrumbs}>
        <button onClick={handleGoToCatalog} className={styles.breadcrumbLink}>
          Каталог
        </button>
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
            <button
              onClick={handleAddToCart}
              className={styles.addToCartButton}
              disabled={product.stock === 0}
            >
              {product.stock === 0 ? "Нет в наличии" : "Добавить в корзину"}
            </button>

            <button onClick={handleGoToCart} className={styles.goToCartButton}>
              Перейти в корзину
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductPage;
