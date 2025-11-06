import React from "react";
import { Provider } from "react-redux";
import { store } from "./store";
import Header from "./components/Header";
import ProductCatalog from "./components/ProductCatalog";
import Cart from "./components/Cart";
import styles from "./styles/App.module.css";

const App: React.FC = () => {
  return (
    <Provider store={store}>
      <div className={styles.app}>
        <Header />
        <main className={styles.main}>
          <div className={styles.container}>
            <div className={styles.content}>
              <ProductCatalog />
              <Cart />
            </div>
          </div>
        </main>
      </div>
    </Provider>
  );
};

export default App;
