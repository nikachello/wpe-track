"use server";
import { auth } from "@/utils/auth";
import { prisma } from "@/utils/db";
import { fakeCompanySchema, realCompanySchema } from "@/utils/zodSchemas";
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

export const getFakeCompany = async () => {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    throw new Error("საჭიროა ავტორიზაცია");
  }

  if (session.user.userType !== UserType.ADMIN) {
    throw new Error("უნდა იყოთ ადმინისტრატორი");
  }

  return await prisma.fakeCompany.findFirst();
};

export const createFakeCompany = async (
  data: z.infer<typeof fakeCompanySchema>
) => {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) throw new Error("საჭიროა ავტორიზაცია");
  if (session.user.userType !== UserType.ADMIN)
    throw new Error("უნდა იყოთ ადმინისტრატორი");

  const validated = fakeCompanySchema.parse(data);

  const existing = await prisma.fakeCompany.findFirst();
  if (existing)
    throw new Error("კომპანია უკვე არსებობს, შეგიძლიათ მხოლოდ შეცვლა");

  return await prisma.fakeCompany.create({
    data: validated,
  });
};

// UPDATE FAKE COMPANY
export const updateFakeCompany = async (
  id: string,
  data: z.infer<typeof fakeCompanySchema>
) => {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) throw new Error("საჭიროა ავტორიზაცია");
  if (session.user.userType !== UserType.ADMIN)
    throw new Error("უნდა იყოთ ადმინისტრატორი");

  const validated = fakeCompanySchema.parse(data);

  return await prisma.fakeCompany.update({
    where: { id },
    data: validated,
  });
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

  const { name, phone, email, isInsuranceCompany, driversAssignable } = data;

  if (!name || !phone || !email || isInsuranceCompany === undefined) {
    throw new Error("არ არის სრული ინფორმაცია");
  }

  // Check if company with same name, email or phone already exists
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

  // If the company is an insurance company, ensure drivers are provided before creating any companies
  if (
    isInsuranceCompany &&
    (!driversAssignable || driversAssignable.length === 0)
  ) {
    throw new Error("აირჩიეთ დაზღვევის მძღოლები");
  }

  console.log("data - addRealCompany:", data);

  // Create the real company first
  const realCompany = await prisma.realCompany.create({
    data: {
      name,
      email,
      phone,
      isInsuranceCompany,
    },
  });

  // If it's an insurance company, create the company and assign drivers
  if (isInsuranceCompany) {
    const company = await prisma.company.create({
      data: {
        name,
        realCompanyId: realCompany.id,
      },
    });

    await prisma.assignableDrivers.createMany({
      data: driversAssignable!.map((driverId) => ({
        companyId: company.id,
        driverId: driverId,
      })),
      skipDuplicates: true,
    });
  }

  return realCompany;
};

// const result = await prisma.$transaction(async (prisma) => {
//   // Create the RealCompany first
//   const realCompany = await prisma.realCompany.create({
//     data: {
//       name,
//       email,
//       phone,
//       isInsuranceCompany,
//     },
//   });

//   // Create the Company
//   const company = await prisma.company.create({
//     data: {
//       name,
//       realCompanyId: realCompany.id,
//     },
//   });

//   // If it's an insurance company and drivers are selected
//   if (
//     isInsuranceCompany === true &&
//     driversAssignable &&
//     driversAssignable.length > 0
//   ) {
//     // Create AssignableDrivers records
//     await prisma.assignableDrivers.createMany({
//       data: driversAssignable.map((driverId) => ({
//         companyId: company.id,
//         driverId: driverId,
//       })),
//       // This prevents duplicate entries
//       skipDuplicates: true,
//     });
//   }

//   return realCompany;
// });

