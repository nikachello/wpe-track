"use client";
import React from "react";
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
import { getRealCompanies } from "@/actions/admin-actions";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { TableSkeleton } from "@/components/global/drivers-table/TableSkeleton";

type Props = {};

const Page = (props: Props) => {
  const { isPending, error, data, isFetching } = useQuery({
    queryKey: ["real-companies"],
    queryFn: getRealCompanies,
  });

  if (isPending) return <TableSkeleton />;
  if (error) return "დაფიქსირდა შეცდომა, სცადეთ ახლიდან";

  return (
    <div className="flex flex-col gap-10">
      <Table className="w-fit m-auto">
        <TableCaption>კომპანიების სია</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead>სახელი</TableHead>
            <TableHead>ნომერი</TableHead>
            <TableHead>მეილი</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.map((company) => (
            <TableRow key={company.id}>
              <TableCell>{company.name}</TableCell>
              <TableCell>{company.phone}</TableCell>
              <TableCell>{company.email}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <div className="m-auto">
        <AddRealCompanyDrawer />
      </div>
    </div>
  );
};

export default Page;
