"use server";

import { prisma } from "@/utils/db";
import { User } from "@prisma/client";

export const createDispatcherFromUser = async (user: User) => {
  if (!user.id) {
    throw new Error("No userId");
  }

  return prisma.dispatcher.create({
    data: {
      name: user.name!,
      userId: user.id,
      email: user.email,
    },
  });
};
