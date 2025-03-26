import { TableCell, TableRow } from "@/components/ui/table";
import { SPOTS_PER_COMPANY } from "@/utils/constants";
import { DriverSelect } from "./DriverSelect";
import { Company, Driver } from "@/utils/types";

interface CompanyRowProps {
  company: Company;
  drivers: Driver[];
  freeDrivers: Driver[];
  onDriverChange: (value: string) => Promise<void>;
  isLoading: boolean;
}

export const CompanyRow: React.FC<CompanyRowProps> = ({
  company,
  drivers,
  freeDrivers,
  onDriverChange,
  isLoading,
}) => {
  // const getAvailableDrivers = (companyDriverIds: string[]) =>
  //   drivers.filter((driver) => !companyDriverIds.includes(driver.id));

  const assignableDriverIds = company.possibleDrivers.map((ad) => ad.driverId);

  const getAvailableDrivers = (companyDriverIds: string[]) =>
    drivers.filter(
      (driver) =>
        assignableDriverIds.includes(driver.id) &&
        !companyDriverIds.includes(driver.id)
    );

  return (
    <TableRow>
      <TableCell>{company.name}</TableCell>
      {[...Array(SPOTS_PER_COMPANY)].map((_, spotIndex) => {
        const assignedDriver = company.drivers.find(
          (d) => d.spot === spotIndex
        );
        const currentDriver = assignedDriver
          ? drivers.find((d) => d.id === assignedDriver.driverId)
          : null;
        const companyDriverIds = company.drivers.map((d) => d.driverId);
        const availableDrivers = getAvailableDrivers(companyDriverIds);
        const superId = assignedDriver?.superId;

        return (
          <TableCell key={spotIndex}>
            <div className="text-sm font-medium text-gray-500 mb-1">
              {superId}
            </div>{" "}
            {/* Display superId above DriverSelect */}
            <DriverSelect
              currentDriver={currentDriver || null}
              company={company}
              spotIndex={spotIndex}
              availableDrivers={availableDrivers}
              freeDrivers={freeDrivers}
              onDriverChange={onDriverChange}
              isLoading={isLoading}
            />
          </TableCell>
        );
      })}
    </TableRow>
  );
};
