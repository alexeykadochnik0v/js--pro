import React from "react";
import { useSelector } from "react-redux";
import { RootState } from "../store";
import styles from "../styles/Header.module.css";

const Header: React.FC = () => {
  const { totalQuantity, totalAmount } = useSelector(
    (state: RootState) => state.cart
  );

  return (
    <header className={styles.header}>
      <div className={styles.container}>
        <div className={styles.logo}>
          <h1 className={styles.title}>🛒 Shop App</h1>
        </div>

        <nav className={styles.nav}>
          <button className={`${styles.navLink} ${styles.active}`}>
            Каталог
          </button>
          <button className={styles.navLink}>
            Корзина
            {totalQuantity > 0 && (
              <span className={styles.cartBadge}>{totalQuantity}</span>
            )}
          </button>
        </nav>

        <div className={styles.cartInfo}>
          {totalQuantity > 0 && (
            <div className={styles.cartSummary}>
              <span className={styles.cartCount}>{totalQuantity} товаров</span>
              <span className={styles.cartTotal}>
                {totalAmount.toFixed(2)} ₽
              </span>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
