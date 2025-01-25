import { SidebarTrigger } from "./ui/sidebar";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Separator } from "@/components/ui/separator";
import { useAppSelector } from "@/hooks/redux.hook";
import AvatarComp from "./AvatarComp";
import ThemeChanger from "./ThemeChanger";
import { NavLink, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";

interface HeaderProps {}

const Header: React.FC<HeaderProps> = () => {
  const theme = useAppSelector((s) => s.Theme.value);
  const user = useAppSelector((s) => s.User.user);
  let [paths, setPaths] = useState<string[]>([]);
  const loc = useLocation();
  useEffect(() => {
    const pathArray = loc.pathname.split("/").join(" ").trim().split(" ");
    setPaths(pathArray);
  }, [loc]);

  return (
    <header
      className={`${
        theme == "dark" ? "bg-zinc-900" : "bg-slate-50"
      } flex h-[50px] shrink-0 items-center gap-2 border-b px-4 sticky top-0 z-50`}
    >
      <SidebarTrigger className="-ml-1" />
      <Separator orientation="vertical" className="mr-2 h-4" />
      <Breadcrumb>
        <BreadcrumbList>
          {paths.map((e, i) => {
            return (
              <>
                <BreadcrumbItem key={e} className="hidden md:block">
                  <BreadcrumbLink>
                    {i == paths.length - 1 ? (
                      <BreadcrumbPage className="flex justify-between w-full">
                        <div>{e.slice(0,1).toLocaleUpperCase()+e.slice(1)}</div>
                      </BreadcrumbPage>
                    ) : (
                      <NavLink to={"/" + paths.slice(0, i + 1).join("/")}>
                        {e.slice(0,1).toLocaleUpperCase()+e.slice(1)}
                      </NavLink>
                    )}
                  </BreadcrumbLink>
                </BreadcrumbItem>
                {i < paths.length - 1 && (
                  <BreadcrumbSeparator key={i} className="hidden md:block" />
                )}
              </>
            );
          })}
        </BreadcrumbList>
      </Breadcrumb>
      <div className="ml-auto flex gap-3 items-center">
        <AvatarComp
          src={user?.avatar}
          alt={user?.fname + " " + user?.lname}
          className="cursor-pointer"
        />
        <ThemeChanger />
      </div>
    </header>
  );
};

export default Header;
