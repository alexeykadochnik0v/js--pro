import React from "react";
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

  const handleShowDetails = () => {
    // TODO: При добавлении React Router здесь будет навигация к /product/:id
    alert(`Детали товара: ${product.title}\nОписание: ${product.description}`);
  };

  return (
    <div className={styles.card}>
      <div className={styles.imageLink} onClick={handleShowDetails}>
        <img
          src={product.thumbnail}
          alt={product.title}
          className={styles.image}
        />
      </div>
      <div className={styles.content}>
        <div className={styles.titleLink} onClick={handleShowDetails}>
          <h3 className={styles.title}>{product.title}</h3>
        </div>
        <p className={styles.price}>{product.price} ₽</p>
        <p className={styles.description}>{product.description}</p>
      </div>
      <div className={styles.buttonContainer}>
        <button onClick={handleAddToCart} className={styles.addButton}>
          Добавить в корзину
        </button>
        <button onClick={handleShowDetails} className={styles.detailButton}>
          Подробнее
        </button>
        {cartItem && (
          <span className={styles.quantity}>{cartItem.quantity}</span>
        )}
      </div>
    </div>
  );
};

export default ProductCard;
