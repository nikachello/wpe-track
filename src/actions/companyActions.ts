"use server";
import { prisma } from "@/utils/db";
import { getAuthSession } from "./authActions";

export const getRealCompanies = async () => {
  await getAuthSession();
  return prisma.realCompany.findMany();
};

export const getCompanies = async () => {
  return prisma.company.findMany({
    include: {
      drivers: true,
      possibleDrivers: true,
    },
  });
};
