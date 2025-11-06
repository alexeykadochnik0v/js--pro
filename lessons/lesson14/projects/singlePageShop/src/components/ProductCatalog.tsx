import { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "../store";
import { fetchProducts } from "../store/productsSlice";
import ProductCard from "./ProductCard";
import styles from "../styles/ProductCatalog.module.css";

const ProductCatalog = () => {
  const dispatch = useDispatch();
  const { products, loading, error } = useSelector(
    (state: RootState) => state.products
  );

  useEffect(() => {
    dispatch(fetchProducts() as any);
  }, [dispatch]);

  if (loading) {
    return (
      <section className={styles.catalog}>
        <h2 className={styles.title}>Каталог товаров</h2>
        <p className={styles.loading}>Загрузка товаров...</p>
      </section>
    );
  }

  if (error) {
    return (
      <section className={styles.catalog}>
        <h2 className={styles.title}>Каталог товаров</h2>
        <p className={styles.error}>Ошибка загрузки: {error}</p>
      </section>
    );
  }

  return (
    <section className={styles.catalog}>
      <h2 className={styles.title}>Каталог товаров</h2>
      <div className={styles.grid}>
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </section>
  );
};

export default ProductCatalog;
