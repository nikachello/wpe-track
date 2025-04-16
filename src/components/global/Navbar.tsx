import React from "react";
import Logo from "./Logo";
import { ThemeToggle } from "./ThemeToggle";
import { getOptionalUser } from "@/utils/auth-utils";
import Link from "next/link";
import { auth } from "@/utils/auth";
import { headers } from "next/headers";
import { Button } from "../ui/button";
import { redirect } from "next/navigation";
import { User, UserType } from "@prisma/client";
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
import { Menu } from "lucide-react";

type NavItem = {
  href: string;
  label: string;
};

type SessionUser = User &
  User & {
    userType: "ADMIN" | "USER";
  };

interface AuthButtonsProps {
  user: SessionUser | null;
}

// Navigation links organized by user type
const NAV_LINKS = {
  [UserType.DISPATCHER]: [
    { href: "/drivers-tracking", label: "თრექინგი" },
    { href: "/bol-generator", label: "BOL გენერატორი" },
  ],
  [UserType.ADMIN]: [
    { href: "/drivers-tracking", label: "თრექინგი" },
    { href: "/admin/companies", label: "კომპანიები" },
    { href: "/bol-generator", label: "BOL გენერატორი" },
  ],
};

// Sign out form component to avoid duplication
const SignOutForm = () => {
  return (
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
  );
};

interface NavLinksProps {
  links: NavItem[];
  className?: string;
}

// Navigation links component to avoid duplication
const NavLinks = ({ links, className = "" }: NavLinksProps) => {
  return (
    <NavigationMenu>
      <NavigationMenuList className={className}>
        {links.map((navItem) => (
          <NavigationMenuItem key={navItem.href}>
            <Link href={navItem.href} legacyBehavior passHref>
              <NavigationMenuLink
                className={`${navigationMenuTriggerStyle()} text-sm`}
              >
                {navItem.label}
              </NavigationMenuLink>
            </Link>
          </NavigationMenuItem>
        ))}
      </NavigationMenuList>
    </NavigationMenu>
  );
};

// Auth buttons component to avoid duplication
const AuthButtons = ({ user }: AuthButtonsProps) => {
  return user ? (
    <div className="flex items-center gap-4">
      <SignOutForm />
    </div>
  ) : (
    <Link href="/login" className="btn btn-primary">
      შესვლა
    </Link>
  );
};

const Navbar = async () => {
  const user = await getOptionalUser();
  const navLinks = user?.userType ? NAV_LINKS[user.userType] || [] : [];

  return (
    <div>
      <nav className="flex items-center justify-between py-5 text-sm">
        <div className="flex flex-row gap-2">
          <Logo />
        </div>

        {/* Mobile Navigation */}
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
                  <NavLinks
                    links={navLinks}
                    className="flex flex-col text-xs"
                  />
                </div>
                <div className="mt-auto flex flex-row gap-4">
                  <ThemeToggle />
                  <AuthButtons user={user} />
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>

        {/* Desktop Navigation */}
        <div className="hidden lg:flex items-center gap-5 text-xs mb-4">
          <NavLinks links={navLinks} />
          <ThemeToggle />
          <AuthButtons user={user} />
        </div>
      </nav>
    </div>
  );
};

export default Navbar;
