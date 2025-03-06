"use server";

import { prisma } from "@/utils/db";
import { User } from "@prisma/client";

export const getDrivers = async () => {
  return await prisma.driver.findMany({
    include: {
      companies: true,
    },
  });
};

export const getCompanies = async () => {
  return await prisma.company.findMany({
    include: {
      drivers: true,
    },
  });
};

export const removeDriverFromCompany = async (
  companyId: string,
  spot: number
) => {
  if (typeof spot !== "number" || !companyId) {
    throw new Error("Invalid spot or companyId");
  }

  await prisma.driversOnCompany.deleteMany({
    where: {
      companyId,
      spot,
    },
  });

  return;
};

export const assignDriverToCompany = async (
  driverId: string,
  companyId: string,
  spot: number
) => {
  if (!driverId || !companyId || typeof spot !== "number") {
    throw new Error("Invalid driverId, companyId, or spot");
  }

  // First remove any existing driver from this spot
  await prisma.driversOnCompany.deleteMany({
    where: {
      companyId,
      spot,
    },
  });

  // Then assign the new driver
  const result = await prisma.driversOnCompany.create({
    data: {
      driverId,
      companyId,
      spot,
    },
  });

  return result;
};

export const createDispatcherFromUser = async (user: User) => {
  if (!user.id) {
    throw new Error("No userId");
  }

  const dispatcher = await prisma.dispatcher.create({
    data: {
      name: user.name!,
      userId: user.id,
    },
  });

  return dispatcher;
};
