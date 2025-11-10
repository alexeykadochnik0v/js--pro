import React from "react";
import { useLoaderData } from "react-router";
import ProductCatalog from "../components/ProductCatalog";
import styles from "../styles/App.module.css";
import { Product } from "../types";

const HomePage: React.FC = () => {
  const products = useLoaderData() as Product[];

  return (
    <div className={styles.pageContainer}>
      <ProductCatalog products={products} />
    </div>
  );
};

export default HomePage;
