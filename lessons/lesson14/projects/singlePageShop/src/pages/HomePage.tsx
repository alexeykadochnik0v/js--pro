import React from "react";
// TODO: При добавлении React Router заменить на useLoaderData
// import { useLoaderData } from 'react-router';
import ProductCatalog from "../components/ProductCatalog";
import styles from "../styles/App.module.css";

const HomePage: React.FC = () => {
  // TODO: При добавлении React Router получать products из loader'а:
  // const products = useLoaderData() as Product[];

  return (
    <div className={styles.pageContainer}>
      {/* TODO: При добавлении React Router передать products как пропс */}
      <ProductCatalog />
    </div>
  );
};

export default HomePage;
