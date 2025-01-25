import { createBrowserRouter } from "react-router-dom";
import LoginPage from "./pages/LoginPage";
import MainLayout from "./layouts/MainLayout";
import AddUserPage from "./pages/users/AddUserPage";
import UsersListPage from "./pages/users/UsersListPage";
import UserInfoPage from "./pages/users/UserInfoPage";
import OrdersListPage from "./pages/orders/OrdersListPage";
import OrderInfoPage from "./pages/orders/OrderInfoPage";
import DashboardPage from "./pages/account/DashboardPage";
import AnalysisPage from "./pages/account/AnalysisPage";
import ListCategoryPage from "./pages/categories/ListCategoryPage";
import AddCategoryPage from "./pages/categories/AddCategoryPage";
import ItemsListPage from "./pages/Items/ItemsList";
import AddItemPage from "./pages/Items/AddItemPage";
import ItemInfoPage from "./pages/Items/ItemInfoPage";
import Profile from "./pages/profile/profile";
import EmailVerificationPage from "./pages/auth/EmailVerificationPage";

const router = createBrowserRouter([
  {
    path: "email-verify",
    element: <EmailVerificationPage />,
  },
  {
    path: "login",
    element: <LoginPage />,
  },
  {
    path: "/",
    element: <MainLayout />,
    children: [
      {
        path: "",
        element: <DashboardPage />,
      },
      { path: "profile", element: <Profile /> },
      // account
      {
        path: "accounts",
        children: [
          {
            path: "dashboard",
            element: <DashboardPage />,
          },
          {
            path: "analysis",
            element: <AnalysisPage />,
          },
        ],
      },
      // users
      {
        path: "users",
        children: [
          {
            path: "",
            element: <UsersListPage />,
          },
          {
            path: "users-list",
            element: <UsersListPage />,
          },
          {
            path: "user-details/:id?",
            element: <UserInfoPage />,
          },
          {
            path: "add-user",
            element: <AddUserPage />,
          },
        ],
      },
      // orders
      {
        path: "orders",
        children: [
          {
            path: "",
            element: <OrdersListPage />,
          },
          {
            path: "orders-list",
            element: <OrdersListPage />,
          },
          {
            path: "order-details",
            element: <OrderInfoPage />,
          },
        ],
      },
      // categories
      {
        path: "categories",
        children: [
          {
            path: "",
            element: <ListCategoryPage />,
          },
          {
            path: "categories-list",
            element: <ListCategoryPage />,
          },
          {
            path: "add-category",
            element: <AddCategoryPage />,
          },
        ],
      },

      // items
      {
        path: "items",
        children: [
          {
            path: "",
            element: <ItemsListPage />,
          },
          {
            path: "items-list",
            element: <ItemsListPage />,
          },
          {
            path: "add-item",
            element: <AddItemPage />,
          },
          {
            path: "item/:id?",
            element: <ItemInfoPage />,
          },
        ],
      },
    ],
  },
]);

export default router;
