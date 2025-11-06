import React from "react";
// TODO: При добавлении React Router заменить на Link из 'react-router'
// import { Link } from 'react-router';
import { useSelector } from "react-redux";
import { RootState } from "../store";
import Cart from "../components/Cart";
import styles from "../styles/App.module.css";

const CartPage: React.FC = () => {
  const { items } = useSelector((state: RootState) => state.cart);

  const handleGoToCatalog = () => {
    // TODO: При добавлении React Router использовать навигацию вместо alert
    alert(
      "Переход к каталогу товаров будет работать после добавления маршрутизации"
    );
  };

  return (
    <div className={styles.pageContainer}>
      {items.length === 0 ? (
        <div className={styles.centerContent}>
          <div style={{ textAlign: "center" }}>
            <h2>Ваша корзина пуста</h2>
            <p>Добавьте товары из каталога, чтобы они появились здесь.</p>
            <button
              onClick={handleGoToCatalog}
              style={{
                display: "inline-block",
                marginTop: "1rem",
                padding: "0.75rem 1.5rem",
                backgroundColor: "#007bff",
                color: "white",
                border: "none",
                borderRadius: "6px",
                fontWeight: "bold",
                cursor: "pointer",
              }}
            >
              Перейти к каталогу
            </button>
          </div>
        </div>
      ) : (
        <Cart />
      )}
    </div>
  );
};

export default CartPage;
