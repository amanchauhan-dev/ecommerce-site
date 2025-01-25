import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import { Provider } from "react-redux";
import store from "./store/reduxStore.ts";
import { RouterProvider } from "react-router-dom";
import router from "./routes.tsx";
import { Toaster } from "react-hot-toast";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <Provider store={store}>
      <RouterProvider router={router} />
      <Toaster toastOptions={{ duration: 3000 }} />
    </Provider>
  </StrictMode>
);
