import { headers } from "next/headers";
import { auth } from "./auth";
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
