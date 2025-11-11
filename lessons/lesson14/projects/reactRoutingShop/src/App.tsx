import React, { Suspense } from "react";
import { Provider } from "react-redux";
import { store } from "./store";
import { RouterProvider } from "react-router";
import { router } from "./router";
import LoadingFallback from "./components/LoadingFallback";

const App: React.FC = () => {
  return (
    <Provider store={store}>
      <Suspense fallback={<LoadingFallback />}>
        <RouterProvider router={router} />
      </Suspense>
    </Provider>
  );
};

export default App;
