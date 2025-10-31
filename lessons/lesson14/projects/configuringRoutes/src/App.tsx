import { Provider } from 'react-redux';
import { store } from './store';
import Header from './components/Header';
import ProductCatalog from './components/ProductCatalog';
import Cart from './components/Cart';
import styles from './styles/App.module.css';

const App = () => {
  return (
    <Provider store={store}>
      <div className={styles.app}>
        <Header />
        <main className={styles.main}>
          <ProductCatalog />
          <Cart />
        </main>
      </div>
    </Provider>
  );
};

export default App;
