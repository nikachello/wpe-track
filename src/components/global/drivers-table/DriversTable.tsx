"use client";
import {
  Table,
  TableBody,
  TableCaption,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useDriverManagement } from "@/hooks/useDriverManagement";
import { useDriversCompanies } from "@/hooks/useDriversCompanies";
import { SPOTS_PER_COMPANY } from "@/utils/constants";
import { toast } from "sonner";
import { CompanyRow } from "./CompanyRow";
import { TableSkeleton } from "./TableSkeleton";

export const DriversTable: React.FC = () => {
  const {
    drivers,
    driversLoading,
    companies,
    companiesLoading,
    assignDriverMutation,
    removeDriverMutation,
  } = useDriversCompanies();

  const { getFreeDrivers } = useDriverManagement(drivers, companies);

  const handleChange = async (value: string) => {
    const [driverId, companyId, spot, action] = value.split(":");

    try {
      if (action === "remove") {
        await removeDriverMutation.mutateAsync({
          companyId,
          spot: parseInt(spot),
        });
        toast.success("მძღოლი წარმატებით წაიშალა");
      } else if (action === "change") {
        await assignDriverMutation.mutateAsync({
          driverId,
          companyId,
          spot: parseInt(spot),
        });
        toast.success("მძღოლი წარმატებით შეიცვალა");
      }
    } catch (error) {
      console.error("Error updating driver assignment:", error);
      toast.error("შეცდომა მოხდა!");
    }
  };

  if (driversLoading || companiesLoading) {
    return (
      <div className="space-y-6">
        <TableSkeleton />
      </div>
    );
  }

  if (!drivers.length || !companies.length) {
    return <div className="text-center py-4">მონაცემები არ არის</div>;
  }

  const freeDrivers = getFreeDrivers();
  const isLoading =
    assignDriverMutation.isPending || removeDriverMutation.isPending;

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
            <CompanyRow
              key={company.id}
              company={company}
              drivers={drivers}
              freeDrivers={freeDrivers}
              onDriverChange={handleChange}
              isLoading={isLoading}
            />
          ))}
        </TableBody>
      </Table>
    </div>
  );
};
