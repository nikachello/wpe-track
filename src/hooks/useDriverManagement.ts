import { Company, Driver } from "@/utils/types";

export const useDriverManagement = (
  drivers: Driver[],
  companies: Company[]
) => {
  const getAllAssignedDriverIds = () =>
    companies.flatMap((company) => company.drivers.map((d) => d.driverId));

  const getFreeDrivers = () =>
    drivers.filter((driver) => !getAllAssignedDriverIds().includes(driver.id));

  return {
    getFreeDrivers,
  };
};
