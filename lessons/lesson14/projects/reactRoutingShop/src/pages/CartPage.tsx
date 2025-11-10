import React from "react";
import { Link, Form, useActionData } from "react-router";
import { ActionFunctionArgs } from "react-router";
import { useSelector } from "react-redux";
import { RootState } from "../store";
import Cart from "../components/Cart";
import styles from "../styles/App.module.css";

// Action для обработки промокода
export async function action({ request }: ActionFunctionArgs) {
  const formData = await request.formData();
  const promoCode = formData.get("promoCode") as string;

  // Простая валидация промокода
  const validCodes: Record<string, number> = {
    SAVE10: 10,
    SAVE20: 20,
    WELCOME: 15,
  };

  if (validCodes[promoCode]) {
    return {
      success: true,
      discount: validCodes[promoCode],
      message: `Промокод применен! Скидка ${validCodes[promoCode]}%`,
    };
  }

  return {
    success: false,
    message: "Неверный промокод",
  };
}

// Типы для action data
interface ActionData {
  success: boolean;
  discount?: number;
  message: string;
}

const CartPage: React.FC = () => {
  const { items } = useSelector((state: RootState) => state.cart);
  const actionData = useActionData() as ActionData | undefined;

  return (
    <div className={styles.pageContainer}>
      {items.length === 0 ? (
        <div className={styles.centerContent}>
          <div style={{ textAlign: "center" }}>
            <h2>Ваша корзина пуста</h2>
            <p>Добавьте товары из каталога, чтобы они появились здесь.</p>
            <Link
              to="/"
              style={{
                display: "inline-block",
                marginTop: "1rem",
                padding: "0.75rem 1.5rem",
                backgroundColor: "#007bff",
                color: "white",
                textDecoration: "none",
                borderRadius: "6px",
                fontWeight: "bold",
              }}
            >
              Перейти к каталогу
            </Link>
          </div>
        </div>
      ) : (
        <div>
          <Cart />

          {/* Форма промокода */}
          <div
            style={{
              marginTop: "2rem",
              padding: "1rem",
              border: "1px solid #ddd",
              borderRadius: "8px",
              backgroundColor: "white",
            }}
          >
            <h3>Промокод</h3>
            <Form
              method="post"
              style={{ display: "flex", gap: "1rem", alignItems: "center" }}
            >
              <input
                name="promoCode"
                placeholder="Введите промокод"
                style={{
                  padding: "0.5rem",
                  border: "1px solid #ddd",
                  borderRadius: "4px",
                  flex: 1,
                }}
              />
              <button
                type="submit"
                style={{
                  padding: "0.5rem 1rem",
                  backgroundColor: "#28a745",
                  color: "white",
                  border: "none",
                  borderRadius: "4px",
                  cursor: "pointer",
                }}
              >
                Применить
              </button>
            </Form>

            {actionData && (
              <div
                style={{
                  marginTop: "1rem",
                  padding: "0.5rem",
                  borderRadius: "4px",
                  backgroundColor: actionData.success ? "#d4edda" : "#f8d7da",
                  color: actionData.success ? "#155724" : "#721c24",
                  border: `1px solid ${
                    actionData.success ? "#c3e6cb" : "#f5c6cb"
                  }`,
                }}
              >
                {actionData.message}
              </div>
            )}

            <div
              style={{ marginTop: "1rem", fontSize: "0.9rem", color: "#666" }}
            >
              <strong>Доступные промокоды для тестирования:</strong>
              <br />
              SAVE10 (10%), SAVE20 (20%), WELCOME (15%)
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CartPage;
