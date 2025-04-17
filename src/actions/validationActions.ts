"use server";
export async function validateCompanyId(companyId: string) {
  if (!companyId || typeof companyId !== "string" || companyId.trim() === "") {
    throw new Error("კომპანია არ იძებნება");
  }
}

export async function validateSpot(spot: number) {
  if (typeof spot !== "number" || spot < 0) {
    throw new Error("არასწორი მონაცემი");
  }
}

export async function validateSuperId(superId: string) {
  if (
    typeof superId !== "string" ||
    superId === null ||
    superId === undefined
  ) {
    throw new Error("შეიყვანეთ სუპერის ID");
  }
}
