import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Company, Driver } from "@/utils/types";

interface DriverSelectProps {
  currentDriver?: Driver | null;
  company: Company;
  spotIndex: number;
  availableDrivers: Driver[];
  freeDrivers: Driver[];
  onDriverChange: (value: string) => Promise<void>;
  isLoading?: boolean;
}

export const DriverSelect: React.FC<DriverSelectProps> = ({
  currentDriver,
  company,
  spotIndex,
  availableDrivers,
  freeDrivers,
  onDriverChange,
  isLoading,
}) => {
  const currentValue = currentDriver
    ? `${currentDriver.id}:${company.id}:${spotIndex}:change`
    : `${undefined}:${company.id}:${spotIndex}:remove`;

  return (
    <Select
      value={currentValue}
      onValueChange={onDriverChange}
      disabled={isLoading}
    >
      <SelectTrigger>
        <SelectValue placeholder={currentDriver?.name || "თავისუფალი"}>
          {currentDriver?.name || "თავისუფალი"}
        </SelectValue>
      </SelectTrigger>
      <SelectContent>
        <SelectItem value={`${undefined}:${company.id}:${spotIndex}:remove`}>
          თავისუფალი
        </SelectItem>
        {availableDrivers.map((driver) => (
          <SelectItem
            key={driver.id}
            value={`${driver.id}:${company.id}:${spotIndex}:change`}
          >
            {driver.name}
            {freeDrivers.includes(driver)}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
};
