import React from "react";
import Logo from "./Logo";
import { ThemeToggle } from "./ThemeToggle";
import { requireUser } from "@/utils/requireUser";
import Link from "next/link";
import { auth } from "@/utils/auth";
import { headers } from "next/headers";
import { Button } from "../ui/button";
import { redirect } from "next/navigation";

const Navbar = async () => {
  const user = await requireUser();
  return (
    <nav className="flex items-center justify-between py-5">
      <Logo />

      {/* Desktop Navigation */}
      <div className="flex items-center gap-5">
        <ThemeToggle />
        {user ? (
          <form
            action={async () => {
              "use server";
              await auth.api.signOut({
                headers: await headers(),
              });
              redirect("/login");
            }}
          >
            <Button type="submit">გასვლა</Button>
          </form>
        ) : (
          <Link href="login">შესვლა</Link>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
