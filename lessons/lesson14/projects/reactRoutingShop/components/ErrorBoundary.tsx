import { useRouteError, isRouteErrorResponse, Link } from "react-router";

export default function ErrorBoundary() {
  const error = useRouteError();

  if (isRouteErrorResponse(error)) {
    return (
      <div
        style={{
          textAlign: "center",
          padding: "3rem",
          minHeight: "50vh",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <h1 style={{ color: "#e74c3c", fontSize: "3rem" }}>{error.status}</h1>
        <h2>{error.statusText}</h2>
        <p style={{ color: "#666", margin: "1rem 0 2rem" }}>
          {error.data || "Произошла ошибка при загрузке данных"}
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
    );
  }

  return (
    <div style={{ textAlign: "center", padding: "3rem" }}>
      <h1 style={{ color: "#e74c3c" }}>Упс! Что-то пошло не так</h1>
      <p>{"Неизвестная ошибка"}</p>
      <Link to="/">← Вернуться на главную</Link>
    </div>
  );
}
