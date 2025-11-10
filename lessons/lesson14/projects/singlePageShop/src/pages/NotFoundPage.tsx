import React from "react";
import { Link } from "react-router-dom";
import styles from "../styles/NotFoundPage.module.css";

const NotFoundPage: React.FC = () => {
  return (
    <div className={styles.container}>
      <div className={styles.content}>
        <h1 className={styles.title}>404</h1>
        <h2 className={styles.subtitle}>Страница не найдена</h2>
        <p className={styles.description}>
          К сожалению, запрашиваемая страница не существует или была перемещена.
        </p>
        <div className={styles.actions}>
          <Link to="/" className={styles.homeButton}>
            🏠 Вернуться на главную
          </Link>
          <Link to="/cart" className={styles.cartButton}>
            🛒 Перейти в корзину
          </Link>
        </div>
      </div>
    </div>
  );
};

export default NotFoundPage;
