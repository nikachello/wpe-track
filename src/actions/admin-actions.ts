"use server";
import { auth } from "@/utils/auth";
import { prisma } from "@/utils/db";
import { realCompanySchema } from "@/utils/zodSchemas";
import { UserType } from "@prisma/client";
import { headers } from "next/headers";
import { z } from "zod";

export const getRealCompanies = async () => {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    throw new Error("საჭიროა ავტორიზაცია");
  }

  if (session.user.userType !== UserType.ADMIN) {
    throw new Error("უნდა იყოთ ადმინისტრატორი");
  }

  return await prisma.realCompany.findMany();
};

export const addRealCompany = async (
  data: z.infer<typeof realCompanySchema>
) => {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    throw new Error("საჭიროა ავტორიზაცია");
  }

  if (session.user.userType !== UserType.ADMIN) {
    throw new Error("უნდა იყოთ ადმინისტრატორი");
  }

  const { name, phone, email } = data;
  if (!name || !phone || !email) {
    throw new Error("არ არის სრული ინფორმაცია");
  }

  const existingCompany = await prisma.realCompany.findFirst({
    where: {
      OR: [{ name: data.name }, { email: data.email }, { phone: data.phone }],
    },
  });

  if (existingCompany) {
    throw new Error(
      "ასეთი კომპანია იგივე სახელით, ნომრით ან ელ-ფოსტით უკვე არსებობს"
    );
  }

  return await prisma.realCompany.create({
    data,
  });
};

export const deleteRealCompany = async (realCompanyId: string) => {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    throw new Error("საჭიროა ავტორიზაცია");
  }

  if (session.user.userType !== UserType.ADMIN) {
    throw new Error("უნდა იყოთ ადმინისტრატორი");
  }

  if (!realCompanyId) {
    throw new Error("არ არის კომპანიის ID");
  }

  const realCompany = await prisma.realCompany.findUnique({
    where: {
      id: realCompanyId,
    },
  });

  if (!realCompany) {
    throw new Error("ასეთი კომპანია არ მოიძებნა");
  }

  await prisma.realCompany.delete({
    where: {
      id: realCompany.id, // Using the actual found company's ID
    },
  });

  return { message: "კომპანია წარმატებით წაიშალა" };
};

export const editRealCompany = async (
  realCompanyId: string,
  data: z.infer<typeof realCompanySchema>
) => {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    throw new Error("საჭიროა ავტორიზაცია");
  }

  if (session.user.userType !== UserType.ADMIN) {
    throw new Error("უნდა იყოთ ადმინისტრატორი");
  }

  if (!realCompanyId) {
    throw new Error("არ არის კომპანიის ID");
  }

  const existingCompany = await prisma.realCompany.findUnique({
    where: {
      id: realCompanyId,
    },
  });

  if (!existingCompany) {
    throw new Error("ასეთი კომპანია არ მოიძებნა");
  }

  const { name, phone, email } = data;
  if (!name || !phone || !email) {
    throw new Error("არ არის სრული ინფორმაცია");
  }

  // Check if another company exists with the same name, email, or phone
  const duplicateCompany = await prisma.realCompany.findFirst({
    where: {
      id: { not: realCompanyId }, // Exclude the current company from the check
      OR: [{ name }, { email }, { phone }],
    },
  });

  if (duplicateCompany) {
    throw new Error("ასეთი მონაცემები უკვე არსებობს სხვა კომპანიაში");
  }

  return await prisma.realCompany.update({
    where: { id: realCompanyId },
    data,
  });
};
