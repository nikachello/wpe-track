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
