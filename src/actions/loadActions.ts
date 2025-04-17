"use server";
import { prisma } from "@/utils/db";
import { getAuthSession } from "./authActions";

export const getLoads = async () => {
  await getAuthSession();

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

export const addLoad = async () => {
  await getAuthSession();
  // Implementation needed here
};

export const getLoadsByDispatcherId = async (id: string) => {
  return prisma.load.findMany({
    where: {
      dispatcherId: id,
    },
    include: {
      driver: true,
      company: true,
    },
  });
};
