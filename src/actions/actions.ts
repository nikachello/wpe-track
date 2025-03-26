"use server";

import { auth } from "@/utils/auth";
import { prisma } from "@/utils/db";
import { User, UserType } from "@prisma/client";
import { headers } from "next/headers";

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
      possibleDrivers: true,
    },
  });
};

export const removeDriverFromCompany = async (
  companyId: string,
  spot: number
) => {
  // Get authentication session
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    throw new Error("საჭიროა ავტორიზაცია"); // "Authentication required"
  }

  const userId = session.user.id;

  // Find the dispatcher linked to the user
  const dispatcher = await prisma.dispatcher.findUnique({
    where: { userId },
  });

  if (!dispatcher) {
    throw new Error("დისპეჩერი არ იძებნება");
  }

  const dispatcherId = dispatcher.id;

  // Validate inputs
  if (!companyId || typeof companyId !== "string" || companyId.trim() === "") {
    throw new Error("კომპანია არ იძებნება");
  }

  if (typeof spot !== "number" || spot < 0) {
    throw new Error("არასწორი მონაცემი");
  }

  // Find the driver's assigned spot
  const slot = await prisma.driversOnCompany.findFirst({
    where: { companyId, spot },
  });

  if (!slot) {
    throw new Error("არასწორი სლოტი");
  }

  console.log("slot dispatcher length:", slot.dispatcherId.length);
  console.log("dispatcherId length:", dispatcherId.length);

  // Permission check: ensure the dispatcher has the right to remove the driver
  if (
    slot.dispatcherId !== dispatcherId &&
    session.user.userType !== UserType.ADMIN
  ) {
    throw new Error("არ ხართ მენეჯერი ან არ გაქვთ ამის უფლება"); // "You are not the manager or lack permission"
  }

  // Remove driver from the company
  await prisma.driversOnCompany.deleteMany({
    where: { companyId, spot },
  });

  return;
};
export const assignDriverToCompany = async (
  driverId: string,
  companyId: string,
  spot: number,
  superId: string
) => {
  // Get authentication session
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    throw new Error("საჭიროა ავტორიზაცია"); // "Authentication required"
  }

  const userId = session.user.id;

  // Find the dispatcher linked to the user
  const dispatcher = await prisma.dispatcher.findUnique({
    where: { userId },
  });

  // Validate inputs
  if (!companyId || typeof companyId !== "string" || companyId.trim() === "") {
    throw new Error("კომპანია არ იძებნება");
  }

  if (typeof spot !== "number" || spot < 0) {
    throw new Error("არასწორი მონაცემი");
  }

  if (
    typeof superId !== "string" ||
    superId === null ||
    superId === undefined
  ) {
    throw new Error("შეიყვანეთ სუპერის ID");
  }

  // Find the current assignment for this spot
  const existingSlot = await prisma.driversOnCompany.findFirst({
    where: { companyId, spot },
  });

  if (existingSlot) {
    // If spot is already occupied, check permissions
    if (
      !dispatcher || // Dispatcher must exist
      (existingSlot.dispatcherId !== dispatcher.id && // Must be assigned to this dispatcher
        session.user.userType !== UserType.ADMIN) // OR must be admin
    ) {
      throw new Error("არ ხართ მენეჯერი ან არ გაქვთ ამის უფლება");
    }

    // Remove the existing driver before assigning the new one
    await prisma.driversOnCompany.deleteMany({
      where: { companyId, spot },
    });
  }

  // Assign the new driver (no permission check needed if spot was empty)
  const result = await prisma.driversOnCompany.create({
    data: {
      driverId,
      companyId,
      spot,
      dispatcherId: dispatcher!.id, // Only set dispatcherId if available
      superId: superId,
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

export const getLoads = async () => {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    throw new Error("საჭიროა ავტორიზაცია");
  }

  try {
    const loads = await prisma.load.findMany({
      include: {
        dispatcher: true,
        driver: true,
        company: true,
      },
    });

    // Transform the loads to match the Load type
    return loads.map((load) => ({
      ...load,
      dispatcher: load.dispatcher
        ? {
            id: load.dispatcher.id,
            name: load.dispatcher.name,
          }
        : { id: "", name: "Unknown" },
      driver: load.driver
        ? {
            id: load.driver.id,
            name: load.driver.name,
            vehicle: load.driver.vehicle || "",
            phoneNumber: load.driver.phoneNumber || "",
          }
        : { id: "", name: "Unassigned", vehicle: "", phoneNumber: "" },
      company: load.company
        ? {
            id: load.company.id,
            name: load.company.name,
            phone: load.company.phone || "",
            email: load.company.email || "",
          }
        : undefined,
      price: load.price.toString(), // Ensure price is a string
    }));
  } catch (error) {
    console.error("Error fetching loads:", error);
    throw new Error("Error fetching loads");
  }
};

export const getRealCompanies = async () => {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    throw new Error("საჭიროა ავტორიზაცია");
  }

  return await prisma.realCompany.findMany();
};

export const addLoad = async () => {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    throw new Error("საჭიროა ავტორიზაცია");
  }
};

export const getAllAssignableDrivers = async () => {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    throw new Error("საჭიროა ავტორიზაცია");
  }

  const relations = await prisma.assignableDrivers.findMany();

  return relations;
};
