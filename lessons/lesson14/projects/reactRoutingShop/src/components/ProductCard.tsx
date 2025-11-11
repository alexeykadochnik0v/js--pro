import { useSelector, useDispatch } from "react-redux";
import { RootState } from "../store";
import { addToCart } from "../store/cartSlice";
import { Product } from "../types";
import styles from "../styles/ProductCard.module.css";
import { Link } from "react-router";

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

  // Отладочная информация (можно удалить позже)
  console.log("ProductCard render:", {
    productId: product.id,
    cartItem,
    quantity: cartItem?.quantity,
  });

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
          {cartItem
            ? `Добавить еще (${cartItem.quantity})`
            : "Добавить в корзину"}
        </button>
        <Link to={`/product/${product.id}`} className={styles.detailButton}>
          Подробнее
        </Link>
      </div>
      {cartItem && (
        <div className={styles.quantityInfo}>
          <span className={styles.quantity}>
            В корзине: {cartItem.quantity} шт.
          </span>
        </div>
      )}
    </div>
  );
};

export default ProductCard;
