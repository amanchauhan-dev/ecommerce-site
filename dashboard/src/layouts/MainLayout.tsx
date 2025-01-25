import { useAppSelector } from "@/hooks/redux.hook";
import Header from "../components/Header";
import SideBarComp from "../components/SideBarComp";
import { SidebarInset, SidebarProvider } from "../components/ui/sidebar";
import { Outlet } from "react-router-dom";
import AuthProvider from "@/providers/AuthProvider";

const RootLayout: React.FC = () => {
  const theme = useAppSelector((s) => s.Theme.value);

  return (
    <AuthProvider>
      <div className={`${theme}`}>
        <SidebarProvider>
          <SideBarComp />
          <SidebarInset>
            <Header />
            <Outlet />
          </SidebarInset>
        </SidebarProvider>
      </div>
    </AuthProvider>
  );
};

export default RootLayout;
