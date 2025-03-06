import { headers } from "next/headers";
import { auth } from "./auth";
import { redirect } from "next/navigation";
import { User } from "@prisma/client";

export const getUser = async () => {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    throw new Error("No session");
  }

  return session.user as User;
};

// wasashleli
