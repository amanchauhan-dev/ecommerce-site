import { ChevronRight } from "lucide-react";
import logo from "/logo-icon.png";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
} from "@/components/ui/sidebar";
import { Button } from "./ui/button";
import { NavLink, useNavigate } from "react-router-dom";
import { useAppSelector } from "@/hooks/redux.hook";
import { logout } from "@/functions/Logout";
import BackgroundPlate from "./BackgroundPlate";

const data = {
  navMain: [
    {
      title: "Accounts Detail",
      url: "accounts",
      items: [
        {
          title: "Dashboard",
          url: "/Dashboard",
          role: "",
        },
        {
          title: "Analysis",
          url: "/analysis",
        },
      ],
    },
    {
      title: "Orders Information",
      url: "orders",
      items: [
        {
          title: "Orders List",
          url: "/orders-list",
        },
        {
          title: "Order details",
          url: "/order-details",
        },
      ],
    },
    {
      title: "Inventory Information",
      url: "items",
      items: [
        {
          title: "Items list",
          url: "/items-list",
        },
        {
          title: "Item details",
          url: "/item",
        },
        {
          title: "Add Item",
          url: "/add-item",
        },
      ],
    },
    {
      title: "Users Information",
      url: "users",
      items: [
        {
          title: "Users list",
          url: "/users-list",
        },
        {
          title: "User Details",
          url: "/user-details",
        },
        {
          title: "Add User",
          url: "/add-user",
          role: "admin",
        },
      ],
    },
    {
      title: "Category Information",
      url: "categories",
      items: [
        {
          title: "Category list",
          url: "/categories-list",
        },
        {
          title: "Add Category",
          url: "/add-category",
        },
      ],
    },
  ],
};

export default function SideBarComp() {
  const role = useAppSelector((s) => s.User.role);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout(navigate);
  };

  return (
    <Sidebar>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <div className="w-full  flex  gap-2 px-2 py-2 items-center ">
              <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
                <img src={logo} alt="" />
              </div>
              <div className="flex flex-col gap-0.5 leading-none">
                <span className="font-semibold italic">Bazzar Vibe</span>
              </div>
            </div>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent className="gap-0">
        {/* We create a collapsible SidebarGroup for each parent. */}
        {data.navMain.map((item) => (
          <Collapsible
            key={item.title}
            title={item.title}
            defaultOpen
            className="group/collapsible"
          >
            <SidebarGroup>
              <SidebarGroupLabel
                asChild
                className="group/label text-sm text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
              >
                <CollapsibleTrigger>
                  {item.title}
                  <ChevronRight className="ml-auto transition-transform group-data-[state=open]/collapsible:rotate-90" />
                </CollapsibleTrigger>
              </SidebarGroupLabel>
              <CollapsibleContent className="pl-5">
                <SidebarGroupContent>
                  <SidebarMenu>
                    {item.items.map((i) =>
                      role != "admin" && i?.role == "admin" ? (
                        ""
                      ) : (
                        <SidebarMenuItem key={i.title}>
                          <SidebarMenuButton
                            asChild
                            // isActive={item.isActive}
                          >
                            <NavLink className="navlink" to={item.url + i.url}>
                              {i.title}
                            </NavLink>
                          </SidebarMenuButton>
                        </SidebarMenuItem>
                      )
                    )}
                  </SidebarMenu>
                </SidebarGroupContent>
              </CollapsibleContent>
            </SidebarGroup>
          </Collapsible>
        ))}
      </SidebarContent>
      <SidebarFooter>
        <Button
          onClick={handleLogout}
          variant="ghost"
          className="bg-fuchsia-600 text-white hover:bg-fuchsia-700 dark:hover:bg-fuchsia-500"
        >
          Logout
        </Button>
        <NavLink className="w-full" to="profile">
          <BackgroundPlate className="!bg-sky-600 p-1.5 text-center rounded-md text-white hover:!bg-sky-700 !dark:hover:!bg-sky-500">
            Profile
          </BackgroundPlate>
        </NavLink>
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
