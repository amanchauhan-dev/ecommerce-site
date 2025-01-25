"use client";
import { ProgressBarLink } from "@/providers/ProgressBar";
import { Button } from "./ui/button";
import {
  ChevronDown,
  Heart,
  Laptop,
  LogOut,
  Menu,
  Moon,
  ShoppingBasket,
  Sun,
  X,
} from "lucide-react";
import {
  Menubar,
  MenubarCheckboxItem,
  MenubarContent,
  MenubarGroup,
  MenubarItem,
  MenubarMenu,
  MenubarRadioGroup,
  MenubarRadioItem,
  MenubarSeparator,
  MenubarShortcut,
  MenubarTrigger,
} from "./ui/menubar";
import Image from "next/image";
import { usePrefersTheme } from "react-haiku";
import { fetchTheme } from "@/functions/FetchCookie";
import { ComponentProps, useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "@/hooks/redux-hooks";
import { setTheme } from "@/store/slices/themeSlice";
import { ScrollArea } from "./ui/scroll-area";

interface HeaderProps {}

const Header: React.FC<HeaderProps> = () => {
  const [openMenu, setOpenMenu] = useState<boolean>(false);
  const systemTheme = usePrefersTheme("dark");
  const theme = fetchTheme();
  const dispatch = useAppDispatch();

  const themeSelected = useAppSelector((s) => s.theme.value);
  useEffect(() => {
    if (theme) {
      dispatch(setTheme(theme));
    } else {
      setTheme(systemTheme);
    }
  }, []);

  const changeTheme = (value: "dark" | "light" | "system") => {
    if (value === "system") {
      dispatch(setTheme(systemTheme));
    } else {
      dispatch(setTheme(value));
    }
  };

  return (
    <section>
      <Menubar className="flex h-[54px] py-0 sm:px-10 lg:px-16 justify-between">
        {/* Logo */}
        <MenubarGroup className="pl-2">
          <ProgressBarLink href={"/"} className="">
            <LogoName />
          </ProgressBarLink>
        </MenubarGroup>
        {/* Navigation */}
        <MenubarGroup className="flex items-center gap-3 max-sm:hidden">
          {/* Cart */}
          <MenubarMenu>
            <ProgressBarLink href={"cart"}>
              <Button
                variant={"ghost"}
                className="bg-green-600 hover:bg-green-800 text-white hover:text-white"
                size={"icon"}
              >
                <ShoppingBasket size={24} />
              </Button>
            </ProgressBarLink>
          </MenubarMenu>
          {/* wish list */}
          <MenubarMenu>
            <ProgressBarLink href={"wish-list"}>
              <Button
                variant={"ghost"}
                size={"icon"}
                className="bg-pink-600 hover:bg-pink-800 text-white hover:text-white"
              >
                <Heart size={24} />
              </Button>
            </ProgressBarLink>
          </MenubarMenu>
          {/* profile */}
          <MenubarMenu>
            <MenubarTrigger>
              Profile <ChevronDown size={18} className="ml-1" />
            </MenubarTrigger>
            <MenubarContent>
              <MenubarCheckboxItem>Profile</MenubarCheckboxItem>
              <MenubarCheckboxItem>Cart</MenubarCheckboxItem>
              <MenubarCheckboxItem>Wish List</MenubarCheckboxItem>
              <MenubarCheckboxItem>Orders</MenubarCheckboxItem>
              <MenubarSeparator />
              <MenubarItem inset>Addresses</MenubarItem>
              <MenubarItem disabled inset>
                Issues <MenubarShortcut>⇧⌘R</MenubarShortcut>
              </MenubarItem>
              <MenubarSeparator />
              <MenubarItem inset>Settings</MenubarItem>
              <MenubarItem inset>Help ?</MenubarItem>
              <MenubarItem inset>Terms & Privacy</MenubarItem>
              <MenubarItem inset>Accounts</MenubarItem>
              <MenubarSeparator />
              <MenubarItem inset>
                Logout <LogOut size={13} className="ml-2" />
              </MenubarItem>
            </MenubarContent>
          </MenubarMenu>
          {/* systemTheme */}
          <MenubarMenu>
            <MenubarTrigger>
              {themeSelected == "dark" ? <Moon size={17} /> : <Sun size={17} />}
            </MenubarTrigger>
            <MenubarContent className="px-0">
              <MenubarRadioGroup value="systemTheme">
                <MenubarRadioItem
                  value="light"
                  className="px-3 cursor-pointer"
                  onClick={() => changeTheme("light")}
                >
                  <Sun size={18} className="mr-2" /> Light
                </MenubarRadioItem>
                <MenubarRadioItem
                  value="dark"
                  className="px-3 cursor-pointer"
                  onClick={() => changeTheme("dark")}
                >
                  <Moon size={18} className="mr-2" /> Dark
                </MenubarRadioItem>
                <MenubarRadioItem
                  value="system"
                  className="px-3 cursor-pointer"
                  onClick={() => changeTheme("system")}
                >
                  <Laptop size={18} className="mr-2" /> System
                </MenubarRadioItem>
              </MenubarRadioGroup>
            </MenubarContent>
          </MenubarMenu>
        </MenubarGroup>
        {/* Menu bar */}
        <MenubarGroup className="sm:hidden">
          <MenubarMenu>
            <Button
              size={"icon"}
              variant={"ghost"}
              onClick={() => setOpenMenu((e) => !e)}
            >
              <Menu size={24} className="!size-6" />
            </Button>
            <MenubarContent>hello</MenubarContent>
          </MenubarMenu>
        </MenubarGroup>
      </Menubar>
      {/* Mobile Menu bar Content */}
      <>
        <div
          className={`sm:hidden absolute transition-all w-[100vw] h-[100vh] left-0 top-0 !bg-zinc-200/55 dark:!bg-zinc-500/55 !z-[990] ${
            !openMenu && "hidden"
          }`}
        ></div>
        <div
          className={`absolute flex sm:hidden top-0 overflow-hidden transition-all right-0 ${
            openMenu ? "w-[100vw]" : "w-[0]"
          } `}
        >
          <div
            className="h-[100vh] flex-auto !z-[999]"
            onClick={() => setOpenMenu(false)}
          ></div>
          <div className="h-[100vh] w-[250px] max-[251]:w-[100vw] bg-background !z-[999] flex flex-col justify-between border">
            <div>
              <div className="flex justify-end pr-2 pt-2">
                <X onClick={() => setOpenMenu(false)} />
              </div>
              <div className="p-2 pb-3">
                <ProgressBarLink href={"/"} className="">
                  <LogoName />
                </ProgressBarLink>
              </div>
            </div>
            <ScrollArea className="h-full w-full">
              <div className="p-2">
                {[1, 2, 3, 4, 5].map((e) => {
                  return (
                    <div key={e} className="bg-green-500 p-3 w-full mb-2">
                      {e}
                    </div>
                  );
                })}
              </div>
            </ScrollArea>
          </div>
        </div>
      </>
    </section>
  );
};

interface LogoNameProps {}

export const LogoName: React.FC<LogoNameProps> = () => {
  const theme = useAppSelector((s) => s.theme.value);
  return (
    <Image
      src={theme == "dark" ? "/Bazzar vibe (1).svg" : "/Bazzar vibe.svg"}
      className="bg-transparent"
      height={44}
      width={100}
      alt="logo"
    />
  );
};

export default Header;
