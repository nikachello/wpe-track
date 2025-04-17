"use server";
import { prisma } from "@/utils/db";
import { getAuthenticatedDispatcher, getAuthSession } from "./authActions";
import {
  validateCompanyId,
  validateSpot,
  validateSuperId,
} from "./validationActions";
import { UserType } from "@prisma/client";

export const getAllAssignableDrivers = async () => {
  await getAuthSession();
  return prisma.assignableDrivers.findMany();
};

export const assignDriverToCompany = async (
  driverId: string,
  companyId: string,
  spot: number,
  superId: string
) => {
  const { dispatcher, session } = await getAuthenticatedDispatcher();

  // Validate inputs
  validateCompanyId(companyId);
  validateSpot(spot);
  validateSuperId(superId);

  // Find the current assignment for this spot
  const existingSlot = await prisma.driversOnCompany.findFirst({
    where: { companyId, spot },
  });

  if (existingSlot) {
    // Check permissions if slot is already occupied
    const hasPermission =
      existingSlot.dispatcherId === dispatcher.id ||
      session.user.userType === UserType.ADMIN;

    if (!hasPermission) {
      throw new Error("არ ხართ მენეჯერი ან არ გაქვთ ამის უფლება");
    }

    // Remove the existing driver before assigning the new one
    await prisma.driversOnCompany.deleteMany({
      where: { companyId, spot },
    });
  }

  // Assign the new driver
  return prisma.driversOnCompany.create({
    data: {
      driverId,
      companyId,
      spot,
      dispatcherId: dispatcher.id,
      superId,
    },
  });
};

export const removeDriverFromCompany = async (
  companyId: string,
  spot: number
) => {
  const { dispatcher, session } = await getAuthenticatedDispatcher();
  const dispatcherId = dispatcher.id;

  // Validate inputs
  validateCompanyId(companyId);
  validateSpot(spot);

  // Find the driver's assigned spot
  const slot = await prisma.driversOnCompany.findFirst({
    where: { companyId, spot },
  });

  if (!slot) {
    throw new Error("არასწორი სლოტი");
  }

  // Permission check: ensure the dispatcher has the right to remove the driver
  if (
    slot.dispatcherId !== dispatcherId &&
    session.user.userType !== UserType.ADMIN
  ) {
    throw new Error("არ ხართ მენეჯერი ან არ გაქვთ ამის უფლება");
  }

  // Remove driver from the company
  await prisma.driversOnCompany.deleteMany({
    where: { companyId, spot },
  });
};

export const getDrivers = async () => {
  return prisma.driver.findMany({
    include: {
      companies: true,
    },
  });
};
