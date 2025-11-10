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
