import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../store';
import { addToCart } from '../store/cartSlice';
import { Product } from '../types';
import styles from '../styles/ProductCard.module.css';

interface ProductCardProps {
  product: Product;
}

const ProductCard = ({ product }: ProductCardProps) => {
  const dispatch = useDispatch();
  const cartItem = useSelector((state: RootState) => 
    state.cart.items.find(item => item.id === product.id)
  );

  const handleAddToCart = () => {
    dispatch(addToCart(product));
  };

  return (
    <div className={styles.card}>
      <img src={product.thumbnail} alt={product.title} className={styles.image} />
      <h3 className={styles.title}>{product.title}</h3>
      <p className={styles.price}>{product.price} ₽</p>
      <p className={styles.description}>{product.description}</p>
      <div className={styles.buttonContainer}>
        <button onClick={handleAddToCart} className={styles.addButton}>
          Добавить в корзину
        </button>
        {cartItem && (
          <span className={styles.quantity}>
            {cartItem.quantity}
          </span>
        )}
      </div>
    </div>
  );
};

export default ProductCard;
