import React from "react";
import { useSelector } from "react-redux";
import { RootState } from "../store";
import styles from "../styles/Header.module.css";
import { Link, NavLink, useLocation } from "react-router";

const Header: React.FC = () => {
  const location = useLocation();
  const { totalQuantity, totalAmount } = useSelector(
    (state: RootState) => state.cart
  );

  return (
    <header className={styles.header}>
      <div className={styles.container}>
        <Link to="/" className={styles.logo}>
          <h1 className={styles.title}>🛒 Shop App</h1>
        </Link>

        <nav className={styles.nav}>
          <NavLink
            to="/"
            className={({ isActive }) =>
              `${styles.navLink} ${isActive ? styles.active : ""}`
            }
          >
            Каталог
          </NavLink>
          <NavLink
            to="/cart"
            className={({ isActive }) =>
              `${styles.navLink} ${isActive ? styles.active : ""}`
            }
          >
            Корзина
            {totalQuantity > 0 && (
              <span className={styles.cartBadge}>{totalQuantity}</span>
            )}
          </NavLink>
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
