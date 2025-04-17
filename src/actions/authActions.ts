"use server";
import { auth } from "@/utils/auth";
import { prisma } from "@/utils/db";
import { headers } from "next/headers";

export async function getAuthSession() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    throw new Error("საჭიროა ავტორიზაცია"); // "Authentication required"
  }

  return session;
}

export async function getAuthenticatedDispatcher() {
  const session = await getAuthSession();
  const userId = session.user.id;

  // Find the dispatcher linked to the user
  const dispatcher = await prisma.dispatcher.findUnique({
    where: { userId },
  });

  if (!dispatcher) {
    throw new Error("დისპეჩერი არ იძებნება");
  }

  return { dispatcher, session };
}
