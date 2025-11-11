import React from "react";
// TODO: При добавлении React Router заменить на Outlet из 'react-router'
// import { Outlet } from 'react-router';
import Header from "../Header";
import styles from "../../styles/Layout.module.css";

interface LayoutProps {
  children?: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <div className={styles.layout}>
      <Header />
      <main className={styles.main}>
        {/* TODO: При добавлении React Router заменить на <Outlet /> */}
        {children}
      </main>
      <footer className={styles.footer}>
        <div className={styles.footerContent}>
          <p>&copy; 2025 Магазин товаров. Все права защищены.</p>
          <p>Создано с ❤️ на OTUS JavaScript Pro</p>
        </div>
      </footer>
    </div>
  );
};

export default Layout;
