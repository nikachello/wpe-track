import { TableCell, TableRow } from "@/components/ui/table";
import { SPOTS_PER_COMPANY } from "@/utils/constants";
import { DriverSelect } from "./DriverSelect";

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
  const getAvailableDrivers = (companyDriverIds: string[]) =>
    drivers.filter((driver) => !companyDriverIds.includes(driver.id));

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

        return (
          <TableCell key={spotIndex}>
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
