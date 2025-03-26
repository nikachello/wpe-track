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
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState } from "react";

export const DriversTable: React.FC = () => {
  const {
    drivers,
    driversLoading,
    companies,
    companiesLoading,
    assignDriverMutation,
    removeDriverMutation,
    relations,
  } = useDriversCompanies();

  const { getFreeDrivers } = useDriverManagement(drivers, companies);

  const [dialogOpen, setDialogOpen] = useState(false);
  const [superId, setSuperId] = useState("");
  const [pendingChange, setPendingChange] = useState<{
    driverId: string;
    companyId: string;
    spot: number;
  } | null>(null);

  console.log("Relations:", relations);

  const handleChange = async (value: string) => {
    const [driverId, companyId, spot, action] = value.split(":");

    if (action === "remove") {
      try {
        await removeDriverMutation.mutateAsync({
          companyId,
          spot: parseInt(spot),
        });
        toast.success("მძღოლი წარმატებით წაიშალა");
      } catch (error) {
        console.error("მძღოლის შეცვლისას პრობლემაა:", error);
        const errorMessage =
          error instanceof Error ? error.message : "დაფიქსირდა უცნობი შეცდომა";
        toast.error("არ ხართ მენეჯერი ან არ გაქვთ საკმარისი უფლება");
      }
      return;
    }

    if (action === "change") {
      setPendingChange({ driverId, companyId, spot: parseInt(spot) });
      setDialogOpen(true);
    }
  };

  const handleConfirmChange = async () => {
    if (!superId.trim()) {
      toast.error("გთხოვთ შეიყვანოთ Load ID");
      return;
    }

    if (pendingChange) {
      try {
        await assignDriverMutation.mutateAsync({
          driverId: pendingChange.driverId,
          companyId: pendingChange.companyId,
          spot: pendingChange.spot,
          superId, // Include Load ID in mutation
        });
        toast.success("მძღოლი წარმატებით შეიცვალა");
        setDialogOpen(false);
        setSuperId("");
        setPendingChange(null);
      } catch (error) {
        console.error("მძღოლის შეცვლისას პრობლემაა:", error);
        toast.error(
          error instanceof Error
            ? "არ ხართ მენეჯერი ან არ გაქვთ საკმარისი უფლება"
            : "დაფიქსირდა უცნობი შეცდომა"
        );
      }
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

      {/* Dialog for Load ID Input */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Load ID შეყვანა</DialogTitle>
          </DialogHeader>
          <Input
            type="text"
            placeholder="შეიყვანეთ Load ID"
            value={superId}
            onChange={(e) => setSuperId(e.target.value)}
          />
          <DialogFooter>
            <Button onClick={() => setDialogOpen(false)} variant="outline">
              გაუქმება
            </Button>
            <Button onClick={handleConfirmChange} disabled={!superId.trim()}>
              დადასტურება
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};
