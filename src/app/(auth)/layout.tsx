import { requireUser } from "@/utils/requireUser";
import { redirect } from "next/navigation";
import React from "react";

type Props = { children: React.ReactNode };

const Layout = async ({ children }: Props) => {
  const user = await requireUser();
  if (user) {
    redirect("/");
  }
  return (
    <div className=" min-h-screen w-screen flex items-center justify-center">
      {children}
    </div>
  );
};

export default Layout;
