"use client";
import React, { useState } from "react";
import AddRealCompanyDrawer from "@/components/global/admin/AddRealCompanyDrawer";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { deleteRealCompany, getRealCompanies } from "@/actions/admin-actions";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { TableSkeleton } from "@/components/global/drivers-table/TableSkeleton";
import { Button } from "@/components/ui/button";
import { Loader, Pencil, X } from "lucide-react";
import { toast } from "sonner";
import {
  CompanyProvider,
  useCompanyContext,
} from "@/context/RealCompanyContext";
import { Badge } from "@/components/ui/badge";

const CompaniesTable = () => {
  const queryClient = useQueryClient();
  const [loadingId, setLoadingId] = useState<string | null>(null);
  const { setDrawerOpen, setEditData } = useCompanyContext();

  const { isPending, error, data } = useQuery({
    queryKey: ["real-companies"],
    queryFn: getRealCompanies,
  });

  const mutation = useMutation({
    mutationFn: deleteRealCompany,
    onMutate: (id: string) => {
      setLoadingId(id); // Set loading state for this specific row
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["real-companies"] });
      toast.success("კომპანია წაიშალა წარმატებით");
    },
    onError: (error) => {
      if (error instanceof Error) {
        toast.error(error.message);
      }
    },
    onSettled: () => {
      setLoadingId(null);
    },
  });

  if (isPending) {
    return <TableSkeleton />;
  }

  if (error) {
    return (
      <p className="text-red-500 text-center">
        დაფიქსირდა შეცდომა, სცადეთ ახლიდან
      </p>
    );
  }

  return (
    <>
      <Table className="w-fit m-auto">
        <TableCaption>კომპანიების სია</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead>სახელი</TableHead>
            <TableHead>ნომერი</TableHead>
            <TableHead>მეილი</TableHead>
            <TableHead>დაზღვევა</TableHead>
            <TableHead>მოქმედება</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data?.map((company) => (
            <TableRow className="text-center" key={company.id}>
              <TableCell>{company.name}</TableCell>
              <TableCell>{company.phone}</TableCell>
              <TableCell>{company.email}</TableCell>
              <TableCell>
                {company.isInsuranceCompany ? (
                  <Badge variant="destructive">კი</Badge>
                ) : (
                  <Badge variant="default">არა</Badge>
                )}
              </TableCell>
              <TableCell>
                <Button
                  disabled={loadingId === company.id}
                  onClick={() => mutation.mutate(company.id)}
                  variant="ghost"
                >
                  {loadingId === company.id ? (
                    <Loader className="animate-spin" />
                  ) : (
                    <X />
                  )}
                </Button>
                <Button
                  disabled={loadingId === company.id}
                  onClick={() => {
                    setEditData({
                      id: company.id,
                      email: company.email,
                      phone: company.phone,
                      name: company.name,
                      isInsuranceCompany: company.isInsuranceCompany,
                    });
                    setDrawerOpen(true);
                  }}
                  variant="ghost"
                >
                  <Pencil />
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <div className="m-auto">
        <Button
          variant="outline"
          onClick={() => {
            setEditData(null);
            setDrawerOpen(true);
          }}
        >
          კომპანიის დამატება
        </Button>
      </div>
    </>
  );
};

const Page = () => {
  return (
    <CompanyProvider>
      <div className="flex flex-col gap-10">
        <CompaniesTable />
        <AddRealCompanyDrawer />
      </div>
    </CompanyProvider>
  );
};

export default Page;