// return result;

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

  const { name, phone, email, isInsuranceCompany, driversAssignable } = data;
  if (!name || !phone || !email || isInsuranceCompany === undefined) {
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

  const updatedCompany = await prisma.realCompany.update({
    where: { id: realCompanyId },
    data: {
      name,
      phone,
      email,
      isInsuranceCompany,
    },
  });

  const associatedCompany = await prisma.company.findFirst({
    where: {
      realCompanyId: realCompanyId,
    },
  });

  if (isInsuranceCompany === true && associatedCompany) {
    // Remove existing assignable drivers
    await prisma.assignableDrivers.deleteMany({
      where: { companyId: associatedCompany.id },
    });

    // Add new assignable drivers if any
    if (driversAssignable && driversAssignable.length > 0) {
      await prisma.assignableDrivers.createMany({
        data: driversAssignable.map((driverId) => ({
          companyId: associatedCompany.id,
          driverId: driverId,
        })),
        skipDuplicates: true,
      });
    }
  }

  return updatedCompany;

  // const result = await prisma.$transaction(async (prisma) => {
  //   // Update RealCompany
  //   const updatedRealCompany = await prisma.realCompany.update({
  //     where: { id: realCompanyId },
  //     data: {
  //       name,
  //       phone,
  //       email,
  //       isInsuranceCompany,
  //     },
  //   });

  //   // Find associated Company
  //   const associatedCompany = await prisma.company.findFirst({
  //     where: { name: name },
  //   });

  //   console.log("associated company", associatedCompany);

  //   // If it's an insurance company, manage assignable drivers
  //   if (isInsuranceCompany === true && associatedCompany) {
  //     // Remove existing assignable drivers
  //     await prisma.assignableDrivers.deleteMany({
  //       where: { companyId: associatedCompany.id },
  //     });

  //     // Add new assignable drivers if any
  //     if (driversAssignable && driversAssignable.length > 0) {
  //       await prisma.assignableDrivers.createMany({
  //         data: driversAssignable.map((driverId) => ({
  //           companyId: associatedCompany.id,
  //           driverId: driverId,
  //         })),
  //         skipDuplicates: true,
  //       });
  //     }
  //   }

  //   return updatedRealCompany;
  // });

  // return result;
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

  const result = await prisma.$transaction(async (prisma) => {
    // Find the RealCompany
    const realCompany = await prisma.realCompany.findUnique({
      where: { id: realCompanyId },
    });

    if (!realCompany) {
      throw new Error("ასეთი კომპანია არ მოიძებნა");
    }

    // Find associated Company
    const associatedCompany = await prisma.company.findFirst({
      where: { realCompanyId: realCompanyId },
    });

    // If associated company exists, remove its assignable drivers first
    if (associatedCompany) {
      await prisma.assignableDrivers.deleteMany({
        where: { companyId: associatedCompany.id },
      });

      // Delete the associated Company
      await prisma.company.delete({
        where: { id: associatedCompany.id },
      });
    }

    // Delete the RealCompany
    await prisma.realCompany.delete({
      where: { id: realCompanyId },
    });

    return { message: "კომპანია წარმატებით წაიშალა" };
  });

  return result;
};

export const getInsuranceDrivers = async () => {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    throw new Error("საჭიროა ავტორიზაცია");
  }

  if (session.user.userType !== UserType.ADMIN) {
    throw new Error("უნდა იყოთ ადმინისტრატორი");
  }

  return await prisma.driver.findMany();
};

export const getCompanyAssignableDrivers = async (realCompanyId: string) => {
  console.log("Company id from server", realCompanyId);

  // Get the session
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    throw new Error("საჭიროა ავტორიზაცია");
  }

  // Fetch company based on realCompanyId
  const company = await prisma.company.findFirst({
    where: {
      realCompanyId: realCompanyId,
    },
  });

  if (!company) throw new Error("კომპანია ვერ მოიძებნა");

  // Fetch assignable drivers for the company
  const assignableDrivers = await prisma.assignableDrivers.findMany({
    where: {
      companyId: company.id,
    },
    include: {
      driver: true, // Include driver details (name, lastName, etc.)
    },
  });

  console.log("assignableDrivers from server", assignableDrivers);

  // Map the data into react-select format
  const reactSelectOptions = assignableDrivers.map((assignableDriver) => {
    return {
      value: assignableDriver.driverId, // Unique identifier
      label: `${assignableDriver.driver.name} ${assignableDriver.driver.lastName}`, // Driver full name
    };
  });

  console.log("reactSelectOptions", reactSelectOptions);

  return reactSelectOptions;
};
