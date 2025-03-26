"use client";

import { ReactNode, useState } from "react";
import {
  ColumnDef,
  ColumnFiltersState,
  SortingState,
  VisibilityState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { ChevronDown, MoreHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import { Prisma } from "@prisma/client";

export type Load = Prisma.LoadGetPayload<{
  include: {
    dispatcher: true;
    driver: true;
    company: true;
  };
}>;

export const columns: ColumnDef<Load>[] = [
  {
    id: "select",
    header: ({ table }) => (
      <Checkbox
        checked={
          table.getIsAllPageRowsSelected() ||
          (table.getIsSomePageRowsSelected() && "indeterminate")
        }
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="ყველას მონიშვნა"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Select row"
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "vin",
    header: "VIN",
    cell: ({ row }) => <div className="font-medium">{row.getValue("vin")}</div>,
  },
  {
    accessorKey: "company.name",
    header: "კომპანია",
    cell: ({ row }) => <div>{row.original.company?.name}</div>,
  },
  {
    accessorKey: "price",
    header: "თანხა",
    cell: ({ row }) => {
      const price = parseFloat(row.getValue("price"));
      const formatted = new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD",
      }).format(price);

      return <div className="text-right font-medium">{formatted}</div>;
    },
  },
  {
    accessorKey: "paymentType",
    header: "გადახდის ტიპი",
    cell: ({ row }) => {
      const paymentType = row.getValue("paymentType") as string;

      const paymentMap: Record<string, string> = {
        CASH: "ქეში",
        DAYS_2: "2 დღე",
        DAYS_3: "3 დღე",
        DAYS_5: "5 დღე",
        DAYS_15: "15 დღე",
        DAYS_20: "20 დღე",
        DAYS_30: "30 დღე",
        SUPERPAY: "SuperPay",
      };

      return (
        <Badge variant="outline">
          {paymentMap[paymentType] || paymentType}
        </Badge>
      );
    },
  },
  {
    accessorKey: "isPaymentReceived",
    header: "გადახდის სტატუსი",
    cell: ({ row }) => {
      const isReceived = row.getValue("isPaymentReceived") as boolean;

      return <Badge>{isReceived ? "გადახდილი" : "გადაუხდელი"}</Badge>;
    },
  },
  {
    accessorKey: "pickupAddress",
    header: "აყვანის მისამართი",
  },
  {
    accessorKey: "deliveryAddress",
    header: "ჩაბარების მისამართი",
  },
  {
    accessorKey: "pickupDate",
    header: "აყვანის თარიღი",
    cell: ({ row }) => {
      const date = row.getValue("pickupDate") as Date;
      if (!date) return "";
      return format(date, "MMM dd, yyyy");
    },
  },
  {
    accessorKey: "deliveryDate",
    header: "ჩაბარების თარიღი",
    cell: ({ row }) => {
      const date = row.getValue("deliveryDate") as Date;
      if (!date) return "Not scheduled";
      return format(date, "MMM dd, yyyy");
    },
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const load = row.original;

      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">მენიუ</span>
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>მოქმედებები</DropdownMenuLabel>
            <DropdownMenuItem
              onClick={() => navigator.clipboard.writeText(load.id)}
            >
              კოპირება
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem>ტვირთის დეტალები</DropdownMenuItem>
            <DropdownMenuItem>ტვირთის რედაქტირება</DropdownMenuItem>
            <DropdownMenuItem>გადახდილად მონიშვნა</DropdownMenuItem>
            <DropdownMenuItem className="text-red-600">წაშლა</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];

export function LoadsDataTable({ data }: { data: Load[] }) {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = useState({});

  const table = useReactTable({
    data,
    columns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
    },
  });

  return (
    <div className="w-full">
      <div className="flex items-center py-4 justify-between">
        <Input
          placeholder="ვინ კოდით ძებნა..."
          value={(table.getColumn("vin")?.getFilterValue() as string) ?? ""}
          onChange={(event) =>
            table.getColumn("vin")?.setFilterValue(event.target.value)
          }
          className="max-w-sm"
        />
        <div className="flex items-center gap-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline">
                გადახდის სტატუსი <ChevronDown className="ml-2 h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem
                onClick={() =>
                  table.getColumn("isPaymentReceived")?.setFilterValue(true)
                }
              >
                გადახდილი
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() =>
                  table.getColumn("isPaymentReceived")?.setFilterValue(false)
                }
              >
                გადაუხდელი
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() =>
                  table
                    .getColumn("isPaymentReceived")
                    ?.setFilterValue(undefined)
                }
              >
                ყველა
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline">
                მონაცემები <ChevronDown className="ml-2 h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              {table
                .getAllColumns()
                .filter((column) => column.getCanHide())
                .map((column) => {
                  return (
                    <DropdownMenuCheckboxItem
                      key={column.id}
                      className="capitalize"
                      checked={column.getIsVisible()}
                      onCheckedChange={(value) =>
                        column.toggleVisibility(!!value)
                      }
                    >
                      {(column.columnDef.header as ReactNode) || ""}
                    </DropdownMenuCheckboxItem>
                  );
                })}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id}>
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                    </TableHead>
                  );
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  არ გაქვთ ტვირთები
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <div className="flex items-center justify-end space-x-2 py-4">
        <div className="flex-1 text-sm text-muted-foreground">
          {table.getFilteredSelectedRowModel().rows.length} of{" "}
          {table.getFilteredRowModel().rows.length} რიგი(ები) არჩეული.
        </div>
        <div className="space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
          >
            წინა
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
          >
            შემდეგი
          </Button>
        </div>
      </div>
    </div>
  );
}
