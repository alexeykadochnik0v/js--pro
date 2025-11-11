import ProductCard from "./ProductCard";
import styles from "../styles/ProductCatalog.module.css";
import { Product } from "../types";

interface ProductCatalogProps {
  products: Product[];
}

const ProductCatalog: React.FC<ProductCatalogProps> = ({ products }) => {
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
