import { useDispatch } from "react-redux";
import { increaseQuantity, decreaseQuantity } from "../store/cartSlice";
import { CartItem as CartItemType } from "../types";
import styles from "../styles/CartItem.module.css";

interface CartItemProps {
  item: CartItemType;
}

const CartItem = ({ item }: CartItemProps) => {
  const dispatch = useDispatch();

  const handleIncrease = () => {
    dispatch(increaseQuantity(item.id));
  };

  const handleDecrease = () => {
    dispatch(decreaseQuantity(item.id));
  };

  const itemTotal = (item.price * item.quantity).toFixed(2);

  return (
    <div className={styles.cartItem}>
      <img src={item.thumbnail} alt={item.title} className={styles.image} />
      <div className={styles.details}>
        <h4 className={styles.title}>{item.title}</h4>
        <p className={styles.price}>{item.price} ₽ за шт.</p>
      </div>
      <div className={styles.controls}>
        <div className={styles.quantityControls}>
          <button
            onClick={handleDecrease}
            className={styles.quantityButton}
            aria-label="Уменьшить количество"
          >
            -
          </button>
          <span className={styles.quantity}>{item.quantity}</span>
          <button
            onClick={handleIncrease}
            className={styles.quantityButton}
            aria-label="Увеличить количество"
          >
            +
          </button>
        </div>
        <span className={styles.total}>{itemTotal} ₽</span>
      </div>
    </div>
  );
};

export default CartItem;
