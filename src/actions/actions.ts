"use server";

import { prisma } from "@/utils/db";

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

  if (result) {
    try {
      const response = await fetch(`http://localhost:3000/api/pusher`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ driverId, companyId }),
      });

      if (!response.ok) {
        throw new Error(`Error from Pusher API: ${response.statusText}`);
      }

      // or return a success message or result if needed
    } catch (error) {
      console.error("Error during fetch to /api/pusher:", error);
      throw new Error("Error triggering Pusher event");
    }
  }
};
