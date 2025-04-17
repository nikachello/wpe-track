"use server";
import { prisma } from "@/utils/db";
import { getAuthSession } from "./authActions";

export const getDispatchers = async () => {
  await getAuthSession();
  return prisma.dispatcher.findMany();
};

// WIP: dispatcher.Usertype == admin ar unda gamochndes

export const getDriversForDispatchers = async () => {
  await getAuthSession();
  const drivers = await prisma.realDriver.findMany();
  return drivers;
};

export const getDispatcherById = async (id: string) => {
  const dispatcher = await prisma.dispatcher.findUnique({
    where: { id },
    include: {
      drivers: true,
    },
  });

  if (dispatcher) return dispatcher;
  return undefined;
};
