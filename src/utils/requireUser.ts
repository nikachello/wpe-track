import { headers } from "next/headers";
import { auth } from "./auth";
import { redirect } from "next/navigation";
import { User } from "@prisma/client";

export const requireUser = async (redirectUrl?: string) => {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session && redirectUrl) {
    redirect(redirectUrl);
  } else if (!session) {
    return null;
  }

  return session.user as User;
};

// wasashleli
