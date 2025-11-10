import { useSelector } from "react-redux";
import { RootState } from "../store";
import CartItem from "./CartItem";
import styles from "../styles/Cart.module.css";

const Cart = () => {
  const { items, totalAmount, totalQuantity } = useSelector(
    (state: RootState) => state.cart
  );

  if (items.length === 0) {
    return (
      <section className={styles.cart}>
        <h2 className={styles.title}>Корзина</h2>
        <p className={styles.empty}>Корзина пуста</p>
      </section>
    );
  }

  return (
    <section className={styles.cart}>
      <h2 className={styles.title}>Корзина</h2>
      <div className={styles.items}>
        {items.map((item) => (
          <CartItem key={item.id} item={item} />
        ))}
      </div>
      <div className={styles.summary}>
        <div className={styles.summaryRow}>
          <span className={styles.summaryLabel}>Товаров в корзине:</span>
          <span className={styles.summaryValue}>{totalQuantity}</span>
        </div>
        <div className={styles.summaryRow}>
          <span className={styles.summaryLabel}>Общая стоимость:</span>
          <span className={styles.summaryValue}>
            {totalAmount.toFixed(2)} ₽
          </span>
        </div>
      </div>
    </section>
  );
};

export default Cart;
