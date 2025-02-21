"use client";
import React from "react";

import { toast } from "sonner";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectTrigger,
  SelectValue,
  SelectItem,
} from "../../ui/select";
import { useDriversCompanies } from "@/hooks/useDriversCompanies";
import { SPOTS_PER_COMPANY } from "@/utils/constants";

const DriversTable = () => {
  const {
    drivers,
    driversLoading,
    companies,
    companiesLoading,
    assignDriverMutation,
    removeDriverMutation,
  } = useDriversCompanies();

  const handleChange = async (value: string) => {
    const [driverId, companyId, spot, action] = value.split(":");

    try {
      if (action === "remove") {
        await removeDriverMutation.mutateAsync({
          companyId,
          spot: parseInt(spot),
        });
      } else if (action === "change") {
        await assignDriverMutation.mutateAsync({
          driverId,
          companyId,
          spot: parseInt(spot),
        });
      }
    } catch (error) {
      toast("შეცდომა!");
    } finally {
      toast("მძღოლი წარმატებით შეიცვალა");
    }
  };

  // Get all assigned driver IDs across all companies
  const allAssignedDriverIds = companies.flatMap((company) =>
    company.drivers.map((d) => d.driverId)
  );

  // Get free drivers (those not assigned to any company)
  const freeDrivers = drivers.filter(
    (driver) => !allAssignedDriverIds.includes(driver.id)
  );

  if (driversLoading || companiesLoading) return <div>იტვირთება...</div>;
  if (!drivers.length || !companies.length)
    return <div>მონაცემები არ არის</div>;

  return (
    <div className="space-y-6">
      <Table>
        <TableCaption>მძღოლების და კომპანიების სია</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead>კომპანია</TableHead>
            {[...Array(SPOTS_PER_COMPANY)].map((_, index) => (
              <TableHead key={index}>მძღოლი {index + 1}</TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {companies.map((company) => (
            <TableRow key={company.id}>
              <TableCell>{company.name}</TableCell>
              {[...Array(SPOTS_PER_COMPANY)].map((_, spotIndex) => {
                const assignedDriver = company.drivers.find(
                  (d) => d.spot === spotIndex
                );

                const currentDriver = assignedDriver
                  ? drivers.find((d) => d.id === assignedDriver.driverId)
                  : null;

                // მძროლები რომლებიც მიმაგრებულები არიან კომპანიას
                const companyDriverIds = company.drivers.map((d) => d.driverId);

                // ყველა თავისუფალი მძღოლი კონკრეტული კომპანიისთვის
                const availableDrivers = drivers.filter(
                  (driver) => !companyDriverIds.includes(driver.id)
                );

                // გავიგოთ რა უნდა ეწეროს ლეიბლად
                const currentValue = currentDriver
                  ? `${currentDriver.id}:${company.id}:${spotIndex}:change`
                  : `${undefined}:${company.id}:${spotIndex}:remove`;

                return (
                  <TableCell key={spotIndex}>
                    <Select value={currentValue} onValueChange={handleChange}>
                      <SelectTrigger>
                        <SelectValue
                          placeholder={currentDriver?.name || "თავისუფალი"}
                        >
                          {currentDriver?.name || "თავისუფალი"}
                        </SelectValue>
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem
                          value={`${undefined}:${company.id}:${spotIndex}:remove`}
                        >
                          თავისუფალი
                        </SelectItem>

                        {availableDrivers.map((driver) => (
                          <SelectItem
                            key={driver.id}
                            value={`${driver.id}:${company.id}:${spotIndex}:change`}
                          >
                            {driver.name}
                            {freeDrivers.includes(driver) ? "" : ""}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </TableCell>
                );
              })}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default DriversTable;
