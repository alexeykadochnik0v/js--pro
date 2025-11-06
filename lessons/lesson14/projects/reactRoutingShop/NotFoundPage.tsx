import React from "react";
import { Link } from "react-router";
import styles from "../styles/App.module.css";

const NotFoundPage: React.FC = () => {
  return (
    <div className={styles.pageContainer}>
      <div className={styles.centerContent}>
        <div style={{ textAlign: "center" }}>
          <h1
            style={{ fontSize: "4rem", color: "#e74c3c", margin: "0 0 1rem 0" }}
          >
            404
          </h1>
          <h2>Страница не найдена</h2>
          <p style={{ color: "#666", marginBottom: "2rem" }}>
            Запрашиваемая страница не существует или была удалена.
          </p>
          <Link
            to="/"
            style={{
              display: "inline-block",
              padding: "0.75rem 1.5rem",
              backgroundColor: "#007bff",
              color: "white",
              textDecoration: "none",
              borderRadius: "6px",
              fontWeight: "bold",
            }}
          >
            ← Вернуться на главную
          </Link>
        </div>
      </div>
    </div>
  );
};

export default NotFoundPage;
