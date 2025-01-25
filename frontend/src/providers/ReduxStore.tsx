'use client'
import { store } from "@/store/store";
import { Provider } from "react-redux";

interface ReduxStoreProps {
  children?: React.ReactNode;
}

const ReduxStore: React.FC<ReduxStoreProps> = ({ children }) => {
  return <Provider store={store}>{children}</Provider>;
};

export default ReduxStore;
