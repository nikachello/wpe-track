import { headers } from "next/headers";
import { auth } from "./auth";
import { redirect } from "next/navigation";
import { User } from "@prisma/client";

type SessionUser = User & {
  userType: "ADMIN" | "USER";
};

export async function getOptionalUser(): Promise<SessionUser | null> {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });
    return session?.user as SessionUser | null;
  } catch (error) {
    return null;
  }
}

export async function requireUser(
  options: {
    redirectTo?: string;
  } = {}
): Promise<SessionUser> {
  const { redirectTo = "/login" } = options;

  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    redirect(redirectTo);
  }

  return session.user as SessionUser;
}

export async function requireAdmin(
  options: {
    redirectTo?: string;
  } = {}
): Promise<SessionUser> {
  const user = await requireUser(options);

  if (user.userType !== "ADMIN") {
    redirect("/");
  }

  return user;
}
