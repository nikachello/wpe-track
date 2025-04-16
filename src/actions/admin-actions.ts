"use server";
import { auth } from "@/utils/auth";
import { prisma } from "@/utils/db";
import { realCompanySchema } from "@/utils/zodSchemas";
import { Prisma, UserType } from "@prisma/client";
import { headers } from "next/headers";
import { z } from "zod";

// Authentication Helper
async function requireAdminAuth() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    throw new Error("საჭიროა ავტორიზაცია");
  }

  if (session.user.userType !== UserType.ADMIN) {
    throw new Error("უნდა იყოთ ადმინისტრატორი");
  }

  return session;
}

// Company Helper Functions
async function checkDuplicateCompany(
  name: string,
  email: string,
  phone: string,
  excludeId?: string
) {
  const whereClause: any = {
    OR: [{ name }, { email }, { phone }],
  };

  if (excludeId) {
    whereClause.id = { not: excludeId };
  }

  const existingCompany = await prisma.realCompany.findFirst({
    where: whereClause,
  });

  if (existingCompany) {
    throw new Error(
      excludeId
        ? "ასეთი მონაცემები უკვე არსებობს სხვა კომპანიაში"
        : "ასეთი კომპანია იგივე სახელით, ნომრით ან ელ-ფოსტით უკვე არსებობს"
    );
  }
}

async function validateCompanyData(data: z.infer<typeof realCompanySchema>) {
  const { name, phone, email, isInsuranceCompany } = data;

  if (!name || !phone || !email || isInsuranceCompany === undefined) {
    throw new Error("არ არის სრული ინფორმაცია");
  }

  if (
    isInsuranceCompany &&
    (!data.driversAssignable || data.driversAssignable.length === 0)
  ) {
    throw new Error("აირჩიეთ დაზღვევის მძღოლები");
  }
}

// Updated manageInsuranceCompany with tx
async function manageInsuranceCompany(
  realCompanyId: string,
  name: string,
  tx: Prisma.TransactionClient,
  driversAssignable?: string[],
  shouldDelete?: boolean
) {
  const realCompany = await tx.realCompany.findFirst({
    where: { id: realCompanyId },
  });

  let company = await tx.company.findFirst({
    where: { realCompanyId },
  });

  if (shouldDelete) {
    if (company?.id) {
      await tx.driversOnCompany.deleteMany({
        where: { companyId: company.id },
      });

      await tx.assignableDrivers.deleteMany({
        where: { companyId: company.id },
      });

      await tx.company.delete({
        where: { realCompanyId },
      });
    }

    return;
  }

  if (!company) {
    company = await tx.company.create({
      data: {
        name,
        realCompanyId,
      },
    });
  }

  if (company.name !== realCompany?.name) {
    await tx.company.update({
      where: {
        id: company.id,
      },
      data: {
        name,
      },
    });
  }

  await tx.assignableDrivers.deleteMany({
    where: { companyId: company.id },
  });

  if (driversAssignable && driversAssignable.length > 0) {
    await tx.assignableDrivers.createMany({
      data: driversAssignable.map((driverId) => ({
        companyId: company.id,
        driverId,
      })),
      skipDuplicates: true,
    });
  }

  return company;
}

// Server Actions
export const getRealCompanies = async () => {
  await requireAdminAuth();
  return await prisma.realCompany.findMany();
};

export const addRealCompany = async (
  data: z.infer<typeof realCompanySchema>
) => {
  await requireAdminAuth();
  await validateCompanyData(data);

  const { name, phone, email, isInsuranceCompany, driversAssignable } = data;

  await checkDuplicateCompany(name, email, phone);

  return await prisma.$transaction(async (tx) => {
    const realCompany = await tx.realCompany.create({
      data: {
        name,
        email,
        phone,
        isInsuranceCompany,
      },
    });

    if (isInsuranceCompany) {
      await manageInsuranceCompany(
        realCompany.id,
        name,
        tx,
        driversAssignable,
        false
      );
    }

    return realCompany;
  });
};

export const editRealCompany = async (
  realCompanyId: string,
  data: z.infer<typeof realCompanySchema>
) => {
  await requireAdminAuth();

  if (!realCompanyId) {
    throw new Error("არ არის კომპანიის ID");
  }

  await validateCompanyData(data);

  const { name, phone, email, isInsuranceCompany, driversAssignable } = data;

  await checkDuplicateCompany(name, email, phone, realCompanyId);

  return await prisma.$transaction(async (tx) => {
    if (!isInsuranceCompany) {
      const company = await tx.company.findFirst({
        where: { realCompanyId },
      });

      if (company) {
        await manageInsuranceCompany(
          realCompanyId,
          name,
          tx,
          driversAssignable,
          true
        );
      }
    }

    const updatedCompany = await tx.realCompany.update({
      where: { id: realCompanyId },
      data: {
        name,
        phone,
        email,
        isInsuranceCompany,
      },
    });

    if (isInsuranceCompany) {
      await manageInsuranceCompany(
        realCompanyId,
        name,
        tx,
        driversAssignable,
        false
      );
    }

    return updatedCompany;
  });
};

export const deleteRealCompany = async (realCompanyId: string) => {
  await requireAdminAuth();

  if (!realCompanyId) {
    throw new Error("არ არის კომპანიის ID");
  }

  return await prisma.$transaction(async (tx) => {
    const realCompany = await tx.realCompany.findUnique({
      where: { id: realCompanyId },
    });

    if (!realCompany) {
      throw new Error("ასეთი კომპანია არ მოიძებნა");
    }

    const associatedCompany = await tx.company.findFirst({
      where: { realCompanyId },
    });

    if (associatedCompany) {
      await tx.driversOnCompany.deleteMany({
        where: { companyId: associatedCompany.id },
      });

      await tx.assignableDrivers.deleteMany({
        where: { companyId: associatedCompany.id },
      });

      await tx.company.delete({
        where: { id: associatedCompany.id },
      });
    }

    await tx.realCompany.delete({
      where: { id: realCompanyId },
    });

    return { message: "კომპანია წარმატებით წაიშალა" };
  });
};

export const getInsuranceDrivers = async () => {
  await requireAdminAuth();
  return await prisma.driver.findMany();
};

export const getCompanyAssignableDrivers = async (realCompanyId: string) => {
  await requireAdminAuth();

  if (!realCompanyId) {
    throw new Error("არ არის კომპანიის ID");
  }

  const company = await prisma.company.findFirst({
    where: { realCompanyId },
  });

  if (!company) {
    throw new Error("კომპანია ვერ მოიძებნა");
  }

  const assignableDrivers = await prisma.assignableDrivers.findMany({
    where: { companyId: company.id },
    include: { driver: true },
  });

  return assignableDrivers.map((ad) => ({
    value: ad.driverId,
    label: `${ad.driver.name} ${ad.driver.lastName}`,
  }));
};
