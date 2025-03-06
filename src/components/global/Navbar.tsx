import React from "react";
import Logo from "./Logo";
import { ThemeToggle } from "./ThemeToggle";
import { getOptionalUser } from "@/utils/auth-utils";
import Link from "next/link";
import { auth } from "@/utils/auth";
import { headers } from "next/headers";
import { Button } from "../ui/button";
import { redirect } from "next/navigation";
import { UserType } from "@prisma/client";
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";

import {
  Sheet,
  SheetContent,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Separator } from "../ui/separator";
import { Menu } from "lucide-react";

const NavLinks = {
  dispatcher: [
    { href: "/mydrivers", label: "მძღოლები" },
    { href: "/myloads", label: "ტვირთები" },
    { href: "/myanalytics", label: "სტატისტიკა" },
  ],
  admin: [
    { href: "/admin/drivers", label: "მძღოლები" },
    { href: "/admin/dispatchers", label: "დისპეტჩერები" },
    { href: "/admin/statistics", label: "სტატისტიკა" },
    { href: "/admin/companies", label: "კომპანიები" },
  ],
};

const Navbar = async () => {
  const user = await getOptionalUser();

  const navLinks =
    user?.userType === UserType.ADMIN
      ? NavLinks.admin
      : user?.userType === UserType.DISPATCHER
      ? NavLinks.dispatcher
      : [];

  return (
    <div>
      <nav className="flex items-center justify-between py-5">
        <div className="flex flex-row gap-2">
          <Logo />
        </div>

        <div className="lg:hidden">
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="outline">
                <Menu />
              </Button>
            </SheetTrigger>
            <SheetContent className="w-fit h-full">
              <div className="flex flex-col h-full items-center">
                <div className="flex flex-col space-y-4 items-center justify-center">
                  <SheetTitle className="mt-4">
                    გამარჯობა, <span className="font-bold">{user?.name}</span>
                  </SheetTitle>

                  <NavigationMenu>
                    <NavigationMenuList className="flex flex-col">
                      {navLinks.map((navItem) => (
                        <NavigationMenuItem key={navItem.href}>
                          <Link href={navItem.href} legacyBehavior passHref>
                            <NavigationMenuLink
                              className={navigationMenuTriggerStyle()}
                            >
                              {navItem.label}
                            </NavigationMenuLink>
                          </Link>
                        </NavigationMenuItem>
                      ))}
                    </NavigationMenuList>
                  </NavigationMenu>
                </div>
                <div className="mt-auto flex flex-row gap-4">
                  <ThemeToggle />
                  {user ? (
                    <div className="flex items-center gap-4">
                      <form
                        action={async () => {
                          "use server";
                          await auth.api.signOut({
                            headers: await headers(),
                          });
                          redirect("/login");
                        }}
                      >
                        <Button type="submit" variant="destructive">
                          გასვლა
                        </Button>
                      </form>
                    </div>
                  ) : (
                    <Link href="/login" className="btn btn-primary">
                      შესვლა
                    </Link>
                  )}
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>

        <div className="hidden lg:flex items-center gap-5">
          <NavigationMenu>
            <NavigationMenuList>
              {navLinks.map((navItem) => (
                <NavigationMenuItem key={navItem.href}>
                  <Link href={navItem.href} legacyBehavior passHref>
                    <NavigationMenuLink
                      className={navigationMenuTriggerStyle()}
                    >
                      {navItem.label}
                    </NavigationMenuLink>
                  </Link>
                </NavigationMenuItem>
              ))}
            </NavigationMenuList>
          </NavigationMenu>
          <ThemeToggle />
          {user ? (
            <div className="flex items-center gap-4">
              <form
                action={async () => {
                  "use server";
                  await auth.api.signOut({
                    headers: await headers(),
                  });
                  redirect("/login");
                }}
              >
                <Button type="submit" variant="destructive">
                  გასვლა
                </Button>
              </form>
            </div>
          ) : (
            <Link href="/login" className="btn btn-primary">
              შესვლა
            </Link>
          )}
        </div>
      </nav>
    </div>
  );
};

export default Navbar;
